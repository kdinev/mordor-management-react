import { useState } from 'react';
import { IgrCard, IgrCardHeader, IgrCardContent, IgrLinearProgress } from 'igniteui-react';
import { armorySuppliers } from '../../data/armory-suppliers';
import type { ProductionStatus } from '../../data/types';
import styles from './armory.module.css';

const STATUS_CONFIG: Record<ProductionStatus, { label: string; barPct: number; cls: string }> = {
  Active: { label: 'Active', barPct: 100, cls: styles.statusActive },
  Reduced: { label: 'Reduced', barPct: 45, cls: styles.statusReduced },
  Upgrading: { label: 'Upgrading', barPct: 60, cls: styles.statusUpgrading },
  Damaged: { label: 'Damaged', barPct: 15, cls: styles.statusDamaged },
};

const QUALITY_STARS: Record<string, string> = {
  Masterwork: '⭐⭐⭐',
  Standard: '⭐⭐',
  Crude: '⭐',
};

const SPECIALTY_ICONS: Record<string, string> = {
  Swords: '🗡️',
  Armor: '🛡️',
  'Siege Weapons': '🏰',
  Arrows: '🏹',
  Axes: '🪓',
  Mixed: '⚔️',
};

export default function Armory() {
  const [filter, setFilter] = useState<ProductionStatus | 'All'>('All');

  const filtered = filter === 'All'
    ? armorySuppliers
    : armorySuppliers.filter(a => a.status === filter);

  const totalProduction = armorySuppliers.reduce((s, a) => s + a.dailyProduction, 0);
  const filteredProduction = filtered.reduce((s, a) => s + a.dailyProduction, 0);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>🔥 Armories &amp; Forges</h1>
        <p className={styles.subtitle}>Smithing production, weapon output, and forge status by location</p>
      </div>

      {/* Summary Row */}
      <div className={styles.summaryRow}>
        <div className={styles.summaryCard}>
          <span className={styles.summaryVal}>{totalProduction.toLocaleString()}</span>
          <span className={styles.summaryLbl}>Total Items/Day</span>
        </div>
        {(['Active', 'Reduced', 'Upgrading', 'Damaged'] as ProductionStatus[]).map(status => {
          const count = armorySuppliers.filter(a => a.status === status).length;
          const cfg = STATUS_CONFIG[status];
          return (
            <div
              key={status}
              className={`${styles.summaryCard} ${styles.summaryClickable} ${filter === status ? styles.summaryActive : ''}`}
              onClick={() => setFilter(f => f === status ? 'All' : status)}
              role="button"
              tabIndex={0}
              onKeyDown={e => e.key === 'Enter' && setFilter(f => f === status ? 'All' : status)}
            >
              <span className={`${styles.summaryVal} ${cfg.cls}`}>{count}</span>
              <span className={styles.summaryLbl}>{status}</span>
            </div>
          );
        })}
      </div>

      {/* Production Total Bar */}
      <div className={styles.productionMeter}>
        <div className={styles.meterLabel}>
          <span>Showing {filteredProduction.toLocaleString()} / {totalProduction.toLocaleString()} items/day capacity</span>
          <span className={styles.meterPct}>
            {Math.round(filteredProduction / totalProduction * 100)}%
          </span>
        </div>
        <IgrLinearProgress
          value={filteredProduction}
          max={totalProduction}
          className={styles.meterBar}
        />
      </div>

      {/* Forge Cards */}
      <div className={styles.forgeGrid}>
        {filtered.map(supplier => {
          const cfg = STATUS_CONFIG[supplier.status];
          return (
            <IgrCard key={supplier.id} className={styles.card}>
              <IgrCardHeader>
                <h2 slot="title" className={styles.cardTitle}>
                  <span>{SPECIALTY_ICONS[supplier.specialty]}</span>
                  {supplier.name}
                </h2>
                <div slot="subtitle" className={styles.cardSub}>
                  <span className={`${styles.statusBadge} ${cfg.cls}`}>{cfg.label}</span>
                  <span className={styles.locationText}>📍 {supplier.location}</span>
                </div>
              </IgrCardHeader>
              <IgrCardContent>
                <div className={styles.statsRow}>
                  <div className={styles.statBlock}>
                    <span className={styles.statNum}>{supplier.dailyProduction.toLocaleString()}</span>
                    <span className={styles.statLbl}>items/day</span>
                  </div>
                  <div className={styles.statBlock}>
                    <span className={styles.statNum}>{supplier.specialty}</span>
                    <span className={styles.statLbl}>specialty</span>
                  </div>
                  <div className={styles.statBlock}>
                    <span className={styles.statNum}>{QUALITY_STARS[supplier.quality]}</span>
                    <span className={styles.statLbl}>{supplier.quality}</span>
                  </div>
                </div>

                <div className={styles.barRow}>
                  <span className={styles.barLabel}>Production Capacity</span>
                  <span className={`${styles.barPct} ${cfg.cls}`}>{cfg.barPct}%</span>
                </div>
                <IgrLinearProgress
                  value={cfg.barPct}
                  max={100}
                  className={`${styles.capacityBar} ${cfg.cls}`}
                />

                <div className={styles.notes}>{supplier.notes}</div>
              </IgrCardContent>
            </IgrCard>
          );
        })}
      </div>
    </div>
  );
}
