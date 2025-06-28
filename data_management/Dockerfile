FROM python:3.12-slim AS base

WORKDIR /app

RUN apt-get update && apt-get install -y \
    cron \
    bash \
    && rm -rf /var/lib/apt/lists/*

COPY pyproject.toml ./
RUN pip install --upgrade pip && pip install .

FROM base AS development

COPY . .
CMD cron && bash

FROM base AS production

COPY . .
CMD cron && bash
