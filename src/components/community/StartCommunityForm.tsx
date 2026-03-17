import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Plus, X } from "lucide-react";

interface CoSteward {
  name: string;
  email: string;
}

export function StartCommunityForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [coStewards, setCoStewards] = useState<CoSteward[]>([]);
  const [reason, setReason] = useState("");
  const [questions, setQuestions] = useState("");
  const [captchaAnswer, setCaptchaAnswer] = useState("");
  const [captchaQuestion, setCaptchaQuestion] = useState({ question: "", answer: 0 });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    setCaptchaQuestion({ question: `${num1} + ${num2}`, answer: num1 + num2 });
  }, []);

  const addCoSteward = () => {
    setCoStewards([...coStewards, { name: "", email: "" }]);
  };

  const removeCoSteward = (index: number) => {
    setCoStewards(coStewards.filter((_, i) => i !== index));
  };

  const updateCoSteward = (index: number, field: keyof CoSteward, value: string) => {
    const updated = [...coStewards];
    updated[index] = { ...updated[index], [field]: value };
    setCoStewards(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (parseInt(captchaAnswer) !== captchaQuestion.answer) {
      toast({
        title: "Incorrect answer",
        description: "Please solve the math problem correctly.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const validCoStewards = coStewards.filter((cs) => cs.name.trim() && cs.email.trim());

      const { error } = await supabase.from("community_steward_requests" as any).insert({
        name: name.trim(),
        email: email.trim(),
        co_stewards: validCoStewards,
        reason: reason.trim(),
        questions: questions.trim() || null,
      } as any);

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // Send notification email (fire and forget)
      supabase.functions.invoke("send-community-request-notification", {
        body: {
          name: name.trim(),
          email: email.trim(),
          coStewards: validCoStewards,
          reason: reason.trim(),
          questions: questions.trim() || null,
        },
      }).catch((err) => console.error("Failed to send notification:", err));

      setSubmitted(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    }

    setLoading(false);
  };

  if (submitted) {
    return (
      <Card className="max-w-2xl mx-auto my-8 sm:my-16">
        <CardContent className="p-8 sm:p-12 text-center">
          <div className="text-4xl mb-4">🎉</div>
          <h2 className="text-2xl font-serif font-bold text-deep-brown mb-3">
            Thank you!
          </h2>
          <p className="text-muted-foreground text-base leading-relaxed">
            We've received your request to start a sharing community. We'll be in touch soon to talk next steps.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto my-4 sm:my-8">
      <CardHeader className="px-4 sm:px-6 pt-4 sm:pt-6">
        <CardTitle className="text-xl sm:text-2xl font-serif">Start a Sharing Community</CardTitle>
        <CardDescription className="text-sm sm:text-base leading-relaxed">
          Community Supplies is a free, open-source tool for neighborhoods to share supplies, tools, and more. 
          Tell us about the community you'd like to start and we'll help you get set up.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Your Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              required
              maxLength={100}
              className="h-11 sm:h-10 text-base"
              autoComplete="name"
            />
          </div>

          <div>
            <Label htmlFor="email">Your Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              required
              maxLength={255}
              className="h-11 sm:h-10 text-base"
              autoComplete="email"
            />
          </div>

          {/* Co-stewards */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Co-stewards (optional)</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={addCoSteward}
                className="text-xs gap-1"
              >
                <Plus className="h-3 w-3" />
                Add co-steward
              </Button>
            </div>
            {coStewards.map((cs, i) => (
              <div key={i} className="flex gap-2 items-start">
                <div className="flex-1 space-y-2">
                  <Input
                    value={cs.name}
                    onChange={(e) => updateCoSteward(i, "name", e.target.value)}
                    placeholder="Co-steward name"
                    maxLength={100}
                    className="h-11 sm:h-10 text-base"
                  />
                  <Input
                    type="email"
                    value={cs.email}
                    onChange={(e) => updateCoSteward(i, "email", e.target.value)}
                    placeholder="Co-steward email"
                    maxLength={255}
                    className="h-11 sm:h-10 text-base"
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeCoSteward(i)}
                  className="mt-1 text-muted-foreground hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          <div>
            <Label htmlFor="reason">Why do you want to start a sharing community?</Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Tell us about your neighborhood and what inspired you..."
              required
              maxLength={2000}
              className="min-h-[120px] text-base"
            />
          </div>

          <div>
            <Label htmlFor="questions">Any questions for us? (optional)</Label>
            <Textarea
              id="questions"
              value={questions}
              onChange={(e) => setQuestions(e.target.value)}
              placeholder="Anything you'd like to know..."
              maxLength={2000}
              className="min-h-[80px] text-base"
            />
          </div>

          <div>
            <Label htmlFor="captcha">What is {captchaQuestion.question}?</Label>
            <Input
              id="captcha"
              type="number"
              inputMode="numeric"
              value={captchaAnswer}
              onChange={(e) => setCaptchaAnswer(e.target.value)}
              placeholder="Your answer"
              required
              className="h-11 sm:h-10 text-base"
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full h-11 sm:h-10 text-base mt-2">
            {loading ? "Submitting..." : "Submit Request"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
