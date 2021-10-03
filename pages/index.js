import Link from 'next/link';
import Image from 'next/image';

import { getAuth, signOut } from 'firebase/auth';
import signInWithGoogle from '../util/signInWithGoogle';

import styles from '../styles/pages/Index.module.css';

export default function Index() {
  const auth = getAuth();

  return (
    <div className={styles.container}>
      <div className={styles.center}>
        <h1><Image src="/logo.png" width="48" height="48" /> BRAINWAVE</h1>
        {
          auth.currentUser ?
          <button onClick={() => signOut(auth)}>
            Sign Out
          </button> :
          <button onClick={signInWithGoogle}>
            Sign in with Google
          </button>
        }
        {
          auth.currentUser &&
          <Link href="/ideas">
            <a>Ideas</a>
          </Link>
        }
      </div>
    </div>
  );
}
