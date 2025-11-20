
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function JoinRequestForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [crossStreets, setCrossStreets] = useState("");
  const [referralSource, setReferralSource] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [captchaAnswer, setCaptchaAnswer] = useState("");
  const [captchaQuestion, setCaptchaQuestion] = useState({ question: "", answer: 0 });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Generate math captcha when component mounts
  useEffect(() => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    setCaptchaQuestion({
      question: `${num1} + ${num2}`,
      answer: num1 + num2
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate captcha
    if (parseInt(captchaAnswer) !== captchaQuestion.answer) {
      toast({
        title: "Incorrect answer",
        description: "Please solve the math problem correctly.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      // Create auth user with password
      const redirectUrl = `${window.location.origin}/`;
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            name
          }
        }
      });

      if (authError) {
        toast({ 
          title: "Signup failed", 
          description: authError.message, 
          variant: "destructive" 
        });
        setLoading(false);
        return;
      }

      if (!authData.user) {
        toast({ 
          title: "Signup failed", 
          description: "Failed to create user account.", 
          variant: "destructive" 
        });
        setLoading(false);
        return;
      }

      // Create join request linked to the user
      const { error: requestError } = await supabase
        .from('join_requests')
        .insert({
          user_id: authData.user.id,
          name,
          email,
          cross_streets: crossStreets,
          referral_source: referralSource,
          phone_number: referralSource === 'other' ? phoneNumber : null
        });

      if (requestError) {
        toast({ 
          title: "Error", 
          description: requestError.message, 
          variant: "destructive" 
        });
      } else {
        toast({ 
          title: "Request submitted!", 
          description: "A community steward will review your application. Check your email to verify your account." 
        });
        setName("");
        setEmail("");
        setPassword("");
        setCrossStreets("");
        setReferralSource("");
        setPhoneNumber("");
        setCaptchaAnswer("");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive"
      });
    }

    setLoading(false);
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Request to Join Our Community</CardTitle>
        <CardDescription>
          We're a trust-based community in the Sunset & Richmond neighborhoods. 
          Create your account and a community steward will review your application.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              required
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
              required
            />
          </div>
          
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              required
              minLength={6}
            />
          </div>
          
          <div>
            <Label htmlFor="crossStreets">What are your cross streets?</Label>
            <Input
              id="crossStreets"
              value={crossStreets}
              onChange={(e) => setCrossStreets(e.target.value)}
              placeholder="e.g., 25th Ave & Irving St"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="referralSource">Who told you about Community Supplies?</Label>
            <Select value={referralSource} onValueChange={setReferralSource} required>
              <SelectTrigger id="referralSource">
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="community_member">Community member</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {referralSource === 'other' && (
            <div className="space-y-2">
              <Label>Are you open to a quick call with one of our stewards?</Label>
              <div className="space-y-2">
                <Label htmlFor="phoneNumber" className="text-sm text-muted-foreground">
                  If yes, enter your phone number:
                </Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>
          )}
          
          <div>
            <Label htmlFor="captcha">What is {captchaQuestion.question}?</Label>
            <Input
              id="captcha"
              type="number"
              value={captchaAnswer}
              onChange={(e) => setCaptchaAnswer(e.target.value)}
              placeholder="Your answer"
              required
            />
          </div>
          
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Submitting..." : "Submit Request to Join"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
