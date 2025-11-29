import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Header } from "@/components/Header";
import { StewardDashboard } from "@/components/steward/StewardDashboard";
import { AuthGuard } from "@/components/auth/AuthGuard";

export default function Steward() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate('/');
  };

  const handleTabChange = (tab: string) => {
    navigate(`/?tab=${tab}`);
  };

  return (
    <AuthGuard requireSteward>
      <div className="min-h-screen bg-background">
        <Header activeTab="" onTabChange={handleTabChange} />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" onClick={handleGoBack} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </div>
          <StewardDashboard />
        </div>
      </div>
    </AuthGuard>
  );
}