import React from 'react';
import ProfilFormModal from './ProfilFormModal';

import { Grid, IconButton, Card, CardActions, CardContent, CardHeader, TableContainer, TableCell, TableHead, TableBody, TableRow, Table } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import AddIcon from '@mui/icons-material/Add';
import CustomTable from "../utils/material/CustomTable";
import EditIcon from "@mui/icons-material/Edit";
import ConfirmModal from "../utils/material/ConfirmModal";
import DeleteIcon from "@mui/icons-material/Delete";
import Tooltip from "@mui/material/Tooltip";
import * as RESTApi from "../../RESTApi";


class Profils extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            user: props.user, 
            profils: props.profils
        };
        this.updateProfil = this.updateProfil.bind(this);
        this.delProfil = this.delProfil.bind(this);
    }

    updateProfil(profil){
        return RESTApi.updatePorfile(profil).then(results => {
            this.setState({profil: profil})
        });
    }

    delProfil(profil){
        return RESTApi.deleteProfile(profil).then(() => {
            this.props.onDelete(profil.id);
        });
    }

    render(){
        const { user, profils } = this.state;


        return (
            <Grid>
                <CustomTable
                    title={"Profils"}
                    empty={"Aucun profil"}
                    headCells={[
                        {
                            id: 'name',
                            align: 'left',
                            sortable: true,
                            filterable: true,
                            label: 'Nom',
                            getValue: (row) => row.name,
                            cellRender: (row) => row.name
                        },
                        {
                            id: 'energyPerDay',
                            align: 'left',
                            sortable: true,
                            filterable: true,
                            label: 'Energie par jour',
                            getValue: (row) => row.energyPerDay.toFixed(2),
                            cellRender: (row) => row.energyPerDay.toFixed(2)
                        },
                        {
                            id: 'edit',
                            align: 'left',
                            sortable: false,
                            filterable: false,
                            style: { width: 30 },
                            label: '',
                            cellRender: (row) => {
                                return (
                                    <ProfilFormModal startIcon={<EditIcon fontSize="small"/>} size="small" profil={row} onApply={this.updateProfil} modal={
                                        {modal_key: row.id, title: row.name, btn_title: "Modifier", btn_success: "Sauvegarder les modifications"}
                                    }/>
                                )
                            }
                        },
                        {
                            id: 'delete',
                            align: 'left',
                            sortable: false,
                            filterable: false,
                            style: { width: 30 },
                            label: '',
                            cellRender: (row) => {
                                return (
                                    <ConfirmModal mode="icon" size="small" startIcon={<DeleteIcon fontSize="small"/>} modal_key={"del-profil-"+row.id} title="Supprimer un profil" btn_title="Supprimer" onSuccess={this.delProfil}>
                                        Etes-vous sur de vouloir supprimer le profil : {row.name}
                                    </ConfirmModal>
                                )
                            }
                        }
                    ]}
                    rows={Object.values(profils)}
                    headActions={[
                        {
                            name: "Recharger",
                            content: (
                                <Tooltip title="Recharger">
                                    <IconButton onClick={this.props.getProfils} aria-label="Recharger"><RefreshIcon /></IconButton>
                                </Tooltip>
                            )
                        },
                        {
                            name: "Ajouter un profil",
                            content: (
                                <ProfilFormModal startIcon={<AddIcon />} profil={{id_user: user.id_user, sexe: 0, factor: 1.0, physical_activity: 1.375, carbohydrate: 0.5, protein: 0.2, lipid: 0.3}} onApply={this.props.addProfil} modal={
                                    {modal_key: "ajout-profil", title: "Ajouter un profil", btn_title: "Ajouter", btn_success: "Ajouter"}
                                }/>
                            )
                        }
                    ]}
                >
                </CustomTable>
            </Grid>
        )

    }

}

export default Profils