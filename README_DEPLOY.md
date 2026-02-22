# 🚀 Full In-Depth Deployment Guide: BP Dashboard

This guide provides step-by-step instructions to deploy your application for **free** using modern cloud services.

---

## 🏗️ Phase 1: Database Setup (TiDB Cloud)

1.  **Sign Up**: Go to [TiDB Cloud](https://tidbcloud.com/) and create a free **Serverless** cluster.
2.  **Get Credentials**: Click **"Connect"**. Note down your **Host**, **Port (4000)**, **User**, and **Password**.
3.  **JDBC URL Pattern**: Your `DB_URL` will look like this:
    `jdbc:mysql://{HOST}:4000/test?user={USER}&password={PASSWORD}&sslMode=VERIFY_IDENTITY`

---

## ⚙️ Phase 2: Backend Deployment (Render)

1.  Login to [Render](https://render.com/) and click **"New +" -> "Web Service"**.
2.  Connect your GitHub repository.
3.  **Basic Settings**:
    - **Environment**: `Docker` (Render will auto-detect your new `Dockerfile`)
    - **Region**: Choose the one closest to you.
    - **Plan**: `Free`
4.  **Environment Variables** (Go to the "Environment" tab):
    - `DB_URL`: (Your JDBC URL from Phase 1)
    - `DB_USERNAME`: (Your TiDB User)
    - `DB_PASSWORD`: (Your TiDB Password)
    - `DB_DIALECT`: `org.hibernate.dialect.MySQLDialect`
    - `JWT_SECRET`: (Any long random string)
    - `TWILIO_SID`: (From your Twilio Console)
    - `TWILIO_TOKEN`: (From your Twilio Console)
    - `TWILIO_PHONE`: (Your Twilio WhatsApp Number)
    - `PORT`: `8080`

---

## 🎨 Phase 3: Frontend Deployment (Vercel)

Vercel will host your React/Vite dashboard.

1.  Login to [Vercel](https://vercel.com/) and click **"Add New" -> "Project"**.
2.  Import your GitHub repository.
3.  **Configure Project**:
    - **Project Name**: `bp-dashboard`
    - **Framework Preset**: `Vite`
    - **Root Directory**: `frontend`
4.  **Environment Variables**:
    - `VITE_API_URL`: (Your Render URL, e.g., `https://bp-backend.onrender.com`)
5.  Click **Deploy**.

---

## 🔗 Phase 4: Closing the Loop (CORS)

For security, your backend only allows requests from your frontend.

1.  Copy your **new Vercel URL** (e.g., `https://bp-dashboard.vercel.app`).
2.  Go back to your **Render** Dashboard.
3.  Go to your backend service -> **Environment**.
4.  Update/Add:
    - `FRONTEND_URL`: (Paste your Vercel URL here)
5.  **Save Changes**. Render will redeploy automatically.

---

## 📱 Phase 5: WhatsApp Setup (Twilio Sandbox)

To receive reminders on a new phone:
1.  Go to [Twilio WhatsApp Sandbox](https://console.twilio.com/us1/develop/sms/settings/whatsapp-sandbox).
2.  Scan the QR code or send the "join" message (e.g., `join word-word`) to the Twilio number from your phone.
3.  Ensure your `TWILIO_PHONE` in Render matches the Sandbox number.
4.  The app will now be able to send reminders to that phone!

---

## 🛠️ Troubleshooting & Tips

- **Cold Starts**: Render's free tier "sleeps" after 15 mins of inactivity. The first request after a break will take ~1-2 minutes to start.
- **SSL Errors**: Ensure your `DB_URL` includes the SSL parameters (`sslMode=VERIFY_IDENTITY` for TiDB or `sslmode=require` for Neon).
- **Check Logs**:
    - **Render**: Dashboard -> Events/Logs (for backend startup issues).
    - **Vercel**: Dashboard -> Deployments -> Functions/Logs (for API connection issues).
- **PWA**: Once deployed, your PWA will work on HTTPS. Open the Vercel URL on your phone's browser (Safari on iOS or Chrome on Android) and tap "Add to Home Screen".

---

**You are now live! 🎊**
Your BP Dashboard is accessible globally, and your data is safely stored in the cloud.
