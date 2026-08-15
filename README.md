# Measuring How Preprocessing Choices Affect Reported Accuracy in Introvert-Extrovert Classification

Python code for the paper entitled: "Measuring How Preprocessing Choices Affect Reported Accuracy
in Introvert-Extrovert Classification" (2026). R. Vora.

Abstract: Reported accuracies for classifying introverts and extroverts from self-report data vary
widely. Fieri et al. report 73.5% and 95.5% on the same dataset depending on how it was prepared
before training. I measure how much four preparation decisions move that number, holding the data
and the models fixed. Using a public Kaggle dataset of 2,900 responses to seven behavioral
questions and the Multidimensional Introversion-Extraversion Scales (MIES; 7,188 respondents, 91
items), each condition is evaluated with 5-fold cross-validation repeated 10 times, and
differences are reported in percentage points of balanced accuracy with 95% intervals. Dropping
respondents who identify as neither introvert nor extrovert raises balanced accuracy by 22.8 to
23.5 points, although this changes the classification task rather than only the preprocessing.
Applying SMOTE to the full dataset before splitting, rather than within each training fold, raises
it by 18.4 to 20.6 points on the imbalanced dataset and by under 0.5 points on the balanced one.
Keeping duplicate rows changes it by about one point. Selecting the top 15 features by ANOVA
F-score before splitting shows no evidence of a systematic effect, with all three intervals
containing zero. My three-class MIES results fall within a third of a point of two published
studies that retained the ambivert group. Accuracies for this task are therefore not comparable
across studies unless these choices are stated.

## Results

Four decisions are isolated and measured on the same datasets, each across 50 folds (5-fold
cross-validation, 10 repeats) with 95% intervals.

| Decision | Effect on balanced accuracy | 95% interval |
|---|---|---|
| Excluding respondents who identify as neither introvert nor extrovert | +22.8 to +23.5 points | 22.2 to 24.0 |
| Applying resampling before splitting rather than inside folds | +18.4 to +20.6 points | 18.0 to 21.0 |
| Retaining duplicate rows | -0.5 to -1.5 points | -1.9 to -0.1 |
| Selecting features before splitting rather than inside folds | -0.0 to +0.1 points | -0.52 to +0.60 |

The final row is the only one whose interval includes zero, so feature-selection order has no
measurable effect while the other three do.

## Requirements

```
pip install -r requirements.txt
```

Package versions are pinned. XGBoost requires OpenMP; on macOS install it with
`brew install libomp`.

## Data

The datasets are not redistributed here. Download each and place it in `data/`.

| File | Source |
|---|---|
| `data/personality_dataset.csv` | https://www.kaggle.com/datasets/rakeshkapilavai/extrovert-vs-introvert-behavior-data |
| `data/MIES_data.csv` | https://openpsychometrics.org/tests/MIES/development/ |
| `data/BIG5_data.csv` | https://openpsychometrics.org/tests/BIG5.php |

MIES and BIG5 are distributed as zip archives; extract the tab-separated data file and rename
it as shown. BIG5 is optional and used only for one comparison figure.

MIES asks respondents to identify as introvert, extrovert, or neither. Both the two-class and
three-class versions are reported, since the choice materially changes the result.

## Usage

Run from the project root.

| Command | Output | Where it appears in the paper |
|---|---|---|
| `python src/models.py` | `baseline_results.csv` | Table 1 |
| `python src/dataset_stats.py` | `dataset_stats.csv` | Table 3 |
| `python src/leakage.py` | `leakage_results.csv` | Section V.E |
| `python src/ordering.py` | `ordering_results.csv` | Section V.D, V.F |
| `python src/intervals.py` | `interval_results.csv` | Table 2, Figure 1 |
| `python src/redundancy.py` | `redundancy_results.csv`, ablation figures | Figure 3 |
| `python src/figures.py` | correlation heatmaps, effect-size chart | Figures 1, 2 |

`redundancy.py` and `intervals.py` take several minutes; the others complete in seconds.

## Contents

| Path | Purpose |
|---|---|
| `src/prep.py` | Loading and cleaning for both datasets |
| `src/models.py` | Baseline models across dataset versions |
| `src/dataset_stats.py` | Correlation between questionnaire items |
| `src/leakage.py` | Duplicate overlap between training and test sets |
| `src/ordering.py` | Effect of preprocessing order |
| `src/intervals.py` | Repeated cross-validation with confidence intervals |
| `src/redundancy.py` | Feature importance and ablation |
| `src/figures.py` | Figure generation |
| `figures/` | PDF and PNG output |
| `paper/` | Build script for the manuscript |

Three models are used throughout: random forest, logistic regression, and XGBoost.

## Reproducibility

All scripts use a fixed random seed of 42. Preprocessing steps are contained within scikit-learn
pipelines so that they are fitted on training folds only, except where a condition deliberately
does otherwise in order to measure the effect. Random forest results on MIES shift by
approximately 0.002 under scikit-learn releases earlier than the pinned version.

## Citation

See `CITATION.cff`.

## License

MIT. See `LICENSE`.
