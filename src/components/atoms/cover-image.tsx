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
 * Fills its (relatively positioned) parent with a black-and-white photo. Optimized through
 * next/image when the host is allowed, plain <img> otherwise.
 */
export function CoverImage({ src, alt, sizes, priority = false, className = "" }: Props) {
  const classes = `photo-bw object-cover ${className}`;
  if (isOptimizable(src)) {
    return <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className={classes} />;
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element -- host not in the optimizer allowlist (see lib/images.ts)
    <img
      src={src}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      className={`absolute inset-0 h-full w-full ${classes}`}
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
