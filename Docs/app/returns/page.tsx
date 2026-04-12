import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Ban, CircleDollarSign, PackageCheck, RefreshCcw } from "lucide-react"

export const metadata = {
  title: "Cancellation and Refund Policy | SS Supplements",
  description:
    "Read the cancellation and refund policy for SS Supplements, including dispatch-stage cancellations, damaged-item claims, and Razorpay refund timelines.",
}

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <section className="bg-gradient-to-r from-primary to-accent py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold text-white md:text-5xl">Cancellation and Refund Policy</h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-white/85 md:text-xl">
              Please read this policy carefully before placing your order for supplements, accessories, or nutrition
              products from SS Supplements.
            </p>
          </div>
        </section>

        <section className="bg-secondary/30 py-12">
          <div className="container mx-auto px-4">
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border border-border bg-card p-6 text-center">
                <RefreshCcw className="mx-auto h-6 w-6 text-primary" />
                <h3 className="mt-3 font-semibold text-foreground">Easy Cancellation</h3>
                <p className="mt-2 text-sm text-muted-foreground">Allowed before dispatch confirmation</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-6 text-center">
                <PackageCheck className="mx-auto h-6 w-6 text-primary" />
                <h3 className="mt-3 font-semibold text-foreground">Evidence Required</h3>
                <p className="mt-2 text-sm text-muted-foreground">Please keep an unboxing video for issue claims</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-6 text-center">
                <CircleDollarSign className="mx-auto h-6 w-6 text-primary" />
                <h3 className="mt-3 font-semibold text-foreground">Razorpay Refunds</h3>
                <p className="mt-2 text-sm text-muted-foreground">Usually reflected in 5-7 business days</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-6 text-center">
                <Ban className="mx-auto h-6 w-6 text-primary" />
                <h3 className="mt-3 font-semibold text-foreground">No Opened Returns</h3>
                <p className="mt-2 text-sm text-muted-foreground">Opened or used supplements are not refundable</p>
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
                <h2 className="mb-4 text-2xl font-bold text-foreground">1. Order Cancellation</h2>
                <ul className="ml-2 list-disc space-y-2 pl-4 text-muted-foreground">
                  <li>You may request cancellation only before the order is dispatched from our warehouse.</li>
                  <li>Once the order is packed, handed over to the courier, or marked as shipped, cancellation may no longer be possible.</li>
                  <li>If we are unable to fulfill your order due to stock issues, verification failure, or any operational reason, we may cancel the order and process the refund accordingly.</li>
                </ul>
              </div>

              <div>
                <h2 className="mb-4 text-2xl font-bold text-foreground">2. Refund Eligibility</h2>
                <p className="mb-3 leading-relaxed text-muted-foreground">Refunds may be considered only in the following situations:</p>
                <ul className="ml-2 list-disc space-y-2 pl-4 text-muted-foreground">
                  <li>You received a damaged, leaked, broken, expired, or tampered product.</li>
                  <li>You received a wrong product or a wrong variant against your confirmed order.</li>
                  <li>The order was cancelled before dispatch and the payment was successfully captured.</li>
                  <li>The product delivered is materially different from the product ordered.</li>
                </ul>
              </div>

              <div>
                <h2 className="mb-4 text-2xl font-bold text-foreground">3. Conditions for Approval</h2>
                <ul className="ml-2 list-disc space-y-2 pl-4 text-muted-foreground">
                  <li>You must report the issue within 48 hours of delivery.</li>
                  <li>An unboxing video showing the sealed package being opened is strongly required for claims related to damage, missing items, leakage, tampering, or wrong product.</li>
                  <li>The product must remain unused, unopened, and in its original sealed condition unless the defect could only be discovered on opening.</li>
                  <li>Original product packaging, labels, invoice, batch details, and any free items received with the order must be preserved for verification.</li>
                </ul>
              </div>

              <div>
                <h2 className="mb-4 text-2xl font-bold text-foreground">4. Non-Refundable Situations</h2>
                <ul className="ml-2 list-disc space-y-2 pl-4 text-muted-foreground">
                  <li>Opened, used, or partially consumed supplements, nutrition products, or wellness items.</li>
                  <li>Claims raised without adequate proof, beyond the reporting window, or based on personal taste or preference.</li>
                  <li>Products refused at delivery without a valid issue attributable to SS Supplements or the courier partner.</li>
                  <li>Minor packaging differences caused by brand-level design updates where the product remains genuine, sealed, and within shelf life.</li>
                </ul>
              </div>

              <div>
                <h2 className="mb-4 text-2xl font-bold text-foreground">5. Refund Process</h2>
                <ul className="ml-2 list-disc space-y-2 pl-4 text-muted-foreground">
                  <li>After your claim is reviewed and approved, the refund will be initiated to the original payment method.</li>
                  <li>All online payment refunds are processed back through Razorpay to the same source account or payment instrument used during checkout.</li>
                  <li>Once initiated, the refunded amount typically reflects in the customer&apos;s account within 5-7 business days, depending on the bank, card network, UPI app, or payment provider.</li>
                  <li>If the refund does not appear within the expected timeline, you may contact us with your order details and payment reference for assistance.</li>
                </ul>
              </div>

              <div>
                <h2 className="mb-4 text-2xl font-bold text-foreground">6. Contact for Claims</h2>
                <p className="leading-relaxed text-muted-foreground">
                  To request cancellation or raise a refund claim, please contact us with your order number, registered
                  phone number, issue summary, and supporting images or video at
                  <a href="mailto:info.sssupplements@gmail.com" className="ml-1 text-primary hover:underline">
                    info.sssupplements@gmail.com
                  </a>
                  <span> or +91 95478 99170.</span>
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
