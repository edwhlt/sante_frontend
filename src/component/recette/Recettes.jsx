import React from 'react';
import RecetteFormModal from './RecetteFormModal';
import { Grid, IconButton, Card, CardActions, CardContent, CardHeader, TableContainer, TableCell, TableHead, TableBody, TableRow, Table, LinearProgress } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import AddIcon from '@mui/icons-material/Add';
import CustomTable from "../utils/material/CustomTable";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import NutrimentsTable from "../utils/NutrimentsTable";
import FastFoodIcon from "@mui/icons-material/Fastfood";
import EditIcon from "@mui/icons-material/Edit";
import ConfirmModal from "../utils/material/ConfirmModal";
import DeleteIcon from "@mui/icons-material/Delete";
import Tooltip from "@mui/material/Tooltip";
import {styled} from "@mui/material/styles";
import Rating from "@mui/material/Rating";
import * as RESTApi from "../../RESTApi";

const StyledRating = styled(Rating)({
    '& .MuiRating-iconFilled': {
        color: '#ff6d75',
    },
    '& .MuiRating-iconHover': {
        color: '#ff6d75',
    },
});

class Recettes extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            profil: props.profil,
            error: null,
            isLoaded: false,
            items: {}
        };
        this.getRecette = this.getRecette.bind(this);
        this.getNutriments = this.getNutriments.bind(this);
        this.addRecette = this.addRecette.bind(this);
        this.updateRecette = this.updateRecette.bind(this);
        this.delRecette = this.delRecette.bind(this);
    }

    componentDidMount() {
        this.getRecette()
    }

    getRecette(){
        this.setState({ isLoaded: false,  items: {} });
        RESTApi.getRecettes(this.state.profil.id).then(data => {
            this.setState({isLoaded: true, items: data});
        }).catch(error => {
            this.setState({isLoaded: true, error });
        })
    }

    getNutriments(recette){
        return RESTApi.getNutrimentsRecette(recette.id_profil, recette.id);
    }

    addRecette(recette){
        return RESTApi.addRecette(this.state.profil.id, recette).then(data => {
            this.state.items[data.id] = data;
            this.forceUpdate();
        })
    }

    updateRecette(recette){
        return RESTApi.updateRecette(recette).then(results => {
            this.setState({recette: recette})
        });
    }

    delRecette(recette){
        return RESTApi.delRecette(recette.id_profil, recette.id).then(() => {
            delete this.state.items[recette.id]
            this.forceUpdate();
        })
    }

    render() {
        const { error, isLoaded, items, profil } = this.state;

        if (error) {
            return (
                <>
                    Erreur : {error.message}
                    <IconButton onClick={this.getRecette} aria-label="Recharger"><RefreshIcon/></IconButton>
                </>
            );
        } else if (!isLoaded) {
            return (<LinearProgress color="secondary" />);
        } else {
            return (
                <Grid>
                    <CustomTable
                        title={"Recettes"}
                        empty={"Aucune recette"}
                        headCells={[
                            {
                                id: 'fav',
                                align: 'left',
                                sortable: true,
                                filterable: false,
                                style: { width: 30 },
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
                                        <RecetteFormModal startIcon={<EditIcon fontSize="small"/>} size="small" recette={row} onApply={this.updateRecette} modal={
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
                                        <ConfirmModal mode="icon" size="small" startIcon={<DeleteIcon fontSize="small"/>} modal_key={"del-rec-"+row.id} title="Supprimer une recette"
                                                      btn_title="Supprimer" onSuccess={() => this.delRecette(row)}>
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
                                        <IconButton onClick={this.getRecette} aria-label="Recharger"><RefreshIcon /></IconButton>
                                    </Tooltip>
                                )
                            },
                            {
                                name: "Ajouter une recette",
                                content: (
                                    <RecetteFormModal startIcon={<AddIcon />} recette={{id_profil: profil.id, elements: {}}} onApply={this.addRecette} modal={
                                        {modal_key: "ajout-recette", title: "Ajouter une recette", btn_title: "Ajouter", btn_success: "Ajouter"}
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
}
export default Recettes
