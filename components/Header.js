import Image from 'next/image';

import styles from '../styles/components/Header.module.css';

export default function Header() {
  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        <Image
          src="/logo.png"
          width="48"
          height="48"
          alt="logo"
        />
      </div>
      <h1>brainwave</h1>
    </div>
  );
}
