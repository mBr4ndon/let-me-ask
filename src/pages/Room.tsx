import { FormEvent, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import LogoImg from '../assets/images/logo.svg';
import { Button } from '../components/Button';
import { RoomCode } from '../components/RoomCode';
import { useAuth } from '../hooks/useAuth';
import { database } from '../services/firebase';

import '../styles/room.scss';

type FirebaseQuestions = Record<string, {
    author: {
        name: string;
        avatar: string;
    }
    content: string;
    isAnswered: boolean;
    isHighlighted: boolean;
}>

type Question = {
    id: string;
    author: {
        name: string;
        avatar: string;
    }
    content: string;
    isAnswered: boolean;
    isHighlighted: boolean;
}

type RoomParams = {
    id: string;
}

export function Room() {
    const { user } = useAuth();
    const params = useParams<RoomParams>();
    const roomID = params.id;

    const [title, setTitle] = useState('');
    const [newQuestion, setNewQuestion] = useState('');
    const [questions, setQuestions] = useState<Question[]>([]);

    useEffect(() => {
        const roomRef = database.ref(`rooms/${roomID}`);

        roomRef.on('value', room => {
            
            const firebaseQuestions: FirebaseQuestions = room.val().questions ?? {};
            const parsedQuestions = Object.entries(firebaseQuestions ?? {}).map(([key, value]) => {
                return {
                    id: key,
                    content: value.content,
                    author: value.author,
                    isHighlighted: value.isHighlighted,
                    isAnswered: value.isAnswered,
                }
            });
            setTitle(room.val().title);
            setQuestions(parsedQuestions);
        });
    }, [roomID]);


    async function handleCreateNewQuestion(event: FormEvent) {
        event.preventDefault();

        if(newQuestion.trim() === '') {
            return;
        }

        if(!user) {
            throw new Error('You must be logged in');
        }

        const question = {
            content: newQuestion,
            author: {
                name: user.name,
                avatar: user.avatar
            },
            isHighlighted: false,
            isAnswered: false,
        };

        await database.ref(`rooms/${roomID}/questions`).push(question);
        setNewQuestion('');
    }
    return(
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={LogoImg} alt="Letmeask" />
                    <RoomCode code={roomID} />
                </div>
            </header>

            <main className="content">
                <div className="room-title">
                    <h1>Sala {title}</h1>
                    { questions.length > 0 && <span>{questions.length} perguntas</span> }
                </div>

                <form onSubmit={handleCreateNewQuestion}>
                    <textarea 
                        placeholder="Insira a sua questão aqui"
                        onChange={event => setNewQuestion(event.target.value)}
                        value={newQuestion}
                    />

                    <div className="form-footer">
                        { user ? (
                            <div className="user-info">
                                <img src={user.avatar} alt="User avatar" />
                                <span>{user.name}</span>
                            </div>
                        ) : (
                            <span>Para enviar a sua questão <button>faça login na sua conta</button>.</span>
                        ) }
                        <Button type="submit" disabled={!user}>Enviar questão</Button>
                    </div>
                </form>

                { JSON.stringify(questions)}
            </main>
        </div>
    );
}