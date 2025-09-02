import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Shield, Menu, X, User, LogOut, BarChart3, History, Settings } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const { user, signOut } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (user) {
      // Fetch user role from profiles table
      const fetchUserRole = async () => {
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('user_id', user.id)
          .single();
        
        if (!error && data) {
          setUserRole(data.role);
        }
      };
      
      fetchUserRole();
    } else {
      setUserRole(null);
    }
  }, [user]);

  const navItems = [
    { name: "Submit URL", href: "/submit" },
    { name: "Analytics", href: "/analytics", authRequired: true },
    { name: "Education", href: "/education" },
    { name: "Documentation", href: "/documentation" },
    { name: "AI Assistant", href: "/assistant" },
    ...(userRole === 'admin' ? [{ name: "Admin Functions", href: "/admin", adminRequired: true }] : []),
  ];

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-hero">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">FraudGuard AI</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const isAuthRequired = item.authRequired && !user;
              const isActive = location.pathname === item.href;
              
              return (
                <div key={item.name} className="relative">
                  <Link
                    to={item.href}
                    className={`text-sm font-medium transition-smooth flex items-center gap-2 ${
                      isActive 
                        ? 'text-primary' 
                        : isAuthRequired 
                          ? 'text-muted-foreground/60 cursor-not-allowed' 
                          : 'text-muted-foreground hover:text-primary'
                    } ${item.adminRequired ? 'text-orange-600 font-semibold' : ''}`}
                    onClick={(e) => isAuthRequired && e.preventDefault()}
                  >
                    {item.adminRequired && <Settings className="h-4 w-4" />}
                    {item.name}
                    {isAuthRequired && <Badge variant="secondary" className="text-xs">Login Required</Badge>}
                  </Link>
                </div>
              );
            })}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {user.user_metadata?.display_name || user.email?.split('@')[0]}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link to="/analytics" className="flex items-center gap-2">
                      <BarChart3 className="h-4 w-4" />
                      Analytics Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/history" className="flex items-center gap-2">
                      <History className="h-4 w-4" />
                      Submission History
                    </Link>
                  </DropdownMenuItem>
                  {userRole === 'admin' && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/admin" className="flex items-center gap-2 text-orange-600 font-semibold">
                          <Settings className="h-4 w-4" />
                          Admin Functions
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="flex items-center gap-2">
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/auth">Sign In</Link>
                </Button>
                <Button size="sm" className="bg-gradient-hero hover:opacity-90 transition-smooth" asChild>
                  <Link to="/auth">Get Started</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden rounded-lg p-2 text-muted-foreground hover:text-foreground hover:bg-muted transition-smooth"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col space-y-2">
              {navItems.map((item) => {
                const isAuthRequired = item.authRequired && !user;
                const isActive = location.pathname === item.href;
                
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-smooth flex items-center justify-between ${
                      isActive 
                        ? 'text-primary bg-primary/5' 
                        : isAuthRequired 
                          ? 'text-muted-foreground/60 cursor-not-allowed' 
                          : 'text-muted-foreground hover:text-primary hover:bg-muted'
                    } ${item.adminRequired ? 'text-orange-600 font-semibold' : ''}`}
                    onClick={(e) => {
                      if (isAuthRequired) {
                        e.preventDefault();
                      } else {
                        setIsMenuOpen(false);
                      }
                    }}
                  >
                    <span className="flex items-center gap-2">
                      {item.adminRequired && <Settings className="h-4 w-4" />}
                      {item.name}
                    </span>
                    {isAuthRequired && <Badge variant="secondary" className="text-xs">Login Required</Badge>}
                  </Link>
                );
              })}
              
              <div className="pt-4 space-y-2">
                {user ? (
                  <>
                    <div className="px-3 py-2 text-sm font-medium text-foreground border rounded-lg">
                      {user.user_metadata?.display_name || user.email?.split('@')[0]}
                    </div>
                    <Button variant="ghost" size="sm" className="w-full justify-start" asChild>
                      <Link to="/analytics" onClick={() => setIsMenuOpen(false)}>
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Analytics
                      </Link>
                    </Button>
                    {userRole === 'admin' && (
                      <Button variant="ghost" size="sm" className="w-full justify-start text-orange-600 font-semibold" asChild>
                        <Link to="/admin" onClick={() => setIsMenuOpen(false)}>
                          <Settings className="h-4 w-4 mr-2" />
                          Admin Functions
                        </Link>
                      </Button>
                    )}
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full justify-start" 
                      onClick={() => {
                        handleSignOut();
                        setIsMenuOpen(false);
                      }}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="ghost" size="sm" className="w-full justify-start" asChild>
                      <Link to="/auth" onClick={() => setIsMenuOpen(false)}>Sign In</Link>
                    </Button>
                    <Button size="sm" className="w-full bg-gradient-hero hover:opacity-90 transition-smooth" asChild>
                      <Link to="/auth" onClick={() => setIsMenuOpen(false)}>Get Started</Link>
                    </Button>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;