import React, { useState, useEffect } from "react";
import {
  auth,
  db,
  collection,
  addDoc,
  getDocs,
  doc,
  setDoc,
  getDoc,
  onSnapshot,
  query,
  deleteDoc,
  updateDoc,
} from "../lib/firebase";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  createUserWithEmailAndPassword,
  updateEmail,
  updatePassword,
} from "firebase/auth";
import {
  Settings,
  FolderKanban,
  MessageSquare,
  UserCircle,
  LogOut,
  LogIn,
  Check,
  X,
  Plus,
  Edit2,
  Trash2,
  Pin,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";

export default function Admin() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Portfolio");

  const [portfolioItems, setPortfolioItems] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("REELS");
  const [newImage, setNewImage] = useState("");
  const [newVideo, setNewVideo] = useState("");
  const [editingPortfolioId, setEditingPortfolioId] = useState<string | null>(
    null,
  );

  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    type: "portfolio" | "message";
  } | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<
    Record<string, boolean>
  >({});

  const [websiteName, setWebsiteName] = useState("VideoAlchemist");
  const [heroTitle, setHeroTitle] = useState(
    'Creative <br/> <span class="text-[#c19d67]">Visuals</span> <br/> for Modern <br/> Brands',
  );
  const [heroSubtitle, setHeroSubtitle] = useState(
    "I transform complex concepts into clean and compelling visuals, which make brands more engaging and credible.",
  );
  const [heroImage, setHeroImage] = useState(
    "https://cdn.discordapp.com/attachments/1478784491274109202/1527687552637603860/Untitled_design_1.png?ex=6a5b9167&is=6a5a3fe7&hm=0e0a8e91ff01d2245bcaa241100f635cdbed1e3bcecd6c30faf31793df1ab936&",
  );
  const [categories, setCategories] = useState<string[]>([
    "REELS",
    "COMMERCIAL",
    "SAAS ANIMATION",
    "MOTION GRAPHICS",
  ]);
  const [newCategoryName, setNewCategoryName] = useState("");

  // About settings
  const [aboutImage, setAboutImage] = useState("");
  const [aboutText, setAboutText] = useState("");
  const [aboutExperience, setAboutExperience] = useState("2+");
  const [aboutProjects, setAboutProjects] = useState("183+");
  const [aboutClients, setAboutClients] = useState("47+");

  // Contact / Social
  const [socialFacebook, setSocialFacebook] = useState("");
  const [socialInstagram, setSocialInstagram] = useState("");
  const [socialLinkedin, setSocialLinkedin] = useState("");
  const [socialWhatsapp, setSocialWhatsapp] = useState("");
  const [contactEmail, setContactEmail] = useState("");

  const [status, setStatus] = useState("");

  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminPassword, setNewAdminPassword] = useState("");
  const [accountStatus, setAccountStatus] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser && currentUser.email) {
        setNewAdminEmail(currentUser.email);
      }
      setLoading(false);
    });
    return () => {
      unsubscribe();
      signOut(auth);
    };
  }, []);

  useEffect(() => {
    if (user) {
      const unsubscribe = onSnapshot(
        doc(db, "settings", "general"),
        (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            if (data.categories) setCategories(data.categories);
            // Only update other settings when on settings tab to avoid overwriting typed fields
            if (activeTab === "Settings") {
              if (data.websiteName) setWebsiteName(data.websiteName);
              if (data.heroTitle) setHeroTitle(data.heroTitle);
              if (data.heroSubtitle) setHeroSubtitle(data.heroSubtitle);
              if (data.heroImage) setHeroImage(data.heroImage);
              if (data.aboutImage) setAboutImage(data.aboutImage);
              if (data.aboutText) setAboutText(data.aboutText);
              if (data.aboutExperience)
                setAboutExperience(data.aboutExperience);
              if (data.aboutProjects) setAboutProjects(data.aboutProjects);
              if (data.aboutClients) setAboutClients(data.aboutClients);
              if (data.socialFacebook) setSocialFacebook(data.socialFacebook);
              if (data.socialInstagram)
                setSocialInstagram(data.socialInstagram);
              if (data.socialLinkedin) setSocialLinkedin(data.socialLinkedin);
              if (data.socialWhatsapp) setSocialWhatsapp(data.socialWhatsapp);
              if (data.contactEmail) setContactEmail(data.contactEmail);
            }
          }
        },
      );
      return () => unsubscribe();
    }
  }, [user, activeTab]);

  const saveSettings = async () => {
    setStatus("Saving...");
    try {
      await setDoc(
        doc(db, "settings", "general"),
        {
          websiteName,
          heroTitle,
          heroSubtitle,
          heroImage,
          categories,
          aboutImage,
          aboutText,
          aboutExperience,
          aboutProjects,
          aboutClients,
          socialFacebook,
          socialInstagram,
          socialLinkedin,
          socialWhatsapp,
          contactEmail,
        },
        { merge: true },
      );
      setStatus("Settings saved!");
      setTimeout(() => setStatus(""), 3000);
    } catch (err: any) {
      alert(err.message);
      setStatus("");
    }
  };

  const addCategory = () => {
    if (
      newCategoryName &&
      !categories.includes(newCategoryName.toUpperCase())
    ) {
      setCategories([...categories, newCategoryName.toUpperCase()]);
      setNewCategoryName("");
    }
  };

  const removeCategory = (cat: string) => {
    setCategories(categories.filter((c) => c !== cat));
  };

  useEffect(() => {
    if (user && activeTab === "Portfolio") {
      const q = query(collection(db, "portfolio"));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const items: any[] = [];
        querySnapshot.forEach((doc) => {
          items.push({ id: doc.id, ...doc.data() });
        });
        setPortfolioItems(items);
      });
      return () => unsubscribe();
    }
  }, [user, activeTab]);

  useEffect(() => {
    if (user && activeTab === "Messages") {
      const q = query(collection(db, "messages"));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const items: any[] = [];
        querySnapshot.forEach((doc) => {
          items.push({ id: doc.id, ...doc.data() });
        });
        items.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        setMessages(items);
      });
      return () => unsubscribe();
    }
  }, [user, activeTab]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      if (
        (err.code === "auth/user-not-found" ||
          err.code === "auth/invalid-credential") &&
        email === "abubokkorbaqi@gmail.com" &&
        password === "123456"
      ) {
        try {
          await createUserWithEmailAndPassword(auth, email, password);
        } catch (createErr: any) {
          setLoginError(createErr.message);
        }
      } else {
        setLoginError(err.message || "Invalid credentials. Please try again.");
      }
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  const handleUpdateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setAccountStatus("Updating...");
    try {
      if (user && newAdminEmail && newAdminEmail !== user.email) {
        await updateEmail(user, newAdminEmail);
      }
      if (user && newAdminPassword) {
        await updatePassword(user, newAdminPassword);
      }
      setAccountStatus("Account updated successfully!");
      setNewAdminPassword("");
      setTimeout(() => setAccountStatus(""), 3000);
    } catch (err: any) {
      setAccountStatus("Error: " + err.message);
    }
  };

  const addPortfolioItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newImage) return alert("Image URL is required");
    try {
      if (editingPortfolioId) {
        await updateDoc(doc(db, "portfolio", editingPortfolioId), {
          title: newTitle || "Untitled",
          category: newCategory,
          image: newImage,
          video: newVideo,
        });
        setEditingPortfolioId(null);
      } else {
        await addDoc(collection(db, "portfolio"), {
          title: newTitle || "Untitled",
          category: newCategory,
          image: newImage,
          video: newVideo,
          order: portfolioItems.length,
          pinned: false,
          createdAt: new Date().toISOString(),
        });
      }
      setNewTitle("");
      setNewImage("");
      setNewVideo("");
    } catch (err: any) {
      alert(err.message);
    }
  };

  const startEditingPortfolio = (item: any) => {
    setEditingPortfolioId(item.id);
    setNewTitle(item.title);
    setNewCategory(item.category);
    setNewImage(item.image);
    setNewVideo(item.video || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleCategoryExpanded = (cat: string) => {
    setExpandedCategories((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

  const deletePortfolioItem = async (id: string) => {
    setDeleteTarget({ id, type: "portfolio" });
  };

  const togglePinned = async (id: string, currentPinned: boolean) => {
    await updateDoc(doc(db, "portfolio", id), {
      pinned: !currentPinned,
    });
  };

  const confirmMessage = async (id: string) => {
    await updateDoc(doc(db, "messages", id), {
      status: "confirmed",
    });
  };

  const deleteMessage = async (id: string) => {
    setDeleteTarget({ id, type: "message" });
  };

  const confirmDeleteAction = async () => {
    if (deleteTarget) {
      if (deleteTarget.type === "portfolio") {
        await deleteDoc(doc(db, "portfolio", deleteTarget.id));
      } else {
        await deleteDoc(doc(db, "messages", deleteTarget.id));
      }
      setDeleteTarget(null);
    }
  };

  const unconfirmedMessagesCount = messages.filter(
    (m) => m.status !== "confirmed",
  ).length;

  if (loading)
    return (
      <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center">
        Loading...
      </div>
    );

  if (!user) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-4 relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#8a2be2]/20 rounded-full blur-[120px] -z-10"></div>
        <form
          onSubmit={handleLogin}
          className="bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10 p-8 rounded-[2rem] w-full max-w-md flex flex-col gap-5 shadow-2xl relative"
        >
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#c19d67]/10 p-4 rounded-full border border-[#c19d67]/30">
            <UserCircle size={32} className="text-[#c19d67]" />
          </div>
          <div className="text-center mt-4 mb-2">
            <h2 className="text-3xl font-bold text-white tracking-tight">
              Welcome Back
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              Sign in to Admin Dashboard
            </p>
          </div>
          {loginError && (
            <div className="bg-red-900/30 text-red-400 p-3 rounded-xl text-sm border border-red-900/50 flex items-center gap-2">
              <X size={16} /> {loginError}
            </div>
          )}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider pl-1">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-[#050505] border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-[#c19d67] focus:ring-1 focus:ring-[#c19d67]/50 transition-all"
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider pl-1">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-[#050505] border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-[#c19d67] focus:ring-1 focus:ring-[#c19d67]/50 transition-all"
              required
            />
          </div>
          <button
            type="submit"
            className="group relative w-full bg-[#c19d67] text-black font-bold py-3.5 rounded-xl mt-4 hover:bg-[#b4905a] transition-all overflow-hidden flex items-center justify-center gap-2"
          >
            <span className="relative z-10 flex items-center gap-2">
              Login <LogIn size={18} />
            </span>
            <div className="absolute inset-0 h-full w-0 bg-white/20 transition-[width] group-hover:w-full z-0"></div>
          </button>
        </form>
      </div>
    );
  }

  const tabIcons: Record<string, React.ReactNode> = {
    Portfolio: <FolderKanban size={18} />,
    Messages: <MessageSquare size={18} />,
    Settings: <Settings size={18} />,
    Account: <UserCircle size={18} />,
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col md:flex-row font-sans">
      <aside className="w-full md:w-72 bg-[#0a0a0a]/80 backdrop-blur-md border-b md:border-b-0 md:border-r border-white/10 p-4 md:p-6 flex flex-col gap-6 sticky top-0 z-50 md:h-screen shadow-2xl">
        <div className="flex items-center gap-3 md:mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            <span className="text-[#c19d67]">{websiteName || "Admin"}</span>{" "}
            Dashboard
          </h2>
        </div>
        <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible no-scrollbar pb-2 md:pb-0">
          {["Portfolio", "Messages", "Settings", "Account"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-shrink-0 whitespace-nowrap text-left py-3 px-4 rounded-xl transition-all duration-300 flex items-center gap-3 relative overflow-hidden group ${
                activeTab === tab
                  ? "bg-gradient-to-r from-[#c19d67]/20 to-transparent text-[#c19d67] border border-[#c19d67]/20 shadow-[0_0_15px_rgba(193,157,103,0.1)]"
                  : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
              }`}
            >
              <div
                className={`transition-transform duration-300 ${activeTab === tab ? "scale-110" : "group-hover:scale-110"}`}
              >
                {tabIcons[tab]}
              </div>
              <span className="font-medium tracking-wide">{tab}</span>
              {tab === "Messages" && unconfirmedMessagesCount > 0 && (
                <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.4)]">
                  {unconfirmedMessagesCount}
                </span>
              )}
              {activeTab === tab && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#c19d67] rounded-r-full shadow-[0_0_10px_rgba(193,157,103,0.8)]"></div>
              )}
            </button>
          ))}
        </div>

        <div className="mt-auto hidden md:block">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-[#1a1a1a] to-[#050505] border border-white/5 mb-4">
            <p className="text-xs text-gray-400 font-medium">Logged in as</p>
            <p className="text-sm text-white font-bold truncate mt-1">
              {user?.email}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full py-3 px-4 text-red-400 hover:text-red-300 hover:bg-red-900/20 transition-all rounded-xl flex items-center justify-center gap-2 font-bold text-sm border border-transparent hover:border-red-900/30"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 p-4 md:p-10 overflow-y-auto relative">
        {/* Subtle background effects for the main content area */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#8a2be2]/5 rounded-full blur-[150px] -z-10 pointer-events-none"></div>
        <div className="flex justify-between items-center mb-8 md:mb-10">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
            {activeTab}
          </h1>
          <button
            onClick={handleLogout}
            className="md:hidden text-red-400 hover:text-white hover:bg-red-500 text-sm font-bold bg-red-900/20 px-4 py-2 rounded-xl border border-red-900/50 transition-colors flex items-center gap-2"
          >
            <LogOut size={16} />{" "}
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "Portfolio" && (
            <motion.div
              key="portfolio"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <div className="flex flex-col gap-8">
                <div className="bg-[#0a0a0a]/80 backdrop-blur-md border border-white/10 p-6 rounded-[2rem] shadow-2xl relative overflow-hidden">
                  <h3 className="text-xl font-bold mb-4">Add New Project</h3>
                  <form
                    onSubmit={addPortfolioItem}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  >
                    <input
                      type="text"
                      placeholder="Title"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="bg-[#050505]/50 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-[#c19d67] focus:ring-1 focus:ring-[#c19d67]/50 transition-all"
                    />
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="bg-[#050505]/50 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-[#c19d67] focus:ring-1 focus:ring-[#c19d67]/50 transition-all"
                    >
                      {categories.map((cat) => (
                        <option key={cat}>{cat}</option>
                      ))}
                    </select>
                    <input
                      type="text"
                      placeholder="Image URL (Thumbnail)"
                      value={newImage}
                      onChange={(e) => setNewImage(e.target.value)}
                      className="bg-[#050505]/50 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-[#c19d67] focus:ring-1 focus:ring-[#c19d67]/50 transition-all"
                    />
                    <input
                      type="text"
                      placeholder="Video URL (Optional)"
                      value={newVideo}
                      onChange={(e) => setNewVideo(e.target.value)}
                      className="bg-[#050505]/50 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-[#c19d67] focus:ring-1 focus:ring-[#c19d67]/50 transition-all"
                    />
                    <div className="md:col-span-2 flex gap-4">
                      <button
                        type="submit"
                        className="bg-gradient-to-r from-[#c19d67] to-[#a88653] text-black font-bold py-3.5 px-6 rounded-xl hover:opacity-90 transition-all flex items-center gap-2"
                      >
                        {editingPortfolioId ? "Update Project" : "Add Project"}
                      </button>
                      {editingPortfolioId && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingPortfolioId(null);
                            setNewTitle("");
                            setNewImage("");
                            setNewVideo("");
                            setNewCategory("REELS");
                          }}
                          className="bg-[#2a2a2a] text-white font-bold py-3.5 px-8 rounded-xl hover:bg-[#3a3a3a] transition-all border border-white/10 shadow-lg"
                        >
                          Cancel Edit
                        </button>
                      )}
                    </div>
                  </form>
                </div>

                <div className="flex flex-col gap-12">
                  {categories.map((cat) => {
                    const catItems = portfolioItems.filter(
                      (item) => item.category === cat,
                    );
                    if (catItems.length === 0) return null;
                    const isExpanded = expandedCategories[cat];
                    const visibleItems = isExpanded
                      ? catItems
                      : catItems.slice(0, 4);
                    return (
                      <div
                        key={cat}
                        className="bg-[#0a0a0a]/40 backdrop-blur-md p-6 md:p-8 rounded-[2rem] border border-white/5 shadow-xl"
                      >
                        <div className="flex justify-between items-center mb-6">
                          <h4 className="text-xl font-bold text-[#c19d67] uppercase tracking-widest">
                            {cat}
                          </h4>
                          {catItems.length > 4 && (
                            <button
                              onClick={() => toggleCategoryExpanded(cat)}
                              className="text-xs font-bold text-gray-400 hover:text-white uppercase tracking-widest bg-gray-800 px-3 py-1.5 rounded-full transition-colors"
                            >
                              {isExpanded
                                ? "View Less"
                                : `View More (${catItems.length - 4})`}
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                          {visibleItems.map((item) => (
                            <div
                              key={item.id}
                              className="bg-[#0a0a0a]/80 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden relative group shadow-xl hover:shadow-2xl hover:border-[#c19d67]/30 transition-all"
                            >
                              <img
                                src={item.image}
                                alt={item.title}
                                className="w-full h-48 object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                              />
                              <div className="p-4">
                                <div className="text-[10px] text-[#c19d67] font-bold tracking-widest uppercase mb-1">
                                  {item.category}
                                </div>
                                <div className="font-bold mb-2 truncate">
                                  {item.title}
                                </div>
                                {item.video && (
                                  <div className="text-xs text-gray-400 truncate mb-4">
                                    Has Video
                                  </div>
                                )}
                                <div className="flex gap-2 mb-2">
                                  <button
                                    onClick={() =>
                                      togglePinned(item.id, item.pinned)
                                    }
                                    className={`flex-1 text-center py-2.5 rounded-xl transition-all text-xs font-bold ${item.pinned ? "bg-gradient-to-r from-[#c19d67] to-[#a88653] text-black shadow-lg" : "bg-[#1a1a1a] text-white hover:bg-[#2a2a2a] border border-white/5"}`}
                                  >
                                    {item.pinned ? "Pinned" : "Pin to Home"}
                                  </button>
                                </div>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => startEditingPortfolio(item)}
                                    className="flex-1 text-center py-2.5 bg-blue-900/20 text-blue-400 hover:bg-blue-900/40 rounded-xl transition-all text-xs font-bold border border-blue-900/30 hover:border-blue-900/50"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => deletePortfolioItem(item.id)}
                                    className="flex-1 text-center py-2.5 bg-red-900/20 text-red-400 hover:bg-red-900/40 rounded-xl transition-all text-xs font-bold border border-red-900/30 hover:border-red-900/50"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "Messages" && (
            <motion.div
              key="messages"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {messages.length === 0 ? (
                  <div className="text-gray-400 col-span-full">
                    No messages yet.
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`bg-[#0a0a0a]/80 backdrop-blur-md border ${msg.status === "confirmed" ? "border-green-500/30" : "border-[#c19d67]/50"} p-6 rounded-2xl shadow-xl flex flex-col gap-3 relative transition-colors`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="text-xs text-[#c19d67] font-bold tracking-widest uppercase">
                          {msg.ventureNature}
                        </div>
                        {msg.status === "confirmed" ? (
                          <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full font-bold">
                            Confirmed
                          </span>
                        ) : (
                          <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full font-bold animate-pulse">
                            New
                          </span>
                        )}
                      </div>

                      <div className="font-bold text-2xl mt-2">{msg.name}</div>

                      <div className="flex flex-col gap-1 text-sm text-gray-400 mt-2">
                        <a
                          href={`mailto:${msg.email}`}
                          className="hover:text-[#c19d67] flex items-center gap-2"
                        >
                          <span className="w-16">Email:</span>{" "}
                          <span className="text-white">{msg.email}</span>
                        </a>
                        {msg.whatsapp && (
                          <a
                            href={`https://wa.me/${msg.whatsapp.replace(/[^0-9]/g, "")}`}
                            target="_blank"
                            rel="noreferrer"
                            className="hover:text-[#c19d67] flex items-center gap-2"
                          >
                            <span className="w-16">WhatsApp:</span>{" "}
                            <span className="text-white">{msg.whatsapp}</span>
                          </a>
                        )}
                      </div>

                      <div className="mt-4 text-gray-300 bg-[#050505] p-4 rounded-xl border border-white/5 text-sm leading-relaxed">
                        {msg.creativeIntent}
                      </div>

                      <div className="text-xs text-gray-500 mt-auto pt-4">
                        {new Date(msg.createdAt).toLocaleString()}
                      </div>

                      <div className="flex gap-2 mt-4 pt-4 border-t border-white/10">
                        {msg.status !== "confirmed" && (
                          <button
                            onClick={() => confirmMessage(msg.id)}
                            className="flex-1 bg-gradient-to-r from-[#c19d67] to-[#a88653] text-black font-bold py-2.5 rounded-xl hover:opacity-90 transition-all text-sm shadow-md"
                          >
                            Confirm
                          </button>
                        )}
                        <button
                          onClick={() => deleteMessage(msg.id)}
                          className="flex-1 bg-red-900/20 hover:bg-red-900/40 text-red-400 font-bold py-2.5 rounded-xl transition-all text-sm border border-red-900/30 hover:border-red-900/50"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}

          {activeTab === "Settings" && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <div className="flex flex-col gap-8">
                <div className="bg-[#0a0a0a]/80 backdrop-blur-md border border-white/10 p-6 rounded-[2rem] shadow-2xl flex flex-col gap-6 relative overflow-hidden">
                  <h3 className="text-xl font-bold mb-2 border-b border-white/10 pb-2">
                    General Settings
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                    <input
                      type="text"
                      placeholder="Website Name (e.g. VideoAlchemist)"
                      value={websiteName}
                      onChange={(e) => setWebsiteName(e.target.value)}
                      className="bg-[#050505]/50 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-[#c19d67] focus:ring-1 focus:ring-[#c19d67]/50 transition-all"
                    />
                  </div>

                  <h3 className="text-xl font-bold mb-2 mt-4 border-b border-white/10 pb-2">
                    Hero Section Settings
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                    <input
                      type="text"
                      placeholder="Hero Title (e.g. VISUAL ALCHEMIST)"
                      value={heroTitle}
                      onChange={(e) => setHeroTitle(e.target.value)}
                      className="bg-[#050505]/50 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-[#c19d67] focus:ring-1 focus:ring-[#c19d67]/50 transition-all"
                    />
                    <input
                      type="text"
                      placeholder="Hero Subtitle"
                      value={heroSubtitle}
                      onChange={(e) => setHeroSubtitle(e.target.value)}
                      className="bg-[#050505]/50 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-[#c19d67] focus:ring-1 focus:ring-[#c19d67]/50 transition-all"
                    />
                    <input
                      type="text"
                      placeholder="Hero Image URL"
                      value={heroImage}
                      onChange={(e) => setHeroImage(e.target.value)}
                      className="bg-[#050505]/50 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-[#c19d67] focus:ring-1 focus:ring-[#c19d67]/50 transition-all"
                    />
                  </div>

                  <h3 className="text-xl font-bold mb-2 mt-4 border-b border-white/10 pb-2">
                    About Section Settings
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="About Image URL"
                      value={aboutImage}
                      onChange={(e) => setAboutImage(e.target.value)}
                      className="bg-[#050505]/50 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-[#c19d67] focus:ring-1 focus:ring-[#c19d67]/50 transition-all"
                    />
                    <input
                      type="text"
                      placeholder="Years of Experience (e.g. 2+)"
                      value={aboutExperience}
                      onChange={(e) => setAboutExperience(e.target.value)}
                      className="bg-[#050505]/50 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-[#c19d67] focus:ring-1 focus:ring-[#c19d67]/50 transition-all"
                    />
                    <input
                      type="text"
                      placeholder="Projects Done (e.g. 183+)"
                      value={aboutProjects}
                      onChange={(e) => setAboutProjects(e.target.value)}
                      className="bg-[#050505]/50 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-[#c19d67] focus:ring-1 focus:ring-[#c19d67]/50 transition-all"
                    />
                    <input
                      type="text"
                      placeholder="Happy Clients (e.g. 47+)"
                      value={aboutClients}
                      onChange={(e) => setAboutClients(e.target.value)}
                      className="bg-[#050505]/50 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-[#c19d67] focus:ring-1 focus:ring-[#c19d67]/50 transition-all"
                    />
                    <textarea
                      placeholder="Experience Narrative Text"
                      value={aboutText}
                      onChange={(e) => setAboutText(e.target.value)}
                      className="bg-[#050505]/50 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-[#c19d67] focus:ring-1 focus:ring-[#c19d67]/50 transition-all md:col-span-2"
                      rows={3}
                    />
                  </div>

                  <h3 className="text-xl font-bold mb-2 mt-4 border-b border-white/10 pb-2">
                    Contact & Social Links
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Email Address"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="bg-[#050505]/50 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-[#c19d67] focus:ring-1 focus:ring-[#c19d67]/50 transition-all"
                    />
                    <input
                      type="text"
                      placeholder="WhatsApp Number / Link"
                      value={socialWhatsapp}
                      onChange={(e) => setSocialWhatsapp(e.target.value)}
                      className="bg-[#050505]/50 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-[#c19d67] focus:ring-1 focus:ring-[#c19d67]/50 transition-all"
                    />
                    <input
                      type="text"
                      placeholder="Facebook Link"
                      value={socialFacebook}
                      onChange={(e) => setSocialFacebook(e.target.value)}
                      className="bg-[#050505]/50 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-[#c19d67] focus:ring-1 focus:ring-[#c19d67]/50 transition-all"
                    />
                    <input
                      type="text"
                      placeholder="Instagram Link"
                      value={socialInstagram}
                      onChange={(e) => setSocialInstagram(e.target.value)}
                      className="bg-[#050505]/50 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-[#c19d67] focus:ring-1 focus:ring-[#c19d67]/50 transition-all"
                    />
                    <input
                      type="text"
                      placeholder="LinkedIn Link"
                      value={socialLinkedin}
                      onChange={(e) => setSocialLinkedin(e.target.value)}
                      className="bg-[#050505]/50 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-[#c19d67] focus:ring-1 focus:ring-[#c19d67]/50 transition-all"
                    />
                  </div>

                  <h3 className="text-xl font-bold mb-2 mt-4 border-b border-white/10 pb-2">
                    Portfolio Categories
                  </h3>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="New Category Name"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      className="bg-[#050505] border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none"
                    />
                    <button
                      onClick={addCategory}
                      className="bg-[#2a2a2a] text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-[#3a3a3a] transition-all border border-white/10 shadow-md"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex gap-2 flex-wrap mt-2">
                    {categories.map((cat) => (
                      <span
                        key={cat}
                        className="bg-gray-800 px-3 py-1 rounded-full text-xs flex items-center gap-2"
                      >
                        {cat}{" "}
                        <button
                          onClick={() => removeCategory(cat)}
                          className="text-red-400 hover:text-red-300"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>

                  <div className="mt-6 border-t border-white/10 pt-4">
                    <button
                      onClick={saveSettings}
                      className="bg-gradient-to-r from-[#c19d67] to-[#a88653] text-black font-bold py-3.5 px-8 rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2 w-full md:w-auto shadow-lg"
                    >
                      Save All Settings
                    </button>
                    {status && (
                      <div className="text-green-400 mt-2">{status}</div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          {activeTab === "Account" && (
            <motion.div
              key="account"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <div className="flex flex-col gap-8">
                <div className="bg-[#0a0a0a]/80 backdrop-blur-md border border-white/10 p-6 rounded-[2rem] shadow-2xl flex flex-col gap-6 relative overflow-hidden">
                  <h3 className="text-xl font-bold mb-2 border-b border-white/10 pb-2">
                    Admin Account Settings
                  </h3>
                  {accountStatus && (
                    <div
                      className={`p-3 rounded-lg text-sm border ${accountStatus.includes("Error") ? "bg-red-900/30 text-red-400 border-red-900/50" : "bg-green-900/30 text-green-400 border-green-900/50"}`}
                    >
                      {accountStatus}
                    </div>
                  )}
                  <form
                    onSubmit={handleUpdateAccount}
                    className="grid grid-cols-1 gap-4"
                  >
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        Update Email
                      </label>
                      <input
                        type="email"
                        placeholder="New Admin Email"
                        value={newAdminEmail}
                        onChange={(e) => setNewAdminEmail(e.target.value)}
                        className="w-full bg-[#050505]/50 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-[#c19d67] focus:ring-1 focus:ring-[#c19d67]/50 transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        Update Password (leave blank to keep current)
                      </label>
                      <input
                        type="password"
                        placeholder="New Password"
                        value={newAdminPassword}
                        onChange={(e) => setNewAdminPassword(e.target.value)}
                        className="w-full bg-[#050505]/50 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-[#c19d67] focus:ring-1 focus:ring-[#c19d67]/50 transition-all"
                      />
                    </div>
                    <button
                      type="submit"
                      className="bg-gradient-to-r from-[#c19d67] to-[#a88653] text-black font-bold py-3.5 px-8 rounded-xl hover:opacity-90 transition-all mt-2 w-max shadow-lg flex items-center gap-2"
                    >
                      Update Account
                    </button>
                  </form>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {deleteTarget && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0a0a0a]/90 backdrop-blur-xl border border-[#c19d67]/50 p-8 rounded-[2rem] max-w-sm w-full text-center shadow-[0_0_50px_rgba(193,157,103,0.15)]">
            <h3 className="text-xl font-bold mb-4">Are you sure?</h3>
            <p className="text-gray-400 mb-8">
              Do you really want to delete this{" "}
              {deleteTarget.type === "portfolio" ? "project" : "message"}? This
              action cannot be undone.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-6 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 font-bold transition-colors w-1/2"
              >
                No
              </button>
              <button
                onClick={confirmDeleteAction}
                className="px-6 py-2 rounded-lg bg-red-900/50 hover:bg-red-900 text-red-400 hover:text-red-300 font-bold transition-colors w-1/2"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
