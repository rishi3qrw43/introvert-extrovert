import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

from prep import SEED, load_kaggle
from models import build_models


def duplicate_overlap(X_train, X_test):
    """Share of test rows that appear identically in the training set."""
    train_rows = set(map(tuple, X_train.round(6).to_numpy()))
    hits = sum(tuple(row) in train_rows for row in X_test.round(6).to_numpy())
    return hits / len(X_test)


def inflate(X, y, copies=5, noise=0.3):
    """Rebuild the enlarged dataset: exact copies plus one noise-perturbed copy."""
    rng = np.random.default_rng(SEED)
    jittered = X.copy()
    for c in jittered.columns:
        if jittered[c].nunique() > 2:
            jittered[c] = (jittered[c] + rng.normal(0, noise, len(X))).round()
    X_big = pd.concat([X] * copies + [jittered], ignore_index=True)
    y_big = np.tile(y, copies + 1)
    return X_big, y_big


def score(X, y, model_name):
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, stratify=y, random_state=SEED
    )
    model = build_models()[model_name]
    model.fit(X_train, y_train)
    return (accuracy_score(y_test, model.predict(X_test)),
            duplicate_overlap(X_train, X_test))


if __name__ == '__main__':
    X, y = load_kaggle()
    rows = []

    for model_name in build_models():
        acc, overlap = score(X, y, model_name)
        rows.append({'condition': 'original', 'model': model_name,
                     'n': len(X), 'accuracy': round(acc, 4),
                     'test_rows_seen_in_training': round(overlap, 3)})

        X_big, y_big = inflate(X, y)
        acc, overlap = score(X_big, y_big, model_name)
        rows.append({'condition': 'duplicated before split', 'model': model_name,
                     'n': len(X_big), 'accuracy': round(acc, 4),
                     'test_rows_seen_in_training': round(overlap, 3)})

        unique = X.drop_duplicates()
        acc, overlap = score(unique, y[unique.index], model_name)
        rows.append({'condition': 'de-duplicated', 'model': model_name,
                     'n': len(unique), 'accuracy': round(acc, 4),
                     'test_rows_seen_in_training': round(overlap, 3)})

    table = pd.DataFrame(rows).sort_values(['model', 'condition'])
    print(table.to_string(index=False))
    table.to_csv('results/leakage_results.csv', index=False)
