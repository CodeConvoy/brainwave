import MapIcon from '@mui/icons-material/Map';

import { useEffect, useRef, useState } from 'react';

import styles from '../styles/components/Minimap.module.css';

let canvas, ctx;

const width = 256;
const height = 256;

export default function Minimap(props) {
  const { ideaData } = props;

  const canvasRef = useRef();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // get canvas context on start
  useEffect(() => {
    canvas = canvasRef.current;
    ctx = canvas.getContext('2d');
  }, []);

  // clears canvas
  function clearCanvas() {
    ctx.fillStyle = '#fff';
    ctx.rect(0, 0, width, height);
    ctx.fill();
  }

  // update canvas when idea data changes
  useEffect(() => {
    if (ideaData) {
      const sketch = ideaData.sketch;
      // if sketch, load image to canvas
      if (sketch) {
        const image = new Image();
        image.onload = () => {
          ctx.drawImage(image, 0, 0, width, height);
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

  return (
    <div className={styles.container}>
      {
        !open &&
        <button
          onClick={() => setOpen(true)}
        >
          <MapIcon />
        </button>
      }
      <canvas
        style={open ? null : { display: 'none' }}
        onClick={() => setOpen(false)}
        ref={canvasRef}
        width={width}
        height={height}
      />
    </div>
  );
}
