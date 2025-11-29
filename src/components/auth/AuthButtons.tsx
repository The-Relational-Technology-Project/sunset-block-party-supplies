
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AuthModal } from "./AuthModal";

export function AuthButtons({ onSuccess }: { onSuccess?: () => void }) {
  const [modalMode, setModalMode] = useState<'login' | 'signup' | 'join-request' | null>(null);

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-2">
        <Button 
          variant="outline" 
          onClick={() => setModalMode('login')}
          className="text-orange-600 border-orange-600 hover:bg-orange-50"
        >
          Sign In
        </Button>
        <Button 
          onClick={() => setModalMode('signup')}
          className="bg-orange-500 hover:bg-orange-600"
        >
          Join the Party
        </Button>
      </div>
      
      <AuthModal
        isOpen={modalMode !== null}
        onClose={() => setModalMode(null)}
        mode={modalMode || 'login'}
        onSuccess={onSuccess}
      />
    </>
  );
}
