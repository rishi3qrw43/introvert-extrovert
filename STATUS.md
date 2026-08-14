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

## THE FOUR FINDINGS

Full detail with tables in `docs/findings.md`.

1. **Ambiverts in or out swings accuracy ~19 points.** MIES three-class gives .73, two-class
   gives .92. Reproduces So (73.81%) and Fieri (73.5%) exactly.
2. **Seven questions carry one question's worth of information.** Mean overlap 0.784 versus
   0.196 for MIES. Deleting the top-ranked question *improves* two of three models.
3. **Duplicate rows inflate accuracy, and the raw file already has them.** 27.9% of test rows
   appear in training before anyone does anything; 486 duplicate rows out of 2,900.
4. **Resampling before splitting inflates MIES by 21 points.** Matches the 22-point jump Fieri
   reported. Requires class imbalance and a model that can memorise.

---

## PREPROCESSING EFFECTS MEASURED

| Choice | Effect | Where |
|---|---|---|
| Include vs. exclude ambiverts | ~19 pts | `models.py` |
| SMOTE before vs. inside folds | ~21 pts (MIES) | `ordering.py` |
| Duplicate rows before splitting | ~5.5 pts (RF) | `leakage.py` |
| Feature selection before vs. inside folds | ~0 pts | `ordering.py` |

---

## NEXT — PART 5

Repeated cross-validation with confidence intervals for every result above, and McNemar's test
between models. Then Part 6 (synthesis) and Part 7 (writing).

---

## DECIDED

- MIES three-class is primary; two-class reported once as a preprocessing condition
- Measurement paper, not a redundancy-causes-accuracy paper
- De-duplicate before all analyses, justified in one Methods sentence
- Models: Random Forest, Logistic Regression, XGBoost
- GitHub repo private until the paper is done

## STILL OPEN

1. Send Sasha a correction — his email carries the outdated "accuracy way below" claim
2. Broader literature search, per Anna — general ML already knows preprocessing matters; the
   contribution is measuring it for this specific task

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
