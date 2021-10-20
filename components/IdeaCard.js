import Router from 'next/router';
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
        <p>{title}</p>
      </CardContent>
    </Card>
  );
}
