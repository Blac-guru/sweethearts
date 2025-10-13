import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Button } from "@/components/ui/button.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { Card, CardContent } from "@/components/ui/card.jsx";
import { Skeleton } from "@/components/ui/skeleton.jsx";
import {
  ArrowLeft,
  Phone,
  MessageCircle,
  MapPin,
  Mail,
  Eye,
} from "lucide-react";
import { Link } from "wouter";
import Navbar from "@/components/navbar.jsx";
import type { HairdresserWithLocation } from "@shared/schema.js";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input.jsx";
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast.js";

// imports
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase.js";
import { useAuthStore } from "@/store/useAuthStore.js";

export default function ProfilePage() {
  const [user] = useAuthState(auth);
  const [match, params] = useRoute("/profile/:id");
  const hairdresserId = params?.id;
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const userEmail = useAuthStore((state) => state.userEmail);

  const [phoneForPayment, setPhoneForPayment] = useState("");
  const [emailForPayment, setEmailForPayment] = useState(userEmail || "");
  const [payLoading, setPayLoading] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedImage(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const queryClient = useQueryClient();

  const {
    data: hairdresser,
    isLoading,
    error,
  } = useQuery<HairdresserWithLocation>({
    queryKey: ["hairdresser", hairdresserId],
    enabled: !!hairdresserId,
    queryFn: async () => {
      const res = await fetch(`/api/hairdressers/${hairdresserId}`);
      if (!res.ok) {
        throw new Error("Failed to load hairdresser data");
      }
      return res.json();
    },
  });

  if (!match || !hairdresserId) {
    return <div>Profile not found</div>;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center" data-testid="error-message">
            <p className="text-destructive">
              Failed to load hairdresser profile
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Skeleton className="h-8 w-32 mb-6" />
          <Card>
            <div className="bg-gradient-to-r from-primary to-primary/80 p-8">
              <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
                <Skeleton className="w-32 h-32 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-8 w-48" />
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-6 w-64" />
                  <div className="flex space-x-4">
                    <Skeleton className="h-10 w-24" />
                    <Skeleton className="h-10 w-24" />
                  </div>
                </div>
              </div>
            </div>
            <CardContent className="p-8">
              <div className="space-y-6">
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-48 w-full" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!hairdresser) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center" data-testid="not-found">
            <p className="text-muted-foreground">Hairdresser not found</p>
          </div>
        </div>
      </div>
    );
  }

  const whatsappNumber = hairdresser.whatsappNumber || hairdresser.phoneNumber;
  const profileImageUrl =
    hairdresser.profilePhoto || "/api/placeholder/200/200";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/">
          <Button variant="ghost" className="mb-6" data-testid="button-back">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Search
          </Button>
        </Link>

        <Card className="overflow-hidden">
          {/* Profile Header */}
          <div className="relative bg-gradient-to-r from-primary to-primary/80 text-white p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
              <div className="relative">
                <img
                  src={profileImageUrl}
                  alt={hairdresser.nickName}
                  className="w-32 h-32 object-cover rounded-full border-4 border-white shadow-lg cursor-pointer hover:opacity-90 transition"
                  data-testid="img-profile"
                  onClick={() => setSelectedImage(profileImageUrl)}
                />

                {/* Membership Badge (top-right overlay) */}
                {(() => {
                  const membershipPlan = hairdresser.membershipPlan || "PRIME";
                  const membershipColors: Record<string, string> = {
                    VIP: "bg-red-600 text-white",
                    PRIME: "bg-yellow-400 text-gray-900",
                    REGULAR: "bg-green-500 text-white",
                  };
                  const badgeClasses =
                    membershipColors[membershipPlan] ||
                    membershipColors["PRIME"];

                  return (
                    <span
                      className={`absolute -top-2 -right-2 px-4 py-2 rounded-full text-sm font-semibold shadow-md ${badgeClasses}`}
                      data-testid="badge-membership-profile"
                    >
                      {membershipPlan.toUpperCase()}
                    </span>
                  );
                })()}
              </div>

              <div className="text-center md:text-left">
                <h1
                  className="text-3xl font-bold mb-2"
                  data-testid="text-nickname"
                >
                  {hairdresser.nickName}
                </h1>
                <p
                  className="text-lg opacity-90 mb-2"
                  data-testid="text-gender"
                >
                  {hairdresser.gender}
                </p>
                <p className="text-lg opacity-90 mb-8" data-testid="text-age">
                  Age: <b>{hairdresser.age}</b>
                </p>
                {user?.uid === hairdresser.firebaseUid && (
                  <div className="mt-2">
                    {hairdresser.isPaid ? (
                      <Badge className="bg-green-600 text-white">Paid</Badge>
                    ) : (
                      <Badge className="bg-red-600 text-white">
                        Payment Pending
                      </Badge>
                    )}
                  </div>
                )}

                {user?.uid === hairdresser.firebaseUid && (
                  <div className="mt-4 flex items-center justify-center md:justify-start">
                    <Card className="bg-white text-foreground shadow-sm">
                      <CardContent className="flex items-center gap-2 p-2">
                        <Eye className="w-5 h-5 text-indigo-600" />
                        <span className="font-semibold">
                          {hairdresser.views || 0}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          Profile Views
                        </span>
                      </CardContent>
                    </Card>
                  </div>
                )}

                <p className="opacity-80 mb-4 flex items-center justify-center md:justify-start">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span data-testid="text-location">
                    {hairdresser.subEstate.name}, {hairdresser.estate.name},{" "}
                    {hairdresser.town.name}
                  </span>
                </p>
                <div className="flex justify-center md:justify-start space-x-4">
                  <a
                    href={`tel:${hairdresser.phoneNumber}`}
                    className="bg-white text-primary px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors inline-flex items-center"
                    data-testid="button-call"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Call Now
                  </a>
                  <a
                    href={`https://wa.me/${whatsappNumber.replace(
                      /[^0-9]/g,
                      ""
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors inline-flex items-center"
                    data-testid="button-whatsapp"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <CardContent className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Contact Information */}
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  Contact Information
                </h2>
                <div className="space-y-3">
                  <div
                    className="flex items-center"
                    data-testid="contact-phone"
                  >
                    <Phone className="w-5 h-5 text-muted-foreground mr-3" />
                    <span className="text-foreground">
                      {hairdresser.phoneNumber}
                    </span>
                  </div>
                  <div
                    className="flex items-center"
                    data-testid="contact-whatsapp"
                  >
                    <MessageCircle className="w-5 h-5 text-green-600 mr-3" />
                    <span className="text-foreground">{whatsappNumber}</span>
                  </div>
                  {hairdresser.email && (
                    <div
                      className="flex items-center"
                      data-testid="contact-email"
                    >
                      <Mail className="w-5 h-5 text-muted-foreground mr-3" />
                      <span className="text-foreground">
                        {hairdresser.email}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Location Details */}
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  Location
                </h2>
                <div className="space-y-2" data-testid="location-details">
                  <div>
                    <span className="font-medium">Country:</span> Kenya
                  </div>
                  <div>
                    <span className="font-medium">Town:</span>{" "}
                    {hairdresser.town.name}
                  </div>
                  <div>
                    <span className="font-medium">Estate:</span>{" "}
                    {hairdresser.estate.name}
                  </div>
                  <div>
                    <span className="font-medium">Sub-Estate:</span>{" "}
                    {hairdresser.subEstate.name}
                  </div>
                </div>
              </div>
            </div>
            {/* Services Offered */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                Services Offered
              </h2>
              <div className="flex flex-wrap gap-2" data-testid="services-list">
                {hairdresser.services.map((service, index) => (
                  <Badge key={index} className="px-3 py-1">
                    {service}
                  </Badge>
                ))}
              </div>
            </div>
            {/* Service Images Gallery */}
            {hairdresser.serviceImages &&
              hairdresser.serviceImages.length > 0 && (
                <div className="mt-8">
                  <h2 className="text-xl font-semibold text-foreground mb-4">
                    Gallery
                  </h2>
                  <div
                    className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                    data-testid="service-images"
                  >
                    {hairdresser.serviceImages.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`Service work ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg shadow-sm cursor-pointer hover:opacity-80 transition"
                        data-testid={`img-service-${index}`}
                        onClick={() => setSelectedImage(image)}
                      />
                    ))}
                  </div>
                </div>
              )}
            {/*  Payment functionality for profile */}
            {!hairdresser.isPaid && user?.uid === hairdresser.firebaseUid && (
              <div className="mt-12 border-t pt-8">
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  Complete Your Registration
                </h2>
                <p className="text-muted-foreground mb-6">
                  Pay the registration fee to activate your profile.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col">
                    <label
                      htmlFor="phone"
                      className="text-sm font-medium text-foreground mb-2"
                    >
                      M-PESA Number
                    </label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+254700000000"
                      value={phoneForPayment}
                      onChange={(e) => setPhoneForPayment(e.target.value)}
                      required
                    />
                  </div>

                  <div className="flex flex-col">
                    <label
                      htmlFor="email"
                      className="text-sm font-medium text-foreground mb-2"
                    >
                      Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={emailForPayment}
                      onChange={(e) => setEmailForPayment(e.target.value)}
                      required
                      readOnly={!!(userEmail || hairdresser.email)} // ✅ Make readonly if registered email exists
                      className={
                        userEmail || hairdresser.email
                          ? "bg-gray-100 cursor-not-allowed"
                          : ""
                      }
                    />
                  </div>
                </div>

                <div className="mt-6 flex flex-col sm:flex-row sm:justify-end gap-3">
                  <Button
                    onClick={async () => {
                      setPayLoading(true);
                      try {
                        const rsp = await fetch(
                          `/api/hairdressers/${hairdresserId}/initiate-payment`,
                          {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              phoneNumber: phoneForPayment,
                              email: emailForPayment || undefined,
                            }),
                          }
                        );
                        const data = await rsp.json();
                        if (!rsp.ok) {
                          throw new Error(
                            data.message ||
                              data?.error ||
                              "Initialization failed"
                          );
                        }
                        const authUrl = data?.data?.authorization_url;
                        if (!authUrl)
                          throw new Error("No authorization url from Paystack");
                        window.location.href = authUrl; // redirect to Paystack
                      } catch (err: any) {
                        toast({
                          title: "Payment initiation failed",
                          description: err.message || "Try again",
                          variant: "destructive",
                        });
                      } finally {
                        setPayLoading(false);
                      }
                    }}
                    disabled={
                      payLoading || !phoneForPayment || !emailForPayment
                    }
                    className="w-full sm:w-auto"
                  >
                    {payLoading ? "Initiating..." : "Pay Now"}
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => {
                      setPhoneForPayment("");
                      if (!userEmail && !hairdresser.email) {
                        // ✅ Only reset email if it's not already fixed
                        setEmailForPayment("");
                      }
                    }}
                    className="w-full sm:w-auto"
                  >
                    Reset
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt="Selected work sample"
            className="max-w-[100vw] max-h-[100vh] rounded-lg shadow-2xl object-contain"
          />
          <button
            className="absolute top-6 right-6 text-white text-3xl font-bold bg-black/50 rounded-full px-3 py-1 hover:bg-black transition"
            onClick={() => setSelectedImage(null)}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
