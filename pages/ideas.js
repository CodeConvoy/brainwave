import Loading from '../components/Loading';
import Ideas from '../components/Ideas';
import Router from 'next/router';
import Link from 'next/link';

import { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

import styles from '../styles/pages/Ideas.module.css';

export default function Home() {
  const auth = getAuth();

  // return if loading
  if (!auth.currentUser) {
    return <Loading />;
  }

  return (
    <div className={styles.container}>
      <Ideas />
      <Link href="/">
        <a className="link">Home</a>
      </Link>
    </div>
  );
}
