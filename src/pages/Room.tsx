import logoImg from '../assets/logo.svg';
import { useParams } from 'react-router';
import { Button } from '../components/Button';
import { RoomCode } from '../components/RoomCode';
import { FormEvent, useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { database } from '../services/firebase';

import '../styles/room.scss';

type FirebaseQuestions = Record<string, {
  author: {
    name: string
    avatar: string
  },
  content: string
  isAnswered: string
  isHighlighted: boolean
}>

type RoomParams = {
  id: string
}

type Question = {
  id: string
  author: {
    name: string
    avatar: string
  },
  content: string
  isAnswered: string
  isHighlighted: boolean
}

export function Room() {
  const { user } = useAuth()
  const [newQuestion, setNewQuestion] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [title, setTitle] = useState('');
  const params = useParams<RoomParams>();
  const roomId = params.id;

  useEffect(() => {
    const roomRef = database.ref(`rooms/${roomId}`);

    roomRef.on('value', room => {
      const databaseRoom = room.val();
      const firebaseQuestions: FirebaseQuestions = databaseRoom.questions ?? {};

      const parsedQuestions = Object.entries(firebaseQuestions).map(([key, value]) => {
        return {
          id: key,
          content: value.content,
          author: value.author,
          isHighlighted: value.isHighlighted,
          isAnswered: value.isAnswered,
        }
      });

      setTitle(databaseRoom.title)
      setQuestions(parsedQuestions)
    })
  }, [roomId])

  const handleCreateQuestion = async (e: FormEvent) => {
    e.preventDefault();
    if (newQuestion.trim() === '') {
      return;
    }

    if (!user) {
      throw new Error('No User');
    }

    const question = {
      content: newQuestion,
      author: {
        name: user.name,
        avatar: user.avatar
      },
      isHighlighted: false,
      isAnswered: false
    }

    await database.ref(`rooms/${roomId}/questions`).push(question)

    setNewQuestion('');
  }

  return (
    <div id="page-room">
      <header className="content">
        <img src={logoImg} alt="Logo" />
        <RoomCode code={roomId} />
      </header>

      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          {questions.length > 0 &&
            <span>{questions.length} pergunta(s)</span>
          }
        </div>

        <form onSubmit={handleCreateQuestion}>
          <textarea 
            placeholder="O que você quer perguntar?"
            onChange={(e) => setNewQuestion(e.target.value)}
            value={newQuestion}
          />

          <div className="form-footer">
            {user
              ? <div className="user-info">
                <img src={user.avatar} alt="Avatar" />
                <span>{user.name}</span>
              </div>
              : <span>Para enviar uma pergunta, <button>faça seu login</button></span>
            }
            <Button type="submit" disabled={!user}>Enviar pergunta</Button>
          </div>
        </form>

        {JSON.stringify(questions)}
      </main>
    </div>
  )
}