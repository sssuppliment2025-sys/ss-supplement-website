import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Mail, MapPin, MessageSquareText, Phone } from "lucide-react"

export const metadata = {
  title: "Contact Us | SS Supplements",
  description:
    "Get in touch with SS Supplements for customer support, business enquiries, product help, and order tracking assistance.",
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <section className="bg-gradient-to-r from-primary to-accent py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold text-white md:text-5xl">Contact Us</h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-white/85 md:text-xl">
              We would love to hear from you. Reach out for customer support, order tracking, product questions, or
              business enquiries, and our team will do its best to assist you promptly.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2">
              <div className="rounded-2xl border border-border bg-card p-8">
                <div className="mb-6 flex items-center gap-3">
                  <MessageSquareText className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl font-bold text-foreground">How We Can Help</h2>
                </div>
                <ul className="ml-2 list-disc space-y-3 pl-4 text-muted-foreground">
                  <li>Order tracking, delivery updates, cancellations, and refund support.</li>
                  <li>Product authenticity questions, supplement guidance, and stock availability.</li>
                  <li>Wholesale, partnership, and other business-related enquiries.</li>
                </ul>
              </div>

              <div className="rounded-2xl border border-border bg-secondary/40 p-8">
                <h2 className="mb-6 text-2xl font-bold text-foreground">Contact Details</h2>
                <div className="space-y-5 text-muted-foreground">
                  <div className="flex items-start gap-3">
                    <Mail className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <div>
                      <p className="font-medium text-foreground">Email</p>
                      <p>info.sssupplements@gmail.com</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <div>
                      <p className="font-medium text-foreground">Phone Number</p>
                      <p>+91 95478 99170</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <div>
                      <p className="font-medium text-foreground">Office Address</p>
                      <p>
                        Haldia, Bhabanipur, Babajibasa, 721657
                        <br />
                        Near Ambuja City Centre Mall
                        <br />
                        Opposite Meghnath Saha Institute of Technology
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
