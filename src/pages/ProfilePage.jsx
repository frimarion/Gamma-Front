import { useState } from 'react';
import { api } from '../api/client.js';
import { useUserStore } from '../store/index.js';
import { useTelegram } from '../hooks/useTelegram.js';
import Spinner from '../components/ui/Spinner.jsx';
import styles from './ProfilePage.module.css';

const LOGIN_RE = /^[a-zA-Z0-9_-]{3,20}$/;

export default function ProfilePage() {
  const { user, setUser } = useUserStore();
  const { haptic } = useTelegram();

  const [editingLogin, setEditingLogin] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [login, setLogin] = useState(user?.login || '');
  const [displayName, setDisplayName] = useState(user?.display_name || '');
  const [loginErr, setLoginErr] = useState('');
  const [saving, setSaving] = useState(false);
  const [apiError, setApiError] = useState('');
  const [saved, setSaved] = useState('');

  async function saveLogin() {
    if (!LOGIN_RE.test(login)) {
      setLoginErr('От 3 до 20 символов: латиница, цифры, _ и -');
      haptic?.error();
      return;
    }
    setApiError('');
    setSaving(true);
    try {
      const updated = await api.updateMe({ login: login.toLowerCase() });
      setUser(updated);
      setEditingLogin(false);
      setSaved('Логин сохранён');
      haptic?.success();
      setTimeout(() => setSaved(''), 2500);
    } catch (e) {
      setApiError(e.message);
      haptic?.error();
    } finally {
      setSaving(false);
    }
  }

  async function saveName() {
    setApiError('');
    setSaving(true);
    try {
      const updated = await api.updateMe({ display_name: displayName.trim() || null });
      setUser(updated);
      setEditingName(false);
      setSaved('Имя сохранено');
      haptic?.success();
      setTimeout(() => setSaved(''), 2500);
    } catch (e) {
      setApiError(e.message);
      haptic?.error();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className={styles.page}>
      <h1 className={`${styles.title} font-display`}>Профиль</h1>

      <div className={styles.avatarSection}>
        <div className={styles.avatar}>
          {(user?.display_name || user?.login || '?')[0].toUpperCase()}
        </div>
        <div>
          <div className={styles.displayName}>{user?.display_name || user?.login}</div>
          <div className={styles.tgUsername}>
            {user?.telegram_username ? `@${user.telegram_username}` : 'Telegram'}
          </div>
        </div>
      </div>

      {saved && <div className={styles.successBanner}>{saved}</div>}
      {apiError && <div className={styles.errorBanner}>{apiError}</div>}

      <div className={styles.fields}>
        <div className={styles.fieldBlock}>
          <div className={styles.fieldTop}>
            <span className={styles.fieldLabel}>Логин</span>
            {!editingLogin && (
              <button className={styles.editBtn} onClick={() => { setEditingLogin(true); setLoginErr(''); }}>
                Изменить
              </button>
            )}
          </div>
          {editingLogin ? (
            <div className={styles.editRow}>
              <input
                className={`${styles.input} ${loginErr ? styles.inputError : ''}`}
                value={login}
                onChange={e => { setLogin(e.target.value); setLoginErr(''); }}
                autoCapitalize="none"
                autoCorrect="off"
              />
              <button className={styles.saveBtn} onClick={saveLogin} disabled={saving}>
                {saving ? <Spinner size={16} color="#000" /> : 'Сохранить'}
              </button>
              <button className={styles.cancelBtn} onClick={() => { setEditingLogin(false); setLogin(user?.login || ''); }}>
                ✕
              </button>
            </div>
          ) : (
            <div className={styles.fieldValue}>{user?.login}</div>
          )}
          {loginErr && <p className={styles.errText}>{loginErr}</p>}
        </div>

        <div className={styles.fieldBlock}>
          <div className={styles.fieldTop}>
            <span className={styles.fieldLabel}>Имя</span>
            {!editingName && (
              <button className={styles.editBtn} onClick={() => setEditingName(true)}>
                Изменить
              </button>
            )}
          </div>
          {editingName ? (
            <div className={styles.editRow}>
              <input
                className={styles.input}
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                placeholder="Имя"
              />
              <button className={styles.saveBtn} onClick={saveName} disabled={saving}>
                {saving ? <Spinner size={16} color="#000" /> : 'Сохранить'}
              </button>
              <button className={styles.cancelBtn} onClick={() => { setEditingName(false); setDisplayName(user?.display_name || ''); }}>
                ✕
              </button>
            </div>
          ) : (
            <div className={styles.fieldValue}>{user?.display_name || '—'}</div>
          )}
        </div>

        <div className={styles.fieldBlock}>
          <div className={styles.fieldTop}>
            <span className={styles.fieldLabel}>Telegram</span>
          </div>
          <div className={styles.fieldValue}>
            {user?.telegram_username ? `@${user.telegram_username}` : '—'}
          </div>
        </div>
      </div>
    </div>
  );
}
