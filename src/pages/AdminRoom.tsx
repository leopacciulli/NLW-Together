import logoImg from '../assets/logo.svg';
import deleteImg from '../assets/delete.svg';

import { Button } from '../components/Button';
import { RoomCode } from '../components/RoomCode';
import { useAuth } from '../hooks/useAuth';
import { database } from '../services/firebase';
import { Question } from '../components/Question';
import { useRoom } from '../hooks/useRoom';
import { useHistory, useParams } from 'react-router';

import '../styles/room.scss';

type RoomParams = {
  id: string
}

export function AdminRoom() {
  const history = useHistory()
  const { user } = useAuth()
  const params = useParams<RoomParams>();
  const roomId = params.id;
  const { title, questions } = useRoom(roomId)

  const handleDelete = async (questionId: string) => {
    if (window.confirm('Tem certeza que deseja excluir?')) {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
    }
  }

  const handleEndRoom = async () => {
    database.ref(`rooms/${roomId}`).update({
      endAt: new Date()
    })

    history.push('/')
  }

  return (
    <div id="page-room">
      <header className="content">
        <img src={logoImg} alt="Logo" />
        <div>
          <RoomCode code={roomId} />
          <Button onClick={handleEndRoom}>Encerrar sala</Button>
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          {questions.length > 0 &&
            <span>{questions.length} pergunta(s)</span>
          }
        </div>

        <div className="question-list">
          {questions.map((question) => (
            <Question 
              key={question.id}
              content={question.content}
              author={question.author}
            >
              <button
                type="button"
                onClick={() => handleDelete(question.id)}
              >
                <img src={deleteImg} alt="Delete" />
              </button>
            </Question>
          ))}
        </div>
      </main>
    </div>
  )
}