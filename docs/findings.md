# My findings

All numbers from my own code, my machine. Models: Random Forest, Logistic Regression, XGBoost.

---

## 1. Including or excluding ambiverts swings accuracy ~19 points

MIES lets people answer introvert, extravert, or **neither**. That third group is 1,769 of
7,163 — the people who don't place themselves at either end.

| MIES version | Random Forest | Logistic Regression | XGBoost |
|---|---|---|---|
| Three classes (ambiverts kept) | .7362 | .7341 | .7278 |
| Two classes (ambiverts dropped) | .9184 | .9203 | .9157 |

Dropping the ambiverts isn't a cleaner analysis. It's an easier exam — I deleted the ambiguous
cases and kept only people who confidently identify at one extreme.

**Write:** whether ambiverts are included moves accuracy by roughly 19 points, and papers on
this data don't state the choice prominently. My own 92% came from the easier version.

---

## 2. My seven questions are really one question

Three tests agree.

**Overlap between questions:**

| Dataset | Items | Mean correlation | Least related pair | Most related pair |
|---|---|---|---|---|
| Mine | 7 | **0.784** | 0.69 | 0.957 |
| MIES | 91 | 0.196 | 0.00 | 0.823 |
| BIG5 extraversion | 10 | 0.454 | 0.32 | 0.631 |

The sharpest number: my *least* related pair of questions (0.69) overlaps more than BIG5's
*most* related pair (0.631) — and BIG5's scale was purpose-built to ask one thing ten ways.

**Delete the top-ranked question and nothing breaks:**

| Dataset | Model | Full | Without top | Change |
|---|---|---|---|---|
| Mine | Random Forest | .9105 | .9052 | −.0052 |
| Mine | Logistic Regression | .9120 | .9138 | **+.0018** |
| Mine | XGBoost | .9210 | .9245 | **+.0035** |
| MIES | Random Forest | .6177 | .6060 | −.0116 |
| MIES | Logistic Regression | .6330 | .6323 | −.0007 |
| MIES | XGBoost | .6249 | .6221 | −.0029 |

All three models rank stage fear first on my data. Two of the three get *better* when it's
removed. Everything stage fear measures already lives in the other six questions.

**Ablation curve** (`figures/ablation_kaggle.pdf`): flat from seven questions down to two.
MIES (`ablation_mies.pdf`) needs about fifteen before it settles.

**Write:** seven behaviours carry roughly one question's worth of information. Anyone asking
which behaviour best predicts personality will get an arbitrary answer.

---

## 3. Duplicate rows inflate accuracy, and the raw file already has them

| Condition | Rows | Test rows already seen in training | RF | Logistic | XGBoost |
|---|---|---|---|---|---|
| Raw file | 2,900 | **27.9%** | .9103 | .9121 | .9207 |
| Duplicated before split | 17,400 | **94.4%** | **.9658** | .9141 | .9307 |
| De-duplicated | 2,414 | 0% | .9358 | .9441 | .9420 |

Two things worth stating:

**The raw file already leaks.** 486 of its 2,900 rows are exact duplicates, so 27.9% of test
rows appear identically in training before anyone does anything.

**The effect is mostly Random Forest** — 5.5 points, versus 1.0 for XGBoost and 0.2 for
logistic regression. A logistic regression has seven coefficients and cannot store individual
rows. A random forest with a hundred deep trees can memorise one.

**Write:** I de-duplicate before all analyses. One sentence in Methods.

---

## 4. Resampling before splitting inflates accuracy by 21 points

SMOTE creates synthetic rows by blending real ones. Do it before splitting and synthetic rows
built from training data land in the test set.

| Dataset | Model | SMOTE before split | SMOTE inside folds | Gap |
|---|---|---|---|---|
| MIES | Random Forest | .8569 | .6462 | **+.2107** |
| MIES | XGBoost | .8264 | .6471 | **+.1793** |
| MIES | Logistic Regression | .7329 | .6777 | +.0552 |
| Mine | Random Forest | .9195 | .9203 | −.0008 |
| Mine | XGBoost | .9329 | .9304 | +.0025 |
| Mine | Logistic Regression | .9215 | .9170 | +.0045 |

**Fieri reported 73.5% → 95.5% after SMOTE — a 22-point jump. I measure 21 points from
resampling order alone, on the same dataset.** That reproduces the mechanism without having to
claim anything about their code.

**Two conditions are required.** The class balance has to be uneven — my dataset is 51/49 and
shows no gap; MIES is 61/14/25 and shows 21 points. And the model has to be able to memorise:
Random Forest gains 21 points, logistic regression 6.

**By contrast, feature-selection order does almost nothing:**

| Dataset | Model | Gap |
|---|---|---|
| MIES | Random Forest | −.0003 |
| MIES | Logistic Regression | −.0016 |
| MIES | XGBoost | +.0027 |

Choosing features on the full dataset before cross-validating adds nothing measurable. Two
choices that look equally suspicious, and only one matters.

---

## Wrong turns — keep out of the paper

1. **"Rankings are unstable across models."** They're not. +0.50 to +0.68 on mine, +0.47 to
   +0.82 on MIES.
2. **"The models disagree on the top question."** All three say stage fear on my data.
3. **"Redundancy drives accuracy."** My original hypothesis. Mine is four times more redundant
   than MIES and gets the same two-class accuracy. Falsified — state it plainly.

---

## Still to do

Part 5 — repeated cross-validation with confidence intervals, and McNemar's test between models.

---

## Paper structure

1. **Intro** — reported accuracies for this task range widely. Which choices explain it?
2. **Methods** — datasets, models, each condition tested.
3. **Results** — finding 1, then 2, then 3, then 4.
4. **Discussion** — what to check before trusting a reported accuracy on this task.
5. **Limitations** — two datasets; redundancy hypothesis unsupported.

**My framing:** reported accuracies for introvert–extrovert classification depend heavily on
preprocessing choices that often go unstated. I measure how much each choice moves the number.
