#!/bin/bash

export DOCKER_BUILDKIT=1
export COMPOSE_DOCKER_CLI_BUILD=1
# colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}Starting Dashboard Project Initialization...${NC}"

echo -n "Checking Docker Daemon... "
if ! docker info > /dev/null 2>&1; then
  echo -e "${RED}FAILED${NC}"
  echo "Docker is not running. Please start Docker Desktop or the Docker daemon."
  exit 1
else
  echo -e "${GREEN}OK${NC}"
fi

echo -n "Checking Docker Compose... "
if command -v docker-compose &> /dev/null; then
    COMPOSE_TYPE="legacy"
    echo -e "${GREEN}OK (using docker-compose)${NC}"
elif docker compose version &> /dev/null; then
    COMPOSE_TYPE="plugin"
    echo -e "${GREEN}OK (using docker compose)${NC}"
else
    echo -e "${RED}FAILED${NC}"
    echo "Docker Compose is not installed."
    exit 1
fi

run_compose() {
    if [ "$COMPOSE_TYPE" = "legacy" ]; then
        docker-compose "$@"
    else
        docker compose "$@"
    fi
}

NO_CACHE=""
if [[ "$1" == "--no-cache" ]]; then
    NO_CACHE="--no-cache"
    echo -e "${YELLOW}Building with --no-cache flag${NC}"
fi

echo -e "${YELLOW}Removing existing dashboard containers...${NC}"
run_compose down --remove-orphans

echo -e "${YELLOW}Building Backend (if needed)...${NC}"
run_compose build $NO_CACHE backend

echo -e "${YELLOW}Starting Database and Cache layers...${NC}"
run_compose up -d postgres redis

echo "Waiting for PostgreSQL to be ready..."
max_attempts=30
attempt=0
until run_compose exec -T postgres pg_isready -U default > /dev/null 2>&1; do
  attempt=$((attempt + 1))
  if [ $attempt -eq $max_attempts ]; then
    echo -e "${RED}PostgreSQL failed to start after $max_attempts attempts${NC}"
    exit 1
  fi
  echo -n "."
  sleep 1
done
echo -e " ${GREEN}Ready!${NC}"

echo -e "${YELLOW}Running Database Migrations...${NC}"

# it`s so dump that it took me 3 hours to know that simple compose run doesn`t add it to same network, ECONNREFUSED
run_compose run --rm \
  -e DATABASE_HOST=postgres \
  -e DATABASE_PORT=5432 \
  -e DATABASE_USER=default \
  -e DATABASE_PASSWORD=changeme \
  -e DATABASE_NAME=dashboard \
  -e IS_PROD=false \
  backend yarn migration:run

if [ $? -ne 0 ]; then
  echo -e "${RED}Migration failed!${NC}"
  exit 1
fi

echo -e "${YELLOW}Building and Starting Backend and Frontend...${NC}"
run_compose build $NO_CACHE frontend

if [ $? -ne 0 ]; then
  echo -e "${RED}Frontend build failed!${NC}"
  echo -e "${YELLOW}Check the error above and fix your code.${NC}"
  exit 1
fi

run_compose up -d backend frontend

echo -e "${GREEN}Dashboard Project Started Successfully!${NC}"
echo -e "Backend running at: http://localhost:8080"
echo -e "Frontend running at: http://localhost:3000"
echo -e "Docker status:"
run_compose ps
