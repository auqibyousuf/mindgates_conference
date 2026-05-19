import Link from "next/link";
import { Mail, Phone, MapPin, ExternalLink } from "lucide-react";
import siteConfig from "@/data/siteConfig.json";
import Logo from "@/components/ui/Logo";

export default function Footer() {
  return (
    <footer className="bg-slate-50 text-foreground border-t border-slate-200 py-8 sm:py-12 md:py-16">
      <div className="section-container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-12 md:mb-16">
          {/* Brand & About */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-3 group shrink-0 w-fit">
              <div className="bg-primary p-2 rounded-xl transition-all duration-500 group-hover:rotate-12 group-hover:scale-110 shadow-lg shadow-primary/20 flex items-center justify-center">
                <Logo className="size-5" variant="white" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-base font-black tracking-tight leading-tight text-primary">
                  Mindgates Research
                </span>
                <span className="text-[8px] uppercase tracking-[0.2em] font-black leading-none text-foreground/40 mt-0.5">
                  Conference Forum
                </span>
              </div>
            </Link>
            <p className="text-foreground/60 text-sm leading-relaxed">
              {siteConfig.description}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-lg font-bold mb-6">Quick Links</h4>
            <ul className="space-y-4">
              {["Conferences", "Books Published", "Awards", "Gallery", "About Us"].map((link) => (
                <li key={link}>
                  <Link 
                    href={`/${link.toLowerCase().replace(" ", "-")}`}
                    className="text-foreground/60 hover:text-primary text-sm transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/40 group-hover:bg-primary transition-colors" />
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-serif text-lg font-bold mb-6">Contact Us</h4>
            <ul className="space-y-6">
              <li className="flex items-start gap-3 text-sm text-foreground/60">
                <MapPin className="size-5 text-primary shrink-0" />
                <div className="space-y-2">
                  <p className="font-bold text-foreground/80">Srinagar Office:</p>
                  <p>Mindgates Softtech Solutions, Bulbul Bagh Barzulla Srinagar-190005</p>
                </div>
              </li>
              <li className="flex items-start gap-3 text-sm text-foreground/60">
                <MapPin className="size-5 text-primary shrink-0" />
                <div className="space-y-2">
                  <p className="font-bold text-foreground/80">Jammu Office:</p>
                  <p>Anand Nagar Bohri Jammu</p>
                </div>
              </li>
              <li className="flex items-center gap-3 text-sm text-foreground/60">
                <Phone className="size-5 text-primary shrink-0" />
                <span>7006472072, 6005221157</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-foreground/60">
                <Mail className="size-5 text-primary shrink-0" />
                <span>info@mindgatesresearch.in</span>
              </li>
            </ul>
          </div>

          {/* Organization */}
          <div>
            <h4 className="font-serif text-lg font-bold mb-6">Organization</h4>
            <div className="glass-card bg-white shadow-xl border-slate-200 p-5 space-y-3">
              <span className="text-[10px] uppercase tracking-widest font-bold text-primary">Managed by</span>
              <p className="text-sm font-bold">Mindgates Softtech Solutions Pvt Ltd</p>
              <Link 
                href="https://conferenceevent.in" 
                target="_blank"
                className="inline-flex items-center gap-2 text-xs text-primary hover:underline"
              >
                Visit Organization <ExternalLink className="size-3" />
              </Link>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-foreground/40" suppressHydrationWarning>
            © {new Date().getFullYear()} Mindgates Research conference forum. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="#" className="text-xs text-foreground/40 hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link href="#" className="text-xs text-foreground/40 hover:text-foreground transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
