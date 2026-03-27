import { Trophy } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border py-12 px-4">
      <div className="container mx-auto text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Trophy className="w-6 h-6 text-primary" />
          <span className="font-heading text-xl font-bold text-gradient-gold">IPL 2026</span>
        </div>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          The Indian Premier League — Where cricket meets entertainment. Follow every match, every moment.
        </p>
        <div className="flex items-center justify-center gap-6 mt-6 text-sm text-muted-foreground">
          <span>About</span>
          <span>Contact</span>
          <span>Privacy Policy</span>
          <span>Terms</span>
        </div>
        <p className="text-xs text-muted-foreground mt-6">© 2026 IPL. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;