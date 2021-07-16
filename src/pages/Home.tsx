import { useHistory } from 'react-router-dom';

import IllustrationImg from '../assets/images/illustration.svg';
import LogoImg from '../assets/images/logo.svg';
import GoogleIconImg from '../assets/images/google-icon.svg';

import '../styles/auth.scss';
import { Button } from '../components/Button';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';




export function Home(){
    const history = useHistory();
    const { user, signInWithGoogle } = useContext(AuthContext);

    async function handleCreateRoom() {
        if (!user) {
            await signInWithGoogle();
        }
        history.push('/rooms/new');
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

                    <form>
                        <input 
                            type="text" 
                            placeholder="Insira o código da sala"
                        />

                        <Button type="submit">
                            Entrar na sala
                        </Button>
                    </form>
                </div>
            </main>
        </div>
    );
}
