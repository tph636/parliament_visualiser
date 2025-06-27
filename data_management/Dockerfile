FROM python:3.12-slim
WORKDIR /app
RUN apt-get update && apt-get install -y \
    cron \
    bash \
 && rm -rf /var/lib/apt/lists/*
COPY pyproject.toml ./
RUN pip install --upgrade pip && pip install .
COPY . .
CMD cron && bash
