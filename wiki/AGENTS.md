# Wiki Operating Rules

Load this file whenever you touch anything in `wiki/`.

---

## Directory Layout

```
wiki/
├── raw/         ← source docs you drop in. Append-only: never edit, rename, or delete a file once cited.
├── pages/       ← compiled, source-derived pages. Regenerated from raw/ on every compile.
├── synthesis/   ← filed-back answers (model-owned, durable). Compile never regenerates bodies here.
├── index.md     ← one-line catalog of every page, by category. Fully regenerated on every compile.
└── AGENTS.md    ← this file.
```

---

## Naming Rules

### raw/ files

- Format: `<YYYY-MM-DD>-<slug>.md` (e.g. `2026-05-29-acme-pricing-interview.md`)
- Append-only: never edit, rename, or delete a file once cited.
- To correct a fact: drop a *new* dated source.
- Before adding: if an identical document already exists (same checksum), reuse the existing citation — do not re-add.
- A byte-identical duplicate may be deleted **only if it has never been cited**; if cited, re-point every `[Source:]` tag to the canonical (earliest-dated) copy, then delete only uncited copies.
- Name clash (different content): suffix the **new** incoming file with the smallest free integer (`-2`, `-3`, …). Never rename the file already in `raw/`.
- A file's **date** is exactly its leading `YYYY-MM-DD` (first 10 chars). Compare `-N` disambiguators by integer value (`-2` < `-10`), never as a string.
- Canonical copy = earliest leading date; ties → shortest filename then codepoint order; un-suffixed name wins over `-N`/`-copy`/`-final`.
- A malformed filename (first 10 chars don't parse as `YYYY-MM-DD`) → quarantine rather than derive a garbage date. Flag in Lint.

### Slug algorithm

Apply in this exact order:
1. Lowercase
2. Expand ligatures: `ß`→`ss`, `æ`→`ae`, `œ`→`oe`, `ø`→`o`, `þ`→`th`, `ð`→`d`
3. Normalize Unicode NFKD, drop combining marks (`é`→`e`, `ü`→`u`)
4. Replace every run of `[^a-z0-9]` with a single hyphen
5. Trim leading/trailing hyphens
6. Cap to ~50 chars, then re-run step 5 (trim is always the final operation)

Expected outputs (self-check): `"Acme Pricing"`→`acme-pricing`; `Café`→`cafe`; `Straße`→`strasse`; `AT&T`→`at-t`; `Acme/Pro+`→`acme-pro`; `"Q1 '26 OKRs"`→`q1-26-okrs`

A page slug = its filename stem = its `[[link]]` target.

### Slug namespace

- One flat namespace across `pages/` **and** `synthesis/`.
- Before creating a page, grep both dirs. Same entity → reuse slug. Distinct entities that slug-collide → disambiguate the **titles**, not the slugs (re-slug each from a fuller title). Never use bare `-N` for a distinct entity.
- Bare `-N` suffix is reserved for byte-identical `raw/` filename clashes only.
- If disambiguation forces an existing page to be re-slugged, in the **same compile** rewrite every inbound `[[oldslug]]` across `pages/` + `synthesis/` to the new slug.
- If a filed-back answer would collide with an existing slug, file it as `<slug>-synthesis` (append smallest free integer if still taken).

### Stubs

A stub = a placeholder page created so a `[[link]]` resolves.
- `source_count: 0`
- Omits `created` and `last_updated`
- Inherits `category` of the earliest-created page that links to it
- Indexed with the literal one-liner `(stub — pending source)`
- Must become a real sourced page or be removed before the next compile. Lint flags any `source_count: 0` page surviving a second compile.

---

## Pages

### Frontmatter (sourced pages)

Required fields: `title`, `category`, `created`, `last_updated`, `source_count`, plus a one-paragraph summary.

```yaml
---
title: "Page Title"
category: research | competitive | decision | stakeholder
created: YYYY-MM-DD
last_updated: YYYY-MM-DD
source_count: N
---
```

- `category` is a **topic axis** — independent from `[FACT]/[DECISION]/[HYPOTHESIS]` claim tags.
- `source_count` = number of distinct `raw/` documents cited (by checksum, not filename count).
- `last_updated` = newest date among cited `raw/` filenames.
- `created` = `min(existing created, oldest cited date)`.

### Cross-links

- Cross-link aggressively with `[[page-name]]`.
- A `[[link]]` = `[[` + slug matching `[a-z0-9-]+` + `]]` only.
- Resolves to `pages/<slug>.md` or `synthesis/<slug>.md` (flat namespace).
- May only target a slug that exists or a stub you create in the same compile.
- Never leave a dangling link; write plain text + `TODO` if no page is warranted.

### Claim tags and lifecycle

Tag every claim: `[FACT]`, `[DECISION]`, or `[HYPOTHESIS]`.

Transitions (operator judgment, carried forward verbatim by compile):
- `[HYPOTHESIS]` → source decides it → `[DECISION]`: append `(was [HYPOTHESIS] as of <date> [Source: raw/<bet>.md])`
- `[DECISION]` reversed by later source: keep and append `(reversed <date> [Source: raw/<x>.md])`
- `[HYPOTHESIS]` disproved or abandoned → `[ABANDONED]`: append `(abandoned <date> [Source: raw/<x>.md]` or `— no further evidence)`
- If two cited sources share a date: write "same date; concurrent" — do not auto-promote/reverse.

### Contradictions

When a new source contradicts a page, flag inline — never silently overwrite:

```
> [!CONFLICT] <claim A> [Source: raw/a.md] vs <claim B> [Source: raw/b.md] — note which is newer (or "same date; concurrent").
```

Tag the contradicted claim with `[!SEE-CONFLICT]`.

A `[!CONFLICT]` is **resolved** iff its next non-blank line is:
```
> [!RESOLVED YYYY-MM-DD] …
```

To resolve: keep both cited claims, add the resolution note. These blocks are operator judgment — compile carries them forward verbatim and never deletes them.

---

## Workflow

### 1. Curate
Drop selected, date-named sources into `raw/`. Quality over volume.

### 2. Compile
Trigger: "Read everything in `raw/`, rebuild `pages/`, regenerate the index."

- One source can touch many pages.
- Idempotent for structured, source-derived body: re-running on unchanged `raw/` produces byte-identical `pages/` and `index.md` **except** the one-paragraph summary and its index one-liner (model prose, may be rephrased).
- Before rebuilding a `pages/` file: harvest every `[!CONFLICT]/[!RESOLVED]` block and `(was [HYPOTHESIS] …)`/`(reversed …)` clause → rebuild source-derived body from `raw/` → re-emit harvested blocks **verbatim**.
- Never regenerate the **body** of any `synthesis/` file.
- **Does** include `synthesis/` files in the index.
- `index.md` is **fully regenerated** every compile: one line per page in `pages/` and `synthesis/`, grouped by `category`:
  ```
  ## <category>
  - [[page-slug]] — <one-line plain-text summary>
  ```
  Index summaries are plain text — no `[[links]]`.

Post-compile invariants:
- (a) No slug stem appears twice across `pages/` + `synthesis/` — error and stop if it does.
- (b) The set of leading bullet links in the index exactly equals the set of files in `pages/` + `synthesis/`.

### 3. Query
- Read `index.md` first on every query, then drill into linked pages following `[[links]]`.
- When an answer is worth keeping, file it back as a new page in `synthesis/`, citing the underlying `raw/` files (not the pages).
- Do not file back if it rests on no `raw/` source.
- Set `category` in frontmatter.
- **Re-run Compile in the same turn** so the index picks up the new page. An index missing any `pages/`/`synthesis/` file is a broken state.

### 4. Lint (occasionally)
Check for:
- Malformed `raw/` filenames (first 10 chars don't parse as `YYYY-MM-DD`) → quarantine
- Open contradictions (`[!CONFLICT]` whose next non-blank line is not `[!RESOLVED …]`)
- Dead citations (`[Source: raw/X.md]` whose file is missing)
- Dangling `[[links]]`
- Orphan pages (file absent from index)
- Duplicate slug stems
- Unresolved stubs (`source_count: 0` surviving a second compile)
- Stale claims (`[HYPOTHESIS]` whose newest cited `raw/` date is >~90 days older than the wiki's most recent source)
- Index size: warn when any single index file passes ~80 page-lines
- Source volume: warn past ~75 `raw/` sources

Dangling/orphan checks run over `pages/` + `synthesis/` only. `index.md`, `wiki/index/*.md`, and `wiki/AGENTS.md` are infrastructure and exempt.

---

## Index Splitting (when index.md exceeds ~80 lines)

Split into `wiki/index/<category>.md` per category. Root `index.md` becomes a table of contents:
```markdown
- [competitive](index/competitive.md)
- [research](index/research.md)
```
Use plain relative links — **not** `[[wiki-links]]`.

After splitting, the union of `wiki/index/*.md` is "the index" everywhere. The ~80-line warn applies **per index file**, never to the union.

If a single category still exceeds ~80 lines: sub-bucket by `last_updated` **quarter** (`index/competitive-2026-q1.md`); if still overflows → month → alphabetical split (`index/<cat>-a-m.md` / `-n-z.md`).

---

## Scale Limits

- ~80 page-lines per index file: split (see above).
- ~75 `raw/` sources: curation discipline ceiling. Past ~100: stop generating new pages from `raw/`; index in an external full-text tool; you may still file back to `synthesis/` and run index-only compiles.
