import { useState } from 'react';
import {
  IgrCard, IgrCardHeader, IgrCardContent,
  IgrLinearProgress, IgrChip,
} from 'igniteui-react';
import { battalions } from '../../data/battalions';
import type { BattalionStatus, Race } from '../../data/types';
import styles from './military.module.css';

const STATUS_COLORS: Record<BattalionStatus, string> = {
  Active: styles.statusActive,
  'On March': styles.statusMarch,
  Garrisoned: styles.statusGarrisoned,
  Recovering: styles.statusRecovering,
};

const RACE_ICONS: Record<Race, string> = {
  Orcs: '👹',
  Uruks: '💪',
  Trolls: '🗿',
  'Cave Trolls': '🗿',
  Nazgûl: '🌑',
  Haradrim: '🐘',
  'Warg Riders': '🐺',
  'Men of Rhûn': '⚔️',
};

function moraleColor(val: number) {
  if (val >= 80) return styles.barGreen;
  if (val >= 60) return styles.barYellow;
  return styles.barRed;
}

const ALL_REALMS = ['All', ...Array.from(new Set(battalions.map(b => b.realm)))];

export default function Military() {
  const [realm, setRealm] = useState('All');
  const [sortField, setSortField] = useState<'count' | 'morale' | 'health'>('count');

  const filtered = battalions
    .filter(b => realm === 'All' || b.realm === realm)
    .slice()
    .sort((a, b) => b[sortField] - a[sortField]);

  const totalTroops = filtered.reduce((s, b) => s + b.count, 0);
  const avgMorale = filtered.length
    ? Math.round(filtered.reduce((s, b) => s + b.morale, 0) / filtered.length)
    : 0;
  const avgHealth = filtered.length
    ? Math.round(filtered.reduce((s, b) => s + b.health, 0) / filtered.length)
    : 0;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>⚔️ Military Command</h1>
        <p className={styles.subtitle}>Battalion strength, morale, and composition reports</p>
      </div>

      {/* Summary Strip */}
      <div className={styles.summaryStrip}>
        <div className={styles.summaryItem}>
          <span className={styles.summaryValue}>{totalTroops.toLocaleString()}</span>
          <span className={styles.summaryLabel}>Warriors (filtered)</span>
        </div>
        <div className={styles.summaryItem}>
          <span className={styles.summaryValue}>{filtered.length}</span>
          <span className={styles.summaryLabel}>Battalions</span>
        </div>
        <div className={styles.summaryItem}>
          <span className={`${styles.summaryValue} ${avgMorale < 60 ? styles.lowVal : ''}`}>{avgMorale}%</span>
          <span className={styles.summaryLabel}>Avg Morale</span>
        </div>
        <div className={styles.summaryItem}>
          <span className={`${styles.summaryValue} ${avgHealth < 60 ? styles.lowVal : ''}`}>{avgHealth}%</span>
          <span className={styles.summaryLabel}>Avg Health</span>
        </div>
      </div>

      {/* Filters & Sort */}
      <div className={styles.controls}>
        <div className={styles.filterGroup}>
          <span className={styles.filterLabel}>Realm:</span>
          <div className={styles.chips}>
            {ALL_REALMS.map(r => (
              <IgrChip
                key={r}
                selectable
                selected={realm === r}
                onClick={() => setRealm(r)}
                className={realm === r ? styles.chipActive : styles.chip}
              >
                <span>{r}</span>
              </IgrChip>
            ))}
          </div>
        </div>
        <div className={styles.filterGroup}>
          <span className={styles.filterLabel}>Sort by:</span>
          <div className={styles.chips}>
            {(['count', 'morale', 'health'] as const).map(field => (
              <IgrChip
                key={field}
                selectable
                selected={sortField === field}
                onClick={() => setSortField(field)}
                className={sortField === field ? styles.chipActive : styles.chip}
              >
                <span>{field.charAt(0).toUpperCase() + field.slice(1)}</span>
              </IgrChip>
            ))}
          </div>
        </div>
      </div>

      {/* Battalion Cards */}
      <div className={styles.battalionGrid}>
        {filtered.map(battalion => (
          <IgrCard key={battalion.id} className={styles.card}>
            <IgrCardHeader>
              <h2 slot="title" className={styles.cardTitle}>
                <span>{RACE_ICONS[battalion.race]}</span>
                {battalion.name}
              </h2>
              <div slot="subtitle" className={styles.cardMeta}>
                <span className={styles.generalName}>General: {battalion.general}</span>
                <span className={`${styles.statusChip} ${STATUS_COLORS[battalion.status]}`}>
                  {battalion.status}
                </span>
              </div>
            </IgrCardHeader>
            <IgrCardContent>
              <div className={styles.stats}>
                <div className={styles.statBlock}>
                  <span className={styles.statNum}>{battalion.count.toLocaleString()}</span>
                  <span className={styles.statLabel}>warriors</span>
                </div>
                <div className={styles.statBlock}>
                  <span className={styles.statNum}>{battalion.race}</span>
                  <span className={styles.statLabel}>primary race</span>
                </div>
                <div className={styles.statBlock}>
                  <span className={styles.statNum}>{battalion.realm}</span>
                  <span className={styles.statLabel}>realm</span>
                </div>
              </div>

              <div className={styles.barRow}>
                <span className={styles.barLabel}>Morale</span>
                <span className={`${styles.barPct} ${battalion.morale < 60 ? styles.lowVal : ''}`}>
                  {battalion.morale}%
                </span>
              </div>
              <IgrLinearProgress
                value={battalion.morale}
                max={100}
                className={`${styles.bar} ${moraleColor(battalion.morale)}`}
              />

              <div className={styles.barRow} style={{ marginTop: '0.6rem' }}>
                <span className={styles.barLabel}>Health</span>
                <span className={`${styles.barPct} ${battalion.health < 60 ? styles.lowVal : ''}`}>
                  {battalion.health}%
                </span>
              </div>
              <IgrLinearProgress
                value={battalion.health}
                max={100}
                className={`${styles.bar} ${moraleColor(battalion.health)}`}
              />

              <div className={styles.location}>
                📍 {battalion.location}
              </div>
            </IgrCardContent>
          </IgrCard>
        ))}
      </div>
    </div>
  );
}
