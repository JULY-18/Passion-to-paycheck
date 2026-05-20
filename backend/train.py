import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, r2_score
# pyrefly: ignore [missing-import]
import joblib

import os

def main():
    print("Loading data...")
    # Resolve the path relative to this script so it works from any working directory
    current_dir = os.path.dirname(os.path.abspath(__file__))
    csv_path = os.path.join(current_dir, "..", "Passion_to_Paycheck_Dataset.csv")
    df = pd.read_csv(csv_path)

    # Drop Entry_ID as it's an identifier
    if 'Entry_ID' in df.columns:
        df = df.drop(columns=['Entry_ID'])

    X = df.drop(columns=['Market_Value_LPA'])
    y = df['Market_Value_LPA']

    categorical_cols = ['Mapped_Target_Industry', 'Equivalent_Job_Role']
    numerical_cols = [col for col in X.columns if col not in categorical_cols]

    print(f"Numerical columns ({len(numerical_cols)}):", numerical_cols)
    print(f"Categorical columns ({len(categorical_cols)}):", categorical_cols)

    preprocessor = ColumnTransformer(
        transformers=[
            ('num', StandardScaler(), numerical_cols),
            ('cat', OneHotEncoder(handle_unknown='ignore'), categorical_cols)
        ]
    )

    pipeline = Pipeline(steps=[
        ('preprocessor', preprocessor),
        ('regressor', RandomForestRegressor(n_estimators=100, random_state=42, n_jobs=-1))
    ])

    print("Splitting data...")
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    print("Training model...")
    pipeline.fit(X_train, y_train)

    print("Evaluating model...")
    y_pred = pipeline.predict(X_test)
    mse = mean_squared_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)

    print(f"MSE: {mse:.4f}")
    print(f"R2 Score: {r2:.4f}")

    print("Saving model to model.joblib...")
    joblib.dump(pipeline, 'model.joblib')
    
    # Save the feature names so the API can construct the DataFrame correctly
    joblib.dump(list(X.columns), 'feature_names.joblib')
    
    print("Training complete!")

if __name__ == "__main__":
    main()
