# Deployment Guide

Follow these steps to deploy your Pothole Detection System completely.

## 1. Database (Supabase)

1.  **Create Project**: Go to [Supabase](https://supabase.com/), create a new project, and note down your **Database Password**.
2.  **Get Credentials**:
    - Go to `Project Settings` > `Database`.
    - Find the `Connection String` (URI mode). It looks like `postgresql://postgres:[YOUR-PASSWORD]@db.xxxx.supabase.co:5432/postgres`.
    - **Save this**, we will use it for your Backend.
3.  **Run Schema**:
    - Go to `SQL Editor` in the Supabase sidebar.
    - Copy the contents of [`db_schema.sql`](file:///d:/project/pothole_trial_2/db_schema.sql) from your project.
    - Paste it into the editor and click **RUN**.
    - *Success Check*: Go to `Table Editor` and verifying `users` and `potholes` tables exist.

---

## 2. Backend & Python Service (Render)

1.  **New Web Service**: Go to [Render Dashboard](https://dashboard.render.com/) > `New` > `Web Service`.
2.  **Connect GitHub**: Select your repository.

### For Backend (Node.js)
- **Root Directory**: `server`
- **Build Command**: `npm install`
- **Start Command**: `node src/index.js`
- **Environment Variables**:
    - `DB_HOST`: The host from Supabase (e.g. `db.xxxx.supabase.co`)
    - `DB_NAME`: `postgres` (default)
    - `DB_USER`: `postgres` (default)
    - `DB_PASSWORD`: [Your Supabase Password]
    - `DB_PORT`: `5432`
    - `JWT_SECRET`: Generate a random strong string (e.g. `mySuperSecretKey123`)
- **Deploy**.

### For Python Service (AI)
- **Root Directory**: `python-service`
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `./start.sh`
- **Environment Variables**:
    - `PYTHON_VERSION`: `3.9.0` (Recommended)
    - `PORT`: `10000` (Render sets this automatically usually, but good to be safe)
- **Deploy**.

**Important**: Once deployed, copy the **URL** of both services (e.g. `https://my-backend.onrender.com` and `https://my-python.onrender.com`).

---

## 3. Frontend (Vercel)

1.  **New Project**: Go to [Vercel Dashboard](https://vercel.com/) > `Add New` > `Project`.
2.  **Import Git**: Select your repository.
3.  **Configure Project**:
    - **Framework Preset**: Vite
    - **Root Directory**: `client` (Click `Edit` next to Root Directory and select `client`).
- **Environment Variables**:
    - `VITE_API_URL`: Paste your **Render Backend URL** (e.g. `https://my-backend.onrender.com`). **Do not add a trailing slash.**
4.  **Deploy**.

---

## 4. Final Connection
1.  Go back to your **Render Backend** settings environment variables.
2.  Add `PYTHON_SERVICE_URL` -> Value: Your **Render Python Service URL**.
3.  Add `CLIENT_URL` -> Value: Your **Vercel Frontend URL** (for CORS security if implemented).
4.  **Redeploy** the backend if needed to apply these new variables.

## Verification
- Visit your Vercel URL.
- Try registering/logging in.
- Test uploading an image.
