"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

const transitionMs = 850;

const sections = [
  { id: "intro", label: "01", nav: "Intro" },
  { id: "story", label: "02", nav: "Story" },
  { id: "work", label: "03", nav: "Work" },
  { id: "system", label: "04", nav: "System" },
  { id: "contact", label: "05", nav: "Contact" },
];

const metrics = [
  { value: "05", label: "Curated sections" },
  { value: "12", label: "Reusable blocks" },
  { value: "98", label: "Launch score" },
];

const storyCards = [
  {
    title: "Editorial rhythm",
    copy: "Large type, measured contrast, and calm whitespace give the page a premium magazine feel.",
  },
  {
    title: "Visual proof",
    copy: "Project moments carry the narrative, so the template feels like a real brand before customization.",
  },
  {
    title: "Focused motion",
    copy: "Each chapter fills the viewport and gives the visitor one sharp idea at a time.",
  },
];

const projects = [
  {
    name: "Arden Haus",
    type: "Interior identity",
    year: "2026",
    color: "from-[#f3eee6] via-[#d87a5c] to-[#14362f]",
  },
  {
    name: "Morrow Lab",
    type: "Product launch",
    year: "2026",
    color: "from-[#11201d] via-[#56a58f] to-[#f1c9a6]",
  },
  {
    name: "Northline",
    type: "Studio portfolio",
    year: "2025",
    color: "from-[#f4eadf] via-[#69c5cf] to-[#161719]",
  },
];

const systemBlocks = [
  "Hero variants",
  "Project cards",
  "Sticky navigation",
  "Color tokens",
];

const panelBaseClass =
  "scrollfolio-panel px-5 pt-24 pb-6 sm:px-8 sm:pt-28 sm:pb-10 lg:px-14";

function clampIndex(index: number) {
  return Math.min(Math.max(index, 0), sections.length - 1);
}

export function ScrollfolioExperience() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);
  const lastNavigationRef = useRef(0);
  const touchStartYRef = useRef<number | null>(null);

  const activeSection = sections[activeIndex];

  const navigateTo = useCallback(
    (targetIndex: number, shouldThrottle = false) => {
      const now = Date.now();

      if (shouldThrottle && now - lastNavigationRef.current < transitionMs) {
        return;
      }

      const nextIndex = clampIndex(targetIndex);

      if (nextIndex === activeIndexRef.current) {
        return;
      }

      lastNavigationRef.current = now;
      activeIndexRef.current = nextIndex;
      setActiveIndex(nextIndex);

      const nextHash = `#${sections[nextIndex].id}`;

      if (window.location.hash !== nextHash) {
        window.history.replaceState(null, "", nextHash);
      }
    },
    [],
  );

  useEffect(() => {
    const syncFromHash = () => {
      const hash = window.location.hash.replace("#", "");
      const hashIndex = sections.findIndex((section) => section.id === hash);

      if (hashIndex >= 0) {
        activeIndexRef.current = hashIndex;
        setActiveIndex(hashIndex);
        window.scrollTo(0, 0);
      }
    };

    syncFromHash();

    window.addEventListener("hashchange", syncFromHash);

    return () => window.removeEventListener("hashchange", syncFromHash);
  }, []);

  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();

      if (Math.abs(event.deltaY) < 24) {
        return;
      }

      navigateTo(activeIndexRef.current + Math.sign(event.deltaY), true);
    };

    const handleTouchStart = (event: TouchEvent) => {
      touchStartYRef.current = event.touches[0]?.clientY ?? null;
    };

    const handleTouchEnd = (event: TouchEvent) => {
      const startY = touchStartYRef.current;
      const endY = event.changedTouches[0]?.clientY;

      touchStartYRef.current = null;

      if (startY === null || endY === undefined) {
        return;
      }

      const distance = startY - endY;

      if (Math.abs(distance) < 48) {
        return;
      }

      navigateTo(activeIndexRef.current + Math.sign(distance), true);
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [navigateTo]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === "ArrowDown" ||
        event.key === "PageDown" ||
        event.key === " "
      ) {
        event.preventDefault();
        navigateTo(activeIndexRef.current + 1, true);
      }

      if (event.key === "ArrowUp" || event.key === "PageUp") {
        event.preventDefault();
        navigateTo(activeIndexRef.current - 1, true);
      }

      if (event.key === "Home") {
        event.preventDefault();
        navigateTo(0);
      }

      if (event.key === "End") {
        event.preventDefault();
        navigateTo(sections.length - 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigateTo]);

  return (
    <div className="relative h-svh overflow-hidden bg-[#0f1115] text-[#f7f1e8]">
      <header className="fixed inset-x-0 top-0 z-40 border-white/10 border-b bg-[#0f1115]/82 backdrop-blur-xl">
        <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-14">
          <Image src="/brand/logotipo.svg" alt="Logo" width={151} height={32} priority />

          <nav
            className="hidden items-center gap-1 md:flex"
            aria-label="Primary"
          >
            {sections.map((section, index) => (
              <button
                aria-current={activeIndex === index ? "page" : undefined}
                className={`rounded-[6px] px-3 py-2 text-sm transition-colors ${
                  activeIndex === index
                    ? "bg-[#f7f1e8] text-[#0f1115]"
                    : "text-[#f7f1e8]/68 hover:bg-white/8 hover:text-[#f7f1e8]"
                }`}
                key={section.id}
                onClick={() => navigateTo(index)}
                type="button"
              >
                {section.nav}
              </button>
            ))}
          </nav>

          <button
            className="rounded-[6px] border border-[#e36f50]/60 px-4 py-2 text-sm text-[#f7f1e8] transition-colors hover:bg-[#e36f50] hover:text-[#111111]"
            onClick={() => navigateTo(sections.length - 1)}
            type="button"
          >
            Start
          </button>
        </div>
        <div
          className="h-px origin-left bg-[#e36f50] transition-transform duration-[850ms] ease-[cubic-bezier(0.76,0,0.24,1)]"
          style={{
            transform: `scaleX(${(activeIndex + 1) / sections.length})`,
          }}
        />
      </header>

      <aside
        className="-translate-y-1/2 fixed top-1/2 right-6 z-30 hidden flex-col gap-3 lg:flex"
        aria-label="Section progress"
      >
        {sections.map((section, index) => (
          <button
            aria-current={activeIndex === index ? "step" : undefined}
            aria-label={`Go to ${section.nav}`}
            className={`group flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
              activeIndex === index ? "bg-[#f7f1e8]/12" : "hover:bg-[#f7f1e8]/8"
            }`}
            key={section.id}
            onClick={() => navigateTo(index)}
            type="button"
          >
            <span
              className={`block h-2.5 w-2.5 rounded-full transition-all ${
                activeIndex === index
                  ? "scale-125 bg-[#e36f50]"
                  : "bg-[#f7f1e8]/36 group-hover:bg-[#f7f1e8]"
              }`}
            />
            <span className="sr-only">{section.label}</span>
          </button>
        ))}
      </aside>

      <main
        aria-label="Scrollfolio sections"
        aria-roledescription="vertical carousel"
        className="relative h-svh overflow-hidden"
      >
        <section
          aria-hidden={activeSection.id !== "intro"}
          className={`${panelBaseClass} items-center bg-[#0f1115]`}
          id="panel-intro"
          style={{
            transform: `translate3d(0, ${(0 - activeIndex) * 100}%, 0)`,
            zIndex: sections.length - Math.abs(0 - activeIndex),
          }}
        >
          <div className="mx-auto grid w-full max-w-7xl items-center gap-7 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
            <div className="max-w-3xl">
              <p className="mb-4 text-sm font-medium text-[#69c5cf] sm:mb-5">
                Scrollfolio template
              </p>
              <h2 className="text-4xl font-semibold leading-[0.98] text-[#f7f1e8] sm:text-6xl sm:leading-[0.95] lg:text-7xl">
                A portfolio that moves like a product launch.
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-7 text-[#f7f1e8]/72 sm:mt-7 sm:text-lg sm:leading-8">
                A fictional showcase for independent studios, makers, and
                creative developers who need one continuous story with depth,
                contrast, and polished presentation.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:mt-9 sm:flex-row">
                <button
                  className="rounded-[6px] bg-[#e36f50] px-5 py-3 font-semibold text-[#111111] transition-transform hover:-translate-y-0.5"
                  onClick={() => navigateTo(2)}
                  type="button"
                >
                  View work
                </button>
                <button
                  className="rounded-[6px] border border-[#f7f1e8]/18 px-5 py-3 font-semibold text-[#f7f1e8] transition-colors hover:bg-[#f7f1e8] hover:text-[#111111]"
                  onClick={() => navigateTo(1)}
                  type="button"
                >
                  Read story
                </button>
              </div>

              <dl className="mt-12 hidden max-w-xl grid-cols-3 gap-px overflow-hidden rounded-[8px] border border-[#f7f1e8]/12 bg-[#f7f1e8]/12 sm:grid">
                {metrics.map((metric) => (
                  <div className="bg-[#121417] p-4" key={metric.label}>
                    <dt className="text-2xl font-semibold text-[#f7f1e8]">
                      {metric.value}
                    </dt>
                    <dd className="mt-1 text-sm leading-5 text-[#f7f1e8]/56">
                      {metric.label}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <figure className="relative">
              <div className="overflow-hidden rounded-[8px] border border-[#f7f1e8]/12 bg-[#17191d] shadow-2xl shadow-black/35">
                <Image
                  alt="Fictional portfolio interface preview on laptop and phone"
                  className="h-[22svh] w-full object-cover object-center sm:h-auto"
                  height={1024}
                  priority
                  src="/scrollfolio-preview.png"
                  width={1536}
                />
              </div>
              <figcaption className="mt-4 hidden items-center justify-between gap-4 text-sm text-[#f7f1e8]/58 sm:flex">
                <span>Adaptive preview</span>
                <span>Desktop and mobile</span>
              </figcaption>
            </figure>
          </div>
        </section>

        <section
          aria-hidden={activeSection.id !== "story"}
          className={`${panelBaseClass} items-center bg-[#f4eadf] text-[#151515]`}
          id="panel-story"
          style={{
            transform: `translate3d(0, ${(1 - activeIndex) * 100}%, 0)`,
            zIndex: sections.length - Math.abs(1 - activeIndex),
          }}
        >
          <div className="mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:gap-12">
            <div>
              <p className="mb-4 text-sm font-medium text-[#1f6a59] sm:mb-5">
                Narrative first
              </p>
              <h2 className="max-w-3xl text-3xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
                Every screen gets a reason to exist.
              </h2>
            </div>

            <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-1 lg:gap-4">
              {storyCards.map((card, index) => (
                <article
                  className="grid gap-2 rounded-[8px] border border-[#161616]/10 bg-white/62 p-4 md:grid-rows-[auto_1fr] lg:grid-cols-[9rem_1fr] lg:grid-rows-1 lg:gap-4 lg:p-5"
                  key={card.title}
                >
                  <div className="text-sm font-semibold text-[#d65f45]">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold lg:text-xl">
                      {card.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-[#151515]/68 lg:mt-3 lg:text-base lg:leading-7">
                      {card.copy}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          aria-hidden={activeSection.id !== "work"}
          className={`${panelBaseClass} items-center bg-[#111715] text-[#f7f1e8]`}
          id="panel-work"
          style={{
            transform: `translate3d(0, ${(2 - activeIndex) * 100}%, 0)`,
            zIndex: sections.length - Math.abs(2 - activeIndex),
          }}
        >
          <div className="mx-auto w-full max-w-7xl">
            <div className="mb-6 flex flex-col justify-between gap-4 lg:mb-10 lg:flex-row lg:items-end lg:gap-6">
              <div>
                <p className="mb-4 text-sm font-medium text-[#69c5cf] sm:mb-5">
                  Featured work
                </p>
                <h2 className="max-w-3xl text-3xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
                  Fictional projects with real presentation value.
                </h2>
              </div>
              <p className="hidden max-w-md leading-7 text-[#f7f1e8]/64 sm:block">
                Replace these sample studies with client work, case studies, or
                product snapshots without changing the scroll structure.
              </p>
            </div>

            <div className="grid gap-3 lg:grid-cols-3 lg:gap-4">
              {projects.map((project) => (
                <article
                  className="group overflow-hidden rounded-[8px] border border-[#f7f1e8]/12 bg-[#171d1a]"
                  key={project.name}
                >
                  <div
                    className={`h-20 bg-gradient-to-br p-3 sm:h-48 sm:p-5 lg:h-64 ${project.color}`}
                  >
                    <div className="grid h-full grid-cols-[1fr_0.42fr] gap-2 sm:gap-3">
                      <div className="rounded-[6px] border border-white/20 bg-black/18 backdrop-blur-sm" />
                      <div className="grid gap-2 sm:gap-3">
                        <div className="rounded-[6px] border border-white/20 bg-white/24" />
                        <div className="rounded-[6px] border border-white/20 bg-black/20" />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-end justify-between gap-4 p-4 lg:p-5">
                    <div>
                      <h3 className="text-xl font-semibold lg:text-2xl">
                        {project.name}
                      </h3>
                      <p className="mt-1 text-sm text-[#f7f1e8]/58 lg:mt-2 lg:text-base">
                        {project.type}
                      </p>
                    </div>
                    <span className="rounded-[6px] border border-[#f7f1e8]/14 px-3 py-2 text-sm text-[#f7f1e8]/70">
                      {project.year}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          aria-hidden={activeSection.id !== "system"}
          className={`${panelBaseClass} items-center bg-[#f7f1e8] text-[#121212]`}
          id="panel-system"
          style={{
            transform: `translate3d(0, ${(3 - activeIndex) * 100}%, 0)`,
            zIndex: sections.length - Math.abs(3 - activeIndex),
          }}
        >
          <div className="mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-12">
            <div>
              <p className="mb-4 text-sm font-medium text-[#d65f45] sm:mb-5">
                Reusable system
              </p>
              <h2 className="max-w-3xl text-3xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
                Sharp enough for a demo, simple enough to customize.
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-7 text-[#121212]/66 sm:mt-7 sm:text-lg sm:leading-8">
                The structure is intentionally compact: clear data arrays, a
                single visual language, and a navigation model that can become
                more playful or more restrained depending on the audience.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {systemBlocks.map((block, index) => (
                <div
                  className={`min-h-28 rounded-[8px] border p-4 sm:min-h-40 ${
                    index % 3 === 0
                      ? "border-[#1f6a59]/30 bg-[#1f6a59] text-[#f7f1e8]"
                      : index % 3 === 1
                        ? "border-[#d65f45]/28 bg-[#f3c7b6]"
                        : "border-[#121212]/10 bg-white"
                  }`}
                  key={block}
                >
                  <div className="text-sm font-semibold">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <div className="mt-8 text-xl font-semibold leading-tight sm:mt-16">
                    {block}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          aria-hidden={activeSection.id !== "contact"}
          className={`${panelBaseClass} items-center bg-[#d65f45] text-[#111111]`}
          id="panel-contact"
          style={{
            transform: `translate3d(0, ${(4 - activeIndex) * 100}%, 0)`,
            zIndex: sections.length - Math.abs(4 - activeIndex),
          }}
        >
          <div className="mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-[1fr_0.8fr] lg:items-end lg:gap-12">
            <div>
              <p className="mb-4 text-sm font-semibold text-[#111111]/64 sm:mb-5">
                Template ready
              </p>
              <h2 className="max-w-4xl text-4xl font-semibold leading-[0.98] sm:text-6xl lg:text-7xl">
                Make the story unmistakably yours.
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-7 text-[#111111]/72 sm:mt-7 sm:text-lg sm:leading-8">
                Swap the sample names, connect real projects, tune the palette,
                and this becomes a premium scroll-based portfolio for a modern
                creative brand.
              </p>
            </div>

            <div className="rounded-[8px] border border-[#111111]/16 bg-[#f7f1e8] p-5">
              <h3 className="text-3xl font-semibold">LOGO</h3>
              <div className="mt-8 grid gap-3 text-sm">
                <div className="flex justify-between border-[#111111]/12 border-b pb-3">
                  <span>Availability</span>
                  <span>June 2026</span>
                </div>
                <div className="flex justify-between border-[#111111]/12 border-b pb-3">
                  <span>Contact</span>
                  <span>hello@example.studio</span>
                </div>
                <div className="flex justify-between">
                  <span>Base</span>
                  <span>Next.js and Tailwind</span>
                </div>
              </div>
              <button
                className="mt-8 w-full rounded-[6px] bg-[#111111] px-5 py-3 font-semibold text-[#f7f1e8] transition-colors hover:bg-[#1f6a59]"
                onClick={() => navigateTo(0)}
                type="button"
              >
                Back to top
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
