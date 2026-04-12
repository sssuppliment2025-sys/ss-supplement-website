import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Database, Lock, Shield, UserCheck } from "lucide-react"

export const metadata = {
  title: "Privacy Policy | SS Supplements",
  description:
    "Understand how SS Supplements collects, uses, stores, and protects personal information for customers in India.",
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <section className="bg-gradient-to-r from-primary to-accent py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold text-white md:text-5xl">Privacy Policy</h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-white/85 md:text-xl">
              Your information matters to us. This page explains what we collect, why we collect it, and how we
              protect it.
            </p>
          </div>
        </section>

        <section className="bg-secondary/30 py-12">
          <div className="container mx-auto px-4">
            <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-3">
              <div className="rounded-xl border border-border bg-card p-6 text-center">
                <Shield className="mx-auto h-6 w-6 text-primary" />
                <h3 className="mt-3 font-semibold text-foreground">Secure Handling</h3>
                <p className="mt-2 text-sm text-muted-foreground">We apply reasonable safeguards to protect your data.</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-6 text-center">
                <Database className="mx-auto h-6 w-6 text-primary" />
                <h3 className="mt-3 font-semibold text-foreground">Limited Collection</h3>
                <p className="mt-2 text-sm text-muted-foreground">We collect information needed to serve orders and support.</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-6 text-center">
                <Lock className="mx-auto h-6 w-6 text-primary" />
                <h3 className="mt-3 font-semibold text-foreground">Payment Safety</h3>
                <p className="mt-2 text-sm text-muted-foreground">Payments are processed through secure third-party infrastructure.</p>
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

              <p className="leading-relaxed text-muted-foreground">
                This Privacy Policy describes how SS Supplements collects, uses, stores, and shares personal
                information when you visit our website, create an account, contact us, or place an order in India.
              </p>

              <div>
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Database className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">1. Information We Collect</h2>
                </div>
                <ul className="ml-2 list-disc space-y-2 pl-4 text-muted-foreground">
                  <li>Name, billing address, shipping address, phone number, and email address.</li>
                  <li>Account details such as password-protected login credentials and order history.</li>
                  <li>Transaction-related details such as order value, payment status, refund status, and delivery details.</li>
                  <li>Device, browser, IP address, cookies, and website usage data for performance, fraud prevention, and analytics.</li>
                  <li>Messages, support requests, reviews, or other information you voluntarily share with us.</li>
                </ul>
              </div>

              <div>
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <UserCheck className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">2. How We Use Your Information</h2>
                </div>
                <ul className="ml-2 list-disc space-y-2 pl-4 text-muted-foreground">
                  <li>To process orders, arrange shipment, provide customer support, and handle returns or refunds.</li>
                  <li>To contact you about order updates, verification, delivery issues, or service requests.</li>
                  <li>To improve our website, prevent fraud, maintain account security, and comply with legal obligations.</li>
                  <li>To send promotional updates or newsletters where you have consented or where permitted by applicable law.</li>
                </ul>
              </div>

              <div>
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Lock className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">3. Payment Information</h2>
                </div>
                <p className="leading-relaxed text-muted-foreground">
                  SS Supplements does not store your full credit card, debit card, UPI PIN, or other sensitive payment
                  instrument details on its servers. All online payments are securely processed and encrypted by
                  Razorpay and its authorized payment partners, subject to their own security and privacy practices.
                </p>
              </div>

              <div>
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">4. Sharing of Information</h2>
                </div>
                <ul className="ml-2 list-disc space-y-2 pl-4 text-muted-foreground">
                  <li>We may share personal information with payment processors, logistics partners, technology service providers, and support vendors strictly on a need-to-know basis.</li>
                  <li>We may disclose information when required by law, court order, government authority, or to protect our legal rights and prevent fraud.</li>
                  <li>We do not sell your personal information as part of our ordinary business operations.</li>
                </ul>
              </div>

              <div>
                <h2 className="mb-4 text-2xl font-bold text-foreground">5. Cookies and Analytics</h2>
                <ul className="ml-2 list-disc space-y-2 pl-4 text-muted-foreground">
                  <li>We may use cookies, pixels, and similar technologies to remember preferences, measure traffic, and improve site performance.</li>
                  <li>You can control certain cookie settings through your browser, but disabling cookies may affect some website features.</li>
                </ul>
              </div>

              <div>
                <h2 className="mb-4 text-2xl font-bold text-foreground">6. Data Security and Retention</h2>
                <ul className="ml-2 list-disc space-y-2 pl-4 text-muted-foreground">
                  <li>We use reasonable administrative, technical, and organizational safeguards to protect personal information.</li>
                  <li>We retain information only for as long as necessary for legitimate business, legal, tax, compliance, or dispute-resolution purposes.</li>
                  <li>No internet-based system is completely secure, so we cannot guarantee absolute security at all times.</li>
                </ul>
              </div>

              <div>
                <h2 className="mb-4 text-2xl font-bold text-foreground">7. Your Choices</h2>
                <ul className="ml-2 list-disc space-y-2 pl-4 text-muted-foreground">
                  <li>You may request correction or updating of basic account information maintained by us.</li>
                  <li>You may opt out of promotional emails or messages by using the unsubscribe option or contacting us directly.</li>
                  <li>Certain retention obligations may continue even after you close your account or complete an order.</li>
                </ul>
              </div>

              <div>
                <h2 className="mb-4 text-2xl font-bold text-foreground">8. Changes to This Policy</h2>
                <p className="leading-relaxed text-muted-foreground">
                  We may revise this Privacy Policy from time to time. The updated version will be posted on this page
                  with the revised effective date.
                </p>
              </div>

              <div className="rounded-xl border border-border bg-secondary/50 p-6">
                <h2 className="mb-3 text-xl font-bold text-foreground">Contact</h2>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  If you have privacy-related questions, you can contact SS Supplements at
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
