
import { useState, useEffect } from "react";
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
  const [honeypot, setHoneypot] = useState(""); // Bot detection
  const [captchaAnswer, setCaptchaAnswer] = useState("");
  const [captchaQuestion, setCaptchaQuestion] = useState({ question: "", answer: 0 });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Generate math captcha when component mounts or mode changes to signup
  useEffect(() => {
    if (mode === 'signup') {
      const num1 = Math.floor(Math.random() * 10) + 1;
      const num2 = Math.floor(Math.random() * 10) + 1;
      setCaptchaQuestion({
        question: `What is ${num1} + ${num2}?`,
        answer: num1 + num2
      });
      setCaptchaAnswer("");
    }
  }, [mode]);

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
    
    // Bot protection checks
    if (honeypot.trim() !== "") {
      toast({ title: "Signup failed", description: "Please try again.", variant: "destructive" });
      setLoading(false);
      return;
    }
    
    if (parseInt(captchaAnswer) !== captchaQuestion.answer) {
      toast({ title: "Incorrect answer", description: "Please solve the math problem correctly.", variant: "destructive" });
      setLoading(false);
      return;
    }
    
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { 
        data: { 
          name,
          connection_context: connectionContext 
        },
        emailRedirectTo: redirectUrl
      }
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
      case 'signup': return 'Join the Party';
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
                    <Label htmlFor="connection">How did you hear about us?</Label>
                    <Textarea
                      id="connection"
                      value={connectionContext}
                      onChange={(e) => setConnectionContext(e.target.value)}
                      placeholder="Who referred you or how did you find out about this community?"
                      rows={2}
                    />
                  </div>
                  
                  {/* Honeypot field - hidden from users, only bots fill this */}
                  <div style={{ display: 'none' }}>
                    <Input
                      value={honeypot}
                      onChange={(e) => setHoneypot(e.target.value)}
                      placeholder="Leave this empty"
                      tabIndex={-1}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="captcha">{captchaQuestion.question}</Label>
                    <Input
                      id="captcha"
                      type="number"
                      value={captchaAnswer}
                      onChange={(e) => setCaptchaAnswer(e.target.value)}
                      placeholder="Enter the answer"
                      required
                    />
                  </div>
                </>
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
