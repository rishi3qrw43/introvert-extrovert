# Work log — everything done, and why

Covers the session from the Zenodo/GitHub decision onward.

---

## SETUP

**Decided: publish to Zenodo eventually, GitHub now, no DOI yet, nothing public.**
Zenodo has no paper template — it's a repository, not a journal. What it needs is metadata
(title, creators, description, licence, keywords), not a specific format. Checklist saved at
the bottom of `docs/references.md` for later.

**Built the project folder at `~/Documents/introvert-extrovert`.**
Before this, files lived in a temporary session folder with an unusable path. Now there's one
real folder that persists, opens in VS Code, and works with git.

**Set up git locally — 4 commits so far, nothing pushed until you published.**
Data files excluded via `.gitignore`. The README tells anyone how to download them instead.

**Pinned package versions in `requirements.txt`.**
Why it mattered: our Random Forest numbers on MIES differed by 0.002 because of different
scikit-learn versions. Pinning means anyone reproducing gets your exact numbers.

---

## PART 1 — FIX THE DATA · `src/prep.py`

**What it does:** loads both datasets, converts Yes/No to 1/0, converts personality labels to
0/1, marks skipped MIES questions as missing rather than treating a zero as a real answer.

**What was removed:** the block that copied rows to inflate the dataset. That was the source of
the old 96.8% figure.

**Why it matters:** every later result depends on this file. One loading function, used
everywhere, so no analysis can quietly use differently-cleaned data.

**Achieved:** clean starting point, no inflation, one MIES switch (`classes=2` or `classes=3`).

---

## PART 2 — BASELINE MODELS · `src/models.py`

**What it does:** splits 80/20 stratified with a fixed seed, trains three models, reports
accuracy and balanced accuracy, writes `baseline_results.csv`.

**Three models:** Random Forest, Logistic Regression, Gradient Boosting.

**Key design choice — pipelines.** Every preprocessing step (filling missing values, scaling)
runs *inside* a pipeline, so it only ever learns from training rows. Scaling the whole dataset
first would let test information bleed backwards into training. Same category of error the
paper is about, so the code shouldn't commit it.

**Result:**

| Dataset | Model | Accuracy | Balanced acc. |
|---|---|---|---|
| Kaggle | Random Forest | .9103 | .9105 |
| Kaggle | Logistic Regression | .9121 | .9120 |
| Kaggle | XGBoost | .9207 | .9210 |
| MIES (2 class) | Random Forest | .9184 | .8346 |
| MIES (2 class) | Logistic Regression | .9203 | .8474 |
| MIES (2 class) | XGBoost | .9157 | .8426 |
| MIES (3 class) | Random Forest | .7362 | .6177 |
| MIES (3 class) | Logistic Regression | .7341 | .6330 |
| MIES (3 class) | XGBoost | .7278 | .6249 |

**Achieved — Finding 1.** The 3-class rows land on So's published 73.81% and Fieri's 73.5%.
The 2-class rows land on the Kaggle numbers. So the 19-point "gap" in the literature is
entirely about whether ambiverts are included. A second check: So reports a no-information rate
of 61.51%; our 3-class MIES gives 61.48%.

**Also learned:** balanced accuracy matters on MIES. It's 4,404 introverts to 990 extraverts,
so a model that always guesses "introvert" scores 81.6% while learning nothing. Balanced
accuracy scores each class separately and averages, so that lazy model would get 50%.

**Along the way:** XGBoost initially failed on macOS (missing OpenMP). Fixed with
`brew install libomp`. XGBoost handles missing values natively, so it needs no imputer.

---

## PART 3 — REDUNDANCY · `src/redundancy.py`

Three tests, one question: are the seven behaviours measuring seven things or one thing?

**Test 1 — SHAP importance per model.** All three models rank stage fear first on Kaggle. On
MIES, Random Forest picks Q91A while the other two pick Q82A.

**Test 2 — remove only the top question.**

| Dataset | Model | Full | Without top | Drop |
|---|---|---|---|---|
| Kaggle | Random Forest | .9105 | .9052 | .0052 |
| Kaggle | Logistic Regression | .9120 | .9138 | **−.0018** |
| Kaggle | XGBoost | .9210 | .9245 | **+.0035** |
| MIES | Random Forest | .6177 | .6060 | .0116 |

Delete the most important question and nothing happens. Gradient Boosting loses exactly zero;
Logistic Regression gets slightly better. Everything stage fear measures already exists in the
other six.

**Test 3 — ablation curve.** Drop the lowest-ranked question, retrain, repeat.
`figures/ablation_kaggle.pdf` is flat from seven questions down to two.
`figures/ablation_mies.pdf` climbs steeply and only settles around fifteen.

**Achieved — Finding 2.** Seven behaviours carry about one question's worth of information.
Anyone using this dataset to ask which behaviour matters most gets an arbitrary answer.

---

## DATASET STATISTICS · `src/dataset_stats.py`

**What it does:** measures how much each pair of questions overlaps, within each dataset.

| Dataset | Items | Mean correlation | Min | Max |
|---|---|---|---|---|
| Kaggle | 7 | **0.784** | 0.69 | 0.957 |
| MIES | 91 | 0.196 | 0.00 | 0.823 |
| BIG5 extraversion | 10 | 0.454 | 0.32 | 0.631 |

**The strongest single number:** Kaggle's *least* related pair of questions (0.69) is more
correlated than BIG5's *most* related pair (0.631) — and BIG5's scale was purpose-built to ask
one thing ten different ways.

**Removed:** PCA and factor counts. Too complicated for what they added; correlation says the
same thing more clearly.

---

## LEAKAGE · `src/leakage.py`

**What it does:** measures what share of test rows the model already saw in training, under
three conditions.

| Condition | Rows | Test rows already seen | RF | Logistic | Gradient Boosting |
|---|---|---|---|---|---|
| Original file | 2,900 | **27.9%** | .9103 | .9121 | .9207 |
| Duplicated before split | 17,400 | **94.4%** | **.9658** | .9141 | .9307 |
| De-duplicated | 2,414 | 0% | .9358 | .9441 | .9420 |

**Two things worth knowing:**

The inflation is mostly Random Forest — 5.5 points, versus 0.2 for logistic regression. A
logistic regression has seven coefficients and physically cannot store individual rows. A
random forest with a hundred deep trees can carve out a region around one row and memorise its
answer. So the size of a leakage effect depends on which model you use.

The original file already leaks 27.9%, because it contains 486 duplicate rows out of 2,900.
That's not something you introduced.

**Decision:** de-duplicate before all analyses, and justify it in one Methods sentence rather
than making it a whole finding.

---

## THE AUDIT

A full check of everything above. It found four real problems:

1. **Numbers with no code behind them.** The correlation figures, the 94.6% overlap, and the
   de-duplicated accuracy were all cited in the findings sheet, but nothing in the repo produced
   them — they came from throwaway scripts since deleted. Fixed by writing `dataset_stats.py`
   and `leakage.py`. Every number now traces to a script you can run.
2. **Two wrong numbers.** MIES mean correlation was listed as 0.213 (actually 0.196) and PC1 as
   23.2% (actually 21.6%). The old figures came from the 2-class subset.
3. **The de-duplicated figure was wrong.** Listed as .8970, actually .9337. And the finding
   changed: leakage mainly affects Random Forest, and the original file already leaks.
4. **A stray reference in STATUS.md.** Rewritten as a version-pinning note.

Also removed dead code from `prep.py` and fixed the SHAP background-sampling warnings.

---

## THINGS THAT TURNED OUT WRONG — keep out of the paper

1. **"Importance rankings are unstable across models."** They're not. +0.39 to +0.79 on Kaggle,
   +0.46 to +0.75 on MIES. The earlier near-zero figure compared two different SHAP extraction
   methods — a mistake in the analysis code, not a property of the data.
2. **"The three models disagree on the top question."** On Kaggle all three say stage fear.
3. **"Redundancy drives accuracy."** The original hypothesis. Kaggle is nearly four times more
   redundant than MIES and gets the same 2-class accuracy. Falsified — state it plainly.

---

## WHERE THINGS STAND

**Done:** Parts 1, 2, 3, plus dataset statistics, leakage, and a full audit.

**Findings:** two solid ones (ambivert effect, redundancy), plus a one-line Methods note about
de-duplication.

**Not done:** Part 5 (repeated cross-validation, McNemar), Parts 6-7 (synthesis and writing).

**Open:** whether Part 4 happens at all. Cutting leakage entirely means cutting Part 4 and
dropping "duplicate records" from the research question.

**Files:**

```
src/prep.py            loading and cleaning
src/models.py          baseline models
src/redundancy.py      SHAP, ablation, leave-top-out
src/dataset_stats.py   question overlap per dataset
src/leakage.py         duplicate overlap and its effect
docs/findings.md       the findings, written for the paper
docs/references.md     annotated citations + Zenodo checklist
docs/worklog.md        this file
STATUS.md              current state and decisions
```
