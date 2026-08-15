# Preprocessing choices and reported accuracy in introvert-extrovert classification

Published accuracies for classifying introverts and extroverts range from about 73% to over
95%. This project measures how much of that spread comes from preprocessing decisions rather
than from the data itself.

Four decisions are tested, and the effect of each is measured on the same datasets:

| Decision | Change in accuracy |
|---|---|
| Resampling before splitting vs. inside cross-validation folds | 21.1 points |
| Keeping vs. dropping respondents who identify as neither | 18.2 points |
| Keeping vs. removing duplicate rows | 5.5 points |
| Feature selection before splitting vs. inside folds | 0.0 points |

## Data

Neither dataset is included here. Download them and place them in `data/`:

- **Kaggle.** Extrovert vs. Introvert Behavior Data.
  https://www.kaggle.com/datasets/rakeshkapilavai/extrovert-vs-introvert-behavior-data
  Save as `data/personality_dataset.csv`

- **MIES.** Multidimensional Introversion-Extraversion Scales, Open-Source Psychometrics
  Project. https://openpsychometrics.org/tests/MIES/development/
  Unzip and save the tab-separated file as `data/MIES_data.csv`

- **BIG5** (optional, used for one comparison figure).
  https://openpsychometrics.org/tests/BIG5.php
  Save as `data/BIG5_data.csv`

MIES asks respondents whether they identify as introvert, extravert, or neither. Results differ
substantially depending on whether the third group is kept, so both versions are reported.

## Setup

```
pip install -r requirements.txt
```

XGBoost needs OpenMP. On macOS: `brew install libomp`.

## Running

From the project root:

```
python src/models.py         # baseline accuracy, all datasets and models
python src/dataset_stats.py  # how much the questions overlap
python src/leakage.py        # duplicate rows and their effect
python src/ordering.py       # resampling and feature-selection order
python src/redundancy.py     # SHAP, ablation curve, leave-top-item-out (slow)
python src/figures.py        # figures
```

Each writes a CSV to the project root. `redundancy.py` and `figures.py` also write to
`figures/`.

## Files

- `src/prep.py` loading and cleaning for both datasets
- `src/models.py` baseline models
- `src/dataset_stats.py` correlation between questions, per dataset
- `src/leakage.py` duplicate overlap between train and test
- `src/ordering.py` effect of preprocessing order
- `src/redundancy.py` feature importance and ablation
- `src/figures.py` correlation heatmaps and effect sizes

## Reproducibility

All scripts use a fixed random seed. Package versions are pinned in `requirements.txt`;
Random Forest results on MIES shift by about 0.002 under older scikit-learn releases.
