
add-a-karpathy-wiki-to-your-os.md

Page
1
/
1
100%
# Free recipe: add a Karpathy-style wiki (standalone, or on your OS)

Point any agent (Claude Code, or any tool that can read and write files) at this file and say: "Follow
this recipe." Use it **two ways**:
- **Standalone — no OS needed.** Make an empty folder, drop this file in, say "Follow this recipe." You
  get a complete, self-sufficient second brain you query directly. The `wiki/` tree below *is* the whole
  system — nothing else required.
- **On an existing OS.** Run it inside a PM-OS / Job Search OS / any repo; it adds the same `wiki/`
  alongside what's already there.

This scaffolds the [Karpathy LLM-Wiki pattern](https://www.news.aakashg.com/p/pm-karpathy-second-brain)
as a curated, sit-down knowledge base. It's the right approach when the work is **deliberate and
bounded** (next-quarter planning, a competitive teardown), where you choose the inputs and want deep
synthesis you'll read like a document. It is not ambient operating memory. You feed it by hand.

## What to build

Create, in the current folder (it can be empty — this is self-contained):

```
wiki/
├── raw/         ← source docs you drop in. Append-only: never edit, rename, or delete a file once cited.
├── pages/       ← compiled, source-derived pages. The model regenerates these from raw/.
├── synthesis/   ← filed-back answers (model-owned, durable). Compile never regenerates these.
├── index.md     ← one-line catalog of every page, by category. Fully regenerated on every compile.
└── AGENTS.md    ← the operating rules below.
```

Make sure your agent loads `wiki/AGENTS.md` whenever it touches the wiki:
- **Standalone:** the `wiki/` folder is your whole project, so put the rules in `wiki/AGENTS.md` and, if
  your agent reads a root instruction file (Claude Code's `CLAUDE.md`, or your tool's equivalent), add
  one line — `See @wiki/AGENTS.md for wiki operating rules.` — so they load every session.
- **On an OS:** add that same `See @wiki/AGENTS.md …` line to the repo-root instruction file (a nested
  instruction file is only read once the agent already looks in `wiki/`).

## The operating rules (write these into wiki/AGENTS.md)

**Naming (so links and citations resolve deterministically):**

- Every `raw/` file is named `<YYYY-MM-DD>-<slug>.md` (e.g. `2026-05-29-acme-pricing-interview.md`).
  `raw/` is append-only — to correct a fact, drop a *new* dated source; never edit or rename an
  existing one (its citations would silently go wrong). Before adding a file: if an **identical
  document** already exists (same content — compare by checksum, e.g. `shasum`, not by filename), don't
  re-add it — reuse the existing citation. A byte-identical duplicate may be deleted **only if it has
  never been cited**; if any page already cites it, never delete it — instead, on the next compile,
  re-point every `[Source:]` tag to the canonical (earliest-dated) copy, then delete only copies that
  are now uncited. (Compile may likewise re-point `[Source:]` tags inside `synthesis/` bodies when a
  cited `raw/` file was deleted or canonicalized away — and must never delete a `raw/` file any
  `synthesis/` page still cites.) If only the *name* clashes (different content), suffix the **new**
  incoming file with the smallest free integer (`-2`, `-3`, …); never rename the file already in
  `raw/`, so existing citations stay valid. The suffix is a disambiguator, not part of any entity slug.
  Treat any other change to an existing `raw/` filename as an error to surface. A `raw/` file's **date
  is exactly its leading `YYYY-MM-DD`** (first 10 chars); everything after is ignored for dates; compare
  any `-N` disambiguator by its **integer value** (`-2` < `-10`), never as a string. If two files ever
  share a checksum, the canonical one is the **earliest leading date**, ties broken by **shortest
  filename then codepoint order**, and the un-suffixed name (no trailing `-N`/`-copy`/`-final`) always
  wins — so the clean original is kept, not a junk-named duplicate. It is canonical for citation and
  `source_count`; the rest are surfaced as a Lint error (and deleted only once nothing cites them, per
  the rule above). (`last_updated` is defined once, below.)
- **Slug algorithm** (a page's filename stem, its `[[link]]` target, and its slug are the *same*
  string), in this exact order: (1) lowercase; (2) expand the ligatures NFKD won't decompose —
  `ß`→`ss`, `æ`→`ae`, `œ`→`oe`, `ø`→`o`, `þ`→`th`, `ð`→`d`; (3) normalize Unicode to NFKD and drop
  combining marks (`é`→`e`, `ü`→`u`); (4) replace every run of characters not in `[a-z0-9]` with a
  single hyphen; (5) trim leading/trailing hyphens; (6) cap to ~50 chars **then re-run step 5** (so a
  mid-word cut never leaves a trailing hyphen — trim is always the final operation). Exact expected
  outputs (self-check against these): "Acme Pricing"→`acme-pricing`; `Café`→`cafe`; `Straße`→`strasse`;
  `AT&T`→`at-t`; `Acme/Pro+`→`acme-pro`; "Q1 '26 OKRs"→`q1-26-okrs`. So "Acme Pricing" →
  `pages/acme-pricing.md` → `[[acme-pricing]]`. A `-N` **disambiguator** is *only* a trailing `-<int>`
  appended at drop-time to resolve a clash; a `-<int>` that is part of the title-derived stem (`section-8`,
  `q1-26-okrs`) is not one and is never treated as a tiebreak suffix.
- **One flat slug namespace** across `pages/` *and* `synthesis/`: a slug is unique across **both** dirs.
  Before creating a page, `grep` *both* dirs. If a page for the **same entity** already exists, reuse
  its slug — never create a near-duplicate. If two **distinct** entities slug-collide (e.g. two "Acme"
  products), **disambiguate the titles, not the slugs** — re-slug each from a fuller title so every link
  target stays reproducible from a title (`Acme Pro (tier)`→`acme-pro-tier`, `Acme Pro Plus`→
  `acme-pro-plus`). Never use a bare integer suffix (`acme-2`) for a distinct entity — no title maps to
  it, so cross-links silently resolve to the wrong page. (Bare `-N` is reserved for byte-identical
  `raw/` filename clashes only.) If the ~50-char cap makes two distinct entities collide, keep the
  shortest prefix that stays unique; only if no title-derived form can separate them, append `-2`/`-3`
  as a last resort and note it in Lint. **Keep the incumbent** (earliest-created page) on its current
  slug and re-slug only the newcomer, so inbound links never move; if disambiguation ever forces an
  existing page to be re-slugged, in the **same compile** rewrite every inbound `[[oldslug]]` across
  `pages/` + `synthesis/` to the new slug — this link rewrite is the **one exception** to verbatim
  carry-forward (rewrite even inside `[!CONFLICT]`/`[!RESOLVED]`/`(was …)` blocks; `[Source:]` tags and
  prose are otherwise untouched). If a filed-back answer would collide with an existing slug, file it as
  `<slug>-synthesis` (and if *that* is taken, append the smallest free integer).
- A **stub** (a placeholder page created so a `[[link]]` resolves) has `source_count: 0`, **omits**
  `created`/`last_updated` (both are source-derived; a stub has no source), **inherits the `category` of
  the earliest-created page that links to it**, and is indexed with the literal one-liner
  `(stub — pending source)`. A stub must become a real sourced page or be removed before the next
  compile; Lint flags any `source_count: 0` page that survives a second compile.

**Pages and links:**

- Frontmatter required **for sourced pages**: `title`, `category`, `created`, `last_updated`,
  `source_count`, plus a one-paragraph summary (a stub omits the dates — see the stub rule above).
  `category` (the page's topic) is one of `research`, `competitive`, `decision`, `stakeholder` — it is a
  **different axis** from the `[FACT]/[DECISION]/[HYPOTHESIS]` claim tags (claim maturity): promoting a
  claim never changes a page's category, and any category may hold any tag. `source_count` = the number
  of **distinct documents** cited (distinct `raw/` checksums, so two identical re-drops count once — not
  each `[Source:]` tag, not each filename).
- Dates are **source-derived**, never wall-clock: `last_updated` = the newest date among the page's
  cited `raw/` filenames; `created` = `min(existing created, oldest cited date)` — recomputed this way
  so a canonical re-point to an earlier copy can never leave `created` later than `last_updated`. (This
  is what lets a re-compile stay byte-identical.)
- Every factual claim cites its source inline: `[Source: raw/<filename>.md]`.
- Cross-link aggressively with `[[page-name]]`. The links are as valuable as the pages. A `[[link]]`
  is exactly `[[` + a slug matching `[a-z0-9-]+` + `]]` (Lint matches `grep -oE '\[\[[a-z0-9-]+\]\]'`
  and ignores any `[[…]]` with other characters). A slug resolves to `pages/<slug>.md` **or**
  `synthesis/<slug>.md` (the namespace is flat across both — drill into whichever directory holds it). A
  `[[link]]` may only target a slug that **exists** (or a one-line stub page you create in the same
  compile). Never leave a dangling link; write plain text + a `TODO` if no page is warranted.
- *Lifecycle (the free-tier version):* tag every claim `[FACT]` (established, no longer in question),
  `[DECISION]` (a choice made), or `[HYPOTHESIS]` (an untested bet). Two transitions, both operator
  judgment carried forward verbatim by compile: when a later source **decides** a prior `[HYPOTHESIS]`,
  promote to `[DECISION]` and append `(was [HYPOTHESIS] as of <date> [Source: raw/<bet>.md])`; when a
  later source **reverses** a `[DECISION]`, keep it and append `(reversed <date> [Source: raw/<x>.md])`;
  when a later source disproves — or you abandon — a `[HYPOTHESIS]`, retag it `[ABANDONED]` and append
  `(abandoned <date> [Source: raw/<x>.md]` or `— no further evidence)`. Cite both the prior and the
  deciding/reversing/abandoning source. (If the two cited sources share a date, they're **concurrent** —
  write "same date; concurrent" and don't auto-promote/reverse; you resolve it.)

**Contradictions:** when a new source contradicts a page, flag inline under the relevant heading with a
fixed, greppable marker — never silently overwrite:

```
> [!CONFLICT] <claim A> [Source: raw/a.md] vs <claim B> [Source: raw/b.md] — note which source is newer (or "same date; concurrent").
```

Tag the contradicted claim line itself with `[!SEE-CONFLICT]` so a top-down reader can't read the stale
value without seeing there's a dispute, and have the `[!RESOLVED]` note state **which cited claim is now
current**.

A `[!CONFLICT]` is **resolved iff its next non-blank line is a `> [!RESOLVED YYYY-MM-DD] …` blockquote**
(blank lines between them are fine — adjacency is by content, not physical line, so idiomatic Markdown
spacing doesn't re-flag it). To resolve, keep both cited claims and add that note. These
`[!CONFLICT]` / `[!RESOLVED]` blocks — and the
`(was [HYPOTHESIS] …)` promotion clause above — are **operator judgment, not source-derived**, so
compile carries them forward verbatim (see Compile). Never delete the originals.

## The workflow

1. **Curate.** Drop a *selected* set of date-named sources into `raw/`. Quality over volume. This is
   the point.
2. **Compile.** "Read everything in `raw/`, rebuild `pages/`, regenerate the index." One source can
   touch many pages. **Compile is idempotent for the structured, source-derived body:** re-running on
   unchanged `raw/` produces `pages/` and `index.md` that are byte-identical **except the one-paragraph
   summary and its index one-liner**, which are model prose and may be rephrased. **Before** rebuilding
   a `pages/` file, harvest from its current body every `[!CONFLICT]`/`[!RESOLVED]` block and every
   `(was [HYPOTHESIS] …)`/`(reversed …)` clause; rebuild the source-derived body from `raw/`, then
   re-emit the harvested operator-judgment blocks **verbatim** (this is how "regenerate in full" and
   "carry forward verbatim" coexist). Compile likewise never regenerates the **body** of any
   `synthesis/` file. But compile **does** include
   `synthesis/` files in the index — so a newly filed-back page gets indexed while its body is never
   rewritten. `index.md` is **fully regenerated** every compile: one line per page (every file in
   `pages/` **and** `synthesis/`), grouped by `category`, as `- [[page-name]] — <one-line summary>`. The
   index summary is **plain text — no `[[links]]`** (so cross-linking aggressively in pages never bloats
   the index). Two invariants after compiling: (a) **no slug stem appears twice** across `pages/` +
   `synthesis/` (error and stop if it does — an unresolved collision); (b) the set of **leading** bullet
   links in the index (the first `[[slug]]` on each line — `grep -oE '^- \[\[[a-z0-9-]+\]\]'`) exactly
   equals the set of files in `pages/` + `synthesis/`.
3. **Query.** The index is read first on every query, then drill into the linked page — in `pages/` or
   `synthesis/` (flat namespace) — following `[[links]]`. When an answer is worth keeping, file it back
   as a new page **in `synthesis/`**, citing the underlying `raw/` files it rests on (not the pages it
   summarized); if it rests on no `raw/` source, don't file it. Set its `category` so the next compile
   groups it correctly — into the flat `index.md` `## <category>` section, or into `index/<category>.md`
   if you've already split (you never hand-place it; compile regenerates the index). Filing back is
   **not done until you re-run Compile in the same turn** so the index picks up the new page — an index
   missing any `pages/`/`synthesis/` file is a broken state. Don't hand-edit the index.
4. **Lint** (occasionally). "Check for: malformed `raw/` filenames (any `raw/*.md` whose first 10 chars
   don't parse as `YYYY-MM-DD` — quarantine it rather than derive a garbage date), **open** contradictions
   (a `[!CONFLICT]` whose next non-blank line is **not** a `[!RESOLVED …]` blockquote — resolved blocks
   are carried forward, never flagged), dead
   citations (a `[Source: raw/X.md]` whose file is missing), dangling `[[links]]`, orphan pages (a file
   absent from the index), duplicate slug stems, unresolved stubs (`source_count: 0` surviving a second
   compile), stale claims (a `[HYPOTHESIS]` whose newest cited `raw/` date is more than ~90 days older
   than the wiki's most recent source — flag for resolve/abandon), and per-index size — warn when any
   single index file (root `index.md`, or any `index/<category>.md`) passes ~80 page-lines. Also warn
   past ~75 `raw/` sources (curation discipline)." The dangling/orphan checks run over `pages/` +
   `synthesis/` only; `index.md`, `wiki/index/*.md`, and `wiki/AGENTS.md` are infrastructure and exempt.

## Honest limits (why this is the free version)

- You curate by hand. It does not capture as you work, so it goes stale as day-to-day memory.
- The single flat index caps out around ~80 page-lines (what overflows is *page* count, not source
  count). At that point, split into one `wiki/index/<category>.md` per category present; the root
  `index.md` becomes a table of contents that links them with **plain relative markdown links** —
  `- [competitive](index/competitive.md)`, *not* `[[wiki-links]]`. **After splitting, the union of
  `wiki/index/*.md` is "the index" everywhere** — the compile links==files invariant and the query
  read-first step apply to that union, and the ~80-line warn applies **per index file**, never to the
  union. (The root `index.md` and `wiki/index/*.md` are infrastructure, exempt from the orphan/dangling
  checks per Lint.) Category-splitting only helps when pages spread across categories — if a single
  category still exceeds ~80 lines, sub-bucket by the page's `last_updated` **quarter**
  (`index/competitive-2026-q1.md`, recomputed every compile); if a quarter *still* overflows, fall back
  to month, then to an alphabetical split (`index/<cat>-a-m.md` / `-n-z.md`) — any deterministic
  partition that keeps each file under ~80. Around ~100 sources you hit the free version's ceiling: keep
  `pages/` + `synthesis/` as your readable layer, index `raw/` in an external full-text tool (ripgrep +
  tags, or a vector store), and stop generating *new* pages from `raw/`. You may still file back to
  `synthesis/` and run an **index-only** compile (regenerate the index without rebuilding pages). That
  crossover is the paid layer's job.
- Lifecycle is convention, not enforcement. The `[HYPOTHESIS]/[DECISION]/[FACT]` tags and the
  promotion rule above are the minimum; nothing *guarantees* a bet stays labeled a bet.

For memory that captures as you work, enforces sourcing at write time, and consolidates at session end,
that's the paid Claude Code Memory Layer (a different tool for a different job).

## Credits & go deeper

This recipe adapts the pattern for a PM OS; it's plain markdown with no dependency, not a fork. The
sources worth reading:

- **Andrej Karpathy's LLM Wiki** — the canonical source is his
  [`llm-wiki` gist](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f) (a spec you can
  paste into an agent), which he published in April 2026. (There's no Karpathy *repo* — community
  reimplementations exist, but the gist is the primary source.) See also the
  [PM walkthrough](https://www.news.aakashg.com/p/pm-karpathy-second-brain).
- **The closest open-source code** in this lineage is Pawel Huryn's
  [PM Brain](https://github.com/phuryn/pm-brain).

*These patterns evolve — a gist can be updated in place, so check Karpathy's for the latest revision.
This recipe stays self-contained on purpose: it does not fetch or auto-follow anything at run time, so
what you scaffold is reproducible. To refresh it, re-read the sources and reconcile the changes by hand.*
Displaying add-a-karpathy-wiki-to-your-os.md.
