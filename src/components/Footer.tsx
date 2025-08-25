import { Home, Mail } from "lucide-react";
export const Footer = () => {
  return <footer className="bg-muted border-t border-border py-12 px-4">
      <div className="container mx-auto max-w-md text-center">
        {/* Logo and Title */}
        <div className="mb-6">
          <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Home className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-foreground mb-2">Community Supplies</h3>
          <p className="text-muted-foreground">
            Built in Outer Sunset by neighbors, for neighbors
          </p>
        </div>

        {/* Contact */}
        <div className="mb-6">
          <a href="mailto:hello@communitypartysupplies.org" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors">
            <Mail className="w-4 h-4" />
            Contact us at hello@communitypartysupplies.org
          </a>
        </div>

        {/* Reuse message */}
        <div className="mb-6">
          <p className="text-muted-foreground text-sm">
            Reuse and remix this site for your neighborhood!
          </p>
        </div>

        {/* Made with love */}
        <div className="text-muted-foreground text-sm">
          Made with <span className="text-red-500">❤️</span> in SF
        </div>
      </div>
    </footer>;
};