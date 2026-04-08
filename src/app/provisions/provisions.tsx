import { useState } from 'react';
import { IgrCard, IgrCardHeader, IgrCardContent, IgrLinearProgress } from 'igniteui-react';
import { foodSuppliers } from '../../data/food-suppliers';
import type { AvailabilityLevel } from '../../data/types';
import styles from './provisions.module.css';

const AVAIL_ORDER: AvailabilityLevel[] = ['Abundant', 'Adequate', 'Low', 'Critical'];

const AVAIL_CONFIG: Record<AvailabilityLevel, { color: string; bar: number }> = {
  Abundant: { color: styles.availAbundant, bar: 100 },
  Adequate: { color: styles.availAdequate, bar: 65 },
  Low: { color: styles.availLow, bar: 35 },
  Critical: { color: styles.availCritical, bar: 10 },
};

const FOOD_ICONS: Record<string, string> = {
  Grain: '🌾',
  Meat: '🥩',
  Fish: '🐟',
  Fungus: '🍄',
  Mixed: '🥘',
};

export default function Provisions() {
  const [filter, setFilter] = useState<AvailabilityLevel | 'All'>('All');

  const sorted = [...foodSuppliers].sort(
    (a, b) => AVAIL_ORDER.indexOf(a.availability) - AVAIL_ORDER.indexOf(b.availability)
  );
  const filtered = filter === 'All' ? sorted : sorted.filter(f => f.availability === filter);

  const totalProduction = foodSuppliers.reduce((s, f) => s + f.dailyProduction, 0);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>🌾 Provisions & Supply</h1>
        <p className={styles.subtitle}>Food production, availability, and supply chain overview</p>
      </div>

      {/* Summary Cards */}
      <div className={styles.summaryRow}>
        <div className={styles.summaryCard}>
          <span className={styles.summaryVal}>{totalProduction.toLocaleString()}</span>
          <span className={styles.summaryLbl}>Total Rations/Day</span>
        </div>
        {AVAIL_ORDER.map(level => {
          const count = foodSuppliers.filter(f => f.availability === level).length;
          return (
            <div
              key={level}
              className={`${styles.summaryCard} ${styles.summaryClickable} ${filter === level ? styles.summaryActive : ''}`}
              onClick={() => setFilter(f => f === level ? 'All' : level)}
              role="button"
              tabIndex={0}
              onKeyDown={e => e.key === 'Enter' && setFilter(f => f === level ? 'All' : level)}
            >
              <span className={`${styles.summaryVal} ${AVAIL_CONFIG[level].color}`}>{count}</span>
              <span className={styles.summaryLbl}>{level}</span>
            </div>
          );
        })}
      </div>

      {/* Supplier List */}
      <div className={styles.supplierGrid}>
        {filtered.map(supplier => {
          const cfg = AVAIL_CONFIG[supplier.availability];
          return (
            <IgrCard key={supplier.id} className={styles.card}>
              <IgrCardHeader>
                <h2 slot="title" className={styles.cardTitle}>
                  <span>{FOOD_ICONS[supplier.type]}</span>
                  {supplier.name}
                </h2>
                <div slot="subtitle" className={styles.cardSub}>
                  <span className={`${styles.availBadge} ${cfg.color}`}>{supplier.availability}</span>
                  <span className={styles.locationText}>📍 {supplier.location}</span>
                </div>
              </IgrCardHeader>
              <IgrCardContent>
                <div className={styles.productionRow}>
                  <div className={styles.productionBlock}>
                    <span className={styles.productionNum}>{supplier.dailyProduction.toLocaleString()}</span>
                    <span className={styles.productionLbl}>rations/day</span>
                  </div>
                  <div className={styles.productionBlock}>
                    <span className={styles.productionNum}>{supplier.type}</span>
                    <span className={styles.productionLbl}>food type</span>
                  </div>
                </div>

                <div className={styles.availRow}>
                  <span className={styles.availBarLabel}>Availability</span>
                  <span className={`${styles.availBarPct} ${cfg.color}`}>{supplier.availability}</span>
                </div>
                <IgrLinearProgress
                  value={cfg.bar}
                  max={100}
                  className={`${styles.availBar} ${cfg.color}`}
                />

                <div className={styles.suppliedTo}>
                  <span className={styles.suppliedLabel}>Supplies:</span>
                  <div className={styles.suppliedList}>
                    {supplier.suppliedTo.map(target => (
                      <span key={target} className={styles.supplyTag}>{target}</span>
                    ))}
                  </div>
                </div>

                <div className={styles.notes}>{supplier.notes}</div>
              </IgrCardContent>
            </IgrCard>
          );
        })}
      </div>
    </div>
  );
}
