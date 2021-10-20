import styles from '../styles/components/IconButton.module.css';

export default function IconButton(props) {
  const { className, onClick } = props;

  return (
    <button
      className={
        className ? `${styles.container} ${className}` : styles.container
      }
      onClick={onClick}
    >
      {props.children}
    </button>
  );
}
