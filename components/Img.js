import DeleteIcon from '@mui/icons-material/Delete';

import styles from '../styles/components/Img.module.css';

export default function Img(props) {
  const { url, x, y, id } = props;

  // deletes image
  function deleteImage() {
    if (!window.confirm('Delete image?')) return;
    props.removeImage(id);
  }

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
