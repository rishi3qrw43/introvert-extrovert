# My findings

Four decisions a researcher makes before reporting an accuracy number, and how much each one
actually moves it. All numbers from my own code, my machine. Models: Random Forest, Logistic
Regression, XGBoost.

**Where this sits:** Kapoor and Narayanan documented leakage across 294 papers in 17 fields and
built a taxonomy of eight leakage types. Personality classification wasn't one of the fields
they surveyed. That's the gap.

| Decision | How much it moves accuracy |
|---|---|
| Whether to include ambiverts | **~19 points** |
| When to resample | **~21 points** (imbalanced data only) |
| Whether to de-duplicate rows | ~5.5 points (Random Forest) |
| Which questions to include | **~0 points** |

---

## 1. Whether to include ambiverts: ~19 points

MIES lets people answer introvert, extravert, or **neither**. That third group is 1,769 of
7,163: the people who don't place themselves at either end.

| MIES version | Random Forest | Logistic Regression | XGBoost |
|---|---|---|---|
| Three classes (ambiverts kept) | .7362 | .7341 | .7278 |
| Two classes (ambiverts dropped) | .9184 | .9203 | .9157 |

Dropping ambiverts isn't a cleaner analysis. It's an easier exam. The ambiguous cases are
deleted and only people who confidently identify at one extreme remain.

**Verification:** my three-class numbers land on So's published 73.81% and Fieri's 73.5%. So
also reports a no-information rate of 61.51%; my three-class MIES gives 61.48%. Both papers
kept the ambiverts.

**Write:** this choice moves accuracy ~19 points and is rarely stated prominently. My own 92%
came from the easier version.

---

## 2. When to resample: ~21 points

SMOTE creates synthetic rows by blending real ones. Do it before splitting and rows built from
training data land in the test set.

| Dataset | Model | Before split | Inside folds | Gap |
|---|---|---|---|---|
| MIES | Random Forest | .8569 | .6462 | **+.2107** |
| MIES | XGBoost | .8264 | .6471 | **+.1793** |
| MIES | Logistic Regression | .7329 | .6777 | +.0552 |
| Mine | Random Forest | .9195 | .9203 | -.0008 |
| Mine | XGBoost | .9329 | .9304 | +.0025 |
| Mine | Logistic Regression | .9215 | .9170 | +.0045 |

**Fieri reported 73.5% to 95.5% after SMOTE, a 22-point jump. I measure 21 points from ordering
alone on the same dataset.** That reproduces the mechanism without claiming anything about
their code.

**Two conditions are required.** Classes must be imbalanced. Mine is 51/49 and shows nothing;
MIES is 61/14/25 and shows 21 points. And the model must be able to memorise: Random Forest
gains 21 points, logistic regression 6.

---

## 3. Whether to de-duplicate rows: ~5.5 points

| Condition | Rows | Test rows already seen in training | RF | Logistic | XGBoost |
|---|---|---|---|---|---|
| Raw file | 2,900 | **27.9%** | .9103 | .9121 | .9207 |
| Duplicated before split | 17,400 | **94.4%** | **.9658** | .9141 | .9307 |
| De-duplicated | 2,414 | 0% | .9358 | .9441 | .9420 |

**The raw file already leaks.** 486 of its 2,900 rows are exact duplicates, so 27.9% of test
rows appear identically in training before anyone does anything.

Again mostly Random Forest: 5.5 points, versus 1.0 for XGBoost and 0.2 for logistic
regression. A logistic regression has seven coefficients and cannot store individual rows. A
random forest with a hundred deep trees can memorise one.

**Write:** I de-duplicate before all analyses.

---

## 4. Which questions to include: ~0 points

The choice that turns out not to matter, and the reason is that the questions are near-copies
of each other.

**How much the questions overlap:**

| Dataset | Items | Mean correlation | Least related pair | Most related pair |
|---|---|---|---|---|
| Mine | 7 | **0.784** | 0.69 | 0.957 |
| MIES | 91 | 0.196 | 0.00 | 0.823 |
| BIG5 extraversion | 10 | 0.454 | 0.32 | 0.631 |

The sharpest number: my *least* related pair (0.69) overlaps more than BIG5's *most* related
pair (0.631), and BIG5's scale was purpose-built to ask one thing ten ways.

**Consequence 1: deleting the top-ranked question changes nothing:**

| Dataset | Model | Full | Without top | Change |
|---|---|---|---|---|
| Mine | Random Forest | .9105 | .9052 | -.0052 |
| Mine | Logistic Regression | .9120 | .9138 | **+.0018** |
| Mine | XGBoost | .9210 | .9245 | **+.0035** |
| MIES | Random Forest | .6177 | .6060 | -.0116 |
| MIES | Logistic Regression | .6330 | .6323 | -.0007 |
| MIES | XGBoost | .6249 | .6221 | -.0029 |

All three models rank stage fear first on my data. Two of the three get *better* when it's
removed.

**Consequence 2: how you select questions doesn't matter either:**

| Dataset | Model | Selection before split vs. inside folds |
|---|---|---|
| MIES | Random Forest | -.0003 |
| MIES | Logistic Regression | -.0016 |
| MIES | XGBoost | +.0027 |

Choosing features on the full dataset before cross-validating, the thing that looks equally
suspicious as resampling, adds nothing measurable.

**Consequence 3: the ablation curve is flat.** `figures/ablation_kaggle.pdf` holds steady from
seven questions down to two. MIES (`ablation_mies.pdf`) needs about fifteen before it settles.

**Write:** seven behaviours carry roughly one question's worth of information, so which ones you
keep barely matters. Anyone asking which behaviour best predicts personality gets an arbitrary
answer.

---

## Wrong turns: keep out of the paper

1. **"Rankings are unstable across models."** They're not. +0.50 to +0.68 on mine, +0.47 to
   +0.82 on MIES.
2. **"The models disagree on the top question."** All three say stage fear on my data.
3. **"Redundancy drives accuracy."** My original hypothesis. Mine is four times more redundant
   than MIES and gets the same two-class accuracy. Falsified. State it plainly.

---

## Still to do

- Part 5: repeated cross-validation with confidence intervals, McNemar's test
- Two figures: correlation heatmaps side by side, and a bar chart of the four effects

---

## Paper structure

1. **Intro.** Reported accuracies for this task range from 73% to 97%. Leakage is a known
   problem across fields [Kapoor & Narayanan], but hasn't been measured here.
2. **Methods.** Datasets, models, and the four decisions tested.
3. **Results.** The four decisions, ordered by effect size.
4. **Discussion.** What to check before trusting a reported accuracy on this task.
5. **Limitations.** Two datasets; the resampling effect only appears on imbalanced data; my
   original hypothesis that redundancy drives accuracy was not supported.

**My framing:** four preprocessing decisions, ranked by how much each moves the reported
accuracy. Two matter enormously, one matters moderately, one doesn't matter at all.
