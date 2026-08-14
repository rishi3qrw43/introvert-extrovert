# Paper Analysis: Introversion-Extraversion Prediction using Machine Learning

**Authors:** Brillian Fieri, Joshua La'la, Derwin Suhartono (Bina Nusantara University, Jakarta, Indonesia)
**Year:** 2023
**Venue:** JOIV: International Journal on Informatics Visualization, vol. 7, no. 4
**DOI:** 10.62527/joiv.7.4.1019
**URL:** https://joiv.org/index.php/joiv/article/view/1019
**Citations:** 7 (Google Scholar, checked 2026-07-30)

---

## Access Status
- **Full text obtained:** NO — abstract and complete reference list only
- **Sections I actually read:** Title, authors/affiliations, abstract (verbatim), full reference list (21 refs)
- **Could NOT access:** Methods, Results, Discussion, all tables/figures. The PDF at `/article/viewFile/1019/792` sits behind a Cloudflare bot-verification challenge; the embedded PDF viewer exposes no extractable text; direct fetch returns empty; ResearchGate and Semantic Scholar API both returned empty.
- **Confidence in this summary:** **MEDIUM for the headline numbers** (quoted verbatim from the abstract), **LOW for anything methodological** (inferred, not read).
- **Action needed:** someone with normal browser access should download the PDF manually and read Section II (Method). The central question below cannot be resolved without it.

---

## Why this paper matters to us
It is the closest existing work to our project — same dataset family (MIES), same task, published 2023. It defines what our contribution can and cannot claim to be novel.

## Verbatim claims from the abstract
Quoted exactly (source: abstract, joiv.org article page):

> "This study compares and evaluates several machine learning models and dataset balancing methods to predict the introversion-extraversion personality based on the survey result conducted by Open-Source Psychometrics Project."

> "The dataset was balanced using three balancing methods, and fifteen questions were chosen as the features based on their correlations with the personality self-identification result."

> "The best model for the Synthetic Minority Oversampling (SMOTE), Adaptive Synthesis Sampling (ADASYN), and Synthetic Minority Oversampling-Edited Nearest Neighbor (SMOTE-ENN) datasets was the Random Forest with the 10-fold cross-validation accuracy of 95.5%, 95.3%, and 71.0%."

> "On the original dataset, the best model was Support Vector Machine, with a 10-fold cross-validation accuracy of 73.5%."

## Extracted facts
| Item | Value | Source |
|---|---|---|
| Dataset | Open-Source Psychometrics MIES (cited as ref [14], "Development of the Multidimensional Introversion-Extraversion Scales", 2019) | abstract + ref list |
| Sample size after filtering | **NOT STATED in accessible text** — do not cite a number | — |
| Features | 15 of 91 items, selected by correlation with the self-identification label | abstract |
| Validation | 10-fold cross-validation | abstract |
| Accuracy, original (unbalanced) data | **73.5%** (SVM) | abstract |
| Accuracy, SMOTE | **95.5%** (Random Forest) | abstract |
| Accuracy, ADASYN | 95.3% (Random Forest) | abstract |
| Accuracy, SMOTE-ENN | 71.0% (Random Forest) | abstract |
| Interpretability method | **None mentioned anywhere** | abstract |
| Cites So (2020) | Yes, ref [10] | ref list |

## Strengths
- **Uses real, consented human data** (MIES), not a repackaged Kaggle file.
- **10-fold cross-validation**, which is more rigorous than our original paper's single 80/20 split.
- **Reports the unbalanced baseline (73.5%) openly** rather than only headlining the flattering 95.5%. That is honest reporting and they deserve credit for it.
- **Systematic comparison** across three balancing methods and multiple models.
- Open access; cites the relevant prior work including So (2020).

## Weaknesses and concerns
Separating these by severity, per the framework:

### Potentially fundamental (UNVERIFIED — requires the methods section)
1. **Feature-selection leakage.** They chose 15 items "based on their correlations with the personality self-identification result." If that correlation was computed on the *entire* dataset before cross-validation, then label information from every test fold influenced which features the model got. This is a well-known leakage pathway and would inflate all reported numbers. **I could not verify whether selection happened inside or outside the CV loop.**

2. **The evaluation set may itself be synthetic.** This is the sharper version of the SMOTE concern, and it matters more than the usual "before or inside CV" framing. Proper practice is to resample *only the training fold* and evaluate on an untouched real test fold. If resampling was applied to the whole dataset — or even applied inside CV but to both portions — then the 95.5% describes performance on partly invented data, not on real respondents. **Cannot verify without the methods section.**

3. **The 22-point jump is implausible on its face.** Going from 73.5% to 95.5% purely by rebalancing classes is not what correct resampling does. Correct resampling improves minority-class recall and typically leaves overall discrimination roughly similar. A jump this large is a strong signal that something other than genuine learning is happening. Note the internal tension in their own results: SMOTE-ENN, which *cleans* the data after oversampling, gives **71.0%** — lower than the original 73.5%. If oversampling genuinely helped, the cleaned variant should not collapse. The pattern is more consistent with the two oversampling methods creating easily-predictable synthetic points.

### Important limitations (affect interpretation, not validity)
4. **No interpretability whatsoever.** They report which items were selected but never analyze what drives the classification. This is our opening.
5. **Single dataset.** No cross-instrument or cross-population validation.
6. **Correlation-based feature selection is exactly the method our SHAP work shows to be misleading** — it cannot detect that two highly-correlated items are redundant, so a correlation-ranked top-15 may contain several near-duplicate questions.
7. **Accuracy as headline metric on imbalanced data**, where balanced accuracy or AUC would be more informative.

### Minor
8. Sample size after filtering not reported in the abstract.

## The one question that must be answered
**Was feature selection and/or resampling performed inside or outside the cross-validation loop?**

- If **outside**: their headline numbers are inflated by leakage, and we can say so with evidence.
- If **inside, on training folds only**: their method is defensible, the 95.5% still isn't comparable to real-data accuracy if test folds contain synthetic points, and we must stay neutral about their execution.

Until this is read, **our paper must not assert that Fieri et al. made an error.**

## Safe framing for our manuscript (defensible either way)
> Reported accuracies for introversion–extraversion classification on Open-Source Psychometrics data vary widely, from 73.5–73.8% on the original distribution (So, 2020; Fieri et al., 2023) to 95.5% after synthetic oversampling (Fieri et al., 2023). Accuracies obtained on resampled data are not directly comparable to those obtained on the original distribution, since synthetic observations may enter the evaluation set. We therefore report both, and demonstrate the magnitude of inflation attributable to resampling order on our own data.

This states only verifiable facts, makes the methodological point clearly, and does not accuse anyone.

## Comparison matrix — where our paper sits
| | So (2020) | Fieri et al. (2023) | Naz et al. (2024) | **Ours (planned)** |
|---|---|---|---|---|
| Data | MIES-family, n=7,161 | MIES, n not stated | social media text | Kaggle behaviors n=2,900 + MIES + BIG5 |
| Label | self-reported I/E | self-reported I/E | not verified | self-reported I/E |
| Features | 94 → 10 | 91 → 15 (by correlation) | text features | 7 → 1 |
| Method | ML + SMOTE/ADASYN | RF/SVM/others + 3 balancing methods | CNN/LSTM/RNN | RF/XGB/SVM/MLP |
| Best accuracy | 73.81% | 73.5% orig / 95.5% SMOTE | 92.52% | 92.2% (89.7% de-duplicated) |
| **Interpretability** | **none** | **none** | **none** | **SHAP** ← our gap |
| **Multi-dataset** | **no** | **no** | **no** | **yes** ← our gap |
| **Leakage diagnosis** | **no** | **no** | **no** | **yes** ← our gap |
| Validation | CV | 10-fold CV | not verified | repeated 10-fold CV planned |

## Net effect on our novelty claim
**Reduced but intact.** We can no longer claim to be first to classify I/E on real MIES data. Our remaining novelty is the three bottom rows: interpretability (SHAP), multi-dataset comparison, and explicit diagnosis of accuracy inflation. All three are genuinely unoccupied across every paper found.

**Bonus:** their 73.5% independently corroborates So's 73.81%. Two independent studies converging on ~73–74% for real data makes our "92% is dataset-specific" argument substantially stronger than relying on one precedent.

## Reproducibility assessment
Cannot assess — no code or data availability statement visible in the accessible portion. The underlying MIES dataset is public, which helps.
