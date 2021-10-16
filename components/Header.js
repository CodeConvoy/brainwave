import Image from 'next/image';

import { getAuth, signOut } from 'firebase/auth';
import signInWithGoogle from '../util/signInWithGoogle';

import styles from '../styles/components/Header.module.css';

export default function Header(props) {
  const { userData } = props;

  const auth = getAuth();

  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        <Image
          src="/logo.png"
          width="48"
          height="48"
          alt="logo"
        />
      </div>
      <h1>brainwave</h1>
      <span className="flexfill" />
      {
        userData &&
        <p>Signed in as @{userData.username}</p>
      }
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
  );
}
