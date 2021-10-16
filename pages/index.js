import Header from '../components/Header';
import Link from 'next/link';
import Image from 'next/image';

import { getAuth, signOut } from 'firebase/auth';
import signInWithGoogle from '../util/signInWithGoogle';

import styles from '../styles/pages/Index.module.css';

export default function Index(props) {
  const { authed, userData } = props;

  const auth = getAuth();

  return (
    <div className={styles.container}>
      <Header userData={userData} />
      <div className={styles.center}>
        <h1><Image src="/logo.png" width="48" height="48" /> brainwave</h1>
        {
          auth.currentUser ?
          <button className="outlinebtn" onClick={() => signOut(auth)}>
            Sign Out
          </button> :
          <button className="outlinebtn" onClick={signInWithGoogle}>
            Sign in with Google
          </button>
        }
      </div>
    </div>
  );
}
