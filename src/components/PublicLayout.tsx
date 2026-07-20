import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
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
        {children}
        <Footer />
      </div>
    </div>
  );
}
