import Router from 'next/router';
import Modal from './Modal';
import Loading from './Loading';
import IdeaCard from '../components/IdeaCard';
import AddIcon from '@mui/icons-material/Add';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

import { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import {
  getFirestore, orderBy, collection, query, where, getDocs, addDoc
} from 'firebase/firestore';

import styles from '../styles/components/Ideas.module.css';

export default function Ideas() {
  const auth = getAuth();
  const db = getFirestore();

  const [ideas, setIdeas] = useState(undefined);

  const [modalOpen, setModalOpen] = useState(false);

  // get ideas query
  const uid = auth.currentUser.uid;
  const ideasRef = collection(db, 'ideas');
  const ideasQuery = query(
    ideasRef, orderBy('modified', 'desc'), where('creator', '==', uid)
  );

  const [title, setTitle] = useState('');

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

  // retrieves ideas from firebase
  async function getIdeas() {
    const ideasDocs = (await getDocs(ideasQuery)).docs;
    setIdeas(ideasDocs.map(ideaDoc => ({ ...ideaDoc.data(), id: ideaDoc.id })));
  }

  // get ideas on start
  useEffect(() => {
    getIdeas();
  }, [uid]);

  // return if loading
  if (!ideas) {
    return <Loading />;
  }

  return (
    <div className={styles.container}>
      {
        !ideas.length ?
        <p>No ideas yet</p> :
        ideas.map((idea, i) =>
          <IdeaCard {...idea} key={i} />
        )
      }
      <Card
        className={styles.createcard}
        onClick={() => setModalOpen(true)}
      >
        <CardContent>
          <AddIcon />
        </CardContent>
      </Card>
      <Modal open={modalOpen} setOpen={setModalOpen}>
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
      </Modal>
    </div>
  );
}
