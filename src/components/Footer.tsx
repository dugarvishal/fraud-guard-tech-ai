import { Shield, Github, Twitter, Linkedin, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const footerSections = [
    {
      title: "Platform",
      links: [
        { name: "Submit URL", href: "/submit" },
        { name: "Analytics Dashboard", href: "/analytics" },
        { name: "AI Assistant", href: "/assistant" },
        { name: "API Access (upcoming)", href: "/api" }
      ]
    },
    {
      title: "Resources",
      links: [
        { name: "Education Center", href: "/education" },
        { name: "Threat Intelligence", href: "/intelligence" },
        { name: "Security Blog", href: "/blog" },
        { name: "Help Center", href: "/help" }
      ]
    },
    {
      title: "Company",
      links: [
        { name: "About Us", href: "/about" },
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Terms of Service", href: "/terms" },
        { name: "Contact", href: "/contact" }
      ]
    }
  ];

  return (
    <footer className="bg-card border-t">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-hero">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-foreground">FraudGuard AI</span>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Advanced AI-powered fraud detection and prevention platform protecting businesses and individuals worldwide.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-security-primary transition-smooth">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-security-primary transition-smooth">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-security-primary transition-smooth">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-security-primary transition-smooth">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section) => (
            <div key={section.title} className="space-y-4">
              <h3 className="font-semibold text-foreground">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link 
                      to={link.href}
                      className="text-muted-foreground hover:text-security-primary transition-smooth"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-muted-foreground text-sm">
            © 2025 FraudGuard AI. All rights reserved. Protecting your digital world.
          </p>
          <div className="flex space-x-6">
            <Link to="/privacy" className="text-sm text-muted-foreground hover:text-security-primary transition-smooth">
              Privacy
            </Link>
            <Link to="/terms" className="text-sm text-muted-foreground hover:text-security-primary transition-smooth">
              Terms
            </Link>
            <Link to="/cookies" className="text-sm text-muted-foreground hover:text-security-primary transition-smooth">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;