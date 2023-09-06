import firebase from 'firebase/compat/app';
import { Navigate } from 'react-router-dom';
import { auth } from '../../firebase';
import './Login.css';

function Login ({ user }) {
    
    if (user) {
        return <Navigate to='/'/>;
    };

    return (
        <div className='main login'>
            <p>Log in with Google to continue</p>
            <button onClick={() => {
                const provider = new firebase.auth.GoogleAuthProvider();
                auth.signInWithPopup(provider);
            }}>Login</button>
        </div>
    );
};

export default Login;