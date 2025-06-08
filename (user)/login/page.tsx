// frontend/src/app/(user)/login/page.tsx
import React from 'react';
import styles from './login.module.css';

export default function LoginPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Login</h1>
      <input className={styles.input} type="text" placeholder="Username" />
      <input className={styles.input} type="password" placeholder="Password" />
      <button className={styles.button}>Login</button>
    </div>
  );
}
