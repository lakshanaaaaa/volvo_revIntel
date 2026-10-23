/**
 * Pre-generated analysis for all 18 records with usable transcripts.
 * Keyed by "source_type_source_id" matching the DB compound identity.
 * These are loaded at import time and stored in the DB but NEVER overwritten
 * by a re-import — only a manual correction can change them.
 */

// Routes mapped to folder names (used by export generator)
export const ROUTE_FOLDER_MAP = {
  'Sales Coaching':     'sales_coaching',
  'Deal Follow-up':     'deal_followup',
  'Customer Follow-up': 'customer_followup',
  'CS/Support':         'cs_support',
  'Partner/Vendor':     'partner_vendor',
  'Internal':           'internal',
  'Background':         'background',
  'Needs Review':       'needs_review'
};

export const ALL_ROUTES = Object.keys(ROUTE_FOLDER_MAP);

// Map: record_ref -> analysis object
export const PRE_ANALYSIS = {
  C01: {
    routes: ['Sales Coaching'],
    title: 'Harborlight Advisory cold outreach',
    company: 'Harborlight Advisory',
    summary: 'Arun cold-calls Pranav at Harborlight Advisory regarding SpendNest. Pranav clarifies they do not have company spend requirements matching SpendNest and politely declines. Arun continues to push features instead of probing business pain points.',
    evidence: "Pranav: 'We don't really have that kind of spending setup here.'",
    evidence_ref: "Call C01 exact quote: 'We don't really have that kind of spending setup here.'",
    coaching: "Arun pushed product features rather than doing discovery or respecting Pranav's initial hesitation. Coach on asking open discovery questions before pitching.",
    next_steps: 'Log as Not Interested in CRM; do not re-dial without clear account intent signal.',
    limitations: 'Short call; external prospect business model not fully known.'
  },
  C02: {
    routes: ['Deal Follow-up', 'Needs Review'],
    title: 'Fernhaven Group outreach (Gatekeeper)',
    company: 'Fernhaven Group',
    summary: "Arun reaches gatekeeper Kavya at Fernhaven Group asking for Leela. Kavya checks and confirms Leela is on leave until Tuesday. Arun requests a callback window.",
    evidence: "Kavya: 'She is actually out of the office until Tuesday.'",
    evidence_ref: "Call C02 exact quote: 'She is actually out of the office until Tuesday.'",
    coaching: 'Arun handled gatekeeper politely and established clear availability window.',
    next_steps: 'Schedule follow-up task for Tuesday morning (25 Aug 2026) to speak directly with Leela.',
    limitations: 'No direct conversation with target stakeholder yet.'
  },
  C03: {
    routes: ['Deal Follow-up', 'Sales Coaching'],
    title: 'Reconciliation & ERP sync inquiry',
    company: 'Prospect (Milan)',
    summary: "Kiran reaches Milan after passing screening. Milan reports poor audio initially, then discusses their existing accounting system and asks whether SpendNest integrates with automated bank feeds and reconciliation.",
    evidence: "Milan: 'Does this match with bank feeds automatically?'",
    evidence_ref: "Call C03 exact quote: 'Does this match with bank feeds automatically?'",
    coaching: 'Kiran showed good patience through audio glitches. Needs to be crisper on technical API feed versus batch file export capabilities.',
    next_steps: 'Send integration specification sheet and calendar invite for technical walkthrough.',
    limitations: "Milan's exact ERP brand and version was not confirmed on the call."
  },
  C04: {
    routes: ['Deal Follow-up', 'Background'],
    title: 'Expense software follow-up voicemail',
    company: 'Prospect Voicemail',
    summary: "Arun encounters a screening/voicemail service prompt. He leaves a concise 95-second voicemail referencing a prior conversation on expense software and leaving callback contact details. NOTE: Telephony system marked is_connected=false despite 95s of recorded audio.",
    evidence: "Arun: 'Arun from SpendNest, following up on our earlier conversation about expense software...'",
    evidence_ref: "Call C04 exact quote: 'Arun from SpendNest, following up on our earlier conversation about expense software'",
    coaching: 'Good concise voicemail structure with clear reason for calling.',
    next_steps: 'Wait 48 hours for callback; if no reply, follow up via email with calendar link.',
    limitations: 'One-way message; no prospect verification or live feedback. Telephony telemetry false negative (is_connected=false despite substantive 95s voicemail audio).'
  },
  C05: {
    routes: ['Deal Follow-up'],
    title: 'Multi-entity billing inquiry',
    company: 'Prospect Group',
    summary: "Meera conducts a cold intro. Prospect notes an audio echo, then discloses they operate 3 separate legal entities and require centralized approval workflows with separated subsidiary billing.",
    evidence: "Prospect: 'We have three subsidiary companies. Can it separate billing while keeping approvals unified?'",
    evidence_ref: "Call C05 exact quote: 'We have three subsidiary companies. Can it separate billing while keeping approvals unified?'",
    coaching: 'Strong pitch delivery and immediate value anchoring by Meera.',
    next_steps: 'Prepare multi-tenant / multi-entity pricing architecture summary and email prospect.',
    limitations: 'Exact transaction volume per entity not disclosed.'
  },
  C06: {
    routes: ['Sales Coaching'],
    title: 'Competitor lock-in qualification',
    company: 'Prospect (Ravi / Nikhil)',
    summary: "Meera introduces SpendNest. The contact explains they recently signed a multi-year enterprise agreement with a competitive vendor and will not consider switching before the renewal window.",
    evidence: "Prospect: 'We locked in a two-year contract just four months ago. It doesn't make sense to review alternatives right now.'",
    evidence_ref: "Call C06 exact quote: 'We locked in a two-year contract just four months ago.'",
    coaching: "Meera correctly qualified the timeline without arguing, but could have noted the exact renewal date for the CRM nurture cycle.",
    next_steps: 'Set CRM reminder 18 months out; mark deal inactive for current quarter.',
    limitations: 'Contract penalty terms and incumbent vendor name not stated.'
  },
  C07: {
    routes: ['Deal Follow-up', 'Sales Coaching'],
    title: 'Willowbank Advisory client management inquiry',
    company: 'Willowbank Advisory',
    summary: "Dev calls Aditya at Willowbank Advisory. Aditya is receptive and explains they advise mid-market clients on financial operations. They discuss client-facing reporting and potential advisory partner referral model.",
    evidence: "Aditya: 'We advise about forty corporate clients.'",
    evidence_ref: "Call C07 exact quote: 'We advise about forty corporate clients.'",
    coaching: "Dev established excellent rapport quickly. Can delve deeper into whether Willowbank wants to use the software internally or recommend it as an advisor.",
    next_steps: 'Dev to send partner overview deck and schedule 30-min discovery session with Aditya next week.',
    limitations: 'Decision-making authority inside Willowbank Advisory not fully validated.'
  },
  C08: {
    routes: ['Deal Follow-up'],
    title: 'Referral to VP of Finance',
    company: 'Prospect (Raghav)',
    summary: "Meera pitches Raghav. Raghav explains that financial systems and card issuance fall under their VP of Finance, Pooja, and provides her direct department routing.",
    evidence: "Raghav: 'You should speak to Pooja in finance. She handles corporate cards and vendor disbursements.'",
    evidence_ref: "Call C08 exact quote: 'You should speak to Pooja in finance. She handles corporate cards and vendor disbursements.'",
    coaching: 'Meera effectively turned a cold call into a warm internal referral.',
    next_steps: "Outreach to Pooja referencing Raghav's recommendation; log new contact in CRM.",
    limitations: "Pooja's direct email was not verified on the phone."
  },
  C09: {
    routes: ['Deal Follow-up'],
    title: 'Referral to Head of Procurement',
    company: 'Prospect (Vedant)',
    summary: "Meera connects with Vedant. Vedant clarifies that vendor invoicing and AP approval software is evaluated strictly by their procurement lead.",
    evidence: "Vedant: 'This would sit with our procurement lead. Send a summary to procurement@... and mention my name.'",
    evidence_ref: "Call C09 exact quote: 'This would sit with our procurement lead. Send a summary to procurement@'",
    coaching: "Meera maintained professional tone and secured permission to use Vedant's name in outreach.",
    next_steps: 'Send tailored introductory email to procurement inbox referencing Vedant.',
    limitations: 'Direct phone number for procurement lead not obtained.'
  },
  C10: {
    routes: ['Deal Follow-up'],
    title: 'Invoice automation demo scheduling',
    company: 'Prospect (Aniket)',
    summary: "Meera presents SpendNest's automated invoice capture and approval routing. Aniket expresses active interest due to high manual processing overhead and agrees to a product demo on Thursday.",
    evidence: "Aniket: 'We are drowning in invoice emails manually right now. Let's do Thursday afternoon for a walkthrough.'",
    evidence_ref: "Call C10 exact quote: 'We are drowning in invoice emails manually right now. Let\\'s do Thursday afternoon for a walkthrough.'",
    coaching: 'Excellent closing on next steps; high buying intent uncovered immediately.',
    next_steps: 'Send calendar invite for Thursday 3:00 PM with demo link; include prep questions on monthly invoice volume.',
    limitations: 'Budget and final sign-off authority not yet established.'
  },
  M01: {
    routes: ['Partner/Vendor', 'Needs Review'],
    title: 'Harborpath Advisory / SpendNest discussion',
    company: 'Harborpath Advisory',
    summary: "Partner A at Harborpath initially believed SpendNest provides remote commercial bank account opening. SpendNest Team Member A clarifies SpendNest is an expense management and AP automation platform. Discussion shifts to whether Harborpath's advisory clients could benefit from AP workflows.",
    evidence: "Partner A (Turn 1): 'My understanding was that you help people open bank accounts remotely.'",
    evidence_ref: "Meeting M01, Turn 1: 'My understanding was that you help people open bank accounts remotely.'",
    coaching: 'Rep correctly corrected the banking misconception early, avoiding downstream confusion.',
    next_steps: 'Send partner collateral on corporate expense management for advisory clients.',
    limitations: "Harborpath's core interest was banking; advisory alignment is secondary."
  },
  M02: {
    routes: ['Partner/Vendor'],
    title: 'LedgerBridge / SpendNest discussion',
    company: 'LedgerBridge (Supplier — SpendNest is the buyer)',
    summary: "SpendNest strategy team (Team members A & B) evaluates LedgerBridge as a banking/card-issuing infrastructure supplier. Supplier A outlines API capabilities, sandbox environments, and compliance KYC/KYB requirements. SpendNest is the buyer/evaluator — NOT a sales meeting.",
    evidence: "Team member A (Turn 1): 'I work on strategy and partnerships at SpendNest... we are developing our infrastructure.'",
    evidence_ref: "Meeting M02, Turn 1: 'I work on strategy and partnerships at SpendNest... we are developing our infrastructure.'",
    coaching: 'Ensure product and compliance teams receive LedgerBridge technical API specifications.',
    next_steps: 'Review LedgerBridge compliance checklist upon receipt of template.',
    limitations: 'Pricing structure and API latency SLAs were deferred to technical evaluation. Excluded from sales pipeline — SpendNest is the buyer.'
  },
  M03: {
    routes: ['Deal Follow-up'],
    title: 'Asterloom Systems / SpendNest discussion',
    company: 'Asterloom Systems',
    summary: "Key high-value evaluation meeting with Asterloom Systems. Customer A and Customer B (finance) review spend approval hierarchies and ERP reconciliation. Customer B insists on reviewing detailed technical documentation before taking the proposal to their CFO.",
    evidence: "Customer B (Turn 36): 'Send the details first. We need time with the CFO and will tell you if another call is needed. Let us make that decision.'",
    evidence_ref: "Meeting M03, Turn 36: 'Send the details first. We need time with the CFO and will tell you if another call is needed. Let us make that decision.'",
    coaching: 'Team member A pushed slightly too hard for an immediate follow-up meeting, which prompted Customer B to push back. Respect customer internal review timelines.',
    next_steps: 'Prepare executive summary deck and security whitepaper for the CFO review; follow up gently in 5 business days.',
    limitations: 'CFO identity and approval criteria remain undisclosed.'
  },
  M04: {
    routes: ['Customer Follow-up', 'CS/Support'],
    title: 'Cedarwave Distribution / SpendNest discussion',
    company: 'Cedarwave Distribution',
    summary: "Existing customer Cedarwave Distribution is planning migration to a new operational workflow. Customer A and B raise concerns regarding historic invoice reconciliation and parallel ledger runs during transition.",
    evidence: "Customer A (Turn 1): 'I wanted to discuss the migration while there is still time to plan it...'",
    evidence_ref: "Meeting M04, Turn 1: 'I wanted to discuss the migration while there is still time to plan it.'",
    coaching: 'Clear technical leadership shown during migration planning.',
    next_steps: 'Deliver step-by-step cutover runbook and sandbox dry-run schedule by Friday.',
    limitations: "Exact cutover weekend date depends on Cedarwave's ERP vendor schedule."
  },
  M06: {
    routes: ['Deal Follow-up', 'Sales Coaching'],
    title: 'Mapletrail Services / SpendNest discussion',
    company: 'Mapletrail Services',
    summary: "Exploratory finance discussion between SpendNest finance lead and Customer A at Mapletrail Services regarding finance automation, vendor approval bottleneck elimination, and payment batching.",
    evidence: "Customer A (Turn 33): 'Please send the information and we can stay in touch.'",
    evidence_ref: "Meeting M06, Turn 33: 'Please send the information and we can stay in touch.'",
    coaching: 'Good peer-to-peer consultative dialogue. Opportunity to position SpendNest as the operational fix for their manual invoice bottleneck.',
    next_steps: 'Send case study on similar professional services firm and invite to quarterly finance roundtable.',
    limitations: 'No formal procurement timeline committed by Mapletrail.'
  },
  M07: {
    routes: ['CS/Support', 'Customer Follow-up'],
    title: 'Willowfield Trust / SpendNest discussion',
    company: 'Willowfield Trust',
    summary: "Screen-share troubleshooting session with Willowfield Trust. Customer A demonstrates errors encountered during multi-tier approval setup. Four issues resolved: edit description not saving, recreate payment attachment blocked, reimbursements stuck in Processing, and Mark as paid carrying forward the previous amount. Team member A steps through workarounds and raises backend fixes.",
    evidence: "Team member A (Turn 27): 'I will send the details to the team, get their confirmation and come back to you.'",
    evidence_ref: "Meeting M07, Turn 27: 'I will send the details to the team, get their confirmation and come back to you.'",
    coaching: 'Effective live screen-share resolution. Good empathy and issue isolation.',
    next_steps: 'Follow up with Willowfield administrator once backend permission sync completes.',
    limitations: 'Arrives late in Batch 02 (rev 2); requires manual verification and routing preservation.',
    is_late_update: true
  },
  M09: {
    routes: ['CS/Support'],
    title: 'Brookmint Holdings — account setup',
    company: 'Brookmint Holdings',
    summary: "Customer A reports account invitation failure for Brookmint Holdings. The customer tried logging in with a shared email address. Team Member A clarifies that SpendNest enforces individual email identity for audit logs and security compliance.",
    evidence: "Customer A (Turn 32): 'I will speak to our IT team about the separate email identities. Thank you.'",
    evidence_ref: "Meeting M09, Turn 32: 'I will speak to our IT team about the separate email identities.'",
    coaching: 'Excellent adherence to security posture without frustrating the customer.',
    next_steps: 'Resend personal user invites once IT provisions distinct employee email inboxes.',
    limitations: 'Pending customer IT provisioning timeline.'
  },
  M10: {
    routes: ['Internal'],
    title: 'Billing workflow walkthrough',
    company: 'SpendNest Internal Training',
    summary: "Internal operational walkthrough session among SpendNest team members (Team member A, B, C) regarding back-office billing access, permissions, and training on customer invoicing tools. Zero external prospects involved.",
    evidence: "Team member C (Turn 20): 'I will request the back-office access separately for the next training session.'",
    evidence_ref: "Meeting M10, Turn 20: 'I will request the back-office access separately for the next training session.'",
    coaching: 'Internal enablement session; keep separate from external sales performance review.',
    next_steps: 'Grant back-office sandbox access to Team member C before next session.',
    limitations: 'Internal meeting only; does not contribute to pipeline metrics.'
  }
};

/**
 * Returns the routes for a record based on pre-analysis or fallback heuristic.
 * Manual overrides stored in DB take precedence — this is the fallback.
 */
export function getDefaultRoutes(record) {
  const analysis = PRE_ANALYSIS[record.record_ref];
  if (analysis && analysis.routes && analysis.routes.length > 0) {
    return analysis.routes;
  }
  const hasTranscript = hasUsableTranscript(record);
  return hasTranscript ? ['Needs Review'] : ['Background'];
}

export function hasUsableTranscript(record) {
  if (record.source_type === 'call') {
    const t = record.payload?.transcript;
    return Boolean(t && typeof t === 'string' && t.trim().length > 0);
  } else {
    const turns = record.transcript_payload?.turns;
    return Boolean(turns && Array.isArray(turns) && turns.length > 0);
  }
}

export function getRecordPerson(record) {
  if (record.source_type === 'call') {
    return record.payload?.rep_name || record.payload?.rep_email || 'Unknown Rep';
  }
  return record.payload?.organizer_email || 'Unknown Organiser';
}

export function getRecordTitle(record) {
  if (record.source_type === 'call') {
    const rep = record.payload?.rep_name || 'Rep';
    const out = record.payload?.observed_outcome || 'call';
    const dur = record.payload?.duration_seconds ? `${record.payload.duration_seconds}s` : '';
    return `${rep} · Call (${out}${dur ? ', ' + dur : ''})`;
  }
  return record.payload?.title || 'Untitled Meeting';
}
