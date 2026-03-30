# InsForge Backend Integration — Architecture & Implementation Plan

> Migrate the Doctris Hospital Management System from Spring Boot (`localhost:8080`) to InsForge BaaS, transforming it into a hackathon-ready AI Healthcare System.

---

## 1. Replace Backend: Spring Boot → InsForge

### Remove Dependencies
```diff
# package.json changes
- "axios": "^1.12.2",
- "twilio": "^5.10.4",
+ "@insforge/sdk": "latest",
```

### New InsForge Client — Replace [utils/apiClient.js](file:///C:/Users/Anuj/Downloads/Doctris-Hospital-Management-System-main/Doctris-Hospital-Management-System-main/utils/apiClient.js)

**Before** (Axios → `localhost:8080`):
```javascript
import axios from "axios";
const apiClient = axios.create({ baseURL: "http://localhost:8080" });
```

**After** (InsForge SDK):
```javascript
import { createClient } from '@insforge/sdk';

export const insforge = createClient({
  baseUrl: 'https://4qg2f9tk.us-east.insforge.app',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3OC0xMjM0LTU2NzgtOTBhYi1jZGVmMTIzNDU2NzgiLCJlbWFpbCI6ImFub25AaW5zZm9yZ2UuY29tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM3MzQxNjF9.vK65y2UcEnOUpaobgKr-dakRXqCePxUzrMM_8lPqyCY'
});
```

---

## 2. Database Schema (InsForge PostgreSQL)

### Tables to Create via `run-raw-sql`

#### `patients` (extra medical data — auth users are managed by InsForge Auth)
```sql
CREATE TABLE patients (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE,        -- Links to InsForge auth user ID
  first_name TEXT,
  last_name TEXT,
  gender TEXT,
  birthday DATE,
  phone_number TEXT,
  address TEXT,
  blood_group TEXT,
  introduction TEXT,
  profile_image_url TEXT,
  profile_image_key TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### `scans` (uploaded medical scans)
```sql
CREATE TABLE scans (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,               -- InsForge auth user ID
  file_url TEXT NOT NULL,              -- Storage URL
  file_key TEXT NOT NULL,              -- Storage key for download/delete
  file_type TEXT NOT NULL,             -- 'image' or 'video'
  file_name TEXT,
  status TEXT DEFAULT 'uploaded',      -- 'uploaded' | 'analyzing' | 'completed' | 'failed'
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### `scan_results` (AI analysis results)
```sql
CREATE TABLE scan_results (
  id SERIAL PRIMARY KEY,
  scan_id INTEGER REFERENCES scans(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  diagnosis TEXT,                      -- AI-generated diagnosis summary
  confidence NUMERIC(5,2),             -- Confidence percentage (e.g., 92.50)
  details JSONB,                       -- Full AI response (structured findings)
  model_used TEXT,                     -- Which AI model was used
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### `patient_medical_data` (symptoms, history)
```sql
CREATE TABLE patient_medical_data (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  age INTEGER,
  symptoms JSONB DEFAULT '[]',         -- ["headache", "fever", "cough"]
  medical_history JSONB DEFAULT '{}',  -- { allergies: [], conditions: [], medications: [] }
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Storage Bucket
Create a **public** bucket named `medical-scans` for uploaded images/videos.

---

## # Professional Specialist Dashboard & Clinical Ecosystem Plan

This plan implements a high-performance specialist dashboard with real-time synchronization and a multi-layer clinical verification system.

## User Review Required

> [!IMPORTANT]
> **Authorization Policy**: I will implement a dual-check security model. Access to specialist routes will be granted if the `role` is `doctor` in metadata OR if a matching record exists in the `doctors` table.
> **Real-time Engine**: I will use `@insforge/sdk`'s Real-time Pub/Sub to push notifications to patients when a specialist verifies their report.
> **Schema Check**: This implementation assumes the `appointments` and `doctors` tables from the previous research phase are active.

## Proposed Changes

### 1. Security & Identity Layer
- [MODIFY] **`features/patients/patientsSlice.js`**: Add `isSpecialist` and `doctorProfile` states. Update profile fetcher to check the `doctors` table automatically.
- [NEW] **`components/SpecialistGuard.js`**: A specialized route protector that performs the dual-check (Metadata + DB) before allowing access to `/specialist/*`.

### 2. Real-time Synchronization
- [NEW] **`features/realtime/notificationsSlice.js`**: Manage global and private real-time notification streams.
- [NEW] **`components/RealtimeProvider.js`**: Initializes WebSocket subscriptions for the logged-in user.

### 3. Specialist Workspace (`/specialist/dashboard`)
- [MODIFY] **`app/specialist/dashboard/page.js`**:
    - **Overview**: Real-time stats for pending diagnostic reviews.
    - **Diagnostic Worklist**: Filtered list of scans requiring human verification.
    - **Specialist Copilot**: An AI panel that summarizes patient medical history on-the-fly.

### 4. Clinical Verification Flow
- [NEW] **`app/specialist/results/[id]/page.js`**:
    - Dual-view interface (AI Report + Image Analyzer).
    - Clinical Input: Specialists can refine AI diagnosis and add professional notes.
    - Status Update: Mark results as `verified` (triggers real-time update to patient).

### 5. Appointment Booking System
- [NEW] **`features/appointments/appointmentsSlice.js`**: Handle CRUD for medical appointments.
- [MODIFY] **`app/results/[id]/page.js`**: Add "Book Clinical Consultation" button that pre-links the `scan_id`.
- [NEW] **`app/appointment/book/page.js`**: A comprehensive multi-step booking experience.

## Verification Plan

### Automated Tests
- Build verification: `npm run build`.
- Real-time connection test: Log events to console during development.

### Manual Verification
1. **RBAC Test**: Attempt to access `/specialist/dashboard` with a normal patient account (should block).
2. **Clinical HITL**: Upload a scan as a patient. Login as a specialist, verify the report, and check if the patient sees the "Verified" status in real-time.
3. **Appointment Flow**: Book a consultation from a scan result and ensure it links to the specialist's schedule correctly.

---

## 3. API Structure — InsForge SDK Calls (Not REST Endpoints)

> [!IMPORTANT]
> InsForge uses SDK method calls, NOT traditional REST endpoints. There is no separate API server — the frontend calls the InsForge SDK directly.

### API-to-SDK Mapping

| Conceptual API | InsForge SDK Call | Used By |
|---|---|---|
| `POST /register` | `insforge.auth.signUp()` | [app/register/page.js](file:///C:/Users/Anuj/Downloads/Doctris-Hospital-Management-System-main/Doctris-Hospital-Management-System-main/app/register/page.js) |
| `POST /login` | `insforge.auth.signInWithPassword()` | [app/login/page.js](file:///C:/Users/Anuj/Downloads/Doctris-Hospital-Management-System-main/Doctris-Hospital-Management-System-main/app/login/page.js) |
| `POST /logout` | `insforge.auth.signOut()` | [components/header.js](file:///C:/Users/Anuj/Downloads/Doctris-Hospital-Management-System-main/Doctris-Hospital-Management-System-main/components/header.js) |
| `GET /session` | `insforge.auth.getCurrentSession()` | [features/patientInitializer.js](file:///C:/Users/Anuj/Downloads/Doctris-Hospital-Management-System-main/Doctris-Hospital-Management-System-main/features/patientInitializer.js) |
| `PUT /profile` | `insforge.auth.setProfile()` | [app/profile/page.js](file:///C:/Users/Anuj/Downloads/Doctris-Hospital-Management-System-main/Doctris-Hospital-Management-System-main/app/profile/page.js) |
| `POST /upload-scan` | `insforge.storage.from('medical-scans').upload()` + `insforge.database.from('scans').insert()` | `app/scan-upload/page.js` |
| `POST /analyze-scan` | `insforge.ai.chat.completions.create()` + `insforge.database.from('scan_results').insert()` | `app/scan-upload/page.js` |
| `GET /results` | `insforge.database.from('scan_results').select()` | `app/results/page.js` |
| `GET /results/{id}` | `insforge.database.from('scan_results').select().eq('id', id).single()` | `app/results/[id]/page.js` |
| `POST /patient-medical-data` | `insforge.database.from('patient_medical_data').insert()` / `.upsert()` | [app/profile/page.js](file:///C:/Users/Anuj/Downloads/Doctris-Hospital-Management-System-main/Doctris-Hospital-Management-System-main/app/profile/page.js) |
| `GET /patient-medical-data` | `insforge.database.from('patient_medical_data').select().eq('user_id', userId)` | [app/profile/page.js](file:///C:/Users/Anuj/Downloads/Doctris-Hospital-Management-System-main/Doctris-Hospital-Management-System-main/app/profile/page.js) |

---

## 4. Request & Response Contracts (JSON)

### 4.1 Auth: Sign Up
```json
// REQUEST → insforge.auth.signUp()
{
  "email": "patient@example.com",
  "password": "secureP@ss123",
  "name": "Anuj Kumar"
}

// RESPONSE
{
  "data": {
    "user": { "id": "usr_abc123", "email": "patient@example.com" },
    "requireEmailVerification": true,
    "accessToken": null
  },
  "error": null
}
```

### 4.2 Auth: Sign In
```json
// REQUEST → insforge.auth.signInWithPassword()
{ "email": "patient@example.com", "password": "secureP@ss123" }

// RESPONSE
{
  "data": {
    "user": {
      "id": "usr_abc123", "email": "patient@example.com",
      "profile": { "name": "Anuj Kumar", "avatar_url": null }
    },
    "accessToken": "eyJhbG..."
  },
  "error": null
}
```

### 4.3 Upload Scan
```json
// STEP 1: Upload file → insforge.storage.from('medical-scans').upload()
// INPUT: File object from <input type="file">
// RESPONSE:
{
  "data": {
    "bucket": "medical-scans",
    "key": "usr_abc123/scan-1710123456.jpg",
    "url": "https://4qg2f9tk.us-east.insforge.app/api/storage/...",
    "mimeType": "image/jpeg",
    "size": 245678
  },
  "error": null
}

// STEP 2: Save to DB → insforge.database.from('scans').insert()
// INPUT:
[{
  "user_id": "usr_abc123",
  "file_url": "https://4qg2f9tk..../scan.jpg",
  "file_key": "usr_abc123/scan-1710123456.jpg",
  "file_type": "image",
  "file_name": "chest-xray.jpg",
  "status": "uploaded"
}]

// RESPONSE:
{
  "data": [{ "id": 1, "user_id": "usr_abc123", "file_url": "...", "status": "uploaded" }],
  "error": null
}
```

### 4.4 Analyze Scan (AI)
```json
// REQUEST → insforge.ai.chat.completions.create()
{
  "model": "openai/gpt-4o-mini",
  "messages": [
    {
      "role": "system",
      "content": "You are a medical image analysis assistant. Analyze the scan and provide: 1) Primary diagnosis 2) Confidence % 3) Key findings 4) Recommendations. Return JSON format."
    },
    {
      "role": "user",
      "content": [
        { "type": "text", "text": "Patient: Male, 45. Symptoms: chest pain, shortness of breath. Analyze this chest X-ray." },
        { "type": "image_url", "image_url": { "url": "https://4qg2f9tk..../scan.jpg" } }
      ]
    }
  ]
}

// RESPONSE (AI output parsed and stored):
{
  "diagnosis": "Possible pneumonia in right lower lobe",
  "confidence": 87.5,
  "details": {
    "findings": ["Right lower lobe opacity", "No pleural effusion", "Heart size normal"],
    "severity": "moderate",
    "recommendations": ["Clinical correlation recommended", "Consider CT scan", "Follow-up in 2 weeks"]
  },
  "model_used": "openai/gpt-4o-mini"
}
```

### 4.5 Get Results
```json
// REQUEST → insforge.database.from('scan_results').select('*, scans(*)').eq('user_id', userId)

// RESPONSE:
{
  "data": [
    {
      "id": 1,
      "scan_id": 1,
      "diagnosis": "Possible pneumonia in right lower lobe",
      "confidence": 87.5,
      "details": { "findings": [...], "severity": "moderate", "recommendations": [...] },
      "model_used": "openai/gpt-4o-mini",
      "created_at": "2026-03-17T13:00:00Z",
      "scans": { "file_url": "https://...", "file_type": "image", "file_name": "chest-xray.jpg" }
    }
  ],
  "error": null
}
```

### 4.6 Patient Medical Data
```json
// REQUEST → insforge.database.from('patient_medical_data').insert()
[{
  "user_id": "usr_abc123",
  "age": 45,
  "symptoms": ["chest pain", "shortness of breath", "fatigue"],
  "medical_history": {
    "allergies": ["penicillin"],
    "conditions": ["hypertension"],
    "medications": ["metoprolol 50mg"],
    "past_surgeries": []
  },
  "notes": "Symptoms started 3 days ago"
}]

// RESPONSE:
{
  "data": [{ "id": 1, "user_id": "usr_abc123", "age": 45, "symptoms": [...] }],
  "error": null
}
```

---

## 5. Complete Data Flow

```mermaid
graph TB
    subgraph "User Flow"
        A[👤 User opens app] --> B[Login/Register]
        B --> C{Authenticated?}
        C -->|Yes| D[Dashboard / Profile]
        C -->|No| B
    end

    subgraph "Scan Upload Flow"
        D --> E[📸 Upload Scan Page]
        E --> F[Select image/video file]
        F --> G["insforge.storage.upload()"]
        G --> H["insforge.database.insert(scans)"]
        H --> I[Trigger AI Analysis]
    end

    subgraph "AI Processing Flow"
        I --> J["insforge.ai.chat.completions.create()"]
        J --> K[AI analyzes image + patient data]
        K --> L[Parse AI response as JSON]
        L --> M["insforge.database.insert(scan_results)"]
        M --> N["insforge.database.update(scans → status: completed)"]
    end

    subgraph "Results Flow"
        N --> O[📊 Results Dashboard]
        O --> P["insforge.database.select(scan_results)"]
        P --> Q[Display cards with diagnosis + confidence]
        Q --> R[Click → Detail page]
        R --> S["insforge.database.select().eq(id).single()"]
    end

    style G fill:#4CAF50,color:white
    style J fill:#FF9800,color:white
    style M fill:#2196F3,color:white
```

### Step-by-Step:

1. **User** → Opens app → `insforge.auth.getCurrentSession()` restores session
2. **Register** → `insforge.auth.signUp()` → email verification → `insforge.auth.verifyEmail()`
3. **Login** → `insforge.auth.signInWithPassword()` → gets `accessToken` + `user` object
4. **Upload Scan** → File picker → `insforge.storage.from('medical-scans').upload(path, file)` → saves `{url, key}` to `scans` table
5. **AI Analysis** → `insforge.ai.chat.completions.create()` with scan URL + patient symptoms → Parse JSON response → Insert into `scan_results` table → Update scan status to `completed`
6. **View Results** → `insforge.database.from('scan_results').select('*, scans(*)').eq('user_id', userId)` → Display in dashboard
7. **Result Detail** → `insforge.database.from('scan_results').select().eq('id', resultId).single()` → Full findings page

---

## 6. Integration Details

### 6.1 File Upload (Image/Video)

```
Component: ScanUploader.js (new)
Storage Bucket: 'medical-scans' (public, created via MCP)

Flow:
1. <input type="file" accept="image/*,video/*"> captures file
2. Preview with URL.createObjectURL(file)
3. Upload: insforge.storage.from('medical-scans').upload(`${userId}/${timestamp}-${file.name}`, file)
4. Save returned {url, key} → insforge.database.from('scans').insert([...]).select()
5. Return scan record ID for AI analysis trigger
```

### 6.2 Database Storage

```
Tables:
- patients         → Extended patient profile data (linked to auth user_id)
- scans            → Scan file metadata (url, key, type, status)
- scan_results     → AI analysis output (diagnosis, confidence, details as JSONB)
- patient_medical_data → Symptoms + medical history (JSONB fields)

All queries use: insforge.database.from('table').select/insert/update/delete
Filter by user: .eq('user_id', currentUser.id)
```

### 6.3 AI Processing Trigger

```
Triggered after successful scan upload

Flow:
1. Get patient medical data: insforge.database.from('patient_medical_data').select().eq('user_id', userId)
2. Build prompt with scan URL + patient context (age, symptoms, history)
3. Call: insforge.ai.chat.completions.create({
     model: 'openai/gpt-4o-mini',
     messages: [systemPrompt, { content: [text + image_url] }]
   })
4. Parse AI response → extract diagnosis, confidence, findings
5. Save: insforge.database.from('scan_results').insert([parsedResult]).select()
6. Update scan status: insforge.database.from('scans').update({status:'completed'}).eq('id', scanId)
```

---

## 7. Actions Folder Migration

### [actions/patient-action.js](file:///C:/Users/Anuj/Downloads/Doctris-Hospital-Management-System-main/Doctris-Hospital-Management-System-main/actions/patient-action.js) → Replace ALL axios calls

| Old (Axios) | New (InsForge SDK) |
|---|---|
| `apiClient.post("/patients/register", data)` | `insforge.auth.signUp({ email, password, name })` |
| `apiClient.post("/patients/login", creds)` | `insforge.auth.signInWithPassword({ email, password })` |
| `apiClient.get("/patients/email/${email}")` | `insforge.auth.getCurrentSession()` + `insforge.database.from('patients').select().eq('user_id', userId).single()` |
| `apiClient.put("/patients/update/${id}", formData)` | `insforge.auth.setProfile({...})` + `insforge.database.from('patients').update({...}).eq('user_id', userId)` |

### [actions/doctor-action.js](file:///C:/Users/Anuj/Downloads/Doctris-Hospital-Management-System-main/Doctris-Hospital-Management-System-main/actions/doctor-action.js) → Static data or InsForge DB

| Old | New |
|---|---|
| `apiClient.get("/admin/doctors/all")` | `insforge.database.from('doctors').select('*')` (if doctors table exists) or static JSON data for hackathon |

### `actions/scan-action.js` → NEW

```
- uploadScan: storage.upload() → database.insert(scans)
- analyzeScan: ai.chat.completions.create() → database.insert(scan_results)
- fetchScans: database.from('scans').select().eq('user_id', userId)
```

### `actions/result-action.js` → NEW

```
- fetchResults: database.from('scan_results').select('*, scans(*)').eq('user_id', userId)
- fetchResultById: database.from('scan_results').select('*, scans(*)').eq('id', id).single()
```

---

## 8. File-by-File Change Summary

| # | File | Action | What Changes |
|---|---|---|---|
| 1 | [utils/apiClient.js](file:///C:/Users/Anuj/Downloads/Doctris-Hospital-Management-System-main/Doctris-Hospital-Management-System-main/utils/apiClient.js) | **REWRITE** | Replace Axios with `createClient()` from `@insforge/sdk` |
| 2 | [actions/patient-action.js](file:///C:/Users/Anuj/Downloads/Doctris-Hospital-Management-System-main/Doctris-Hospital-Management-System-main/actions/patient-action.js) | **REWRITE** | Replace all axios calls with InsForge auth + database SDK |
| 3 | [actions/doctor-action.js](file:///C:/Users/Anuj/Downloads/Doctris-Hospital-Management-System-main/Doctris-Hospital-Management-System-main/actions/doctor-action.js) | **MODIFY** | Replace axios with InsForge database (or hardcode for hackathon) |
| 4 | `actions/scan-action.js` | **NEW** | Upload scan + trigger AI analysis |
| 5 | `actions/result-action.js` | **NEW** | Fetch AI results |
| 6 | [features/patients/patientsSlice.js](file:///C:/Users/Anuj/Downloads/Doctris-Hospital-Management-System-main/Doctris-Hospital-Management-System-main/features/patients/patientsSlice.js) | **MODIFY** | Update to handle InsForge auth response shape |
| 7 | `features/scans/scansSlice.js` | **NEW** | Scan state management |
| 8 | `features/results/resultsSlice.js` | **NEW** | Results state management |
| 9 | [store/store.js](file:///C:/Users/Anuj/Downloads/Doctris-Hospital-Management-System-main/Doctris-Hospital-Management-System-main/store/store.js) | **MODIFY** | Add scans + results reducers |
| 10 | [components/header.js](file:///C:/Users/Anuj/Downloads/Doctris-Hospital-Management-System-main/Doctris-Hospital-Management-System-main/components/header.js) | **MODIFY** | Add AI SCAN + RESULTS nav links, update logout |
| 11 | [app/login/page.js](file:///C:/Users/Anuj/Downloads/Doctris-Hospital-Management-System-main/Doctris-Hospital-Management-System-main/app/login/page.js) | **REWRITE** | Replace Twilio OTP with InsForge `signInWithPassword()` |
| 12 | [app/register/page.js](file:///C:/Users/Anuj/Downloads/Doctris-Hospital-Management-System-main/Doctris-Hospital-Management-System-main/app/register/page.js) | **REWRITE** | Replace Twilio OTP with InsForge `signUp()` + email verification |
| 13 | [app/profile/page.js](file:///C:/Users/Anuj/Downloads/Doctris-Hospital-Management-System-main/Doctris-Hospital-Management-System-main/app/profile/page.js) | **MODIFY** | Add Medical History + AI Results tabs, use InsForge auth |
| 14 | `app/scan-upload/page.js` | **NEW** | Scan upload page with AI analysis |
| 15 | `app/results/page.js` | **NEW** | Results dashboard |
| 16 | `app/results/[id]/page.js` | **NEW** | Individual result detail page |
| 17 | `components/ScanUploader.js` | **NEW** | File upload with drag-and-drop |
| 18 | `components/AIResultCard.js` | **NEW** | Result display card |
| 19 | [app/layout.js](file:///C:/Users/Anuj/Downloads/Doctris-Hospital-Management-System-main/Doctris-Hospital-Management-System-main/app/layout.js) | **MODIFY** | Update metadata for AI Healthcare branding |
| 20 | [components/HomeMeet.js](file:///C:/Users/Anuj/Downloads/Doctris-Hospital-Management-System-main/Doctris-Hospital-Management-System-main/components/HomeMeet.js) | **MODIFY** | Update hero text for AI healthcare |
| 21 | [package.json](file:///C:/Users/Anuj/Downloads/Doctris-Hospital-Management-System-main/Doctris-Hospital-Management-System-main/package.json) | **MODIFY** | Remove axios/twilio, add @insforge/sdk |

---

## Verification Plan

### Automated / Self-Verification
1. **Build check**: Run `npm run build` — must pass with zero errors
2. **Dev server**: Run `npm run dev` — app must start on `localhost:3000`

### Browser Verification (using browser tool)
3. **Homepage loads**: Navigate to `localhost:3000`, verify hero section renders
4. **Register flow**: Navigate to `/register`, fill form, verify `signUp()` call works
5. **Login flow**: Navigate to `/login`, sign in, verify redirect to `/profile`
6. **Scan upload**: Navigate to `/scan-upload`, upload test image, verify it appears in InsForge storage
7. **AI analysis**: After upload, trigger analysis, verify result saved to `scan_results` table
8. **Results page**: Navigate to `/results`, verify results list renders with cards
9. **Nav links**: Verify header shows AI SCAN and RESULTS links

### Manual Verification (User)
10. **InsForge dashboard**: Check that `scans`, `scan_results`, `patient_medical_data` tables have data
11. **Storage**: Verify uploaded scan files appear in the `medical-scans` bucket
