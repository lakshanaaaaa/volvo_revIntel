import { useEffect, useState } from 'react';
import { getStats } from '../lib/api';
import { Card, SectionHeader } from '../components/ui/Card';
import { LoadingPage } from '../components/ui/EmptyState';
import { AlertTriangle, TrendingUp, Users, Lightbulb, AlertCircle, Building2 } from 'lucide-react';

function BriefItem({ type = 'info', children }) {
  const styles = {
    urgent:   'border-l-[#FF6B78] bg-red-500/5',
    important:'border-l-[#F5B84B] bg-yellow-500/5',
    positive: 'border-l-[#35C995] bg-green-500/5',
    info:     'border-l-[#5B8CFF] bg-blue-500/5',
    neutral:  'border-l-[#73839E] bg-slate-500/5',
  };
  return (
    <div className={`border border-[#1E3050] border-l-[3px] rounded-lg px-3.5 py-2.5 mb-2 text-[12.5px] text-[#A3B2C9] leading-relaxed ${styles[type] || styles.info}`}>
      {children}
    </div>
  );
}

export function ManagerBrief() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStats()
      .then(s => setStats(s))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingPage />;

  const total      = stats?.total || 0;
  const calls      = stats?.calls || 0;
  const meetings   = stats?.meetings || 0;
  const withTxt    = stats?.withTranscript || 0;
  const connected  = stats?.connected || 0;
  const connStatus = stats?.callsWithConnStatus || 0;

  return (
    <div className="p-6 space-y-5 max-w-5xl">
      {/* Header */}
      <div className="bg-[#101C30] border border-[#1E3050] rounded-xl p-5">
        <div className="text-[10.5px] font-semibold uppercase tracking-widest text-[#73839E] mb-1">Daily Manager Brief</div>
        <h2 className="text-[20px] font-bold text-[#F1F5FC] tracking-tight">21 August 2026 — SpendNest</h2>
        <p className="text-[12.5px] text-[#A3B2C9] mt-2 leading-relaxed">
          Post-update reconciled state (Revisions 1 & 2 applied).
          {total > 0
            ? ` ${total} interactions captured across the day: ${calls} calls and ${meetings} calendar meetings. ${withTxt} interactions contain usable conversation transcripts.`
            : ' No data loaded — import a batch to generate the brief.'}
        </p>
        {total > 0 && (
          <div className="grid grid-cols-3 gap-3 mt-4">
            {[
              { label: 'Calls Connect Rate', value: connStatus > 0 ? `${((connected / connStatus) * 100).toFixed(1)}%` : '—', sub: `${connected} of ${connStatus} source-reported` },
              { label: 'Transcript Coverage', value: total > 0 ? `${((withTxt / total) * 100).toFixed(1)}%` : '—', sub: `${withTxt} / ${total} usable records` },
              { label: 'Priority Follow-ups', value: '5 Active', sub: 'M03, C02, C05, C10, M04' },
            ].map(s => (
              <div key={s.label} className="bg-[#14233B] border border-[#1E3050] rounded-lg p-3">
                <div className="text-[10.5px] text-[#73839E] uppercase tracking-wider">{s.label}</div>
                <div className="text-[18px] font-bold text-[#F1F5FC] mt-0.5">{s.value}</div>
                <div className="text-[10.5px] text-[#73839E]">{s.sub}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Priority follow-ups */}
        <Card>
          <SectionHeader title="Priority Pipeline & Follow-ups" sub="Grounded in transcript evidence only">
            <TrendingUp size={15} className="text-[#5B8CFF]" />
          </SectionHeader>
          <BriefItem type="urgent">
            <strong>Asterloom Systems (M03)</strong> — High-Value Deal Review: Customer B (finance lead) placed a firm boundary on outreach — <em>"Send the details first. We need time with the CFO and will tell you if another call is needed. Let us make that decision."</em> (Turn 36). Do not push another meeting; send executive collateral first.
          </BriefItem>
          <BriefItem type="important">
            <strong>Fernhaven Group (C02)</strong> — Gatekeeper Callback: Kavya confirmed Leela is out of office until Tuesday morning (25 Aug). Set calendar task for rep Arun to call back Tuesday.
          </BriefItem>
          <BriefItem type="important">
            <strong>Prospect Aniket (C10)</strong> — Invoice Automation Demo: Prospect manually processing high invoice volume. <em>"We are drowning in invoice emails manually right now. Let's do Thursday afternoon for a walkthrough."</em> Demo confirmed for Thursday.
          </BriefItem>
          <BriefItem type="positive">
            <strong>Willowbank Advisory (C07)</strong> — Advisory Partnership: Dev connected with Aditya who advises 40 corporate clients on financial operations. Strong potential partner referral channel.
          </BriefItem>
          <BriefItem type="info">
            <strong>Multi-Entity Group (C05)</strong> — Architecture Send: Prospect disclosed 3 subsidiary companies needing separated billing with unified approvals. Send multi-tenant pricing architecture summary.
          </BriefItem>
        </Card>

        {/* Sales coaching */}
        <Card>
          <SectionHeader title="Targeted Sales Coaching" sub="Evidence-backed observations only">
            <Users size={15} className="text-[#9B7EF8]" />
          </SectionHeader>
          <BriefItem type="info">
            <strong>Arun (C01 & C04):</strong> Tendency to immediately pitch product features rather than executing discovery. In C01, Pranav's polite disinterest was met with more pitching rather than probing questions. Coach on asking pain-point questions before presenting solutions. Voicemail structure in C04 was clean and concise.
          </BriefItem>
          <BriefItem type="positive">
            <strong>Meera (C05, C06, C08, C09, C10):</strong> Exceptional outbound execution. Turned cold dials into warm referrals (C08 → VP Finance Pooja, C09 → Procurement), handled competitor lock-in gracefully (C06), and booked a firm demo (C10).
          </BriefItem>
          <BriefItem type="info">
            <strong>Kiran (C03):</strong> Exhibited great composure during audio difficulties. Needs coaching on explaining automated bank reconciliation APIs vs. CSV exports clearly.
          </BriefItem>
          <BriefItem type="info">
            <strong>Team Member A (M03):</strong> Pushed slightly too hard for another calendar invite, triggering Customer B's defensive boundary. Coach on honoring executive buying cadence.
          </BriefItem>
        </Card>

        {/* Action timeline */}
        <Card>
          <SectionHeader title="Action Timeline" sub="Dated follow-ups only">
            <Lightbulb size={15} className="text-[#F5B84B]" />
          </SectionHeader>
          <div className="space-y-2 text-[12.5px] text-[#A3B2C9] leading-relaxed">
            <div className="flex items-start gap-2">
              <span className="text-red-400 font-bold text-[11px] mt-0.5 shrink-0">TODAY</span>
              <span>Deliver executive summary and security whitepaper to <strong>Asterloom Systems (M03)</strong> for CFO review.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-red-400 font-bold text-[11px] mt-0.5 shrink-0">TODAY</span>
              <span>Send multi-tenant billing architecture overview to <strong>C05 prospect</strong>.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-yellow-400 font-bold text-[11px] mt-0.5 shrink-0">TUESDAY</span>
              <span>Arun to call back <strong>Leela at Fernhaven Group (C02)</strong> — confirmed out of office until 25 Aug.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-yellow-400 font-bold text-[11px] mt-0.5 shrink-0">THURSDAY</span>
              <span>Conduct confirmed invoice automation demo with <strong>Aniket (C10)</strong> — Thursday afternoon.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-400 font-bold text-[11px] mt-0.5 shrink-0">FRIDAY</span>
              <span>Deliver cutover schedule and data migration runbook to <strong>Cedarwave Distribution (M04)</strong>.</span>
            </div>
          </div>
        </Card>

        {/* Exceptions & anomalies */}
        <Card>
          <SectionHeader title="Telemetry Anomalies & Exceptions" sub="Source-level discrepancies flagged">
            <AlertCircle size={15} className="text-[#FF6B78]" />
          </SectionHeader>
          <BriefItem type="urgent">
            <strong>Telemetry False Positives (B11 & B14):</strong> Calls B11 (26s) and B14 (9s) are logged as <code className="font-mono text-[10.5px] bg-[#101C30] px-1 rounded">is_connected=true</code> by telephony, but <code className="font-mono text-[10.5px] bg-[#101C30] px-1 rounded">observed_outcome=&quot;unresponsive&quot;</code>. Connection rate metric explicitly labels these as source-reported.
          </BriefItem>
          <BriefItem type="important">
            <strong>False Negative — C04:</strong> Call C04 is logged <code className="font-mono text-[10.5px] bg-[#101C30] px-1 rounded">is_connected=false</code> despite containing a complete 95-second recorded voicemail pitch by SDR Arun. Preserved as an active Deal Follow-up touchpoint.
          </BriefItem>
          <BriefItem type="info">
            <strong>Misconception Reset — M01:</strong> Partner A at Harborpath initially believed SpendNest opened commercial bank accounts remotely. Rep successfully reset context to AP & card management.
          </BriefItem>

          <SectionHeader title="Operational Segregation" sub="Excluded from sales pipeline" className="mt-4">
            <Building2 size={15} className="text-[#FF8C42]" />
          </SectionHeader>
          <BriefItem type="neutral">
            <strong>LedgerBridge (M02):</strong> SpendNest is the buyer/evaluator for card-issuing infrastructure — NOT a customer meeting. Classified under Partner/Vendor and excluded from pipeline.
          </BriefItem>
          <BriefItem type="neutral">
            <strong>SpendNest Internal (M10):</strong> Billing workflow walkthrough between three internal team members. No external prospects. Classified under Internal; excluded from quota and pipeline.
          </BriefItem>
          <BriefItem type="info">
            <strong>Willowfield Trust (M07):</strong> Late transcript arrived in Batch 02 (rev 2). Screen-share troubleshooting session — four product issues documented and raised. CS/Support + Customer Follow-up.
          </BriefItem>
        </Card>

      </div>

      {/* Disclaimer */}
      <div className="bg-[#14233B] border border-[#263854] rounded-xl p-4 text-[11.5px] text-[#73839E] leading-relaxed">
        <strong className="text-[#A3B2C9]">Grounding note:</strong> All findings above are cited directly from transcript evidence. No CRM opportunity table, deal values, ARR figures, or staff quota data was supplied. Pipeline currency cards are deliberately omitted to prevent fabricated confidence. Activity bars are labeled as "selected records only — not a full-team daily view."
      </div>
    </div>
  );
}
