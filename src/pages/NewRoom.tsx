import { FormEvent, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link, useHistory } from 'react-router-dom';

import { database } from '../services/firebase';
import { Button } from '../components/Button';
import illustration from '../assets/illustration.svg';
import logo from '../assets/logo.svg';

import '../styles/auth.scss';

export function NewRoom() {
  const { user } = useAuth()
  const history = useHistory();
  const [newRoom, setNewRoom] = useState('')

  const handleCreateRoom = async (e: FormEvent) => {
    e.preventDefault();

    if (newRoom.trim() === '') {
      return;
    }

    const roomRef = database.ref('rooms');

    const firebaseRoom = await roomRef.push({
      title: newRoom,
      authorId: user?.id,
    })

    history.push(`/rooms/${firebaseRoom.key}`)
  }

  return (
    <div id="page-auth">
      <aside>
        <img src={illustration} alt="illustration" />
        <strong>Crie salas de Q&amp;A ao vivo</strong>
        <p>Tire as dúvidas da sua audiência em tempo real</p>
      </aside>
      <main>
        <div className="main-content">
          <img src={logo} alt="logo" />
          <h2>Criar uma nova sala</h2>
          <form onSubmit={handleCreateRoom}>
            <input 
              type="text"
              placeholder="Nome da sala"
              onChange={(e) => setNewRoom(e.target.value)}
              value={newRoom}
            />
            <Button type="submit">
              Criar sala
            </Button>
          </form>
          <p>
            Quer entrar em uma sala existente? <Link to="/">clique aqui</Link>
          </p>
        </div>
      </main>
    </div>
  )
}