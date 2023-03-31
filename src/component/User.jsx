import React from 'react';
import Recettes from "./recette/Recettes";
import Dashboard from "./Dashboard";
import Settings from "./settings/Settings";
import FormFood from './food/FormFood';
import ManageRepas from "./repas/ManageRepas";

import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import withRouter from './utils/routerComponent';

import { Typography, IconButton, Box, List, ListItem, ListItemIcon, ListItemText, Table, TableCell, TableRow, TableContainer, TableHead, TableBody, Select, MenuItem, LinearProgress } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import ReceiptIcon from '@mui/icons-material/Receipt';
import EmojiFoodBeverageIcon from '@mui/icons-material/EmojiFoodBeverage';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import SettingsIcon from '@mui/icons-material/Settings';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

import Brightness4Icon from '@mui/icons-material/Brightness4';
import BrightnessHighIcon from '@mui/icons-material/BrightnessHigh';

import Profils from './profil/Profils';
import SideCanvas from './utils/material/SideCanvas';
import MenuApp from './utils/MenuApp';
import ConfirmModal from './utils/material/ConfirmModal';
import ManageRepasWS from './repas/ManageRepasWS';
import { TabContext, TabPanel, TabList } from '@mui/lab';
import RecettesWs from "./recette/RecettesWS";
import * as RESTApi from "../RESTApi";
import {addProfile} from "../RESTApi";


const routes = [
    {name: "Tableau de bord", icon: <DashboardIcon/>, key: "dash", needProdile: true},
    {name: "Recettes", icon: <ReceiptIcon/>, key: "recettes", needProdile: true},
    {name: "Repas", icon: <EmojiFoodBeverageIcon/>, key: "repas", needProdile: true},
    {name: "Profils", icon: <PersonIcon/>, key: "profils"},
]

class User extends React.Component {
    constructor(props) {
      super(props);
      this.state = {user: props.user, profils: {}, show: false, dark: props.dark};

      this.close = this.close.bind(this);
      this.open = this.open.bind(this);

      this.changeMode = this.changeMode.bind(this);
      this.toolsContent = this.toolsContent.bind(this);

      this.getProfils = this.getProfils.bind(this);
      this.addProfil = this.addProfil.bind(this);

      this.changeCurentProfil = k => {
          this.setState({currentProfil: this.state.profils[k]})
          this.props.router.navigate('/dash');
      }

      this.gotToSettings = () => {
          this.props.router.navigate("/settings")
      }
    }

    componentDidMount() {
        this.getProfils();
        this.props.router.navigate("/dash");
    }

    changeMode(){
        const { dark } = this.state;
        this.setState({dark: !dark})
        this.props.changeMode(!dark);
    }

    getProfils(){
        this.setState({ waiting: true})
        RESTApi.getProfiles(this.state.user.id_user).then(data => {
            const k = Object.keys(data)[0];
            this.setState({profils: data, currentProfil: data[k], waiting: false})
        }).catch(error => {
            this.setState({ errorMessage: error.toString() });
        });
    }


    addProfil(profil){
        const { profils } = this.state;
        return RESTApi.addProfile(profil).then(data => {
                profils[data.id] = data;
                this.forceUpdate();
                if(!profils || Object.keys(profils).length === 0){
                    this.changeCurentProfil(data.id);
                }
            }
        )
    }

    toolsContent(mode){
        const { profils, currentProfil, dark } = this.state;

        const tools = [];

        tools.push(<FormFood key={`formfood_canvas`} mode={mode}/>)
        tools.push(mode === "icon" ?
            <IconButton key={`dark_theme`} aria-label={"Mode "+(dark ? "jour" : "nuit")} onClick={this.changeMode}>{dark ? <BrightnessHighIcon/> : <Brightness4Icon/>}</IconButton> :
            <MenuItem key={`dark_theme`} onClick={this.changeMode}>{"Mode "+(dark ? "jour" : "nuit")}</MenuItem>
        );

        if(currentProfil){
            tools.push(

                <Select native inputProps={{ name: 'profile', id: 'select-profile' }} renderValue={(selected) => {
                    if (selected.length === 0) {
                        return <em>Placeholder</em>;
                    }
                    return selected;
                }} size={'small'} value={currentProfil.id} onChange={e => this.changeCurentProfil(e.target.value)}>
                    {Object.keys(profils).map(key => (
                        <option key={`profil-option-${key}`} value={key}>{profils[key].name}</option>
                    ))}
                </Select>
            );
            tools.push(
            <SideCanvas key={`profil_infos`} startIcon={<InfoOutlinedIcon/>} mode={mode} anchor="right" btn_title="Infos" title={"Information du profil : "+currentProfil.name}>
                <TableContainer>
                    <Table aria-label="Table d'information du profil" size="small">
                        <TableHead>
                        <TableRow>
                            <TableCell>Propriétée</TableCell>
                            <TableCell align="right">Valeur</TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell>Nom</TableCell>
                                <TableCell align="right">{currentProfil.name}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Poids</TableCell>
                                <TableCell align="right">{currentProfil.weight}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Taille</TableCell>
                                <TableCell align="right">{currentProfil.size}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Age</TableCell>
                                <TableCell align="right">{currentProfil.age}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Genre</TableCell>
                                <TableCell align="right">{currentProfil.sexe === 0 ? "Homme" : "Femme"}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Energie</TableCell>
                                <TableCell align="right">{currentProfil.energyPerDay.toFixed(2)}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Glucides</TableCell>
                                <TableCell align="right">{currentProfil.stringCarbohydratePerDay}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Proteines</TableCell>
                                <TableCell align="right">{currentProfil.stringProteinPerDay}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Lipides</TableCell>
                                <TableCell align="right">{currentProfil.stringLipidPerDay}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </SideCanvas>
            );
        }

        tools.push(mode === 'icon' ?
            <IconButton key={`settings`} aria-label="Paramètres" onClick={this.gotToSettings}><SettingsIcon/></IconButton> :
            <MenuItem key={`settings`} onClick={this.gotToSettings}>Paramètres</MenuItem>
        );

        tools.push(mode === "icon" ?
            <IconButton key={`logout`} aria-label="Se déconnecter" color="error" onClick={this.props.disconnect}><ExitToAppIcon color="error"/></IconButton> :
            <MenuItem key={`logout`} onClick={this.props.disconnect}>Se déconnecter</MenuItem>
        );

        return tools;
    }

    close(){
        this.setState({show: false})
    }

    open(){
        this.setState({show: true})
    }

    render() {
        const { user, profils, currentProfil, waiting } = this.state;

        if(waiting){
            return (<LinearProgress color="secondary" />);
        }
        else {
            return (
                <MenuApp routes={routes} currentProfil={currentProfil} barContent={
                    <><img src="icon.svg" alt="" width="30" height="24" className="d-inline-block align-text-top"/><Typography variant="h6" noWrap>Santé</Typography></>
                } toolsContent={this.toolsContent}>
                    <Routes>
                        <Route path="/" elements={currentProfil ? <Navigate replace to="/dash" /> : <Navigate replace to="/profils" />}>


                            <Route path="profils" element={
                                <Profils user={user} profils={profils} getProfils={this.getProfils} addProfil={this.addProfil} onDelete={(id) => {
                                    const newProfils = Object.values(profils).filter(p => p.id !== id);
                                    delete profils[id];
                                    this.setState({currentProfil: newProfils[0]})
                                    this.forceUpdate();
                                }}/>
                            }/>

                            {currentProfil && (
                                <>
                                <Route path="settings" element={<Settings/>}/>
                                <Route path="dash" element={<Dashboard profil={currentProfil}/>}/>

                                <Route path="recettes" element={<RecettesWs />}>
                                    <Route path="" element={
                                        <TabPanel value="" sx={{ padding: (theme) => theme.spacing(3, 0, 0, 0)}}><Recettes profil={currentProfil}/></TabPanel>
                                    }/>
                                    <Route path="share" element={
                                        <TabPanel value="share" sx={{ padding: (theme) => theme.spacing(3, 0, 0, 0) }}></TabPanel>
                                    }/>
                                </Route>

                                <Route path="repas" element={<ManageRepasWS />}>
                                    <Route path="" element={
                                        <TabPanel value="" sx={{ padding: (theme) => theme.spacing(3, 0, 0, 0) }}><ManageRepas profil={currentProfil}/></TabPanel>
                                    }/>
                                    <Route path="share" element={
                                        <TabPanel value="share" sx={{ padding: (theme) => theme.spacing(3, 0, 0, 0) }}></TabPanel>
                                    }/>
                                </Route>
                                </>
                            )}
                        </Route>
                    </Routes>
                </MenuApp>
            )
        }
    }
  }
  export default withRouter(User)