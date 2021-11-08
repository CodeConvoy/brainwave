import CircularProgress from '@mui/material/CircularProgress';

import styles from '../styles/components/Loading.module.css';

export default function Loading(props) {
  const { background } = props;

  return (
    <div
      className={styles.container}
      style={{ background: background }}
    >
      <CircularProgress />
    </div>
  );
}
