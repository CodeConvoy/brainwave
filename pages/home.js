import { useState } from 'react';

import styles from '../styles/pages/Home.module.css';

export default function Home() {
  const [title, setTitle] = useState('');

  const ideasRef = collection(db, 'ideas');

  // creates a new idea
  async function createIdea() {
    await addDoc(ideasRef, { title, creator: uid });
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
