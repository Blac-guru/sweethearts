import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button.jsx";
import { Menu, X, User, MessageSquare, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase.js";
import logoIcon from "@/assets/hearts.png"; // ✅ import your logo
import { useUnreadMessageCount } from "@/hooks/use-chat.js";
import { getChatUserInfo, logoutChatUser } from "@/lib/chat-api.js";

export default function Navbar() {
  const [location, setLocation] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [user] = useAuthState(auth);
  const [profile, setProfile] = useState<any>(null);
  const [chatUser, setChatUser] = useState<any>(null);
  const unreadCount = useUnreadMessageCount();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.uid) {
        setProfile(null);
        return;
      }
      try {
        const res = await fetch(`/api/hairdressers/by-uid/${user.uid}`);
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
        } else {
          setProfile(null);
        }
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        setProfile(null);
      }
    };

    fetchProfile();
  }, [user?.uid]);

  useEffect(() => {
    const fetchChatUser = async () => {
      const userInfo = await getChatUserInfo();
      setChatUser(userInfo);
    };

    fetchChatUser();
  }, [location]);

  const handleChatUserLogout = () => {
    logoutChatUser();
    setChatUser(null);
    setLocation("/");
  };

  return (
    <nav className="bg-card border-b border-border shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/">
              <div className="flex items-center gap-2 cursor-pointer">
                {/* Mobile: only logo */}
                <img
                  src={logoIcon}
                  alt="Site Logo"
                  className="h-8 w-8 object-contain block sm:hidden"
                />
                <h3
                  className="text-xs font-bold text-primary sm:hidden"
                  data-testid="logo"
                >
                  Sweetheart Next Door
                </h3>

                {/* Desktop: logo + text */}
                <div className="hidden sm:flex items-center gap-2">
                  <img
                    src={logoIcon}
                    alt="Site Logo"
                    className="h-8 w-8 object-contain"
                  />
                  <h1
                    className="text-xl font-bold text-primary"
                    data-testid="logo"
                  >
                    Sweetheart Next Door
                  </h1>
                </div>
              </div>
            </Link>
          </div>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link href="/search">
              <Button
                variant={location === "/search" ? "default" : "outline"}
                size="sm"
                data-testid="nav-search"
              >
                Search Filters
              </Button>
            </Link>

            <Link href="/chats">
              <div className="relative">
                <Button
                  variant={location === "/chats" ? "default" : "outline"}
                  size="sm"
                  data-testid="nav-chats"
                  className="relative"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Chats
                </Button>
                {unreadCount > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold"
                  >
                    {unreadCount}
                  </motion.div>
                )}
              </div>
            </Link>

            <Link href="/contact">
              <Button
                variant={location === "/contact" ? "default" : "outline"}
                size="sm"
                data-testid="nav-contact"
              >
                Contact Us
              </Button>
            </Link>

            {profile ? (
              <Link href={`/profile/${profile.id}`}>
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary cursor-pointer">
                  {profile.profilePhoto ? (
                    <img
                      src={profile.profilePhoto}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-muted">
                      <User className="text-muted-foreground w-6 h-6" />
                    </div>
                  )}
                </div>
              </Link>
            ) : chatUser ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                    {chatUser.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium">{chatUser.name}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleChatUserLogout}
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <Link href="/register">
                <Button
                  variant={location === "/register" ? "default" : "outline"}
                  size="sm"
                  data-testid="nav-join-hairdresser"
                >
                  Join Today
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Hamburger */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-primary hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu (Animated) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-card border-t border-border shadow-md"
          >
            <div className="px-4 py-4 space-y-4 flex flex-col">
              <Link href="/search">
                <Button
                  onClick={() => setIsOpen(false)}
                  variant={location === "/search" ? "default" : "outline"}
                  className="w-full"
                  data-testid="nav-search-mobile"
                >
                  Search Filters
                </Button>
              </Link>

              <Link href="/chats">
                <div className="relative w-full">
                  <Button
                    onClick={() => setIsOpen(false)}
                    variant={location === "/chats" ? "default" : "outline"}
                    className="w-full relative"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Chats
                  </Button>
                  {unreadCount > 0 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold"
                    >
                      {unreadCount}
                    </motion.div>
                  )}
                </div>
              </Link>

              <Link href="/contact">
                <Button
                  onClick={() => setIsOpen(false)}
                  variant={location === "/contact" ? "default" : "outline"}
                  className="w-full"
                >
                  Contact Us
                </Button>
              </Link>

              {profile ? (
                <Link href={`/profile/${profile.id}`}>
                  <div
                    className="flex items-center space-x-2"
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary">
                      {profile.profilePhoto ? (
                        <img
                          src={profile.profilePhoto}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-muted">
                          <User className="text-muted-foreground w-6 h-6" />
                        </div>
                      )}
                    </div>
                    <span className="text-sm font-medium">My Profile</span>
                  </div>
                </Link>
              ) : chatUser ? (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-white font-bold">
                      {chatUser.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">{chatUser.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {chatUser.email || chatUser.phoneNumber}
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={() => {
                      handleChatUserLogout();
                      setIsOpen(false);
                    }}
                    variant="outline"
                    className="w-full"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </div>
              ) : (
                <Link href="/register">
                  <Button
                    onClick={() => setIsOpen(false)}
                    variant={location === "/register" ? "default" : "outline"}
                    className="w-full"
                  >
                    Join Today
                  </Button>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
