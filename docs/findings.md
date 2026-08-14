# Findings sheet — for writing the paper

Every number here came from our own code. Where Claude's sandbox and Rishi's machine disagree,
Rishi's number is listed, because his scikit-learn version is the one pinned in
requirements.txt.

---

## FINDING 1 — The accuracy gap in the literature is a task-definition artifact

**Goes in:** Results, first subsection. This is the strongest finding.

So (2020) reported 73.81%. Fieri et al. (2023) reported 73.5%. The original JEI paper got 92%.
Those numbers were never comparable.

MIES asks respondents to pick introvert, extravert, or **neither**. Both published papers kept
the 1,769 "neither" respondents, making it a three-class problem. The JEI paper had two classes.

| MIES version | Accuracy (Gradient Boosting) |
|---|---|
| Three classes (as published papers did) | .7244 |
| Two classes (ambiverts removed) | .9240 |

Our three-class result lands on both published numbers. A second check: So states a
no-information rate of 61.51%; our three-class MIES gives 61.48%.

**What to write:** the 19-point gap dissolves when task definition is matched. The original 92%
was never anomalous.

**What NOT to write:** that either paper made an error. They defined the task differently, and
that difference simply isn't stated prominently enough for readers to notice.

---

## FINDING 2 — The Kaggle dataset is highly redundant. Three independent measures agree.

**Goes in:** Results, second subsection. Best-supported finding in the paper.

**Measure 1 — correlation between questions.**

| Dataset | Items | Mean inter-item correlation |
|---|---|---|
| Kaggle | 7 | **0.784** |
| MIES | 91 | 0.213 |
| BIG5 extraversion scale | 10 | 0.454 |

Note the BIG5 comparison: that scale was purpose-built to measure one trait ten ways, and it
is *less* internally correlated than the seven Kaggle "behaviours."

Also: one principal component explains 81.7% of the Kaggle variance, and only one factor has
an eigenvalue above 1. On MIES, sixteen factors clear that bar.

**Measure 2 — remove the single most important question.**

| Dataset | Model | Full | Without top question | Drop |
|---|---|---|---|---|
| Kaggle | Random Forest | .9105 | .9052 | .0052 |
| Kaggle | Logistic Regression | .9120 | .9138 | **−.0018** |
| Kaggle | Gradient Boosting | .9245 | .9245 | **.0000** |
| MIES (3 class) | Random Forest | .6177 | .6060 | .0116 |
| MIES (3 class) | Logistic Regression | .6330 | .6323 | .0007 |
| MIES (3 class) | Gradient Boosting | .6243 | .6244 | −.0000 |

All three models rank stage fear first on Kaggle. Deleting it costs nothing — Gradient Boosting
loses exactly zero and Logistic Regression improves slightly.

**Measure 3 — ablation curve.** Figure: `ablation_kaggle.pdf`, `ablation_mies.pdf`.
Kaggle stays flat from seven questions down to two. MIES degrades sharply below roughly fifteen
questions.

**What to write:** the seven behaviours are presented as distinct measures but carry about one
question's worth of independent information. Anyone using this dataset to ask which behaviour
best predicts personality will get an arbitrary answer.

---

## FINDING 3 — Row duplication before splitting inflated the original result

**Goes in:** Results, preprocessing subsection. This is the self-correction.

The original JEI analysis enlarged the dataset by stacking five exact copies plus one
noise-perturbed copy, then split it randomly.

- 94.6% of the "test" rows were exact duplicates of training rows
- Random Forest went from .9103 to .9675
- De-duplicated to unique rows only, the honest figure is .8970

**What to write:** the model was being evaluated on rows it had memorised. Copies cannot add
information, so any improvement from duplication has to come from contamination.

---

## FINDING 4 — The Kaggle file contains undisclosed imputation

**Goes in:** Results or Limitations. Small effect, but nobody has documented it.

Four columns contain values that are not whole numbers, in variables that can only be whole
numbers (hours, counts of friends). Each of those values equals its column mean to fifteen
decimal places — the signature of mean imputation.

| Column | Fabricated cells | Value |
|---|---|---|
| Time spent alone | 63 | 4.505816002819881 |
| Social event attendance | 62 | 3.963354474982382 |
| Friends circle size | 77 | 6.268862911795962 |
| Post frequency | 65 | 3.564726631393298 |

267 cells total, spread across 257 rows — 8.9% of the dataset. Removing those rows moves Random
Forest from .9103 to .9225, so conclusions hold.

The Kaggle description says the file "includes some missing values," but the posted file has
none. They were filled in before publication and the rounding step in the original code hid it.

---

## FINDING 5 — Two published papers made preprocessing choices that inflate their estimates

**Goes in:** Discussion. Handle carefully.

**So (2020)** reported that SMOTE raised his cross-validation accuracy from ~73.8% to 84.2%
while his held-out test accuracy *fell* from 73.81% to 72.79%. He reported both openly.

**Fieri et al. (2023)** selected 15 of 91 questions by correlating each with the label on the
full dataset before splitting, and balanced the whole dataset before cross-validating. Their
results: 73.5% original, 95.5% with SMOTE, 71.0% with SMOTE-ENN.

That last number is their own strongest counter-evidence. SMOTE-ENN is SMOTE plus a cleaning
step, and it scored *below* their untouched baseline. If oversampling genuinely helped, cleaning
it should not cause a collapse.

**What to write:** report the measured facts. Accuracies obtained on resampled data are not
comparable to accuracies on the original distribution, because synthetic rows can enter the
evaluation set.

**What NOT to write:** that they made an error. Fieri never states the ordering explicitly. We
inferred it from section structure and figure labels.

---

## THINGS I TOLD RISHI THAT TURNED OUT TO BE WRONG

Keep these out of the paper.

1. **"Importance rankings are unstable across models."** They aren't. Rank correlation is +0.39
   to +0.79 on Kaggle and +0.46 to +0.75 on MIES. The earlier near-zero figure came from
   comparing two different SHAP extraction methods, which was a mistake in Claude's code.
2. **"All three models disagree on the top question."** On Kaggle all three agree it's stage
   fear.
3. **"Redundancy drives accuracy."** The original hypothesis. Kaggle is 3.7× more redundant
   than MIES and gets nearly identical two-class accuracy. Falsified — say so plainly rather
   than quietly dropping it.
4. **"Alsadi et al."** — the So (2020) paper was miscited under a fabricated author name at one
   point. Correct author is Chaehan So.

---

## STILL UNMEASURED

| Choice | Status |
|---|---|
| SMOTE before vs. after splitting | Part 4 |
| Feature selection inside vs. outside CV | Part 4 |
| Repeated cross-validation, confidence intervals | Part 5 |
| McNemar's test between models | Part 5 |

---

## STRUCTURE SUGGESTION

1. **Introduction** — reported accuracies for this task range from 73% to 97%. Why?
2. **Related work** — So (2020), Fieri (2023). Both use MIES, both use one dataset.
3. **Methods** — datasets, models, and each preprocessing condition tested.
4. **Results** — Finding 1 (task definition), Finding 2 (redundancy), Findings 3 and 4
   (preprocessing on the Kaggle file), Part 4 and 5 results when they exist.
5. **Discussion** — Finding 5, and what a reader should check before trusting a reported
   accuracy on this task.
6. **Limitations** — two datasets only; the redundancy hypothesis was not supported;
   Fieri's ordering was inferred, not confirmed.

**Framing that holds up:** reported accuracies in this literature are not comparable across
studies, because papers differ silently in task definition and data preparation. This paper
measures how much each choice moves the number.
