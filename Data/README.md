# IEEE-CIS Fraud Detection Dataset Guide

This directory holds the raw and engineered feature data used in the reproducible notebook suite (`Notebooks/01` to `Notebooks/05`).

## Dataset Acquisition

The dataset is sourced from the [Kaggle IEEE-CIS Fraud Detection Competition](https://www.kaggle.com/c/ieee-fraud-detection/data).

To reproduce the full pipeline locally:

1. Download the following raw files from Kaggle:
   - `train_transaction.csv`
   - `train_identity.csv`
   - `test_transaction.csv`
   - `test_identity.csv`
2. Place them into `Data/raw/`:
   ```text
   Data/
   └── raw/
       ├── train_transaction.csv
       ├── train_identity.csv
       ├── test_transaction.csv
       └── test_identity.csv
   ```
3. Run the notebook pipeline in sequence (`Notebooks/01_data_understanding_and_eda.ipynb` through `Notebooks/05_model_explainability_and_risk_decisioning.ipynb`).

Engineered parquet feature files (`val_features.parquet`, `train_features.parquet`) will be automatically generated in `Data/features/` and `Data/processed/`.
