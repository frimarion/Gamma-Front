import { useEffect } from 'react';

export function useTelegram() {
  const tg = window.Telegram?.WebApp;

  useEffect(() => {
    if (tg) {
      tg.ready();
      tg.expand();
    }
  }, []);

  return {
    tg,
    user: tg?.initDataUnsafe?.user || null,
    themeParams: tg?.themeParams || {},
    initData: tg?.initData || '',
    showBackButton: (cb) => {
      if (!tg) return;
      tg.BackButton.show();
      tg.BackButton.onClick(cb);
      return () => {
        tg.BackButton.offClick(cb);
        tg.BackButton.hide();
      };
    },
    hideBackButton: () => tg?.BackButton.hide(),
    haptic: {
      light:   () => tg?.HapticFeedback?.impactOccurred('light'),
      medium:  () => tg?.HapticFeedback?.impactOccurred('medium'),
      success: () => tg?.HapticFeedback?.notificationOccurred('success'),
      error:   () => tg?.HapticFeedback?.notificationOccurred('error'),
      warning: () => tg?.HapticFeedback?.notificationOccurred('warning'),
    },
  };
}
