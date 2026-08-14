import pandas as pd
import numpy as np

SEED = 42

KAGGLE_FEATURES = [
    'Time_spent_Alone', 'Stage_fear', 'Social_event_attendance',
    'Going_outside', 'Drained_after_socializing', 'Friends_circle_size',
    'Post_frequency'
]

KAGGLE_NUMERIC = [
    'Time_spent_Alone', 'Social_event_attendance', 'Going_outside',
    'Friends_circle_size', 'Post_frequency'
]

MIES_ITEMS = [f'Q{i}A' for i in range(1, 92)]


def load_kaggle(path='data/personality_dataset.csv'):
    df = pd.read_csv(path)
    df['Stage_fear'] = df['Stage_fear'].map({'Yes': 1, 'No': 0})
    df['Drained_after_socializing'] = df['Drained_after_socializing'].map({'Yes': 1, 'No': 0})
    df['Personality'] = df['Personality'].map({'Introvert': 0, 'Int': 0, 'Extrovert': 1})
    df = df.dropna().reset_index(drop=True)
    for c in KAGGLE_NUMERIC:
        df[c] = df[c].round()
    return df[KAGGLE_FEATURES], df['Personality'].values


def load_mies(path='data/MIES_data.csv', classes=2):
    df = pd.read_csv(path, sep='\t')
    if classes == 2:
        df = df[df['IE'].isin([1, 2])]
        y = (df['IE'] == 2).astype(int).values
    elif classes == 3:
        df = df[df['IE'].isin([1, 2, 3])]
        y = (df['IE'] - 1).values
    else:
        raise ValueError('classes must be 2 or 3')
    X = df[MIES_ITEMS].astype(float).replace(0, np.nan)
    return X, y
