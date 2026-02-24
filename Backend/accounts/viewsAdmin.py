from django.http import JsonResponse


# ================== HEALTH CHECK ==================
def wake_up(request):
    return JsonResponse({"status": "backend awake"})