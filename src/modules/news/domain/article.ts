/** A source behind the reporting, shown under the article ("How we know"). */
export interface Source {
  readonly label: string;
  /** Missing for sources that are not online (a book, a broadcast). */
  readonly url: string | null;
}

export interface Video {
  readonly youtubeId: string;
  /** portrait = a YouTube Short (9:16). */
  readonly orientation: "landscape" | "portrait";
}

export interface CategoryRef {
  readonly slug: string;
  readonly name: string;
}

export interface Category extends CategoryRef {
  readonly description: string | null;
}

export interface TagRef {
  readonly slug: string;
  readonly name: string;
}

export interface Author {
  readonly slug: string;
  readonly name: string;
  readonly bio: string | null;
  readonly avatarUrl: string | null;
}

export interface CoverImage {
  readonly url: string;
  readonly alt: string;
  readonly credit: string | null;
}

/** What a list, a card or a feed needs. */
export interface ArticleSummary {
  readonly id: string;
  readonly slug: string;
  readonly title: string;
  readonly dek: string;
  readonly cover: CoverImage | null;
  readonly video: Video | null;
  readonly category: CategoryRef;
  readonly authorName: string | null;
  readonly publishedAt: Date;
  readonly readingMinutes: number;
}

/** A published article, as the article page shows it. */
export interface Article extends ArticleSummary {
  readonly body: string;
  readonly author: Author | null;
  readonly tags: readonly TagRef[];
  readonly sources: readonly Source[];
  readonly updatedAt: Date;
  readonly seoTitle: string | null;
  readonly seoDescription: string | null;
}
