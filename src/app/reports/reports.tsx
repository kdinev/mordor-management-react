import { useState, useActionState, useOptimistic, startTransition } from 'react';
import { commanders } from '../../data/commanders';
import type { Commander, CommanderReport } from '../../data/types';
import { IgrLinearProgress } from 'igniteui-react';
import styles from './reports.module.css';

const REALM_COLORS: Record<string, string> = {
  Mordor: '#7a1a1a',
  Isengard: '#3a4a00',
  Harad: '#6a3f00',
  Gundabad: '#1a2e1a',
  'Dol Guldur': '#3a006a',
  Rhûn: '#003060',
};

const URGENCY_COLORS: Record<string, string> = {
  Critical: '#b00000',
  High: '#b05000',
  Medium: '#a08000',
  Low: '#408040',
};

const STATUS_COLORS: Record<string, string> = {
  'On Track': '#2a5a2a',
  Delayed: '#5a5000',
  Critical: '#5a0000',
  Completed: '#005a44',
};

// ── LoginView ────────────────────────────────────────────────────────────────

type LoginResult = { error: string | null };

function LoginView({ onSuccess }: { onSuccess: (c: Commander) => void }) {
  const [state, dispatch, isPending] = useActionState<LoginResult, FormData>(
    (_prev, formData) => {
      const commanderId = formData.get('commanderId') as string;
      const oath = formData.get('oath') as string;
      if (!commanderId) return { error: 'You must identify yourself, wretch.' };
      void oath;
      const commander = commanders.find(c => c.id === commanderId);
      if (!commander) return { error: 'Unknown identity. None may deceive the Eye.' };
      onSuccess(commander);
      return { error: null };
    },
    { error: null },
  );

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginCard}>
        <span className={styles.loginEye}>👁️</span>
        <h1 className={styles.loginTitle}>Commander Portal</h1>
        <p className={styles.loginSubtitle}>
          Identify yourself before the Eye. Report your deeds, lest the Dark Lord notice your silence.
        </p>
        <form action={dispatch} className={styles.loginForm}>
          <div className={styles.formGroup}>
            <label className={styles.fieldLabel} htmlFor="commanderId">
              Who art thou?
            </label>
            <select
              id="commanderId"
              name="commanderId"
              className={styles.styledSelect}
              disabled={isPending}
            >
              <option value="">— Choose your identity —</option>
              {commanders.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} · {c.title}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.fieldLabel} htmlFor="oath">
              Dark Oath
            </label>
            <input
              id="oath"
              name="oath"
              type="password"
              autoComplete="off"
              spellCheck={false}
              className={styles.styledInput}
              placeholder="Ash nazg durbatulûk…"
              disabled={isPending}
            />
          </div>
          {state.error && <div className={styles.errorMsg}>{state.error}</div>}
          <button type="submit" className={styles.loginBtn} disabled={isPending}>
            {isPending ? '⌛ Consulting the Eye…' : '🔴 Enter the Portal'}
          </button>
        </form>
        <p className={styles.oathHint}>Hint: any non-empty oath is accepted.</p>
      </div>
    </div>
  );
}

// ── ReportForm ────────────────────────────────────────────────────────────────

type SubmitResult = { error: string | null };

function ReportForm({
  commander,
  onSubmitted,
}: {
  commander: Commander;
  onSubmitted: (report: CommanderReport) => void;
}) {
  const [submitted, setSubmitted] = useState(false);
  const [progress, setProgress] = useState(50);

  const [state, dispatch, isPending] = useActionState<SubmitResult, FormData>(
    (_prev, formData) => {
      const activities = (formData.get('activities') as string).trim();
      const achievements = (formData.get('achievements') as string).trim();
      const failures = (formData.get('failures') as string).trim();
      const progressVal = parseInt(formData.get('progress') as string, 10);
      const status = formData.get('status') as CommanderReport['status'];
      const urgency = formData.get('urgency') as CommanderReport['urgency'];

      if (!activities) return { error: 'Activities field is mandatory.' };
      if (!achievements) return { error: 'Achievements field is mandatory.' };
      if (!failures) return { error: 'You must account for your failures. None may hide from the Eye.' };

      const report: CommanderReport = {
        id: `rep-${Date.now()}`,
        commanderId: commander.id,
        commanderName: commander.name,
        commanderTitle: commander.title,
        date: new Date().toISOString().split('T')[0],
        activities,
        achievements,
        failures,
        progress: isNaN(progressVal) ? 50 : Math.max(0, Math.min(100, progressVal)),
        status,
        urgency,
      };

      onSubmitted(report);
      setSubmitted(true);
      return { error: null };
    },
    { error: null },
  );

  if (submitted) {
    return (
      <div className={styles.submittedState}>
        <span className={styles.submittedIcon}>📜</span>
        <h3 className={styles.submittedTitle}>Report Dispatched</h3>
        <p className={styles.submittedMsg}>
          Your report has been transmitted to Barad-dûr. The Dark Lord acknowledges your service.
        </p>
        <button
          className={styles.newReportBtn}
          onClick={() => {
            setSubmitted(false);
            setProgress(50);
          }}
        >
          📋 Submit Another Report
        </button>
      </div>
    );
  }

  return (
    <>
      {state.error && <div className={styles.errorMsg}>{state.error}</div>}
      <form action={dispatch} className={styles.reportForm}>
        <div className={styles.formGroup}>
          <label className={styles.fieldLabel}>📋 Current Activities</label>
          <p className={styles.fieldHint}>
            Describe your ongoing military, political, and logistical operations.
          </p>
          <textarea
            name="activities"
            className={styles.styledTextarea}
            rows={4}
            placeholder="Currently marshalling forces at…"
            disabled={isPending}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.fieldLabel}>🏆 Achievements</label>
          <p className={styles.fieldHint}>
            What victories and milestones have been secured in service of the Dark Lord?
          </p>
          <textarea
            name="achievements"
            className={styles.styledTextarea}
            rows={4}
            placeholder="Successfully crushed the resistance at…"
            disabled={isPending}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.fieldLabel}>💀 Failures &amp; Setbacks</label>
          <p className={styles.fieldHint}>
            Concealing failures is punishable by worse than death. Report with full honesty.
          </p>
          <textarea
            name="failures"
            className={styles.styledTextarea}
            rows={4}
            placeholder="The fellowship escaped due to…"
            disabled={isPending}
          />
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label className={styles.fieldLabel}>
              📊 Overall Progress&nbsp;
              <span className={styles.progressValue}>{progress}%</span>
            </label>
            <p className={styles.fieldHint}>0 = total failure · 100 = objective complete.</p>
            <input
              type="range"
              name="progress"
              min="0"
              max="100"
              value={progress}
              onChange={e => setProgress(+e.target.value)}
              className={styles.styledRange}
              disabled={isPending}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.fieldLabel}>🚩 Mission Status</label>
            <select
              name="status"
              className={styles.styledSelect}
              defaultValue="On Track"
              disabled={isPending}
            >
              <option value="On Track">On Track</option>
              <option value="Delayed">Delayed</option>
              <option value="Critical">Critical</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.fieldLabel}>⚠️ Urgency Level</label>
            <select
              name="urgency"
              className={styles.styledSelect}
              defaultValue="Medium"
              disabled={isPending}
            >
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>

        <button type="submit" className={styles.submitBtn} disabled={isPending}>
          {isPending ? '⌛ Dispatching to Barad-dûr…' : '📜 Submit Report to the Dark Lord'}
        </button>
      </form>
    </>
  );
}

// ── ReportView ────────────────────────────────────────────────────────────────

function ReportView({
  commander,
  onLogout,
}: {
  commander: Commander;
  onLogout: () => void;
}) {
  const [allReports, setAllReports] = useState<CommanderReport[]>([]);
  const [optimisticReports, addOptimistic] = useOptimistic(
    allReports,
    (state, report: CommanderReport) => [report, ...state],
  );
  const [showHistory, setShowHistory] = useState(false);

  function handleReportSubmitted(report: CommanderReport) {
    startTransition(() => addOptimistic(report));
    setAllReports(prev => [report, ...prev]);
  }

  const realmColor = REALM_COLORS[commander.realm] ?? '#444';

  return (
    <div className={styles.reportPage}>
      <div className={styles.commanderBanner} style={{ borderLeftColor: realmColor }}>
        <div className={styles.commanderInfo}>
          <div className={styles.commanderAvatar} style={{ backgroundColor: realmColor }}>
            {commander.name.charAt(0)}
          </div>
          <div>
            <h2 className={styles.commanderName}>{commander.name}</h2>
            <p className={styles.commanderTitle}>{commander.title}</p>
            <span className={styles.realmTag} style={{ backgroundColor: realmColor }}>
              {commander.realm}
            </span>
          </div>
        </div>
        <div className={styles.bannerActions}>
          <button className={styles.toggleBtn} onClick={() => setShowHistory(h => !h)}>
            {showHistory
              ? '📋 Submit Report'
              : `📜 History (${optimisticReports.length})`}
          </button>
          <button className={styles.logoutBtn} onClick={onLogout}>
            🚪 Retreat
          </button>
        </div>
      </div>

      {showHistory ? (
        <div className={styles.historySection}>
          <h3 className={styles.sectionTitle}>Report History — {commander.name}</h3>
          {optimisticReports.length === 0 ? (
            <p className={styles.emptyMsg}>
              No reports submitted yet. The Dark Lord grows impatient.
            </p>
          ) : (
            <div className={styles.reportList}>
              {optimisticReports.map(r => (
                <div key={r.id} className={styles.reportCard}>
                  <div className={styles.reportCardTop}>
                    <span className={styles.reportDate}>{r.date}</span>
                    <div className={styles.reportBadges}>
                      <span
                        className={styles.badge}
                        style={{ backgroundColor: URGENCY_COLORS[r.urgency] ?? '#555' }}
                      >
                        {r.urgency}
                      </span>
                      <span
                        className={styles.badge}
                        style={{ backgroundColor: STATUS_COLORS[r.status] ?? '#555' }}
                      >
                        {r.status}
                      </span>
                    </div>
                  </div>
                  <div className={styles.progressRow}>
                    <span className={styles.progressLabel}>Progress: {r.progress}%</span>
                    <IgrLinearProgress
                      value={r.progress}
                      max={100}
                      className={styles.progressBar}
                    />
                  </div>
                  <div className={styles.reportFields}>
                    <div className={styles.reportField}>
                      <strong>📋 Activities</strong>
                      <p>{r.activities}</p>
                    </div>
                    <div className={styles.reportField}>
                      <strong>🏆 Achievements</strong>
                      <p>{r.achievements}</p>
                    </div>
                    <div className={styles.reportField}>
                      <strong>💀 Failures</strong>
                      <p>{r.failures}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className={styles.formSection}>
          <h3 className={styles.sectionTitle}>
            Submit Report —{' '}
            {new Date().toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </h3>
          <ReportForm commander={commander} onSubmitted={handleReportSubmitted} />
        </div>
      )}
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────

export default function Reports() {
  const [loggedInCommander, setLoggedInCommander] = useState<Commander | null>(null);

  return loggedInCommander ? (
    <ReportView commander={loggedInCommander} onLogout={() => setLoggedInCommander(null)} />
  ) : (
    <LoginView onSuccess={setLoggedInCommander} />
  );
}
