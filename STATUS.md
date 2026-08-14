# PROJECT HUB — read this first

Last updated: 14 Aug 2026

---

## THE QUESTION

How do task definition, repetitive questions, duplicate records, and data-preparation choices
affect the reported accuracy and question-importance rankings of introvert–extrovert models?

**The claim:** reported accuracies in this literature are not comparable across studies,
because papers differ silently in how they define the task and prepare the data. The paper
measures how much each choice moves the number.

---

## THE FILES

```
README.md            what this is, how to run it
STATUS.md            this file
requirements.txt     pinned package versions
baseline_results.csv output from models.py
src/prep.py          loads and cleans both datasets
src/models.py        trains models, makes the baseline table
docs/references.md   annotated citations + Zenodo metadata checklist
data/                the two datasets (not tracked by git)
```

**To run:** open Terminal in this folder, then `python3 src/models.py`

**Note on versions:** results were produced with the exact package versions pinned in
requirements.txt. Random Forest results on MIES shift by roughly 0.002 under older scikit-learn
releases, so the pinned versions matter for exact reproduction.

---

## DONE

**Part 1 — Fix the data.** The row-copying block is deleted. Data loads, encodes Yes/No to
1/0, splits 80/20 stratified with a fixed seed. All preprocessing happens inside pipelines so
nothing leaks from test into training.

**Part 2 — Baseline models.** Three models, three dataset versions:

| Dataset | Model | Accuracy | Balanced acc. |
|---|---|---|---|
| Kaggle | Random Forest | .9103 | .9105 |
| Kaggle | Logistic Regression | .9121 | .9120 |
| Kaggle | Gradient Boosting | .9241 | .9245 |
| MIES (2 class) | Random Forest | .9184 | .8346 |
| MIES (2 class) | Logistic Regression | .9203 | .8474 |
| MIES (2 class) | Gradient Boosting | .9240 | .8536 |
| MIES (3 class) | Random Forest | .7362 | .6177 |
| MIES (3 class) | Logistic Regression | .7341 | .6330 |
| MIES (3 class) | Gradient Boosting | .7244 | .6243 |

---

## WHAT WE KNOW SO FAR

**The literature's accuracy gap is a task-definition artifact.** So reported 73.81%, Fieri
73.5%. Both kept the 1,769 "neither" respondents, making it a three-class problem. Our
three-class MIES gives .724–.736 — matching them. Run as two classes it gives ~.92, matching
the Kaggle set. The apparent gap is about how the task was defined, not data quality.

**The Kaggle dataset is unusually repetitive.** Mean correlation between questions: Kaggle
0.784, MIES 0.213, BIG5 extraversion scale 0.454. Seven "different" behaviours overlap more
than a scale purpose-built to ask one thing ten ways.

**The old 17k dataset was leaking.** 94.6% of its test rows were duplicates of training rows,
pushing Random Forest from .910 to .968.

**One question does most of the work.** Stage fear alone: 91.7%. All seven: 92.2%.

**Importance rankings are unstable across models.** Rank correlation near zero between
Gradient Boosting and Random Forest. So (2020) found the same instability between his two
models but attributed it to the algorithms rather than the data.

**The Kaggle file has undisclosed imputation.** 267 values are column averages, not real
answers, spread across 257 rows (8.9%). Removing them slightly raises accuracy, so
conclusions hold.

**The original JEI paper had one wrong claim.** It said "drained after socializing" was a top
behaviour. SHAP shows the model nearly ignores it, because it duplicates stage fear.

> Note: figures for these findings were deleted because they came from an earlier version of
> the code. They'll be regenerated in Part 3.

---

## NEXT — PART 3, REDUNDANCY TESTS

1. SHAP across all three models, both datasets
2. Ablation curve — drop the lowest-importance item, retrain, repeat, plot accuracy vs. items
   remaining
3. Leave-top-item-out — remove only the single most important item and measure the drop. A big
   drop means that item does unique work; a small drop means the items are redundant

Then Part 4 (leakage), Part 5 (reliability), Part 6 (synthesis), Part 7 (writing).

---

## PREPROCESSING CHOICES TO MEASURE (Part 4)

| Choice | Effect | Status |
|---|---|---|
| Include vs. exclude ambiverts | ~18 pts | measured |
| Duplicate rows before splitting | ~6 pts | measured |
| SMOTE before vs. after splitting | unknown | not run |
| Feature selection inside vs. outside CV | unknown | not run |
| Mean imputation vs. dropping rows | ~1 pt | measured, minor |

Each of these is a choice a published paper actually made, which is what makes the list hard
to dismiss.

---

## DECIDED

- MIES three-class is primary; two-class reported once as a preprocessing condition
- Paper is a measurement paper, not a redundancy-causes-accuracy paper
- GitHub repo will be private until the paper is done
- Gradient Boosting replaces XGBoost (no external dependencies, in line with the plan)
- Your machine's numbers are authoritative

## STILL OPEN

1. Send Sasha a correction — his email has the outdated "accuracy way below" claim. Folding
   into the next update.
2. GitHub: repo not yet created or pushed. Local git is initialized with one commit.
3. Broader literature search, per Anna — general ML already knows preprocessing affects
   results; the contribution is measuring it for this specific task.

---

## PAPER EXHIBITS PLANNED

**Tables:** baseline accuracy (done) · dataset characteristics · ablation summary ·
leave-top-item-out · preprocessing effects · comparison to published work

**Figures:** two correlation heatmaps side by side (strongest visual) · ablation curves
overlaid · preprocessing effects bar chart · SHAP summary per dataset · ranking-stability
scatter
