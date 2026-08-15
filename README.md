# Preprocessing choices account for a 23-point spread in reported accuracy for introvert-extrovert classification

Published accuracies for classifying introverts and extroverts from self-report data range from
roughly 73% to over 95%. This code measures how much of that spread is produced by preprocessing
decisions rather than by differences in the data itself.

Four decisions are isolated and measured on the same datasets, each across 50 folds (5-fold
cross-validation, 10 repeats) with 95% intervals:

| Decision | Effect on balanced accuracy | 95% interval |
|---|---|---|
| Excluding respondents who identify as neither introvert nor extravert | +22.9 to +23.5 points | 22.3 to 24.0 |
| Applying resampling before splitting rather than inside folds | +18.3 to +20.7 points | 17.9 to 21.1 |
| Retaining duplicate rows | -0.5 to -1.5 points | -1.9 to -0.1 |
| Selecting features before splitting rather than inside folds | +0.1 points | -0.46 to +0.63 |

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

MIES asks respondents to identify as introvert, extravert, or neither. Both the two-class and
three-class versions are reported, since the choice materially changes the result.

## Usage

Run from the project root.

| Command | Output |
|---|---|
| `python src/models.py` | `baseline_results.csv` |
| `python src/dataset_stats.py` | `dataset_stats.csv` |
| `python src/leakage.py` | `leakage_results.csv` |
| `python src/ordering.py` | `ordering_results.csv` |
| `python src/intervals.py` | `interval_results.csv` |
| `python src/redundancy.py` | `redundancy_results.csv`, ablation figures |
| `python src/figures.py` | correlation heatmaps, effect-size chart |

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

Three models are used throughout: random forest, logistic regression, and XGBoost.

## Reproducibility

All scripts use a fixed random seed. Preprocessing steps are contained within scikit-learn
pipelines so that they are fitted on training folds only. Random forest results on MIES shift by
approximately 0.002 under scikit-learn releases earlier than the pinned version.

## Citation

See `CITATION.cff`.

## License

MIT. See `LICENSE`.
