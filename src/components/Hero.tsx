import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ChevronRight, Play, Star } from "lucide-react";
import { db, doc, onSnapshot } from "../lib/firebase";

export default function Hero() {
  const [heroTitle, setHeroTitle] = useState(
    'Creative <br/> <span className="text-[#c19d67]">Visuals</span> <br/> for Modern <br/> Brands',
  );
  const [heroSubtitle, setHeroSubtitle] = useState(
    "I transform complex concepts into clean and compelling visuals, which make brands more engaging and credible.",
  );
  const [heroImage, setHeroImage] = useState(
    "https://cdn.discordapp.com/attachments/1478784491274109202/1527687552637603860/Untitled_design_1.png?ex=6a5b9167&is=6a5a3fe7&hm=0e0a8e91ff01d2245bcaa241100f635cdbed1e3bcecd6c30faf31793df1ab936&",
  );
  const [aboutClients, setAboutClients] = useState("47+");

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "settings", "general"), (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        if (data.heroTitle) setHeroTitle(data.heroTitle);
        if (data.heroSubtitle) setHeroSubtitle(data.heroSubtitle);
        if (data.heroImage) setHeroImage(data.heroImage);
        if (data.aboutClients) setAboutClients(data.aboutClients);
      }
    });
    return () => unsubscribe();
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "linear" as any },
    },
  };

  const floatVariants = {
    initial: { y: 0 },
    animate: {
      y: [-10, 10, -10],
      transition: { duration: 4, repeat: Infinity, ease: "linear" as any },
    },
  };

  const floatVariantsDelayed = {
    initial: { y: 0 },
    animate: {
      y: [10, -10, 10],
      transition: { duration: 5, repeat: Infinity, ease: "linear" as any },
    },
  };

  return (
    <section
      id="home"
      className="relative pt-20 pb-12 lg:pt-28 lg:pb-16 overflow-hidden bg-[#050505]"
    >
      {/* Static Smoke / Glow Backgrounds */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-purple-900/30 rounded-full blur-[100px] mix-blend-screen opacity-40" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-pink-900/20 rounded-full blur-[100px] mix-blend-screen opacity-30" />
        <div className="absolute top-[40%] left-[30%] w-[40vw] h-[40vw] bg-blue-900/20 rounded-full blur-[100px] mix-blend-screen opacity-20" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 h-full flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center lg:gap-20 mt-10 lg:mt-0">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.1 }}
            className="max-w-xl xl:max-w-2xl relative z-20"
          >
            <motion.h1
              variants={itemVariants}
              className="text-4xl md:text-5xl lg:text-[4rem] font-bold text-white leading-[1.1] mb-6 font-serif tracking-tight"
              dangerouslySetInnerHTML={{ __html: heroTitle }}
            ></motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-gray-400 text-base md:text-lg mb-10 max-w-lg leading-relaxed"
            >
              {heroSubtitle}
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-wrap items-center gap-4 mb-12"
            >
              <motion.a
                whileHover={{
                  scale: 1.05,
                  backgroundColor: "#c19d67",
                  color: "#111",
                }}
                whileTap={{ scale: 0.95 }}
                href="#contact"
                className="inline-flex items-center justify-center gap-2 bg-[#b4905a] text-[#1a1a1a] font-bold py-3.5 px-8 text-xs md:text-sm rounded-full transition-all uppercase tracking-widest shadow-[0_0_20px_rgba(180,144,90,0.3)]"
              >
                HIRE ME NOW <ChevronRight size={16} />
              </motion.a>
              <motion.a
                whileHover={{
                  scale: 1.05,
                  backgroundColor: "#152a23",
                  borderColor: "rgba(255,255,255,0.2)",
                }}
                whileTap={{ scale: 0.95 }}
                href="#portfolio"
                className="inline-flex items-center justify-center gap-2 bg-[#0f1f1a] border border-white/10 text-white font-bold py-3.5 px-8 text-xs md:text-sm rounded-full transition-all uppercase tracking-widest shadow-lg"
              >
                VIEW MY WORK <Play size={14} fill="currentColor" />
              </motion.a>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="flex items-center gap-6"
            >
              <div className="flex -space-x-3">
                <motion.img
                  whileHover={{ scale: 1.1, zIndex: 10 }}
                  className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-[#050505] object-cover relative transition-transform"
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
                  alt="Client 1"
                />
                <motion.img
                  whileHover={{ scale: 1.1, zIndex: 10 }}
                  className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-[#050505] object-cover relative transition-transform"
                  src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop"
                  alt="Client 2"
                />
                <motion.img
                  whileHover={{ scale: 1.1, zIndex: 10 }}
                  className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-[#050505] object-cover relative transition-transform"
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop"
                  alt="Client 3"
                />
                <motion.img
                  whileHover={{ scale: 1.1, zIndex: 10 }}
                  className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-[#050505] object-cover relative transition-transform"
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop"
                  alt="Client 4"
                />
              </div>
              <div className="flex flex-col justify-center">
                <div className="flex gap-1 mb-1">
                  {[1, 2, 3, 4, 5].map((i, idx) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: false }}
                      transition={{ delay: 1 + idx * 0.1 }}
                    >
                      <Star
                        size={14}
                        className="text-[#b4905a] fill-[#b4905a]"
                      />
                    </motion.div>
                  ))}
                </div>
                <span className="text-[10px] md:text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">
                  Trusted by {aboutClients} Global Clients
                </span>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative flex justify-center items-center h-full mt-12 lg:mt-0 z-10"
          >
            {/* Glassy Frame for Image */}
            <div className="relative w-full max-w-lg xl:max-w-xl aspect-[4/4.5] rounded-[2.5rem] bg-[#0a0a0a]/50 border border-white/5 flex items-end justify-center group">
              {/* Intense Purple Glow Behind the Person */}
              <div className="absolute inset-0 m-auto w-4/5 h-4/5 bg-[#8a2be2] rounded-full blur-[90px] opacity-70 -z-10" />

              {/* Character Image */}
              <img
                src={heroImage}
                alt="Portrait"
                className="w-[95%] h-auto object-contain rounded-b-[2.5rem] relative z-10 drop-shadow-[0_-5px_25px_rgba(0,0,0,0.5)] transform translate-y-1"
              />

              {/* Floating Elements (Pr, Ae) */}
              <motion.div
                variants={floatVariants}
                initial="initial"
                animate="animate"
                className="absolute top-12 left-2 md:-left-4 lg:-left-6 z-20"
              >
                <div className="relative group cursor-pointer">
                  <motion.div
                    animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.05, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute inset-0 bg-[#8a2be2] rounded-2xl blur-md opacity-50 group-hover:opacity-100 transition-opacity"
                  ></motion.div>
                  <div className="relative bg-[#0a0a0a] backdrop-blur-xl border-2 border-[#8a2be2]/60 p-3 rounded-2xl shadow-[0_0_30px_rgba(138,43,226,0.4)]">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-[#2B0054] rounded-xl flex items-center justify-center text-[#E1B1FF] font-bold text-base md:text-lg border border-[#E1B1FF]/40">
                      Pr
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                variants={floatVariantsDelayed}
                initial="initial"
                animate="animate"
                className="absolute top-1/2 right-2 md:-right-4 lg:-right-6 z-20"
              >
                <div className="relative group cursor-pointer">
                  <motion.div
                    animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.05, 1] }}
                    transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                    className="absolute inset-0 bg-[#0000ff] rounded-2xl blur-md opacity-40 group-hover:opacity-100 transition-opacity"
                  ></motion.div>
                  <div className="relative bg-[#0a0a0a] backdrop-blur-xl border-2 border-[#0000ff]/50 p-3 rounded-2xl shadow-[0_0_30px_rgba(0,0,255,0.3)]">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-[#00005E] rounded-xl flex items-center justify-center text-[#9999FF] font-bold text-base md:text-lg border border-[#9999FF]/40">
                      Ae
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
