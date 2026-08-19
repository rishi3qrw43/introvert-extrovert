import numpy as np
import pandas as pd
import shap
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
from sklearn.metrics import balanced_accuracy_score

from prep import SEED, load_kaggle, load_mies
from models import build_models


def shap_importance(name, model, X_train):
    """Mean absolute SHAP value per feature, computed on the training rows only.

    Explaining the training rows keeps the item ranking independent of the
    held-out rows the ablation is later scored on. Explaining the test rows
    would let the ranking see the evaluation set.
    """
    if name == 'Logistic Regression':
        # the model is a pipeline, so push the data through the earlier steps
        # and explain the linear step on its own
        prepared = model[:-1].transform(X_train)
        masker = shap.maskers.Independent(prepared, max_samples=len(prepared))
        explainer = shap.LinearExplainer(model[-1], masker)
        values = explainer.shap_values(prepared)
    else:
        inner = model[-1] if hasattr(model, 'steps') else model
        data = model[:-1].transform(X_train) if hasattr(model, 'steps') else X_train
        explainer = shap.TreeExplainer(inner)
        values = explainer.shap_values(data)

    values = np.array(values)
    if values.ndim == 3:
        values = np.abs(values).mean(axis=2)
    return pd.Series(np.abs(values).mean(axis=0), index=X_train.columns)


def ablation(model_name, X_train, X_test, y_train, y_test, order):
    """Drop the lowest-ranked feature one at a time, retraining each round."""
    remaining = list(order)
    scores = []
    while len(remaining) > 1:
        model = build_models()[model_name]
        model.fit(X_train[remaining], y_train)
        scores.append((len(remaining),
                       balanced_accuracy_score(y_test, model.predict(X_test[remaining]))))
        remaining.pop()
    return scores


def run(X, y, label):
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, stratify=y, random_state=SEED
    )

    importances = {}
    top_items = {}
    drop_results = []
    curves = {}

    for name, model in build_models().items():
        model.fit(X_train, y_train)
        full = balanced_accuracy_score(y_test, model.predict(X_test))

        imp = shap_importance(name, model, X_train).sort_values(ascending=False)
        importances[name] = imp
        top_items[name] = imp.index[0]

        # leave out only the top-ranked item
        without_top = [c for c in X.columns if c != imp.index[0]]
        model = build_models()[name]
        model.fit(X_train[without_top], y_train)
        reduced = balanced_accuracy_score(y_test, model.predict(X_test[without_top]))

        drop_results.append({
            'dataset': label,
            'model': name,
            'top_item': imp.index[0],
            'full': round(full, 4),
            'without_top': round(reduced, 4),
            'drop': round(full - reduced, 4),
        })

        curves[name] = ablation(name, X_train, X_test, y_train, y_test, list(imp.index))

    return importances, top_items, drop_results, curves


STYLES = [('0.15', '-', 'o'), ('0.45', '--', 's'), ('0.65', ':', '^')]


def plot_curves(curves, stem):
    fig, ax = plt.subplots(figsize=(5.5, 4))
    for (name, points), (shade, dash, mark) in zip(curves.items(), STYLES):
        n, score = zip(*points)
        ax.plot(n, score, label=name, color=shade, linestyle=dash,
                marker=mark, markersize=4, linewidth=1.2)
    ax.axhline(0.5, color='0.1', lw=0.8)
    ax.text(ax.get_xlim()[0], 0.512, 'chance', fontsize=8, color='0.1')
    # full scale, so a flat curve reads as flat rather than as noise
    ax.set_ylim(0.45, 1.0)
    ax.set_xlabel('Questions remaining', fontsize=11)
    ax.set_ylabel('Balanced accuracy', fontsize=11)
    ax.legend(fontsize=9, frameon=False, loc='lower right')
    fig.savefig(f'figures/{stem}.pdf', bbox_inches='tight')
    fig.savefig(f'figures/{stem}.png', dpi=150, bbox_inches='tight')
    plt.close(fig)


if __name__ == '__main__':
    all_drops = []
    all_tops = {}

    X, y = load_kaggle()
    imp_k, tops_k, drops_k, curves_k = run(X, y, 'Kaggle')
    all_drops += drops_k
    all_tops['Kaggle'] = tops_k
    plot_curves(curves_k, 'ablation_kaggle')

    X, y = load_mies(classes=3)
    imp_m, tops_m, drops_m, curves_m = run(X, y, 'MIES (3 class)')
    all_drops += drops_m
    all_tops['MIES (3 class)'] = tops_m
    plot_curves(curves_m, 'ablation_mies')

    print('Top-ranked question by model')
    for dataset, tops in all_tops.items():
        print(f'  {dataset}')
        for model, item in tops.items():
            print(f'    {model:22s} {item}')

    print()
    drops = pd.DataFrame(all_drops)
    print(drops.to_string(index=False))
    drops.to_csv('results/redundancy_results.csv', index=False)

    print()
    print('Importance rank agreement (Spearman)')
    for dataset, imps in [('Kaggle', imp_k), ('MIES (3 class)', imp_m)]:
        names = list(imps)
        for i in range(len(names)):
            for j in range(i + 1, len(names)):
                a = imps[names[i]].rank()
                b = imps[names[j]].rank().reindex(a.index)
                print(f'  {dataset:15s} {names[i][:12]:12s} vs {names[j][:12]:12s} '
                      f'{a.corr(b, method="spearman"):+.2f}')
