
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function JoinRequestForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [intro, setIntro] = useState("");
  const [connectionContext, setConnectionContext] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      toast({ 
        title: "Error", 
        description: error.message, 
        variant: "destructive" 
      });
    } else {
      toast({ 
        title: "Request submitted!", 
        description: "A community steward will review your application." 
      });
      setName("");
      setEmail("");
      setIntro("");
      setConnectionContext("");
    }
    setLoading(false);
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Request to Join Our Community</CardTitle>
        <CardDescription>
          We're a trust-based community in the Sunset & Richmond neighborhoods. 
          Tell us about yourself and we'll have a community steward review your application.
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
            <Label htmlFor="intro">Tell us about yourself</Label>
            <Textarea
              id="intro"
              value={intro}
              onChange={(e) => setIntro(e.target.value)}
              placeholder="Share a bit about who you are, what you enjoy, and why you'd like to join our community..."
              rows={4}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="connection">Connection to our community</Label>
            <Textarea
              id="connection"
              value={connectionContext}
              onChange={(e) => setConnectionContext(e.target.value)}
              placeholder="How did you hear about us? Do you know any current members? Any other connections to the Sunset/Richmond area?"
              rows={3}
            />
          </div>
          
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Submitting..." : "Submit Request"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
