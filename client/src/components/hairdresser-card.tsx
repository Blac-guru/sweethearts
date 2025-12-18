import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog.jsx";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel.jsx";
import { Separator } from "@/components/ui/separator.jsx";
import { Phone, MessageCircle, MapPin, Sparkles } from "lucide-react";
import type { HairdresserWithLocation } from "@shared/schema.js";
import { ChatDialog } from "@/components/chat-dialog.jsx";
import { useToast } from "@/hooks/use-toast.js";

interface HairdresserCardProps {
  hairdresser: HairdresserWithLocation;
}

export default function HairdresserCard({ hairdresser }: HairdresserCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const { toast } = useToast();
  const whatsappNumber = hairdresser.whatsappNumber || hairdresser.phoneNumber;
  const fallbackImage =
    "https://i0.wp.com/exotickenya.date/wp-content/uploads/2024/01/E8Ex9xTWUAMUpEV.jpg?resize=721%2C550&ssl=1";

  const galleryImages = useMemo(() => {
    const images = [
      hairdresser.profilePhoto,
      ...(hairdresser.serviceImages ?? []),
    ].filter((img): img is string => Boolean(img));

    if (images.length === 0) return [fallbackImage];
    return Array.from(new Set(images));
  }, [hairdresser.profilePhoto, hairdresser.serviceImages]);

  // Determine membership plan and corresponding color
  const membershipPlan = hairdresser.membershipPlan || "PRIME";
  const membershipColors: Record<string, string> = {
    VIP: "bg-red-600 text-white",
    PRIME: "bg-yellow-400 text-gray-900",
    REGULAR: "bg-green-500 text-white",
  };
  const badgeClasses =
    membershipColors[membershipPlan] || membershipColors["PRIME"];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Card
          className="group overflow-hidden border-border cursor-pointer"
          onClick={() => setIsOpen(true)}
        >
          <div className="relative aspect-[3/4] w-full overflow-hidden">
            <img
              src={galleryImages[0]}
              alt={hairdresser.nickName}
              className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
              data-testid={`img-hairdresser-${hairdresser.id}`}
            />

            <span
              className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold ${badgeClasses} shadow-md`}
              data-testid={`badge-membership-${hairdresser.id}`}
            >
              {membershipPlan.toUpperCase()}
            </span>

            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-80" />
            <div className="absolute bottom-3 left-3 flex items-center gap-2 text-white drop-shadow-lg">
              <h3
                className="text-lg font-semibold"
                data-testid={`text-name-${hairdresser.id}`}
              >
                {hairdresser.nickName}
              </h3>
              <Badge variant="secondary" className="bg-white/90 text-gray-900">
                Tap to view
              </Badge>
            </div>
          </div>
        </Card>
      </DialogTrigger>

      <DialogContent className="max-w-5xl gap-6 p-0 overflow-hidden">
        <div className="grid gap-0 md:grid-cols-[1.15fr_0.85fr]">
          <div className="relative bg-black">
            {galleryImages.length > 1 ? (
              <Carousel opts={{ loop: true }} className="w-full">
                <CarouselContent>
                  {galleryImages.map((image, index) => (
                    <CarouselItem key={index} className="aspect-[4/5]">
                      <img
                        src={image}
                        alt={`${hairdresser.nickName}-${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="border-none bg-white/90 text-gray-900 hover:bg-white" />
                <CarouselNext className="border-none bg-white/90 text-gray-900 hover:bg-white" />
              </Carousel>
            ) : (
              <img
                src={galleryImages[0]}
                alt={hairdresser.nickName}
                className="h-full w-full object-cover"
              />
            )}
          </div>

          <div className="space-y-4 p-6">
            <DialogHeader>
              <div className="flex items-center gap-3">
                <DialogTitle className="text-2xl font-semibold">
                  {hairdresser.nickName}
                </DialogTitle>
                <Badge className={`text-xs ${badgeClasses}`}>
                  {membershipPlan.toUpperCase()}
                </Badge>
              </div>
              <DialogDescription className="text-sm text-muted-foreground">
                {hairdresser.age} • {hairdresser.gender} •{" "}
                {hairdresser.orientation}
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>
                {hairdresser.estate?.name ??
                  `Estate ID: ${hairdresser.estateId}`}
                , {hairdresser.town?.name ?? `Town ID: ${hairdresser.townId}`}
              </span>
            </div>

            <Separator />

            <div className="space-y-3">
              <p className="text-sm font-medium text-foreground">
                Interests & vibe
              </p>
              <div className="flex flex-wrap gap-2">
                {hairdresser.services.map((service, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="bg-muted text-foreground"
                    data-testid={`badge-service-${index}`}
                  >
                    {service}
                  </Badge>
                ))}
                {hairdresser.services.length === 0 && (
                  <span className="text-sm text-muted-foreground">
                    No services listed yet.
                  </span>
                )}
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="secondary"
                className="justify-start gap-2"
                asChild
                data-testid={`link-phone-${hairdresser.id}`}
              >
                <a href={`tel:${hairdresser.phoneNumber}`}>
                  <Phone className="h-4 w-4" /> Call
                </a>
              </Button>
              <Button
                variant="secondary"
                className="justify-start gap-2"
                disabled={!whatsappNumber}
                asChild={Boolean(whatsappNumber)}
                data-testid={`link-whatsapp-${hairdresser.id}`}
              >
                {whatsappNumber ? (
                  <a
                    href={`https://wa.me/${whatsappNumber.replace(
                      /[^0-9]/g,
                      ""
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="h-4 w-4" /> WhatsApp
                  </a>
                ) : (
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <MessageCircle className="h-4 w-4" /> WhatsApp unavailable
                  </span>
                )}
              </Button>
              <Button
                variant="outline"
                className="justify-start gap-2"
                onClick={() => setChatOpen(true)}
              >
                <MessageCircle className="h-4 w-4" /> Chat
              </Button>
              <Badge className="flex w-full items-center gap-2 bg-purple-100 text-purple-900">
                <Sparkles className="h-4 w-4" /> Verified vibes pending
              </Badge>
            </div>

            <div className="rounded-xl bg-muted/40 p-4 text-sm text-muted-foreground">
              Swipe through their photos to get a feel, then reach out when you
              are ready.
            </div>
          </div>
        </div>
      </DialogContent>
      <ChatDialog
        open={chatOpen}
        onOpenChange={setChatOpen}
        recipientId={hairdresser.firebaseUid || hairdresser.id}
        recipientName={hairdresser.nickName}
      />
    </Dialog>
  );
}
