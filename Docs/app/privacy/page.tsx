import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Shield, Eye, Lock, Database, UserCheck, Bell } from "lucide-react"

export const metadata = {
  title: "Privacy Policy | SS Supplement",
  description:
    "Read SS Supplement's privacy policy to understand how we collect, use, and protect your personal information.",
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero */}
        <section className="bg-gradient-to-r from-primary to-accent py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Privacy Policy</h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Your privacy matters to us. Learn how we protect your data.
            </p>
          </div>
        </section>

        {/* Highlights */}
        <section className="py-12 bg-secondary/30">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="flex flex-col items-center text-center gap-3 p-6 bg-card rounded-xl border border-border">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground">Secure Data</h3>
                <p className="text-sm text-muted-foreground">Your data is encrypted and stored securely</p>
              </div>
              <div className="flex flex-col items-center text-center gap-3 p-6 bg-card rounded-xl border border-border">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Eye className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground">Transparent</h3>
                <p className="text-sm text-muted-foreground">We are clear about what data we collect</p>
              </div>
              <div className="flex flex-col items-center text-center gap-3 p-6 bg-card rounded-xl border border-border">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Lock className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground">No Spam</h3>
                <p className="text-sm text-muted-foreground">We never sell your information to third parties</p>
              </div>
            </div>
          </div>
        </section>

        {/* Policy Content */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto space-y-10">
              <p className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Effective Date:</strong> January 1, 2026
              </p>
              <p className="text-muted-foreground leading-relaxed">
                SS Supplement (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) operates the website{" "}
                <span className="text-primary font-medium">sssupplement.com</span>. This Privacy Policy explains how we
                collect, use, disclose, and safeguard your personal information when you visit our website or make a
                purchase.
              </p>

              {/* Section 1 */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Database className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">1. Information We Collect</h2>
                </div>
                <div className="ml-13 space-y-4">
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Personal Information</h3>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-2">
                      <li>Full name, email address, phone number</li>
                      <li>Shipping and billing address</li>
                      <li>Payment details (processed securely via payment gateways)</li>
                      <li>Account login credentials</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Non-Personal Information</h3>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-2">
                      <li>Browser type and version</li>
                      <li>IP address and device information</li>
                      <li>Pages visited, time spent, and referral URLs</li>
                      <li>Cookies and similar tracking technologies</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Section 2 */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <UserCheck className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">2. How We Use Your Information</h2>
                </div>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-2">
                  <li>To process and fulfill your orders</li>
                  <li>To communicate order updates, shipping notifications, and support</li>
                  <li>To personalize your shopping experience and product recommendations</li>
                  <li>To send promotional offers and newsletters (with your consent)</li>
                  <li>To improve our website performance and user experience</li>
                  <li>To detect, prevent, and address fraud or technical issues</li>
                </ul>
              </div>

              {/* Section 3 */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Lock className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">3. Data Sharing & Disclosure</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  We do <strong className="text-foreground">not</strong> sell, trade, or rent your personal information.
                  We may share data with:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-2">
                  <li>
                    <strong className="text-foreground">Payment Processors:</strong> Razorpay / Cashfree for secure
                    payment handling
                  </li>
                  <li>
                    <strong className="text-foreground">Shipping Partners:</strong> Delhivery, BlueDart, India Post for
                    order delivery
                  </li>
                  <li>
                    <strong className="text-foreground">Analytics Services:</strong> Google Analytics for website
                    improvement
                  </li>
                  <li>
                    <strong className="text-foreground">Legal Authorities:</strong> When required by law or to protect
                    our rights
                  </li>
                </ul>
              </div>

              {/* Section 4 */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">4. Data Security</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  We implement industry-standard security measures including SSL encryption, secure servers, and
                  restricted access to protect your personal data. However, no method of transmission over the Internet
                  is 100% secure, and we cannot guarantee absolute security.
                </p>
              </div>

              {/* Section 5 */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Bell className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">5. Cookies</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  We use cookies and similar technologies to enhance your browsing experience, remember your
                  preferences, and analyze website traffic. You can control cookie preferences through your browser
                  settings. Disabling cookies may affect the functionality of some features on our website.
                </p>
              </div>

              {/* Section 6 */}
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">6. Your Rights</h2>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  As a user, you have the right to:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-2">
                  <li>Access, update, or delete your personal information</li>
                  <li>Opt out of marketing communications at any time</li>
                  <li>Request a copy of the data we hold about you</li>
                  <li>Withdraw consent for data processing</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-3">
                  To exercise any of these rights, contact us at{" "}
                  <a href="mailto:info@sssupplement.com" className="text-primary hover:underline">
                    info@sssupplement.com
                  </a>
                  .
                </p>
              </div>

              {/* Section 7 */}
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">7. Third-Party Links</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Our website may contain links to third-party sites. We are not responsible for the privacy practices
                  or content of those websites. We encourage you to read the privacy policies of any external site you
                  visit.
                </p>
              </div>

              {/* Section 8 */}
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">8. Changes to This Policy</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We may update this Privacy Policy periodically. Changes will be posted on this page with a revised
                  effective date. We encourage you to review this page regularly to stay informed about how we protect
                  your data.
                </p>
              </div>

              {/* Contact */}
              <div className="bg-secondary/50 rounded-xl p-6 border border-border">
                <h2 className="text-xl font-bold text-foreground mb-3">Contact Us</h2>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  If you have any questions about this Privacy Policy, please contact us:
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
