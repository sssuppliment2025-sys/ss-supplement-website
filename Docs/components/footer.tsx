import Image from "next/image"
import Link from "next/link"
import { Phone, Mail, MapPin, Facebook, Instagram, Youtube, Send } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Image
                src="/ss-supplements-logo.jpeg"
                alt="SS Supplement logo"
                width={44}
                height={44}
                className="h-11 w-11 rounded-xl object-cover"
              />
              <div>
                <h3 className="font-bold text-lg text-foreground">SS Supplement</h3>
                <p className="text-xs text-muted-foreground">Your Fitness Partner</p>
              </div>
            </div>
            <p className="text-muted-foreground text-sm mb-4">
              Your one-step destination for premium quality health supplements. We offer 100% authentic products from
              top brands.
            </p>
            <div className="flex gap-3">
              <a href="https://www.facebook.com/share/1AgAAprSJz/" className="text-muted-foreground hover:text-primary">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://www.instagram.com/sssupplements.fitness?igsh=aDdzdDYxb2cza2d2" className="text-muted-foreground hover:text-primary">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://youtube.com/@sssupplements.fitness?si=aq8DptOS0v0MOxRe" className="text-muted-foreground hover:text-primary">
                <Youtube className="h-5 w-5" />
              </a>
              <a href="https://t.me/SS_SUPPLEMENTS" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                <Send className="h-5 w-5" />
              </a>
              <a href="https://whatsapp.com/channel/0029Vb6AZutDJ6H0JYbZ312f" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/track-order" className="text-muted-foreground hover:text-primary">
                  Track Order
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-muted-foreground hover:text-primary">
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-muted-foreground hover:text-primary">
                  FAQs
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Categories</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/category/Whey Protein" className="text-muted-foreground hover:text-primary">
                  Whey Protein
                </Link>
              </li>
              <li>
                <Link href="/category/Creatine" className="text-muted-foreground hover:text-primary">
                  Creatine
                </Link>
              </li>
              <li>
                <Link href="/category/Mass Gainer" className="text-muted-foreground hover:text-primary">
                  Mass Gainer
                </Link>
              </li>
              <li>
                <Link href="/category/Pre Workout" className="text-muted-foreground hover:text-primary">
                  Pre Workout
                </Link>
              </li>
              <li>
                <Link href="/category/Accessories" className="text-muted-foreground hover:text-primary">
                  Accessories
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm mb-6">
              <li className="flex items-start gap-2">
                <MapPin className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <span className="text-muted-foreground">Haldia, Bhabanipur ,Babajibasa, 721657
                                                        Near Ambuja City centre Mall 
                                                        Opposite Meghnath Saha institute of technology
                                                        </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-primary shrink-0" />
                <span className="text-muted-foreground">+91 95478 99170</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary shrink-0" />
                <span className="text-muted-foreground">info@sssupplement.com</span>
              </li>
            </ul>

            <h4 className="font-semibold text-foreground mb-2">Newsletter</h4>
            <div className="flex gap-2">
              <Input type="email" placeholder="Your email" className="bg-secondary border-border text-sm" />
              <Button size="sm" className="bg-primary hover:bg-primary/90">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border mt-8 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">© 2026 SS Supplement. All rights reserved.</p>
            <div className="flex items-center gap-4 text-sm">
              <Link href="/privacy" className="text-muted-foreground hover:text-primary">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-muted-foreground hover:text-primary">
                Terms of Service
              </Link>
              <Link href="/shipping" className="text-muted-foreground hover:text-primary">
                Shipping Policy
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">FSSAI License:</span>
              <span className="text-xs text-foreground">22825162000174</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
