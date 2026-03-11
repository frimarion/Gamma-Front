import { useState } from 'react';
import { api } from '../api/client.js';
import { useUserStore } from '../store/index.js';
import { useTelegram } from '../hooks/useTelegram.js';
import Spinner from '../components/ui/Spinner.jsx';
import styles from './RegisterPage.module.css';

const LOGIN_RE = /^[a-zA-Z0-9_-]{3,20}$/;

export default function RegisterPage() {
  const { user: tgUser, haptic } = useTelegram();
  const { setUser } = useUserStore();

  const [login, setLogin] = useState('');
  const [displayName, setDisplayName] = useState(tgUser?.first_name || '');
  const [loginErr, setLoginErr] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');

  function validateLogin(val) {
    if (!val) return 'Логин обязателен';
    if (!LOGIN_RE.test(val)) return 'От 3 до 20 символов: латиница, цифры, _ и -';
    return '';
  }

  async function handleSubmit() {
    const err = validateLogin(login);
    if (err) {
      setLoginErr(err);
      haptic?.error();
      return;
    }
    setApiError('');
    setSubmitting(true);
    try {
      const user = await api.register({ login: login.toLowerCase(), display_name: displayName.trim() || null });
      haptic?.success();
      setUser(user);
    } catch (e) {
      setApiError(e.message);
      haptic?.error();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <div className={styles.icon}>🍽</div>
        <h1 className={`${styles.title} font-display`}>Добро<br />пожаловать</h1>
        <p className={styles.subtitle}>Придумайте логин для оформления заказов</p>

        <div className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>Логин <span className={styles.req}>*</span></label>
            <input
              className={`${styles.input} ${loginErr ? styles.inputError : ''}`}
              type="text"
              placeholder="maks_z"
              value={login}
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              onChange={e => {
                setLogin(e.target.value);
                if (loginErr) setLoginErr('');
              }}
              onBlur={() => setLoginErr(validateLogin(login))}
            />
            {loginErr && <p className={styles.errText}>{loginErr}</p>}
            <p className={styles.hint}>Латиница, цифры, _ и — от 3 до 20 символов</p>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Имя <span className={styles.opt}>(необязательно)</span></label>
            <input
              className={styles.input}
              type="text"
              placeholder="Александр"
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
            />
          </div>

          {apiError && <p className={styles.apiError}>{apiError}</p>}

          <button
            className={styles.submitBtn}
            onClick={handleSubmit}
            disabled={submitting || !login}
          >
            {submitting ? <Spinner size={20} color="#000" /> : 'Начать'}
          </button>
        </div>
      </div>
    </div>
  );
}
