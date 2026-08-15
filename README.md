# Introvert-extrovert classification: how preprocessing choices affect reported accuracy

Machine learning studies of introvert/extrovert classification report accuracies ranging from
about 73% to over 95%. This project measures how much of that spread comes from data
preparation choices rather than from differences in the underlying data.

## Data

Neither dataset is included in this repository. Download them:

- **Kaggle.** Extrovert vs. Introvert Behavior Data
  https://www.kaggle.com/datasets/rakeshkapilavai/extrovert-vs-introvert-behavior-data
  Save as `data/personality_dataset.csv`

- **MIES.** Multidimensional Introversion-Extraversion Scales, from the Open-Source Psychometrics Project
  https://openpsychometrics.org/tests/MIES/development/
  Unzip and save the tab-separated file as `data/MIES_data.csv`

## Setup

```
pip install -r requirements.txt
```

## Running

From the project root:

```
python src/models.py
```

Writes `baseline_results.csv`.

## Files

- `src/prep.py`: loading and cleaning for both datasets
- `src/models.py`: baseline models, all dataset versions

## Notes

MIES asks respondents whether they identify as introvert, extravert, or neither. Results
differ substantially depending on whether the "neither" group is kept, so both versions
are reported.
