import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/index.js';
import { api } from '../api/client.js';
import { formatPrice } from '../utils/format.js';
import { useTelegram } from '../hooks/useTelegram.js';
import Spinner from '../components/ui/Spinner.jsx';
import styles from './CartPage.module.css';

export default function CartPage() {
  const { items, addItem, removeItem, clearCart } = useCartStore();
  const [tableLabel, setTableLabel] = useState('');
  const [comment, setComment] = useState('');
  const [tableErr, setTableErr] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');
  const navigate = useNavigate();
  const { haptic } = useTelegram();

  const total = items.reduce((s, i) => s + i.price * i.qty, 0);
  const isEmpty = items.length === 0;

  async function handleOrder() {
    if (!tableLabel.trim()) {
      setTableErr('Укажите стол или зону');
      haptic?.error();
      return;
    }
    setApiError('');
    setSubmitting(true);
    try {
      const { id } = await api.createOrder({
        table_label: tableLabel.trim(),
        comment: comment.trim() || null,
        items: items.map(i => ({ menu_item_id: i.menu_item_id, qty: i.qty })),
      });
      haptic?.success();
      clearCart();
      navigate(`/orders/${id}`);
    } catch (e) {
      setApiError(e.message);
      haptic?.error();
    } finally {
      setSubmitting(false);
    }
  }

  if (isEmpty) {
    return (
      <div className={styles.empty}>
        <div className={styles.emptyIcon}>🛒</div>
        <h2 className={`${styles.emptyTitle} font-display`}>Корзина пуста</h2>
        <p className={styles.emptyText}>Выберите блюда в разделе Меню</p>
        <button className={styles.toMenuBtn} onClick={() => navigate('/menu')}>
          Перейти в меню
        </button>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={`${styles.title} font-display`}>Корзина</h1>
        <button className={styles.clearBtn} onClick={() => { haptic?.warning(); clearCart(); }}>
          Очистить
        </button>
      </div>

      <div className={styles.items}>
        {items.map(item => (
          <div key={item.menu_item_id} className={styles.item}>
            <div className={styles.itemInfo}>
              <span className={styles.itemTitle}>{item.title}</span>
              <span className={styles.itemPrice}>{formatPrice(item.price)}</span>
            </div>
            <div className={styles.itemRight}>
              <span className={styles.lineTotal}>{formatPrice(item.price * item.qty)}</span>
              <div className={styles.counter}>
                <button className={styles.counterBtn} onClick={() => { haptic?.light(); removeItem(item.menu_item_id); }}>−</button>
                <span className={styles.counterVal}>{item.qty}</span>
                <button className={styles.counterBtn} onClick={() => { haptic?.light(); addItem(item); }}>+</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.totalRow}>
        <span className={styles.totalLabel}>Итого</span>
        <span className={`${styles.totalAmount} font-display`}>{formatPrice(total)}</span>
      </div>

      <div className={styles.details}>
        <div className={styles.field}>
          <label className={styles.label}>Стол / Зона <span className={styles.req}>*</span></label>
          <input
            className={`${styles.input} ${tableErr ? styles.inputError : ''}`}
            type="text"
            placeholder="Например: Стол 3, Веранда, Барная стойка"
            value={tableLabel}
            onChange={e => { setTableLabel(e.target.value); setTableErr(''); }}
          />
          {tableErr && <p className={styles.errText}>{tableErr}</p>}
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Комментарий <span className={styles.opt}>(необязательно)</span></label>
          <textarea
            className={styles.textarea}
            placeholder="Без льда, аллергия на орехи..."
            rows={3}
            value={comment}
            onChange={e => setComment(e.target.value)}
          />
        </div>
      </div>

      {apiError && <p className={styles.apiError}>{apiError}</p>}

      <button
        className={styles.orderBtn}
        onClick={handleOrder}
        disabled={submitting}
      >
        {submitting
          ? <><Spinner size={20} color="#000" /> Оформляем...</>
          : <>Оформить заказ — {formatPrice(total)}</>
        }
      </button>
    </div>
  );
}
