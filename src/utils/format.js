export function formatPrice(kopecks) {
  const rub = kopecks / 100;
  return rub.toLocaleString('ru-RU', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }) + ' ₽';
}

export const STATUS_LABELS = {
  new:       'Новый',
  accepted:  'Принят',
  cooking:   'Готовится',
  ready:     'Готов',
  delivered: 'Выдан',
  cancelled: 'Отменён',
};

export const STATUS_COLORS = {
  new:       '#ffaa2e',
  accepted:  '#47baff',
  cooking:   '#ff7a2e',
  ready:     '#4fff9b',
  delivered: '#777',
  cancelled: '#ff4f4f',
};

export function formatDate(isoString) {
  return new Date(isoString).toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}
