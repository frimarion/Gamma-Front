import { NavLink } from 'react-router-dom';
import { useCartStore } from '../../store/index.js';
import styles from './Layout.module.css';

const NAV = [
  { to: '/menu',    icon: MenuIcon,    label: 'Меню'    },
  { to: '/cart',    icon: CartIcon,    label: 'Корзина' },
  { to: '/orders',  icon: OrdersIcon,  label: 'Заказы'  },
  { to: '/profile', icon: ProfileIcon, label: 'Профиль' },
];

export default function Layout({ children }) {
  const totalItems = useCartStore(s => s.items.reduce((a, i) => a + i.qty, 0));

  return (
    <div className={styles.root}>
      <main className={styles.main}>{children}</main>
      <nav className={styles.nav}>
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.active : ''}`
            }
          >
            <span className={styles.iconWrap}>
              <Icon />
              {to === '/cart' && totalItems > 0 && (
                <span className={styles.badge}>{totalItems}</span>
              )}
            </span>
            <span className={styles.label}>{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

function MenuIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <line x1="3" y1="6"  x2="21" y2="6"  />
      <line x1="3" y1="12" x2="16" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1.2" fill="currentColor" stroke="none"/>
      <circle cx="20" cy="21" r="1.2" fill="currentColor" stroke="none"/>
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
    </svg>
  );
}

function OrdersIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14,2 14,8 20,8"/>
      <line x1="9" y1="13" x2="15" y2="13"/>
      <line x1="9" y1="17" x2="13" y2="17"/>
    </svg>
  );
}

function ProfileIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  );
}
