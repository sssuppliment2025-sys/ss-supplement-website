import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Truck, Clock, MapPin, Package, IndianRupee, HelpCircle } from "lucide-react"

export const metadata = {
  title: "Shipping Policy | SS Supplement",
  description:
    "Learn about SS Supplement's shipping options, delivery timelines, charges, and policies for orders across India.",
}

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero */}
        <section className="bg-gradient-to-r from-primary to-accent py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Shipping Policy</h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Fast, reliable delivery across India. Here&apos;s everything you need to know.
            </p>
          </div>
        </section>

        {/* Shipping Highlights */}
        <section className="py-12 bg-secondary/30">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              <div className="flex flex-col items-center text-center gap-3 p-6 bg-card rounded-xl border border-border">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Truck className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground">Free Shipping</h3>
                <p className="text-sm text-muted-foreground">On orders above ₹999</p>
              </div>
              <div className="flex flex-col items-center text-center gap-3 p-6 bg-card rounded-xl border border-border">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground">Fast Delivery</h3>
                <p className="text-sm text-muted-foreground">3-7 business days</p>
              </div>
              <div className="flex flex-col items-center text-center gap-3 p-6 bg-card rounded-xl border border-border">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground">Pan India</h3>
                <p className="text-sm text-muted-foreground">Delivering to 27,000+ pin codes</p>
              </div>
              <div className="flex flex-col items-center text-center gap-3 p-6 bg-card rounded-xl border border-border">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Package className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground">Secure Packaging</h3>
                <p className="text-sm text-muted-foreground">Tamper-proof & safe packaging</p>
              </div>
            </div>
          </div>
        </section>

        {/* Policy Content */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto space-y-10">

              {/* Section 1 */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Truck className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">1. Shipping Coverage</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  We ship across India to over 27,000+ serviceable pin codes. Currently, we do not offer international
                  shipping. Enter your pin code during checkout to verify serviceability in your area.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Orders are dispatched from our warehouse in Gurgaon, Haryana. We partner with leading courier services
                  including Delhivery, BlueDart, and India Post to ensure timely delivery.
                </p>
              </div>

              {/* Section 2 */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">2. Delivery Timelines</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border border-border rounded-lg overflow-hidden">
                    <thead>
                      <tr className="bg-secondary">
                        <th className="text-left p-3 font-semibold text-foreground border-b border-border">Region</th>
                        <th className="text-left p-3 font-semibold text-foreground border-b border-border">
                          Estimated Delivery
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-border">
                        <td className="p-3 text-muted-foreground">Delhi NCR (Gurgaon, Noida, Delhi)</td>
                        <td className="p-3 text-muted-foreground">1-2 business days</td>
                      </tr>
                      <tr className="border-b border-border bg-secondary/30">
                        <td className="p-3 text-muted-foreground">Metro Cities (Mumbai, Bangalore, Chennai, Kolkata, Hyderabad)</td>
                        <td className="p-3 text-muted-foreground">3-5 business days</td>
                      </tr>
                      <tr className="border-b border-border">
                        <td className="p-3 text-muted-foreground">Tier 2 & 3 Cities</td>
                        <td className="p-3 text-muted-foreground">5-7 business days</td>
                      </tr>
                      <tr>
                        <td className="p-3 text-muted-foreground">Remote / Rural Areas</td>
                        <td className="p-3 text-muted-foreground">7-10 business days</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-sm text-muted-foreground mt-3">
                  * Delivery timelines are estimates and may vary due to weather, holidays, or unforeseen circumstances.
                </p>
              </div>

              {/* Section 3 */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <IndianRupee className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">3. Shipping Charges</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border border-border rounded-lg overflow-hidden">
                    <thead>
                      <tr className="bg-secondary">
                        <th className="text-left p-3 font-semibold text-foreground border-b border-border">
                          Order Value
                        </th>
                        <th className="text-left p-3 font-semibold text-foreground border-b border-border">
                          Shipping Cost
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-border">
                        <td className="p-3 text-muted-foreground">Above ₹999</td>
                        <td className="p-3 font-semibold text-green-600">FREE</td>
                      </tr>
                      <tr className="border-b border-border bg-secondary/30">
                        <td className="p-3 text-muted-foreground">₹499 - ₹999</td>
                        <td className="p-3 text-muted-foreground">₹49</td>
                      </tr>
                      <tr>
                        <td className="p-3 text-muted-foreground">Below ₹499</td>
                        <td className="p-3 text-muted-foreground">₹79</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-sm text-muted-foreground mt-3">
                  * Cash on Delivery (COD) orders may attract an additional handling fee of ₹40-₹50.
                </p>
              </div>

              {/* Section 4 */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Package className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">4. Order Processing</h2>
                </div>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-2">
                  <li>
                    Orders placed before <strong className="text-foreground">2:00 PM IST</strong> on business days are
                    dispatched the same day.
                  </li>
                  <li>
                    Orders placed after 2:00 PM or on weekends/holidays are dispatched the next business day.
                  </li>
                  <li>
                    You will receive an email and SMS with tracking details once your order is shipped.
                  </li>
                  <li>
                    You can track your order anytime from the <strong className="text-foreground">Track Order</strong>{" "}
                    section in your account or using the tracking link sent via SMS/email.
                  </li>
                </ul>
              </div>

              {/* Section 5 */}
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">5. Undelivered / Failed Deliveries</h2>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-2">
                  <li>
                    If a delivery attempt fails, our courier partner will make up to{" "}
                    <strong className="text-foreground">3 attempts</strong> before returning the package.
                  </li>
                  <li>
                    For returned shipments due to incorrect address, customer unavailability, or refusal, the order may
                    be cancelled. Re-shipping charges may apply.
                  </li>
                  <li>
                    If your package shows &quot;Delivered&quot; but you haven&apos;t received it, please contact us within 48
                    hours.
                  </li>
                </ul>
              </div>

              {/* Section 6 */}
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">6. Damaged or Missing Items</h2>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-2">
                  <li>
                    If your order arrives damaged or with missing items, contact us within{" "}
                    <strong className="text-foreground">48 hours</strong> of delivery.
                  </li>
                  <li>
                    Please share an unboxing video or clear photographs of the damaged product and packaging.
                  </li>
                  <li>
                    We will arrange a replacement or full refund after verification.
                  </li>
                </ul>
              </div>

              {/* Section 7 */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <HelpCircle className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">7. Order Cancellation</h2>
                </div>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-2">
                  <li>
                    Orders can be cancelled before dispatch by contacting our support team.
                  </li>
                  <li>
                    Once an order is shipped, cancellation is not possible. You may initiate a return after delivery.
                  </li>
                  <li>
                    Refunds for cancelled orders are processed within 5-7 business days to the original payment method.
                  </li>
                </ul>
              </div>

              {/* Contact */}
              <div className="bg-secondary/50 rounded-xl p-6 border border-border">
                <h2 className="text-xl font-bold text-foreground mb-3">Need Help?</h2>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  For any shipping-related queries, reach out to us:
                </p>
                <ul className="text-sm text-muted-foreground mt-3 space-y-1">
                  <li>
                    <strong className="text-foreground">Email:</strong>{" "}
                    <a href="mailto:info@sssupplement.com" className="text-primary hover:underline">
                      info@sssupplement.com
                    </a>
                  </li>
                  <li>
                    <strong className="text-foreground">Phone:</strong> +91 95478 99170
                  </li>
                  <li>
                    <strong className="text-foreground">WhatsApp:</strong> +91 95478 99170
                  </li>
                  <li>
                    <strong className="text-foreground">Address:</strong> Haldia, Bhabanipur ,Babajibasa, 721657
                    <br />
                    Near Ambuja City centre Mall
                    <br />
                    Opposite Meghnath Saha institute of technology
                  </li>
                  <li>
                    <strong className="text-foreground">Support Hours:</strong> Mon-Sat, 10:00 AM - 7:00 PM IST
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
