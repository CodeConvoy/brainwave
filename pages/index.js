import Image from 'next/image';

import { getAuth, signOut } from 'firebase/auth';
import signInWithGoogle from '../util/signInWithGoogle';

import styles from '../styles/Index.module.css';

export default function Index() {
  const auth = getAuth();

  return (
    <div>
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
    </div>
  );
}
