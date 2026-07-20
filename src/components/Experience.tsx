import React from "react";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

export default function Experience() {
  const advantages = [
    {
      title: "Story-Driven Editing",
      description:
        "Every frame is chosen to reinforce your brand's unique narrative and mission.",
    },
    {
      title: "High-Retention Techniques",
      description:
        "I use data-backed editing patterns to keep viewers watching from start to finish.",
    },
    {
      title: "Technical Excellence",
      description:
        "Mastery of Premiere Pro, After Effects, and DaVinci Resolve for top-tier results.",
    },
  ];

  const journey = [
    {
      year: "Present",
      title: "SR. VIDEO EDITOR",
      company: "SRIZONSHIL",
      description:
        "Crafting high-octane visual experiences and viral commercial content for digital-first audiences, focusing on rhythmic precision and narrative impact.",
    },
    {
      year: "2025",
      title: "CREATIVE DIRECTOR",
      company: "D STUDIO",
      description:
        "Defining the future of luxury cinematic storytelling for global fashion and tech brands, overseeing high-end visual campaigns from concept to final delivery.",
    },
    {
      year: "2024",
      title: "MOTION DESIGNER",
      company: "LUMINA ART LAB",
      description:
        "Pioneering experimental visual languages through motion design and digital art installations, collaborating with international artists on immersive projects.",
    },
  ];

  return (
    <section
      id="experience"
      className="py-24 bg-[#050505] relative overflow-hidden"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Advantages Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="mb-32"
        >
          <span className="text-[#c19d67] text-xs md:text-sm font-bold uppercase tracking-[0.2em] mb-4 block">
            DISTINCTIVE ADVANTAGES
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-2 leading-tight">
            I Don't Just Edit,
          </h2>
          <h2 className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#c19d67] to-[#e6d0a7] mb-12 leading-tight font-serif italic">
            I Build Experiences
          </h2>

          <div className="space-y-10 mb-14">
            {advantages.map((adv, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="relative pl-8 border-l-[2px] border-[#c19d67]/30 hover:border-[#c19d67] transition-colors duration-300"
              >
                <h3 className="text-xl md:text-2xl font-bold text-white mb-3">
                  {adv.title}
                </h3>
                <p className="text-gray-400 text-base md:text-lg leading-relaxed max-w-2xl">
                  {adv.description}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="#contact"
            className="inline-flex items-center gap-3 bg-[#c19d67]/20 hover:bg-[#c19d67]/30 border border-[#c19d67]/30 text-[#e6d0a7] font-bold py-4 px-10 text-sm rounded-full transition-all uppercase tracking-wider"
          >
            DIRECT CONTACT <ArrowRight size={16} />
          </motion.a>
        </motion.div>

        {/* Journey Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex">
            <div className="w-[100px] flex-shrink-0"></div>
            <div className="w-[9px] flex-shrink-0"></div>
            <div className="pl-10 flex-1">
              <span className="text-[#c19d67] text-sm md:text-base font-bold uppercase tracking-[0.2em] mb-4 block">
                THE EVOLUTION
              </span>
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-20 leading-tight">
                THE{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c19d67] to-[#e6d0a7] font-serif italic">
                  JOURNEY
                </span>
              </h2>
            </div>
          </div>

          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-[100px] top-2 bottom-2 w-[2px] bg-white/10"></div>

            <div className="space-y-20">
              {journey.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="flex items-start group"
                >
                  <div className="w-[100px] flex-shrink-0 text-right pr-8 pt-1.5">
                    <span className="text-xs md:text-sm font-bold text-gray-500 uppercase tracking-widest">
                      {item.year}
                    </span>
                  </div>

                  {/* Timeline Dot */}
                  <div className="relative z-10 -ml-[3.5px] mt-[10px] w-[9px] h-[9px] rounded-full border-[2px] border-[#c19d67] bg-[#050505] group-hover:bg-[#c19d67] transition-colors duration-300 shadow-[0_0_15px_rgba(193,157,103,0.4)]"></div>

                  <div className="pl-10 flex-1">
                    <h3 className="text-xl md:text-3xl font-bold text-white mb-2">
                      {item.title}
                    </h3>
                    <h4 className="text-xs md:text-sm font-bold text-[#c19d67] uppercase tracking-widest mb-4">
                      {item.company}
                    </h4>
                    <p className="text-gray-400 text-base md:text-lg leading-relaxed max-w-2xl">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
