import Router from 'next/router';
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
            <button
              className="outlinebtn"
              onClick={() => Router.push('/ideas')}
            >
              Ideas
            </button> :
            <button
              className="outlinebtn"
              onClick={signInWithGoogle}
            >
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
      <div className={styles.demo}>
        <p>Brainwave aims to make team brainstorming easier.</p>
        <Link href="/ideas">
          <a>
            <Image
              src="/img/demo.png"
              width="700"
              height="380"
              alt=""
            />
          </a>
        </Link>
      </div>
      <div className={styles.about}>
        <div className={styles.images}>
          <div>
            <p>Make notes and upload images.</p>
            <Image
              src="/img/undraw/notes.svg"
              width="300"
              height="300"
              alt=""
            />
          </div>
          <div>
            <p>Ideate together on an unbounded platform.</p>
            <Image
              src="/img/undraw/idea.svg"
              width="300"
              height="300"
              alt=""
            />
          </div>
          <div>
            <p>Sketch synchronously with your team.</p>
            <Image
              src="/img/undraw/draw.svg"
              width="300"
              height="300"
              alt=""
            />
          </div>
          <div>
            <p>Keep all of your ideas in one place.</p>
            <Image
              src="/img/undraw/organize.svg"
              width="300"
              height="300"
              alt=""
            />
          </div>
        </div>
      </div>
      <div className={styles.footer}>
        <p>
          &copy;{' '}
          <a href="https://codeconvoy.org">CodeConvoy</a>
          {' '}{new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
