# PROJECT HUB — read this first

Last updated: 14 Aug 2026

---

## 1. WHERE EVERYTHING IS

Everything is in one folder on your computer. **Nothing is on GitHub yet.**

```
repo/                        <- the actual project (this becomes the GitHub repo)
  src/prep.py                loads + cleans both datasets
  src/models.py              Parts 1-2 of the plan, makes the baseline table
  data/                      the two data files (will NOT be uploaded to GitHub)
  figures/                   figures for the paper
  baseline_results.csv       output from models.py

docs/                        notes for you, NOT part of the repo
  references.md              citation list with access dates
  reference_tracker.md       literature search notes
  paper_analysis_Fieri2023.md  deep read of the Fieri paper
  zenodo_publication_plan.md   how to publish later (on hold)

ext/                         raw downloaded datasets (MIES, BIG5)
```

**How to run the code:** open a terminal in the `repo` folder and type `python src/models.py`. It must be run from `repo`, not from inside `src`.

---

## 2. WHAT'S DONE

**Part 1 — Fix the data.** Done. The row-copying block is gone. Data loads, encodes yes/no to 1/0, splits 80/20 stratified. Scaling happens inside a pipeline so it can't leak.

**Part 2 — Baseline models.** Done. Three models on three dataset versions:

| Dataset | Model | Accuracy | Balanced acc. |
|---|---|---|---|
| Kaggle | Random Forest | .910 | .911 |
| Kaggle | Logistic Regression | .912 | .912 |
| Kaggle | XGBoost | .921 | .921 |
| MIES (2 class) | Random Forest | .920 | .838 |
| MIES (2 class) | Logistic Regression | .920 | .847 |
| MIES (2 class) | XGBoost | .916 | .843 |
| MIES (3 class) | Random Forest | .738 | .624 |
| MIES (3 class) | Logistic Regression | .734 | .633 |
| MIES (3 class) | XGBoost | .728 | .625 |

---

## 3. KEY FINDINGS SO FAR

**The literature's accuracy gap is a task-definition artifact.** So (2020) reported 73.81% and Fieri (2023) 73.5%. Both kept the 1,769 "neither" respondents, making it a 3-class problem. Our 3-class MIES gives .728–.738 — matching them. Run as 2 classes it gives ~.92, matching Kaggle. So the apparent gap is about how the task was defined, not data quality.

**Your dataset is unusually repetitive.** Mean correlation between questions: Kaggle 0.784, MIES 0.213, BIG5 extraversion scale 0.454. Your seven "different" behaviors overlap more than a scale built on purpose to ask one thing ten ways.

**The old 17k dataset was leaking.** 94.6% of its test rows were duplicates of training rows. That's what pushed random forest from .910 to .968.

**One question does the work.** Stage fear alone: 91.7%. All seven: 92.2%.

**Importance rankings are unstable.** XGBoost credits stage fear; random forest credits "drained." Rank correlation near zero. So (2020) found the same instability between his two models.

**The Kaggle file has hidden imputation.** 267 values are column averages, not real answers, spread across 257 rows (8.9%). Removing them slightly raises accuracy, so conclusions hold.

**Your original paper had one wrong claim.** It said "drained after socializing" was a top behavior. SHAP shows the model nearly ignores it, because it duplicates stage fear.

---

## 4. WHAT'S NEXT

**Part 3 — Redundancy tests** (next up)
- SHAP across all 3 models on both datasets
- Ablation curve: drop lowest-importance item, retrain, repeat
- Leave-top-item-out: remove the single most important item, measure the drop

**Part 4 — Leakage tests**
- SMOTE before split vs. after split (training data only)

**Part 5 — Reliability**
- Repeated stratified k-fold for everything in Parts 2–4
- McNemar's test between models

**Part 6 — Synthesis**
- Side-by-side comparison, including So and Fieri

**Part 7 — Writing**
- Rewrite from the JEI manuscript

---

## 5. YOUR OPEN DECISIONS

1. **What is the paper's actual claim?** The original hypothesis (accuracy tracks repetitiveness) is contradicted so far: Kaggle at 0.784 redundancy and MIES-2class at 0.213 give nearly the same accuracy. Options: make the task-definition artifact the headline, keep redundancy as the focus and report the artifact second, or something else.
2. **GitHub: private or public?**
3. **Did the Sasha email go out, and with the hedge or without?**

---

## 6. PAPER EXHIBITS PLANNED

**Tables:** baseline accuracy (done) · dataset characteristics · ablation summary · leave-top-item-out · leakage results · comparison to published work

**Figures:** two correlation heatmaps side by side (strongest visual) · ablation curves overlaid · leakage bar chart · SHAP summary per dataset · ranking-stability scatter

---

## 7. GITHUB — THE THREE STEPS

1. **Me:** set up git in the `repo` folder, add `.gitignore` (excludes data), write README and requirements.txt. Still offline at this point.
2. **You:** create an empty repo on github.com, pick private or public.
3. **You:** connect and push — easiest with GitHub Desktop, or I'll give you exact commands.

I won't handle your login. After the first push, we commit as we go rather than all at once.
