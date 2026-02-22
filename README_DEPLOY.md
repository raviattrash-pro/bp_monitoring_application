# Deployment Guide for BP Dashboard

I have prepared your code for free deployment! Please follow these steps to go live:

## Phase 1: Preparation
1.  **GitHub**: Push your entire `BP_Dashboard_Project` folder to a new **public or private repository** on GitHub.
3.  **Database**: Create a free MySQL-compatible database on **[TiDB Cloud](https://tidbcloud.com/)** (Serverless Free tier) or a PostgreSQL database on **[Neon.tech](https://neon.tech/)**.
    *   Note down the connection parameters (URI, Host, Port, Database, User, Password).

## Phase 2: Deploy Backend (Render)
1.  Login to [Render](https://render.com/).
2.  Click **"New +"** -> **"Web Service"**.
3.  Connect your GitHub repository.
4.  Set the following:
    *   **Environment**: Java
    *   **Build Command**: `cd backend && ./mvnw clean install -DskipTests`
    *   **Start Command**: `java -jar backend/target/bp-dashboard-0.0.1-SNAPSHOT.jar`
5.  Add **Environment Variables**:
    *   `DB_URL`: The JDBC URL from TiDB/Neon (e.g., `jdbc:mysql://host:port/db?sslMode=VERIFY_IDENTITY` or `jdbc:postgresql://host/db?sslmode=require`)
    *   `DB_USERNAME`: Your database user
    *   `DB_PASSWORD`: Your database password
    *   `DB_DIALECT`: `org.hibernate.dialect.MySQLDialect` (for TiDB) or `org.hibernate.dialect.PostgreSQLDialect` (for Neon)
    *   `JWT_SECRET`: A long random string (e.g., `your-very-secure-secret-key-12345`)
    *   `FRONTEND_URL`: (Wait until Phase 3 and then update this)

## Phase 3: Deploy Frontend (Vercel)
1.  Login to [Vercel](https://vercel.com/).
2.  Import your GitHub repository.
3.  Set the following:
    *   **Root Directory**: `frontend`
    *   **Framework Preset**: Vite
4.  Add **Environment Variable**:
    *   `VITE_API_URL`: Your Render Web Service URL (e.g., `https://your-backend.onrender.com`)
5.  Click **Deploy**.

## Phase 4: Final Connection
1.  Once Vercel finishes, copy your **Frontend URL**.
2.  Go back to **Render** -> **Dashboard** -> your backend service -> **Environment**.
3.  Update/Add `FRONTEND_URL` with your Vercel URL.
4.  Render will restart. You're now live!

---
*Note: The first time you open the Render URL, it might take a minute to "wake up" from the free-tier sleep.*
