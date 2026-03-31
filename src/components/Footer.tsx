import brandImage from "@/assets/Cricket_logo.png";

const Footer = () => {
  return (
    <footer className="border-t border-border py-12 px-4">
      <div className="container mx-auto text-center">
        <div className="mb-4 flex items-center justify-center gap-2">
          <img src={brandImage} alt="Brand logo" className="h-14 w-auto object-contain md:h-16" />
        </div>
        <p className="mx-auto max-w-md text-sm text-muted-foreground">
          The Indian Premier League - Where cricket meets entertainment. Follow every match, every moment.
        </p>
        <div className="mt-6 flex items-center justify-center gap-6 text-sm text-muted-foreground">
          <span>About</span>
          <span>Contact</span>
          <span>Privacy Policy</span>
          <span>Terms</span>
        </div>
        <p className="mt-6 text-xs text-muted-foreground">(c) 2026 IPL. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
