import numpy as np
import pandas as pd

from prep import load_kaggle, load_mies


def redundancy(X, label):
    X = X.dropna()
    corr = X.corr().values
    upper = np.triu_indices_from(corr, k=1)
    pairs = np.abs(corr[upper])

    return {
        'dataset': label,
        'items': X.shape[1],
        'n': len(X),
        'mean_correlation': round(pairs.mean(), 3),
        'min_correlation': round(pairs.min(), 3),
        'max_correlation': round(pairs.max(), 3),
    }


def big5_extraversion(path='data/BIG5_data.csv'):
    df = pd.read_csv(path, sep='\t')
    items = [f'E{i}' for i in range(1, 11)]
    reversed_items = ['E2', 'E4', 'E6', 'E8', 'E10']
    X = df[items].replace(0, np.nan)
    X[reversed_items] = 6 - X[reversed_items]
    return X


if __name__ == '__main__':
    rows = []

    X, _ = load_kaggle()
    rows.append(redundancy(X, 'Kaggle'))

    X, _ = load_mies(classes=3)
    rows.append(redundancy(X, 'MIES'))

    try:
        rows.append(redundancy(big5_extraversion(), 'BIG5 extraversion'))
    except FileNotFoundError:
        print('BIG5 file not found, skipping\n')

    table = pd.DataFrame(rows)
    print(table.to_string(index=False))
    table.to_csv('results/dataset_stats.csv', index=False)
