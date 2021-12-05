import { child, push, ref, update } from 'firebase/database';
import { FormEvent, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import illustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';
import { Button } from '../components/Button';
import { useAuth } from '../hooks/useAuth';
import { database } from '../services/firebase';
import '../styles/auth.scss';


export function NewRoom() {

    const { user } = useAuth();
    const history = useHistory();
    const [newRoom, setNewRoom] = useState('');

    async function handleCreateRoom(event: FormEvent) {
        event.preventDefault();

        if(newRoom.trim() === '') {
            return;
        }

        const postData = {
            title: newRoom,
            authorId: user?.id,
        }

        const roomRef = ref(database);

        const newPostKey = push(child(roomRef, 'rooms')).key;

        const updates = {} as any;

        updates['/rooms/' + newPostKey] = postData;

        await update(roomRef, updates);

        history.push(`/admin/rooms/${newPostKey}`);
    }

    return (
        <div id="page-auth">
            <aside>
                <img src={illustrationImg} alt="Ilustarção sobre criação de salas" />
                <strong>Crie Salas de Q&amp;A ao vivo</strong>
                <p>Tire as dúvidas de sua audiência em tempo real</p>
            </aside>
            <main>
                <div className="main-content">
                    <img src={logoImg} alt="Logo Letmeask"/>
                    <h2>Crie uma nova sala</h2>
                    <form onSubmit={handleCreateRoom}>
                        <input 
                            type='text'
                            placeholder='Nome da sala'
                            onChange={event => setNewRoom(event.target.value)}
                        />
                        <Button type='submit'>
                            Criar sala
                        </Button>
                    </form>
                    <p>
                        Quer entrar em uma sala já existente? 
                        <Link to='/'>Clique aqui</Link>
                    </p>
                </div>
            </main>
        </div>
    )
}