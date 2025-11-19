// src/components/Navbar.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import logo from "../assets/logo.png";

const sectionLinks = [
    { label: "Home", path: "/" },
    { label: "How it Works", id: "how-it-works" },
    { label: "Features", id: "features" },
     { label: "Insight", id: "insight-section" },
    { label: "Get Started", id: "cta" },
];

const pageLinks = [
    
    { label: "About", path: "/about-us" },
    { label: "Contact", path: "/contact-us" },
];

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState("hero");

    const isHome = location.pathname === "/";
    const navItems = isHome ? [...sectionLinks, ...pageLinks] : pageLinks;

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 30);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            const yOffset = -90;
            const top = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top, behavior: "smooth" });
        }
    };

    useEffect(() => {
        if (isHome && location.state?.scrollTo) {
            const target = location.state.scrollTo;
            setTimeout(() => scrollToSection(target), 200);
            navigate(location.pathname, { replace: true });
        }
    }, [isHome, location, navigate]);

    useEffect(() => {
        if (!isHome) return;
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
                    }
                });
            },
            {
                threshold: 0.35,
                rootMargin: "-20% 0px -40% 0px",
            }
        );

        sectionLinks.forEach(({ id }) => {
            const element = document.getElementById(id);
            if (element) observer.observe(element);
        });

        return () => observer.disconnect();
    }, [isHome]);

    const handleNavClick = (item) => {
        setIsOpen(false);
        if (item.id) {
            if (!isHome) {
                navigate("/", { state: { scrollTo: item.id } });
            } else {
                scrollToSection(item.id);
            }
            return;
        }
        if (item.path) navigate(item.path);
    };

    return (
        <motion.nav
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="fixed top-0 left-0 w-full z-50 pointer-events-none"
        >
            <div className="px-4 sm:px-6 lg:px-10">
                <motion.div
                    layout
                    className={`mx-auto flex items-center justify-between gap-4 md:gap-8 pointer-events-auto border backdrop-blur bg-white transition-all duration-500 ${isScrolled
                            ? "max-w-5xl mt-3 rounded-full border-black/5 shadow-lg"
                            : "max-w-7xl mt-6 rounded-[32px] border-black/5 shadow-[0_25px_60px_rgba(0,0,0,0.08)]"
                        }`}
                >
                    <div className="flex items-center gap-4 px-4 py-3">
                        <motion.button
                            className="flex items-center gap-3 focus:outline-none"
                            whileHover={{ scale: 1.05 }}
                            onClick={() => handleNavClick({ id: "hero" })}
                        >
                            <motion.img
                                src={logo}
                                alt="CodeGuard logo"
                                className="w-10 h-10 drop-shadow-lg"
                                whileHover={{ rotate: 8 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            />
                            <motion.span
                                className="text-xl font-black bg-gradient-to-r from-indigo-600 via-pink-500 to-purple-600 bg-clip-text text-transparent"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                CodeGuard
                            </motion.span>
                        </motion.button>
                    </div>

                    <div className="hidden md:flex items-center gap-5">
                        {navItems.map((item) => {
                            const isSection = Boolean(item.id);
                            const isActive = isSection
                                ? activeSection === item.id
                                : location.pathname === item.path;
                            return (
                                <button
                                    key={item.label}
                                    onClick={() => handleNavClick(item)}
                                    className={`relative text-sm font-semibold transition-all duration-300 ${isActive ? "text-black" : "text-gray-500 hover:text-black"
                                        }`}
                                >
                                    {item.label}
                                    <span
                                        className={`absolute left-0 -bottom-1 h-[2px] rounded-full transition-all duration-300 ${isActive ? "w-full bg-black" : "w-0 bg-black/50"
                                            }`}
                                    />
                                </button>
                            );
                        })}
                    </div>

                    <div className="hidden md:flex items-center gap-3 pr-4">
                        <Button
                            size="lg"
                            className="rounded-full bg-black text-white shadow-lg hover:shadow-xl transition"
                            onClick={() => {
                                setIsOpen(false);
                                navigate("/auth/login");
                            }}
                        >
                            Login
                        </Button>
                    </div>

                    <div className="md:hidden flex items-center pr-4">
                        <motion.button
                            onClick={() => setIsOpen((prev) => !prev)}
                            className="p-2 rounded-full border border-black/10 text-gray-900"
                            whileTap={{ scale: 0.9 }}
                            aria-label="Toggle navigation menu"
                        >
                            {isOpen ? (
                                <motion.svg
                                    className="w-6 h-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                    initial={{ rotate: 0 }}
                                    animate={{ rotate: 180 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </motion.svg>
                            ) : (
                                <motion.svg
                                    className="w-6 h-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                </motion.svg>
                            )}
                        </motion.button>
                    </div>
                </motion.div>
            </div>

            <motion.div
                initial={false}
                animate={isOpen ? { opacity: 1, height: "auto" } : { opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="md:hidden px-4"
            >
                {isOpen && (
                    <div className="mt-4 rounded-3xl border border-black/5 bg-white shadow-lg p-6 flex flex-col gap-4 pointer-events-auto">
                        {navItems.map((item) => {
                            const isSection = Boolean(item.id);
                            const isActive = isSection
                                ? activeSection === item.id
                                : location.pathname === item.path;
                            return (
                                <button
                                    key={item.label}
                                    onClick={() => handleNavClick(item)}
                                    className={`text-base font-semibold transition-all text-left ${isActive ? "text-black" : "text-gray-600"
                                        }`}
                                >
                                    {item.label}
                                </button>
                            );
                        })}

                        <Button
                            size="lg"
                            className="mt-2 rounded-2xl bg-black text-white shadow-lg"
                            onClick={() => {
                                setIsOpen(false);
                                navigate("/auth/login");
                            }}
                        >
                            Login
                        </Button>
                    </div>
                )}
            </motion.div>
        </motion.nav>
    );
};

export default Navbar;

