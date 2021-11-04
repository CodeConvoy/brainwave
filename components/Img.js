import DeleteIcon from '@mui/icons-material/Delete';

import { useEffect, useRef } from 'react';

import styles from '../styles/components/Img.module.css';

let dragging = false;

let offsetX, offsetY;

export default function Img(props) {
  const { url, container, id } = props;

  const imageRef = useRef();

  // deletes image
  function deleteImage() {
    if (!window.confirm('Delete image?')) return;
    props.removeImage(id);
  }

  // sets image hold offset
  function setOffset(e) {
    // get image target
    const image = imageRef.current;
    // get image offset
    const x = e.clientX + container.scrollLeft;
    const y = e.clientY + container.scrollTop;
    const imageX = parseInt(image.style.left);
    const imageY = parseInt(image.style.top);
    offsetX = x - imageX;
    offsetY = y - imageY;
  }

  // moves image with given mouse data
  function move(e) {
    // get image target
    const image = imageRef.current;
    // get mouse position
    const x = e.clientX + container.scrollLeft;
    const y = e.clientY + container.scrollTop;
    // set target position
    image.style.left = `${x - offsetX}px`;
    image.style.top = `${y - offsetY}px`;
  }

  // saves image
  function saveImage() {
    // get image target
    const image = imageRef.current;
    // get image position
    const x = parseInt(image.style.left);
    const y = parseInt(image.style.top);
    // return if image not dirty
    if (props.x === x && props.y === y) return;
    // save image
    props.saveImage({ x, y, url, id }, id);
  }

  // ends dragging
  function endDrag(e) {
    if (!dragging) return;
    dragging = false;
    saveImage(e);
  }

  // on start
  useEffect(() => {
    // get image target
    const image = imageRef.current;
    // set image position
    image.style.left = `${props.x}px`;
    image.style.top = `${props.y}px`;
  }, []);

  return (
    <div
      ref={imageRef}
      className={styles.container}
      onMouseDown={e => { dragging = true; setOffset(e); }}
      onMouseMove={e => { if (dragging) move(e); }}
      onMouseUp={endDrag}
      onMouseLeave={endDrag}
    >
      <img src={url} draggable="false" alt={url} />
      <button onClick={deleteImage}>
        <DeleteIcon />
      </button>
    </div>
  );
}
