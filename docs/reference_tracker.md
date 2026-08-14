# Reference tracker — Vora & Vora expansion

Status legend: **[VERIFIED]** = fetched/confirmed directly. **[SEARCH-REPORTED]** = surfaced by search summaries, not independently opened — verify before citing. **[NOT ACADEMIC]** = blog/pop-sci, do not cite as a scholarly source.

## Already in the manuscript (carried over / added earlier)
1. Jung, C.G. *Psychological Types*. Princeton University Press, 1971. **[VERIFIED — via Wikipedia ref list]**
2. Eysenck, H.J. *The Biological Basis of Personality*. Charles C. Thomas, 1967.
3. Cain, S. *Quiet: The Power of Introverts in a World That Can't Stop Talking*. Crown, 2012. **[VERIFIED]**
4. Kosinski, M., Stillwell, D., & Graepel, T. (2013). Private traits and attributes are predictable from digital records of human behavior. *PNAS*, 110(15), 5802–5805.
5. Youyou, W., Kosinski, M., & Stillwell, D. (2015). Computer-based personality judgments are more accurate than those made by humans. *PNAS*, 112(4), 1036–1040.
6. **So, C. (2020). Are You an Introvert or Extrovert? Accurate Classification With Only Ten Predictors. arXiv:2003.01580; ICAIIC 2020.** **[VERIFIED — author confirmed via WebSearch, corrected from earlier wrong attribution]**. This is the single most important comparison point: 73.81% accuracy on ~7,161 real MIES-family respondents using 10 of 94 items. Directly supports the "gap between real and Kaggle data" argument.
7. Kapilavai, R. Extrovert vs. Introvert Behavior Data. Kaggle. (primary dataset)
8. Lundberg, S.M., & Lee, S.-I. (2017). A Unified Approach to Interpreting Model Predictions. *NeurIPS 30*. (SHAP foundational paper)

## New candidates found this session

### Directly relevant — SHAP + personality/behavior classification
9. **[SEARCH-REPORTED, needs verification]** "Interpretable machine learning with SHAP predicts honest behavior from personality traits and physiological data." *Scientific Reports* (Nature), 2026. https://www.nature.com/articles/s41598-026-41677-y — Also appears as a Frontiers in Psychology piece: "Predicting honest behavior based on Eysenck personality traits and gender: an explainable machine learning study using SHAP analysis," *Frontiers in Psychology*, 2025, https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2025.1525606/full — and on PMC: https://pmc.ncbi.nlm.nih.gov/articles/PMC13111637/. **Likely the same study reported twice (preprint/PMC + journal version) — verify which is the canonical citation before using.** Methodologically the closest published analogue to our SHAP approach (Eysenck personality traits + SHAP). Worth reading in full.
10. **[SEARCH-REPORTED]** "Applying explainable artificial intelligence methods to models for diagnosing personal traits and cognitive abilities by social network data." *Scientific Reports*, 2024. https://www.nature.com/articles/s41598-024-56080-8

### Personality prediction via ML — general comparators
11. **[SEARCH-REPORTED]** "Personality Prediction Model: An Enhanced Machine Learning Approach." *Electronics* (MDPI), 14(13), 2558, 2025. https://www.mdpi.com/2079-9292/14/13/2558 — CNN+RF on Instagram data, n=941, Big Five.
12. **[SEARCH-REPORTED]** "Personality Trait Inference Via Mobile Phone Sensors: A Machine Learning Approach." arXiv:2401.10305. https://arxiv.org/pdf/2401.10305
13. **[SEARCH-REPORTED]** "Personality in 3D: multimodal deep learning framework for big five trait prediction." *Neural Computing and Applications* (Springer), 2026.
14. **[SEARCH-REPORTED]** "Machine Learning for Predicting Personality and Psychological Symptoms from Behavioral Dynamics." *Electronics* (MDPI), 14(3), 583, 2025. https://www.mdpi.com/2079-9292/14/3/583

### Methodology / generalization critique (supports our leakage + cross-dataset argument)
15. **[SEARCH-REPORTED]** "Machine Learning in Psychometrics and Psychological Research." *Frontiers in Psychology*, 2019. https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2019.02970/full — general argument that most psychometric ML work doesn't test generalization outside the training sample, inflating results. **Strong candidate to cite in Discussion/Limitations when framing the cross-dataset test.**
16. **[SEARCH-REPORTED]** "Cross-cohort replicability and generalizability of connectivity-based psychometric prediction patterns." *NeuroImage* (ScienceDirect), 2022. Different domain (neuroimaging) but same generalization argument — optional.

### Parsimony / short-form scale precedent (psychology's own version of our ablation)
17. **[VERIFIED — via Wikipedia reference list]** Thompson, E.R. (2008). Development and Validation of an International English Big-Five Mini-Markers. *Personality and Individual Differences*, 45(6), 542–548. doi:10.1016/j.paid.2008.06.013 — real, citable, and directly on-topic: it's psychology's own precedent for reducing a personality scale to fewer items, giving your parsimony analysis a home in the psych literature, not just ML.

### Construct-level framing (stage fear vs. social anxiety, continuum vs. binary)
18. **[NOT ACADEMIC — pop-psych blog, do not cite as scholarly]** Peterson, A.L. (2019). "Introversion, Shyness & Social Anxiety: What's the Difference?" Mental Health at Home. Flagging anyway because it's directly relevant to your SHAP finding (stage fear dominating over "drained") — the *idea* is worth having in the Discussion, but needs a real academic source instead. I did not find one this session; this needs a proper follow-up search (e.g., search for "social anxiety" AND "introversion" AND "distinct constructs" in psych journals).
19. **[NOT ACADEMIC]** Various ambiversion explainer blogs (SimplyPsychology, Neurolaunch, National Geographic) — useful for understanding the concept but not citable. I did not find a strong peer-reviewed source specifically on ambiversion-as-continuum this session; flag as an open item if you want the "MIES ambiverts" analysis to have proper theoretical backing.

## The key question: has anyone already done our specific comparison?
**No direct evidence found** that anyone has (a) applied SHAP to compare which items drive I/E classification across multiple independent datasets, or (b) specifically flagged the Kaggle "Extrovert vs Introvert Behavior Data" set as giving inflated/artificially clean accuracy. This is consistent with the gap our paper is aiming at — but my search access was limited (see caveats below), so treat this as "not found," not "proven absent."

## Caveats — what I could NOT check
- **IEEE Xplore and ScienceDirect blocked fetches** — could not pull full text or reference lists from IEEE Transactions on Affective Computing or several ScienceDirect articles. If a paid-journal paper matters, you may need library/university access.
- **No working citation-graph API** — Semantic Scholar API call returned empty; could not get a clean "cited by" list for the So (2020) paper. A manual Google Scholar check (logged in, in a browser) would be more reliable than what I can do here.
- **Items 9–16 are search-summary-reported, not independently opened and read.** Before citing any of them in the manuscript, I should fetch and confirm title/authors/year/DOI directly — search-engine summaries occasionally mangle details.
- I did not find real peer-reviewed sourcing for the "stage fear ≠ drained-by-socializing, i.e. social anxiety vs. introversion are distinct constructs" claim, which is actually the most interesting thing SHAP surfaced. That's a good next targeted search.

## Recommended next steps (only if/when you want me to continue)
1. Fetch and verify items 9, 10, 15, 17 directly (open, confirm authors/DOI).
2. Targeted search: "social anxiety" "introversion" distinct construct peer-reviewed (backs the stage-fear/drained finding).
3. ~~One clean Google Scholar "cited by" pass on So (2020)~~ — **DONE via Claude in Chrome, see below.**

---

## UPDATE (Chrome-verified pass) — this materially changes the novelty claim

Used Claude in Chrome (legitimate escalation — IEEE Xplore and Google Scholar both loaded normally; ScienceDirect hit an actual CAPTCHA bot-check, which I stopped at and did not attempt to solve or bypass — that source is just inaccessible to me).

**IEEE Xplore page for So (2020)** shows its own citation counter: "2 Cites in Papers" (IEEE-indexed citations only). Reference list itself is paywalled ("References is not available for this document").

**Google Scholar** (aggregates all versions/venues) shows **6 citing papers** for So (2020). Two are directly on-topic and I opened them:

20. **[VERIFIED — fetched in full]** Fieri, B., La'la, J., & Suhartono, D. (2023). Introversion-Extraversion Prediction using Machine Learning. *JOIV: International Journal on Informatics Visualization*, 7(4). DOI: 10.62527/joiv.7.4.1019. https://joiv.org/index.php/joiv/article/view/1019
   - **Uses the same MIES dataset we have** (cites "Open-Source Psychometrics Project, Development of the Multidimensional Introversion-Extraversion Scales, 2019" directly).
   - Selects 15 of the 91 items by correlation with the self-reported label (same correlation-only approach our SHAP work critiques — **they do not use SHAP or any interpretability method**).
   - On the **original, unbalanced** MIES data: best model (SVM) reached **73.5%** (10-fold CV) — strikingly close to So's 73.81%. Two independent papers now converge on ~73–75% for real MIES-family data.
   - On **oversampled** (SMOTE/ADASYN) versions: Random Forest jumps to **95.5%/95.3%**. This smells like the same kind of leakage we caught in the fabricated 17k Kaggle set — SMOTE applied before/across CV folds is a well-documented way to leak information between train and test. Worth a direct callout in our Discussion: this is a second, independent example of the exact inflation pattern we're flagging, which strengthens rather than weakens our methodological point.
   - **What this means for us:** we can no longer claim "nobody has built a classifier on real MIES data" — they did, in 2023. Our actual remaining novelty is the SHAP interpretability layer, the explicit cross-dataset comparison (they use only one dataset), and the specific Kaggle-leakage diagnosis. Still real, just narrower than before.

21. **[SEARCH-REPORTED — not yet opened in full]** Naz, A., Khan, H.U., Alesawi, S., Abouola, O.I., Daud, A., & Ramzan, M. (2024). AI Knows You: Deep Learning Model for Prediction of Extroversion Personality Trait. *IEEE Access*. https://ieeexplore.ieee.org/document/10735203/ — Cited by 52 (its own count) — a heavily-cited paper in this space. Reported: CNN/LSTM/RNN on social media data, 92.52% best accuracy. Different data modality (text/social features, not behavioral self-report counts), so it doesn't directly compete with our contribution, but worth citing as "92%+ is achievable via other modalities too" context. Should confirm details directly before citing.

22–24. Three more citing papers found, lower relevance: an Indonesian k-NN classification thesis (Izzatilla & Fatah, 2025, Jurnal Mahasiswa Teknik Informatika — student journal, "based on social behavior data," not yet confirmed if it's our exact Kaggle set), a Tilburg thesis on predicting country/gender from I/E scales, and a consumer-marketing thesis using personality + music. Not deeply checked — low priority.

## Revised bottom line on the gap
Still standing, but narrower and now more precisely stated: **the gap is not "classify I/E from real data" (done, twice) — it's "use SHAP to explain what drives that classification, and compare that explanation + accuracy across multiple independent real datasets, while diagnosing why one popular dataset (ours) gives inflated results."** Nobody in the six citing papers, or in the broader search, has combined those three things. The MIES 73.5%/95.5% split from Fieri et al. is now a second real citation for "honest real-data accuracy sits around 73–75%, and the higher numbers come from resampling artifacts" — which is a stronger evidence base than relying on So (2020) alone.
