# References

IEEE numeric style, matching the convention in this literature (So published at an IEEE
conference; JOIV uses the same style). Annotations note what each source contributes.

---

## Primary comparison papers

[1] C. So, "Are you an introvert or extrovert? Accurate classification with only ten
predictors," in *2020 International Conference on Artificial Intelligence in Information and
Communication (ICAIIC)*, Fukuoka, Japan, 2020, pp. 1-5, doi: 10.1109/ICAIIC48513.2020.9065069.

> Read in full. Uses MIES, n = 7,161 after removing 27 missing labels, **three classes**
> (no-information rate 61.51%). Reports 73.81% test accuracy with 10 of 94 features.
> Also ranks variable importance, finds gbm and random forest disagree sharply, and reports
> that SMOTE raised cross-validation accuracy to 84.2% while test accuracy fell to 72.79%.
> Preprint: arXiv:2003.01580. Accessed 30 July 2026.

[2] B. Fieri, J. La'la, and D. Suhartono, "Introversion-extraversion prediction using machine
learning," *JOIV: International Journal on Informatics Visualization*, vol. 7, no. 4,
pp. 2153-2159, 2023, doi: 10.62527/joiv.7.4.1019.

> Read in full. Same MIES dataset (4,404 / 989 / 1,768). Selects 15 of 91 items by Pearson
> correlation computed on the full dataset. Reports 73.5% on original data, 95.5% with SMOTE,
> 95.3% with ADASYN, 71.0% with SMOTE-ENN. Accessed 30 July 2026.

## Datasets

[3] R. Kapilavayi, "Extrovert vs. introvert behavior data," Kaggle, 2024. [Online]. Available:
https://www.kaggle.com/datasets/rakeshkapilavai/extrovert-vs-introvert-behavior-data

> 2,900 responses, 7 behavioural items. Licensed CC BY-SA 4.0. Accessed 30 July 2026.

[4] Open-Source Psychometrics Project, "Development of the Multidimensional
Introversion-Extraversion Scales," 2019. [Online]. Available:
https://openpsychometrics.org/tests/MIES/development/

> 7,188 respondents, 91 Likert items, plus a self-reported introvert / extravert / neither
> question. Items were selected from 206 candidates by how strongly they separated
> self-identified introverts from extraverts. Accessed 30 July 2026.

[5] Open-Source Psychometrics Project, "IPIP Big Five Factor Markers," 2014. [Online].
Available: https://openpsychometrics.org/tests/BIG5.php

> 19,719 respondents, 50 items. No self-reported introvert/extrovert label, so not usable for
> the classification comparison. Used descriptively only. Accessed 30 July 2026.

## Leakage and reproducibility

[6] S. Kapoor and A. Narayanan, "Leakage and the reproducibility crisis in machine-learning-based
science," *Patterns*, vol. 4, no. 9, 2023, doi: 10.1016/j.patter.2023.100804.

> **The anchor citation for this paper.** Documents leakage across 294 papers in 17 disciplines
> and gives a taxonomy of 8 leakage types. Personality classification is not among the fields
> surveyed. That is the gap this paper fills. Preprint: arXiv:2207.07048.
> Accessed 14 August 2026.

## Methods

[7] S. M. Lundberg and S.-I. Lee, "A unified approach to interpreting model predictions," in
*Advances in Neural Information Processing Systems 30*, 2017, pp. 4765-4774.

[8] N. V. Chawla, K. W. Bowyer, L. O. Hall, and W. P. Kegelmeyer, "SMOTE: Synthetic minority
over-sampling technique," *Journal of Artificial Intelligence Research*, vol. 16, pp. 321-357,
2002, doi: 10.1613/jair.953.

[9] Q. McNemar, "Note on the sampling error of the difference between correlated proportions
or percentages," *Psychometrika*, vol. 12, no. 2, pp. 153-157, 1947.

[10] E. R. Thompson, "Development and validation of an international English mini-markers,"
*Personality and Individual Differences*, vol. 45, no. 6, pp. 542-548, 2008,
doi: 10.1016/j.paid.2008.06.013.

> Precedent for reducing a personality scale to fewer items. This is the psychology-side analogue of
> our ablation analysis.

## Background

[11] C. G. Jung, *Psychological Types*, H. G. Baynes, Trans. Princeton, NJ: Princeton
University Press, 1971.

[12] H. J. Eysenck, *The Biological Basis of Personality*. Springfield, IL: Charles C. Thomas,
1967.

[13] S. Cain, *Quiet: The Power of Introverts in a World That Can't Stop Talking*. New York,
NY: Crown, 2012.

[14] M. Kosinski, D. Stillwell, and T. Graepel, "Private traits and attributes are predictable
from digital records of human behavior," *Proceedings of the National Academy of Sciences*,
vol. 110, no. 15, pp. 5802-5805, 2013, doi: 10.1073/pnas.1218772110.

[15] W. Youyou, M. Kosinski, and D. Stillwell, "Computer-based personality judgments are more
accurate than those made by humans," *Proceedings of the National Academy of Sciences*,
vol. 112, no. 4, pp. 1036-1040, 2015, doi: 10.1073/pnas.1418680112.

---

## Not verified: do not cite without reading

- A. Naz et al., "AI knows you: Deep learning model for prediction of extroversion personality
  trait," *IEEE Access*, 2024. Metadata from search results only.
- A 2019 *Frontiers in Psychology* paper on machine learning in psychometrics. Author list
  unconfirmed.

---

## Zenodo metadata checklist

Zenodo does not impose a citation style or a paper template. The reference format above is
our choice. What Zenodo asks for is metadata describing the record:

| Field | Value for this project |
|---|---|
| Resource type | Preprint (for the paper); Software (for the code, as a separate record) |
| Title | final paper title |
| Publication date | date of upload |
| Creators | Rishi Vora, Dipa Vora (plus ORCID if registered) |
| Description | the abstract, as plain text |
| License | CC BY 4.0 for the paper; MIT or Apache-2.0 for the code |
| Keywords | introversion, extraversion, personality classification, machine learning, data leakage, reproducibility |
| Related identifiers | cite datasets [3][4][5]; link the paper and code records to each other |
| Contributors | anyone who advised but is not an author |

A DOI can be reserved before publishing, so it can be printed on the paper's title page.
