import Loading from '../components/Loading';
import Ideas from '../components/Ideas';

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
    await addDoc(ideasRef, { title, creator: uid });
  }

  // return if loading
  if (!uid) {
    return <Loading />;
  }

  return (
    <div>
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
    </div>
  );
}
