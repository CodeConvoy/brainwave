import Loading from './Loading';
import IdeaCard from '../components/IdeaCard';

import { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';

import styles from '../styles/components/Ideas.module.css';

export default function Ideas() {
  const auth = getAuth();
  const db = getFirestore();

  const [ideas, setIdeas] = useState(undefined);

  // get ideas query
  const uid = auth.currentUser.uid;
  const ideasRef = collection(db, 'ideas');
  const ideasQuery = query(ideasRef, where('creator', '==', uid));

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
        ideas.map((idea, i) =>
          <IdeaCard {...idea} key={i} />
        )
      }
    </div>
  );
}
