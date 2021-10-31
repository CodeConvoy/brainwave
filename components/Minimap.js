import { useRef, useState } from 'react';

const width = 256;
const height = 256;

export default function Minimap() {
  const canvasRef = useRef();

  const [open, setOpen] = useState(false);

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
