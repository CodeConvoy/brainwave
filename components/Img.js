export default function Img(props) {
  const { url, x, y } = props;

  return (
    <img
      src={url}
      style={{ left: x, top: y }}
    />
  );
}
