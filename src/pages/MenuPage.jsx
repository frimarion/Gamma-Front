import { useState, useEffect, useRef } from 'react';
import { api } from '../api/client.js';
import { useCartStore } from '../store/index.js';
import { formatPrice } from '../utils/format.js';
import { useTelegram } from '../hooks/useTelegram.js';
import Spinner from '../components/ui/Spinner.jsx';
import styles from './MenuPage.module.css';

export default function MenuPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCat, setActiveCat] = useState(null);
  const { haptic } = useTelegram();
  const sectionRefs = useRef({});
  const mainRef = useRef(null);

  useEffect(() => {
    api.getMenu().then(data => {
      setCategories(data);
      if (data.length) setActiveCat(data[0].id);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  function scrollTo(catId) {
    setActiveCat(catId);
    sectionRefs.current[catId]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  if (loading) {
    return (
      <div className={styles.centered}>
        <Spinner size={36} />
      </div>
    );
  }

  return (
    <div className={styles.page} ref={mainRef}>
      {/* Category tabs */}
      <div className={styles.tabs}>
        {categories.map(cat => (
          <button
            key={cat.id}
            className={`${styles.tab} ${activeCat === cat.id ? styles.tabActive : ''}`}
            onClick={() => { haptic?.light(); scrollTo(cat.id); }}
          >
            {cat.title}
          </button>
        ))}
      </div>

      {/* Menu sections */}
      <div className={styles.sections}>
        {categories.map(cat => (
          <section
            key={cat.id}
            ref={el => { sectionRefs.current[cat.id] = el; }}
            className={styles.section}
          >
            <h2 className={`${styles.catTitle} font-display`}>{cat.title}</h2>
            <div className={styles.grid}>
              {cat.items.map(item => (
                <DishCard key={item.id} item={item} haptic={haptic} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

function DishCard({ item, haptic }) {
  const qty = useCartStore(s => s.getQty(item.id));
  const { addItem, removeItem } = useCartStore();

  function handleAdd() {
    haptic?.light();
    addItem({
      menu_item_id: item.id,
      title: item.title,
      price: item.price,
    });
  }

  function handleInc() {
    haptic?.light();
    addItem({ menu_item_id: item.id, title: item.title, price: item.price });
  }

  function handleDec() {
    haptic?.light();
    removeItem(item.id);
  }

  return (
    <div className={styles.card}>
      <div className={styles.cardBody}>
        <h3 className={styles.itemTitle}>{item.title}</h3>
        {item.description && (
          <p className={styles.itemDesc}>{item.description}</p>
        )}
        <p className={styles.itemPrice}>{formatPrice(item.price)}</p>
      </div>

      <div className={styles.cardActions}>
        {qty === 0 ? (
          <button className={styles.addBtn} onClick={handleAdd}>
            <span>+</span> В корзину
          </button>
        ) : (
          <div className={styles.counter}>
            <button className={styles.counterBtn} onClick={handleDec}>−</button>
            <span className={styles.counterVal}>{qty}</span>
            <button className={styles.counterBtn} onClick={handleInc}>+</button>
          </div>
        )}
      </div>
    </div>
  );
}
