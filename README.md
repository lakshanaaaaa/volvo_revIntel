# SpendNest Revenue Intelligence Inbox

A sales manager workspace for reviewing call and meeting activity, understanding rep outreach, routing conversations, and tracking follow-ups for **21 August 2026 (Asia/Kolkata)**.

---

## 1. Quick Start & How to Run

The application is completely standalone, client-side, and requires no external databases or API keys.

### Option A: Direct Browser Launch (Recommended)
Simply double-click or open `app/index.html` in any modern web browser (Google Chrome, Microsoft Edge, Mozilla Firefox, Safari):
```
file:///E:/Dinesh's Projects/lakshana/candidate-v1.0 (3)_layout_fixed (1)(2) (3)/candidate/app/index.html
```

### Option B: Local Web Server
If you prefer running via a local static web server:
```bash
# Navigate to the workspace root
cd candidate

# Start Python HTTP server
python -m http.server 8000

# Open in browser
http://localhost:8000/app/
```

*Note:* When opened for the first time, the application automatically loads the final reconciled state (Batch 01 + Batch 02 applied) with all 44 records and 18 transcripts visible.

---

## 2. Replay & Reproduction Steps

To verify the public replay contract, click **"Reset Data"** in the sidebar footer, then open the **"Import"** modal to run the exact 5-step test sequence:

| Step | Action in UI | Expected & Verified Behaviour |
| :--- | :--- | :--- |
| **1. Initial Import** | Click **"Load Initial Batch (01)"** | Exactly **44 unique records** loaded (30 calls, 14 meetings). **17 usable transcripts** available. `M07` has 0 turns (unavailable). |
| **2. Repeat Import** | Click **"Load Initial Batch (01)"** again | **0 duplicates added, 44 ignored**. Total records remains exactly 44. No inflated activity counts. |
| **3. Manual Correction** | Click **Inbox** &rarr; select **M07** &rarr; click **"Edit Route"** &rarr; check **"Customer Follow-up"** &rarr; click **Save** | `M07` route is saved as `Customer Follow-up` with a gold **"★ Manual Override"** badge. |
| **4. Late Update** | Click **"Import"** &rarr; click **"Load Update Batch (02)"** | `M07` is upgraded from revision 1 to revision 2. A 27-turn transcript becomes available. **Record count stays 44**. Total usable transcripts increases from 17 to **18**. |
| **5. Preserve Judgment** | Press **F5 (Refresh)** or close and reopen browser | State loads from `localStorage`. `M07`'s 27-turn transcript remains visible, its revision is 2, and its manual route (`Customer Follow-up`) **remains strictly in effect**. |

---

## 3. Metric Definitions & Denominators

| Metric | Calculation & Exact Denominator | Interpretation & Source Grounding |
| :--- | :--- | :--- |
| **Selected Records** | Count of distinct `(source_type, source_id)` pairs = **44** | Deliberately selected sample for 21 Aug 2026 IST; not a full-team census. |
| **Usable Transcript Coverage** | Loaded records with non-empty text divided by all loaded records = **18 / 44 (40.9%)** | 10 of 30 calls have text (33.3%); 8 of 14 meetings have text (57.1%). 20 background calls and 6 unrecorded meetings lack speech text by design. |
| **Source-Reported Connect Rate** | Calls with `is_connected: true` divided by calls with non-null `is_connected` = **11 / 30 (36.7%)** | Telephony source classifier. 11 connected, 19 unconnected, 0 unknown. Contradicted by actual audio (B11/B14 were unresponsive; C04 was an answered voicemail). |
| **Rep vs Organiser Split** | Separates SDR Call Reps from Calendar Organisers | Calls feature 5 SDR reps (Arun, Meera, Kiran, Dev, Leela). Meetings list calendar organizer emails (`team06` to `team14`, `arun`). An organizer is an internal scheduler, not necessarily an AE or attendee. |

---

## 4. Three Most Important Findings (with Source Evidence)

### Finding 1: Telephony Telemetry False Positives (B11/B14 vs C04)
- **What was noticed:** The telephony system marked calls `B11` (duration 26s) and `B14` (duration 9s) as `is_connected: true` despite `observed_outcome: "unresponsive"`. Conversely, call `C04` was marked `is_connected: false` despite containing a complete 95-second recorded voicemail pitch by SDR Arun.
- **Passage Reference:** Call `C04` exact quote:
  > *"Arun from SpendNest, following up on our earlier conversation about expense software..."*
- **Product Impact:** On the **Dashboard**, the connection rate metric is strictly isolated and labeled as `Source-Reported Connect Rate (11/30 calls = 36.7%)` with explicit denominator disclosure. In the **Inbox & Routing**, `C04` is preserved as an actionable outreach touchpoint rather than discarded as a failed call.

### Finding 2: Meeting M10 is an Internal Enablement Session, Not Customer Pipeline
- **What was noticed:** Calendar meeting `M10` ("Billing workflow walkthrough") involves three SpendNest team members (Team member A, Team member B, Team member C) conducting operational training on back-office billing access, with zero external prospects or clients present.
- **Passage Reference:** Meeting `M10`, Turn 20:
  > *"I will request the back-office access separately for the next training session. If questions come up when you review the recordings, add them to the document."*
- **Product Impact:** In **Routing**, `M10` is classified under `Internal`. On the **Manager Brief**, it is segregated from commercial sales pipeline and customer follow-up priorities.

### Finding 3: Meeting M02 is a Supplier Evaluation where SpendNest is the Buyer
- **What was noticed:** Meeting `M02` ("LedgerBridge / SpendNest discussion") is an infrastructure evaluation where SpendNest's strategy team (Team members A & B) is evaluating LedgerBridge as a card-issuing and banking API supplier, not selling SpendNest software.
- **Passage Reference:** Meeting `M02`, Turn 1:
  > *"I work on strategy and partnerships at SpendNest. We serve businesses with cards and accounts payable, and we are developing our infrastructure..."*
- **Product Impact:** In **Routing & Folder Structure**, `M02` is assigned to `Partner/Vendor` and excluded from sales pipeline and rep quota forecasting, preventing artificial ARR inflation.

---

## 5. One Deliberately Rejected Decision

- **Alternative Considered:** Guessing or extrapolating deal pipeline currency values ($ARR), lead scores, or sales rep quota leaderboards from conversational snippets (e.g., estimating Asterloom `M03` at $50k or ranking Meera as top SDR based on call count).
- **Why Rejected:** The brief and data dictionary explicitly warn that *"no CRM opportunity table, authoritative deal value, full account history or confirmed staff-role directory is supplied... missing inputs cannot be replaced by guesses."* Fabricating monetary figures creates dangerous false confidence for leadership.
- **Accepted Trade-off:** The manager dashboard omits an aggregate pipeline currency card. Instead, the manager receives 100% verified operational intelligence: verified conversation topics, next steps with explicit owners, and grounded coaching notes.
- **Resulting Choice in Product:** The **Manager Brief** groups priorities by qualitative urgency (Today, Tuesday, Thursday) rather than unverified revenue sizing, and rep activity bars are explicitly labeled as *"Selected records only. Not a full-team daily view."*

---

## 6. Generated Exports & Manifest

All generated exports are persisted in the `exports/` directory and can be generated or downloaded on-demand from the **Exports** tab in the app:

- `exports/manifest.json`: Machine-readable JSON manifest conforming to `DATA_CONTRACT.md`.
- `exports/manifest.csv`: Machine-readable CSV manifest with identical schema.
- `exports/daily_briefs/daily_brief_2026-08-21.md`: Executive brief for 21 August 2026.
- Route folders containing individual Markdown analysis reports:
  * `exports/sales_coaching/` (C01, C03, C06, C07, M06)
  * `exports/deal_followup/` (C02, C03, C04, C05, C07, C08, C09, C10, M03, M06)
  * `exports/customer_followup/` (M04, M07)
  * `exports/cs_support/` (M04, M07, M09)
  * `exports/partner_vendor/` (M01, M02)
  * `exports/internal/` (M10)
  * `exports/background/` (Intake records for B01-B20 and silent meetings)

---

## 7. Submission Artifacts & Deliverables

1. **Working Application:** `app/index.html`, `app/app.js`, `app/data.js`.
2. **Five Submission Slides:**
   - Editable PPTX: `Revenue_Intelligence_Inbox_Slides.pptx`
   - Web / Print-to-PDF Slide Deck: `slides.html`
3. **Screen Recording Script:** `SCREEN_RECORDING_SCRIPT.md` (exact 3-minute spoken narration and click walkthrough).
4. **Generated Manifest & Export Files:** `exports/manifest.json` and `exports/manifest.csv`.

---

## 8. Development Notes, Time Spent & Limitations

- **Approximate Hours Spent:** ~7 hours total (investigation, data inspection, state engine, UI design, analysis synthesis, slides, and testing).
- **AI Usage:** Conversational analysis and citation mapping were pre-generated with LLMs and verified against source transcripts. The application runtime logic (filtering, revisions, replay, localStorage, manifest generation) runs 100% deterministically in client-side JavaScript.
- **Known Limitations:**
  * Sample extract of 44 interactions; not a continuous time series.
  * No audio media files or live CRM database access.
  * 26 records lack conversation text by design; substantive analysis is withheld for these to maintain data integrity.
