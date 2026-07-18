import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Aperture, Layers } from "lucide-react";
import { db, doc, onSnapshot } from "../lib/firebase";

export default function About() {
  const [settings, setSettings] = useState<any>({});

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "settings", "general"), (doc) => {
      if (doc.exists()) {
        setSettings(doc.data());
      }
    });
    return () => unsubscribe();
  }, []);

  const tools = [
    {
      name: "PREMIERE PRO",
      icon: "Pr",
      color: "#2B0054",
      textColor: "#E1B1FF",
    },
    {
      name: "AFTER EFFECTS",
      icon: "Ae",
      color: "#00005E",
      textColor: "#9999FF",
    },
    { name: "PHOTOSHOP", icon: "Ps", color: "#001E36", textColor: "#31A8FF" },
    {
      name: "DAVINCI RESOLVE",
      icon: <Aperture size={18} />,
      color: "#1A1A1A",
      textColor: "#FFFFFF",
    },
    {
      name: "CINEMA 4D",
      icon: <Layers size={18} />,
      color: "#1A1A1A",
      textColor: "#FFFFFF",
    },
    { name: "FIGMA", icon: "Fg", color: "#1A1A1A", textColor: "#FFFFFF" },
  ];

  return (
    <section id="about" className="py-24 bg-[#050505] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="relative rounded-[2rem] group max-w-md mx-auto lg:mx-0 w-full z-10"
          >
            {/* Background Glow to separate hair from dark background */}
            <motion.div
              animate={{
                scale: [1, 1.05, 1],
                opacity: [0.4, 0.6, 0.4],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 bg-gradient-to-tr from-purple-600/30 to-pink-600/30 blur-2xl -z-10 rounded-[2rem] translate-y-4 translate-x-4"
            />

            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 shadow-[0_0_50px_rgba(134,0,212,0.15)] bg-[#0a0a0a]">
              {/* Backlight behind the head to separate hair */}
              <div className="absolute -top-20 inset-x-0 h-64 bg-gradient-to-b from-purple-500/40 to-transparent blur-[50px] z-0"></div>

              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent z-10"></div>
              <img
                src={
                  settings.aboutImage ||
                  "https://cdn.discordapp.com/attachments/1478784491274109202/1527687552637603860/Untitled_design_1.png?ex=6a5b9167&is=6a5a3fe7&hm=0e0a8e91ff01d2245bcaa241100f635cdbed1e3bcecd6c30faf31793df1ab936&"
                }
                alt="Abdullah"
                className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-105 filter contrast-[1.1] brightness-[1.05] relative z-0"
              />
            </div>

            {/* Experience Badge */}
            <motion.div
              whileHover={{ scale: 1.05, rotate: 2 }}
              className="absolute -bottom-6 -right-6 z-20 bg-[#111]/90 backdrop-blur-xl border border-purple-500/30 p-6 rounded-3xl flex flex-col items-center justify-center text-center shadow-[0_0_30px_rgba(134,0,212,0.3)]"
            >
              <span className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-1">
                {settings.aboutExperience || "2+"}
              </span>
              <span className="text-[10px] text-gray-300 font-bold tracking-[0.2em] uppercase max-w-[80px]">
                Years of Experience
              </span>
            </motion.div>
          </motion.div>

          {/* Right Column - Content */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
            }}
          >
            <motion.span
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              className="text-purple-400 text-xs font-bold uppercase tracking-[0.2em] mb-4 block"
            >
              The Creative Narrative
            </motion.span>

            <motion.h2
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              className="text-2xl md:text-4xl font-bold text-white mb-6 leading-tight"
            >
              Mastering the{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 font-serif italic font-medium">
                Cinematic
              </span>{" "}
              Art of Storytelling
            </motion.h2>

            <motion.p
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              className="text-gray-400 text-sm md:text-base leading-relaxed mb-10 whitespace-pre-wrap"
            >
              {settings.aboutText ||
                "Based in the pulse of the digital design landscape, I've spent the last few years distilling complex narratives into visual poetry. My journey is anchored in film aesthetics, evolving into a professional mission to help brands and creators define their visual legacy."}
            </motion.p>

            {/* Tools Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10">
              {tools.map((tool, index) => (
                <motion.div
                  key={index}
                  variants={{
                    hidden: { opacity: 0, scale: 0.8 },
                    visible: { opacity: 1, scale: 1 },
                  }}
                  whileHover={{
                    y: -5,
                    backgroundColor: "rgba(255,255,255,0.1)",
                    borderColor: "rgba(232,121,249,0.3)",
                  }}
                  className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center gap-3 transition-colors cursor-pointer"
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm border shadow-lg"
                    style={{
                      backgroundColor: tool.color,
                      color: tool.textColor,
                      borderColor: `${tool.textColor}30`,
                    }}
                  >
                    {tool.icon}
                  </div>
                  <span className="text-[10px] text-gray-300 font-bold tracking-widest uppercase text-center group-hover:text-white transition-colors">
                    {tool.name}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Stats */}
            <div className="flex gap-12">
              <motion.div
                variants={{
                  hidden: { opacity: 0, x: -20 },
                  visible: { opacity: 1, x: 0 },
                }}
              >
                <h3 className="text-3xl font-bold text-white mb-1 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                  {settings.aboutProjects || "183+"}
                </h3>
                <span className="text-[10px] text-gray-400 font-bold tracking-widest uppercase">
                  Projects Done
                </span>
              </motion.div>
              <motion.div
                variants={{
                  hidden: { opacity: 0, x: -20 },
                  visible: { opacity: 1, x: 0 },
                }}
              >
                <h3 className="text-3xl font-bold text-white mb-1 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                  {settings.aboutClients || "47+"}
                </h3>
                <span className="text-[10px] text-gray-400 font-bold tracking-widest uppercase">
                  Happy Clients
                </span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
