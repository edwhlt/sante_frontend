import { Button } from '@mui/material';
import React, { useState } from 'react';
import { GoogleLogin, GoogleLogout } from 'react-google-login';

const clientId = "16597680764-lum4necifo31etkfii4pob4souanklva.apps.googleusercontent.com";

function GAccount() {

    const [login, setLogin] = useState(false);
    const onLoginSuccess = (res) => {
        console.log('Login Success:', res.profileObj);
        setLogin(true);
    };

    const onLoginFailure = (res) => {
        console.log('Login Failed:', res);
    };

    const onSignoutSuccess = () => {
        alert("You have been logged out successfully");
        console.clear();
        setLogin(false);
    };

    const getNotes = () => {
        fetch("https://keep.googleapis.com/v1/notes").then((res) => {
            console.log(res);
        });
    };

    return (
        <div>
            { login ?
                <GoogleLogin
                    clientId={clientId}
                    buttonText="Connexion"
                    onSuccess={onLoginSuccess}
                    onFailure={onLoginFailure}
                    cookiePolicy={'single_host_origin'}
                    isSignedIn={true}
                /> : 
                <>
                    <GoogleLogout
                        clientId={clientId}
                        buttonText="Déconnexion"
                        onLogoutSuccess={onSignoutSuccess}
                    />
                    <Button onclick={getNotes}>Notes from keep</Button>
                </>
            }
        </div>
    );
}
export default GAccount;