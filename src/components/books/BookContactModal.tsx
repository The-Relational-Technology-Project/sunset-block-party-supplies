import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Book } from "@/types/book";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { BookOpen, Send, Loader2 } from "lucide-react";

interface BookContactModalProps {
  isOpen: boolean;
  book: Book | null;
  onClose: () => void;
}

export function BookContactModal({ isOpen, book, onClose }: BookContactModalProps) {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const { toast } = useToast();

  if (!book) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !contact.trim() || !message.trim()) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setSending(true);

    try {
      // Create a supply request for the book (reusing existing table)
      const { error } = await supabase.from("supply_requests").insert({
        supply_id: book.id,
        supply_name: `Book: ${book.title}`,
        supply_owner_id: book.ownerId,
        sender_name: name.trim(),
        sender_contact: contact.trim(),
        message: message.trim(),
      });

      if (error) throw error;

      toast({
        title: "Request sent!",
        description: `Your borrowing request for "${book.title}" has been sent to ${book.ownerName?.split(' ')[0] || 'the owner'}.`,
      });

      // Reset form and close
      setName("");
      setContact("");
      setMessage("");
      onClose();
    } catch (error) {
      console.error("Error sending request:", error);
      toast({
        title: "Failed to send request",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-terracotta" />
            Borrow this book
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Book details */}
          <div className="bg-sand/50 p-4 rounded-sm border border-border">
            <h3 className="font-semibold text-foreground">{book.title}</h3>
            {book.author && (
              <p className="text-sm text-muted-foreground italic">by {book.author}</p>
            )}
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="capitalize text-xs">
                {book.condition}
              </Badge>
              <span className="text-xs text-muted-foreground">
                from {book.ownerName || 'Anonymous'}
              </span>
            </div>
            {book.houseRules.length > 0 && (
              <div className="mt-3 pt-3 border-t border-border">
                <p className="text-xs font-medium text-muted-foreground mb-1">Borrowing guidelines:</p>
                <ul className="text-xs text-foreground space-y-0.5">
                  {book.houseRules.map((rule, i) => (
                    <li key={i}>• {rule}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Contact form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-sm">Your name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="contact" className="text-sm">How to reach you</Label>
              <Input
                id="contact"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="Email or phone"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="message" className="text-sm">Message</Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="When would you like to borrow it?"
                rows={3}
              />
            </div>
            <Button type="submit" className="w-full" disabled={sending}>
              {sending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Send request
                </>
              )}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
