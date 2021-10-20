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
      <div className={styles.overview}>
        <div className={styles.title}>
          <h1>Brainwave</h1>
          <p>Rich and centralized idea development.</p>
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
        <Image
          src="/img/undraw/creation.svg"
          width="300"
          height="300"
          alt=""
        />
      </div>
      <div className={styles.about}>
        <p>Brainwave aims to make team brainstorming easier.</p>
        <div className={styles.images}>
          <Image
            src="/img/undraw/notes.svg"
            width="300"
            height="300"
            alt=""
          />
          <Image
            src="/img/undraw/idea.svg"
            width="300"
            height="300"
            alt=""
          />
          <Image
            src="/img/undraw/draw.svg"
            width="300"
            height="300"
            alt=""
          />
          <Image
            src="/img/undraw/organize.svg"
            width="300"
            height="300"
            alt=""
          />
        </div>
      </div>
    </div>
  );
}
