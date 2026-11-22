-- LOCAL DEVELOPMENT ONLY: sample rows to see the layout. Never run against production.
-- Also a template for adding content by hand: ids, createdAt and updatedAt fill themselves.

INSERT INTO "Category" ("slug", "name", "description", "position") VALUES
  ('news',      'News',      'Results, decisions and the stories everyone is arguing about.', 0),
  ('fight-iq',  'Fight IQ',  'The detail that decided the fight, explained.',                 1),
  ('bjj-101',   'BJJ 101',   'Jiu-jitsu positions and submissions for fans who never trained.', 2),
  ('rules',     'Rules',     'How fights are scored, refereed and decided.',                  3);

INSERT INTO "Author" ("slug", "name", "bio") VALUES
  ('chins-and-chokes', 'Chins & Chokes Staff', 'Breakdowns from striking to grappling.');

INSERT INTO "Tag" ("slug", "name") VALUES ('judging', 'Judging'), ('submissions', 'Submissions'), ('ufc', 'UFC');

INSERT INTO "Article" ("slug", "title", "dek", "body", "coverImageUrl", "coverImageAlt", "coverImageCredit",
                       "status", "publishedAt", "featured", "sources", "categoryId", "authorId")
SELECT v.slug, v.title, v.dek, v.body, v.cover, v.alt, v.credit, v.status::"ArticleStatus", v.published::timestamptz,
       v.featured, v.sources::jsonb, c.id, a.id
FROM (VALUES
  ('how-judges-score-a-round', 'Two judges. Two scorecards.',
   'How the 10-point must system works, and why the same round can go either way.',
   E'Most MMA rounds end **10-9**. The judge gives 10 points to the fighter who won the round and 9 to the one who lost it.\n\n## What judges look at first\n\nUnder the Unified Rules, judges look at **effective striking and grappling** first. Only when that is even do they move to effective aggressiveness, and then to cage control.\n\n- Damage matters more than volume.\n- A takedown with nothing after it counts for less than one that leads somewhere.\n\n## When a round is 10-8\n\nA 10-8 needs dominance, damage or duration — one fighter clearly in control for most of the round.\n\n> Watch for damage, not just activity.',
   '/brand/og-default.jpg', 'Two fighters in a clinch, black and white', 'Photo: Chins & Chokes',
   'published', '2026-11-22T15:00:00Z', true,
   '[{"label":"ABC Unified Rules of MMA","url":"https://www.abcboxing.com/"}]', 'rules'),
  ('what-is-a-guillotine', 'The choke that ends scrambles',
   'What a guillotine is, and the one thing to watch when a fighter shoots with their head down.',
   E'A guillotine is a front choke: the arm wraps around the neck from the front while the opponent''s head is under the armpit.\n\n## Why it shows up after takedowns\n\nA fighter who shoots with the head low gives the neck away. That is the moment to watch.',
   NULL, NULL, NULL, 'published', '2026-11-21T22:00:00Z', false, '[]', 'bjj-101'),
  ('why-the-clinch-matters', 'Why the clinch matters',
   'Most fans see two fighters leaning on each other. Here is what is actually happening.',
   E'In the clinch, the fighter with the better **head position** and **underhooks** decides what happens next: knees, a takedown, or a break.',
   '/brand/og-default.jpg', 'Grappling exchange', 'Photo: Chins & Chokes',
   'published', '2026-11-20T21:00:00Z', false, '[]', 'fight-iq'),
  ('draft-story', 'A draft nobody should see', 'Draft.', 'Draft body.', NULL, NULL, NULL,
   'draft', NULL, false, '[]', 'news'),
  ('scheduled-story', 'A scheduled story', 'Goes live later.', 'Scheduled body.', NULL, NULL, NULL,
   'published', '2030-01-01T00:00:00Z', false, '[]', 'news')
) AS v(slug, title, dek, body, cover, alt, credit, status, published, featured, sources, category)
JOIN "Category" c ON c.slug = v.category
CROSS JOIN (SELECT id FROM "Author" WHERE slug = 'chins-and-chokes') a;

INSERT INTO "ArticleTag" ("articleId", "tagId")
SELECT ar.id, t.id FROM "Article" ar JOIN "Tag" t ON
  (ar.slug = 'how-judges-score-a-round' AND t.slug IN ('judging', 'ufc')) OR
  (ar.slug = 'what-is-a-guillotine' AND t.slug = 'submissions');
