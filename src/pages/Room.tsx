import { child, push, ref, update } from '@firebase/database';
import { useState, FormEvent } from 'react';
import { useParams } from 'react-router-dom'

import logoImg from '../assets/images/logo.svg';
import { Button } from '../components/Button';
import { RoomCode } from '../components/RoomCode';
import { useAuth } from '../hooks/useAuth';
import { database } from '../services/firebase';

import '../styles/room.scss'

type ParamsProps = {
    id: string
}

export function Room() {

    const { user } = useAuth();

    const params = useParams<ParamsProps>()
    const [newQuestion, setNewQuestion] = useState('');

    const roomId = params.id

    async function handleSendNewQuestion(event: FormEvent) {
        event.preventDefault();

        if(newQuestion.trim() === '') {
            return;
        }

        if(!user) {
            throw new Error("You must be logged in");
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

        const roomRef = ref(database);

        const newPostKey = push(child(roomRef, `rooms/${roomId}/questions`)).key;

        const updates = {} as any;

        updates[`rooms/${roomId}/questions/` + newPostKey] = question;

        await update(roomRef, updates);

        setNewQuestion('');
    }


    return (
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logoImg} alt='Letmeask' />
                    <RoomCode code={roomId} />
                </div>
            </header>
            
            <main>
                <div className="room-title">
                    <h1>Sala React</h1>
                    <span>4 Perguntas</span>
                </div>

                <form onSubmit={handleSendNewQuestion}>
                    <textarea 
                        placeholder="O que você quer perguntar?"
                        onChange={event => setNewQuestion(event.target.value)}
                        value={newQuestion}
                    />

                    <div className="form-footer">
                        {user ? (
                            <div className="user-info">
                                <img src={user.avatar} alt={user.name} />
                                <span>{user.name}</span>
                            </div>
                        ) : (
                            <span>Para enviar sua pergunta, <button>Faça seu login</button>.</span>
                        )}
                        <Button type="submit" disabled={!user}>Enviar pergunta</Button>
                    </div>
                </form>
            </main>
        </div>
    );
}