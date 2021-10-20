import Router from 'next/router';
import EditIcon from '@mui/icons-material/Edit';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

import styles from '../styles/components/IdeaCard.module.css';

export default function IdeaCard(props) {
  const { title, id } = props;

  return (
    <Card
      className={styles.container}
      onClick={() => Router.push(`ideas/${id}`)}
    >
      <CardContent>
        <button
          className={styles.editbutton}
          onClick={e => e.stopPropagation()}
        >
          <EditIcon />
        </button>
        <p>{title}</p>
      </CardContent>
    </Card>
  );
}
