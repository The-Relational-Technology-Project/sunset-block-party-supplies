import { Home, Mail } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-card border-t border-border py-12 px-4 mt-auto">
      <div className="container mx-auto max-w-md text-center">
        <div className="mb-6">
          <h3 className="text-xl font-serif font-semibold text-deep-brown mb-2">
            Community Supplies
          </h3>
          <p className="text-sm text-muted-foreground">
            Built in the Outer Sunset by neighbors, for neighbors
          </p>
        </div>

        <div className="mb-6">
          <a 
            href="mailto:hello@relationaltechproject.org" 
            className="inline-flex items-center gap-2 text-sm text-terracotta hover:text-terracotta/80 transition-colors"
          >
            <Mail className="w-4 h-4" />
            hello@relationaltechproject.org
          </a>
        </div>

        <div className="mb-6">
          <p className="text-muted-foreground text-sm">
            Reuse and remix this tool for your neighborhood
          </p>
        </div>

        <div className="text-muted-foreground text-sm">
          Made with <span className="text-terracotta">❤️</span> in SF
        </div>
      </div>
    </footer>
  );
};