import { useHistory } from 'react-router-dom';

import IllustrationImg from '../assets/images/illustration.svg';
import LogoImg from '../assets/images/logo.svg';
import GoogleIconImg from '../assets/images/google-icon.svg';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

import '../styles/auth.scss';
import { Button } from '../components/Button';
import { FormEvent, useContext, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { database } from '../services/firebase';




export function Home(){
    const history = useHistory();
    const { user, signInWithGoogle } = useContext(AuthContext);
    const [roomCode, setRoomCode] = useState('');

    async function handleCreateRoom() {
        if (!user) {
            await signInWithGoogle();
        }
        history.push('/rooms/new');
    }

    async function handleJoinRoom(event: FormEvent) {
        event.preventDefault();

        if (roomCode === '') {
            return;
        }

        const roomRef = await database.ref(`/rooms/${roomCode}`).get();

        if (!roomRef.exists()) {
            toast.dark('A sala não existe');
            return;
        }

        if (roomRef.val().closedAt) {
            toast.dark('A sala já se encontra encerrada');
            return;
        }

        history.push(`/rooms/${roomCode}`);
    }


    return (
        <div id="page-auth">
            <aside>
                <img src={IllustrationImg} alt="Ilustração de chat live" />
                <strong>Crie salas de Q&amp;A ao vivo</strong>
                <p>Tire as dúvidas das sua audiência em tempo-real</p>
            </aside>

            <main>
                <div className="main-content">
                    <img src={LogoImg} alt="Letmeask" />
                    <button className="create-room" onClick={handleCreateRoom}>
                        <img src={GoogleIconImg} alt="" />
                        Crie a sua sala com o Google
                    </button>

                    <div className="separator">ou entre na sala</div>

                    <form onSubmit={handleJoinRoom}>
                        <input 
                            type="text" 
                            placeholder="Insira o código da sala"
                            onChange={event => setRoomCode(event.target.value)}
                            value={roomCode}
                        />

                        <Button type="submit">
                            Entrar na sala
                        </Button>
                    </form>
                </div>
            </main>
            <ToastContainer />
        </div>
    );
}
