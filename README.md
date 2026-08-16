# Measuring How Preprocessing Choices Affect Reported Accuracy in Introvert-Extrovert Classification

Python code for the paper entitled: "Measuring How Preprocessing Choices Affect Reported Accuracy
in Introvert-Extrovert Classification" (2026). R. Vora.
https://doi.org/10.5281/zenodo.21955709

Abstract: Reported accuracies for classifying introverts and extroverts from self-report data vary
widely. I measure how much four preparation decisions move that number, holding the data and the
models fixed: whether to keep respondents who identify as neither introvert nor extrovert, whether
to resample before or inside cross-validation folds, whether to remove duplicate rows, and whether
to select features before or inside folds. Each condition is evaluated with 5-fold cross-validation
repeated 10 times. Dropping the ambivert group raises balanced accuracy by 22.8 to 23.5 points.
Applying SMOTE before splitting rather than within each training fold raises it by 5.7 to 20.6
points on the imbalanced dataset depending on the model, and by under 0.5 points on the balanced one. Keeping duplicate
rows changes it by about one point. Feature-selection order shows no measurable effect.

## Setup

```
pip install -r requirements.txt
```

XGBoost requires OpenMP; on macOS install it with `brew install libomp`.

## Data

Not redistributed here. Download each and place it in `data/`.

| File | Source |
|---|---|
| `data/personality_dataset.csv` | https://www.kaggle.com/datasets/rakeshkapilavai/extrovert-vs-introvert-behavior-data |
| `data/MIES_data.csv` | https://openpsychometrics.org/tests/MIES/development/ |
| `data/BIG5_data.csv` | https://openpsychometrics.org/tests/BIG5.php |

MIES and BIG5 arrive as zip archives; extract the tab-separated file and rename as shown.

## Usage

Run from the project root. Output lands in `results/` and `figures/`.

```
python src/models.py          # Table 1
python src/intervals.py       # Table 2
python src/dataset_stats.py   # Table 3
python src/leakage.py         # duplicate overlap
python src/ordering.py        # preprocessing order
python src/redundancy.py      # feature importance and ablation
python src/figures.py         # Figures 1 and 2
```

`intervals.py` and `redundancy.py` take several minutes. The others finish in seconds.

## License

MIT. Cite via `CITATION.cff`.
