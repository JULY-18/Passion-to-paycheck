#!/bin/bash
cd "$(dirname "$0")/backend"

echo "Setting up Python virtual environment..."
python3 -m venv venv

echo "Activating virtual environment..."
source venv/bin/activate

echo "Installing requirements..."
pip install -r requirements.txt

if [ -f "model.joblib" ]; then
    echo "Model already exists. Skipping training..."
else
    echo "Training model..."
    python train.py
fi

echo "Starting FastAPI backend..."
uvicorn main:app --reload
