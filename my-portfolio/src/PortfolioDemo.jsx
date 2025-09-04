import React, { useMemo, useState, useEffect } from "react";

function useIsMobile(breakpoint = 768) {
    const [isMobile, setIsMobile] = useState(
        typeof window !== "undefined" ? window.innerWidth < breakpoint : false
    );
    useEffect(() => {
        const onResize = () => setIsMobile(window.innerWidth < breakpoint);
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, [breakpoint]);
    return isMobile;
}


/**
 * Portfolio layout v2 — matches the sketch more closely
 * - Sticky stack (3 rows): Toolbar (row1) • Big Bio with photo (row2) • Tabs (row3)
 * - Project cards: 2-column (image 16:9) with long description beside; gallery & tech below
 * - Fixed footer: content pushed to far left/right
 * - Tailwind v3 compatible
 *
 * NOTE: Below we inline data for preview. In the chat response you'll get JSON files to extract content.
 */

// ---- i18n (inline for demo) ----

import en from "./data/i18n.en.json";
import es from "./data/i18n.es.json";
import projectsData from "./data/projects.json";
import labData from "./data/lab.json";

const copy = { en, es };
const projects = projectsData;
const lab = labData;


// ---- UI components ----
function Chip({ children }) {
    return (
        <span className="inline-flex items-center rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300">
            {children}
        </span>
    );
}

function Toolbar({ t, lang, setLang, fontSize, setFontSize }) {
    return (
        <div className="fixed right-3 top-3 z-50 flex items-center gap-4 rounded-xl border border-zinc-700 bg-zinc-900/80 px-3 py-2 backdrop-blur">
            {/* Language */}
            <label className="flex items-center gap-2 text-xs text-zinc-300">
                <span className="opacity-70">{t.language}</span>
                <select
                    aria-label={t.language}
                    value={lang}
                    onChange={(e) => setLang(e.target.value)}
                    className="rounded-md border border-zinc-700 bg-zinc-800 px-2 py-1 text-zinc-100"
                >
                    <option value="en">EN</option>
                    <option value="es">ES</option>
                </select>
            </label>
            {/* Font size */}
            <label className="flex items-center gap-2 text-xs text-zinc-300">
                <span className="opacity-70">{t.fontSize}</span>
                <div className="flex overflow-hidden rounded-full border border-zinc-700">
                    {["sm", "base", "lg"].map((s) => (
                        <button
                            key={s}
                            onClick={() => setFontSize(s)}
                            className={
                                "px-2 py-1 text-xs " +
                                (fontSize === s
                                    ? "bg-emerald-600/30 text-emerald-100"
                                    : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700")
                            }
                            aria-pressed={fontSize === s}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </label>
        </div>
    );
}

function ToolbarFloating({ t, lang, setLang, fontSize, setFontSize }) {
    return (
        <div className="fixed right-3 top-3 z-50 flex items-center gap-4 rounded-xl border border-zinc-700 bg-zinc-900/80 px-3 py-2 backdrop-blur">
            {/* Language */}
            <label className="flex items-center gap-2 text-xs text-zinc-300">
                <span className="opacity-70">{t.language}</span>
                <select
                    aria-label={t.language}
                    value={lang}
                    onChange={(e) => setLang(e.target.value)}
                    className="rounded-md border border-zinc-700 bg-zinc-800 px-2 py-1 text-zinc-100"
                >
                    <option value="en">EN</option>
                    <option value="es">ES</option>
                </select>
            </label>
            {/* Font size */}
            <label className="flex items-center gap-2 text-xs text-zinc-300">
                <span className="opacity-70">{t.fontSize}</span>
                <div className="flex overflow-hidden rounded-full border border-zinc-700">
                    {["sm", "base", "lg"].map((s) => (
                        <button
                            key={s}
                            onClick={() => setFontSize(s)}
                            className={
                                "px-2 py-1 text-xs " +
                                (fontSize === s
                                    ? "bg-emerald-600/30 text-emerald-100"
                                    : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700")
                            }
                            aria-pressed={fontSize === s}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </label>
        </div>
    );
}


function BioHeaderMobile({ t, lang, setLang, fontSize, setFontSize }) {
  return (
    <div className="w-full border-b border-zinc-800 bg-zinc-900/80">
      {/* toolbar – normal, not floating */}
      <div className="flex items-center justify-end gap-4 px-3 pt-3">
        <label className="flex items-center gap-2 text-xs text-zinc-300">
          <span className="opacity-70">{t.language}</span>
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className="rounded-md border border-zinc-700 bg-zinc-800 px-2 py-1 text-zinc-100"
          >
            <option value="en">EN</option>
            <option value="es">ES</option>
          </select>
        </label>
        <label className="flex items-center gap-2 text-xs text-zinc-300">
          <span className="opacity-70">{t.fontSize}</span>
          <div className="flex overflow-hidden rounded-full border border-zinc-700">
            {["sm", "base", "lg"].map((s) => (
              <button
                key={s}
                onClick={() => setFontSize(s)}
                className={
                  "px-2 py-1 text-xs " +
                  (fontSize === s
                    ? "bg-emerald-600/30 text-emerald-100"
                    : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700")
                }
              >
                {s}
              </button>
            ))}
          </div>
        </label>
      </div>

      {/* row 1: photo + name */}
      <div className="flex items-center gap-4 px-4 pt-4">
        <div className="h-20 w-20 overflow-hidden rounded-full border border-zinc-700">
          <img src="/images/pfp.jpg" alt={`Portrait of ${t.name}`} className="h-full w-full object-cover" />
        </div>
        <h1 className="text-2xl font-semibold text-zinc-100">{t.name}</h1>
      </div>

      {/* row 2: description */}
      <p className="px-4 pb-5 pt-2 text-sm text-zinc-300">{t.tagline}</p>
    </div>
  );
}



function BioHeaderDesktop({ t }) {
    // no max-w container so it aligns to the very left of the header band
    return (
        <div className="w-full border-b border-zinc-800 bg-zinc-900/80">
            <div className="flex items-center gap-6 px-4 py-8">
                <div className="h-32 w-32 shrink-0 overflow-hidden rounded-full border border-zinc-700">
                    <img
                        src="/images/pfp.jpg"       // put your pfp at /public/images/pfp.jpg
                        alt={`Portrait of ${t.name}`}
                        className="h-full w-full object-cover"
                    />
                </div>
                <div className="min-w-0">
                    <h1 className="text-3xl font-semibold text-zinc-100">{t.name}</h1>
                    <p className="mt-2 max-w-4xl text-base text-zinc-300">{t.tagline}</p>
                </div>
            </div>
        </div>
    );
}


function SectionTabs({ t, current, onChange, size = "md" }) {
  const tabs = [
    { key: "projects", label: t.projects },
    { key: "lab", label: t.lab },
    { key: "bio", label: t.bioTab },
  ];

  const pad = size === "lg" ? "py-3 text-base" : "py-2 text-sm";
  const width = size === "lg" ? "min-w-[14ch]" : "min-w-[12ch]"; // equal width
  const gap = size === "lg" ? "gap-5" : "gap-4";

  return (
    <div className="mx-auto max-w-6xl px-4 my-6 md:my-8">{/* equal top/bottom margin */}
      <div className={`flex ${gap} justify-center`}>
        {tabs.map((btn) => (
          <button
            key={btn.key}
            onClick={() => onChange(btn.key)}
            className={
              `rounded-2xl px-6 ${pad} ${width} text-center transition shadow-sm border ` +
              (current === btn.key
                ? "border-emerald-500/60 text-emerald-200 bg-transparent"
                : "border-zinc-700 text-zinc-300 bg-transparent hover:bg-zinc-800/40")
            }
          >
            {btn.label}
          </button>
        ))}
      </div>
    </div>
  );
}




function ProjectCard({ item, t, onOpenMedia }) {
  const hero = item.media?.[0];
  const isHeroVideo = hero?.type === "youtube";

  return (
    <article className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4 shadow-sm backdrop-blur">
      {/* 2-column: long text (left) + hero (right) */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* TEXT FIRST */}
        <div>
          <h3 className="text-xl font-semibold text-zinc-100">{item.title}</h3>
          <p className="mt-2 text-sm text-zinc-300 md:text-base">{item.description}</p>

          {/* Tech */}
          <div className="mt-4">
            <h4 className="mb-2 text-sm font-medium text-emerald-300/90">{t.techStack}</h4>
            <div className="flex flex-wrap gap-2">
              {item.tech.map((tech) => (
                <Chip key={tech}>{tech}</Chip>
              ))}
            </div>
          </div>
        </div>

        {/* HERO SECOND (image or video) */}
        <div className="relative overflow-hidden rounded-xl">
          <div className="aspect-video w-full overflow-hidden rounded-xl">
            {isHeroVideo ? (
              <img
                src={hero.thumb || `https://img.youtube.com/vi/${hero.youtubeId}/hqdefault.jpg`}
                alt={hero.alt || hero.caption || "Video"}
                className="h-full w-full cursor-pointer object-cover"
                onClick={() => onOpenMedia(item, 0)}
              />
            ) : (
              <img
                src={hero?.src}
                alt={hero?.alt}
                className="h-full w-full object-cover"
              />
            )}
          </div>

          {/* OVERLAYED LINKS (bottom-left) */}
          {(item.links?.length || item.link) && (
            <div className="pointer-events-auto absolute bottom-2 left-2 flex max-w-[90%] flex-wrap gap-2">
              {item.links?.map((lnk, i) => (
                <a
                  key={i}
                  href={lnk.href}
                  className="rounded-lg border border-emerald-700 bg-emerald-600/90 px-3 py-1 text-sm text-white/95 backdrop-blur hover:bg-emerald-600"
                >
                  {lnk.label}
                </a>
              ))}
              {!item.links?.length && item.link && (
                <a
                  href={item.link}
                  className="rounded-lg border border-emerald-700 bg-emerald-600/90 px-3 py-1 text-sm text-white/95 backdrop-blur hover:bg-emerald-600"
                >
                  {t.viewLink}
                </a>
              )}
            </div>
          )}

          {/* Play badge if hero is a video */}
          {isHeroVideo && (
            <button
              onClick={() => onOpenMedia(item, 0)}
              aria-label="Play video"
              className="absolute inset-0 grid place-items-center text-white/95"
            >
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-black/60">▶</span>
            </button>
          )}
        </div>
      </div>

      {/* THUMBNAILS (image + youtube), all 16:9 */}
      <div className="mt-4">
        <h5 className="mb-2 text-xs uppercase tracking-wide text-zinc-400">
          {t.moreMedia}
        </h5>
        <div className="grid grid-cols-3 gap-2 md:grid-cols-5">
          {item.media.map((m, idx) => {
            const isVideo = m.type === "youtube";
            const thumbSrc = isVideo
              ? (m.thumb || `https://img.youtube.com/vi/${m.youtubeId}/hqdefault.jpg`)
              : m.src;

            return (
              <button
                key={idx}
                className="relative block overflow-hidden rounded-lg border border-zinc-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                onClick={() => onOpenMedia(item, idx)}
                aria-label={`Open media ${idx + 1} for ${item.title}`}
              >
                <div className="aspect-video w-full">
                  <img
                    src={thumbSrc}
                    alt={m.alt || m.caption || (isVideo ? "Video" : "Image")}
                    className="h-full w-full object-cover"
                  />
                </div>
                {isVideo && (
                  <span className="pointer-events-none absolute inset-0 grid place-items-center">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/60">
                      ▶
                    </span>
                  </span>
                )}
                
              </button>
            );
          })}
        </div>
      </div>
    </article>
  );
}


function MediaLightbox({ open, onClose, media, title, index }) {
  if (!open) return null;
  const m = media[index];
  const isVideo = m?.type === "youtube";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`${title} media viewer`}
    >
      <button
        onClick={onClose}
        className="absolute right-4 top-4 rounded-lg border border-zinc-700 bg-zinc-900/80 px-3 py-1 text-sm text-zinc-200 hover:bg-zinc-800"
        aria-label="Close"
      >
        ✕
      </button>

      <div className="max-w-[90vw]">
        <div className="aspect-video w-[min(90vw,1100px)]">
          {isVideo ? (
            <iframe
              className="h-full w-full"
              src={`https://www.youtube.com/embed/${m.youtubeId}`}
              title={m.caption || m.alt || title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            <img src={m?.src} alt={m?.alt} className="h-full w-full object-contain" />
          )}
        </div>
        {(m?.caption || m?.alt) && (
          <p className="mt-2 text-center text-xs text-zinc-300">
            {m?.caption || m?.alt}
          </p>
        )}
      </div>
    </div>
  );
}



export default function PortfolioDemo() {
    const [lang, setLang] = useState("en");
    const [fontSize, setFontSize] = useState("base");
    const [section, setSection] = useState("projects");
    const t = copy[lang];

    const textSize = fontSize === "sm" ? "text-sm" : fontSize === "lg" ? "text-lg" : "text-base";
    const items = useMemo(() => (section === "projects" ? projects : section === "lab" ? lab : []), [section]);

    const [lightbox, setLightbox] = useState({ open: false, item: null, index: 0 });
    const openMedia = (item, index) => setLightbox({ open: true, item, index });
    const closeMedia = () => setLightbox({ open: false, item: null, index: 0 });

    const isMobile = useIsMobile();

    return (
        <div className={`min-h-screen bg-zinc-950 ${textSize}`}>
            {/* Desktop: floating toolbar + desktop bio band */}
            {!isMobile && (
                <>
                    <ToolbarFloating
                        t={t}
                        lang={lang}
                        setLang={setLang}
                        fontSize={fontSize}
                        setFontSize={setFontSize}
                    />
                    <BioHeaderDesktop t={t} />
                </>
            )}

            {/* Mobile: combined header */}
            {isMobile && (
                <BioHeaderMobile
                    t={t}
                    lang={lang}
                    setLang={setLang}
                    fontSize={fontSize}
                    setFontSize={setFontSize}
                />
            )}

            {/* Tabs (centered, equal width) */}
            <SectionTabs size="lg" t={t} current={section} onChange={setSection} />

            {/* Main content */}
            <main className="mx-auto max-w-6xl px-4 pt-6 pb-24">
                {section === "bio" ? (
                    <article className="prose prose-invert max-w-none prose-headings:text-zinc-100 prose-strong:text-emerald-300">
                        <h2 className="mb-2 text-2xl">{t.bioTab}</h2>
                        <p>
                            Long‑form professional story goes here—how 3D/2D art led to tools and web dev,
                            the problems you like to solve, and what you’re exploring next.
                        </p>
                    </article>
                ) : (
                    <div className="grid gap-6">
                        {items.map((p) => (
                            <ProjectCard key={p.id} item={p} t={t} onOpenMedia={openMedia} />
                        ))}
                    </div>
                )}
            </main>

            {/* Fixed footer with far-left/far-right alignment */}
            <footer className="fixed bottom-0 left-0 right-0 border-t border-zinc-800 bg-zinc-900/90 backdrop-blur">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2 text-xs text-zinc-400">
                    <span className="place-self-start">© {new Date().getFullYear()} • {t.name}</span>
                    <a
                        href="https://github.com/youruser/your-portfolio"
                        className="place-self-end rounded-md border border-emerald-800 bg-emerald-900/30 px-2 py-1 text-emerald-300 hover:bg-emerald-900/50"
                    >
                        {t.footerNote}
                    </a>
                </div>
            </footer>

            <MediaLightbox
                open={lightbox.open}
                onClose={closeMedia}
                media={lightbox.item?.media || []}
                title={lightbox.item?.title || ""}
                index={lightbox.index}
            />
        </div>
    );
}
