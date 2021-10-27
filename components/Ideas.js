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
import { useCollectionData } from 'react-firebase9-hooks/firestore';

import styles from '../styles/components/Ideas.module.css';

export default function Ideas(props) {
  const auth = getAuth();
  const db = getFirestore();

  const [modalOpen, setModalOpen] = useState(false);

  // get ideas query
  const uid = auth.currentUser.uid;
  const ideasRef = collection(db, 'ideas');
  const ideasQuery = query(
    ideasRef,
    orderBy('modified', 'desc'),
    where('members', 'array-contains', uid)
  );
  const [ideas] = useCollectionData(ideasQuery, { idField: 'id' });

  const [title, setTitle] = useState('');

  // creates a new idea
  async function createIdea() {
    // create document in firebase
    const now = new Date().getTime();
    const docRef = await addDoc(ideasRef, {
      title: title,
      creator: uid,
      members: [uid],
      memberData: [
        { uid, username: props.userData.username }
      ],
      created: now,
      modified: now,
      sketch: null,
      notes: []
    });
    // go to idea page
    Router.push(`/ideas/${docRef.id}`);
  }

  // return if loading
  if (!ideas) {
    return <Loading />;
  }

  return (
    <div className={styles.container}>
      {
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
        <h1>New Idea</h1>
        <form onSubmit={e => {
          e.preventDefault();
          createIdea();
        }}>
          <div className="input-button">
            <input
              className="grayinput"
              placeholder="title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
            />
            <button className="iconbutton">
              <AddIcon />
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
