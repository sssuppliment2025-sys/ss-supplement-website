import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CreditCard, Lock, ShieldCheck, UserRound } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const shoppingFaqs = [
  {
    question: "Is making an online payment secure on SS Supplements?",
    answer:
      "Yes. Online payments on SS Supplements are processed through Razorpay and its authorized payment partners using secure encryption and payment security controls.",
  },
  {
    question: "Does SS Supplements store my credit or debit card information?",
    answer:
      "No. SS Supplements does not store your full credit card, debit card, UPI PIN, or other sensitive payment credentials on its own servers. Payment processing is handled securely through Razorpay.",
  },
  {
    question: "What payment methods are available on SS Supplements?",
    answer:
      "Depending on checkout availability, we may accept UPI, debit cards, credit cards, netbanking, EMI, No Cost EMI, and Pay Later through Razorpay and participating banks or lending partners.",
  },
  {
    question: "Are all card payments and EMI options always available?",
    answer:
      "Availability may depend on Razorpay support, your bank, your card type, device, location, risk checks, and partner eligibility. Some payment methods may appear only for eligible transactions.",
  },
  {
    question: "Do you accept payments from outside India?",
    answer:
      "SS Supplements is focused on serving customers in India. Payment availability, order acceptance, and delivery service are intended primarily for India-based transactions and serviceable Indian addresses.",
  },
]

const privacyFaqs = [
  {
    question: "What information does SS Supplements collect?",
    answer:
      "We may collect your name, email address, phone number, billing and shipping address, order details, payment status, device information, browser information, IP address, and communications shared with us for support or order handling.",
  },
  {
    question: "Why do you collect this information?",
    answer:
      "We collect and use information to process orders, arrange delivery, handle refunds or exchanges, provide customer support, improve website performance, prevent fraud, and comply with legal and regulatory requirements.",
  },
  {
    question: "Do you sell my personal information?",
    answer:
      "No. We do not sell your personal information as part of our ordinary business operations. We may share limited information with payment processors, logistics partners, technology providers, and legal authorities where necessary.",
  },
  {
    question: "Do you use cookies on the website?",
    answer:
      "Yes. We may use cookies and similar technologies to improve site performance, remember preferences, understand website usage, and support a smoother shopping experience.",
  },
]

export const metadata = {
  title: "Consumer Policy | SS Supplements",
  description:
    "Read the SS Supplements consumer policy covering safe and secure shopping, payments, privacy, and customer support information.",
}

export default function ConsumerPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <section className="bg-gradient-to-r from-primary to-accent py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold text-white md:text-5xl">Consumer Policy</h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-white/85 md:text-xl">
              Important information about safe shopping, payment security, privacy, and customer support at SS
              Supplements.
            </p>
          </div>
        </section>

        <section className="bg-secondary/30 py-12">
          <div className="container mx-auto px-4">
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border border-border bg-card p-6 text-center">
                <ShieldCheck className="mx-auto h-6 w-6 text-primary" />
                <h3 className="mt-3 font-semibold text-foreground">Safe Shopping</h3>
                <p className="mt-2 text-sm text-muted-foreground">Secure checkout and trusted order handling.</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-6 text-center">
                <CreditCard className="mx-auto h-6 w-6 text-primary" />
                <h3 className="mt-3 font-semibold text-foreground">Protected Payments</h3>
                <p className="mt-2 text-sm text-muted-foreground">Online payments are processed through Razorpay.</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-6 text-center">
                <Lock className="mx-auto h-6 w-6 text-primary" />
                <h3 className="mt-3 font-semibold text-foreground">Privacy Focused</h3>
                <p className="mt-2 text-sm text-muted-foreground">We handle personal information with care.</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-6 text-center">
                <UserRound className="mx-auto h-6 w-6 text-primary" />
                <h3 className="mt-3 font-semibold text-foreground">Customer Support</h3>
                <p className="mt-2 text-sm text-muted-foreground">Reach us for help with orders and account queries.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-4xl space-y-10">
              <div className="rounded-2xl border border-border bg-card p-8">
                <h2 className="text-2xl font-bold text-foreground">Safe and Secure Shopping</h2>
                <p className="mt-3 leading-relaxed text-muted-foreground">
                  We value customer trust and work to provide a secure shopping experience on SS Supplements. Orders,
                  payments, and support interactions are handled using reasonable safeguards designed to protect your
                  information and reduce misuse.
                </p>
                <div className="mt-6 rounded-xl border border-border bg-secondary/50 p-4">
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    Please note: payment, bank, and lending eligibility decisions for cards, EMI, No Cost EMI, or Pay
                    Later are controlled by third-party payment and banking partners. Availability may vary from one
                    transaction to another.
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card p-4 md:p-6">
                <h2 className="mb-3 text-2xl font-bold text-foreground">Shopping and Payment Questions</h2>
                <Accordion type="single" collapsible className="w-full">
                  {shoppingFaqs.map((item, index) => (
                    <AccordionItem key={item.question} value={`shopping-${index}`}>
                      <AccordionTrigger className="text-left text-base font-medium text-foreground">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="leading-relaxed text-muted-foreground">{item.answer}</p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>

              <div className="rounded-2xl border border-border bg-card p-8">
                <h2 className="text-2xl font-bold text-foreground">Privacy Policy Overview</h2>
                <p className="mt-3 leading-relaxed text-muted-foreground">
                  SS Supplements respects your privacy and is committed to protecting your personal information. We
                  collect only the information reasonably needed to process orders, provide support, improve the
                  website, prevent fraud, and comply with legal obligations in India.
                </p>
                <ul className="mt-5 list-disc space-y-2 pl-5 text-muted-foreground">
                  <li>We may collect your name, email address, phone number, billing and shipping details, and order information.</li>
                  <li>We do not store full card details or sensitive payment credentials on our servers.</li>
                  <li>Online payments are securely processed through Razorpay and its authorized payment partners.</li>
                  <li>We may share limited information with logistics, payment, and support partners only where required to deliver services.</li>
                  <li>You can read the full details on our dedicated <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link> page.</li>
                </ul>
              </div>

              <div className="rounded-2xl border border-border bg-card p-4 md:p-6">
                <h2 className="mb-3 text-2xl font-bold text-foreground">Privacy Questions</h2>
                <Accordion type="single" collapsible className="w-full">
                  {privacyFaqs.map((item, index) => (
                    <AccordionItem key={item.question} value={`privacy-${index}`}>
                      <AccordionTrigger className="text-left text-base font-medium text-foreground">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="leading-relaxed text-muted-foreground">{item.answer}</p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>

              <div className="rounded-2xl border border-border bg-secondary/40 p-8">
                <h2 className="text-2xl font-bold text-foreground">Contact Us</h2>
                <p className="mt-3 leading-relaxed text-muted-foreground">
                  Couldn&apos;t find the information you need? Please contact us for help with orders, payments,
                  refunds, account concerns, or privacy-related requests.
                </p>
                <ul className="mt-5 space-y-2 text-muted-foreground">
                  <li>
                    <strong className="text-foreground">Email:</strong> info.sssupplements@gmail.com
                  </li>
                  <li>
                    <strong className="text-foreground">Phone:</strong> +91 95478 99170
                  </li>
                  <li>
                    <strong className="text-foreground">Address:</strong> Haldia, Bhabanipur, Babajibasa, 721657,
                    Near Ambuja City Centre Mall, Opposite Meghnath Saha Institute of Technology
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
