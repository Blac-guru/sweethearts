import { Link } from "wouter";
import logoIcon from "@/assets/hearts.png";

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo + About */}
          <div className="flex flex-col items-start space-y-3">
            <div className="flex items-center gap-2">
              <img
                src={logoIcon}
                alt="Site Logo"
                className="h-8 w-8 object-contain"
              />
              <span className="text-lg font-bold text-primary">
                My Sweetheart Next Door
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              A safe and professional platform for adults to connect, book
              services, and explore opportunities. 
            </p>
          </div>

          {/* Navigation */}
          <div className="flex flex-col space-y-2">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
              Navigate
            </h3>
            <Link href="/contact">
              <span className="text-sm text-muted-foreground hover:text-primary cursor-pointer">
                Contact Us
              </span>
            </Link>
            <Link href="/register">
              <span className="text-sm text-muted-foreground hover:text-primary cursor-pointer">
                Join Today
              </span>
            </Link>
          </div>

          {/* Legal */}
          <div className="flex flex-col space-y-2">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
              Legal
            </h3>
            <Link href="/terms">
              <span className="text-sm text-muted-foreground hover:text-primary cursor-pointer">
                Terms & Conditions
              </span>
            </Link>
            <Link href="/parental-control">
              <span className="text-sm text-muted-foreground hover:text-primary cursor-pointer">
                Parental Controls
              </span>
            </Link>
            <Link href="/privacy">
              <span className="text-sm text-muted-foreground hover:text-primary cursor-pointer">
                Privacy Policy
              </span>
            </Link>
            <Link href="/cookie-policy">
              <span className="text-sm text-muted-foreground hover:text-primary cursor-pointer">
                Cookie Policy
              </span>
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border mt-8 pt-6 text-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} MyFavSweetheart. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
