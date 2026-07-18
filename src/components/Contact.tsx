import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  Send,
  Mail,
  Instagram,
  Linkedin,
  Facebook,
  MessageCircle,
} from "lucide-react";
import { db, collection, addDoc, doc, onSnapshot } from "../lib/firebase";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [ventureNature, setVentureNature] = useState("Commercial Masterpiece");
  const [intent, setIntent] = useState("");
  const [status, setStatus] = useState("");
  const [settings, setSettings] = useState<any>({});

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "settings", "general"), (doc) => {
      if (doc.exists()) {
        setSettings(doc.data());
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("Submitting...");
    try {
      await addDoc(collection(db, "messages"), {
        name,
        email,
        whatsapp,
        ventureNature,
        creativeIntent: intent,
        status: "pending",
        createdAt: new Date().toISOString(),
      });
      setStatus("Message sent successfully!");
      setName("");
      setEmail("");
      setWhatsapp("");
      setIntent("");
    } catch (err) {
      setStatus("Failed to send message.");
    }
  };

  return (
    <section
      id="contact"
      className="py-24 bg-[#050505] relative overflow-hidden flex justify-center"
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col"
          >
            <h4 className="text-[10px] text-[#c19d67] font-bold tracking-widest uppercase mb-4">
              The Final Frontier
            </h4>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white mb-6 leading-tight tracking-tight">
              Let's Compose
              <br />
              Your <span className="text-[#c19d67]">Masterpiece</span>
            </h2>
            <p className="text-gray-400 text-sm md:text-base mb-12 max-w-md leading-relaxed">
              Every legacy begins with an inquiry. Reach out today for a bespoke
              creative consultation. Let's draft an enduring digital odyssey.
            </p>

            <div className="flex flex-col gap-8 mb-16">
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-xl bg-[#1a1a1a] flex items-center justify-center text-[#c19d67]">
                  <MessageCircle size={22} />
                </div>
                <div>
                  <div className="text-[9px] text-gray-400 font-bold tracking-widest uppercase mb-1.5">
                    I Am Here
                  </div>
                  {settings.socialWhatsapp ? (
                    <a
                      href={settings.socialWhatsapp}
                      target="_blank"
                      rel="noreferrer"
                      className="text-white font-bold text-lg hover:text-[#c19d67] transition-colors"
                    >
                      WhatsApp Me
                    </a>
                  ) : (
                    <div className="text-white font-bold text-lg">
                      WhatsApp Me
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-xl bg-[#1a1a1a] flex items-center justify-center text-[#c19d67]">
                  <Mail size={22} />
                </div>
                <div>
                  <div className="text-[9px] text-gray-400 font-bold tracking-widest uppercase mb-1.5">
                    Direct Correspondence
                  </div>
                  <a
                    href={`mailto:${settings.contactEmail || "reehmanhridoy@gmail.com"}`}
                    className="text-white font-bold text-lg hover:text-[#c19d67] transition-colors"
                  >
                    {settings.contactEmail || "reehmanhridoy@gmail.com"}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-xl bg-[#1a1a1a] flex items-center justify-center text-[#c19d67]">
                  <Instagram size={22} />
                </div>
                <div>
                  <div className="text-[9px] text-gray-400 font-bold tracking-widest uppercase mb-1.5">
                    Social Connection
                  </div>
                  {settings.socialInstagram ? (
                    <a
                      href={settings.socialInstagram}
                      target="_blank"
                      rel="noreferrer"
                      className="text-white font-bold text-lg hover:text-[#c19d67] transition-colors"
                    >
                      Instagram
                    </a>
                  ) : (
                    <div className="text-white font-bold text-lg">
                      Instagram
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="p-8 md:p-12 rounded-[2.5rem] bg-[#0a0a0a] border border-white/10 shadow-2xl"
          >
            <form onSubmit={handleSubmit} className="flex flex-col gap-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-3">
                  <label className="text-[10px] text-gray-400 font-bold tracking-widest uppercase ml-1">
                    Identity
                  </label>
                  <input
                    type="text"
                    placeholder="Signature Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="bg-[#050505] border border-white/10 rounded-xl px-5 py-4 text-sm text-white focus:outline-none focus:border-[#c19d67] transition-colors placeholder:text-gray-600"
                  />
                </div>

                <div className="flex flex-col gap-3">
                  <label className="text-[10px] text-gray-400 font-bold tracking-widest uppercase ml-1">
                    Correspondence
                  </label>
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-[#050505] border border-white/10 rounded-xl px-5 py-4 text-sm text-white focus:outline-none focus:border-[#c19d67] transition-colors placeholder:text-gray-600"
                  />
                </div>

                <div className="flex flex-col gap-3 md:col-span-2">
                  <label className="text-[10px] text-gray-400 font-bold tracking-widest uppercase ml-1">
                    WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    placeholder="WhatsApp Number"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    required
                    className="bg-[#050505] border border-white/10 rounded-xl px-5 py-4 text-sm text-white focus:outline-none focus:border-[#c19d67] transition-colors placeholder:text-gray-600"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <label className="text-[10px] text-gray-400 font-bold tracking-widest uppercase ml-1">
                  Venture Nature
                </label>
                <div className="relative">
                  <select
                    value={ventureNature}
                    onChange={(e) => setVentureNature(e.target.value)}
                    className="w-full bg-[#050505] border border-white/10 rounded-xl px-5 py-4 text-sm text-white focus:outline-none focus:border-[#c19d67] transition-colors appearance-none cursor-pointer"
                  >
                    <option>Commercial Masterpiece</option>
                    <option>Brand Documentary</option>
                    <option>Social Media Reel</option>
                    <option>SaaS Animation</option>
                  </select>
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg
                      width="10"
                      height="6"
                      viewBox="0 0 10 6"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1 1L5 5L9 1"
                        stroke="#c19d67"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <label className="text-[10px] text-gray-400 font-bold tracking-widest uppercase ml-1">
                  Creative Intent
                </label>
                <textarea
                  placeholder="Elucidate your vision..."
                  rows={5}
                  value={intent}
                  onChange={(e) => setIntent(e.target.value)}
                  required
                  className="bg-[#050505] border border-white/10 rounded-xl px-5 py-4 text-sm text-white focus:outline-none focus:border-[#c19d67] transition-colors placeholder:text-gray-600 resize-none"
                />
              </div>

              {status && (
                <div className="text-[#c19d67] text-sm text-center">
                  {status}
                </div>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="mt-4 w-full bg-[#b4905a] text-[#050505] font-bold py-5 px-6 text-xs rounded-full transition-all uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-[#c19d67]"
              >
                INAUGURATE PROJECT <Send size={16} />
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
