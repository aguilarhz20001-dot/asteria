import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronRight, MessageCircle, Moon, ShoppingBag, Sparkle, Sparkles, Star } from "lucide-react";
import Reveal from "./Reveal";
import HeroDecor from "./HeroDecor";
import TrustBar from "./TrustBar";
import { whatsappLink, DEFAULT_WHATSAPP_MESSAGE } from "@/lib/contact";

/** Panel decorativo lateral (escritorio): luna y estrellas sobre degradado. */
function DecorPanel({ variant, className = "" }: { variant: "moon" | "stars"; className?: string }) {
  const Main = variant === "moon" ? Moon : Sparkles;
  return (
    <div
      className={`relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-lilac-light via-white to-brand-accent-light p-1.5 shadow-lg shadow-brand-accent/25 ring-1 ring-brand-accent/20 ${className}`}
    >
      <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-[1.25rem]">
        <Main className="h-24 w-24 text-brand-lilac" strokeWidth={1.2} aria-hidden="true" />
        <Star className="absolute left-[18%] top-[14%] h-6 w-6 text-brand-accent/70" strokeWidth={1.4} aria-hidden="true" />
        <Sparkle className="absolute right-[16%] top-[30%] h-5 w-5 text-brand-lilac/70" aria-hidden="true" />
        <Star className="absolute bottom-[22%] left-[24%] h-4 w-4 text-brand-lilac/60" strokeWidth={1.4} aria-hidden="true" />
        <Sparkle className="absolute bottom-[12%] right-[22%] h-6 w-6 text-brand-accent/70" aria-hidden="true" />
      </div>
    </div>
  );
}

/** Tarjeta principal para celular y tablet: logo, título y botones. */
function MobileHero() {
  return (
    <div className="relative isolate overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-white via-brand-accent-light to-brand-lilac-light p-5 pb-6 shadow-lg shadow-brand-accent/20 ring-1 ring-brand-accent/20">
      <Sparkle className="absolute left-4 top-4 h-4 w-4 text-brand-lilac/70" aria-hidden="true" />
      <Star className="absolute right-4 top-5 h-5 w-5 text-brand-accent/70" strokeWidth={1.4} aria-hidden="true" />

      <Image
        src="/logo.png"
        alt="Asteria Store"
        width={391}
        height={370}
        priority
        sizes="(min-width: 640px) 14rem, 50vw"
        className="mx-auto h-auto w-[52%] max-w-[14rem] drop-shadow-md"
      />

      <h1 className="mt-3 text-center font-script font-bold leading-none">
        <span className="block text-[clamp(1.4rem,7vw,2rem)] text-brand-ink">Tu tienda</span>
        <span className="block whitespace-nowrap text-[clamp(2.6rem,14vw,4.2rem)] text-brand-accent-dark">
          online
        </span>
      </h1>

      <p className="mx-auto mt-3 max-w-[18rem] text-center text-[13px] leading-snug text-brand-ink/80">
        Ropa, accesorios, calzado, belleza y muchas cositas más.
      </p>

      <div className="mx-auto mt-4 flex max-w-[18rem] flex-col gap-2">
        <Link
          href="/tienda"
          className="btn-primary inline-flex items-center justify-center gap-1.5 px-3 py-3 text-[13px] font-semibold"
        >
          Ver productos
          <ArrowRight size={15} />
        </Link>
        <a
          href={whatsappLink(DEFAULT_WHATSAPP_MESSAGE)}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-outline inline-flex items-center justify-center gap-1.5 px-3 py-3 text-[13px] font-semibold !bg-white"
        >
          <MessageCircle size={16} className="shrink-0 text-[#25D366]" />
          WhatsApp
        </a>
      </div>
    </div>
  );
}

export default function HomeHero() {
  return (
    <section className="relative overflow-hidden">
      <HeroDecor />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-8 pt-4 pb-4 lg:pt-8 lg:pb-14">
        {/* ---------- Celular y tablet ---------- */}
        <div className="mx-auto max-w-xl lg:hidden">
          <MobileHero />
          <div className="mt-4">
            <TrustBar compact />
          </div>
        </div>

        {/* ---------- Escritorio: panel | centro | panel ---------- */}
        <div className="hidden lg:block">
          <div className="grid items-stretch gap-6 grid-cols-[minmax(0,1fr)_minmax(0,2.4fr)_minmax(0,1fr)]">
            <Reveal y={20}>
              <DecorPanel variant="moon" className="h-full min-h-[560px]" />
            </Reveal>

            <div className="flex flex-col items-center text-center">
              <Reveal className="w-full">
                <Image
                  src="/logo.png"
                  alt="Asteria Store"
                  width={391}
                  height={370}
                  priority
                  sizes="20rem"
                  className="mx-auto h-auto w-72 drop-shadow-md"
                />
              </Reveal>

              <Reveal delay={0.1} className="w-full mt-6">
                <h1 className="font-script font-bold leading-tight">
                  <span className="block text-5xl text-brand-ink">Tu tienda</span>
                  <span className="block text-8xl text-brand-accent-dark">online</span>
                </h1>
                <p className="mx-auto mt-4 max-w-md text-lg text-brand-ink/75">
                  Ropa, accesorios, calzado, belleza y muchas cositas más.
                </p>

                <div className="mt-6 flex flex-wrap justify-center gap-4">
                  <Link href="/tienda" className="btn-primary inline-flex items-center gap-3 px-8 py-4 font-semibold">
                    <ShoppingBag size={20} />
                    Ver productos
                    <ChevronRight size={18} />
                  </Link>
                  <a
                    href={whatsappLink(DEFAULT_WHATSAPP_MESSAGE)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-outline inline-flex items-center gap-3 px-8 py-4 font-semibold !bg-white"
                  >
                    <MessageCircle size={20} className="text-[#25D366]" />
                    Escríbenos por WhatsApp
                    <ChevronRight size={18} />
                  </a>
                </div>
              </Reveal>
            </div>

            <Reveal y={20} delay={0.08}>
              <DecorPanel variant="stars" className="h-full min-h-[560px]" />
            </Reveal>
          </div>

          <div className="mt-12">
            <TrustBar />
          </div>
        </div>
      </div>
    </section>
  );
}
