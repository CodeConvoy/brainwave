import styles from '../styles/components/Img.module.css';

export default function Img(props) {
  const { url, x, y } = props;

  return (
    <img
      className={styles.container}
      src={url}
      style={{ left: x, top: y }}
    />
  );
}
