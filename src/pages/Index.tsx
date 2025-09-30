import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Satellite, Shield, Radar } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate("/dashboard");
    });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
              Space Domain Awareness
            </h1>
            <p className="text-xl text-blue-200 max-w-2xl mx-auto">
              Real-time satellite tracking, AI-powered threat analysis, and comprehensive space situational awareness
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl w-full">
            <div className="bg-white/5 backdrop-blur-lg p-6 rounded-lg border border-white/10">
              <Satellite className="h-12 w-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Live Tracking</h3>
              <p className="text-sm text-blue-200">Monitor satellites in real-time with precise orbital data</p>
            </div>
            <div className="bg-white/5 backdrop-blur-lg p-6 rounded-lg border border-white/10">
              <Shield className="h-12 w-12 text-cyan-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">AI Analysis</h3>
              <p className="text-sm text-blue-200">Advanced threat detection and collision prediction</p>
            </div>
            <div className="bg-white/5 backdrop-blur-lg p-6 rounded-lg border border-white/10">
              <Radar className="h-12 w-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">UAE Assets</h3>
              <p className="text-sm text-blue-200">Dedicated monitoring of UAE space infrastructure</p>
            </div>
          </div>

          <Button 
            size="lg" 
            onClick={() => navigate("/auth")}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-8 py-6 text-lg"
          >
            Sign In to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
