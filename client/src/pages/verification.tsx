import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button.jsx";
import { Card, CardContent } from "@/components/ui/card.jsx";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
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
import { Loader2, ShieldCheck, FileUp } from "lucide-react";
import Navbar from "@/components/navbar.jsx";
import { useToast } from "@/hooks/use-toast.js";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient.js";
import { useLocation, useRoute } from "wouter";
import { globalToken } from "./setup-account.jsx";

// ✅ Updated schema
const verificationSchema = z.object({
  country: z.string().min(1, "Country is required"),
  otherCountry: z.string().optional(),
  idType: z.enum(["National ID", "Passport"], {
    required_error: "ID type is required",
  }),
  idNumber: z.string().min(5, "ID number must be valid"),
  idFront: z.any().optional(),
  idBack: z.any().optional(),
  selfie: z
    .any()
    .refine((files) => files && files.length > 0, "Selfie with ID is required"),
});

type VerificationData = z.infer<typeof verificationSchema>;

export default function VerificationPage() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/verify/:id");
  const hairdresserId = params?.id;

  const { toast } = useToast();
  const [country, setCountry] = useState("Kenya");

  const form = useForm<VerificationData>({
    resolver: zodResolver(verificationSchema),
    defaultValues: {
      country: "Kenya",
      idType: "National ID",
      idNumber: "",
      idFront: null,
      idBack: null,
      selfie: null,
    },
  });

  const verificationMutation = useMutation({
    mutationFn: async (data: VerificationData) => {
      const formData = new FormData();
      const finalCountry =
        data.country === "Other" ? data.otherCountry || "" : data.country;

      formData.append("country", finalCountry);
      formData.append("idType", data.idType);
      formData.append("idNumber", data.idNumber);
      formData.append("hairdresserId", hairdresserId || "");

      if (data.idFront && data.idFront.length)
        formData.append("idFront", data.idFront[0]);
      if (data.idBack && data.idBack.length)
        formData.append("idBack", data.idBack[0]);
      if (data.selfie && data.selfie.length)
        formData.append("selfie", data.selfie[0]);

      // 🔍 Backend can now use facial recognition API (e.g. AWS Rekognition, Face++ etc.)
      // to compare selfie and ID photo

      return apiRequest("POST", "/api/verification", formData, globalToken);
    },
    onSuccess: () => {
      toast({
        title: "Verification Submitted",
        description: "Your verification has been submitted successfully.",
      });
      setTimeout(() => setLocation(`/profile/${hairdresserId}`), 1500);
    },
    onError: (err: any) => {
      toast({
        title: "Verification Failed",
        description: err?.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: VerificationData) => {
    verificationMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <ShieldCheck className="w-12 h-12 mx-auto text-primary mb-4" />
          <h1 className="text-3xl font-bold text-foreground">
            Identity Verification
          </h1>
          <p className="text-muted-foreground mt-2">
            Please complete this verification step to keep our community safe.
          </p>
        </div>

        <Card>
          <CardContent className="p-8">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {/* Country */}
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nationality *</FormLabel>
                      <Select
                        onValueChange={(val) => {
                          field.onChange(val);
                          setCountry(val);
                        }}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Country" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Kenya">Kenya</SelectItem>
                          <SelectItem value="Uganda">Uganda</SelectItem>
                          <SelectItem value="Tanzania">Tanzania</SelectItem>
                          <SelectItem value="Burundi">Burundi</SelectItem>
                          <SelectItem value="Rwanda">Rwanda</SelectItem>
                          <SelectItem value="South Africa">
                            South Africa
                          </SelectItem>
                          <SelectItem value="Nigeria">Nigeria</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Dynamic other country input */}
                {country === "Other" && (
                  <FormField
                    control={form.control}
                    name="otherCountry"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Enter Natiomality *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your nationality"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {/* ID Type */}
                <FormField
                  control={form.control}
                  name="idType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ID Type *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select ID Type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="National ID">
                            National ID
                          </SelectItem>
                          <SelectItem value="Passport">Passport</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* ID Number */}
                <FormField
                  control={form.control}
                  name="idNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ID Number *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your ID or Passport number"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* File Uploads */}
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="idFront"
                    render={({ field: { onChange, value, ...field } }) => (
                      <FormItem>
                        <FormLabel>ID Front Photo *</FormLabel>
                        <div className="border-2 border-dashed rounded-lg p-6 text-center">
                          <FileUp className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground mb-2">
                            Upload a clear photo of the{" "}
                            <strong>front side</strong> of your ID.
                          </p>
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => onChange(e.target.files)}
                            className="hidden"
                            id="idFront"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                              document.getElementById("idFront")?.click()
                            }
                          >
                            Choose File
                          </Button>

                          {/* ✅ Preview */}
                          {value instanceof FileList && value.length > 0 && (
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
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="idBack"
                    render={({ field: { onChange, value } }) => (
                      <FormItem>
                        <FormLabel>ID Back Photo *</FormLabel>
                        <div className="border-2 border-dashed rounded-lg p-6 text-center">
                          <FileUp className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground mb-2">
                            Upload a clear photo of the{" "}
                            <strong>back side</strong> of your ID.
                          </p>
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => onChange(e.target.files)}
                            className="hidden"
                            id="idBack"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                              document.getElementById("idBack")?.click()
                            }
                          >
                            Choose File
                          </Button>

                          {/* ✅ Preview */}
                          {value instanceof FileList && value.length > 0 && (
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
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="selfie"
                    render={({ field: { onChange, value } }) => (
                      <FormItem>
                        <FormLabel>Selfie with ID *</FormLabel>
                        <div className="border-2 border-dashed rounded-lg p-6 text-center">
                          <FileUp className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground mb-2">
                            Upload a selfie of you holding your ID clearly
                            visible.
                          </p>
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => onChange(e.target.files)}
                            className="hidden"
                            id="selfie"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                              document.getElementById("selfie")?.click()
                            }
                          >
                            Choose File
                          </Button>

                          {/* ✅ Preview */}
                          {value instanceof FileList && value.length > 0 && (
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
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="bg-muted rounded-md p-4">
                  <p className="text-sm text-muted-foreground text-center">
                    🔒 Your ID and selfie will be securely stored and used only
                    for verification.
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={verificationMutation.isPending}
                >
                  {verificationMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Verification"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
