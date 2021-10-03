import Link from 'next/link';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

import styles from '../styles/components/IdeaCard.module.css';

export default function IdeaCard(props) {
  const { title, id } = props;

  return (
    <Link href={`/ideas/${id}`}>
      <a className={styles.container}>
        <Card>
          <CardContent>
            <p>{title}</p>
          </CardContent>
        </Card>
      </a>
    </Link>
  );
}
