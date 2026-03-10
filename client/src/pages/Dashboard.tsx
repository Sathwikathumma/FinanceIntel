import { useFinancialData } from "@/hooks/use-finance";
import { useUser } from "@/hooks/use-auth";
import { Card } from "@/components/Card";
import { Link } from "wouter";
import { 
  IndianRupee, 
  TrendingUp, 
  TrendingDown, 
  Building2, 
  CreditCard,
  PlusCircle,
  PiggyBank
} from "lucide-react";

export default function Dashboard() {
  const { data: user } = useUser();
  const { data: finance, isLoading } = useFinancialData();

  if (isLoading) return <div className="animate-pulse flex space-x-4">Loading Dashboard...</div>;

  if (!finance) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center max-w-md mx-auto">
        <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mb-6">
          <PiggyBank className="w-10 h-10 text-muted-foreground" />
        </div>
        <h2 className="text-3xl font-bold tracking-tight mb-4">Welcome, {user?.username}</h2>
        <p className="text-muted-foreground text-lg mb-8">
          You haven't added any financial data yet. Let's start building your wealth profile.
        </p>
        <Link 
          href="/upload"
          className="px-8 py-4 rounded-xl font-bold bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:-translate-y-1 transition-all duration-300 flex items-center gap-2"
        >
          <PlusCircle className="w-5 h-5" /> Add Financial Data
        </Link>
      </div>
    );
  }

  const netWorth = finance.assets - finance.liabilities;
  const savingsRate = finance.income > 0 
    ? (((finance.income - finance.expenses) / finance.income) * 100).toFixed(1) 
    : 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Overview</h1>
        <p className="text-muted-foreground mt-2">Here is your financial intelligence summary.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          title="Net Worth" 
          value={netWorth} 
          icon={<IndianRupee className="w-5 h-5" />} 
          trend={netWorth >= 0 ? "positive" : "negative"}
          highlight
        />
        <MetricCard 
          title="Monthly Income" 
          value={finance.income} 
          icon={<TrendingUp className="w-5 h-5 text-emerald-500" />} 
        />
        <MetricCard 
          title="Monthly Expenses" 
          value={finance.expenses} 
          icon={<TrendingDown className="w-5 h-5 text-rose-500" />} 
        />
        <MetricCard 
          title="Total Assets" 
          value={finance.assets} 
          icon={<Building2 className="w-5 h-5 text-blue-500" />} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 space-y-6">
          <h3 className="text-xl font-bold border-b border-border/50 pb-4">Financial Health</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-4 rounded-2xl bg-secondary/50 border border-border/50">
              <p className="text-sm font-medium text-muted-foreground mb-1">Savings Rate</p>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold">{savingsRate}%</span>
                <span className="text-sm text-muted-foreground mb-1 pb-0.5">/ month</span>
              </div>
              <div className="w-full h-2 bg-background rounded-full mt-4 overflow-hidden">
                <div 
                  className={`h-full rounded-full ${Number(savingsRate) > 20 ? 'bg-emerald-500' : 'bg-primary'}`} 
                  style={{ width: `${Math.min(Math.max(Number(savingsRate), 0), 100)}%` }} 
                />
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-secondary/50 border border-border/50">
              <p className="text-sm font-medium text-muted-foreground mb-1">Credit Score</p>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold">{finance.creditScore || "N/A"}</span>
              </div>
              <p className="text-sm mt-4 text-muted-foreground">
                {finance.creditScore > 750 ? "Excellent standing" : 
                 finance.creditScore > 650 ? "Good standing" : "Needs attention"}
              </p>
            </div>
          </div>
        </Card>

        <Card className="space-y-6 bg-gradient-to-br from-card to-primary/5">
          <h3 className="text-xl font-bold border-b border-border/50 pb-4 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-primary" /> Liabilities
          </h3>
          <div className="flex flex-col items-center justify-center py-6">
            <span className="text-4xl font-extrabold text-destructive">
              ₹{finance.liabilities.toLocaleString('en-IN')}
            </span>
            <p className="text-muted-foreground mt-2 text-center text-sm">
              Total outstanding debt. Focus on high-interest loans first.
            </p>
          </div>
          <Link href="/chat">
            <button className="w-full py-3 rounded-xl bg-background border border-border hover:border-primary hover:text-primary transition-all font-semibold text-sm">
              Ask AI how to reduce this
            </button>
          </Link>
        </Card>
      </div>

      {finance.epfDetails && (
        <Card>
          <h3 className="text-xl font-bold mb-4">EPF Details</h3>
          <p className="text-muted-foreground whitespace-pre-wrap font-mono text-sm bg-secondary/30 p-4 rounded-xl border border-border/50">
            {finance.epfDetails}
          </p>
        </Card>
      )}
    </div>
  );
}

function MetricCard({ title, value, icon, trend, highlight }: { title: string, value: number, icon: React.ReactNode, trend?: "positive"|"negative", highlight?: boolean }) {
  return (
    <div className={`
      p-6 rounded-2xl border transition-all duration-300 hover:shadow-lg
      ${highlight 
        ? 'bg-primary text-primary-foreground border-primary/50 shadow-primary/20 shadow-lg' 
        : 'bg-card border-border/50 hover:border-border text-foreground'}
    `}>
      <div className="flex justify-between items-start mb-4">
        <p className={`text-sm font-semibold ${highlight ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>{title}</p>
        <div className={`p-2 rounded-lg ${highlight ? 'bg-white/20' : 'bg-secondary'}`}>
          {icon}
        </div>
      </div>
      <h3 className="text-3xl font-bold tracking-tight">₹{value.toLocaleString('en-IN')}</h3>
    </div>
  );
}
