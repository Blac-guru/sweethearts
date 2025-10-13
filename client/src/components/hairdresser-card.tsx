import { Card, CardContent } from "@/components/ui/card.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { Phone, MessageCircle, MapPin } from "lucide-react";
import { Link } from "wouter";
import type { HairdresserWithLocation } from "@shared/schema.js";

interface HairdresserCardProps {
  hairdresser: HairdresserWithLocation;
}

export default function HairdresserCard({ hairdresser }: HairdresserCardProps) {
  const whatsappNumber = hairdresser.whatsappNumber || hairdresser.phoneNumber;
  const profileImageUrl =
    hairdresser.profilePhoto ||
    "https://i0.wp.com/exotickenya.date/wp-content/uploads/2024/01/E8Ex9xTWUAMUpEV.jpg?resize=721%2C550&ssl=1";

  // Determine membership plan and corresponding color
  const membershipPlan = hairdresser.membershipPlan || "PRIME";
  const membershipColors: Record<string, string> = {
    VIP: "bg-red-600 text-white",
    PRIME: "bg-yellow-400 text-gray-900",
    REGULAR: "bg-green-500 text-white",
  };
  const badgeClasses = membershipColors[membershipPlan] || membershipColors["PRIME"];

  return (
    <Card className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer border-border">
      <Link href={`/profile/${hairdresser.id}`}>
        <div className="relative">
          {/* Profile Image */}
          <img
            src={profileImageUrl}
            alt={hairdresser.nickName}
            className="w-full h-48 object-cover rounded-t-lg"
            data-testid={`img-hairdresser-${hairdresser.id}`}
          />

          {/* Membership Badge (top-right overlay) */}
          <span
            className={`absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-semibold ${badgeClasses} shadow-md`}
            data-testid={`badge-membership-${hairdresser.id}`}
          >
            {membershipPlan.toUpperCase()}
          </span>
        </div>
      </Link>

      <CardContent className="p-4">
        <h3
          className="font-semibold text-lg text-foreground mb-1"
          data-testid={`text-name-${hairdresser.id}`}
        >
          {hairdresser.nickName}
        </h3>

        <p className="flex items-center text-sm text-gray-500 mb-2">
          <MapPin className="w-3 h-3 mr-1" />
          {hairdresser.estate?.name ?? `Estate ID: ${hairdresser.estateId}`},{" "}
          {hairdresser.town?.name ?? `Town ID: ${hairdresser.townId}`}
        </p>

        <div className="flex flex-wrap gap-1 mb-3">
          {hairdresser.services.slice(0, 3).map((service, index) => (
            <Badge
              key={index}
              className="text-xs bg-gray-200 text-gray-800"
              data-testid={`badge-service-${index}`}
            >
              {service}
            </Badge>
          ))}
          {hairdresser.services.length > 3 && (
            <Badge className="text-xs bg-gray-100 text-gray-700">
              +{hairdresser.services.length - 3} more
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <a
              href={`tel:${hairdresser.phoneNumber}`}
              className="text-primary hover:text-primary/80"
              title={`Call ${hairdresser.fullName}`}
              data-testid={`link-phone-${hairdresser.id}`}
            >
              <Phone className="w-4 h-4" />
            </a>
            {whatsappNumber && (
              <a
                href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 hover:text-green-700"
                title={`WhatsApp ${hairdresser.fullName}`}
                data-testid={`link-whatsapp-${hairdresser.id}`}
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            )}
          </div>
          <Link href={`/profile/${hairdresser.id}`}>
            <Button
              variant="link"
              size="sm"
              className="p-0 h-auto"
              data-testid={`button-view-profile-${hairdresser.id}`}
            >
              View Profile
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
