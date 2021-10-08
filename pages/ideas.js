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
  const db = getFirestore();

  const [title, setTitle] = useState('');

  // get ideas query
  const uid = auth.currentUser?.uid;
  const ideasRef = collection(db, 'ideas');

  // creates a new idea
  async function createIdea() {
    // create document in firebase
    const now = new Date().getTime();
    const docRef = await addDoc(ideasRef, {
      title, creator: uid,
      created: now,
      modified: now,
      sketch: null,
      notes: []
    });
    // go to idea page
    Router.push(`/ideas/${docRef.id}`);
  }

  // return if loading
  if (!uid) {
    return <Loading />;
  }

  return (
    <div className={styles.container}>
      <Ideas />
      <form onSubmit={e => {
        e.preventDefault();
        createIdea();
      }}>
        <input
          placeholder="title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />
        <button>Create Idea</button>
      </form>
      <Link href="/">
        <a className="link">Home</a>
      </Link>
    </div>
  );
}
