import Loading from '../../components/Loading';
import Link from 'next/link';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';

import styles from '../../styles/pages/Idea.module.css';

const canvasSize = 512;

let canvas, ctx;

let sketching = false;

let prevX, prevY;
let currX, currY;

const scrollSpeed = 4;

export default function Idea() {
  const canvasRef = useRef();
  const db = getFirestore();
  const router = useRouter();

  // get idea id
  const { id } = router.query;

  const [canvasX, setCanvasX] = useState(0);
  const [canvasY, setCanvasY] = useState(0);

  const [idea, setIdea] = useState(undefined);

  // retrieves idea from firebase
  async function getIdea() {
    const ideaRef = doc(db, 'ideas', id);
    const ideaDoc = await getDoc(ideaRef);
    setIdea({ ...ideaDoc.data(), id: ideaDoc.id });
  }

  // get idea on start
  useEffect(() => {
    if (id) getIdea();
  }, [id]);

  // called when key is pressed
  function onKeyDown(e) {
    const keyCode = e.keyCode;
    if (keyCode === 37) setCanvasX(oldX => oldX - scrollSpeed); // left
    if (keyCode === 38) setCanvasY(oldY => oldY - scrollSpeed); // up
    if (keyCode === 39) setCanvasX(oldX => oldX + scrollSpeed); // right
    if (keyCode === 40) setCanvasY(oldY => oldY + scrollSpeed); // down
  }

  // on start
  useEffect(() => {
    // get canvas context
    canvas = canvasRef.current;
    ctx = canvas.getContext('2d');
    // set up key listener
    window.addEventListener('keydown', onKeyDown);
    // clean up listeners on return
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  // sketches canvas with given mouse event data
  function sketch(e) {
    // get previous and current mouse positions
    prevX = currX;
    prevY = currY;
    currX = e.clientX - canvas.offsetLeft + window.scrollX;
    currY = e.clientY - canvas.offsetTop + window.scrollY;
  }

  // draws on canvas with current sketch data
  function draw(e) {
    // sketch mouse
    sketch(e);
    // draw stroke
    ctx.beginPath();
    ctx.moveTo(prevX, prevY);
    ctx.lineTo(currX, currY);
    ctx.stroke();
    ctx.closePath();
  }

  }


  return (
    <div className={styles.container}>
      <div className={styles.toolbar}>
        <Link href="/ideas">
          <a className={styles.backlink}>
            <ArrowBackIcon />
          </a>
        </Link>
        <h1>{idea?.title}</h1>
      </div>
      <canvas
        style={{ position: 'relative', left: canvasX, top: canvasY }}
        ref={canvasRef}
        width={canvasSize}
        height={canvasSize}
        onMouseDown={e => { sketching = true; sketch(e); }}
        onMouseMove={e => { if (sketching) draw(e); }}
        onMouseUp={e => { sketching = false; }}
        onMouseLeave={e => { sketching = false; }}
      />
    </div>
  );
}
