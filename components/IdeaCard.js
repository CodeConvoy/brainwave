import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

import styles from '../styles/components/IdeaCard.module.css';

export default function IdeaCard(props) {
  const { title } = props;

  return (
    <Card className={styles.container}>
      <CardContent>
        <p>{title}</p>
      </CardContent>
    </Card>
  );
}
