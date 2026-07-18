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

export default function Admin() {
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
    return () => unsubscribe();
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
      <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-4">
        <form
          onSubmit={handleLogin}
          className="bg-[#0a0a0a] border border-white/10 p-8 rounded-2xl w-full max-w-md flex flex-col gap-4 shadow-xl"
        >
          <h2 className="text-2xl font-bold mb-4 text-[#c19d67]">
            Admin Login
          </h2>
          {loginError && (
            <div className="bg-red-900/30 text-red-400 p-3 rounded-lg text-sm border border-red-900/50">
              {loginError}
            </div>
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#c19d67]"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#c19d67]"
            required
          />
          <button
            type="submit"
            className="bg-[#c19d67] text-black font-bold py-3 rounded-xl mt-4 hover:bg-[#b4905a] transition-colors"
          >
            Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white flex">
      <aside className="w-64 bg-[#0a0a0a] border-r border-white/10 p-6 flex flex-col gap-4 hidden md:flex">
        <h2 className="text-xl font-bold text-[#c19d67] mb-8">Admin Panel</h2>
        {["Portfolio", "Messages", "Settings", "Account"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`text-left py-2 px-4 rounded-lg transition-colors flex items-center justify-between ${activeTab === tab ? "bg-[#c19d67]/20 text-[#c19d67]" : "text-gray-300 hover:text-white"}`}
          >
            {tab}
            {tab === "Messages" && unconfirmedMessagesCount > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {unconfirmedMessagesCount}
              </span>
            )}
          </button>
        ))}

        <div className="mt-auto">
          <button
            onClick={handleLogout}
            className="w-full text-left py-2 px-4 text-red-400 hover:text-red-300 transition-colors"
          >
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-8">{activeTab}</h1>

        {activeTab === "Portfolio" && (
          <div className="flex flex-col gap-8">
            <div className="bg-[#0a0a0a] border border-white/10 p-6 rounded-2xl shadow-xl">
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
                  className="bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#c19d67]"
                />
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#c19d67]"
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
                  className="bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#c19d67]"
                />
                <input
                  type="text"
                  placeholder="Video URL (Optional)"
                  value={newVideo}
                  onChange={(e) => setNewVideo(e.target.value)}
                  className="bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#c19d67]"
                />
                <div className="md:col-span-2 flex gap-4">
                  <button
                    type="submit"
                    className="bg-[#c19d67] text-black font-bold py-3 px-6 rounded-xl hover:bg-[#b4905a] transition-colors"
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
                      className="bg-gray-800 text-white font-bold py-3 px-6 rounded-xl hover:bg-gray-700 transition-colors"
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
                    className="bg-[#0a0a0a]/50 p-6 rounded-2xl border border-white/5"
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
                          className="bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden relative group"
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
                                className={`flex-1 text-center py-2 rounded-lg transition-colors text-xs ${item.pinned ? "bg-[#c19d67] text-black font-bold hover:bg-[#b4905a]" : "bg-gray-800 text-white hover:bg-gray-700"}`}
                              >
                                {item.pinned ? "Pinned" : "Pin to Home"}
                              </button>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => startEditingPortfolio(item)}
                                className="flex-1 text-center py-2 bg-blue-900/30 text-blue-400 hover:bg-blue-900/50 rounded-lg transition-colors text-xs"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => deletePortfolioItem(item.id)}
                                className="flex-1 text-center py-2 bg-red-900/30 text-red-400 hover:bg-red-900/50 rounded-lg transition-colors text-xs"
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
        )}

        {activeTab === "Messages" && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {messages.length === 0 ? (
              <div className="text-gray-400 col-span-full">
                No messages yet.
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`bg-[#0a0a0a] border ${msg.status === "confirmed" ? "border-green-500/30" : "border-[#c19d67]/50"} p-6 rounded-2xl shadow-xl flex flex-col gap-3 relative transition-colors`}
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
                        className="flex-1 bg-[#c19d67] hover:bg-[#b4905a] text-black font-bold py-2 rounded-lg transition-colors text-sm"
                      >
                        Confirm
                      </button>
                    )}
                    <button
                      onClick={() => deleteMessage(msg.id)}
                      className="flex-1 bg-red-900/30 hover:bg-red-900/50 text-red-400 font-bold py-2 rounded-lg transition-colors text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "Settings" && (
          <div className="flex flex-col gap-8">
            <div className="bg-[#0a0a0a] border border-white/10 p-6 rounded-2xl shadow-xl flex flex-col gap-4">
              <h3 className="text-xl font-bold mb-2 border-b border-white/10 pb-2">
                General Settings
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <input
                  type="text"
                  placeholder="Website Name (e.g. VideoAlchemist)"
                  value={websiteName}
                  onChange={(e) => setWebsiteName(e.target.value)}
                  className="bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#c19d67]"
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
                  className="bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#c19d67]"
                />
                <input
                  type="text"
                  placeholder="Hero Subtitle"
                  value={heroSubtitle}
                  onChange={(e) => setHeroSubtitle(e.target.value)}
                  className="bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#c19d67]"
                />
                <input
                  type="text"
                  placeholder="Hero Image URL"
                  value={heroImage}
                  onChange={(e) => setHeroImage(e.target.value)}
                  className="bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#c19d67]"
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
                  className="bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Years of Experience (e.g. 2+)"
                  value={aboutExperience}
                  onChange={(e) => setAboutExperience(e.target.value)}
                  className="bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Projects Done (e.g. 183+)"
                  value={aboutProjects}
                  onChange={(e) => setAboutProjects(e.target.value)}
                  className="bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Happy Clients (e.g. 47+)"
                  value={aboutClients}
                  onChange={(e) => setAboutClients(e.target.value)}
                  className="bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
                />
                <textarea
                  placeholder="Experience Narrative Text"
                  value={aboutText}
                  onChange={(e) => setAboutText(e.target.value)}
                  className="bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none md:col-span-2"
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
                  className="bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="WhatsApp Number / Link"
                  value={socialWhatsapp}
                  onChange={(e) => setSocialWhatsapp(e.target.value)}
                  className="bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Facebook Link"
                  value={socialFacebook}
                  onChange={(e) => setSocialFacebook(e.target.value)}
                  className="bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Instagram Link"
                  value={socialInstagram}
                  onChange={(e) => setSocialInstagram(e.target.value)}
                  className="bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="LinkedIn Link"
                  value={socialLinkedin}
                  onChange={(e) => setSocialLinkedin(e.target.value)}
                  className="bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
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
                  className="bg-gray-800 text-white px-4 py-2 rounded-xl text-sm hover:bg-gray-700"
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
                  className="bg-[#c19d67] text-black font-bold py-3 px-6 rounded-xl hover:bg-[#b4905a] transition-colors w-full md:w-auto"
                >
                  Save All Settings
                </button>
                {status && <div className="text-green-400 mt-2">{status}</div>}
              </div>
            </div>
          </div>
        )}
        {activeTab === "Account" && (
          <div className="flex flex-col gap-8">
            <div className="bg-[#0a0a0a] border border-white/10 p-6 rounded-2xl shadow-xl flex flex-col gap-4">
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
                    className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#c19d67]"
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
                    className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#c19d67]"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-[#c19d67] hover:bg-[#a88653] text-black font-bold py-3 rounded-xl transition-colors mt-2 w-max px-8"
                >
                  Update Account
                </button>
              </form>
            </div>
          </div>
        )}
      </main>

      {deleteTarget && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0a0a0a] border border-[#c19d67] p-8 rounded-2xl max-w-sm w-full text-center shadow-2xl">
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
