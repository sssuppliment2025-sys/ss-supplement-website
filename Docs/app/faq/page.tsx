import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqs = [
  {
    question: "Are the products sold by SS Supplements genuine?",
    answer:
      "Yes. We aim to source all products through trusted and authorized channels. We focus on sealed, properly labeled products and encourage customers to check the packaging, batch details, and expiry date when the order is delivered.",
  },
  {
    question: "How can I choose the right supplement for my goal?",
    answer:
      "It depends on your goal. Whey protein is commonly chosen for daily protein intake and recovery, creatine for strength and performance, and mass gainer for calorie and weight-gain support. If you have a medical condition, allergy, or are unsure what to buy, please consult a qualified healthcare professional before use.",
  },
  {
    question: "How long does it take to dispatch and deliver an order?",
    answer:
      "Most orders are processed and dispatched within 24-48 business hours. Standard delivery usually takes 3-7 business days depending on your location, courier serviceability, and local conditions.",
  },
  {
    question: "Do you offer free shipping?",
    answer:
      "Yes. Free shipping is available on orders above Rs. 999 unless a different offer or shipping rule is shown during checkout.",
  },
  {
    question: "How can I track my order?",
    answer:
      "You can open the Track Order page and enter your order ID to view your order details and current status. If you are logged in, you can also check the same information from the My Orders section.",
  },
  {
    question: "Can I cancel my order after placing it?",
    answer:
      "You can request cancellation before the order is dispatched. Once the order has been packed or shipped, cancellation may no longer be possible. In such cases, you can contact support for further guidance.",
  },
  {
    question: "When am I eligible for a refund or replacement?",
    answer:
      "Refunds or replacements are generally considered if you receive a damaged, tampered, leaked, expired, missing, or wrong item. Please report the issue within 48 hours of delivery and keep the product, box, invoice, and unboxing video ready for verification.",
  },
  {
    question: "Why do you ask for an unboxing video?",
    answer:
      "An unboxing video helps us verify claims related to transit damage, leakage, missing items, wrong product delivery, or tampered packaging more quickly and fairly.",
  },
  {
    question: "How are refunds processed?",
    answer:
      "Approved refunds are processed back to the original payment method used during checkout. For online payments, refunds are sent through Razorpay and usually reflect within 5-7 business days, depending on your bank or payment provider.",
  },
  {
    question: "Do you store my card or payment details?",
    answer:
      "No. SS Supplements does not store full card details or sensitive payment credentials on its own servers. Payments are processed securely through Razorpay and its authorized partners.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "Available payment methods may include UPI, debit cards, credit cards, netbanking, EMI, No Cost EMI, and Pay Later, depending on checkout availability and Razorpay support.",
  },
  {
    question: "Who handles EMI, No Cost EMI, and Pay Later disputes?",
    answer:
      "These options are offered by third-party banks and lending partners through Razorpay. Questions about approval, rejection, interest, charges, repayment schedule, or loan terms must be raised directly with the issuing bank or lending partner.",
  },
  {
    question: "Can I exchange an opened supplement product?",
    answer:
      "Usually no. Opened, used, or partially consumed supplements are generally not eligible for exchange or refund unless there is a verified issue that could not have been identified before opening.",
  },
  {
    question: "What should I do if I entered the wrong address or phone number?",
    answer:
      "Please contact us as soon as possible after placing the order. If the order has not yet been dispatched, we may be able to help update the details. Once shipped, address changes depend on courier support and may not always be possible.",
  },
  {
    question: "How can I contact SS Supplements for support?",
    answer:
      "You can reach us through the Contact Us page, the Track Order page, or our support email and phone number shown on the website footer. Sharing your order ID helps us assist you faster.",
  },
]

export const metadata = {
  title: "FAQs | SS Supplements",
  description:
    "Find answers to common questions about SS Supplements, including authenticity, shipping, payments, refunds, tracking, and support.",
}

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <section className="bg-gradient-to-r from-primary to-accent py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold text-white md:text-5xl">Frequently Asked Questions</h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-white/85 md:text-xl">
              Quick answers about orders, payments, refunds, authenticity, and support at SS Supplements.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-4xl space-y-8">
              <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
                <h2 className="text-2xl font-bold text-foreground">Need help before or after placing an order?</h2>
                <p className="mt-3 text-muted-foreground">
                  We have answered the most common customer questions below. If you still need help, please contact SS
                  Supplements support with your order ID for faster assistance.
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-card p-3 md:p-4">
                <Accordion type="single" collapsible className="w-full">
                  {faqs.map((faq, index) => (
                    <AccordionItem key={faq.question} value={`faq-${index}`}>
                      <AccordionTrigger className="text-left text-base font-medium text-foreground">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="leading-relaxed text-muted-foreground">{faq.answer}</p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
