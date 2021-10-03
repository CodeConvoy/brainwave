import Loading from '../../components/Loading';
import Link from 'next/link';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import styles from '../../styles/pages/Idea.module.css';

const canvasSize = 512;

export default function Idea() {
  const db = getFirestore();
  const router = useRouter();

  // get idea id
  const { id } = router.query;

  const [idea, setIdea] = useState(undefined);

  // retrieves idea from firebase
  async function getIdea() {
    const ideaRef = doc(db, 'ideas', id);
    const ideaDoc = await getDoc(ideaRef);
    setIdea({ ...ideaDoc.data(), id: ideaDoc.id });
  }

  // get idea on start
  useEffect(() => {
    if (id) getIdea();
  }, [id]);

  // return if loading
  if (!idea) {
    return <Loading />;
  }

  return (
    <div className={styles.container}>
      <Link href="/ideas">
        <a className={styles.backlink}>
          <ArrowBackIcon />
        </a>
      </Link>
      <h1>{idea.title}</h1>
      <canvas width={canvasSize} height={canvasSize} />
    </div>
  );
}
