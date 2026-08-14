import numpy as np
import pandas as pd
from sklearn.model_selection import StratifiedKFold, cross_val_score
from sklearn.feature_selection import SelectKBest, f_classif
from sklearn.impute import SimpleImputer
from sklearn.pipeline import Pipeline
from imblearn.over_sampling import SMOTE
from imblearn.pipeline import Pipeline as ImbPipeline

from prep import SEED, load_kaggle, load_mies
from models import build_models

CV = StratifiedKFold(n_splits=5, shuffle=True, random_state=SEED)
N_FEATURES = 15


def smote_before(X, y, model):
    """Resample the whole dataset, then cross-validate. Synthetic rows built from
    training points can land in the test fold."""
    filled = SimpleImputer(strategy='median').fit_transform(X)
    X_res, y_res = SMOTE(random_state=SEED).fit_resample(filled, y)
    return cross_val_score(model, X_res, y_res, cv=CV, scoring='balanced_accuracy').mean()


def smote_inside(X, y, model):
    """Resample within each training fold only. Test folds stay untouched."""
    pipe = ImbPipeline([
        ('impute', SimpleImputer(strategy='median')),
        ('smote', SMOTE(random_state=SEED)),
        ('clf', model),
    ])
    return cross_val_score(pipe, X, y, cv=CV, scoring='balanced_accuracy').mean()


def select_before(X, y, model, k=N_FEATURES):
    """Pick the top k features using the whole dataset, then cross-validate."""
    filled = SimpleImputer(strategy='median').fit_transform(X)
    chosen = SelectKBest(f_classif, k=min(k, X.shape[1])).fit_transform(filled, y)
    return cross_val_score(model, chosen, y, cv=CV, scoring='balanced_accuracy').mean()


def select_inside(X, y, model, k=N_FEATURES):
    """Pick the top k features separately within each training fold."""
    pipe = Pipeline([
        ('impute', SimpleImputer(strategy='median')),
        ('select', SelectKBest(f_classif, k=min(k, X.shape[1]))),
        ('clf', model),
    ])
    return cross_val_score(pipe, X, y, cv=CV, scoring='balanced_accuracy').mean()


def run(X, y, label):
    rows = []
    for name, model in build_models().items():
        rows.append({
            'dataset': label,
            'model': name,
            'smote_before_split': round(smote_before(X, y, model), 4),
            'smote_inside_folds': round(smote_inside(X, y, model), 4),
            'select_before_split': round(select_before(X, y, model), 4),
            'select_inside_folds': round(select_inside(X, y, model), 4),
        })
    return rows


if __name__ == '__main__':
    rows = []

    X, y = load_kaggle()
    rows += run(X, y, 'Kaggle')

    X, y = load_mies(classes=3)
    rows += run(X, y, 'MIES (3 class)')

    table = pd.DataFrame(rows)
    table['smote_gap'] = (table['smote_before_split'] - table['smote_inside_folds']).round(4)
    table['select_gap'] = (table['select_before_split'] - table['select_inside_folds']).round(4)

    print(table.to_string(index=False))
    table.to_csv('ordering_results.csv', index=False)
