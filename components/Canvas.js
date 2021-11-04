import { useEffect, useRef, useState } from 'react';
import { getFirestore, doc, updateDoc, } from 'firebase/firestore';
import { useDocumentData } from 'react-firebase9-hooks/firestore';

let canvas, ctx;
let sketching;

let prevX, prevY;
let currX, currY;

export default function Canvas(props) {
  const { id, container, ideaData, drawColor, drawSize } = props;

  const [loading, setLoading] = useState(true);
  const canvasRef = useRef();

  // listen for idea data
  const db = getFirestore();
  const ideaRef = doc(db, 'ideas', id);

  // get canvas context on start
  useEffect(() => {
    canvas = canvasRef.current;
    ctx = canvas.getContext('2d');
  }, []);

  // update context drawing
  useEffect(() => { ctx.strokeStyle = drawColor; }, [drawColor]);
  useEffect(() => { ctx.lineWidth = drawSize; }, [drawSize]);

  // update canvas when idea data changes
  useEffect(() => {
    if (ideaData) {
      const sketch = ideaData.sketch;
      // if sketch, load image to canvas
      if (sketch) {
        const image = new Image();
        image.onload = () => {
          ctx.drawImage(image, 0, 0);
          setLoading(false);
        }
        image.src = sketch;
      // if no sketch, clear canvas
      } else {
        clearCanvas();
        setLoading(false);
      }
    }
  }, [ideaData]);

  // downloads canvas as a png
  function downloadCanvas() {
    // get canvas object url
    canvas.toBlob(blob => {
      const url = URL.createObjectURL(blob);
      // download from link element
      const link = document.createElement('a');
      link.download = 'idea.png';
      link.href = url;
      link.click();
    });
  }

  // saves canvas as data url
  async function saveCanvas() {
    // save to firebase
    const sketch = canvas.toDataURL();
    await updateDoc(ideaRef, {
      sketch: sketch,
      modified: new Date().getTime()
    });
  }

  // gets previous and current mouse positions
  function sketch(e) {
    prevX = currX;
    prevY = currY;
    currX = e.clientX - canvas.offsetLeft + container.scrollLeft;
    currY = e.clientY - canvas.offsetTop + container.scrollTop;
  }

  // ends sketching
  function endSketch() {
    if (!sketching) return;
    sketching = false;
    saveCanvas();
  }

  // draws on canvas with current sketch data
  function draw(e) {
    sketch(e);
    // draw stroke
    ctx.beginPath();
    ctx.moveTo(prevX, prevY);
    ctx.lineTo(currX, currY);
    ctx.stroke();
    ctx.closePath();
  }

  // clears canvas
  function clearCanvas() {
    ctx.fillStyle = '#fff';
    ctx.rect(0, 0, ideaData.pixels, ideaData.pixels);
    ctx.fill();
    saveCanvas();
  }

  return (
    <canvas
      style={loading ? { display: 'none' } : null}
      ref={canvasRef}
      width={ideaData?.pixels}
      height={ideaData?.pixels}
      onMouseDown={e => { sketching = true; sketch(e); }}
      onMouseMove={e => { if (sketching) draw(e); }}
      onMouseUp={endSketch}
      onMouseLeave={endSketch}
    />
  );
}
