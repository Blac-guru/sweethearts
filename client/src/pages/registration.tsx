import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { insertHairdresserSchema } from "@shared/schema.js";
import { Button } from "@/components/ui/button.jsx";
import { Card, CardContent } from "@/components/ui/card.jsx";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form.jsx";
import { Input } from "@/components/ui/input.jsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.jsx";
import { useToast } from "@/hooks/use-toast.js";
import { apiRequest } from "@/lib/queryClient.js";
import { Camera, Images, Loader2, CreditCard, Check } from "lucide-react";
import { useLocation } from "wouter";
import Navbar from "@/components/navbar.jsx";
import { HAIR_SERVICES, KENYA_LOCATIONS } from "@/data/kenya-locations.js";
import { z } from "zod";
import { globalToken } from "./setup-account.jsx";
import { useAuthStore } from "@/store/useAuthStore.js";
import { Checkbox } from "@/components/ui/checkbox.jsx";
import ServicesDropdown from "@/components/select-services.jsx";
import { getAuth } from "firebase/auth";

const formSchema = insertHairdresserSchema.extend({
  profilePhoto: z.any().optional(),
  serviceImages: z.any().optional(),
  townId: z.number(),
  estateId: z.number(),
  subEstateId: z.number(),
});

type FormData = z.infer<typeof formSchema>;

export default function RegistrationPage() {
  const [, setLocation] = useLocation();
  const [town, setTown] = useState("all");
  const [estate, setEstate] = useState("all");
  const [subEstate, setSubEstate] = useState("all");
  const [isAdult, setIsAdult] = useState<boolean | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Track selected membership and monthly amount
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [monthlyAmount, setMonthlyAmount] = useState<number>(0);

  const userEmail = useAuthStore((state) => state.userEmail);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      gender: "",
      age: "0",
      phoneNumber: "",
      whatsappNumber: "",
      views: 0,
      email: "",
      townId: 0,
      estateId: 0,
      subEstateId: 0,
      services: [],
      membershipPlan: "",
      isAdult: false,
    },
  });

  localStorage.setItem("isAdult", "true");
  localStorage.setItem("termsAgreed", "true");

  // 🔹 All Towns
  // Towns list
  // Fetch counties
  const allTowns = useMemo(
    () => KENYA_LOCATIONS.flatMap((loc) => loc.towns.map((t) => t.name)).sort(),
    []
  );

  // 🔹 Estates for the selected town
  const estates = useMemo(() => {
    if (town === "all") return [];
    const found = KENYA_LOCATIONS.flatMap((loc) => loc.towns).find(
      (t) => t.name === town
    );
    return found?.estates?.map((e) => e.name) || [];
  }, [town]);

  // 🔹 Sub-Estates depend on selected town + estate
  const subEstates = useMemo(() => {
    if (town === "all" || estate === "all") return [];
    const foundTown = KENYA_LOCATIONS.flatMap((loc) => loc.towns).find(
      (t) => t.name === town
    );
    if (!foundTown) return [];

    const foundEstate = foundTown.estates?.find((e) => e.name === estate);
    return foundEstate?.subEstates?.map((s) => s.name) || []; // ✅ fixed here
  }, [town, estate]);

  const registerMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const formData = new FormData();

      const auth = getAuth();
      const user = auth.currentUser;
      if (!user?.uid) throw new Error("Not authenticated.");

      // Text fields
      if (data.fullName) {
        formData.append("fullName", data.fullName);
      }
      if (data.nickName) {
        formData.append("nickName", data.nickName);
      }
      formData.append("age", String(data.age));
      if (data.gender) {
        formData.append("gender", data.gender);
      }
      if (data.orientation) {
        formData.append("orientation", data.orientation);
      }
      if (data.phoneNumber) {
        formData.append("phoneNumber", data.phoneNumber);
      }
      if (data.whatsappNumber)
        formData.append("whatsappNumber", data.whatsappNumber);
      if (data.email) formData.append("email", data.email);
      formData.append("townId", String(data.townId));
      formData.append("estateId", String(data.estateId));
      formData.append("subEstateId", String(data.subEstateId));
      formData.append("membershipPlan", String(data.membershipPlan));
      formData.append("firebaseUid", user.uid);

      // Services array
      data.services.forEach((service) => {
        formData.append("services", JSON.stringify(data.services));
      });

      // Profile photo (single file)
      if (
        data.profilePhoto instanceof FileList &&
        data.profilePhoto.length > 0
      ) {
        formData.append("profilePhoto", data.profilePhoto[0]);
      }
      if (
        data.serviceImages instanceof FileList &&
        data.serviceImages.length > 0
      ) {
        Array.from(data.serviceImages).forEach((file) =>
          formData.append("serviceImages", file)
        );
      }

      return apiRequest("POST", "/api/hairdressers", formData, globalToken);
    },
    onSuccess: async (response) => {
      const hairdresser = await response.json();
      toast({
        title: "Registration Successful",
        description:
          "Your account has been created. Complete payment from your profile to activate your account.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/hairdressers"] });

      // 🔹verification step
      setLocation(`/verify/${hairdresser.id}`);
    },

    onError: (error) => {
      toast({
        title: "Registration Failed",
        description: error.message || "Failed to register. Please try again.",
        variant: "destructive",
      });
    },
  });

  const getSelectedIds = () => {
    const townObj = KENYA_LOCATIONS.flatMap((loc) => loc.towns).find(
      (t) => t.name === town
    );
    const estateObj = townObj?.estates?.find((e) => e.name === estate);
    const subEstateObj = estateObj?.subEstates?.find(
      (s) => s.name === subEstate
    );

    return {
      townId: townObj?.id ?? 0,
      estateId: estateObj?.id ?? 0,
      subEstateId: subEstateObj?.id ?? 0,
    };
  };

  const onSubmit = (data: FormData) => {
    const { townId, estateId, subEstateId } = getSelectedIds();
    if (isAdult === false) {
      return;
    }

    if (isAdult === null) {
      toast({
        title: "Age Confirmation Required",
        description: "Please confirm that you are 18 years or older.",
        variant: "destructive",
      });
      return;
    }

    const formDataWithIds: FormData = {
      ...data,
      townId,
      estateId,
      subEstateId,
      membershipPlan: selectedPlan || "REGULAR",
      nextPaymentFee: 0,
      isAdult: true,
    };
    if (selectedPlan === "VIP") formDataWithIds.nextPaymentFee = 2000;
    if (selectedPlan === "PRIME") formDataWithIds.nextPaymentFee = 1500;
    if (selectedPlan === "REGULAR") formDataWithIds.nextPaymentFee = 1000;

    registerMutation.mutate(formDataWithIds);
  };

  const handleServiceChange = (service: string, checked: boolean) => {
    const currentServices = form.getValues("services");
    if (checked) {
      form.setValue("services", [...currentServices, service]);
    } else {
      form.setValue(
        "services",
        currentServices.filter((s) => s !== service)
      );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1
            className="text-3xl font-bold text-foreground"
            data-testid="registration-title"
          >
            Join Sweetheart Next Door
          </h1>
          <p
            className="text-muted-foreground mt-2"
            data-testid="registration-subtitle"
          >
            Complete your registration
          </p>
        </div>

        <Card>
          <CardContent className="p-8">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {/* Personal Information */}
                <div>
                  <h2 className="text-lg font-semibold text-foreground mb-4">
                    Personal Information
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your full name"
                              {...field}
                              data-testid="input-fullname"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="nickName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>NickName *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your nick name"
                              {...field}
                              data-testid="input-nickname"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="age"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Age *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your age"
                              {...field}
                              data-testid="input-age"
                              onFocus={(e) => e.target.select()} // ✅ Auto-selects text on focus
                              type="number" // ✅ restricts to numeric input
                              min={1}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gender *</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger data-testid="select-gender">
                                <SelectValue placeholder="Select Gender" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Female">Female</SelectItem>
                              <SelectItem value="Male">Male</SelectItem>
                              <SelectItem value="non-binary">
                                Non-Binary
                              </SelectItem>
                              <SelectItem value="prefer-not-to-say">
                                Prefer Not To Say
                              </SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="orientation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Orientation</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger data-testid="select-orientation">
                                <SelectValue placeholder="Select Orientation" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Straight">Straight</SelectItem>
                              <SelectItem value="Lesbian">Lesbian</SelectItem>
                              <SelectItem value="Gay">Gay</SelectItem>
                              <SelectItem value="transgender">
                                Transgender
                              </SelectItem>
                              <SelectItem value="Bisexual">Bisexual</SelectItem>
                              <SelectItem value="Asexual">Asexual</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Contact Information */}
                <div>
                  <h2 className="text-lg font-semibold text-foreground mb-4">
                    Contact Information
                  </h2>

                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="phoneNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number *</FormLabel>
                          <FormControl>
                            <Input
                              type="tel"
                              placeholder="+254 700 000 000"
                              {...field}
                              data-testid="input-phone"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="whatsappNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>WhatsApp Number</FormLabel>
                          <FormControl>
                            <Input
                              type="tel"
                              placeholder="+254 700 000 000 (Optional)"
                              {...field}
                              value={field.value || ""}
                              data-testid="input-whatsapp"
                            />
                          </FormControl>
                          <p className="text-xs text-muted-foreground">
                            Leave blank to use phone number
                          </p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="your.email@example.com"
                              {...field}
                              value={field.value || userEmail || ""} // ✅ fallback to global email
                              readOnly // ✅ prevent editing
                              data-testid="input-email"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Location Information */}
                <div>
                  <h2 className="text-lg font-semibold text-foreground mb-4">
                    Location
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Town */}
                    <FormField
                      control={form.control}
                      name="townId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Town *</FormLabel>
                          <Select
                            value={town}
                            onValueChange={(value) => {
                              setTown(value);
                              setEstate("all");
                              setSubEstate("all");
                            }}
                          >
                            <FormControl>
                              <SelectTrigger data-testid="select-town">
                                <SelectValue placeholder="Select Town" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="all">All Towns</SelectItem>
                              {allTowns.map((t) => (
                                <SelectItem key={t} value={t}>
                                  {t}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Estate */}
                    <FormField
                      control={form.control}
                      name="estateId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Estate *</FormLabel>
                          <Select
                            value={estate}
                            onValueChange={(value) => {
                              setEstate(value);
                              setSubEstate("all");
                            }}
                            disabled={town === "all"}
                          >
                            <FormControl>
                              <SelectTrigger data-testid="select-estate">
                                <SelectValue placeholder="Select Estate" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="all">All Estates</SelectItem>
                              {estates.map((e) => (
                                <SelectItem key={e} value={e}>
                                  {e}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Sub-Estate */}
                    <FormField
                      control={form.control}
                      name="subEstateId"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Sub-Estate *</FormLabel>
                          <Select
                            value={subEstate}
                            onValueChange={(value) => {
                              setSubEstate(value);
                            }}
                          >
                            <FormControl>
                              <SelectTrigger data-testid="select-sub-estate">
                                <SelectValue placeholder="Select Sub-Estate" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="all">
                                All Sub-Estates
                              </SelectItem>
                              {subEstates.map((s) => (
                                <SelectItem key={s} value={s}>
                                  {s}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Services Offered */}
                <div>
                  <h2 className="text-lg font-semibold text-foreground mb-4">
                    Services Offered *
                  </h2>
                  <FormField
                    control={form.control}
                    name="services"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Services Offered *</FormLabel>
                        <FormControl>
                          <ServicesDropdown
                            value={field.value || []}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {form.formState.errors.services && (
                    <p className="text-sm text-destructive mt-2">
                      At least one service is required
                    </p>
                  )}
                </div>

                {/* Membership Selection */}
                <div>
                  <h2 className="text-lg font-semibold text-foreground mb-4">
                    Membership Plan *
                  </h2>

                  <div className="flex flex-col sm:flex-row gap-4 mb-3">
                    {[
                      { label: "VIP", amount: 2000 },
                      { label: "PRIME", amount: 1500 },
                      { label: "REGULAR", amount: 1000 },
                    ].map((plan) => (
                      <Button
                        key={plan.label}
                        type="button"
                        variant={
                          selectedPlan === plan.label ? "default" : "outline"
                        }
                        className="flex-1"
                        onClick={() => {
                          setSelectedPlan(plan.label);
                          setMonthlyAmount(plan.amount);
                        }}
                      >
                        {plan.label}
                      </Button>
                    ))}
                  </div>

                  {selectedPlan && (
                    <p className="text-sm text-gray-700">
                      You selected <strong>{selectedPlan}</strong>. Monthly
                      Payment:{" "}
                      <strong>KES {monthlyAmount.toLocaleString()}</strong>
                    </p>
                  )}
                </div>

                {/* Photo Uploads */}
                <div>
                  <h2 className="text-lg font-semibold text-foreground mb-4">
                    Photos
                  </h2>

                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="profilePhoto"
                      render={({ field: { onChange, value, ...field } }) => (
                        <FormItem>
                          <FormLabel>Profile Photo *</FormLabel>
                          <FormControl>
                            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                              <Camera className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                              <p className="text-muted-foreground mb-2">
                                Click to upload your profile photo
                              </p>
                              <Input
                                type="file"
                                accept="image/*"
                                onChange={(e) => onChange(e.target.files)}
                                className="hidden"
                                id="profilePhoto"
                                {...field}
                              />
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() =>
                                  document
                                    .getElementById("profilePhoto")
                                    ?.click()
                                }
                              >
                                Choose File
                              </Button>

                              {/* ✅ Preview */}
                              {value instanceof FileList &&
                                value.length > 0 && (
                                  <div className="mt-4">
                                    <img
                                      src={URL.createObjectURL(value[0])}
                                      alt="Profile Preview"
                                      className="w-24 h-24 rounded-full object-cover mx-auto"
                                    />
                                    <p className="text-sm text-muted-foreground mt-2">
                                      {value[0].name}
                                    </p>
                                  </div>
                                )}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="serviceImages"
                      render={({ field: { onChange, value, ...field } }) => (
                        <FormItem>
                          <FormLabel>Service Images</FormLabel>
                          <FormControl>
                            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                              <Images className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                              <p className="text-muted-foreground mb-2">
                                Upload your gallery (up to 10 images)
                              </p>
                              <Input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={(e) => onChange(e.target.files)}
                                className="hidden"
                                id="serviceImages"
                                {...field}
                              />
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() =>
                                  document
                                    .getElementById("serviceImages")
                                    ?.click()
                                }
                              >
                                Choose Files
                              </Button>

                              {/* ✅ Thumbnails */}
                              {value instanceof FileList &&
                                value.length > 0 && (
                                  <div className="grid grid-cols-3 gap-3 mt-4">
                                    {Array.from(value).map((file, idx) => (
                                      <div key={idx} className="relative">
                                        <img
                                          src={URL.createObjectURL(file)}
                                          alt={`Preview ${idx + 1}`}
                                          className="w-24 h-24 rounded-lg object-cover"
                                        />
                                        <p className="text-xs text-muted-foreground truncate mt-1">
                                          {file.name}
                                        </p>
                                      </div>
                                    ))}
                                  </div>
                                )}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Age Confirmation */}
                <div>
                  <h2 className="text-lg font-semibold text-foreground mb-4">
                    Are you 18 years or older? *
                  </h2>

                  <div className="flex gap-4 mb-6">
                    <Button
                      type="button"
                      variant={isAdult === true ? "default" : "outline"}
                      onClick={() => setIsAdult(true)}
                      data-testid="button-18-yes"
                    >
                      Yes
                    </Button>

                    <Button
                      type="button"
                      variant={isAdult === false ? "destructive" : "outline"}
                      onClick={() => {
                        setIsAdult(false);

                        // ✅ Redirect to a safe page (home)
                        window.location.href = "/"; // redirect to home
                      }}
                      data-testid="button-18-no"
                    >
                      No
                    </Button>
                  </div>
                </div>

                {/* Terms & Conditions */}
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="terms"
                    checked={termsAccepted}
                    onCheckedChange={(val) => setTermsAccepted(Boolean(val))}
                  />
                  <label htmlFor="terms" className="text-sm leading-tight">
                    I have read and agree to the{" "}
                    <a
                      href="/terms-and-conditions"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline"
                    >
                      Terms & Conditions
                    </a>
                    .
                  </label>
                </div>

                {/* Submit Button */}
                <div className="pt-6">
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={
                      registerMutation.isPending || !isAdult || !termsAccepted
                    }
                    data-testid="button-register"
                  >
                    {registerMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Finalizing...
                      </>
                    ) : (
                      "Submit"
                    )}
                  </Button>
                  <p className="text-xs text-muted-foreground text-center mt-2">
                    By registering, you agree to our terms of service and
                    privacy policy
                  </p>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
