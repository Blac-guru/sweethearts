import Navbar from "@/components/navbar.jsx";
import { Phone, Twitter, Send } from "lucide-react";
import { Link } from "wouter";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-foreground">Contact Us</h1>
          <p className="text-muted-foreground mt-2">
            We’d love to hear from you! Reach out using any of the channels
            below.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Phone */}
          <div className="bg-card shadow-sm rounded-2xl p-6 flex items-start space-x-4">
            <Phone className="w-6 h-6 text-primary mt-1" />
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Whatsapp
              </h2>
              <a
                href="tel:+254717177069"
                className="block text-primary hover:underline"
              >
                +254 717 177 069
              </a>
            </div>
          </div>

          {/* Telegram (Disabled with hover text) */}
          <a href="https://t.me/mysweetheartnextdoor">
            <div className="bg-card shadow-sm rounded-2xl p-6 flex items-start space-x-4 relative group">
              <Send className="w-6 h-6 text-primary mt-1" />
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  Telegram
                </h2>
                <span className="text-muted-foreground cursor-not-allowed">
                  @mysweetheartnextdoor
                </span>
              </div>
            </div>
          </a>

          {/* Twitter (Disabled with hover text) */}
          <div className="bg-card shadow-sm rounded-2xl p-6 flex items-start space-x-4 relative group">
            <Twitter className="w-6 h-6 text-primary mt-1" />
            <div>
              <h2 className="text-lg font-semibold text-foreground">Twitter</h2>
              <span className="text-muted-foreground cursor-not-allowed">
                @yourtwitterhandle
              </span>
              {/* Tooltip */}
              <div className="absolute top-full mt-1 left-0 opacity-0 group-hover:opacity-100 transition bg-muted text-muted-foreground text-xs px-2 py-1 rounded-md shadow-md">
                Coming soon
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <p className="text-sm text-muted-foreground">
            We aim to respond to all inquiries within 24 hours.
          </p>
        </div>
      </div>
    </div>
  );
}
