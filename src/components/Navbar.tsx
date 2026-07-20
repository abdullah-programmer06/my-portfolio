import React, { useState, useEffect } from "react";
import { Menu, X, Facebook, Linkedin, Instagram } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { db, doc, onSnapshot } from "../lib/firebase";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<any>({});
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "settings", "general"), (doc) => {
      if (doc.exists()) {
        setSettings(doc.data());
      }
    });
    return () => unsubscribe();
  }, []);

  const handleNavClick = (e: React.MouseEvent, item: string) => {
    e.preventDefault();
    setIsOpen(false);
    if (item === "PORTFOLIO") {
      navigate("/portfolio");
    } else {
      if (location.pathname !== "/") {
        navigate("/#" + item.toLowerCase());
        setTimeout(() => {
          const element = document.getElementById(item.toLowerCase());
          if (element) element.scrollIntoView({ behavior: "smooth" });
        }, 100);
      } else {
        const element = document.getElementById(item.toLowerCase());
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        } else {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }
    }
  };

  const handleHireMeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (location.pathname !== "/") {
      navigate("/#contact");
      setTimeout(() => {
        const element = document.getElementById("contact");
        if (element) element.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      const element = document.getElementById("contact");
      if (element) element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed w-full z-50 bg-black/40 backdrop-blur-xl border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <motion.div whileHover={{ scale: 1.05 }} className="flex-shrink-0">
            <Link
              to="/"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="text-white text-3xl md:text-4xl font-bold tracking-tighter"
            >
              {settings.websiteName ? (
                <>
                  {settings.websiteName.slice(
                    0,
                    Math.ceil(settings.websiteName.length / 2),
                  )}
                  <span className="font-light text-purple-400">
                    {settings.websiteName.slice(
                      Math.ceil(settings.websiteName.length / 2),
                    )}
                  </span>
                </>
              ) : (
                <>
                  Video
                  <span className="font-light text-purple-400">Alchemist</span>
                </>
              )}
            </Link>
          </motion.div>

          <div className="hidden lg:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {["HOME", "PORTFOLIO", "ABOUT", "CONTACT"].map((item, i) => (
                <motion.a
                  key={item}
                  whileHover={{ y: -2, color: "#e879f9" }}
                  href={
                    item === "PORTFOLIO"
                      ? "/portfolio"
                      : `/#${item.toLowerCase()}`
                  }
                  onClick={(e: React.MouseEvent) => handleNavClick(e, item)}
                  className="text-gray-300 hover:text-white px-3 py-2 text-xs font-medium transition-colors cursor-pointer"
                >
                  {item}
                </motion.a>
              ))}
            </div>
          </div>

          <div className="hidden lg:flex items-center space-x-4">
            <motion.a
              whileHover={{ scale: 1.2, color: "#e879f9" }}
              href={settings.socialFacebook || "#"}
              target={settings.socialFacebook ? "_blank" : "_self"}
              rel="noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Facebook size={20} />
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.2, color: "#e879f9" }}
              href={settings.socialLinkedin || "#"}
              target={settings.socialLinkedin ? "_blank" : "_self"}
              rel="noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Linkedin size={20} />
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.2, color: "#e879f9" }}
              href={settings.socialInstagram || "#"}
              target={settings.socialInstagram ? "_blank" : "_self"}
              rel="noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Instagram size={20} />
            </motion.a>
            <motion.a
              whileHover={{
                scale: 1.05,
                boxShadow: "0px 0px 15px rgba(134, 0, 212, 0.4)",
              }}
              whileTap={{ scale: 0.95 }}
              href="#contact"
              onClick={handleHireMeClick}
              className="bg-gradient-to-r from-[#8600d4] to-[#ff007f] text-white font-bold py-2.5 px-7 text-xs md:text-sm rounded-full transition-all uppercase tracking-wider ml-4 shadow-lg cursor-pointer"
            >
              HIRE ME
            </motion.a>
          </div>

          <div className="-mr-2 flex lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-white/10 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden bg-black/90 backdrop-blur-xl border-b border-white/10 overflow-hidden"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {["HOME", "PORTFOLIO", "ABOUT", "CONTACT"].map((item) => (
                <a
                  key={item}
                  href={
                    item === "PORTFOLIO"
                      ? "/portfolio"
                      : `/#${item.toLowerCase()}`
                  }
                  onClick={(e: React.MouseEvent) => handleNavClick(e, item)}
                  className="text-gray-300 hover:text-white block px-3 py-2 text-sm font-medium cursor-pointer"
                >
                  {item}
                </a>
              ))}
              <div className="pt-4 pb-2 border-t border-white/10 mt-4 flex flex-col gap-4 px-3">
                <div className="flex items-center space-x-6">
                  <a
                    href={settings.socialFacebook || "#"}
                    target={settings.socialFacebook ? "_blank" : "_self"}
                    rel="noreferrer"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <Facebook size={20} />
                  </a>
                  <a
                    href={settings.socialLinkedin || "#"}
                    target={settings.socialLinkedin ? "_blank" : "_self"}
                    rel="noreferrer"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <Linkedin size={20} />
                  </a>
                  <a
                    href={settings.socialInstagram || "#"}
                    target={settings.socialInstagram ? "_blank" : "_self"}
                    rel="noreferrer"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <Instagram size={20} />
                  </a>
                </div>
                <a
                  href="#contact"
                  onClick={handleHireMeClick}
                  className="bg-gradient-to-r from-[#8600d4] to-[#ff007f] text-white font-bold py-2.5 px-7 text-xs md:text-sm rounded-full transition-all uppercase tracking-wider shadow-lg cursor-pointer inline-flex w-max"
                >
                  HIRE ME
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
