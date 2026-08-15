# PROJECT HUB — read this first

Last updated: 14 Aug 2026

---

## THE QUESTION

How do task definition, repetitive questions, duplicate records, and data-preparation choices
affect the reported accuracy of introvert–extrovert models?

**The claim:** reported accuracies in this literature are not comparable across studies, because
papers differ silently in how they define the task and prepare the data. This paper measures how
much each choice moves the number.

---

## THE FILES

```
README.md              what this is, how to run it
STATUS.md              this file
requirements.txt       pinned package versions
src/prep.py            loads and cleans both datasets
src/models.py          baseline models
src/redundancy.py      SHAP, ablation curve, leave-top-item-out
src/dataset_stats.py   how much the questions overlap
src/leakage.py         duplicate rows and their effect
src/ordering.py        resampling and feature-selection order
docs/findings.md       the findings, written for the paper
docs/references.md     annotated citations + Zenodo checklist
docs/worklog.md        what was done and why
data/                  the datasets (not tracked by git)
figures/               ablation curves
```

**To run any script:** open Terminal in this folder, then e.g. `python3 src/models.py`

**Requires** `brew install libomp` on macOS for XGBoost. Versions are pinned in
requirements.txt; Random Forest on MIES shifts by ~0.002 under older scikit-learn.

---

## DONE — PARTS 1 THROUGH 4

**Part 1** — data cleaning, row-copying block removed, all preprocessing inside pipelines.

**Part 2** — baselines:

| Dataset | Random Forest | Logistic Regression | XGBoost |
|---|---|---|---|
| Kaggle | .9103 | .9121 | .9207 |
| MIES (2 class) | .9184 | .9203 | .9157 |
| MIES (3 class) | .7362 | .7341 | .7278 |

**Part 3** — redundancy. All three models rank stage fear first; removing it changes nothing.
Ablation curve flat from 7 questions to 2.

**Part 4** — ordering. SMOTE before splitting inflates MIES by 21 points; feature-selection
order does essentially nothing.

---

## THE FOUR DECISIONS

The paper is structured as four decisions a researcher makes, ranked by how much each moves the
reported accuracy. Full detail in `docs/findings.md`.

| Decision | Effect | Notes |
|---|---|---|
| Include ambiverts? | **~19 pts** | Reproduces So (73.81%) and Fieri (73.5%) exactly |
| When to resample? | **~21 pts** | Imbalanced data only; matches Fieri's 22-pt jump |
| De-duplicate rows? | ~5.5 pts | Raw file already leaks 27.9% |
| Which questions to keep? | **~0 pts** | Because they're near-copies of each other |

**Positioning:** Kapoor & Narayanan (2023) documented leakage across 294 papers in 17 fields
and built a taxonomy of 8 leakage types. Personality classification was not among them.

---

## NEXT — PART 5

Repeated cross-validation with confidence intervals for every result above, and McNemar's test
between models. Then Part 6 (synthesis) and Part 7 (writing).

Also outstanding: two figures — correlation heatmaps side by side, and a bar chart of the four
effects.

---

## DECIDED

- MIES three-class is primary; two-class reported once as a preprocessing condition
- Measurement paper, not a redundancy-causes-accuracy paper
- De-duplicate before all analyses, justified in one Methods sentence
- Models: Random Forest, Logistic Regression, XGBoost
- GitHub repo private until the paper is done

## STILL OPEN

1. Send Sasha a correction — his email carries the outdated "accuracy way below" claim
2. ~~Broader literature search~~ — done. Kapoor & Narayanan (2023) is the anchor citation.

---

## KEEP OUT OF THE PAPER

Three claims that turned out to be wrong:

1. "Importance rankings are unstable across models" — they're not, +0.50 to +0.82
2. "The models disagree on the top question" — all three say stage fear
3. "Redundancy drives accuracy" — the original hypothesis, falsified

---

## PAPER EXHIBITS PLANNED

**Tables:** baseline accuracy · question overlap per dataset · leave-top-item-out ·
preprocessing effects · comparison to published work

**Figures:** two correlation heatmaps side by side · ablation curves overlaid · preprocessing
effects bar chart
