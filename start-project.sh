#!/bin/bash
#
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

echo -e "${YELLOW}Starting Database and Cache layers...${NC}"
run_compose up -d postgres redis

echo "Waiting 5 seconds for databases to initialize..."
sleep 5

echo -e "${YELLOW}Building and Starting Backend and Frontend...${NC}"
run_compose build $NO_CACHE backend frontend
run_compose up -d backend frontend

echo -e "${GREEN}   Dashboard Project Started Successfully!         ${NC}"
echo -e "Backend running at: http://localhost:8080"
echo -e "Frontend running at: http://localhost:3000"
echo -e "Docker status:"
run_compose ps
