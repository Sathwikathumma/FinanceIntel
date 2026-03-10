import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useFinancialData, useUpdateFinancialData } from "@/hooks/use-finance";
import { Card } from "@/components/Card";
import { Save, Loader2, IndianRupee, PieChart, ShieldAlert } from "lucide-react";

// Add z.coerce to numbers to handle HTML input string values
const uploadSchema = z.object({
  income: z.coerce.number().min(0, "Must be positive"),
  expenses: z.coerce.number().min(0, "Must be positive"),
  assets: z.coerce.number().min(0, "Must be positive"),
  liabilities: z.coerce.number().min(0, "Must be positive"),
  creditScore: z.coerce.number().min(0).max(900),
  epfDetails: z.string().optional(),
});

type UploadFormData = z.infer<typeof uploadSchema>;

export default function UploadData() {
  const { data: existingData, isLoading: isFetching } = useFinancialData();
  const updateData = useUpdateFinancialData();

  const { register, handleSubmit, reset, formState: { errors, isDirty } } = useForm<UploadFormData>({
    resolver: zodResolver(uploadSchema),
    defaultValues: {
      income: 0,
      expenses: 0,
      assets: 0,
      liabilities: 0,
      creditScore: 0,
      epfDetails: "",
    }
  });

  useEffect(() => {
    if (existingData) {
      reset({
        income: existingData.income,
        expenses: existingData.expenses,
        assets: existingData.assets,
        liabilities: existingData.liabilities,
        creditScore: existingData.creditScore,
        epfDetails: existingData.epfDetails || "",
      });
    }
  }, [existingData, reset]);

  const onSubmit = async (data: UploadFormData) => {
    try {
      await updateData.mutateAsync(data);
      // Success toast would go here
    } catch (err) {
      console.error(err);
    }
  };

  if (isFetching) return <div className="animate-pulse">Loading form...</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Upload Financial Data</h1>
        <p className="text-muted-foreground mt-2">
          Securely input your latest financial metrics. This data powers your AI advisor and dashboard.
        </p>
      </div>

      <Card className="border-t-4 border-t-primary">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          
          <div className="space-y-4">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <IndianRupee className="w-5 h-5 text-primary" /> Cash Flow (Monthly)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField label="Income (₹)" name="income" register={register} error={errors.income?.message} />
              <InputField label="Expenses (₹)" name="expenses" register={register} error={errors.expenses?.message} />
            </div>
          </div>

          <div className="h-px bg-border/50 w-full" />

          <div className="space-y-4">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <PieChart className="w-5 h-5 text-accent" /> Net Worth Status
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField label="Total Assets (₹)" name="assets" register={register} error={errors.assets?.message} />
              <InputField label="Total Liabilities/Debt (₹)" name="liabilities" register={register} error={errors.liabilities?.message} />
            </div>
          </div>

          <div className="h-px bg-border/50 w-full" />

          <div className="space-y-4">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-blue-500" /> Additional Details
            </h3>
            <div className="grid grid-cols-1 gap-6">
              <InputField label="Credit Score" name="creditScore" register={register} error={errors.creditScore?.message} />
              
              <div>
                <label className="block text-sm font-semibold mb-2 text-foreground">EPF / Retirement Details (Optional)</label>
                <textarea 
                  {...register("epfDetails")}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl bg-background border-2 border-border focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all resize-none"
                  placeholder="Paste details about your Employee Provident Fund or other retirement accounts..."
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-4">
            {updateData.isSuccess && !isDirty && (
              <span className="text-emerald-500 text-sm font-medium">Saved successfully!</span>
            )}
            <button 
              type="submit"
              disabled={updateData.isPending}
              className="px-8 py-3.5 rounded-xl font-bold bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center gap-2 disabled:opacity-50"
            >
              {updateData.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              {updateData.isPending ? "Saving..." : "Save Data"}
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}

function InputField({ label, name, register, error }: { label: string, name: string, register: any, error?: string }) {
  return (
    <div>
      <label className="block text-sm font-semibold mb-2 text-foreground">{label}</label>
      <input 
        type="number"
        {...register(name)}
        className="w-full px-4 py-3 rounded-xl bg-background border-2 border-border focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-mono"
      />
      {error && <p className="text-destructive text-xs mt-1 font-medium">{error}</p>}
    </div>
  );
}
