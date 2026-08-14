import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.impute import SimpleImputer
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, balanced_accuracy_score
from xgboost import XGBClassifier

from prep import SEED, load_kaggle, load_mies


def build_models(n_classes=2):
    objective = 'multi:softprob' if n_classes > 2 else 'binary:logistic'
    return {
        'Random Forest': RandomForestClassifier(n_estimators=100, random_state=SEED),
        'Logistic Regression': Pipeline([
            ('impute', SimpleImputer(strategy='median')),
            ('scale', StandardScaler()),
            ('clf', LogisticRegression(max_iter=2000))
        ]),
        'XGBoost': XGBClassifier(
            max_depth=3, n_estimators=100, random_state=SEED,
            objective=objective, eval_metric='logloss'
        ),
    }


def evaluate(X, y, label):
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, stratify=y, random_state=SEED
    )
    rows = []
    for name, model in build_models(len(np.unique(y))).items():
        # random forest cannot take NaN, so fill for that one only
        if name == 'Random Forest' and X_train.isna().any().any():
            Xtr = X_train.fillna(X_train.median())
            Xte = X_test.fillna(X_train.median())
        else:
            Xtr, Xte = X_train, X_test
        model.fit(Xtr, y_train)
        pred = model.predict(Xte)
        rows.append({
            'dataset': label,
            'model': name,
            'accuracy': accuracy_score(y_test, pred),
            'balanced_accuracy': balanced_accuracy_score(y_test, pred),
        })
    return rows


if __name__ == '__main__':
    results = []

    X, y = load_kaggle()
    results += evaluate(X, y, 'Kaggle')

    X, y = load_mies(classes=2)
    results += evaluate(X, y, 'MIES (2 class)')

    X, y = load_mies(classes=3)
    results += evaluate(X, y, 'MIES (3 class)')

    table = pd.DataFrame(results)
    table[['accuracy', 'balanced_accuracy']] = table[['accuracy', 'balanced_accuracy']].round(4)
    print(table.to_string(index=False))
    table.to_csv('baseline_results.csv', index=False)
