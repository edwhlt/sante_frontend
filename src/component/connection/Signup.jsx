import React from 'react';
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
import { Avatar as MAvatar } from '@mui/material';

const Form = styled('form')(({ theme }) => ({
  width: '100%', // Fix IE 11 issue.
  marginTop: theme.spacing(3),
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

export default function SignUp(props) {
  let navigate = useNavigate();
  const theme = useTheme();

  const [name, setName] = React.useState(null);
  const [email, setEmail] = React.useState(null);

  const [password, setPasword] = React.useState(null);
  const [cpassword, setCPasword] = React.useState(null);

  const [remember, setRemember] = React.useState(false);

  const changeName = (e) => {
    setName(e.target.value);
  };
  const changeEmail = (e) => {
      setEmail(e.target.value);
  };
  const changePassword = (e) => {
      setPasword(e.target.value);
  };
  const changeRemember = (e) => {
      setRemember(e.target.value);
  }

  const samePassword = (e) => {
    return password === cpassword;
  }

  const canConnect = () => {
    return (samePassword() && name && email && password && name !== "" && email !== "" && password !== "");
  }

  const optionConfirmPassword = () => {
    if(!samePassword()) return {
      error: true, helperText: "Les mot de passe doivent être identique"
    }
    else return {};
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Paper>
        <Avatar>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">Inscription</Typography>
        <Form noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField autoComplete="name" name="name" variant="outlined" required fullWidth id="name" label="Nom" autoFocus onChange={changeName}/>
            </Grid>
            <Grid item xs={12}>
              <TextField variant="outlined" required fullWidth id="email" label="Email Address" name="email" autoComplete="email" onChange={changeEmail}/>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField variant="outlined" required fullWidth name="password" label="Mot de passe" type="password" id="password" autoComplete="current-password" onChange={changePassword}/>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField variant="outlined" required fullWidth {...optionConfirmPassword()}
                name="c_password" label="Confirmer le mot de passe" type="password" id="c_password" onChange={(e) => setCPasword(e.target.value)}/>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel control={<Checkbox value="remember" color="primary"onChange={changeRemember} />} label="Se souvenir de moi" />
            </Grid>
          </Grid>
          <ButtonSpinner type="submit" disabled={!canConnect()} fullWidth variant="contained" color="primary" style={{margin: theme.spacing(3, 0, 2)}} onAction={(e) => props.signup(name, email, password, remember)}>Inscription</ButtonSpinner>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link component="button" variant="body2" onClick={() => navigate("/signin")}>
                Vous avez déjà un compte ? Connectez-vous
              </Link>
            </Grid>
          </Grid>
        </Form>
      </Paper>
      <Box mt={5}>{props.copyright}</Box>
    </Container>
  );
}