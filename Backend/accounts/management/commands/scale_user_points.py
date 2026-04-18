import math

from django.core.management.base import BaseCommand

from accounts.db import get_users_collection


class Command(BaseCommand):
    help = "Scale MongoDB user points to a percentage of their current value."

    def add_arguments(self, parser):
        parser.add_argument(
            "--percent",
            type=float,
            default=20.0,
            help="Target percentage of current points to keep. Default: 20",
        )
        parser.add_argument(
            "--apply",
            action="store_true",
            help="Persist the changes. Without this flag the command is a dry run.",
        )

    def handle(self, *args, **options):
        percent = options["percent"]
        should_apply = options["apply"]

        if percent < 0:
            self.stderr.write(self.style.ERROR("Percent must be non-negative."))
            return

        factor = percent / 100
        users_collection = get_users_collection()
        users = list(users_collection.find({}, {"points": 1}))

        if not users:
            self.stdout.write(self.style.WARNING("No users found."))
            return

        updated_rows = []
        total_before = 0
        total_after = 0

        for user in users:
            current_points = max(int(user.get("points", 0) or 0), 0)
            scaled_points = math.floor(current_points * factor)
            total_before += current_points
            total_after += scaled_points
            updated_rows.append((user["_id"], current_points, scaled_points))

        changed_rows = [row for row in updated_rows if row[1] != row[2]]

        self.stdout.write(
            f"Users scanned: {len(updated_rows)} | Users changed: {len(changed_rows)}"
        )
        self.stdout.write(
            f"Total points: {total_before} -> {total_after} at {percent}%"
        )

        preview_count = min(10, len(changed_rows))
        for user_id, before, after in changed_rows[:preview_count]:
            self.stdout.write(f"{user_id}: {before} -> {after}")

        if not should_apply:
            self.stdout.write(
                self.style.WARNING("Dry run only. Re-run with --apply to save changes.")
            )
            return

        for user_id, _, scaled_points in changed_rows:
            users_collection.update_one({"_id": user_id}, {"$set": {"points": scaled_points}})

        self.stdout.write(self.style.SUCCESS("User points updated successfully."))
