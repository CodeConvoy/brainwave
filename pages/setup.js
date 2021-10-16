import { useState } from 'react';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore';

import styles from '../styles/pages/Setup.module.css';

export default function Setup() {
  const [username, setUsername] = useState('');

  const db = getFirestore();
  const auth = getAuth();

  const usersRef = collection(db, 'users');

  // attempts to create user
  async function createUser() {
    const uid = auth.currentUser.uid;
    setDoc(doc(usersRef, uid), { username });
  }

  return (
    <div className={styles.container}>
      <div className={styles.center}>
        <h1>New User</h1>
        <form onSubmit={e => {
          e.preventDefault();
          createUser();
        }}>
          <input
            placeholder="username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
          <button>Create User</button>
        </form>
      </div>
    </div>
  );
}
