import { IgrTree, IgrTreeItem } from 'igniteui-react';
import { commanders } from '../../data/commanders';
import type { Commander } from '../../data/types';
import styles from './command.module.css';

function buildTree(parentId: string | null): Commander[] {
  return commanders.filter(c => c.parentId === parentId);
}

const REALM_COLORS: Record<string, string> = {
  Mordor: styles.realmMordor,
  Isengard: styles.realmIsengard,
  Harad: styles.realmHarad,
  Rhûn: styles.realmRhun,
  Gundabad: styles.realmGundabad,
  'Dol Guldur': styles.realmDolGuldur,
};

function CommanderNode({ commander }: { commander: Commander }) {
  const children = buildTree(commander.id);
  const realmClass = REALM_COLORS[commander.realm] ?? styles.realmDefault;

  return (
    <IgrTreeItem expanded>
      <div slot="label" className={styles.nodeLabel}>
        <div className={styles.nodeMain}>
          <span className={styles.nodeName}>{commander.name}</span>
          <span className={`${styles.realmBadge} ${realmClass}`}>{commander.realm}</span>
        </div>
        <div className={styles.nodeTitle}>{commander.title}</div>
      </div>
      {children.map(child => (
        <CommanderNode key={child.id} commander={child} />
      ))}
    </IgrTreeItem>
  );
}

export default function Command() {
  const roots = buildTree(null);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>🏴 Order of Command</h1>
        <p className={styles.subtitle}>Hierarchy of generals, lieutenants, and puppet lords across all realms</p>
      </div>

      <div className={styles.legend}>
        {Object.entries(REALM_COLORS).map(([realm, cls]) => (
          <span key={realm} className={`${styles.legendItem} ${cls}`}>{realm}</span>
        ))}
      </div>

      <div className={styles.treeContainer}>
        <IgrTree className={styles.tree} selection="none">
          {roots.map(root => (
            <CommanderNode key={root.id} commander={root} />
          ))}
        </IgrTree>
      </div>

      {/* List view below tree for easier reading */}
      <div className={styles.listView}>
        <h2 className={styles.listTitle}>Commander Roster</h2>
        <div className={styles.commanderList}>
          {commanders.map(c => {
            const parent = commanders.find(p => p.id === c.parentId);
            const realmClass = REALM_COLORS[c.realm] ?? styles.realmDefault;
            return (
              <div key={c.id} className={styles.commanderRow}>
                <div className={styles.commanderLeft}>
                  <span className={styles.commanderName}>{c.name}</span>
                  <span className={styles.commanderTitle}>{c.title}</span>
                  {parent && (
                    <span className={styles.commanderReports}>Reports to: {parent.name}</span>
                  )}
                </div>
                <span className={`${styles.realmBadge} ${realmClass}`}>{c.realm}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
