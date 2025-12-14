# Dashboard Project

A robust full-stack dashboard application built with **Next.js** (Frontend) and **NestJS** (Backend), leveraging **PostgreSQL** for persistence and **Redis** for high-performance caching and sessions.

---

## Requirements

Ensure you have the following installed before running the project:

* **Docker** (Desktop or Engine) installed and running.
* **WSL2** (Windows Subsystem for Linux) or any **Linux** distribution.

---

## Getting Started

You can start the project using one of the following methods.

### Option A (Recommended)

This script handles everything for you: permissions, builds, waiting for the database, and running migrations.

1.  **Grant execution permissions:**
    ```bash
    chmod +x ./start-project.sh --no-cache
    ```

2.  **Launch the project:**
    ```bash
    ./start-project.sh
    ```

### Option B

If you prefer to run the steps manually, follow this specific order to ensure migrations run correctly before the app starts.

1.  **Start the Database:**
    ```bash
    docker compose up -d postgres
    ```

2.  **Install Backend Dependencies:**
    ```bash
    cd dashboard-backend
    yarn install  # or npm install
    ```

3.  **Run Migrations:**
    ```bash
    yarn migration:run  # or npm run migration:run
    ```

4.  **Build and Start the Application:**
    Return to the root directory and start the full stack:
    ```bash
    cd ..
    docker compose up -d --build
    ```

---

## Default Seed Users

The database is automatically seeded with the following accounts. The password is the same for all initial users.

| Role | Email | Password | Name |
| :--- | :--- | :--- | :--- |
|  ADMIN | `admin@dashboard.com` | `StrongPassword!0@` | Super Admin |
|  USER  | `lorem@dashboard.com` | `StrongPassword!0@` | Lorem Lorem |
|  USER  | `ipsum@dashboard.com` | `StrongPassword!0@` | Ipsum Ipsum |
|  USER  | `dolor@dashboard.com` | `StrongPassword!0@` | Dolor Dolor |

---

## Links

Once the containers are up and running:

* **Frontend:** [http://localhost:3000](http://localhost:3000)
* **Backend API:** [http://localhost:8080](http://localhost:8080)
* **Swagger Docs:** [http://localhost:8080/api-docs](http://localhost:8080/api-docs)
