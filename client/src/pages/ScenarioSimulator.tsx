import { useState, useMemo } from "react";
import { Card } from "@/components/Card";
import { Calculator } from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";

export default function ScenarioSimulator() {
  const [initial, setInitial] = useState(10000);
  const [monthly, setMonthly] = useState(5000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(10);

  const chartData = useMemo(() => {
    const data = [];
    let currentBalance = initial;
    let totalContributions = initial;
    
    // Add year 0
    data.push({
      year: 0,
      balance: Math.round(currentBalance),
      contributions: Math.round(totalContributions),
      interest: 0
    });

    const monthlyRate = (rate / 100) / 12;

    for (let y = 1; y <= years; y++) {
      for (let m = 0; m < 12; m++) {
        currentBalance = (currentBalance + monthly) * (1 + monthlyRate);
        totalContributions += monthly;
      }
      
      data.push({
        year: y,
        balance: Math.round(currentBalance),
        contributions: Math.round(totalContributions),
        interest: Math.round(currentBalance - totalContributions)
      });
    }
    return data;
  }, [initial, monthly, rate, years]);

  const finalData = chartData[chartData.length - 1];

  const formatCurrency = (val: number) => `₹${val.toLocaleString('en-IN')}`;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Scenario Simulator</h1>
        <p className="text-muted-foreground mt-2">
          Visualize the power of compound interest and consistent investing.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Controls */}
        <Card className="lg:col-span-1 space-y-6">
          <div className="flex items-center gap-2 border-b border-border/50 pb-4 mb-4">
            <Calculator className="w-5 h-5 text-primary" />
            <h3 className="text-xl font-bold">Parameters</h3>
          </div>

          <div className="space-y-5">
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-sm font-semibold">Initial Investment</label>
                <span className="text-sm font-bold text-primary">{formatCurrency(initial)}</span>
              </div>
              <input 
                type="range" min={0} max={1000000} step={10000}
                value={initial} onChange={(e) => setInitial(Number(e.target.value))}
                className="w-full accent-primary"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <label className="text-sm font-semibold">Monthly Contribution</label>
                <span className="text-sm font-bold text-primary">{formatCurrency(monthly)}</span>
              </div>
              <input 
                type="range" min={0} max={200000} step={1000}
                value={monthly} onChange={(e) => setMonthly(Number(e.target.value))}
                className="w-full accent-primary"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <label className="text-sm font-semibold">Expected Return Rate</label>
                <span className="text-sm font-bold text-primary">{rate}%</span>
              </div>
              <input 
                type="range" min={1} max={30} step={0.5}
                value={rate} onChange={(e) => setRate(Number(e.target.value))}
                className="w-full accent-primary"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <label className="text-sm font-semibold">Time Horizon</label>
                <span className="text-sm font-bold text-primary">{years} Years</span>
              </div>
              <input 
                type="range" min={1} max={40} step={1}
                value={years} onChange={(e) => setYears(Number(e.target.value))}
                className="w-full accent-primary"
              />
            </div>
          </div>
        </Card>

        {/* Results & Chart */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-card border border-border/50 rounded-2xl p-4">
              <p className="text-sm text-muted-foreground font-medium mb-1">Total Contributions</p>
              <p className="text-xl font-bold">{formatCurrency(finalData.contributions)}</p>
            </div>
            <div className="bg-card border border-border/50 rounded-2xl p-4">
              <p className="text-sm text-muted-foreground font-medium mb-1">Total Interest</p>
              <p className="text-xl font-bold text-emerald-500">{formatCurrency(finalData.interest)}</p>
            </div>
            <div className="bg-primary text-primary-foreground shadow-lg shadow-primary/20 rounded-2xl p-4">
              <p className="text-sm text-primary-foreground/80 font-medium mb-1">Total Value</p>
              <p className="text-2xl font-bold">{formatCurrency(finalData.balance)}</p>
            </div>
          </div>

          <Card className="h-[400px] w-full p-4 md:p-6">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorContrib" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="year" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickFormatter={(val) => `Yr ${val}`}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickFormatter={(val) => `₹${(val/100000).toFixed(0)}L`}
                  width={60}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '12px', border: '1px solid hsl(var(--border))' }}
                  formatter={(value: number, name: string) => [
                    formatCurrency(value), 
                    name.charAt(0).toUpperCase() + name.slice(1)
                  ]}
                  labelFormatter={(label) => `Year ${label}`}
                />
                <Area 
                  type="monotone" 
                  dataKey="balance" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorBalance)" 
                  name="Total Balance"
                />
                <Area 
                  type="monotone" 
                  dataKey="contributions" 
                  stroke="hsl(var(--accent))" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorContrib)" 
                  name="Contributions"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>
    </div>
  );
}
