import { useRef, useState } from 'react';

const width = 256;
const height = 256;

export default function Minimap(props) {
  const { ideaData } = props;

  const canvasRef = useRef();

  const [open, setOpen] = useState(false);

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

  return (
    <div>
      {
        !open &&
        <button
          onClick={() => setOpen(true)}
        >
          <MapIcon />
        </button>
      }
      <canvas
        onClick={() => setOpen(false)}
        ref={canvasRef}
        width={width}
        height={height}
      />
    </div>
  );
}
