/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import PortfolioPage from "./pages/PortfolioPage";
import { db, doc, onSnapshot } from "./lib/firebase";

const pageTransition = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.4, ease: "linear" as any },
};

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function AnimatedRoutes() {
  const location = useLocation();
  const isPublic =
    location.pathname === "/" || location.pathname === "/portfolio";

  return (
    <div
      className={
        isPublic
          ? "min-h-screen bg-[#020202] font-sans text-white relative overflow-hidden"
          : "min-h-screen bg-[#050505] font-sans"
      }
    >
      {isPublic && (
        <>
          <div className="pointer-events-none fixed inset-0 z-50 opacity-[0.03] mix-blend-screen bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
          <div className="pointer-events-none fixed inset-0 z-0">
            <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-purple-900/40 rounded-full blur-[100px] mix-blend-screen opacity-20" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-pink-900/30 rounded-full blur-[100px] mix-blend-screen opacity-15" />
          </div>
        </>
      )}

      <div
        className={isPublic ? "relative z-10 flex flex-col min-h-screen" : ""}
      >
        {isPublic && <Navbar />}
        <div className="flex-grow">
          <AnimatePresence mode="wait">
            {/* @ts-ignore */}
            <Routes location={location} key={location.pathname}>
              <Route
                path="/"
                element={
                  <motion.div {...pageTransition} className="w-full h-full">
                    <Home />
                  </motion.div>
                }
              />
              <Route
                path="/adminhub"
                element={
                  <motion.div {...pageTransition} className="w-full h-full">
                    <Admin />
                  </motion.div>
                }
              />
              <Route
                path="/portfolio"
                element={
                  <motion.div {...pageTransition} className="w-full h-full">
                    <PortfolioPage />
                  </motion.div>
                }
              />
            </Routes>
          </AnimatePresence>
        </div>
        {isPublic && <Footer />}
      </div>
    </div>
  );
}

export default function App() {
  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "settings", "general"), (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        if (data.websiteName) {
          document.title = data.websiteName + " - Portfolio";
        }
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <AnimatedRoutes />
    </Router>
  );
}
