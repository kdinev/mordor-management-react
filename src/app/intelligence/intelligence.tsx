import { useState } from 'react';
import {
  IgrAccordion,
  IgrExpansionPanel,
  IgrChip,
  IgrBadge,
} from 'igniteui-react';
import { spyReports } from '../../data/spy-reports';
import type { Urgency } from '../../data/types';
import styles from './intelligence.module.css';

const URGENCY_ORDER: Urgency[] = ['Critical', 'High', 'Medium', 'Low'];

const URGENCY_CONFIG: Record<Urgency, { cls: string; icon: string }> = {
  Critical: { cls: styles.urgencyCritical, icon: '🔴' },
  High: { cls: styles.urgencyHigh, icon: '🟠' },
  Medium: { cls: styles.urgencyMedium, icon: '🟡' },
  Low: { cls: styles.urgencyLow, icon: '🟢' },
};

export default function Intelligence() {
  const [urgencyFilter, setUrgencyFilter] = useState<Urgency | 'All'>('All');
  const [ringOnly, setRingOnly] = useState(false);

  const filtered = spyReports
    .filter(r => urgencyFilter === 'All' || r.urgency === urgencyFilter)
    .filter(r => !ringOnly || r.hasRingIntel)
    .sort((a, b) => URGENCY_ORDER.indexOf(a.urgency) - URGENCY_ORDER.indexOf(b.urgency));

  const ringCount = spyReports.filter(r => r.hasRingIntel).length;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          🔮 Eye of Sauron
          {ringCount > 0 && (
            <IgrBadge variant="danger" className={styles.headerBadge}>
              {ringCount} RING INTEL
            </IgrBadge>
          )}
        </h1>
        <p className={styles.subtitle}>
          Intelligence network reports — spy dispatches from across Middle-earth
        </p>
      </div>

      {/* Alert Banner for Ring Intel */}
      {ringCount > 0 && (
        <div className={styles.ringAlert}>
          <span className={styles.ringAlertIcon}>💍</span>
          <div>
            <div className={styles.ringAlertTitle}>ONE RING INTELLIGENCE — {ringCount} ACTIVE REPORTS</div>
            <div className={styles.ringAlertText}>
              Multiple dispatches contain intelligence regarding the One Ring. Review immediately.
            </div>
          </div>
        </div>
      )}

      {/* Summary Strip */}
      <div className={styles.summaryStrip}>
        <div className={styles.summaryItem}>
          <span className={styles.summaryVal}>{spyReports.length}</span>
          <span className={styles.summaryLbl}>Total Reports</span>
        </div>
        {URGENCY_ORDER.map(level => {
          const count = spyReports.filter(r => r.urgency === level).length;
          const cfg = URGENCY_CONFIG[level];
          return (
            <div key={level} className={styles.summaryItem}>
              <span className={`${styles.summaryVal} ${cfg.cls}`}>{count}</span>
              <span className={styles.summaryLbl}>{level}</span>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className={styles.controls}>
        <div className={styles.filterGroup}>
          <span className={styles.filterLabel}>Urgency:</span>
          <div className={styles.chips}>
            {(['All', ...URGENCY_ORDER] as const).map(level => (
              <IgrChip
                key={level}
                selectable
                selected={urgencyFilter === level}
                onClick={() => setUrgencyFilter(level)}
                className={urgencyFilter === level ? styles.chipActive : styles.chip}
              >
                <span>
                  {level !== 'All' && URGENCY_CONFIG[level as Urgency].icon + ' '}
                  {level}
                </span>
              </IgrChip>
            ))}
          </div>
        </div>
        <div className={styles.filterGroup}>
          <IgrChip
            selectable
            selected={ringOnly}
            onClick={() => setRingOnly(o => !o)}
            className={ringOnly ? styles.chipRingActive : styles.chipRing}
          >
            <span>💍 One Ring Only</span>
          </IgrChip>
        </div>
      </div>

      <div className={styles.reportCount}>
        Showing {filtered.length} of {spyReports.length} reports
      </div>

      {/* Reports Accordion */}
      <IgrAccordion className={styles.accordion}>
        {filtered.map(report => {
          const cfg = URGENCY_CONFIG[report.urgency];
          return (
            <IgrExpansionPanel key={report.id} className={`${styles.panel} ${report.hasRingIntel ? styles.panelRing : ''}`}>
              <div slot="title" className={styles.panelTitle}>
                <div className={styles.panelTitleLeft}>
                  <span className={`${styles.urgencyDot} ${cfg.cls}`}>{cfg.icon}</span>
                  <span className={styles.codename}>{report.codename}</span>
                  {report.hasRingIntel && (
                    <span className={styles.ringChip}>💍 ONE RING</span>
                  )}
                  <span className={`${styles.urgencyBadge} ${cfg.cls}`}>{report.urgency}</span>
                </div>
                <div className={styles.panelTitleRight}>
                  <span className={styles.region}>{report.region}</span>
                  <span className={styles.date}>{report.date}</span>
                </div>
              </div>
              <div slot="indicator" className={styles.expandIcon}>▼</div>

              <div className={styles.panelContent}>
                <p className={styles.summary}>{report.summary}</p>

                {report.hasRingIntel && report.ringDetails && (
                  <div className={styles.ringIntel}>
                    <div className={styles.ringIntelHeader}>
                      💍 ONE RING INTELLIGENCE
                    </div>
                    <p className={styles.ringIntelText}>{report.ringDetails}</p>
                  </div>
                )}

                <div className={styles.reportBody}>
                  <div className={styles.reportBodyHeader}>FULL DISPATCH</div>
                  <p className={styles.content}>{report.content}</p>
                </div>

                <div className={styles.reportMeta}>
                  <span>Codename: <strong>{report.codename}</strong></span>
                  <span>Region: <strong>{report.region}</strong></span>
                  <span>Date: <strong>{report.date}</strong></span>
                  <span className={`${styles.urgencyInline} ${cfg.cls}`}>
                    Urgency: <strong>{report.urgency}</strong>
                  </span>
                </div>
              </div>
            </IgrExpansionPanel>
          );
        })}
      </IgrAccordion>
    </div>
  );
}
