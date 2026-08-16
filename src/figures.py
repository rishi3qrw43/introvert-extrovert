import numpy as np
import pandas as pd
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

from prep import load_kaggle, load_mies
from dataset_stats import big5_extraversion

LABELS = {
    'Time_spent_Alone': 'time alone',
    'Stage_fear': 'stage fear',
    'Social_event_attendance': 'social events',
    'Going_outside': 'going outside',
    'Drained_after_socializing': 'drained',
    'Friends_circle_size': 'friends',
    'Post_frequency': 'posting',
}


def heatmaps():
    kaggle, _ = load_kaggle()
    kaggle = kaggle.rename(columns=LABELS)
    big5 = big5_extraversion().dropna()

    fig, axes = plt.subplots(1, 2, figsize=(9, 4))
    for ax, data, title in [(axes[0], kaggle, 'Kaggle behaviours (7 items)'),
                            (axes[1], big5, 'BIG5 extraversion scale (10 items)')]:
        corr = data.corr().abs()
        im = ax.imshow(corr, vmin=0, vmax=1, cmap='Greys')
        ax.set_xticks(range(len(corr)))
        ax.set_yticks(range(len(corr)))
        ax.set_xticklabels(corr.columns, rotation=90, fontsize=7)
        ax.set_yticklabels(corr.columns, fontsize=7)
        ax.set_title(title, fontsize=10)

    fig.colorbar(im, ax=axes, shrink=0.75, label='absolute correlation')
    fig.savefig('figures/overlap_heatmaps.pdf', bbox_inches='tight')
    fig.savefig('figures/overlap_heatmaps.png', dpi=150, bbox_inches='tight')
    plt.close(fig)


CONDITIONS = [
    ('Ambiverts dropped vs. kept', 'Ambiverts dropped\nvs. kept'),
    ('Resampling before vs. inside folds', 'Resampling before\nvs. inside folds'),
    ('Duplicates kept vs. removed', 'Duplicates kept\nvs. removed'),
    ('Selection before vs. inside folds', 'Selection before\nvs. inside folds'),
]
MODELS = [('Random Forest', '0.25'), ('Logistic Regression', '0.5'), ('XGBoost', '0.72')]


def effects():
    table = pd.read_csv('results/interval_results.csv').set_index(['model', 'effect'])
    keys = [k for k, _ in CONDITIONS]

    fig, ax = plt.subplots(figsize=(6.5, 4))
    height = 0.26
    for i, (model, shade) in enumerate(MODELS):
        rows = table.loc[model].loc[keys]
        y = np.arange(len(keys)) + (i - 1) * height
        ax.barh(y, rows['points'], height=height, color=shade, label=model,
                xerr=(rows['high'] - rows['low']) / 2,
                error_kw={'ecolor': '0.1', 'capsize': 2, 'lw': 0.8})

    ax.axvline(0, color='0.1', lw=0.8)
    ax.set_yticks(range(len(keys)))
    ax.set_yticklabels([label for _, label in CONDITIONS], fontsize=8)
    ax.invert_yaxis()
    ax.set_xlabel('Change in balanced accuracy (percentage points)', fontsize=10)
    ax.tick_params(axis='x', labelsize=8)
    ax.legend(fontsize=8, loc='lower right', frameon=False)
    ax.set_xlim(-4, 27)
    fig.savefig('figures/effect_sizes.pdf', bbox_inches='tight')
    fig.savefig('figures/effect_sizes.png', dpi=150, bbox_inches='tight')
    plt.close(fig)


if __name__ == '__main__':
    heatmaps()
    effects()
    print('wrote overlap_heatmaps and effect_sizes to figures/')
