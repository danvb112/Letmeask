import { useState } from 'react';
import { useParams } from 'react-router-dom';
import logoImg from '../assets/images/logo.svg';
import { Button } from '../components/Button';
import { Question } from '../components/Question';
import { RoomCode } from '../components/RoomCode';
import { useAuth } from '../hooks/useAuth';
import { useRoom } from '../hooks/useRoom';
import '../styles/room.scss';

import deleteImg from '../assets/images/delete.svg';
import answerImg from '../assets/images/answer.svg';
import chekcImg from '../assets/images/check.svg';
import { ref, remove, update } from '@firebase/database';
import { database } from '../services/firebase';



type ParamsProps = {
    id: string
}

export function AdminRoom() {
    const { user } = useAuth();
    const params = useParams<ParamsProps>()
    const [newQuestion, setNewQuestion] = useState('');
    const roomId = params.id;
    const {title, questions} = useRoom(roomId);

    async function handleDeleteQuestion(questionId: string) {
        if(window.confirm('Tem certeza que você deseja excluir essa pergunta?')) {

            const roomRef = ref(database, `rooms/${roomId}/questions/${questionId}`);

            await remove(roomRef);
        }
    }

    async function handleCheckQuestionAsAnswered(questionId: string) {

        const updateQuestion = {
            isAnswered: true
        }

        const roomRef = ref(database, `rooms/${roomId}/questions/${questionId}`);

        await update(roomRef, updateQuestion);
    }

    async function handleHighlightQuestion(questionId: string) {

        const updateQuestion = {
            isHighlighted: true
        }

        const roomRef = ref(database, `rooms/${roomId}/questions/${questionId}`);

        await update(roomRef, updateQuestion);
    }

    return (
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logoImg} alt='Letmeask' />
                    <div>
                        <RoomCode code={roomId} />
                        <Button isOutlined>Encerrar Sala</Button>
                    </div>
                </div>
            </header>
            
            <main>
                <div className="room-title">
                    <h1>Sala {title}</h1>
                    {questions.length > 0 && (<span>{questions.length} Pergunta(s)</span>)}
                </div>
                
                <div className="question-list">
                    {questions.map(question => {
                        return <Question 
                            key={question.id}
                            content={question.content}
                            author={question.author}
                            isAnswered={question.isAnswered}
                            isHighlighted={question.isHighlighted}
                        >
                            {!question.isAnswered && (
                                <>
                                    <button
                                        type='button'
                                        onClick={() => handleCheckQuestionAsAnswered(question.id)}
                                    >
                                        <img src={chekcImg} alt='Marcar pergunta como respondida'/>
                                    </button>

                                    <button
                                        type='button'
                                        onClick={() => handleHighlightQuestion(question.id)}
                                    >
                                        <img src={answerImg} alt='Destacar pergunta enquanto é respondida'/>
                                    </button>
                                </>
                            )}
                            <button
                                type='button'
                                onClick={() => handleDeleteQuestion(question.id)}
                            >
                                <img src={deleteImg} alt='Deletar pergunta'/>
                            </button>
                            
                        </Question>
                    })}
                </div>

            </main>
        </div>
    );
}