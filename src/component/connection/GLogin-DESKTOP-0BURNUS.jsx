import { Button } from '@mui/material';
import React, { useState } from 'react';
import { GoogleLogin, GoogleLogout } from 'react-google-login';

const clientId = "16597680764-lum4necifo31etkfii4pob4souanklva.apps.googleusercontent.com";
const {google} = require('googleapis');

const oauth2Client = new google.auth.OAuth2(
  '16597680764-lum4necifo31etkfii4pob4souanklva.apps.googleusercontent.com',
  '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',
  'https://loclahost:3000'
);

// generate a url that asks permissions for Blogger and Google Calendar scopes
const scopes = [
  'https://www.googleapis.com/auth/keep',
  'https://www.googleapis.com/auth/calendar'
];

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
        

        const url = oauth2Client.generateAuthUrl({
            // 'online' (default) or 'offline' (ge ts refresh_token)
            access_type: 'online',
    
            // If you only need one scope you can pass it as a string
            scope: scopes
        });
        console.log(url);
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