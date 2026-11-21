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
// Proporción (ancho/alto) mientras cargan las imágenes. Luego se usa la real de tus imágenes.
const DEFAULT_RATIO = 640 / 690;

const median = (nums: number[]) => {
  const a = [...nums].sort((x, y) => x - y);
  return a[Math.floor(a.length / 2)];
};

/**
 * Banner de la tienda.
 * Las tres tarjetas tienen siempre el mismo tamaño y la proporción de tus imágenes
 * (cuadradas o altas), así que se ven completas. El ancho nunca pasa del máximo de cada pantalla.
 * Celular: carrusel que se desliza solo (y con el dedo), con puntitos.
 * Tablet y escritorio: las tres tarjetas juntas y centradas.
 */
export default function ShopBanner() {
  const ref = useRef<HTMLDivElement>(null);
  const paused = useRef(false);
  const [active, setActive] = useState(0);
  const [loaded, setLoaded] = useState<(number | null)[]>(() => SLIDES.map(() => null));
  // Las tres tarjetas usan SIEMPRE la misma proporción: la que tengan tus imágenes.
  const known = loaded.filter((r): r is number => r !== null);
  const ratio = known.length ? median(known) : DEFAULT_RATIO;

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
    <div onPointerEnter={pause} onPointerLeave={resume} onTouchStart={pause} onTouchEnd={resume}>
      <div
        ref={ref}
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-1 pb-3 pt-1 [scrollbar-width:none] sm:justify-center sm:gap-5 [&::-webkit-scrollbar]:hidden"
      >
        {SLIDES.map((s, i) => (
          <Link
            key={s.src}
            href="#productos"
            aria-label={`${s.alt}. Ver productos`}
            style={{ aspectRatio: ratio, width: `min(var(--maxw), calc(var(--h) * ${ratio}))` }}
            className="relative block shrink-0 snap-start overflow-hidden rounded-[1.25rem] shadow-lg shadow-brand-accent/25 ring-1 ring-brand-accent/20 [--h:24rem] [--maxw:76vw] sm:[--h:22rem] sm:[--maxw:calc((100vw_-_6.5rem)/3)] lg:[--h:24rem] lg:[--maxw:21rem] lg:rounded-[1.5rem]"
          >
            <Image
              src={s.src}
              alt={s.alt}
              fill
              priority={i === 0}
              sizes="(min-width: 1024px) 340px, (min-width: 640px) 33vw, 76vw"
              className="object-cover"
              onLoad={(e) => {
                const { naturalWidth: w, naturalHeight: h } = e.currentTarget;
                if (!w || !h) return;
                setLoaded((prev) => prev.map((r, j) => (j === i ? w / h : r)));
              }}
            />
          </Link>
        ))}
      </div>

      <div className="flex justify-center gap-2 sm:hidden">
        {SLIDES.map((s, i) => (
          <button
            key={s.src}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Ir al banner ${i + 1}`}
            aria-current={i === active}
            className="flex h-5 items-center"
          >
            <span
              className={`block h-2.5 rounded-full transition-all ${
                i === active ? "w-6 bg-brand-accent-dark" : "w-2.5 bg-brand-accent/30"
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
