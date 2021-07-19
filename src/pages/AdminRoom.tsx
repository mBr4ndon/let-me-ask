// import { FormEvent, useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import LogoImg from '../assets/images/logo.svg';
import DeleteImg from '../assets/images/delete.svg';
import { Button } from '../components/Button';
import { Question } from '../components/Question';
import { RoomCode } from '../components/RoomCode';
// import { useAuth } from '../hooks/useAuth';
import { useRoom } from '../hooks/useRoom';
import { database } from '../services/firebase';

import '../styles/room.scss';

type RoomParams = {
    id: string;
}

export function AdminRoom() {
    // const { user } = useAuth();
    const history = useHistory();
    const params = useParams<RoomParams>();
    const roomID = params.id;

    const { title, questions } = useRoom(roomID);

    function handleDeleteQuestion(questionID: string) {
        if(window.confirm("Tem a certeza que deseja eliminar esta questão?")) {
            const questionRef = database.ref(`rooms/${roomID}/questions/${questionID}`).remove();
        }
    }

    async function handleEndRoom() {
        await database.ref(`rooms/${roomID}`).update({
            closedAt: new Date()
        });

        history.push('/');
    }

    return(
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={LogoImg} alt="Letmeask" />
                    <div>
                        <RoomCode code={roomID} />
                        <Button 
                            isOutlined
                            onClick={handleEndRoom}
                        >
                            Encerrar sala
                        </Button>
                    </div>
                </div>
            </header>

            <main className="content">
                <div className="room-title">
                    <h1>Sala {title}</h1>
                    { questions.length > 0 && <span>{questions.length} perguntas</span> }
                </div>

                <div className="question-list">
                {
                    questions.map(question => {
                        return (
                            <Question 
                                key={question.id}
                                content={question.content}
                                author={question.author}
                            >
                                <button
                                    type="button"
                                    onClick={() => handleDeleteQuestion(question.id)}
                                >
                                    <img src={DeleteImg} alt="Remover questão" />
                                </button>
                            </Question>
                        );
                    })
                }
                </div>
            </main>
        </div>
    );
}