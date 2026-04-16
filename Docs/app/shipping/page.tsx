import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ArrowRightLeft, Clock3, Gift, Package, Truck } from "lucide-react"

export const metadata = {
  title: "Shipping and Exchange Policy | SS Supplements",
  description:
    "Read the SS Supplements shipping and exchange policy for dispatch timelines, delivery estimates, shipping charges, and defective-item exchanges.",
}

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <section className="bg-gradient-to-r from-primary to-accent py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold text-white md:text-5xl">Shipping and Exchange Policy</h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-white/85 md:text-xl">
              Clear dispatch, delivery, and exchange information for orders shipped across India.
            </p>
          </div>
        </section>

        <section className="bg-secondary/30 py-12">
          <div className="container mx-auto px-4">
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border border-border bg-card p-6 text-center">
                <Truck className="mx-auto h-6 w-6 text-primary" />
                <h3 className="mt-3 font-semibold text-foreground">Dispatch</h3>
                <p className="mt-2 text-sm text-muted-foreground">Usually within 24-48 business hours</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-6 text-center">
                <Clock3 className="mx-auto h-6 w-6 text-primary" />
                <h3 className="mt-3 font-semibold text-foreground">Delivery</h3>
                <p className="mt-2 text-sm text-muted-foreground">Standard delivery in 3-7 business days</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-6 text-center">
                <Gift className="mx-auto h-6 w-6 text-primary" />
                <h3 className="mt-3 font-semibold text-foreground">Free Shipping</h3>
                <p className="mt-2 text-sm text-muted-foreground">Available on orders above Rs. 999</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-6 text-center">
                <Package className="mx-auto h-6 w-6 text-primary" />
                <h3 className="mt-3 font-semibold text-foreground">Packaging</h3>
                <p className="mt-2 text-sm text-muted-foreground">Secure, sealed, and tamper-aware packing</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl space-y-10">
              <p className="text-sm leading-relaxed text-muted-foreground">
                <strong className="text-foreground">Effective Date:</strong> April 12, 2026
              </p>

              <div>
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Truck className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">1. Shipping Coverage</h2>
                </div>
                <ul className="ml-2 list-disc space-y-2 pl-4 text-muted-foreground">
                  <li>SS Supplements currently ships across serviceable pin codes within India.</li>
                  <li>Orders are shipped through third-party courier partners selected based on serviceability and delivery efficiency.</li>
                  <li>We may be unable to serve certain remote or restricted locations at particular times.</li>
                </ul>
              </div>

              <div>
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Clock3 className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">2. Dispatch and Delivery Timelines</h2>
                </div>
                <ul className="ml-2 list-disc space-y-2 pl-4 text-muted-foreground">
                  <li>Most prepaid orders are processed and dispatched within 24-48 business hours after confirmation.</li>
                  <li>Standard delivery usually takes 3-7 business days depending on the destination, courier network, and local conditions.</li>
                  <li>Orders placed on Sundays, public holidays, or outside operating hours may be processed on the next business day.</li>
                  <li>Unexpected delays caused by weather, transport disruptions, public restrictions, or courier issues may extend delivery timelines.</li>
                </ul>
              </div>

              <div>
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Gift className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">3. Shipping Charges</h2>
                </div>
                <ul className="ml-2 list-disc space-y-2 pl-4 text-muted-foreground">
                  <li>Free shipping is available on orders above Rs. 999 unless otherwise Free during a special promotion.</li>
                  <li>Orders below the free-shipping threshold may attract a delivery charge, which will be shown at checkout before payment.</li>
                  <li>Any additional charges for remote-area delivery, reattempted delivery, or address correction may be communicated where applicable.</li>
                </ul>
              </div>

              <div>
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Package className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">4. Delivery and Acceptance</h2>
                </div>
                <ul className="ml-2 list-disc space-y-2 pl-4 text-muted-foreground">
                  <li>Please ensure that your shipping address, phone number, and pin code are correct at checkout.</li>
                  <li>Customers are advised to inspect the outer package at the time of delivery and record an unboxing video when opening the parcel.</li>
                  <li>If the package appears tampered with, damaged, or incomplete, please refuse delivery where possible and contact us immediately.</li>
                </ul>
              </div>

              <div>
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <ArrowRightLeft className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">5. Exchange for Defective or Wrong Items</h2>
                </div>
                <ul className="ml-2 list-disc space-y-2 pl-4 text-muted-foreground">
                  <li>Exchanges are available only if you receive a defective, damaged, tampered, expired, or wrong product.</li>
                  <li>You must report the issue within 48 hours of delivery with your order number, clear photos, and an unboxing video.</li>
                  <li>The product must remain unused, sealed where applicable, and returned with the original box, label, invoice, and all accessories or freebies received with the order.</li>
                  <li>After verification, we may offer a replacement of the same item, a similar item of equal value where mutually agreed, or a refund if exchange is not possible.</li>
                </ul>
              </div>

              <div>
                <h2 className="mb-4 text-2xl font-bold text-foreground">6. Non-Exchange Cases</h2>
                <ul className="ml-2 list-disc space-y-2 pl-4 text-muted-foreground">
                  <li>Opened, consumed, or intentionally damaged products are not eligible for exchange.</li>
                  <li>Minor packaging variations from manufacturer updates are not treated as defects if the item is genuine and within shelf life.</li>
                  <li>Exchange requests may be declined if evidence is incomplete, delayed, or inconsistent with the condition reported.</li>
                </ul>
              </div>

              <div className="rounded-xl border border-border bg-secondary/50 p-6">
                <h2 className="mb-3 text-xl font-bold text-foreground">Need Help with Shipping?</h2>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  For shipping, delivery, or exchange support, contact SS Supplements at
                  <a href="mailto:info.sssupplements@gmail.com" className="ml-1 text-primary hover:underline">
                    info.sssupplements@gmail.com
                  </a>
                  <span> or +91 95478 99170 and share your order number for faster assistance.</span>
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
