import Header from '../components/Header';
import Loading from '../components/Loading';
import Ideas from '../components/Ideas';
import Router from 'next/router';
import Link from 'next/link';

import { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

import styles from '../styles/pages/Ideas.module.css';

export default function Home(props) {
  const { authed, userData } = props;

  // redirect based on auth
  useEffect(() => {
    if (authed === false) Router.replace('/');
    if (userData === null) Router.replace('/setup');
  }, [authed, userData]);

  // load if no user data
  if (!userData) return <Loading background="var(--gray)" />;

  return (
    <div className={styles.container}>
      <Header userData={userData} />
      <Ideas userData={userData} />
    </div>
  );
}
