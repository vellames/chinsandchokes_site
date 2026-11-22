import Image from "next/image";
import { isOptimizable } from "@/lib/images";

interface Props {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
}

/**
 * Fills its (relatively positioned) parent with a cover. The whole image is always visible: a
 * vertical Reels cover sits over a blurred, darkened copy of itself instead of being cropped.
 * Our covers are designed in the Studio (B&W photo + lime), so no filter is applied here.
 */
export function CoverImage({ src, alt, sizes, priority = false, className = "" }: Props) {
  return (
    <>
      <Picture src={src} alt="" sizes={sizes} priority={priority} className="scale-110 object-cover opacity-40 blur-2xl" />
      <Picture src={src} alt={alt} sizes={sizes} priority={priority} className={`object-contain ${className}`} />
    </>
  );
}

function Picture({ src, alt, sizes, priority, className }: Required<Omit<Props, "className">> & { className: string }) {
  if (isOptimizable(src)) {
    return <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className={className} />;
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element -- host not in the optimizer allowlist (see lib/images.ts)
    <img
      src={src}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      className={`absolute inset-0 h-full w-full ${className}`}
    />
  );
}

/** Branded placeholder for articles without a cover: graphite with the lime mark. */
export function CoverPlaceholder() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-graphite">
      <Image src="/brand/mark.png" alt="" width={64} height={64} className="opacity-40" />
    </div>
  );
}

/** Small lime badge on cards whose story has a video. */
export function VideoBadge() {
  return (
    <span className="kicker absolute left-3 top-3 z-10 inline-flex items-center gap-1.5 bg-lime px-2 py-1 text-[10px] text-charcoal">
      <svg aria-hidden viewBox="0 0 10 10" className="h-2.5 w-2.5 fill-current">
        <path d="M2 1l7 4-7 4z" />
      </svg>
      Video
    </span>
  );
}
