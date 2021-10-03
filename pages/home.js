import { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs, addDoc } from 'firebase/firestore';

import styles from '../styles/pages/Home.module.css';

export default function Home() {
  const auth = getAuth();
  const db = getFirestore();

  const [ideas, setIdeas] = useState(undefined);
  const [title, setTitle] = useState('');

  // get ideas query
  const uid = auth.currentUser?.uid;
  const ideasRef = collection(db, 'ideas');
  const ideasQuery = query(ideasRef, where('creator', '==', uid ?? 'null'));

  // creates a new idea
  async function createIdea() {
    await addDoc(ideasRef, { title, creator: uid });
  }

  // retrieves ideas from firebase
  async function getIdeas() {
    const ideasDocs = (await getDocs(ideasQuery)).docs;
    setIdeas(ideasDocs.map(ideaDoc => ({ ...ideaDoc.data(), id: ideaDoc.id })));
  }

  return (
    <div>
      <div>
      </div>
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
