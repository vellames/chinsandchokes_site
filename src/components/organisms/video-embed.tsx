import type { Video } from "@/modules/news";

/**
 * YouTube player (privacy-enhanced domain: no cookies until the viewer presses play).
 * Shorts play in a 9:16 frame, regular videos in 16:9.
 */
export function VideoEmbed({ video, title }: { video: Video; title: string }) {
  const portrait = video.orientation === "portrait";
  return (
    <div className={portrait ? "mx-auto w-full max-w-sm" : "w-full"}>
      <div className={`relative overflow-hidden bg-graphite ${portrait ? "aspect-[9/16]" : "aspect-video"}`}>
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?rel=0&modestbranding=1`}
          title={title}
          loading="lazy"
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          className="absolute inset-0 h-full w-full border-0"
        />
      </div>
    </div>
  );
}
