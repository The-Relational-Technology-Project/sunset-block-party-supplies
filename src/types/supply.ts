export interface Supply {
  id: string;
  name: string;
  description: string;
  category: string;
  condition: 'excellent' | 'good' | 'fair';
  partyTypes: string[];
  dateAvailable: string;
  location?: string;
  contactEmail?: string;
  image?: string; // Keep for backward compatibility
  images?: string[]; // New multiple images support
  illustration_url?: string; // AI-generated minimalist illustration
  houseRules?: string[];
  ownerId?: string; // Add owner ID for database operations
  owner: {
    name: string;
    zipCode: string;
    location: string;
    avatar: string;
  };
}

export interface PartyPlan {
  theme?: string;
  ageGroup: string;
  guestCount: number;
  budgetRange: string;
  partyStyle: string;
  partyDate?: string;
  priorities: string[];
}
