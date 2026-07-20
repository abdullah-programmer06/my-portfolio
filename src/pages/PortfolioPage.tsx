import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import VideoPlayer from "../components/VideoPlayer";
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


const getYoutubeId = (url: string) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

const getThumbnailUrl = (project: any) => {
  const image = project.image || project.imageUrl || "";
  const video = project.video || project.videoUrl || "";
  
  if (image && !image.includes('youtube.com') && !image.includes('youtu.be')) {
    return image;
  }
  
  const ytId = getYoutubeId(video) || getYoutubeId(image);
  if (ytId) {
    return `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
  }
  return image || "";
};

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
          className="bg-[#0a0a0a]/50 border border-white/10 rounded-full px-6 py-3 text-sm text-white focus:outline-none focus:border-[#c19d67] focus:ring-1 focus:ring-[#c19d67]/50 transition-all w-full md:w-64 backdrop-blur-md"
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 w-full md:w-fit md:ml-auto mb-12">
        <button
          onClick={() => setActiveTab("ALL")}
          className={`px-6 py-2 rounded-full text-xs font-bold tracking-widest transition-all ${
            activeTab === "ALL"
              ? "bg-[#c19d67] text-black"
              : "border border-white/10 hover:border-[#c19d67]/50"
          }`}
        >
          ALL PROJECTS
        </button>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveTab(category)}
            className={`px-6 py-2 rounded-full text-xs font-bold tracking-widest transition-all uppercase ${
              activeTab === category
                ? "bg-[#c19d67] text-black"
                : "border border-white/10 hover:border-[#c19d67]/50"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project, index) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              key={project.id}
              className="group relative cursor-pointer"
              onClick={() => {
              let vid = project.video || project.videoUrl;
              if (!vid && (project.image || project.imageUrl)) {
                const imgUrl = project.image || project.imageUrl;
                if (imgUrl.includes('youtube') || imgUrl.includes('youtu.be') || imgUrl.includes('vimeo')) {
                  vid = imgUrl;
                }
              }
              if (vid) setActiveVideo(vid);
            }}
            >
              <div className="aspect-[4/5] overflow-hidden rounded-[2rem] relative">
                <img
                  src={getThumbnailUrl(project)}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white">
                    <Play fill="currentColor" size={24} />
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-between items-start gap-4">
                <div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-[#c19d67] transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-gray-400 text-sm">{project.description}</p>
                </div>
                <span className="text-[#c19d67] text-xs font-bold tracking-widest uppercase shrink-0">
                  {project.category}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {activeVideo && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(10px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90"
          >
            <button
              onClick={() => setActiveVideo(null)}
              className="absolute top-8 right-8 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
            >
              <X size={24} />
            </button>
            <div className="w-full max-w-6xl aspect-video rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10">
              <VideoPlayer url={activeVideo} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
