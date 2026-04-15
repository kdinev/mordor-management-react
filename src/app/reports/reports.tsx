import { useState, useActionState, useOptimistic, startTransition } from 'react';
import { commanders } from '../../data/commanders';
import type { Commander, CommanderReport } from '../../data/types';
import { IgrLinearProgress, IgrSelect, IgrSelectItem, IgrInput, IgrTextarea, IgrButton, IgrSlider } from 'igniteui-react';
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
            <label className={styles.fieldLabel}>
              Who art thou?
            </label>
            <IgrSelect
              name="commanderId"
              placeholder="— Choose your identity —"
              disabled={isPending}
            >
              {commanders.map(c => (
                <IgrSelectItem key={c.id} value={c.id}>
                  {c.name} · {c.title}
                </IgrSelectItem>
              ))}
            </IgrSelect>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.fieldLabel} htmlFor="oath">
              Dark Oath
            </label>
            <IgrInput
              id="oath"
              name="oath"
              type="password"
              autocomplete="off"
              placeholder="Ash nazg durbatulûk…"
              disabled={isPending}
            />
          </div>
          {state.error && <div className={styles.errorMsg}>{state.error}</div>}
          <IgrButton type="submit" disabled={isPending}>
            <span>{isPending ? '⌛ Consulting the Eye…' : '🔴 Enter the Portal'}</span>
          </IgrButton>
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
  const [status, setStatus] = useState<CommanderReport['status']>('On Track');
  const [urgency, setUrgency] = useState<CommanderReport['urgency']>('Medium');

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
        <IgrButton
          onClick={() => {
            setSubmitted(false);
            setProgress(50);
            setStatus('On Track');
            setUrgency('Medium');
          }}
        >
          <span>📋 Submit Another Report</span>
        </IgrButton>
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
          <IgrTextarea
            name="activities"
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
          <IgrTextarea
            name="achievements"
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
          <IgrTextarea
            name="failures"
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
            <IgrSlider
              name="progress"
              min={0}
              max={100}
              value={progress}
              onInput={(e: CustomEvent<number>) => setProgress(e.detail)}
              disabled={isPending}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.fieldLabel}>🚩 Mission Status</label>
            <IgrSelect
              name="status"
              disabled={isPending}
            >
              <IgrSelectItem value="On Track">On Track</IgrSelectItem>
              <IgrSelectItem value="Delayed">Delayed</IgrSelectItem>
              <IgrSelectItem value="Critical">Critical</IgrSelectItem>
              <IgrSelectItem value="Completed">Completed</IgrSelectItem>
            </IgrSelect>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.fieldLabel}>⚠️ Urgency Level</label>
            <IgrSelect
              name="urgency"
              disabled={isPending}
            >
              <IgrSelectItem value="Critical">Critical</IgrSelectItem>
              <IgrSelectItem value="High">High</IgrSelectItem>
              <IgrSelectItem value="Medium">Medium</IgrSelectItem>
              <IgrSelectItem value="Low">Low</IgrSelectItem>
            </IgrSelect>
          </div>
        </div>

        <IgrButton type="submit" disabled={isPending}>
          <span>{isPending ? '⌛ Dispatching to Barad-dûr…' : '📜 Submit Report to the Dark Lord'}</span>
        </IgrButton>
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
          <IgrButton onClick={() => setShowHistory(h => !h)}>
            <span>{showHistory
              ? '📋 Submit Report'
              : `📜 History (${optimisticReports.length})`}</span>
          </IgrButton>
          <IgrButton onClick={onLogout}>
            <span>🚶 Retreat</span>
          </IgrButton>
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
