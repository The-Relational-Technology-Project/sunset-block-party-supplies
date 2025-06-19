
import { useState } from "react";
import { Header } from "@/components/Header";
import { LandingPage } from "@/components/LandingPage";
import { BrowseSupplies } from "@/components/BrowseSupplies";
import { AddSupply } from "@/components/AddSupply";
import { PartyPlanner } from "@/components/PartyPlanner";
import { StewardDashboard } from "@/components/steward/StewardDashboard";
import { AuthGuard } from "@/components/auth/AuthGuard";

const Index = () => {
  const [activeTab, setActiveTab] = useState('home');

  const renderContent = () => {
    switch (activeTab) {
      case 'browse':
        return (
          <AuthGuard requireVouched>
            <BrowseSupplies />
          </AuthGuard>
        );
      case 'add':
        return (
          <AuthGuard requireVouched>
            <AddSupply />
          </AuthGuard>
        );
      case 'planner':
        return (
          <AuthGuard requireVouched>
            <PartyPlanner />
          </AuthGuard>
        );
      case 'steward':
        return (
          <AuthGuard requireSteward>
            <StewardDashboard />
          </AuthGuard>
        );
      default:
        return <LandingPage onTabChange={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AuthGuard>
        <Header activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="container mx-auto px-4 py-8">
          {renderContent()}
        </main>
      </AuthGuard>
    </div>
  );
};

export default Index;
