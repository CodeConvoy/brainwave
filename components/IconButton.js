import styles from '../styles/components/IconButton.module.css';

export default function IconButton(props) {
  return (
    <button>
      {props.children}
    </button>
  );
}
