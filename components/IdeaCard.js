import Modal from './Modal';
import Router from 'next/router';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

import { getFirestore, doc, deleteDoc } from 'firebase/firestore';
import { useState } from 'react';

import styles from '../styles/components/IdeaCard.module.css';

export default function IdeaCard(props) {
  const { title, id } = props;

  const db = getFirestore();

  const [modalOpen, setModalOpen] = useState(false);

  // deletes idea from firebase
  async function deleteIdea() {
    if (!window.confirm('Delete idea?')) return;
    await deleteDoc(doc(db, 'ideas', id));
  }

  return (
    <>
      <Card
        className={styles.container}
        onClick={() => Router.push(`ideas/${id}`)}
      >
        <CardContent>
          <button
            className={styles.editbutton}
            onClick={e => {
              e.stopPropagation();
              setModalOpen(true);
            }}
          >
            <EditIcon />
          </button>
          <p>{title}</p>
        </CardContent>
      </Card>
      <Modal open={modalOpen} setOpen={setModalOpen}>
        <h1>Editing {title}</h1>
        <form onSubmit={e => {
          e.preventDefault();
          updateIdea();
        }}>
          <div className="input-button">
            <input
              placeholder="title"
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              required
            />
            <button>
              <AddIcon />
            </button>
          </div>
        </form>
        <button onClick={deleteIdea}>
          <DeleteIcon />
        </button>
      </Modal>
    </>
  );
}
