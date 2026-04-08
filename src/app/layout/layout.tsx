import { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  IgrNavbar,
  IgrNavDrawer,
  IgrNavDrawerItem,
  IgrIconButton,
} from 'igniteui-react';
import styles from './layout.module.css';

const navItems = [
  { path: '/', label: 'Dark Throne', icon: '👁️', exact: true },
  { path: '/military', label: 'Military Command', icon: '⚔️' },
  { path: '/command', label: 'Order of Command', icon: '🏴' },
  { path: '/provisions', label: 'Provisions', icon: '🌾' },
  { path: '/armory', label: 'Armories & Forges', icon: '🔥' },
  { path: '/intelligence', label: 'Eye of Sauron', icon: '🔮' },
  { path: '/reports', label: 'Commander Reports', icon: '📜' },
];

export default function Layout() {
  const [drawerOpen, setDrawerOpen] = useState(true);
  const location = useLocation();

  const currentPage = navItems.find(item =>
    item.exact ? location.pathname === item.path : location.pathname.startsWith(item.path)
  );

  return (
    <div className={styles.appShell}>
      <IgrNavbar className={styles.navbar}>
        <IgrIconButton slot="start" variant="flat" onClick={() => setDrawerOpen(o => !o)}>
          <span className={styles.menuIcon}>☰</span>
        </IgrIconButton>
        <div slot="start" className={styles.navTitle}>
          <span className={styles.eyeGlyph}>👁️</span>
          <span>Mordor Command</span>
        </div>
        <div slot="end" className={styles.navPageLabel}>
          {currentPage?.icon} {currentPage?.label}
        </div>
      </IgrNavbar>

      <div className={styles.body}>
        <IgrNavDrawer open={drawerOpen} className={styles.drawer}>
          <div className={styles.drawerHeader}>
            <span className={styles.drawerLogo}>⚫</span>
            <span className={styles.drawerTitle}>One Dark Ring<br /><small>Management System</small></span>
          </div>
          <div className={styles.navList}>
            {navItems.map(item => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.exact}
                className={({ isActive }) =>
                  `${styles.navItem} ${isActive ? styles.navItemActive : ''}`
                }
              >
                <IgrNavDrawerItem>
                  <span slot="icon">{item.icon}</span>
                  <span slot="content">{item.label}</span>
                </IgrNavDrawerItem>
              </NavLink>
            ))}
          </div>
          <div className={styles.drawerFooter}>
            <span>Ash nazg durbatulûk</span>
          </div>
        </IgrNavDrawer>

        <main className={styles.main}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
