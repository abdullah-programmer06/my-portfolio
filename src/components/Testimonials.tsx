import React from "react";
import { motion } from "motion/react";

export default function Testimonials() {
  const testimonials = [
    {
      name: "MARCUS",
      role: "Co Founder",
      text: "Perfect Communication And Exceptional Skills. This Guy Is King.",
    },
    {
      name: "PETER",
      role: "Manager",
      text: "Did A Great Job. Understood All The Requirements.",
    },
    {
      name: "JANE",
      role: "CEO",
      text: "Abdullah Was Wonderful To Work With. Will Definitely Hire Him Again.",
    },
  ];

  return (
    <section
      id="testimonials"
      className="py-12 bg-[#050505] relative overflow-hidden"
    >
      {/* Background glow animated */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-3/4 bg-purple-900/20 blur-[120px] pointer-events-none rounded-full"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="inline-block mb-16 relative"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 uppercase">
            TESTIMONIALS
          </h2>
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-[2px] bg-[linear-gradient(to_right,red,yellow,green,blue)]"></div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{
                y: -10,
                boxShadow: "0 20px 40px rgba(134,0,212,0.3)",
              }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl flex flex-col items-center text-center transition-all duration-300"
            >
              <h3 className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 text-xl font-bold mb-1">
                {t.name}
              </h3>
              <p className="text-gray-400 mb-4 font-mono text-[10px] uppercase tracking-wider">
                {t.role}
              </p>
              <p className="text-gray-200 text-sm leading-relaxed italic">
                "{t.text}"
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
