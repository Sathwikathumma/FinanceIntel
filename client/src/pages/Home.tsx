import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, BrainCircuit, LineChart, ShieldCheck } from "lucide-react";
import { useUser } from "@/hooks/use-auth";

export default function Home() {
  const [, setLocation] = useLocation();
  const { data: user, isLoading } = useUser();

  if (isLoading) return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>;

  if (user) {
    setLocation("/dashboard");
    return null;
  }

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden flex flex-col">
      {/* Background decoration */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-accent/20 blur-[120px] rounded-full pointer-events-none" />

      <header className="px-6 py-6 flex justify-between items-center z-10 max-w-7xl w-full mx-auto">
        <div className="font-bold text-2xl tracking-tight flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-accent shadow-lg shadow-primary/30" />
          Finance Intelligence
        </div>
        <Link 
          href="/auth"
          className="px-6 py-2.5 rounded-full font-semibold bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300 shadow-md"
        >
          Sign In
        </Link>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 z-10 max-w-5xl mx-auto py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold tracking-wide border border-primary/20 mb-6 inline-block">
            AI-Powered Wealth Management
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mt-6 mb-8 leading-tight">
            Master your financial future with <span className="text-gradient">Intelligence</span>.
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Upload your financial data securely. Let our advanced AI reasoning engine build your customized path to wealth, optimize your budget, and simulate predictive scenarios.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/auth"
              className="px-8 py-4 rounded-xl font-bold bg-primary text-primary-foreground shadow-xl shadow-primary/25 hover:shadow-2xl hover:shadow-primary/40 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
            >
              Get Started Free <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              href="/auth"
              className="px-8 py-4 rounded-xl font-bold bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-all duration-300 flex items-center justify-center"
            >
              See How It Works
            </Link>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24">
          <FeatureCard 
            icon={<BrainCircuit className="w-8 h-8 text-primary" />}
            title="AI Chat Advisor"
            desc="Ask questions in natural language. Get personalized budgeting, investment, and retirement advice."
            delay={0.2}
          />
          <FeatureCard 
            icon={<LineChart className="w-8 h-8 text-accent" />}
            title="Scenario Simulator"
            desc="Test financial choices. 'What if I invest ₹5000 monthly?' See interactive predictive graphs."
            delay={0.4}
          />
          <FeatureCard 
            icon={<ShieldCheck className="w-8 h-8 text-blue-500" />}
            title="Secure Vault"
            desc="Your data is encrypted and strictly controlled. You maintain 100% ownership of your financial records."
            delay={0.6}
          />
        </div>
      </main>
    </div>
  );
}

function FeatureCard({ icon, title, desc, delay }: { icon: React.ReactNode, title: string, desc: string, delay: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="glass-panel p-8 rounded-3xl text-left hover:-translate-y-2 transition-transform duration-300"
    >
      <div className="w-14 h-14 rounded-2xl bg-background shadow-inner flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{desc}</p>
    </motion.div>
  );
}
