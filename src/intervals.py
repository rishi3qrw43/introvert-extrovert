import numpy as np
import pandas as pd
from sklearn.model_selection import RepeatedStratifiedKFold, cross_val_score
from sklearn.feature_selection import SelectKBest, f_classif
from sklearn.impute import SimpleImputer
from sklearn.pipeline import Pipeline
from imblearn.over_sampling import SMOTE
from imblearn.pipeline import Pipeline as ImbPipeline

from prep import SEED, load_kaggle, load_mies
from models import build_models

REPEATS = 10
FOLDS = 5
N_FEATURES = 15


def cv():
    return RepeatedStratifiedKFold(n_splits=FOLDS, n_repeats=REPEATS, random_state=SEED)


def fold_scores(model, X, y):
    return cross_val_score(model, X, y, cv=cv(), scoring='balanced_accuracy', n_jobs=-1)


def interval(a, b):
    """Difference in mean scores with a 95% interval from the pooled fold variance."""
    diff = a.mean() - b.mean()
    se = np.sqrt(a.var(ddof=1) / len(a) + b.var(ddof=1) / len(b))
    return 100 * diff, 100 * 1.96 * se


def resampling_effect(X, y, model):
    before = SMOTE(random_state=SEED).fit_resample(
        SimpleImputer(strategy='median').fit_transform(X), y)
    a = fold_scores(model, *before)
    inside = ImbPipeline([
        ('impute', SimpleImputer(strategy='median')),
        ('smote', SMOTE(random_state=SEED)),
        ('clf', model),
    ])
    b = fold_scores(inside, X, y)
    return interval(a, b)


def selection_effect(X, y, model, k=N_FEATURES):
    k = min(k, X.shape[1])
    filled = SimpleImputer(strategy='median').fit_transform(X)
    chosen = SelectKBest(f_classif, k=k).fit_transform(filled, y)
    a = fold_scores(model, chosen, y)
    inside = Pipeline([
        ('impute', SimpleImputer(strategy='median')),
        ('select', SelectKBest(f_classif, k=k)),
        ('clf', model),
    ])
    b = fold_scores(inside, X, y)
    return interval(a, b)


def duplication_effect(X, y, model):
    unique = X.drop_duplicates()
    a = fold_scores(model, X, y)
    b = fold_scores(model, unique, y[unique.index])
    return interval(a, b)


def ambivert_effect(model):
    X2, y2 = load_mies(classes=2)
    X3, y3 = load_mies(classes=3)
    return interval(fold_scores(model, X2, y2), fold_scores(model, X3, y3))


if __name__ == '__main__':
    kaggle = load_kaggle()
    mies3 = load_mies(classes=3)
    rows = []

    for name, model in build_models().items():
        d, ci = ambivert_effect(model)
        rows.append(('Ambiverts dropped vs. kept', 'MIES', name, d, ci))

        d, ci = resampling_effect(*mies3, model)
        rows.append(('Resampling before vs. inside folds', 'MIES', name, d, ci))

        d, ci = duplication_effect(*kaggle, model)
        rows.append(('Duplicates kept vs. removed', 'Kaggle', name, d, ci))

        d, ci = selection_effect(*mies3, model)
        rows.append(('Selection before vs. inside folds', 'MIES', name, d, ci))

    table = pd.DataFrame(rows, columns=['effect', 'dataset', 'model', 'points', 'ci95'])
    table['low'] = (table['points'] - table['ci95']).round(2)
    table['high'] = (table['points'] + table['ci95']).round(2)
    table['points'] = table['points'].round(2)
    table['crosses_zero'] = (table['low'] < 0) & (table['high'] > 0)
    table = table.drop(columns='ci95')

    print(table.to_string(index=False))
    table.to_csv('results/interval_results.csv', index=False)
