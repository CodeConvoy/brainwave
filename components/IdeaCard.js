import Modal from './Modal';
import Loading from './Loading';
import Router from 'next/router';
import EditIcon from '@mui/icons-material/Edit';
import GroupIcon from '@mui/icons-material/Group';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

import { getAuth } from 'firebase/auth';
import {
  getFirestore, doc, deleteDoc, updateDoc, arrayUnion, arrayRemove,
  collection, query, where, limit, getDocs
} from 'firebase/firestore';
import { useState } from 'react';

import styles from '../styles/components/IdeaCard.module.css';

export default function IdeaCard(props) {
  const { id, title, members, creator, memberData } = props;

  const db = getFirestore();
  const auth = getAuth();
  const uid = auth.currentUser.uid;

  const ideaDoc = doc(db, 'ideas', id);

  const [tab, setTab] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const [username, setUsername] = useState('');
  const [foundUsers, setFoundUsers] = useState(null);

  // updates idea in firebase
  async function updateIdea() {
    await updateDoc(ideaDoc, {
      title: newTitle
    });
  }

  // deletes idea from firebase
  async function deleteIdea() {
    if (!window.confirm('Delete idea?')) return;
    await deleteDoc(ideaDoc);
  }

  // adds given user to idea
  async function addMember(user) {
    await updateDoc(ideaDoc, {
      members: arrayUnion(user.uid),
      memberData: arrayUnion({ uid: user.uid, username: user.username })
    });
  }

  // removes given user from idea
  async function removeMember(user) {
    if (!window.confirm(`Remove ${user.username} from ${title}?`)) return;
    await updateDoc(ideaDoc, {
      members: arrayRemove(user.uid),
      memberData: arrayRemove(user)
    });
  }

  // searches users with given username
  async function searchUsers() {
    setFoundUsers(undefined);
    const usersRef = collection(db, 'users');
    const usersQuery = query(
      usersRef,
      where('usernameLower', '>=', username.toLowerCase()),
      where('usernameLower', '<', `${username.toLowerCase()}~`),
      limit(10)
    );
    const users = await getDocs(usersQuery);
    setFoundUsers(users.docs.map(doc => doc.data()));
  }

  // resets modal
  function resetModal() {
    setFoundUsers(null);
    setNewTitle(title);
    setUsername('');
  }

  return (
    <>
      <Card
        className={styles.container}
        onClick={() => Router.push(`ideas/${id}`)}
      >
        <CardContent>
          {
            uid === creator &&
            <button
              className={styles.editbutton}
              onClick={e => {
                e.stopPropagation();
                resetModal();
                setModalOpen(true);
              }}
            >
              <EditIcon />
            </button>
          }
          <p>{title}</p>
        </CardContent>
      </Card>
      <Modal open={modalOpen} setOpen={setModalOpen}>
        <h1>Editing {title}</h1>
        <div className={styles.tabs}>
          <button className="iconbutton" onClick={() => setTab(0)}>
            <EditIcon />
          </button>
          <button className="iconbutton" onClick={() => setTab(1)}>
            <GroupIcon />
          </button>
          <button className="iconbutton" onClick={deleteIdea}>
            <DeleteIcon />
          </button>
        </div>
        {
          tab === 0 &&
          <div>
            <form onSubmit={e => {
              e.preventDefault();
              updateIdea();
            }}>
              <div className="input-button">
                <input
                  className="grayinput"
                  placeholder="title"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  required
                />
                <button className="iconbutton">
                  <AddIcon />
                </button>
              </div>
            </form>
          </div>
        }
        {
          tab === 1 &&
          <div>
            {
              memberData.map(member =>
                <div className={styles.user} key={member.uid}>
                  <span>{member.username}</span>
                  {
                    member.uid !== creator &&
                    <button onClick={() => removeMember(member)}>
                      <RemoveIcon />
                    </button>
                  }
                </div>
              )
            }
            <form onSubmit={e => {
              e.preventDefault();
              searchUsers();
            }}>
              <div className="input-button">
                <input
                  className="grayinput"
                  placeholder="username"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  required
                />
                <button className="iconbutton">
                  <SearchIcon />
                </button>
              </div>
            </form>
            {
              foundUsers === undefined ?
              <Loading /> :
              foundUsers &&
              (
                foundUsers.length ?
                foundUsers.map(user =>
                  <div className={styles.user} key={user.uid}>
                    <span>{user.username}</span>
                    {
                      !members.includes(user.uid) &&
                      <button onClick={() => addMember(user)}>
                        <AddIcon />
                      </button>
                    }
                  </div>
                ) :
                <div>No users found</div>
              )
            }
          </div>
        }
      </Modal>
    </>
  );
}
