import { useAuth } from '../hooks/useAuth';
import { useHistory } from 'react-router-dom';
import { FormEvent, useState } from 'react';
import { database } from '../services/firebase';

import { Button } from '../components/Button';
import illustration from '../assets/illustration.svg';
import logo from '../assets/logo.svg';
import googleIcon from '../assets/google-icon.svg';


import '../styles/auth.scss';


export function Home() {
  const history = useHistory()
  const { user, signInWithGoogle } = useAuth()
  const [roomCode, setRoomCode] = useState('')

  const handleCreateRoom = async () => {
    if (!user) {
      await signInWithGoogle()
    }

    history.push('/rooms/new')
  }

  const handleJoinRoom = async (e: FormEvent) => {
    e.preventDefault();

    if (roomCode.trim() === '') {
      return;
    }

    const roomRef = await database.ref(`rooms/${roomCode}`).get();

    if (!roomRef.exists()) {
      alert('Room does not exists.');
      return;
    }

    history.push(`/rooms/${roomCode}`)
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
          <button className="create-room" onClick={handleCreateRoom}>
            <img src={googleIcon} alt="google icon" />
            Crie sua sala com o Google
          </button>
          <div className="separator">ou entre em uma sala</div>
          <form onSubmit={handleJoinRoom}>
            <input 
              type="text"
              placeholder="Digite o código da sala"
              onChange={(e) => setRoomCode(e.target.value)}
              value={roomCode}
            />
            <Button type="submit">
              Entrar na sala
            </Button>
          </form>
        </div>
      </main>
    </div>
  )
}