import { useEffect, useState } from "react";
import { database } from '../services/firebase';
import { useAuth } from "./useAuth";

type FirebaseQuestions = Record<string, {
    author: {
        name: string;
        avatar: string;
    }
    content: string;
    isAnswered: boolean;
    isHighlighted: boolean;
    likes: Record<string, {
        authorID: string
    }>;
}>

type QuestionProps = {
    id: string;
    author: {
        name: string;
        avatar: string;
    }
    content: string;
    isAnswered: boolean;
    isHighlighted: boolean;
    likeCount: number;
    likeID: string | undefined;
}

export function useRoom(roomID: string) {
    const { user } = useAuth();
    const [title, setTitle] = useState('');
    const [questions, setQuestions] = useState<QuestionProps[]>([]);

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
                    likeCount: Object.values(value.likes ?? {}).length,
                    likeID: Object.entries(value.likes ?? {}).find(([key, like]) => like.authorID === user?.id)?.[0]
                }
            });
            setTitle(room.val().title);
            setQuestions(parsedQuestions);
        });

        return () => {
            roomRef.off('value');
        }
    }, [roomID, user?.id]);

    return { questions, title };
}