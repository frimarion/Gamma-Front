import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client.js';
import { formatPrice, formatDate, STATUS_LABELS, STATUS_COLORS } from '../utils/format.js';
import Spinner from '../components/ui/Spinner.jsx';
import styles from './OrdersPage.module.css';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.getOrders()
      .then(setOrders)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className={styles.centered}>
        <Spinner size={36} />
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className={styles.empty}>
        <div className={styles.emptyIcon}>📋</div>
        <h2 className={`font-display ${styles.emptyTitle}`}>Заказов пока нет</h2>
        <p className={styles.emptyText}>Ваши заказы появятся здесь</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <h1 className={`${styles.title} font-display`}>Мои заказы</h1>
      <div className={styles.list}>
        {orders.map(order => (
          <button
            key={order.id}
            className={styles.card}
            onClick={() => navigate(`/orders/${order.id}`)}
          >
            <div className={styles.cardTop}>
              <span className={styles.orderId}>Заказ #{order.id}</span>
              <span className={styles.status} style={{ color: STATUS_COLORS[order.status] }}>
                {STATUS_LABELS[order.status] || order.status}
              </span>
            </div>
            <div className={styles.cardMeta}>
              <span className={styles.table}>🪑 {order.table_label}</span>
              <span className={styles.date}>{formatDate(order.created_at)}</span>
            </div>
            <div className={styles.cardBottom}>
              <span className={styles.itemsPreview}>
                {order.order_items.slice(0, 2).map(i => i.title).join(', ')}
                {order.order_items.length > 2 ? ` +${order.order_items.length - 2}` : ''}
              </span>
              <span className={`${styles.total} font-display`}>{formatPrice(order.total_amount)}</span>
            </div>
            <StatusBar status={order.status} />
          </button>
        ))}
      </div>
    </div>
  );
}

const STEPS = ['new', 'accepted', 'cooking', 'ready', 'delivered'];

function StatusBar({ status }) {
  if (status === 'cancelled') {
    return <div className={styles.cancelledBar}>Отменён</div>;
  }
  const currentIdx = STEPS.indexOf(status);
  return (
    <div className={styles.statusBar}>
      {STEPS.map((s, i) => (
        <div
          key={s}
          className={`${styles.step} ${i <= currentIdx ? styles.stepDone : ''} ${i === currentIdx ? styles.stepCurrent : ''}`}
        />
      ))}
    </div>
  );
}
