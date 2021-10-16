import { useState } from 'react';

import styles from '../styles/pages/Setup.module.css';

export default function Setup() {
  const [username, setUsername] = useState('');

  return (
    <div>
      <form onSubmit={e => {
        e.preventDefault();
        createUser();
      }}>
        <input
          placeholder="username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />
        <button>Create User</button>
      </form>
    </div>
  );
}
