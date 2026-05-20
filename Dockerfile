FROM python:3.12-slim

# Set the working directory
WORKDIR /code

# Copy the requirements file into the container
COPY ./backend/requirements.txt /code/requirements.txt

# Install the dependencies
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

# Copy the dataset into the container
COPY ./Passion_to_Paycheck_Dataset.csv /code/Passion_to_Paycheck_Dataset.csv

# Copy the backend code into the container
COPY ./backend /code/backend

# Run the training script to generate the model
# We do this during the build phase so the 200MB model is generated on Hugging Face servers
RUN cd backend && python train.py

# Hugging Face Spaces requires the app to run on port 7860
# We start the uvicorn server from the backend directory so it can find model.joblib
WORKDIR /code/backend
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]
