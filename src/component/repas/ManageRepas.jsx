import React from 'react';
import RepasFormModal from './RepasFormModal';

import { TextField, Grid, IconButton, Card, CardActions, CardContent, CardHeader, TableContainer, TableCell, TableHead, TableBody, TableRow, Table, LinearProgress, Divider } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import AddIcon from '@mui/icons-material/Add';
import Tooltip from '@mui/material/Tooltip';

import CustomTable from "../utils/material/CustomTable";

import { styled } from '@mui/material/styles';
import NutrimentsTable from '../utils/NutrimentsTable';
import ConfirmModal from '../utils/material/ConfirmModal';

import DeleteIcon from '@mui/icons-material/Delete';
import FastFoodIcon from '@mui/icons-material/Fastfood';
import EditIcon from '@mui/icons-material/Edit';
import Rating from '@mui/material/Rating';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import * as RESTApi from "../../RESTApi";
import {getAllRepas} from "../../RESTApi";

const StyledRating = styled(Rating)({
    '& .MuiRating-iconFilled': {
        color: '#ff6d75',
    },
    '& .MuiRating-iconHover': {
        color: '#ff6d75',
    },
});

class ManageRepas extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            profil: props.profil,
            items: {},
            isLoaded: false,
        };

        this.table = React.createRef();
        this.getRepas = this.getRepas.bind(this);
        this.addRepas = this.addRepas.bind(this);
        this.getNutriments = this.getNutriments.bind(this);
        this.updateRepas = this.updateRepas.bind(this);
        this.delRepas = this.delRepas.bind(this);
    }

    componentDidMount() {
        this.getRepas()
    }

    getRepas() {
        this.setState({
            isLoaded: false,
            items: {}
        });
        RESTApi.getAllRepas(this.state.profil.id, true).then(data => {
            this.setState({isLoaded: true, items: data });
        }).catch((err) => {
            this.setState({isLoaded: true, err });
        })

    }

    addRepas(repas) {
        return RESTApi.addRepas(this.state.profil.id, repas).then(data => {
                this.state.items[data.id] = data;
                this.forceUpdate();
            }
        )
    }

    getNutriments(repas){
        return RESTApi.getNutrimentsRepas(repas.id_profil, repas.id);
    }

    updateRepas(repas){
        return RESTApi.updateRepas(this.state.profil.id, repas).then(results => {
            this.forceUpdate();
        });
    }

    delRepas(repas){
        return RESTApi.deleteRepas(repas.id_profil, repas.id).then(() => {
            delete this.state.items[repas.id]
            this.forceUpdate();
        });
    }

    render() {
        const { items, isLoaded, err, profil } = this.state

        if (err) {
            return (
                <>Erreur : {err.message}
                    <IconButton onClick={this.getRepas} aria-label="Recharger"><RefreshIcon /></IconButton></>
            );
        } else if (!isLoaded) {
            return (<LinearProgress color="secondary" />);
        }
        else {
            /*return (
            <Grid>
                <Card>
                    <CardHeader action={
                        <>
                            <Tooltip title="Recharger">
                                <IconButton onClick={this.getRepas} aria-label="Recharger"><RefreshIcon/></IconButton>
                            </Tooltip>

                            <RepasFormModal startIcon={<AddIcon />} repas={{id_profil: profil.id, elements: {}, recettes: {}}} onApply={this.addRepas} modal={
                                {modal_key: "ajout-repas", title: "Ajouter un repas", btn_title: "Ajouter", btn_success: "Ajouter"}
                            }/>
                            <TooltipPopover>
                                <TextField
                                    label="Valeur à filtrer" variant="standard"
                                    onChange={e => this.filter(e)}
                                    style={{margin: '0.5em'}}
                                />
                            </TooltipPopover>
                        </>
                    } title={"Vos repas"}/>
                    <Divider/>
                    <CardContent>
                        {Object.keys(items).length > 0 ? (
                            <><TableContainer component={Paper}>
                                <Table aria-label="Table recettes" size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell style={{width: 50}}></TableCell>
                                            <TableCell>Nom</TableCell>
                                            <TableCell align="right" style={{width: 50}}/>
                                            <TableCell align="right" style={{width: 50}}/>
                                            <TableCell align="right" style={{width: 50}}/>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {Object.keys(items).filter(key => !filter.includes(key)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(key => {
                                            console.log(key)
                                            return (
                                                <Repas repas={items[key]} onDelete={() => {
                                                    delete this.state.items[key]
                                                    this.forceUpdate();
                                                }}/>
                                            )
                                        }
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25]}
                                component="div"
                                count={Object.keys(items).length-filter.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={this.handleChangePage}
                                onRowsPerPageChange={this.handleChangeRowsPerPage}
                                labelRowsPerPage={"Lignes par page :"}
                                nextIconButtonText="Page suivante"
                                backIconButtonText="Page précédente"
                                labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count !== -1 ? count : `more than ${to}`}`}
                            /></>
                        ) : "Aucun repas sur ce profil" }
                    </CardContent>
                </Card>
            </Grid>
        )*/


            return (
                <Grid>
                    <CustomTable
                        title={"Repas"}
                        empty={"Aucun repas"}
                        headCells={[
                            {
                                id: 'fav',
                                align: 'left',
                                sortable: true,
                                filterable: false,
                                style: { width: 50 },
                                getValue: (row) => row.fav,
                                label: '',
                                cellRender: (row) => {
                                    return (
                                        <StyledRating
                                            max={1}
                                            defaultValue={row.fav}
                                            icon={<FavoriteIcon fontSize="inherit" />}
                                            emptyIcon={<FavoriteBorderIcon fontSize="inherit" />}
                                        />
                                    )
                                }
                            },
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
                                id: 'nutriments',
                                align: 'left',
                                sortable: false,
                                filterable: false,
                                style: { width: 30 },
                                label: '',
                                getValue: (row) => row.nutriments,
                                cellRender: (row) => {
                                    return (
                                        <NutrimentsTable nutriments={row.nutriments} updateNutriments={(e) => this.getNutriments(row)} sideCanvasParams={{
                                            mode:"icon",
                                            startIcon: (<FastFoodIcon fontSize="small" />),
                                            size:"small",
                                            title: "Nutriments de: " + row.name
                                        }}/>
                                    )
                                }
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
                                        <RepasFormModal startIcon={<EditIcon fontSize="small" />} size="small" repas={row} modal={
                                            { modal_key: row.id, title: row.name, btn_title: "Modifier", btn_success: "Sauvegarder les modifications" }
                                        } onApply={this.updateRepas}/>
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
                                        <ConfirmModal color="error" mode="icon" size="small" startIcon={<DeleteIcon fontSize="small" />} modal_key={"del-" + row.id} 
                                            title="Supprimer un repas" btn_title="Supprimer" onSuccess={(e) => this.delRepas(row)}>
                                            Etes-vous sur de vouloir supprimer : {row.name}
                                        </ConfirmModal>
                                    )
                                }
                            }
                        ]}
                        rows={Object.values(items)}
                        headActions={[
                            {
                                name: "Rafraichir les données",
                                content: (
                                    <Tooltip title="Recharger">
                                        <IconButton onClick={this.getRepas} aria-label="Recharger"><RefreshIcon /></IconButton>
                                    </Tooltip>
                                )
                            },
                            {
                                name: "Ajouter un repas",
                                content: (
                                    <RepasFormModal startIcon={<AddIcon />} repas={{ id_profil: profil.id, elements: {}, recettes: {} }} onApply={this.addRepas} modal={
                                        { modal_key: "ajout-repas", title: "Ajouter un repas", btn_title: "Ajouter", btn_success: "Ajouter" }
                                    } />
                                )
                            }
                        ]}
                        >
                    </CustomTable>
                </Grid>
            )
        }
    }

}

export default ManageRepas