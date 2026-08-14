import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.impute import SimpleImputer
from sklearn.ensemble import RandomForestClassifier, HistGradientBoostingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, balanced_accuracy_score

from prep import SEED, load_kaggle, load_mies


def build_models():
    return {
        'Random Forest': Pipeline([
            ('impute', SimpleImputer(strategy='median')),
            ('clf', RandomForestClassifier(n_estimators=100, random_state=SEED))
        ]),
        'Logistic Regression': Pipeline([
            ('impute', SimpleImputer(strategy='median')),
            ('scale', StandardScaler()),
            ('clf', LogisticRegression(max_iter=2000))
        ]),
        'Gradient Boosting': HistGradientBoostingClassifier(
            max_depth=3, max_iter=100, random_state=SEED
        ),
    }


def evaluate(X, y, label):
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, stratify=y, random_state=SEED
    )
    rows = []
    for name, model in build_models().items():
        model.fit(X_train, y_train)
        pred = model.predict(X_test)
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
