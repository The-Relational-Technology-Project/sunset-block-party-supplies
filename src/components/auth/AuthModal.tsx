
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'login' | 'signup' | 'join-request';
}

export function AuthModal({ isOpen, onClose, mode }: AuthModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [intro, setIntro] = useState("");
  const [connectionContext, setConnectionContext] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast({ title: "Login failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Welcome back!", description: "You've successfully logged in." });
      onClose();
    }
    setLoading(false);
  };

  const handleSignup = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } }
    });
    if (error) {
      toast({ title: "Signup failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Check your email", description: "We've sent you a confirmation link." });
      onClose();
    }
    setLoading(false);
  };

  const handleJoinRequest = async () => {
    setLoading(true);
    const { error } = await supabase
      .from('join_requests')
      .insert({
        name,
        email,
        intro,
        connection_context: connectionContext
      });
    
    if (error) {
      toast({ title: "Request failed", description: error.message, variant: "destructive" });
    } else {
      toast({ 
        title: "Request submitted!", 
        description: "A community steward will review your application." 
      });
      onClose();
    }
    setLoading(false);
  };

  const getTitle = () => {
    switch (mode) {
      case 'login': return 'Welcome Back';
      case 'signup': return 'Join Our Community';
      case 'join-request': return 'Request to Join';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {mode === 'join-request' ? (
            <>
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <Label htmlFor="intro">Introduction</Label>
                <Textarea
                  id="intro"
                  value={intro}
                  onChange={(e) => setIntro(e.target.value)}
                  placeholder="Tell us about yourself and why you'd like to join..."
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="connection">Connection to Community</Label>
                <Textarea
                  id="connection"
                  value={connectionContext}
                  onChange={(e) => setConnectionContext(e.target.value)}
                  placeholder="How did you hear about us? Do you know any current members?"
                  rows={2}
                />
              </div>
              <Button onClick={handleJoinRequest} disabled={loading} className="w-full">
                Submit Request
              </Button>
            </>
          ) : (
            <>
              {mode === 'signup' && (
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your full name"
                  />
                </div>
              )}
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your password"
                />
              </div>
              <Button 
                onClick={mode === 'login' ? handleLogin : handleSignup} 
                disabled={loading} 
                className="w-full"
              >
                {mode === 'login' ? 'Sign In' : 'Create Account'}
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
