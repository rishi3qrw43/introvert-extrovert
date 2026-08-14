# Zenodo publication plan — step by step from the JEI manuscript

## Do we need GitHub?

**Not required.** You can upload a .zip of code directly to a Zenodo record.

**But yes, use it.** Your paper argues that other people's accuracy numbers are inflated by preprocessing choices. A paper making that argument without public, runnable code undercuts itself. GitHub also gives you version control while you work, and Zenodo can link to a repo so that tagging a release automatically archives it and mints a DOI for the code.

Recommended setup: **two Zenodo records.**
1. The paper → resource type **Publication → Preprint**
2. The code → resource type **Software**, cross-linked to the paper's DOI

Zenodo's own docs endorse this split when both the data/code and the publication are significant contributions in their own right.

---

# PHASE 1 — Finish the analysis (write the code first)

### Step 1. One script, one seed, runs end to end
Everything in a single reproducible file (or a small numbered set). No notebook-only work — a reader must be able to run it and get your exact numbers. Fixed `random_state=42` throughout.

Write it in this order, because each part feeds the next:

**1a. Load and clean** — Kaggle + MIES. Document every cleaning decision in comments. Do NOT mean-impute (that's the thing you're criticizing); use models that handle missing values natively, or drop and report.

**1b. Redundancy metrics** *(done)* — mean inter-item correlation, PC1 variance, factor count. Kaggle 0.784 / 81.7% / 1 factor. MIES 0.213 / 23.2% / 16 factors. BIG5-E 0.454 / 51.1% / 1 factor.

**1c. Ablation** *(done for both)* — retrain on top-k features, find how few are needed for 95% of full performance. Kaggle: 1 item. MIES: 2 items.

**1d. Leakage experiments** — the two that matter:
- Duplicate-overlap: count test rows that also appear in training *(done: 94.6%, inflates RF .910 → .968)*
- Resampling order: SMOTE inside the CV loop vs. applied to the whole dataset first. Use `imblearn.pipeline.Pipeline` for the correct version. **Still to run.**

**1e. Ranking stability** — SHAP importance from XGBoost vs. random forest, plus across bootstrap samples. Report rank correlation, not a single "true" ranking. Partly done (Kaggle: Spearman ≈ 0.00); needs the bootstrap dimension and MIES.

**1f. Repeated cross-validation + McNemar** — replace every single-split number with mean ± 95% CI. McNemar to test whether your four models actually differ.

### Step 2. Decide how to handle the task-definition finding
Verified tonight: MIES run as 3 classes gives 73.9% (So reported 73.81%, Fieri 73.5%; So's stated no-information rate 61.51% vs. our 61.48%). Run as 2 classes it gives 93.2%, versus your 92.2%.

This means the apparent 74%-vs-92% literature gap is a task-definition artifact. It's reproducible and it will be visible to anyone who downloads MIES. **Decide deliberately whether this becomes a finding in the paper or gets left out** — but leaving it out while building the paper on the gap it explains is not a stable position.

### Step 3. Figures
Publication quality, 300 dpi, readable at print size, captions that stand alone. Candidates: redundancy comparison across datasets, ablation curves overlaid, leakage experiment bar chart, ranking-stability plot.

### Step 4. Verification pass
Re-run the script clean from scratch. Every number in the paper must match the script's output exactly. Check every citation resolves.

---

# PHASE 2 — Write the paper

### Step 5. Start from the JEI manuscript
Keep: structure, your group-comparison results (they reproduced exactly), Introduction framing, your citations.
Cut: the "Creating the Synthetic Dataset" methods subsection and the 17,394-row column in Table 1.
Fix: the Discussion claim that "drained" was a top behavior.
Add: redundancy, ablation, leakage, ranking-stability sections.

### Step 6. Section order
Title / Authors / Affiliation / Abstract / Keywords → Introduction → Related Work (So 2020, Fieri 2023 — new section, JEI didn't have one) → Methods → Results → Discussion → Limitations → Data and Code Availability (**required** — this is where the DOIs go) → References

### Step 7. Format
No Zenodo template exists. Use a clean, conventional layout:
- Single column, 11pt, 1-inch margins, numbered sections
- Numbered figures and tables with captions
- Consistent citation style (IEEE numeric fits this literature — it's what So used)
- Export to **PDF/A** if your tool supports it (better for archival)
- Put the reserved DOI on the title page (see Step 12)

### Step 8. References
Everything currently in `references.md`, with the unverified entries either confirmed or dropped.

---

# PHASE 3 — Prepare the repository

### Step 9. Repo structure
```
introvert-extrovert-analysis/
├── README.md
├── LICENSE
├── requirements.txt
├── CITATION.cff
├── data/
│   └── README.md        (download instructions + links, NOT the data itself)
├── src/
│   └── analysis.py
└── figures/
```

### Step 10. Key files
- **README.md** — what the paper does, how to reproduce, expected runtime, exact package versions, one-line install and run commands
- **requirements.txt** — pinned versions (`pandas==x.y.z`), since results can shift between library versions
- **LICENSE** — MIT or Apache-2.0 for code
- **CITATION.cff** — GitHub renders a "Cite this repository" button from it
- **data/README.md** — link to the Kaggle and MIES sources rather than redistributing. Check each dataset's license before including any raw data (Kaggle set is CC BY-SA 4.0, which has share-alike obligations)

### Step 11. Clean-run test
Fresh virtual environment, install from requirements.txt, run the script, confirm the numbers match the paper. This is the step most people skip and it's the one that matters.

---

# PHASE 4 — Zenodo submission

### Step 12. Before uploading
- Create a Zenodo account, and get an **ORCID** (free, orcid.org) — it permanently links the paper to you, which matters for a first publication
- **Reserve the DOI first:** in the upload form, answer "No" to "Do you already have a DOI?", click **Get a DOI now!**, then paste that DOI onto your title page and re-export the PDF. This way the paper contains its own DOI.

### Step 13. Metadata (the actual "Zenodo formatting")
| Field | What to put |
|---|---|
| Resource type | **Publication → Preprint** |
| Title | Final paper title |
| Publication date | Upload date |
| Creators | Rishi Vora (+ ORCID), Dipa Vora; affiliation Northside College Prep |
| Description | Your abstract, as plain text |
| License | **CC BY 4.0** for the paper |
| Keywords | introversion, extraversion, personality classification, machine learning, data leakage, interpretability, SHAP, reproducibility |
| Contributors | Anyone who advised but isn't an author (mentors) |
| Related identifiers | Link to the code record's DOI, and cite the datasets |

### Step 14. Second record for the code
Same process, resource type **Software**, license MIT/Apache-2.0, and set a related identifier pointing at the paper's DOI so the two are linked in both directions.

### Step 15. Publish
Publishing is **permanent** — records cannot be deleted, only new versions added. Proofread before clicking. Zenodo does support versioning, so a v2 later is fine and keeps a stable parent DOI.

---

## Looking at other papers for reference
Browse zenodo.org, filter by resource type = Preprint, search "machine learning personality" or "data leakage". Useful things to note from good examples: how long the abstract runs, whether they include a Data/Code Availability section, how they handle author affiliations without an institution, and how the metadata description is written. Also worth looking at So (2020) on arXiv as a structural model — it's short, four pages, and covers exactly this kind of analysis.

## Realistic sequencing to Nov 1
- **August:** finish analysis (Phase 1), decide the task-definition question
- **Early September:** honest checkpoint — is this preprint-worthy?
- **September:** write the paper (Phase 2)
- **Early October:** build and test the repo (Phase 3)
- **Mid-October:** upload, get feedback from Anna and Sasha on the near-final draft
- **Late October:** publish both records

Buffer built in deliberately.
