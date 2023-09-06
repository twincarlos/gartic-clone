import { Routes, Route } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebase';
import Home from './components/Home';
import Game from './components/Game';
import Login from './components/Login';

function App() {
    const [user] = useAuthState(auth);

    return (
        <Routes>
            <Route exact path='/' element={<Home user={user} />} />
            <Route exact path='/login' element={<Login user={user} />} />
            <Route exact path='/play/:gameId' element={<Game user={user} />} />
        </Routes>
    );
};

export default App;