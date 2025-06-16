
import { useState } from "react";
import { Header } from "@/components/Header";
import { LandingPage } from "@/components/LandingPage";
import { BrowseSupplies } from "@/components/BrowseSupplies";
import { AddSupply } from "@/components/AddSupply";
import { PartyPlanner } from "@/components/PartyPlanner";
import { ContactModal } from "@/components/ContactModal";
import { sampleSupplies } from "@/data/sampleSupplies";
import { Supply } from "@/types/supply";

const Index = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [selectedSupply, setSelectedSupply] = useState<Supply | null>(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const handleViewContact = (supply: Supply) => {
    setSelectedSupply(supply);
    setIsContactModalOpen(true);
  };

  const handleCloseContactModal = () => {
    setIsContactModalOpen(false);
    setSelectedSupply(null);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "browse":
        return (
          <BrowseSupplies 
            supplies={sampleSupplies} 
            onViewContact={handleViewContact}
          />
        );
      case "add":
        return <AddSupply />;
      case "planner":
        return <PartyPlanner />;
      default:
        return <LandingPage onTabChange={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Only show header when not on landing page */}
      {activeTab !== "home" && (
        <Header activeTab={activeTab} onTabChange={setActiveTab} />
      )}
      {renderContent()}
      <ContactModal 
        supply={selectedSupply}
        isOpen={isContactModalOpen}
        onClose={handleCloseContactModal}
      />
    </div>
  );
};

export default Index;
