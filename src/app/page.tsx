"use client";

import { useEffect } from "react";
import { LanguageProvider } from "@/context/LanguageContext";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { WhatIsIt } from "@/components/WhatIsIt";
import { Hardware } from "@/components/Hardware";
import { HowItWorks } from "@/components/HowItWorks";
import { LiveDemo } from "@/components/LiveDemo";
import { AboutBuilder } from "@/components/AboutBuilder";
import { Footer } from "@/components/Footer";

function ScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -50px 0px" }
    );

    const run = () => {
      document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    };

    run();
    // Re-run after a tick in case components mounted after effect
    const t = setTimeout(run, 100);
    return () => { observer.disconnect(); clearTimeout(t); };
  }, []);

  return null;
}

export default function Page() {
  return (
    <LanguageProvider>
      <ScrollReveal />
      <Navbar />
      <main>
        <Hero />
        <WhatIsIt />
        <Hardware />
        <HowItWorks />
        <LiveDemo />
        <AboutBuilder />
        <Footer />
      </main>
    </LanguageProvider>
  );
}
