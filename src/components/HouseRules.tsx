
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">House Rules for Borrowers</CardTitle>
        <p className="text-sm text-gray-600">
          These rules will be shown to potential borrowers. You can customize them.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {rules.length === 0 && (
          <div className="text-center py-4">
            <p className="text-gray-500 mb-4">No rules added yet.</p>
            <Button onClick={handleLoadDefaults} variant="outline" size="sm">
              Load Default Rules
            </Button>
          </div>
        )}

        {rules.map((rule, index) => (
          <div key={index} className="flex items-start space-x-2 p-3 bg-gray-50 rounded-lg">
            <div className="flex-1 text-sm">{rule}</div>
            <Button
              onClick={() => handleRemoveRule(index)}
              variant="ghost"
              size="sm"
              className="text-red-500 hover:text-red-700 h-auto p-1"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}

        <div className="space-y-2">
          <Label htmlFor="newRule">Add a new rule...</Label>
          <div className="flex space-x-2">
            <Input
              id="newRule"
              placeholder="Enter a new rule..."
              value={newRule}
              onChange={(e) => setNewRule(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddRule()}
              className="flex-1"
            />
            <Button 
              onClick={handleAddRule} 
              disabled={!newRule.trim()}
              className="bg-orange-500 hover:bg-orange-600"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
