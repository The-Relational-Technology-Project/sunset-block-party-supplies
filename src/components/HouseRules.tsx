import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Plus } from "lucide-react";

interface HouseRulesProps {
  rules: string[];
  onRulesChange: (rules: string[]) => void;
}

export function HouseRules({ rules, onRulesChange }: HouseRulesProps) {
  const [newRule, setNewRule] = useState("");

  const defaultRules = [
    "All items should be returned in original condition.",
    "Normal wear and tear acceptable. Please notify owner of any damage or issues.",
    "All items should be returned per owner's instruction."
  ];

  const handleAddRule = () => {
    if (newRule.trim()) {
      onRulesChange([...rules, newRule.trim()]);
      setNewRule("");
    }
  };

  const handleRemoveRule = (index: number) => {
    onRulesChange(rules.filter((_, i) => i !== index));
  };

  const handleLoadDefaults = () => {
    onRulesChange(defaultRules);
  };

  return (
    <div className="space-y-4">
      {rules.length === 0 && (
        <div className="text-center py-6">
          <p className="text-muted-foreground mb-4">No rules added yet.</p>
          <Button onClick={handleLoadDefaults} variant="outline" size="sm">
            Load Default Rules
          </Button>
        </div>
      )}

      {rules.map((rule, index) => (
        <div key={index} className="flex items-start gap-2 p-3 bg-sand/20 rounded-sm border border-sand">
          <div className="flex-1 text-sm text-foreground">{rule}</div>
          <Button
            onClick={() => handleRemoveRule(index)}
            variant="ghost"
            size="sm"
            className="h-auto p-1 hover:bg-terracotta/10"
          >
            <X className="h-4 w-4 text-terracotta" />
          </Button>
        </div>
      ))}

      <div className="space-y-2">
        <Label htmlFor="newRule" className="text-deep-brown font-medium">Add a custom rule</Label>
        <div className="flex gap-2">
          <Input
            id="newRule"
            placeholder="Enter a new rule..."
            value={newRule}
            onChange={(e) => setNewRule(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddRule()}
            className="flex-1 border-border"
          />
          <Button 
            onClick={handleAddRule} 
            disabled={!newRule.trim()}
            variant="outline"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
