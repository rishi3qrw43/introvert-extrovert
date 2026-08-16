const fs = require('fs');
const {
  Document, Packer, Paragraph, TextRun, AlignmentType, Footer, PageNumber,
  ImageRun, Table, TableRow, TableCell, WidthType, ShadingType
} = require('docx');

const FIG = '../figures/';

const P = (text, opts = {}) => new Paragraph({
  spacing: { after: opts.after ?? 160, line: 276 },
  alignment: opts.align ?? AlignmentType.JUSTIFIED,
  children: [new TextRun({ text, size: 21, italics: opts.italics, bold: opts.bold })]
});

const RUNS = (runs, opts = {}) => new Paragraph({
  spacing: { after: opts.after ?? 160, line: 276 },
  alignment: AlignmentType.JUSTIFIED,
  children: runs
});

const t = (text, o = {}) => new TextRun(Object.assign({ text, size: 21 }, o));

const BULLET = (runs) => new Paragraph({
  bullet: { level: 0 },
  spacing: { after: 90, line: 276 },
  alignment: AlignmentType.JUSTIFIED,
  children: Array.isArray(runs) ? runs : [new TextRun({ text: runs, size: 21 })]
});

const H1 = (text) => new Paragraph({
  spacing: { before: 320, after: 140 },
  children: [new TextRun({ text, bold: true, size: 26 })]
});

const H2 = (text) => new Paragraph({
  spacing: { before: 220, after: 120 },
  children: [new TextRun({ text, bold: true, size: 22 })]
});

const CENTER = (text, o = {}) => new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { after: o.after ?? 60 },
  children: [new TextRun({ text, size: o.size ?? 21, bold: o.bold, italics: o.italics })]
});

const img = (file, w, h) => new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { before: 160, after: 60 },
  children: [new ImageRun({ type: 'png', data: fs.readFileSync(FIG + file), transformation: { width: w, height: h } })]
});

const cap = (text) => new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { after: 240 },
  children: [new TextRun({ text, size: 18 })]
});

const ref = (text) => new Paragraph({
  spacing: { after: 70 },
  indent: { left: 340, hanging: 340 },
  children: [new TextRun({ text, size: 19 })]
});

// ---------- tables ----------
const cell = (text, { bold = false, w = 1800, shade = null, align = AlignmentType.LEFT } = {}) => new TableCell({
  width: { size: w, type: WidthType.DXA },
  shading: shade ? { type: ShadingType.CLEAR, fill: shade } : undefined,
  margins: { top: 50, bottom: 50, left: 90, right: 90 },
  children: [new Paragraph({ alignment: align, children: [new TextRun({ text, bold, size: 19 })] })]
});
const row = (cells) => new TableRow({ children: cells });
const C = AlignmentType.CENTER;

const w1 = [2500, 1700, 1700, 1700];
const table1 = new Table({
  columnWidths: w1, width: { size: 7600, type: WidthType.DXA },
  rows: [
    row([cell('Dataset', { bold: true, w: w1[0], shade: 'EDEDED' }),
         cell('Random forest', { bold: true, w: w1[1], shade: 'EDEDED', align: C }),
         cell('Logistic regression', { bold: true, w: w1[2], shade: 'EDEDED', align: C }),
         cell('XGBoost', { bold: true, w: w1[3], shade: 'EDEDED', align: C })]),
    row([cell('Kaggle (7 items)', { w: w1[0] }), cell('0.910', { w: w1[1], align: C }), cell('0.912', { w: w1[2], align: C }), cell('0.921', { w: w1[3], align: C })]),
    row([cell('MIES, three classes', { w: w1[0] }), cell('0.736', { w: w1[1], align: C }), cell('0.734', { w: w1[2], align: C }), cell('0.728', { w: w1[3], align: C })]),
    row([cell('MIES, two classes', { w: w1[0] }), cell('0.918', { w: w1[1], align: C }), cell('0.920', { w: w1[2], align: C }), cell('0.916', { w: w1[3], align: C })]),
  ]
});

const w2 = [2600, 1900, 1500, 1600];
const table2 = new Table({
  columnWidths: w2, width: { size: 7600, type: WidthType.DXA },
  rows: [
    row([cell('Condition', { bold: true, w: w2[0], shade: 'EDEDED' }),
         cell('Model', { bold: true, w: w2[1], shade: 'EDEDED' }),
         cell('Difference', { bold: true, w: w2[2], shade: 'EDEDED', align: C }),
         cell('95% interval', { bold: true, w: w2[3], shade: 'EDEDED', align: C })]),

    row([cell('Ambiverts dropped', { w: w2[0] }), cell('Random forest', { w: w2[1] }), cell('+23.48', { w: w2[2], align: C }), cell('22.93 to 24.04', { w: w2[3], align: C })]),
    row([cell('', { w: w2[0] }), cell('Logistic regression', { w: w2[1] }), cell('+22.76', { w: w2[2], align: C }), cell('22.20 to 23.33', { w: w2[3], align: C })]),
    row([cell('', { w: w2[0] }), cell('XGBoost', { w: w2[1] }), cell('+22.88', { w: w2[2], align: C }), cell('22.29 to 23.46', { w: w2[3], align: C })]),

    row([cell('Resampling before split', { w: w2[0] }), cell('Random forest', { w: w2[1] }), cell('+20.61', { w: w2[2], align: C }), cell('20.20 to 21.03', { w: w2[3], align: C })]),
    row([cell('', { w: w2[0] }), cell('Logistic regression', { w: w2[1] }), cell('+5.65', { w: w2[2], align: C }), cell('5.16 to 6.14', { w: w2[3], align: C })]),
    row([cell('', { w: w2[0] }), cell('XGBoost', { w: w2[1] }), cell('+18.39', { w: w2[2], align: C }), cell('17.97 to 18.82', { w: w2[3], align: C })]),

    row([cell('Duplicates kept', { w: w2[0] }), cell('Random forest', { w: w2[1] }), cell('-1.47', { w: w2[2], align: C }), cell('-1.85 to -1.09', { w: w2[3], align: C })]),
    row([cell('', { w: w2[0] }), cell('Logistic regression', { w: w2[1] }), cell('-1.41', { w: w2[2], align: C }), cell('-1.83 to -1.00', { w: w2[3], align: C })]),
    row([cell('', { w: w2[0] }), cell('XGBoost', { w: w2[1] }), cell('-0.50', { w: w2[2], align: C }), cell('-0.88 to -0.12', { w: w2[3], align: C })]),

    row([cell('Selection before split', { w: w2[0] }), cell('Random forest', { w: w2[1] }), cell('+0.04', { w: w2[2], align: C }), cell('-0.52 to 0.60', { w: w2[3], align: C })]),
    row([cell('', { w: w2[0] }), cell('Logistic regression', { w: w2[1] }), cell('-0.00', { w: w2[2], align: C }), cell('-0.46 to 0.46', { w: w2[3], align: C })]),
    row([cell('', { w: w2[0] }), cell('XGBoost', { w: w2[1] }), cell('+0.10', { w: w2[2], align: C }), cell('-0.43 to 0.62', { w: w2[3], align: C })]),
  ]
});

const w3 = [2400, 1200, 1700, 1300, 1300];
const table3 = new Table({
  columnWidths: w3, width: { size: 7600, type: WidthType.DXA },
  rows: [
    row([cell('Item set', { bold: true, w: w3[0], shade: 'EDEDED' }),
         cell('Items', { bold: true, w: w3[1], shade: 'EDEDED', align: C }),
         cell('Mean overlap', { bold: true, w: w3[2], shade: 'EDEDED', align: C }),
         cell('Lowest', { bold: true, w: w3[3], shade: 'EDEDED', align: C }),
         cell('Highest', { bold: true, w: w3[4], shade: 'EDEDED', align: C })]),
    row([cell('Kaggle behaviors', { w: w3[0] }), cell('7', { w: w3[1], align: C }), cell('0.784', { w: w3[2], align: C }), cell('0.69', { w: w3[3], align: C }), cell('0.957', { w: w3[4], align: C })]),
    row([cell('MIES', { w: w3[0] }), cell('91', { w: w3[1], align: C }), cell('0.196', { w: w3[2], align: C }), cell('0.00', { w: w3[3], align: C }), cell('0.823', { w: w3[4], align: C })]),
    row([cell('BIG5 extraversion', { w: w3[0] }), cell('10', { w: w3[1], align: C }), cell('0.454', { w: w3[2], align: C }), cell('0.32', { w: w3[3], align: C }), cell('0.631', { w: w3[4], align: C })]),
  ]
});

// versions are read from requirements.txt so the table cannot drift from the pinned environment
const pinned = {};
for (const line of fs.readFileSync('../requirements.txt', 'utf8').split('\n')) {
  const m = line.trim().match(/^([A-Za-z0-9_.-]+)==(.+)$/);
  if (m) pinned[m[1].toLowerCase()] = m[2];
}
const v = (...names) => names.map((n) => pinned[n] || 'not pinned').join(' / ');

const wS = [2600, 2600, 2400];
const stack = new Table({
  columnWidths: wS, width: { size: 7600, type: WidthType.DXA },
  rows: [
    row([cell('Component', { bold: true, w: wS[0], shade: 'EDEDED' }),
         cell('Package', { bold: true, w: wS[1], shade: 'EDEDED' }),
         cell('Version', { bold: true, w: wS[2], shade: 'EDEDED', align: C })]),
    row([cell('Language', { w: wS[0] }), cell('Python', { w: wS[1] }), cell('3.13.9', { w: wS[2], align: C })]),
    row([cell('Machine learning', { w: wS[0] }), cell('scikit-learn', { w: wS[1] }), cell(v('scikit-learn'), { w: wS[2], align: C })]),
    row([cell('Gradient boosting', { w: wS[0] }), cell('xgboost', { w: wS[1] }), cell(v('xgboost'), { w: wS[2], align: C })]),
    row([cell('Class balancing', { w: wS[0] }), cell('imbalanced-learn', { w: wS[1] }), cell(v('imbalanced-learn'), { w: wS[2], align: C })]),
    row([cell('Explainability', { w: wS[0] }), cell('shap', { w: wS[1] }), cell(v('shap'), { w: wS[2], align: C })]),
    row([cell('Data handling', { w: wS[0] }), cell('pandas / numpy', { w: wS[1] }), cell(v('pandas', 'numpy'), { w: wS[2], align: C })]),
    row([cell('Figures', { w: wS[0] }), cell('matplotlib', { w: wS[1] }), cell(v('matplotlib'), { w: wS[2], align: C })]),
  ]
});

const doc = new Document({
  creator: 'Rishi Vora',
  title: 'Measuring How Preprocessing Choices Affect Reported Accuracy in Introvert-Extrovert Classification',
  sections: [{
    properties: { page: { size: { width: 12240, height: 15840 }, margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 } } },
    footers: {
      default: new Footer({
        children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ children: [PageNumber.CURRENT], size: 19 })]
        })]
      })
    },
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER, spacing: { after: 240 },
        children: [new TextRun({ text: 'Measuring How Preprocessing Choices Affect Reported Accuracy in Introvert-Extrovert Classification', bold: true, size: 30 })]
      }),
      CENTER('Rishi Vora', { size: 23 }),
      CENTER('Northside College Prep', { size: 20 }),
      CENTER('rishihvora@gmail.com', { size: 20 }),
      CENTER('August 2026', { size: 20 }),
      CENTER('Preprint, version 1.0', { size: 19 }),
      CENTER('https://doi.org/10.5281/zenodo.21955709', { size: 19, after: 300 }),

      H1('Abstract'),
      P('Reported accuracies for classifying introverts and extroverts from self-report data vary widely. Fieri et al. [13] report 73.5% and 95.5% on the same dataset depending on how it was prepared before training. I measure how much four preparation decisions move that number, holding the data and the models fixed. Using a public Kaggle dataset of 2,900 responses to seven behavioral questions and the Multidimensional Introversion-Extraversion Scales (MIES; 7,188 respondents, 91 items), each condition is evaluated with 5-fold cross-validation repeated 10 times, and differences are reported in percentage points of balanced accuracy with 95% intervals. Dropping respondents who identify as neither introvert nor extrovert raises balanced accuracy by 22.8 to 23.5 points, although this changes the classification task rather than only the preprocessing. Applying SMOTE to the full dataset before splitting, rather than within each training fold, raises it by 18.4 to 20.6 points on the imbalanced dataset and by under 0.5 points on the balanced one. Keeping duplicate rows changes it by about one point. Selecting the top 15 features by ANOVA F-score before splitting shows no evidence of a systematic effect, with all three intervals containing zero. My three-class MIES results fall within a third of a point of two published studies that retained the ambivert group. Reported accuracy is therefore sensitive to how the classes are defined and to when the resampling is done. That makes it hard to compare numbers across studies when those choices are not stated.'),

      H1('Keywords'),
      P('Introversion, extroversion, personality classification, machine learning, data leakage, preprocessing, cross-validation, class imbalance, SMOTE, reproducibility'),

      H1('I. Introduction'),

      H2('A. Introversion and Extroversion as a Prediction Target'),
      P('Psychologists have studied personality traits, particularly the distinction between introversion and extroversion, for decades because of their obvious presence in our daily lives [1, 2]. For example, some individuals will be more energized after a day of being alone, while others will become restless if they do not see other people on a regular basis. One individual may leave a long social gathering exhausted; another will be energized to participate in more social activities [3]. Researchers have used formal assessments, like the NEO Personality Inventory [4] or Myers-Briggs Type Indicator, MBTI [5], and shorter self-report measures [6] to assess personality traits. These assessments rely on people reflecting on and describing themselves, but the difference between introverts and extroverts is also thought to show up in their everyday behavior.'),
      P('More recently, researchers have shown that personality is reflected in behavior and digital records, not only in questionnaires. Private traits have been predicted from social media activity [7], computer models have judged personality more accurately than a person’s own friends [8], and such patterns have even been used to target persuasive messages [9]. This work suggests that introverts and extroverts behave differently in measurable ways, although it has often relied on large and very detailed digital records rather than a few simple, self-reported behaviors.'),

      H2('B. The Spread in Reported Accuracy'),
      P('Studies that classify introverts and extroverts from self-reported data report very different accuracies. Fieri et al. [13] report 73.5% and 95.5% for the same dataset, depending on how the data were prepared before training. So [12] reports 73.81% on the same questionnaire. Numbers like these often get compared as though they describe the same problem.'),
      P('Leakage and preprocessing errors are known to inflate reported performance across many fields. Kapoor and Narayanan [11] found them in 294 papers spanning 17 disciplines and sorted them into eight types. Personality classification was not one of the fields they surveyed, and I could not find a study that measures how much these choices matter.'),

      H2('C. What This Paper Adds'),
      P('I measure how much four common preparation decisions move the reported accuracy for this task. The decisions are whether to keep respondents who identify as neither introvert nor extrovert, whether to resample before or inside cross-validation folds, whether to remove duplicate rows, and whether to select features before or inside folds. Each is tested on the same datasets with the same models, so that the only thing changing is the decision itself. Four things follow from setting it up that way:'),
      BULLET('A controlled comparison where each of the four decisions is tested on its own, with everything else held fixed, so any difference has to come from that decision.'),
      BULLET('Effect sizes in percentage points of balanced accuracy, with 95% intervals, measured across 50 fits per condition instead of one split.'),
      BULLET('A reproduction of two published three-class results on the same questionnaire, which points to the class-structure decision as the source of most of the spread in the published numbers.'),
      BULLET('A measurement of how much the questions in each dataset overlap, which helps explain why one of the four decisions does nothing measurable while a similar-looking one moves accuracy about twenty points.'),

      H1('II. Dataset Description and Preprocessing'),

      H2('A. Dataset Composition'),
      P('The first dataset is a public Kaggle dataset called “Extrovert vs Introvert Behavior Data” [10]. It contains 2,900 responses. Each person answered seven questions about their daily habits and provided a label indicating whether they were an introvert or an extrovert. The questions were: how many hours they spent alone on a typical day, how often they attended social events, how often they went outside, how many close friends they had, how often they posted on social media, whether they got stage fright, and whether socializing made them feel drained. The two classes are close to even, at 1,491 extroverts and 1,409 introverts.'),
      P('The second is the Multidimensional Introversion-Extraversion Scales development data [14], collected by the Open-Source Psychometrics Project in 2019. It contains 7,188 responses to 91 agree-disagree statements rated on a five-point scale. At the end of the survey each respondent was asked whether they identify as an introvert, an extrovert, or neither. Of the 7,163 who answered, 4,404 said introvert, 990 said extrovert, and 1,769 said neither. The remaining 25 respondents left the question blank and are excluded. This dataset is strongly imbalanced, which matters for the resampling condition below.'),
      P('The third is the IPIP Big Five Factor Markers data [15], 19,719 responses to 50 items. It carries no self-reported introvert or extrovert label, and deriving one from the extraversion items would make any prediction from those same items circular, so this dataset is never used for classification. Its ten extraversion items serve only as a reference point for how much the questions of an established scale overlap with one another.'),

      H2('B. Cleaning'),
      P('For the Kaggle dataset, the five numerical questions were rounded to the nearest whole number. For stage fright and feeling drained, 1 was used to represent “Yes” and 0 to represent “No.” All personality labels were set to 0 for introvert (including “Int”) and 1 for extrovert.'),
      P('The file contains 486 rows that are exact duplicates of another row. Unless a condition states otherwise, these are removed before analysis, leaving 2,414 unique rows.'),
      P('For MIES, a response of 0 marks a skipped question, and not a rating, and is treated as missing. Missing values are filled with the median from the training fold.'),

      H1('III. Methodology'),

      H2('A. Models'),
      P('Three classifiers were used: a random forest [21] with 100 trees, a logistic regression with L2 regularization and the lbfgs solver, and an XGBoost model [19] with a max depth of 3 and 100 trees. All code used random_state = 42 so that the results could be repeated.'),
      P('Every preprocessing step runs inside a scikit-learn [18] pipeline, so imputation and scaling are fitted on training data only.'),

      H2('B. Evaluation'),
      P('For the baseline results in Table 1, the data were split in an 80/20 ratio between training and testing sets, with equal numbers of introverts and extroverts maintained through stratification. Every condition comparison in Section V instead uses 5-fold cross-validation repeated 10 times, giving 50 fits per condition. Differences between conditions are reported in percentage points of balanced accuracy, with a 95% interval computed from the pooled fold variance of the two conditions being compared.'),
      P('Balanced accuracy is used rather than raw accuracy because MIES is strongly imbalanced. Introverts make up 61.5% of the three-class data, so a lazy model that answers “introvert” every time scores 61.5% raw accuracy without having learned anything. That number is called the no-information rate. It is the score a model gets for free by always guessing the largest class. Balanced accuracy scores each class separately and then averages them, so the same lazy model would score 33%. Where results here are placed next to published figures, both sides use raw accuracy, since the published studies report raw accuracy.'),

      H2('C. Conditions'),
      P('Each condition is a pair of pipelines that differ in exactly one step. In three of the four pairs, the first arm uses the whole dataset for a step that should be confined to the training data, and the second arm confines it correctly.'),
      BULLET([t('Class structure. ', { bold: true }), t('Three classes (introvert, extrovert, or neither) against two classes, with the neither group removed. This one changes the prediction task and the population being classified, not only the order of the steps.')]),
      BULLET([t('Resampling order. ', { bold: true }), t('SMOTE [16] applied to the entire dataset before cross-validation, against SMOTE applied inside each training fold through an imbalanced-learn [20] pipeline. SMOTE makes a new minority-class row by taking a real one, picking one of its five closest minority neighbors, and putting a new point somewhere on the line between them. Five neighbors is the default and both arms use it, so the only difference is when the new rows get made.')]),
      BULLET([t('Duplicate rows. ', { bold: true }), t('The 486 exact duplicate rows kept in one arm and removed in the other, on the Kaggle dataset.')]),
      BULLET([t('Feature selection order. ', { bold: true }), t('The 15 items with the highest ANOVA F-score chosen from the entire dataset before cross-validation, against the same selection repeated from scratch inside each training fold. The F-score ranks each item by how far apart the class averages are relative to the spread within each class, so a high-scoring item is one that separates the groups cleanly on its own.')]),

      H1('IV. Experimental Setup'),

      H2('A. Software Environment'),
      P('All experiments were run on a single desktop machine under the package versions below. These versions are pinned in the repository so that the results can be reproduced exactly.'),
      stack,

      H2('B. Reproducibility Statement'),
      P('A single random seed of 42 is applied to every estimator, to SMOTE, and to the cross-validation splitter, and all folds are stratified. Imputation, scaling, resampling, and feature selection run inside the pipeline so that they are fitted on training folds only, except where a condition deliberately does otherwise in order to measure the effect, and missing MIES responses are imputed with the training-fold median. Every table in this paper is produced by a named script in the repository listed under Code and Data Availability.'),

      H1('V. Results and Analysis'),

      H2('A. Baseline Accuracy'),
      table1,
      cap('Table 1: Accuracy on a held-out 20% test set, single stratified split. The Kaggle rows and the two-class MIES rows are close to one another, while the three-class MIES rows sit roughly 18 points lower.'),

      H2('B. Effect of Each Condition'),
      table2,
      cap('Table 2: Effect of each condition, in percentage points of balanced accuracy, from 5-fold cross-validation repeated 10 times. Intervals are 95%. Only the selection-order intervals contain zero.'),

      img('effect_sizes.png', 450, 277),
      cap('Figure 1: Effect of each condition for all three models, with 95% intervals. The selection-order intervals cross zero and the others do not. Logistic regression gains far less from resampling before the split than the two tree models do.'),

      H2('C. Class Structure'),
      P('Removing the 1,769 respondents who identify as neither introvert nor extrovert raises balanced accuracy by 22.76 to 23.48 points depending on the model. This is the largest effect measured here.'),
      P('Dropping the neither group converts a three-class problem into a two-class problem and removes the respondents whose self-description is least definite. Accuracy rises partly because the population that remains is easier to separate. A two-class problem is a reasonable thing to study, but a two-class result and a three-class result answer different questions and cannot be placed side by side.'),
      P('My three-class results, at 0.728 to 0.736 raw accuracy, come out close to two published studies that used the same questionnaire: So [12] reports 73.81% and Fieri et al. [13] report 73.5% before resampling. Fieri et al. list class counts of 4,404, 989, and 1,768, which are all three groups. So reports a no-information rate of 61.51%, and the largest class in the three-class version of this data accounts for 61.48% of it, against 81.6% in the two-class version, so that study was almost certainly working with three classes as well.'),

      H2('D. Resampling Order'),
      P('Applying SMOTE to the whole dataset before splitting, rather than inside each training fold, raises balanced accuracy on MIES by 20.61 points for the random forest, 18.39 for XGBoost, and 5.65 for logistic regression. On the Kaggle dataset the same change moves accuracy by less than 0.5 points in every case.'),
      P('The reason for this is fairly simple. SMOTE creates new minority-class rows by interpolating between existing ones. If those rows are created before the split, a synthetic row in a test fold can be an interpolation of two rows that are in the training fold, so the model is scored on points partly built from data it trained on. Resampling inside the training fold avoids this, because the test fold is never used to create anything.'),
      P('Two things have to hold for the effect to appear. The classes have to be imbalanced enough for SMOTE to generate a large number of synthetic rows, which is why the Kaggle dataset shows almost nothing at 51/49 while MIES shows 20 points at 61/14/25. The model also has to be flexible enough to fit the extra rows. A logistic regression on seven features has seven coefficients and cannot fit an individual row, which is why it gains 5.65 points where the random forest gains 20.61.'),
      P('For comparison, Fieri et al. [13] report 73.5% before resampling and 95.5% after. The change I measure from ordering alone is close in size to the change they report.'),

      H2('E. Duplicate Rows'),
      P('Keeping the 486 duplicate rows in the Kaggle file changes balanced accuracy by -1.47 points for the random forest, -1.41 for logistic regression, and -0.50 for XGBoost. All three intervals exclude zero, and all three estimates are small and negative: keeping duplicates makes performance slightly worse rather than better, which is the opposite of what might be expected.'),
      P('The duplicates do produce overlap between training and test data. On a single 80/20 split of the raw file, 27.9% of test rows appear identically somewhere in the training set. That overlap exists in the file as published, before any analysis is performed. It does not translate into inflated balanced accuracy at this scale, but it is worth removing on principle, and worth knowing about for anyone using the dataset.'),

      H2('F. Feature Selection Order'),
      P('Selecting the top 15 features by ANOVA F-score using the whole dataset, rather than inside each training fold, changes balanced accuracy by +0.04, -0.00, and +0.10 points for the three models. All three 95% intervals contain zero, the widest running from -0.52 to +0.60. There is no evidence of a systematic effect under these conditions.'),
      P('This is worth stating because feature-selection order looks like the same category of mistake as resampling order. Both involve using the full dataset for a step that should be confined to training data. One produces a 20-point difference and the other produces nothing measurable.'),

      H2('G. Item Overlap and the Null Selection Result'),
      P('Choosing features on the whole dataset can only leak something if the choice itself tells you something. If the questions in a dataset all measure close to the same thing, then almost any subset of them holds almost the same information, and it stops mattering whether that subset was picked using the test rows or without them. The measurements below suggest that is what is going on here.'),
      P('Table 3 reports how strongly the items within each set move together, using the absolute correlation between every pair of items. A 0 means two questions tell you unrelated things about a person and a 1 means they tell you the same thing twice. A set with a high average is one where the questions are more or less interchangeable and less useful.'),
      table3,
      cap('Table 3: Absolute correlation between every pair of items within each set. The Kaggle behaviors overlap far more than either questionnaire scale.'),
      P('The seven Kaggle behaviors average 0.784, roughly four times the MIES average of 0.196. The clearest way to see this is at the edges of the range. The least related pair of the seven behaviors correlates at 0.69, which is higher than the most related pair in the BIG5 extraversion scale at 0.631. That scale was written on purpose to measure one trait through ten differently worded items, so it is a fair upper reference point for how much a deliberately repetitive set of questions should overlap. The seven behaviors are above it. Asking about time alone, social events, going outside, friends, posting, stage fright, and feeling drained is closer to asking one question seven times than to asking seven different questions.'),
      img('overlap_heatmaps.png', 440, 196),
      cap('Figure 2: Absolute correlation between item pairs. Left: the seven Kaggle behaviors. Right: the ten BIG5 extraversion items. Darker is more overlap.'),
      P('The same pattern appears when items are removed rather than counted. All three models rank stage fright as their most important item on the Kaggle dataset, ranked by SHAP [17], and removing it changes balanced accuracy by less than half a point for every one of them. Accuracy also stays flat as items are dropped one at a time, from seven questions down to two. If the last two do about as well as all seven, then the choice of questions carries very little information, which is what the null result in Section F would predict.'),

      H1('VI. Discussion'),
      P('The four conditions do not behave alike. Two of them move reported accuracy by roughly 20 points, one moves it by about one point, and one produces nothing measurable. That spread is the main practical result. It means these choices cannot all be treated as minor details of method.'),
      P('The class-structure result is the one most likely to be misread. Dropping ambiverts is a legitimate choice, but two-class and three-class results answer different questions, and the gap between them is large enough to account for most of the range seen in published work on this instrument.'),
      P('A study that resampled before splitting on balanced data with a linear model would see almost nothing from it, and might reasonably conclude the practice is harmless.'),

      H1('VII. Limitations'),
      P('The following limitations qualify how far these results should be carried:'),
      BULLET('Two datasets only. The data came from self-reported answers only, so people may not remember or report their habits perfectly, and both samples were collected online from respondents who chose to take part.'),
      BULLET('One resampling method. The resampling effect was measured with SMOTE alone. Random oversampling, undersampling, and other synthetic methods may behave differently.'),
      BULLET('Intervals describe fold variation. The intervals reported here describe variation across cross-validation folds on a fixed dataset, not variation across independent samples, so they should be read as a measure of stability rather than as a full account of uncertainty. Three of the four conditions compare arms with different numbers of rows, so paired differencing across folds is not available for them.'),
      BULLET('The overlap explanation is descriptive. The item-overlap measurements offer a plausible reason for the null selection-order result but do not establish it, since no experiment here manipulates overlap directly.'),
      BULLET('No claim about published code. Where published figures are placed beside mine, the comparison is between reported numbers. I have not inspected the code behind any published result and make no claim about what produced those numbers.'),

      H1('VIII. Conclusion'),
      P('I measured how much four data preparation decisions change the reported accuracy of introvert-extrovert classification, holding the datasets and models fixed. Two of them move balanced accuracy by roughly 20 points, one moves it by about a point, and one does nothing measurable.'),
      P('Two conclusions follow. Reported accuracies for this task are difficult to compare across studies when the class structure and the preprocessing order are not stated, and a reader has no way to tell which version of the task a number describes. And the choices are not equally consequential, so a reader checking a reported number should know which ones to ask about.'),

      H1('Code and Data Availability'),
      P('All code used to clean the data, run the conditions, and generate the figures is available at https://github.com/rishi3qrw43/introvert-extrovert. The three datasets are publicly available from their original sources [10, 14, 15] and are not redistributed here; the repository documents where to download each one and how to prepare it.'),

      H1('Ethics Statement'),
      P('This work analyzes survey data that was collected and anonymized by others before the study began. No new human-subject data were collected, and no personally identifying information was accessed or redistributed.'),

      H1('References'),
      ref('[1] C. G. Jung, Psychological Types, H. G. Baynes, Trans., rev. ed. Princeton, NJ: Princeton University Press, 1971.'),
      ref('[2] H. J. Eysenck, The Biological Basis of Personality. Springfield, IL: Charles C. Thomas, 1967.'),
      ref('[3] S. Cain, Quiet: The Power of Introverts in a World That Can’t Stop Talking. New York, NY: Crown, 2012.'),
      ref('[4] P. T. Costa and R. R. McCrae, Revised NEO Personality Inventory (NEO-PI-R) and NEO Five-Factor Inventory (NEO-FFI) Professional Manual. Odessa, FL: Psychological Assessment Resources, 1992.'),
      ref('[5] I. B. Myers, M. H. McCaulley, N. L. Quenk, and A. L. Hammer, MBTI Manual: A Guide to the Development and Use of the Myers-Briggs Type Indicator, 3rd ed. Palo Alto, CA: Consulting Psychologists Press, 1998.'),
      ref('[6] S. D. Gosling, P. J. Rentfrow, and W. B. Swann, "A very brief measure of the Big-Five personality domains," Journal of Research in Personality, vol. 37, no. 6, pp. 504-528, 2003, doi: 10.1016/S0092-6566(03)00046-1.'),
      ref('[7] M. Kosinski, D. Stillwell, and T. Graepel, "Private traits and attributes are predictable from digital records of human behavior," Proceedings of the National Academy of Sciences, vol. 110, no. 15, pp. 5802-5805, 2013, doi: 10.1073/pnas.1218772110.'),
      ref('[8] W. Youyou, M. Kosinski, and D. Stillwell, "Computer-based personality judgments are more accurate than those made by humans," Proceedings of the National Academy of Sciences, vol. 112, no. 4, pp. 1036-1040, 2015, doi: 10.1073/pnas.1418680112.'),
      ref('[9] S. C. Matz, M. Kosinski, G. Nave, and D. J. Stillwell, "Psychological targeting as an effective approach to digital mass persuasion," Proceedings of the National Academy of Sciences, vol. 114, no. 48, pp. 12714-12719, 2017, doi: 10.1073/pnas.1710966114.'),
      ref('[10] R. Kapilavai, "Extrovert vs Introvert Behavior Data," Kaggle, 2024. [Online]. Available: https://www.kaggle.com/datasets/rakeshkapilavai/extrovert-vs-introvert-behavior-data'),
      ref('[11] S. Kapoor and A. Narayanan, "Leakage and the reproducibility crisis in machine-learning-based science," Patterns, vol. 4, no. 9, art. 100804, 2023, doi: 10.1016/j.patter.2023.100804.'),
      ref('[12] C. So, "Are you an introvert or extrovert? Accurate classification with only ten predictors," in Proc. 2020 International Conference on Artificial Intelligence in Information and Communication (ICAIIC), Fukuoka, Japan, 2020, pp. 693-696, doi: 10.1109/ICAIIC48513.2020.9065069.'),
      ref('[13] B. Fieri, J. La’la, and D. Suhartono, "Introversion-extraversion prediction using machine learning," JOIV: International Journal on Informatics Visualization, vol. 7, no. 4, pp. 2154-2160, 2023, doi: 10.62527/joiv.7.4.1019.'),
      ref('[14] Open-Source Psychometrics Project, "Development of the Multidimensional Introversion-Extraversion Scales," 2019. [Online]. Available: https://openpsychometrics.org/tests/MIES/development/'),
      ref('[15] Open-Source Psychometrics Project, "IPIP Big Five Factor Markers," 2014. [Online]. Available: https://openpsychometrics.org/tests/BIG5.php'),
      ref('[16] N. V. Chawla, K. W. Bowyer, L. O. Hall, and W. P. Kegelmeyer, "SMOTE: Synthetic minority over-sampling technique," Journal of Artificial Intelligence Research, vol. 16, pp. 321-357, 2002, doi: 10.1613/jair.953.'),
      ref('[17] S. M. Lundberg and S.-I. Lee, "A unified approach to interpreting model predictions," in Advances in Neural Information Processing Systems, vol. 30, 2017, pp. 4765-4774.'),
      ref('[18] F. Pedregosa et al., "Scikit-learn: Machine learning in Python," Journal of Machine Learning Research, vol. 12, pp. 2825-2830, 2011.'),
      ref('[19] T. Chen and C. Guestrin, "XGBoost: A scalable tree boosting system," in Proc. 22nd ACM SIGKDD International Conference on Knowledge Discovery and Data Mining, 2016, pp. 785-794.'),
      ref('[20] G. Lemaitre, F. Nogueira, and C. K. Aridas, "Imbalanced-learn: A Python toolbox to tackle the curse of imbalanced datasets in machine learning," Journal of Machine Learning Research, vol. 18, no. 17, pp. 1-5, 2017.'),
      ref('[21] L. Breiman, "Random forests," Machine Learning, vol. 45, no. 1, pp. 5-32, 2001, doi: 10.1023/A:1010933404324.'),
    ]
  }]
});

Packer.toBuffer(doc).then((buf) => {
  fs.writeFileSync('preprocessing_paper.docx', buf);
  console.log('written', buf.length, 'bytes');
});
