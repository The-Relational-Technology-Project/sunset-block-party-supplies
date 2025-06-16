
import { Supply } from "@/types/supply";

export const sampleSupplies: Supply[] = [
  {
    id: "1",
    name: "Beach Ball Birthday Package",
    description: "Complete beach-themed party set including colorful tablecloth, beach ball decorations, sand bucket centerpieces, and tropical banner. Perfect for summer birthdays!",
    category: "decorations",
    condition: "excellent",
    partyTypes: ["Birthday Party", "Other Celebration"],
    dateAvailable: "1/14/2024",
    owner: {
      name: "Sarah Chen",
      zipCode: "94122",
      location: "46th Ave & Judah St",
      avatar: "S"
    }
  },
  {
    id: "2", 
    name: "Bounce House - Ocean Wave",
    description: "Blue and white inflatable bounce house with ocean wave design. Great for kids birthday parties and block parties. Includes blower and setup instructions.",
    category: "inflatables",
    condition: "good",
    partyTypes: ["Birthday Party", "Block Party"],
    dateAvailable: "1/9/2024",
    owner: {
      name: "Mike Rodriguez",
      zipCode: "94121",
      location: "Clement St & 25th Ave",
      avatar: "M"
    }
  },
  {
    id: "3",
    name: "Surfer Costume Collection",
    description: "Set of 8 surfer and beach-themed costumes in various sizes (ages 4-12). Includes wetsuits, Hawaiian shirts, leis, and sunglasses. Perfect for themed parties!",
    category: "costumes",
    condition: "good", 
    partyTypes: ["Birthday Party", "Other Celebration"],
    dateAvailable: "1/7/2024",
    owner: {
      name: "Lisa Wong",
      zipCode: "94122",
      location: "Sunset Blvd & Taraval St",
      avatar: "L"
    }
  }
];
