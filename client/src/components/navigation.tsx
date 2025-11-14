import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Church, Music, BookOpen, Home, Heart } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Navigation() {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "Home", icon: Home },
    { href: "/music", label: "Music", icon: Music },
    { href: "/prayers", label: "Prayers", icon: BookOpen },
    { href: "/intentions", label: "Prayer Intentions", icon: Heart },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-background/95 backdrop-blur-sm shadow-md" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/">
            <div className="flex items-center gap-2 hover-elevate cursor-pointer px-3 py-2 rounded-md" data-testid="link-home-logo">
              <Church className={`h-6 w-6 ${isScrolled || location !== "/" ? "text-primary" : "text-white"}`} />
              <span className={`font-heading text-lg font-semibold ${isScrolled || location !== "/" ? "text-foreground" : "text-white"}`}>
                KARIUA PARISH
              </span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location === link.href;
              return (
                <Link key={link.href} href={link.href}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={
                      !isScrolled && location === "/" && !isActive
                        ? "text-white dark:text-white"
                        : ""
                    }
                    data-testid={`button-nav-${link.label.toLowerCase()}`}
                  >
                    <Icon className="h-4 w-4" />
                    {link.label}
                  </Button>
                </Link>
              );
            })}
            <div className={!isScrolled && location === "/" ? "text-white" : ""}>
              <ThemeToggle />
            </div>
          </div>

          <div className="md:hidden flex items-center gap-2">
            <div className={isScrolled || location !== "/" ? "" : "text-white"}>
              <ThemeToggle />
            </div>
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={isScrolled || location !== "/" ? "" : "text-white dark:text-white"}
                  data-testid="button-mobile-menu"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <div className="flex flex-col gap-4 mt-8">
                  <div className="mb-4">
                    <div className="flex items-center gap-2 px-3">
                      <Church className="h-6 w-6 text-primary" />
                      <span className="font-heading text-lg font-semibold">KARIUA PARISH</span>
                    </div>
                  </div>
                  {navLinks.map((link) => {
                    const Icon = link.icon;
                    const isActive = location === link.href;
                    return (
                      <Link key={link.href} href={link.href}>
                        <Button
                          variant={isActive ? "secondary" : "ghost"}
                          className="w-full justify-start gap-2"
                          onClick={() => setIsOpen(false)}
                          data-testid={`button-mobile-nav-${link.label.toLowerCase()}`}
                        >
                          <Icon className="h-4 w-4" />
                          {link.label}
                        </Button>
                      </Link>
                    );
                  })}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
