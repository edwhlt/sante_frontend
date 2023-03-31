import React from 'react';
import MAvatar from '@mui/material/Avatar';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

import { styled, useTheme } from '@mui/material/styles';
import { useNavigate } from "react-router-dom";
import ButtonSpinner from '../utils/material/ButtonSpinner';

const Form = styled('form')(({ theme }) => ({
  width: '100%', // Fix IE 11 issue.
  marginTop: theme.spacing(1),
}));

const Paper = styled('div')(({ theme }) => ({
  marginTop: theme.spacing(8),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}));

const Avatar = styled(MAvatar)(({ theme, open }) => ({
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  }),
);

export default function SignIn(props) {
  let navigate = useNavigate();
  const theme = useTheme();
  const [email, setEmail] = React.useState(null);
  const [password, setPasword] = React.useState(null);
  const [remember, setRemember] = React.useState(false);

  const changeEmail = (e) => {
      setEmail(e.target.value);
  };
  const changePassword = (e) => {
      setPasword(e.target.value);
  };
  const changeRemember = (e) => {
      setRemember(e.target.value);
  }

  const canConnect = (e) => {
    return email && password && email !== "" && password !== "";
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Paper>
        <Avatar>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">Connexion</Typography>
        <Form noValidate>
          <TextField variant="outlined" margin="normal" required fullWidth id="email" label="Adresse mail" name="email" autoComplete="email" autoFocus onChange={changeEmail}/>
          <TextField variant="outlined" margin="normal" required fullWidth name="password" label="Mot de passe" type="password" id="password" autoComplete="current-password" onChange={changePassword}/>
          <FormControlLabel control={<Checkbox value="remember" color="primary"onChange={changeRemember} />} label="Se souvenir de moi" />
          <ButtonSpinner type="submit" disabled={!canConnect()} fullWidth variant="contained" color="primary" style={{margin: theme.spacing(3, 0, 2)}} onAction={(e) => props.signin(email, password, remember)}>Connexion</ButtonSpinner>
          <Grid container>
            <Grid item xs><Link component="button" variant="body2">Mot de passe oublié ?</Link></Grid>
            <Grid item>
              <Link component="button" variant="body2" onClick={() => navigate("/signup")}>
                "Pas de compte ? Inscrivez-vous"
              </Link>
            </Grid>
          </Grid>
        </Form>
      </Paper>
      <Box mt={8}>{props.copyright}</Box>
    </Container>
  );
}