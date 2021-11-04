import DeleteIcon from '@mui/icons-material/Delete';

import styles from '../styles/components/Img.module.css';

export default function Img(props) {
  const { url, x, y, id } = props;

  return (
    <div
      className={styles.container}
      style={{ left: x, top: y }}
    >
      <img src={url} />
      <button onClick={deleteImage}>
        <DeleteIcon />
      </button>
    </div>
  );
}
