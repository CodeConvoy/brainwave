import styles from '../../pages/Idea.module.css';

export default function Idea() {
  // get idea id
  const { id } = router.query;

  const [idea, setIdea] = useState(undefined);

  return (
    <div>
      <h1>{idea.title}</h1>
    </div>
  );
}
