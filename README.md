# TravelMemory — Local Setup Guide

A step-by-step walkthrough for setting up the TravelMemory MERN stack app locally, including real issues encountered and how they were fixed.

---

## Tech Stack

- **Frontend:** React
- **Backend:** Node.js + Express
- **Database:** MongoDB (Atlas)

---

## Step 1: Install Prerequisites

- Node.js (v16+) — verify with `node -v`
- Git — verify with `git -v`

```bash
node -v
git -v
```

<img width="696" height="167" alt="image" src="https://github.com/user-attachments/assets/23294528-8cf9-4c19-87fb-0b01537ca1d8" />


---

## Step 2: Set Up MongoDB Atlas

1. Create a free account at [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create a free cluster (`Cluster0`)
3. Under **Database Access**, create a database user
4. Under **Network Access**, add `0.0.0.0/0` (allow access from anywhere)
5. Click **Connect → Drivers** and copy the connection string

<img width="1603" height="784" alt="image" src="https://github.com/user-attachments/assets/d469703c-fcd1-4cd3-a428-27b98194aae9" />
<img width="1598" height="480" alt="image" src="https://github.com/user-attachments/assets/d688d2cd-002f-4865-840e-38ed0bcfeb7d" />
<img width="1596" height="372" alt="image" src="https://github.com/user-attachments/assets/54295476-2876-4e4a-9879-797347d3f621" />



---

## Step 3: Configure Backend Environment Variables

Create a `.env` file inside `backend/`:

```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/travelmemory?retryWrites=true&w=majority
PORT=3001
```

> ⚠️ **Gotcha:** On Windows, File Explorer can silently save this as `.env.txt`. Create it via terminal instead:
> ```powershell
> notepad .env
> ```
> and save as **All Files**, not `.txt`.

<img width="1886" height="785" alt="image" src="https://github.com/user-attachments/assets/3692811b-c0e1-41fb-82cf-40f5ce2e78c1" />



---

## Step 4: Run the Backend

```bash
cd backend
npm install
node index.js
```

### Issues hit along the way

**Issue 1 — `Server started at http://localhost:undefined`**
Caused by a missing `.env` file, so `process.env.PORT` and `process.env.MONGO_URI` were both `undefined`.
**Fix:** created the `.env` file correctly (Step 4).

**Issue 2 — No confirmation of DB connection**
`conn.js` only logged errors, never success, making it look "stuck" even when connected. Added a success handler:

```js
const mongoose = require('mongoose')
const URL = process.env.MONGO_URI
mongoose.connect(URL)
mongoose.Promise = global.Promise
const db = mongoose.connection
db.once('open', () => console.log('MongoDB connected successfully!'))
db.on('error', console.error.bind(console, 'DB ERROR: '))
module.exports = { db, mongoose }
```

<img width="745" height="407" alt="image" src="https://github.com/user-attachments/assets/f5b2c684-002f-4b23-b711-b7551a186c76" />
<img width="478" height="77" alt="image" src="https://github.com/user-attachments/assets/1f85993e-4bb3-43d7-9dce-7b9e26d1e0f4" />

---

## Step 5: Configure Frontend Environment Variables

Create a `.env` file inside `frontend/`:

```env
REACT_APP_BACKEND_URL=http://localhost:3001
```
<img width="558" height="32" alt="image" src="https://github.com/user-attachments/assets/376f5031-d53e-4e61-8f2c-f8819de24307" />

---

## Step 6: Run the Frontend

```bash
cd frontend
npm install
npm start
```

### Issue hit: `Network Error (AxiosError)`

**Diagnosis:**
1. Confirmed backend was still running
2. Visited `http://localhost:3001/hello` directly in browser → confirmed it returned `Hello World!`
3. Verified frontend `.env` was correct
4. Restarted `npm start` (React only reads `.env` at startup, not on hot reload)

<img width="1889" height="113" alt="image" src="https://github.com/user-attachments/assets/4524b47b-9539-4005-be8d-89c2fe3c04fa" />
<img width="1047" height="282" alt="image" src="https://github.com/user-attachments/assets/c784a2c3-ab5e-4b75-9349-29cbddbdd76b" />


---

## Step 7: Verify End-to-End

Added a trip through the UI, then confirmed it in MongoDB Atlas → **Browse Collections**.

<img width="1896" height="439" alt="image" src="https://github.com/user-attachments/assets/951d2888-3a5a-4b49-aab8-815c67ccf7bb" />
<img width="1920" height="1025" alt="image" src="https://github.com/user-attachments/assets/442b1ca1-a20d-49d1-b7a0-1f4ee311e6f1" />
<img width="1847" height="662" alt="image" src="https://github.com/user-attachments/assets/7306fb1e-e96f-44d4-b8e0-72cbc3ec0b5f" />


---

## Debugging Checklist (Reusable for Any MERN Project)

- [ ] Backend terminal running with no errors?
- [ ] `.env` exists in the correct folder with the exact correct name?
- [ ] `dotenv.config()` called *before* any code reads `process.env`?
- [ ] MongoDB Atlas IP whitelist allows your connection?
- [ ] Connection string has real credentials, no leftover placeholders, no unencoded special characters in the password?
- [ ] Does a simple backend route (e.g. `/hello`) respond directly in the browser?
- [ ] Frontend restarted after any `.env` changes?

---