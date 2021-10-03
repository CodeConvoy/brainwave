import styles from '../styles/components/IdeaCard.module.css';

export default function IdeaCard(props) {
  const { title } = props;

  return (
    <div>
      <p>{title}</p>
    </div>
  );
}
