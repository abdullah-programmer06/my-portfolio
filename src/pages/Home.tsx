/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "motion/react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import About from "../components/About";
import Portfolio from "../components/Portfolio";
import Testimonials from "../components/Testimonials";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import Experience from "../components/Experience";

export default function App() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      setTimeout(() => {
        const id = location.hash.replace("#", "");
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-[#020202] font-sans text-white relative overflow-hidden">
      {/* Static Film Grain Effect */}
      <div className="pointer-events-none fixed inset-0 z-50 opacity-[0.03] mix-blend-screen bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

      {/* Static Smoke / Glow Background */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-purple-900/40 rounded-full blur-[100px] mix-blend-screen opacity-20" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-pink-900/30 rounded-full blur-[100px] mix-blend-screen opacity-15" />
      </div>

      <div className="relative z-10">
        <Navbar />
        <main>
          <Hero />
          <Portfolio />
          <Testimonials />
          <Experience />
          <About />
          <Contact />
        </main>
        <Footer />
      </div>
    </div>
  );
}
