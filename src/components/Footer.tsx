import React, { useState, useEffect } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Facebook,
  Linkedin,
  Instagram,
  Youtube,
  ArrowUp,
} from "lucide-react";
import { db, doc, onSnapshot } from "../lib/firebase";
import { Link } from "react-router-dom";

export default function Footer() {
  const [settings, setSettings] = useState<any>({});

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "settings", "general"), (doc) => {
      if (doc.exists()) {
        setSettings(doc.data());
      }
    });
    return () => unsubscribe();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[#020202] pt-20 pb-10 relative border-t border-white/5">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-[#c19d67] to-transparent opacity-50"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-10 mb-16">
          <div className="text-center md:text-left">
            <Link
              to="/"
              onClick={scrollToTop}
              className="text-white text-3xl font-bold tracking-tighter inline-block mb-4"
            >
              {settings.websiteName ? (
                <>
                  {settings.websiteName.slice(
                    0,
                    Math.ceil(settings.websiteName.length / 2),
                  )}
                  <span className="font-light text-[#c19d67]">
                    {settings.websiteName.slice(
                      Math.ceil(settings.websiteName.length / 2),
                    )}
                  </span>
                </>
              ) : (
                <>
                  Video
                  <span className="font-light text-[#c19d67]">Alchemist</span>
                </>
              )}
            </Link>
            <p className="text-gray-400 text-sm max-w-sm mx-auto md:mx-0">
              Transforming complex concepts into clean and compelling visual
              masterpieces.
            </p>
          </div>

          <div className="flex gap-4">
            {settings.socialLinkedin && (
              <a
                href={settings.socialLinkedin}
                target="_blank"
                rel="noreferrer"
                className="w-12 h-12 rounded-full bg-[#0a0a0a] border border-white/10 flex items-center justify-center text-white hover:bg-[#c19d67] hover:text-black hover:border-[#c19d67] transition-all"
              >
                <Linkedin size={20} />
              </a>
            )}
            {settings.socialInstagram && (
              <a
                href={settings.socialInstagram}
                target="_blank"
                rel="noreferrer"
                className="w-12 h-12 rounded-full bg-[#0a0a0a] border border-white/10 flex items-center justify-center text-white hover:bg-[#c19d67] hover:text-black hover:border-[#c19d67] transition-all"
              >
                <Instagram size={20} />
              </a>
            )}
            {settings.socialFacebook && (
              <a
                href={settings.socialFacebook}
                target="_blank"
                rel="noreferrer"
                className="w-12 h-12 rounded-full bg-[#0a0a0a] border border-white/10 flex items-center justify-center text-white hover:bg-[#c19d67] hover:text-black hover:border-[#c19d67] transition-all"
              >
                <Facebook size={20} />
              </a>
            )}
            {settings.socialWhatsapp && (
              <a
                href={settings.socialWhatsapp}
                target="_blank"
                rel="noreferrer"
                className="w-12 h-12 rounded-full bg-[#0a0a0a] border border-white/10 flex items-center justify-center text-white hover:bg-[#c19d67] hover:text-black hover:border-[#c19d67] transition-all"
              >
                <Phone size={20} />
              </a>
            )}
          </div>
        </div>

        <div className="border-t border-white/10 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-gray-500 text-sm text-center md:text-left">
            &copy; {new Date().getFullYear()}{" "}
            {settings.websiteName || "VideoAlchemist"}. All rights reserved.
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 text-gray-400 hover:text-[#c19d67] transition-colors text-sm font-bold tracking-widest uppercase"
          >
            Back to Top <ArrowUp size={16} />
          </button>

          <div className="text-xs text-gray-600 font-mono tracking-widest uppercase text-center md:text-right">
            DEVELOPED BY ABDULLAH AL BAKI
          </div>
        </div>
      </div>
    </footer>
  );
}
