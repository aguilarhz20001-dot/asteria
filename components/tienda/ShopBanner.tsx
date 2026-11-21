"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const SLIDES = [
  { src: "/tienda/banner-1.webp", alt: "Moda que te enamora — Asteria Store" },
  { src: "/tienda/banner-2.webp", alt: "Viste tus sueños: estilo y comodidad en un solo lugar — Asteria Store" },
  { src: "/tienda/banner-3.webp", alt: "Encuentra tu estilo: moda para cada momento — Asteria Store" },
];

const AUTOPLAY_MS = 5000;

/**
 * Banner de la tienda.
 * Celular y tablet: carrusel que se desliza solo (y con el dedo), con puntitos.
 * Escritorio (lg): las tres fotos juntas, sin carrusel.
 */
export default function ShopBanner() {
  const ref = useRef<HTMLDivElement>(null);
  const paused = useRef(false);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const kids = () => Array.from(el.children) as HTMLElement[];
    const step = () => {
      const k = kids();
      return k.length > 1 ? k[1].offsetLeft - k[0].offsetLeft : el.clientWidth;
    };
    const scrollable = () => el.scrollWidth > el.clientWidth + 2;
    const atEnd = () => el.scrollLeft + el.clientWidth >= el.scrollWidth - 2;

    const onScroll = () => {
      if (!scrollable()) return;
      setActive(atEnd() ? kids().length - 1 : Math.round(el.scrollLeft / step()));
    };
    el.addEventListener("scroll", onScroll, { passive: true });

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = reduced
      ? undefined
      : window.setInterval(() => {
          if (paused.current || document.hidden || !scrollable()) return;
          el.scrollTo({ left: atEnd() ? 0 : el.scrollLeft + step(), behavior: "smooth" });
        }, AUTOPLAY_MS);

    return () => {
      el.removeEventListener("scroll", onScroll);
      if (timer) window.clearInterval(timer);
    };
  }, []);

  const goTo = (i: number) => {
    const el = ref.current;
    if (!el) return;
    const k = Array.from(el.children) as HTMLElement[];
    el.scrollTo({ left: k[i].offsetLeft - k[0].offsetLeft, behavior: "smooth" });
  };

  const pause = () => {
    paused.current = true;
  };
  const resume = () => {
    paused.current = false;
  };

  return (
    <div className="relative" onPointerEnter={pause} onPointerLeave={resume} onTouchStart={pause} onTouchEnd={resume}>
      <div
        ref={ref}
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:grid lg:grid-cols-3 lg:gap-5 lg:overflow-visible"
      >
        {SLIDES.map((s, i) => (
          <Link
            key={s.src}
            href="#productos"
            aria-label={`${s.alt}. Ver productos`}
            className="relative block aspect-[9/16] w-[78%] shrink-0 snap-start overflow-hidden rounded-[1.75rem] shadow-lg shadow-brand-accent/25 ring-1 ring-brand-accent/20 sm:w-[calc(50%-0.375rem)] lg:w-auto"
          >
            <Image
              src={s.src}
              alt={s.alt}
              fill
              priority={i === 0}
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 78vw"
              className="object-cover object-top"
            />
          </Link>
        ))}
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center gap-2 lg:hidden">
        {SLIDES.map((s, i) => (
          <button
            key={s.src}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Ir al banner ${i + 1}`}
            aria-current={i === active}
            className="pointer-events-auto flex h-5 items-center"
          >
            <span
              className={`block h-2.5 rounded-full shadow-sm transition-all ${
                i === active ? "w-6 bg-brand-accent-dark" : "w-2.5 bg-white/90 ring-1 ring-brand-accent/30"
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
