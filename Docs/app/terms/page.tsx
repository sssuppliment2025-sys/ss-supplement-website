import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AlertTriangle, CreditCard, FileText, Scale, ShieldCheck, UserRound } from "lucide-react"

export const metadata = {
  title: "Terms and Conditions | SS Supplements",
  description:
    "Read the terms and conditions for using SS Supplements and placing orders on our website in India.",
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <section className="bg-gradient-to-r from-primary to-accent py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold text-white md:text-5xl">Terms and Conditions</h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-white/85 md:text-xl">
              Please read these terms carefully before using the SS Supplements website or placing an order.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl space-y-10">
              <p className="text-sm leading-relaxed text-muted-foreground">
                <strong className="text-foreground">Effective Date:</strong> April 12, 2026
              </p>

              <p className="leading-relaxed text-muted-foreground">
                These Terms and Conditions govern your access to and use of the SS Supplements website and the
                purchase of products sold through our platform. By browsing this website, creating an account, or
                placing an order, you agree to be bound by these terms, our published policies, and applicable laws of
                India.
              </p>

              <div>
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">1. Website Use</h2>
                </div>
                <ul className="ml-2 list-disc space-y-2 pl-4 text-muted-foreground">
                  <li>You agree to use this website only for lawful purposes.</li>
                  <li>You must provide accurate, current, and complete information while creating an account or placing an order.</li>
                  <li>You shall not misuse the website, attempt unauthorized access, or interfere with site security or performance.</li>
                  <li>We may suspend or refuse service if we reasonably believe an account or transaction is fraudulent, abusive, or unlawful.</li>
                </ul>
              </div>

              <div>
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <UserRound className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">2. Account Responsibility</h2>
                </div>
                <ul className="ml-2 list-disc space-y-2 pl-4 text-muted-foreground">
                  <li>You are responsible for maintaining the confidentiality of your login credentials.</li>
                  <li>All activity carried out through your account is deemed to be authorized by you unless reported otherwise.</li>
                  <li>Please notify us immediately if you suspect unauthorized access to your account or order history.</li>
                </ul>
              </div>

              <div>
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <CreditCard className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">3. Orders, Pricing, and Payments</h2>
                </div>
                <ul className="ml-2 list-disc space-y-2 pl-4 text-muted-foreground">
                  <li>All prices are displayed in INR and are inclusive or exclusive of taxes as shown at checkout.</li>
                  <li>Orders are confirmed only after successful payment authorization and acceptance by SS Supplements.</li>
                  <li>We reserve the right to cancel or limit any order in cases of stock unavailability, pricing errors, failed verification, or suspected fraud.</li>
                  <li>Available payment methods may include UPI, credit cards, debit cards, netbanking, EMI, No Cost EMI, and Pay Later through Razorpay, subject to availability.</li>
                </ul>
              </div>

              <div className="rounded-xl border border-border bg-secondary/40 p-6">
                <h2 className="mb-3 text-xl font-bold text-foreground">EMI, No Cost EMI, and Pay Later</h2>
                <p className="leading-relaxed text-muted-foreground">
                  EMI, No Cost EMI, and Pay Later options are provided entirely by third-party banks and lending
                  partners through Razorpay. SS Supplements is not liable for any interest charges, late payment fees,
                  processing fees, credit decisions, or EMI rejections by your bank or lending partner. All questions,
                  disputes, or claims relating to loan approval, repayment schedules, foreclosure, or lending terms
                  must be raised directly with the issuing bank or lending partner.
                </p>
              </div>

              <div>
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <ShieldCheck className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">4. Product Information and Authenticity</h2>
                </div>
                <ul className="ml-2 list-disc space-y-2 pl-4 text-muted-foreground">
                  <li>We aim to keep product descriptions, pricing, labels, and images accurate, but packaging may change from time to time based on manufacturer updates.</li>
                  <li>SS Supplements sells products represented as genuine and sourced through authorized channels to the best of our knowledge and supply chain controls.</li>
                  <li>Supplements should be used only as directed on the product label or as advised by a qualified healthcare professional.</li>
                  <li>Product statements on the website are for general information and are not a substitute for medical advice, diagnosis, or treatment.</li>
                </ul>
              </div>

              <div>
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <AlertTriangle className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">5. Prohibited Conduct</h2>
                </div>
                <ul className="ml-2 list-disc space-y-2 pl-4 text-muted-foreground">
                  <li>Using false identities, stolen payment instruments, or misleading information.</li>
                  <li>Copying, scraping, reproducing, or distributing site content without prior written consent.</li>
                  <li>Uploading viruses, malicious code, or engaging in any activity that may disrupt the platform.</li>
                  <li>Misusing coupon codes, referral programs, promotional offers, or return and refund processes.</li>
                </ul>
              </div>

              <div>
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">6. Intellectual Property</h2>
                </div>
                <p className="leading-relaxed text-muted-foreground">
                  All content on this website, including text, graphics, logos, product listings, images, icons,
                  layout, and design elements, is owned by or licensed to SS Supplements and is protected under
                  applicable intellectual property laws. No content may be copied, reused, republished, or exploited
                  commercially without prior written permission.
                </p>
              </div>

              <div>
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Scale className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">7. Limitation of Liability</h2>
                </div>
                <p className="leading-relaxed text-muted-foreground">
                  To the maximum extent permitted by law, SS Supplements shall not be liable for indirect, incidental,
                  punitive, or consequential losses arising from your use of the website, payment failures caused by
                  third parties, courier delays, or misuse of products. Our aggregate liability in relation to any
                  order shall not exceed the amount paid by you for that specific order.
                </p>
              </div>

              <div>
                <h2 className="mb-4 text-2xl font-bold text-foreground">8. Governing Law and Jurisdiction</h2>
                <p className="leading-relaxed text-muted-foreground">
                  These Terms and Conditions shall be governed by the laws of India. Subject to applicable consumer
                  protection laws, disputes arising from the use of this website or any purchase transaction shall be
                  subject to the courts having jurisdiction in Haldia, West Bengal.
                </p>
              </div>

              <div>
                <h2 className="mb-4 text-2xl font-bold text-foreground">9. Updates to These Terms</h2>
                <p className="leading-relaxed text-muted-foreground">
                  We may update these Terms and Conditions from time to time to reflect business, legal, or operational
                  changes. The revised version will be posted on this page with the updated effective date.
                </p>
              </div>

              <div className="rounded-xl border border-border bg-secondary/50 p-6">
                <h2 className="mb-3 text-xl font-bold text-foreground">Contact</h2>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  For questions regarding these Terms and Conditions, please contact SS Supplements at
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
