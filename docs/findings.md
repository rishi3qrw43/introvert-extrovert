# My findings

All numbers from my own code, my machine.

---

## 1. Including or excluding ambiverts swings accuracy by 20 points

MIES lets people answer introvert, extravert, or **neither**. That third group is 1,769 people
out of 7,163 — the ones who don't place themselves at either end.

I ran it both ways:

| MIES version | Accuracy |
|---|---|
| Three classes (ambiverts kept) | .7244 |
| Two classes (ambiverts dropped) | .9240 |

Dropping the ambiverts isn't a cleaner analysis. It's an easier exam — I deleted the hard cases
and kept only people who confidently identify at one extreme.

This is the single largest effect I've measured. Bigger than duplication, bigger than anything
else I've tested.

**Write:** the choice of whether to include ambiverts moves accuracy about 20 points, and papers
in this area don't state it prominently. My own 92% came from the easier version of the task.

---

## 2. My seven questions are really one question

Three separate tests agree.

**Correlation between questions:**

| Dataset | Items | Mean correlation | PC1 variance | Factors |
|---|---|---|---|---|
| Mine | 7 | **0.784** | 81.7% | 1 |
| MIES | 91 | 0.196 | 21.6% | 16 |
| BIG5 extraversion | 10 | 0.454 | 51.1% | 1 |

The BIG5 comparison is the one that lands. That scale was deliberately built to ask about one
trait ten different ways, and its questions agree with each other *less* than my seven
supposedly-distinct behaviours do.

One principal component explains 81.7% of my data, and only one factor clears the standard
eigenvalue cutoff. MIES has sixteen.

Produced by `src/dataset_stats.py`.

**Delete the top question and nothing happens:**

| Model | Full | Without top | Drop |
|---|---|---|---|
| Random Forest | .9105 | .9052 | .0052 |
| Logistic Regression | .9120 | .9138 | **−.0018** |
| Gradient Boosting | .9245 | .9245 | **.0000** |

All three models rank stage fear first. Removing it costs Gradient Boosting exactly zero, and
Logistic Regression gets slightly better. Everything stage fear measures already lives in the
other six questions.

**Ablation curve** (`ablation_kaggle.pdf`): flat from seven questions down to two. MIES needs
about fifteen before it holds steady.

**Write:** seven behaviours carry roughly one question's worth of information. Anyone using this
dataset to ask which behaviour best predicts personality will get an arbitrary answer.

---

## 3. My old 17k dataset was grading itself on memorised rows

I built it by stacking five exact copies plus one noisy copy, then splitting 80/20. With five
copies of every row, it's near-certain one copy lands in training and another in test — so the
model memorises a row, then recognises it on the exam.

| Condition | Rows | Test rows already seen in training | RF | Logistic | Gradient Boosting |
|---|---|---|---|---|---|
| Original file | 2,900 | **27.9%** | .9103 | .9121 | .9241 |
| Duplicated before split | 17,400 | **94.4%** | **.9658** | .9141 | .9293 |
| De-duplicated | 2,414 | 0% | .9358 | .9441 | .9441 |

Two things I didn't expect:

**The effect is mostly Random Forest.** Duplication adds 5.5 points to Random Forest but under
1.5 points to the other two. Tree ensembles memorise individual rows more readily, so they
benefit most from seeing them again.

**The original file already leaks.** Before I did anything, 27.9% of test rows already appeared
identically in training, because the file contains 486 duplicate rows out of 2,900. That's not
something I introduced.

One caveat on the de-duplicated row: 60 answer patterns appear with *both* labels (157 rows
total), so removing duplicates by answer pattern also drops some contradictory cases. That's
part of why accuracy rises rather than falls.

**Write:** this is a self-correction. Report the honest de-duplicated figure and note that the
inflation is model-dependent.

Produced by `src/leakage.py`.

---

## Wrong turns — keep out of the paper

1. **"Rankings are unstable across models."** They're not. +0.39 to +0.79 on mine, +0.46 to
   +0.75 on MIES.
2. **"The three models disagree on the top question."** They all say stage fear.
3. **"Redundancy drives accuracy."** My original hypothesis. Mine is 3.7× more redundant than
   MIES and gets the same two-class accuracy. Falsified — say so directly.

---

## Still to measure

SMOTE before vs. after splitting · feature selection inside vs. outside CV (Part 4) ·
repeated cross-validation and McNemar (Part 5)

---

## Context from the literature — brief

Two papers use the same MIES data. So (2020) reports 73.81%, Fieri (2023) reports 73.5%. Both
kept the ambivert group, which is why their numbers sit near my three-class result.

So also reported that SMOTE raised his cross-validation score to 84.2% while his held-out test
score fell to 72.79% — useful supporting evidence that resampling inflates the wrong measure.

Cite them for context. Don't build the paper around critiquing them.

---

## Paper structure

1. **Intro** — reported accuracies for this task range widely. Which choices explain it?
2. **Methods** — datasets, models, each preprocessing condition.
3. **Results** — finding 1, then 2, then 3, then Parts 4 and 5.
4. **Discussion** — what to check before trusting a reported accuracy on this task.
5. **Limitations** — two datasets; redundancy hypothesis unsupported.

**My framing:** reported accuracies for introvert–extrovert classification depend heavily on
preprocessing choices that often go unstated. I measure how much each choice moves the number.
