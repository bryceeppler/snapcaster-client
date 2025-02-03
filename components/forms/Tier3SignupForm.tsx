import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm, FieldValues, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const formSchema = z.object({
  subscriptionType: z.enum(["monthly", "quarterly"], {
    required_error: "Please select a subscription type.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  storeName: z.string().min(2, {
    message: "Store name must be at least 2 characters.",
  }),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface Tier3SignupFormProps {
  onSuccess?: () => void;
  initialPlan?: "monthly" | "quarterly";
}

export function Tier3SignupForm({ onSuccess, initialPlan = "quarterly" }: Tier3SignupFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subscriptionType: initialPlan,
      email: "",
      name: "",
      storeName: "",
      notes: "",
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/tier3-signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to submit form");
      }

      toast.success("Application submitted successfully!");
      onSuccess?.();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to submit application. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">
          Subscription Type
        </label>
        <select
          {...register("subscriptionType")}
          className="w-full p-2 border rounded-md bg-background"
        >
          <option value="quarterly">Quarterly ($250/month)</option>
          <option value="monthly">Monthly ($300/month)</option>
        </select>
        {errors.subscriptionType && (
          <p className="text-sm text-red-500 mt-1">{errors.subscriptionType.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Email
        </label>
        <Input
          type="email"
          placeholder="your@email.com"
          {...register("email")}
          className={errors.email ? "border-red-500" : ""}
        />
        {errors.email && (
          <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Your Name
        </label>
        <Input
          placeholder="John Smith"
          {...register("name")}
          className={errors.name ? "border-red-500" : ""}
        />
        {errors.name && (
          <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Store Name
        </label>
        <Input
          placeholder="Your Store Name"
          {...register("storeName")}
          className={errors.storeName ? "border-red-500" : ""}
        />
        {errors.storeName && (
          <p className="text-sm text-red-500 mt-1">{errors.storeName.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Additional Notes
        </label>
        <Textarea
          placeholder="Any additional information you'd like to share..."
          {...register("notes")}
          className={errors.notes ? "border-red-500" : ""}
        />
        {errors.notes && (
          <p className="text-sm text-red-500 mt-1">{errors.notes.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Submitting...
          </>
        ) : (
          "Submit Application"
        )}
      </Button>
    </form>
  );
} 