import Modal from './Modal';
import Router from 'next/router';
import EditIcon from '@mui/icons-material/Edit';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

import { useState } from 'react';

import styles from '../styles/components/IdeaCard.module.css';

export default function IdeaCard(props) {
  const { title, id } = props;

  const [modalOpen, setModalOpen] = useState(false);

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
      </Modal>
    </>
  );
}
