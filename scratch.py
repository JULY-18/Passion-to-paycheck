import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.ensemble import RandomForestRegressor
import joblib
import os

df = pd.read_csv("Passion_to_Paycheck_Dataset.csv")
if 'Entry_ID' in df.columns:
    df = df.drop(columns=['Entry_ID'])

X = df.drop(columns=['Market_Value_LPA'])
y = df['Market_Value_LPA']

categorical_cols = ['Mapped_Target_Industry', 'Equivalent_Job_Role']
numerical_cols = [col for col in X.columns if col not in categorical_cols]

preprocessor = ColumnTransformer(
    transformers=[
        ('num', StandardScaler(), numerical_cols),
        ('cat', OneHotEncoder(handle_unknown='ignore'), categorical_cols)
    ]
)

pipeline = Pipeline(steps=[
    ('preprocessor', preprocessor),
    ('regressor', RandomForestRegressor(n_estimators=20, max_depth=10, random_state=42, n_jobs=-1))
])

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
pipeline.fit(X_train, y_train)

joblib.dump(pipeline, 'small_model.joblib')
print(f"Size: {os.path.getsize('small_model.joblib') / (1024*1024):.2f} MB")
