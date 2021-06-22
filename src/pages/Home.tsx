import { useAuth } from '../hooks/useAuth';
import { useHistory } from 'react-router-dom';

import { Button } from '../components/Button';
import illustration from '../assets/illustration.svg';
import logo from '../assets/logo.svg';
import googleIcon from '../assets/google-icon.svg';


import '../styles/auth.scss';

export function Home() {
  const history = useHistory()
  const { user, signInWithGoogle } = useAuth()

  const handleCreateRoom = async () => {
    if (!user) {
      await signInWithGoogle()
    }

    history.push('/rooms/new')
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
          <form>
            <input 
              type="text"
              placeholder="Digite o código da sala"
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