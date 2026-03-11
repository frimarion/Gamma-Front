import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api/client.js';
import { formatPrice, formatDate, STATUS_LABELS, STATUS_COLORS } from '../utils/format.js';
import { useTelegram } from '../hooks/useTelegram.js';
import Spinner from '../components/ui/Spinner.jsx';
import styles from './OrderDetailPage.module.css';

const STATUS_ICONS = {
  new:       '🆕',
  accepted:  '✅',
  cooking:   '👨‍🍳',
  ready:     '🔔',
  delivered: '✔️',
  cancelled: '❌',
};

export default function OrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showBackButton } = useTelegram();

  useEffect(() => {
    const cleanup = showBackButton(() => navigate('/orders'));
    api.getOrder(id)
      .then(setOrder)
      .finally(() => setLoading(false));
    return cleanup;
  }, [id]);

  if (loading) {
    return <div className={styles.centered}><Spinner size={36} /></div>;
  }

  if (!order) {
    return <div className={styles.centered}><p>Заказ не найден</p></div>;
  }

  const statusColor = STATUS_COLORS[order.status];

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate('/orders')}>
          ← Назад
        </button>
        <h1 className={`${styles.title} font-display`}>Заказ #{order.id}</h1>
      </div>

      <div className={styles.statusCard} style={{ borderColor: statusColor }}>
        <span className={styles.statusIcon}>{STATUS_ICONS[order.status]}</span>
        <div>
          <div className={styles.statusLabel} style={{ color: statusColor }}>
            {STATUS_LABELS[order.status]}
          </div>
          <div className={styles.statusDate}>{formatDate(order.created_at)}</div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.row}>
          <span className={styles.rowLabel}>Стол</span>
          <span className={styles.rowValue}>{order.table_label}</span>
        </div>
        {order.comment && (
          <div className={styles.row}>
            <span className={styles.rowLabel}>Комментарий</span>
            <span className={styles.rowValue}>{order.comment}</span>
          </div>
        )}
      </div>

      <div className={styles.sectionTitle}>Состав заказа</div>
      <div className={styles.itemsBlock}>
        {order.order_items.map(item => (
          <div key={item.id} className={styles.item}>
            <span className={styles.itemTitle}>{item.title} ×{item.qty}</span>
            <span className={styles.itemTotal}>{formatPrice(item.price * item.qty)}</span>
          </div>
        ))}
        <div className={styles.totalRow}>
          <span>Итого</span>
          <span className={`${styles.totalAmount} font-display`}>{formatPrice(order.total_amount)}</span>
        </div>
      </div>

      <div className={styles.sectionTitle}>История</div>
      <div className={styles.timeline}>
        {order.accepted_at  && <TimelineItem label="Принят"    time={order.accepted_at} />}
        {order.cooking_at   && <TimelineItem label="Готовится" time={order.cooking_at}  />}
        {order.ready_at     && <TimelineItem label="Готов"     time={order.ready_at}    />}
        {order.delivered_at && <TimelineItem label="Выдан"     time={order.delivered_at}/>}
        {order.cancelled_at && <TimelineItem label="Отменён"   time={order.cancelled_at} color={STATUS_COLORS.cancelled}/>}
      </div>
    </div>
  );
}

function TimelineItem({ label, time, color }) {
  return (
    <div className={styles.timelineItem}>
      <span className={styles.timelineDot} style={{ background: color || '#4fff9b' }} />
      <span className={styles.timelineLabel}>{label}</span>
      <span className={styles.timelineTime}>{formatDate(time)}</span>
    </div>
  );
}
