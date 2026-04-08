import { Link } from 'react-router-dom';
import { IgrCard, IgrCardHeader, IgrCardContent, IgrLinearProgress, IgrBadge } from 'igniteui-react';
import { battalions } from '../../data/battalions';
import { foodSuppliers } from '../../data/food-suppliers';
import { armorySuppliers } from '../../data/armory-suppliers';
import { spyReports } from '../../data/spy-reports';
import styles from './home.module.css';

export default function Home() {
  const totalTroops = battalions.reduce((sum, b) => sum + b.count, 0);
  const avgMorale = Math.round(battalions.reduce((sum, b) => sum + b.morale, 0) / battalions.length);
  const avgHealth = Math.round(battalions.reduce((sum, b) => sum + b.health, 0) / battalions.length);
  const criticalSuppliers = foodSuppliers.filter(f => f.availability === 'Critical' || f.availability === 'Low').length;
  const damagedForges = armorySuppliers.filter(a => a.status === 'Damaged' || a.status === 'Reduced').length;
  const ringReports = spyReports.filter(r => r.hasRingIntel).length;
  const criticalReports = spyReports.filter(r => r.urgency === 'Critical').length;
  const totalDailyWeapons = armorySuppliers.reduce((sum, a) => sum + a.dailyProduction, 0);
  const totalDailyFood = foodSuppliers.reduce((sum, f) => sum + f.dailyProduction, 0);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          <span className={styles.titleIcon}>👁️</span>
          The Dark Throne — Command Overview
        </h1>
        <p className={styles.subtitle}>All-seeing. All-knowing. One Ring to rule them all.</p>
      </div>

      {/* KPI Strip */}
      <div className={styles.kpiStrip}>
        <div className={styles.kpi}>
          <span className={styles.kpiValue}>{totalTroops.toLocaleString()}</span>
          <span className={styles.kpiLabel}>Total Warriors</span>
        </div>
        <div className={styles.kpiDivider} />
        <div className={styles.kpi}>
          <span className={styles.kpiValue}>{battalions.length}</span>
          <span className={styles.kpiLabel}>Battalions</span>
        </div>
        <div className={styles.kpiDivider} />
        <div className={`${styles.kpi} ${ringReports > 0 ? styles.kpiAlert : ''}`}>
          <span className={styles.kpiValue}>{ringReports}</span>
          <span className={styles.kpiLabel}>Ring Intel Reports</span>
        </div>
        <div className={styles.kpiDivider} />
        <div className={`${styles.kpi} ${criticalReports > 0 ? styles.kpiAlert : ''}`}>
          <span className={styles.kpiValue}>{criticalReports}</span>
          <span className={styles.kpiLabel}>Critical Alerts</span>
        </div>
      </div>

      {/* Main Cards Grid */}
      <div className={styles.grid}>
        {/* Military Status Card */}
        <Link to="/military" className={styles.cardLink}>
          <IgrCard className={styles.card}>
            <IgrCardHeader>
              <h2 slot="title" className={styles.cardTitle}>⚔️ Military Status</h2>
              <span slot="subtitle" className={styles.cardSubtitle}>{battalions.length} active battalions</span>
            </IgrCardHeader>
            <IgrCardContent>
              <div className={styles.cardMetric}>
                <span>Army Morale</span>
                <span className={styles.metricValue}>{avgMorale}%</span>
              </div>
              <IgrLinearProgress
                value={avgMorale}
                max={100}
                className={`${styles.progress} ${avgMorale < 60 ? styles.progressLow : styles.progressHigh}`}
              />
              <div className={styles.cardMetric} style={{ marginTop: '0.75rem' }}>
                <span>Army Health</span>
                <span className={styles.metricValue}>{avgHealth}%</span>
              </div>
              <IgrLinearProgress
                value={avgHealth}
                max={100}
                className={`${styles.progress} ${avgHealth < 60 ? styles.progressLow : styles.progressHigh}`}
              />
              <div className={styles.battalionRaces}>
                {(['Orcs', 'Uruks', 'Nazgûl', 'Haradrim', 'Trolls', 'Warg Riders'] as const).map(race => {
                  const count = battalions.filter(b => b.race === race).length;
                  return count > 0 ? (
                    <span key={race} className={styles.raceBadge}>{race}: {count}</span>
                  ) : null;
                })}
              </div>
            </IgrCardContent>
          </IgrCard>
        </Link>

        {/* Command Structure Card */}
        <Link to="/command" className={styles.cardLink}>
          <IgrCard className={styles.card}>
            <IgrCardHeader>
              <h2 slot="title" className={styles.cardTitle}>🏴 Order of Command</h2>
              <span slot="subtitle" className={styles.cardSubtitle}>Generals &amp; Lieutenants</span>
            </IgrCardHeader>
            <IgrCardContent>
              <div className={styles.commandHighlights}>
                <div className={styles.commandItem}>
                  <span className={styles.commandIcon}>👑</span>
                  <div>
                    <div className={styles.commandName}>The Witch-king of Angmar</div>
                    <div className={styles.commandRole}>Chief Lieutenant — Lord of the Nazgûl</div>
                  </div>
                </div>
                <div className={styles.commandItem}>
                  <span className={styles.commandIcon}>⚙️</span>
                  <div>
                    <div className={styles.commandName}>Saruman</div>
                    <div className={styles.commandRole}>Lord of Isengard (Puppet)</div>
                  </div>
                </div>
                <div className={styles.commandItem}>
                  <span className={styles.commandIcon}>🗡️</span>
                  <div>
                    <div className={styles.commandName}>Gothmog</div>
                    <div className={styles.commandRole}>General — Lieutenant of Morgul</div>
                  </div>
                </div>
                <div className={styles.commandItem}>
                  <span className={styles.commandIcon}>🐍</span>
                  <div>
                    <div className={styles.commandName}>Suladân the Serpent Lord</div>
                    <div className={styles.commandRole}>Chieftain of Harad</div>
                  </div>
                </div>
              </div>
            </IgrCardContent>
          </IgrCard>
        </Link>

        {/* Provisions Card */}
        <Link to="/provisions" className={styles.cardLink}>
          <IgrCard className={styles.card}>
            <IgrCardHeader>
              <h2 slot="title" className={styles.cardTitle}>🌾 Provisions</h2>
              <span slot="subtitle" className={styles.cardSubtitle}>{foodSuppliers.length} supply sources</span>
            </IgrCardHeader>
            <IgrCardContent>
              <div className={styles.supplyStats}>
                <div className={styles.supplyStat}>
                  <span className={styles.supplyNum}>{totalDailyFood.toLocaleString()}</span>
                  <span className={styles.supplyLabel}>rations/day</span>
                </div>
              </div>
              <div className={styles.availabilityBars}>
                {(['Abundant', 'Adequate', 'Low', 'Critical'] as const).map(level => {
                  const count = foodSuppliers.filter(f => f.availability === level).length;
                  return (
                    <div key={level} className={styles.availRow}>
                      <span className={`${styles.availLabel} ${styles[`avail${level}`]}`}>{level}</span>
                      <span className={styles.availCount}>{count} sources</span>
                    </div>
                  );
                })}
              </div>
              {criticalSuppliers > 0 && (
                <div className={styles.alertBanner}>
                  ⚠️ {criticalSuppliers} source{criticalSuppliers > 1 ? 's' : ''} at critical/low availability
                </div>
              )}
            </IgrCardContent>
          </IgrCard>
        </Link>

        {/* Armory Card */}
        <Link to="/armory" className={styles.cardLink}>
          <IgrCard className={styles.card}>
            <IgrCardHeader>
              <h2 slot="title" className={styles.cardTitle}>🔥 Armories &amp; Forges</h2>
              <span slot="subtitle" className={styles.cardSubtitle}>{armorySuppliers.length} forge locations</span>
            </IgrCardHeader>
            <IgrCardContent>
              <div className={styles.supplyStats}>
                <div className={styles.supplyStat}>
                  <span className={styles.supplyNum}>{totalDailyWeapons.toLocaleString()}</span>
                  <span className={styles.supplyLabel}>items forged/day</span>
                </div>
              </div>
              <div className={styles.availabilityBars}>
                {(['Active', 'Reduced', 'Upgrading', 'Damaged'] as const).map(status => {
                  const count = armorySuppliers.filter(a => a.status === status).length;
                  return (
                    <div key={status} className={styles.availRow}>
                      <span className={`${styles.availLabel} ${styles[`forge${status}`]}`}>{status}</span>
                      <span className={styles.availCount}>{count} forges</span>
                    </div>
                  );
                })}
              </div>
              {damagedForges > 0 && (
                <div className={styles.alertBanner}>
                  ⚠️ {damagedForges} forge{damagedForges > 1 ? 's' : ''} damaged or at reduced capacity
                </div>
              )}
            </IgrCardContent>
          </IgrCard>
        </Link>

        {/* Intelligence Card - Full Width */}
        <Link to="/intelligence" className={`${styles.cardLink} ${styles.cardFull}`}>
          <IgrCard className={`${styles.card} ${styles.intelligenceCard}`}>
            <IgrCardHeader>
              <h2 slot="title" className={styles.cardTitle}>
                🔮 Eye of Sauron — Intelligence
                {ringReports > 0 && (
                  <IgrBadge variant="danger" className={styles.ringBadge}>
                    {ringReports} ONE RING
                  </IgrBadge>
                )}
              </h2>
              <span slot="subtitle" className={styles.cardSubtitle}>{spyReports.length} active reports</span>
            </IgrCardHeader>
            <IgrCardContent>
              <div className={styles.recentReports}>
                {spyReports
                  .filter(r => r.urgency === 'Critical')
                  .slice(0, 3)
                  .map(report => (
                    <div key={report.id} className={`${styles.reportRow} ${report.hasRingIntel ? styles.reportRing : ''}`}>
                      <div className={styles.reportMeta}>
                        <span className={styles.reportCode}>{report.codename}</span>
                        <span className={styles.reportRegion}>{report.region}</span>
                        <span className={styles.reportDate}>{report.date}</span>
                        {report.hasRingIntel && (
                          <span className={styles.ringChip}>💍 ONE RING</span>
                        )}
                      </div>
                      <p className={styles.reportSummary}>{report.summary}</p>
                    </div>
                  ))}
              </div>
              <div className={styles.viewAll}>→ View all {spyReports.length} intelligence reports</div>
            </IgrCardContent>
          </IgrCard>
        </Link>
      </div>
    </div>
  );
}
