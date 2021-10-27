import Link from 'next/link';
import Image from 'next/image';

import { getAuth, signOut } from 'firebase/auth';
import signInWithGoogle from '../util/signInWithGoogle';

import styles from '../styles/components/Header.module.css';

export default function Header(props) {
  const { userData } = props;

  const auth = getAuth();

  return (
    <div className={styles.container}>
      <Link href="/">
        <a className={styles.logo}>
          <div>
            <Image
              src="/img/logo.png"
              width="48"
              height="48"
              alt="logo"
            />
          </div>
          <h1>
            brain
            <span style={{ color: 'var(--blue)' }}>wave</span>
          </h1>
        </a>
      </Link>
      <span className="flexfill" />
      {
        auth.currentUser &&
        <>
          <Link href="/">
            <a className={styles.link}>Home</a>
          </Link>
          <Link href="/ideas">
            <a className={styles.link}>Ideas</a>
          </Link>
        </>
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
