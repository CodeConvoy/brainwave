import { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, doc } from 'firebase/firestore';
import { useDocument } from 'react-firebase9-hooks/firestore';

function MainAuthed(props) {
  const { Component, pageProps } = props;

  const db = getFirestore();
  const auth = getAuth();

  // get user doc
  const uid = auth.currentUser.uid;
  const usersRef = collection(db, 'users');
  const userRef = doc(db, 'users', uid);
  const [userDoc] = useDocument(userRef);

  // get user data
  const userData = !userDoc ? undefined :
  userDoc.exists() ? userDoc.data() : null;

  return <Component authed={true} userData={userData} {...pageProps} />;
}

export default function Main(props) {
  const { Component, pageProps } = props;

  const auth = getAuth();

  const [authed, setAuthed] = useState(undefined);

  // listen for user auth
  useEffect(() => {
    const authListener = auth.onAuthStateChanged(() => {
      setAuthed(!!auth.currentUser);
    });
    return () => authListener();
  }, []);

  return (
    authed ?
    <MainAuthed {...props} /> :
    <Component authed={authed} {...pageProps} />
  );
}
