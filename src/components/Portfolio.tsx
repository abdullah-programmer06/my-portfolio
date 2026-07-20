import React, { useState, useEffect } from "react";
import { Play, ArrowRight, Award, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import VideoPlayer from "./VideoPlayer";
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

export default function Portfolio() {
  const [activeTab, setActiveTab] = useState("REELS");
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [allProjects, setAllProjects] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([
    "REELS",
    "COMMERCIAL",
    "SAAS ANIMATION",
    "MOTION GRAPHICS",
  ]);

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
      // Home page only shows pinned projects
      setAllProjects(items.filter((p) => p.pinned));
    });
    return () => unsubscribe();
  }, []);

  const allCategories = [...categories];
  const filteredProjects = allProjects.filter(
    (p) => p.category.toUpperCase() === activeTab.toUpperCase(),
  );

  return (
    <section
      id="portfolio"
      className="py-24 bg-[#050505] relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 relative">
        <div className="flex flex-col md:flex-row md:items-start justify-between mb-16 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white uppercase tracking-tight">
              MY BEST EDITS
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 w-full md:w-fit md:ml-auto"
          >
            {allCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`px-4 py-2 md:px-5 md:py-2 rounded-full text-[9px] md:text-[10px] font-bold transition-all uppercase tracking-widest ${
                  activeTab === cat
                    ? "border border-[#c19d67] bg-[#c19d67]/10 text-[#c19d67]"
                    : "bg-[#152a23] text-[#709b86] hover:bg-[#1a352c]"
                }`}
              >
                {cat}
              </button>
            ))}
          </motion.div>
        </div>

        <motion.div
          layout
          className={`grid gap-4 md:gap-6 ${activeTab.toUpperCase() === "REELS" || activeTab.toUpperCase() === "ALL" ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"}`}
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: false, margin: "0px" }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                key={project.id}
                className={`group relative rounded-2xl md:rounded-[2rem] overflow-hidden border border-white/5 bg-[#0a0a0a] ${activeTab.toUpperCase() === "REELS" ? "aspect-[9/16]" : "aspect-video"}`}
              >
                <img
                  src={getThumbnailUrl(project)}
                  alt="Portfolio Item"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                <div className="absolute top-3 right-3 md:top-4 md:right-4 bg-black/40 backdrop-blur-md border border-white/10 rounded-full px-2 py-1 md:px-3 md:py-1.5 flex items-center gap-1.5 z-10 hidden sm:flex">
                  <span className="text-[8px] md:text-[9px] text-white font-bold tracking-widest">
                    4K
                  </span>
                  <Award size={10} className="text-gray-300" />
                </div>

                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20 backdrop-blur-[2px]">
                  <motion.button
                    onClick={() => { const vid = project.video || project.videoUrl || project.image || project.imageUrl; if (vid) setSelectedVideo(vid); }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-12 h-12 md:w-16 md:h-16 bg-white/20 backdrop-blur-md border border-white/30 rounded-full flex items-center justify-center text-white shadow-xl"
                  >
                    <Play
                      className="w-5 h-5 md:w-6 md:h-6 ml-1"
                      fill="currentColor"
                    />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          className="mt-16 flex justify-center w-full"
        >
          <Link
            to="/portfolio"
            className="flex items-center justify-center gap-3 px-10 py-5 rounded-full border border-white/10 bg-[#0a0a0a] hover:bg-[#1a1a1a] transition-colors text-white text-xs font-bold tracking-widest uppercase shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
          >
            VIEW MORE <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(20px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80"
            onClick={() => setSelectedVideo(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-7xl aspect-video max-h-[90vh] flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedVideo(null)}
                className="absolute -top-14 right-0 md:-right-14 md:top-0 z-10 w-12 h-12 bg-black/50 hover:bg-[#c19d67] hover:text-black text-white rounded-full flex items-center justify-center transition-all backdrop-blur-xl border border-white/10 hover:border-[#c19d67] shadow-xl group"
              >
                <X
                  size={24}
                  className="group-hover:rotate-90 transition-transform duration-300"
                />
              </button>
              <div className="w-full h-full rounded-2xl overflow-hidden shadow-[0_0_80px_rgba(193,157,103,0.15)] border border-white/10 bg-black/50 relative">
                <div className="absolute inset-0 flex items-center justify-center -z-10">
                  <div className="w-10 h-10 border-4 border-[#c19d67]/30 border-t-[#c19d67] rounded-full animate-spin"></div>
                </div>
                <VideoPlayer url={selectedVideo} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
