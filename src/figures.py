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


def effects():
    # effect sizes and 95% intervals from intervals.py, random forest
    data = [
        ('Ambiverts dropped\nvs. kept', 23.48, 0.56),
        ('Resampling before\nvs. inside folds', 20.61, 0.42),
        ('Duplicates kept\nvs. removed', -1.47, 0.38),
        ('Selection before\nvs. inside folds', 0.04, 0.56),
    ]
    names, values, errs = zip(*data)

    fig, ax = plt.subplots(figsize=(6, 3.5))
    ax.barh(range(len(values)), values, xerr=errs, color='0.4', height=0.6,
            error_kw={'ecolor': '0.1', 'capsize': 3, 'lw': 1})
    ax.axvline(0, color='0.1', lw=0.8)
    ax.set_yticks(range(len(names)))
    ax.set_yticklabels(names, fontsize=8)
    ax.invert_yaxis()
    ax.set_xlabel('Change in accuracy (percentage points)', fontsize=10)
    for i, v in enumerate(values):
        ax.text(v + (0.7 if v >= 0 else -2.3), i, f'{v:+.1f}', va='center', fontsize=8)
    ax.set_xlim(-4, 27)
    fig.savefig('figures/effect_sizes.pdf', bbox_inches='tight')
    fig.savefig('figures/effect_sizes.png', dpi=150, bbox_inches='tight')
    plt.close(fig)


if __name__ == '__main__':
    heatmaps()
    effects()
    print('wrote overlap_heatmaps and effect_sizes to figures/')
