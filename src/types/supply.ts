export interface Supply {
  id: string;
  name: string;
  description: string;
  category: string;
  condition: 'excellent' | 'good' | 'fair';
  partyTypes: string[];
  dateAvailable: string;
  owner: {
    name: string;
    zipCode: string;
    location: string;
    avatar: string;
  };
  image?: string;
  houseRules?: string[];
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
