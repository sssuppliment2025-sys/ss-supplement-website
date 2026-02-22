import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { FileText, ShoppingCart, AlertTriangle, Scale, RefreshCw, Ban } from "lucide-react"

export const metadata = {
  title: "Terms of Service | SS Supplement",
  description:
    "Read the terms and conditions governing the use of SS Supplement's website and purchase of products.",
}

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero */}
        <section className="bg-gradient-to-r from-primary to-accent py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Terms of Service</h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Please read these terms carefully before using our website or services.
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto space-y-10">
              <p className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Effective Date:</strong> January 1, 2026
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Welcome to SS Supplement. By accessing or using our website{" "}
                <span className="text-primary font-medium">sssupplement.com</span>, you agree to be bound by these
                Terms of Service. If you do not agree with any part of these terms, please do not use our website.
              </p>

              {/* Section 1 */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">1. General Terms</h2>
                </div>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-2">
                  <li>You must be at least 18 years of age to use this website or make purchases.</li>
                  <li>
                    By placing an order, you confirm that all information provided is accurate and complete.
                  </li>
                  <li>
                    We reserve the right to refuse service, terminate accounts, or cancel orders at our sole
                    discretion.
                  </li>
                  <li>
                    All content on this website, including text, images, logos, and graphics, is the property of SS
                    Supplement and is protected by copyright laws.
                  </li>
                </ul>
              </div>

              {/* Section 2 */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <ShoppingCart className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">2. Orders & Payments</h2>
                </div>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-2">
                  <li>
                    All prices are listed in Indian Rupees (INR) and are inclusive of applicable taxes unless stated
                    otherwise.
                  </li>
                  <li>
                    We accept payments via UPI, credit/debit cards, net banking, wallets, and Cash on Delivery (COD)
                    where available.
                  </li>
                  <li>
                    An order is confirmed only after successful payment verification. We reserve the right to cancel
                    orders due to pricing errors, stock unavailability, or suspected fraud.
                  </li>
                  <li>
                    COD orders may require additional verification. A nominal COD fee may apply.
                  </li>
                  <li>
                    Promotional discounts and coupon codes cannot be combined unless explicitly stated.
                  </li>
                </ul>
              </div>

              {/* Section 3 */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">3. Product Information & Disclaimer</h2>
                </div>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-2">
                  <li>
                    We strive to display accurate product descriptions, images, and nutritional information. However,
                    actual products may vary slightly due to packaging updates by manufacturers.
                  </li>
                  <li>
                    Supplements sold on our website are not intended to diagnose, treat, cure, or prevent any disease.
                    Please consult a healthcare professional before starting any supplement regimen.
                  </li>
                  <li>
                    Results from supplement use may vary from person to person. SS Supplement is not responsible for
                    individual results.
                  </li>
                  <li>
                    All products are 100% authentic and sourced from authorized distributors. We guarantee the
                    genuineness of every item sold on our platform.
                  </li>
                </ul>
              </div>

              {/* Section 4 */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <RefreshCw className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">4. Returns & Refunds</h2>
                </div>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-2">
                  <li>
                    Returns are accepted within <strong className="text-foreground">7 days</strong> of delivery for
                    unopened and unused products in original packaging.
                  </li>
                  <li>
                    Damaged or defective items must be reported within{" "}
                    <strong className="text-foreground">48 hours</strong> of delivery with photographic evidence.
                  </li>
                  <li>
                    Refunds will be processed within 7-10 business days to the original payment method after the
                    returned item is inspected.
                  </li>
                  <li>
                    Opened supplements, perishable items, and personalized products are not eligible for return unless
                    defective.
                  </li>
                  <li>
                    Shipping charges for returns are borne by the customer unless the return is due to our error.
                  </li>
                </ul>
              </div>

              {/* Section 5 */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Ban className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">5. Prohibited Activities</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  You agree not to:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-2">
                  <li>Use the website for any unlawful purpose</li>
                  <li>Attempt to gain unauthorized access to our systems or user accounts</li>
                  <li>Submit false or misleading information</li>
                  <li>Engage in fraudulent transactions or misuse promotional offers</li>
                  <li>Reproduce, distribute, or modify any content from this website without prior consent</li>
                </ul>
              </div>

              {/* Section 6 */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Scale className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">6. Limitation of Liability</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  SS Supplement shall not be liable for any indirect, incidental, special, or consequential damages
                  arising from the use of our website or products. Our total liability for any claim shall not exceed
                  the amount paid by you for the specific product giving rise to the claim.
                </p>
              </div>

              {/* Section 7 */}
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">7. Account Responsibility</h2>
                <p className="text-muted-foreground leading-relaxed">
                  You are responsible for maintaining the confidentiality of your account credentials. Any activity
                  that occurs under your account is your responsibility. Notify us immediately at{" "}
                  <a href="mailto:info.sssupplements@gmail.com" className="text-primary hover:underline">
                    info.sssupplements@gmail.com
                  </a>{" "}
                  if you suspect unauthorized use of your account.
                </p>
              </div>

              {/* Section 8 */}
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">8. Governing Law</h2>
                <p className="text-muted-foreground leading-relaxed">
                  These Terms of Service are governed by and construed in accordance with the laws of India. Any
                  disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts in
                  Gurgaon, Haryana.
                </p>
              </div>

              {/* Section 9 */}
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">9. Changes to Terms</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We reserve the right to modify these Terms of Service at any time. Updated terms will be posted on
                  this page with a revised date. Continued use of the website after changes constitutes acceptance of
                  the updated terms.
                </p>
              </div>

              {/* Contact */}
              <div className="bg-secondary/50 rounded-xl p-6 border border-border">
                <h2 className="text-xl font-bold text-foreground mb-3">Questions?</h2>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  If you have any questions about these Terms of Service, please contact us:
                </p>
                <ul className="text-sm text-muted-foreground mt-3 space-y-1">
                  <li>
                    <strong className="text-foreground">Email:</strong>{" "}
                    <a href="mailto:info.sssupplements@gmail.com" className="text-primary hover:underline">
                      info.sssupplements@gmail.com
                    </a>
                  </li>
                  <li>
                    <strong className="text-foreground">Phone:</strong> +91 95478 99170
                  </li>
                  <li>
                    <strong className="text-foreground">Address:</strong> Haldia, Bhabanipur ,Babajibasa, 721657
                    <br />
                    Near Ambuja City centre Mall
                    <br />
                    Opposite Meghnath Saha institute of technology
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
