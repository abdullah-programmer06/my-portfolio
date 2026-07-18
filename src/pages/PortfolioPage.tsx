import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Play, X } from "lucide-react";
import {
  db,
  collection,
  onSnapshot,
  query,
  orderBy,
  doc,
  getDoc,
} from "../lib/firebase";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

import Footer from "../components/Footer";

export default function PortfolioPage() {
  const [activeTab, setActiveTab] = useState("");
  const [allProjects, setAllProjects] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      const docSnap = await getDoc(doc(db, "settings", "general"));
      if (docSnap.exists() && docSnap.data().categories) {
        setCategories(docSnap.data().categories);
        if (docSnap.data().categories.length > 0) {
          setActiveTab(docSnap.data().categories[0]);
        }
      }
    };
    fetchSettings();

    const q = query(collection(db, "portfolio"), orderBy("order"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const items: any[] = [];
      querySnapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() });
      });
      setAllProjects(items);
    });
    return () => unsubscribe();
  }, []);

  const allCategories = [...categories];

  const filteredProjects = allProjects.filter((p) => {
    const matchesTab =
      activeTab === "ALL"
        ? true
        : p.category.toUpperCase() === activeTab.toUpperCase();
    const matchesSearch = p.title?.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

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
        <div className="max-w-7xl mx-auto px-6 py-12 pt-32 min-h-screen flex flex-col">
          <Link
            to="/"
            className="inline-flex items-center gap-4 text-[#c19d67] hover:text-white transition-colors uppercase tracking-widest text-xs font-bold mb-12"
          >
            <div className="w-10 h-10 rounded-full border border-[#c19d67]/30 flex items-center justify-center">
              <ArrowLeft size={16} />
            </div>
            WORK SHOWCASE
          </Link>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
            <h1 className="text-5xl md:text-7xl font-serif leading-tight">
              Cinematic
              <br />
              <span className="text-[#c19d67] italic">Masterpieces</span> &
              <br />
              Visual Stories
            </h1>
            <input
              type="text"
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent border border-white/10 rounded-2xl px-6 py-4 w-full md:w-80 focus:outline-none focus:border-[#c19d67] text-sm"
            />
          </div>

          <div className="flex flex-wrap gap-3 mb-12">
            {allCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`px-6 py-3 rounded-full text-xs font-bold tracking-widest transition-all ${
                  activeTab === cat
                    ? "bg-[#c19d67] text-black border border-[#c19d67]"
                    : "bg-transparent border border-white/10 text-gray-400 hover:border-white/30 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <motion.div
            layout
            className={`grid gap-4 md:gap-6 ${activeTab.toUpperCase() === "REELS" ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"}`}
          >
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, index) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                  key={project.id}
                  className={`group relative rounded-2xl md:rounded-[2rem] overflow-hidden border border-white/5 bg-[#0a0a0a] ${activeTab.toUpperCase() === "REELS" || project.category.toUpperCase() === "REELS" ? "aspect-[9/16]" : "aspect-video"}`}
                >
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover filter brightness-[0.85] contrast-[1.1] transform transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>

                  <div className="absolute top-4 left-4">
                    <span className="bg-[#c19d67] text-black text-[9px] font-bold px-3 py-1.5 rounded-full tracking-widest uppercase shadow-lg">
                      {project.category}
                    </span>
                  </div>

                  {project.video && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-100 scale-90">
                      <button
                        onClick={() => setActiveVideo(project.video)}
                        className="w-16 h-16 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black hover:scale-110 transition-all duration-300"
                      >
                        <Play size={24} className="ml-1" />
                      </button>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Spacer to push footer down if content is short */}
          <div className="flex-grow"></div>
        </div>

        <AnimatePresence>
          {activeVideo && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 md:p-8"
            >
              <button
                onClick={() => setActiveVideo(null)}
                className="absolute top-8 right-8 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
              >
                <X size={24} />
              </button>
              <div className="w-full max-w-6xl aspect-video rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10">
                <iframe
                  src={
                    activeVideo.includes("youtube") ||
                    activeVideo.includes("youtu.be")
                      ? `https://www.youtube.com/embed/${activeVideo.split("/").pop()?.split("?")[0]}`
                      : activeVideo
                  }
                  className="w-full h-full"
                  allow="autoplay; fullscreen; picture-in-picture"
                ></iframe>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <Footer />
      </div>
    </div>
  );
}
