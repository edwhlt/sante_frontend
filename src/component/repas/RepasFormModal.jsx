import React from 'react';
import RequestModal from '../utils/RequestModal'

import { InputBase, CardContent, Grid, CardHeader, Card, Divider, TextField, InputAdornment, Button, IconButton, Table, TableHead, TableRow, TableCell, TableBody, TableContainer } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import ButtonSpinner from '../utils/material/ButtonSpinner';
import DeleteIcon from '@mui/icons-material/Delete';
import * as RESTApi from "../../RESTApi";

class RepasFormModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {repas: JSON.parse(JSON.stringify(props.repas)), 
            search_ing: "", currentFoodSelect: undefined, currentIngQuantityEnter: 0, 
            search_rec: "", currentRecSelect: undefined, currentRecQuantityEnter: 0
        };

        this.reset = this.reset.bind(this);
        this.onChange = this.onChange.bind(this);

        this.onChangeIngredient = this.onChangeIngredient.bind(this);
        this.getIngredients = this.getIngredients.bind(this);
        this.addIngredient = this.addIngredient.bind(this);
        this.delIngredient = this.delIngredient.bind(this);

        this.onChangeRecette = this.onChangeRecette.bind(this);
        this.getRecettes = this.getRecettes.bind(this);
        this.addRecette = this.addRecette.bind(this);
        this.delRecette = this.delRecette.bind(this);

        this.onChangeFoodSelect = (k) => {
            this.setState({currentFoodSelect: this.state.food[k]})
        }
        this.onChangeRecSelect = (k) => {
            this.setState({currentRecSelect: this.state.recette[k]})
        }
    }

    reset(){
        this.setState({repas: JSON.parse(JSON.stringify(this.props.repas))})
    }

    onChange(k, v) {
        this.state.repas[k] = v;
        this.forceUpdate();
    }

    onChangeIngredient(e, key){
        this.state.repas.elements[key].quantity = parseFloat(e.target.value)
        this.forceUpdate();
    }

    addIngredient(){
        const id = this.state.currentFoodSelect.id;
        const quantity = this.state.currentIngQuantityEnter;

        this.state.repas.elements[id] =  {
            "quantity": parseFloat(quantity), 
            "element": {
                "name": this.state.food[id].name, "unit": this.state.food[id].unit, "id": this.state.food[id].id
            }
        }
        this.forceUpdate();
    }

    delIngredient(id){
        delete this.state.repas.elements[id];
        this.forceUpdate();
    }

    onChangeRecette(e, key){
        this.state.repas.recettes[key].quantity = parseFloat(e.target.value)
        this.forceUpdate();
    }

    addRecette(){
        const id = this.state.currentRecSelect.id;
        const quantity = this.state.currentRecQuantityEnter;

        this.state.repas.recettes[id] =  {
            "quantity": parseFloat(quantity), 
            "element": {
                "name": this.state.recette[id].name, "id": this.state.recette[id].id
            }
        }
        this.forceUpdate();
    }

    delRecette(id){
        delete this.state.repas.recettes[id];
        this.forceUpdate();
    }

    getIngredients(){
        const name = this.state.search_ing;
        return RESTApi.getIngredient(name).then(data => {
                this.setState({ food: data, currentFoodSelect: data[Object.keys(data)[0]] });
            }, (error) => {
                this.setState({ error: error });
            }
        )
    }

    getRecettes(){
        const name = this.state.search_rec;

        return RESTApi.getRecette(this.state.repas.id_profil, name).then(data => {
                this.setState({ recette: data });
            }, (error) => {
                this.setState({ error: error });
            }
        )
    }

    render() {
        const { repas, food, recette, currentFoodSelect, currentRecSelect } = this.state

        const ingredientsList = [];
        if(food){
            Object.keys(food).map(k => {
                ingredientsList.push({value: k, label: food[k].name})
            })
        }
        
        const recettesList = [];
        if(recette){
            Object.keys(recette).map(k => {
                recettesList.push({value: k, label: recette[k].name})
            })
        }

        return (
            <RequestModal mode={this.props.mode ? this.props.mode : "icon"} size={this.props.size} startIcon={this.props.startIcon} modal_key={this.props.modal.modal_key} title={this.props.modal.title} btn_title={this.props.modal.btn_title} btn_success={this.props.modal.btn_success}
                onClose={this.reset} onSuccess={() => this.props.onApply(repas)}>
                <Grid container justifyContent="center" alignItems="stretch" spacing={2}>
                    <Grid item xs>
                        <Grid container direction="column" justifyContent="center" alignItems="stretch" spacing={2}>
                            <Grid item xs="12">
                                <TextField fullWidth id={"input-"+repas.id+"-name"} label="Nom" value={repas.name} variant="outlined"
                                    onChange={e => this.onChange("name", e.target.value)}/>
                            </Grid>
                            <Grid item xs="12">
                                <TextField fullWidth id={"input-food-search-"+repas.id} label="Ajouter un ingrédient" variant="outlined"
                                    helperText="Si votre ingrédient n'existe pas ajouter le dans le menu principal (Tableau de bord)."
                                    margin="normal" InputLabelProps={{ shrink: true }} onChange={(e) => this.setState({search_ing: e.target.value})}
                                    InputProps={{
                                        endAdornment: <InputAdornment position="start">
                                            <ButtonSpinner size="small" onAction={this.getIngredients}>Rechercher</ButtonSpinner>
                                        </InputAdornment>
                                    }}
                                />
                            </Grid>
                            {food ? Object.keys(food).length > 0 ? (
                                <>
                                <Grid item xs="12" sm={8} md="8">
                                    <Autocomplete fullWidth id={"input-ing-"+repas.id} options={ingredientsList}
                                        onChange={(event, value) => this.onChangeFoodSelect(value.value)}
                                        getOptionLabel={(option) => option.label}
                                        renderInput={(params) => <TextField {...params} variant="outlined" label={"Choisir un ingrédient (Résultat(s):"+Object.keys(food).length+")"} />}
                                    />
                                </Grid>
                                <Grid item xs="12" sm={4}>
                                    <TextField fullWidth label="Quantité" id={"input-quantity-ing-"+repas.id} variant="outlined"
                                        InputProps={{
                                            endAdornment: <InputAdornment position="start">{currentFoodSelect.unit}</InputAdornment>,
                                        }}
                                        onChange={(e) => {
                                            this.setState({currentIngQuantityEnter: parseFloat(e.target.value)})
                                        }}
                                    />
                                </Grid>
                                <Grid item xs="12">
                                    <Button color="primary" variant="contained" onClick={this.addIngredient}>Ajouter cet ingrédient</Button>
                                </Grid>
                                </>
                            ) : (<p className={{color: "red"}}>Aucun ingrédient trouvé</p>) : ""}
                            
                            
                            <Grid item xs="12">
                                <TextField fullWidth id={"input-rec-search-"+repas.id} label="Ajouter une recette" variant="outlined"
                                    helperText={"Si votre recette n'existe pas ajouter la dans le menu \"Recettes\"."}
                                    margin="normal" InputLabelProps={{ shrink: true }} onChange={(e) => this.setState({search_rec: e.target.value})}
                                    InputProps={{
                                        endAdornment: <InputAdornment position="start">
                                            <ButtonSpinner size="small" onAction={this.getRecettes}>Rechercher</ButtonSpinner>
                                        </InputAdornment>
                                    }}
                                />
                            </Grid>
                            {recette ? Object.keys(recette).length > 0 ? (
                                <>
                                <Grid item xs="12" sm={8}>
                                    <Autocomplete fullWidth id={"input-rec-"+repas.id} options={recettesList}
                                        onChange={(event, value) => this.onChangeRecSelect(value.value)}
                                        getOptionLabel={(option) => option.label}
                                        renderInput={(params) => <TextField {...params} variant="outlined" label={"Choisir une recette (Résultat(s):"+Object.keys(recette).length+")"} />}
                                    />
                                </Grid>
                                <Grid item xs="12" sm={4}>
                                    <TextField fullWidth label="Quantité" id={"input-quantity-rec-"+repas.id} variant="outlined"
                                        InputProps={{
                                            endAdornment: <InputAdornment position="start">personne(s)</InputAdornment>,
                                        }}
                                        onChange={(e) => {
                                            this.setState({currentRecQuantityEnter: parseFloat(e.target.value)})
                                        }}
                                    />
                                </Grid>
                                <Grid item xs="12">
                                    <Button color="primary" variant="contained" onClick={this.addRecette}>Ajouter cette recette</Button>
                                </Grid>
                                </>
                            ) : <p className={{color: "red"}}>Aucune recette trouvé</p> : ""}
                        </Grid>
                    </Grid>
                    <Grid item xs>
                        <Grid container direction="column" justifyContent="center" alignItems="stretch" spacing={2}>
                            <Grid item xs>
                                <Card elevation={6}>
                                    <CardHeader title="Ingrédients" titleTypographyProps={{variant: "span"}}/>
                                    <CardContent>
                                    {Object.keys(repas.elements).length > 0 ? (
                                        <TableContainer>
                                            <Table aria-label="Table recettes" size="small">
                                            <TableHead>
                                                <TableRow>
                                                <TableCell>Nom</TableCell>
                                                <TableCell align="right" style={{ width: 50 }}>Quantité</TableCell>
                                                <TableCell align="left" style={{ width: 50 }}>Unité</TableCell>
                                                <TableCell style={{ width: 50 }}></TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {Object.keys(repas.elements).map(key => (
                                                    <TableRow key={key}>
                                                        <TableCell component="th" scope="row">{repas.elements[key].element.name}</TableCell>
                                                        <TableCell align="right">
                                                            <InputBase type="number" value={repas.elements[key].quantity} onChange={e => this.onChangeIngredient(e, key)}/>
                                                        </TableCell>
                                                        <TableCell align="left">{repas.elements[key].element.unit}</TableCell>
                                                        <TableCell>
                                                            <IconButton size="small" color="error" aria-label="Supprimer" onClick={(e) => this.delIngredient(key)}>
                                                                <DeleteIcon color="error"/>
                                                            </IconButton>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                            </Table>
                                        </TableContainer>
                                    ) : "Aucun ingrédient"}
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs spacing={2}>
                                <Card elevation={6}>
                                    <CardHeader title="Recettes" titleTypographyProps={{variant: "span"}}/>
                                    <CardContent>
                                    {Object.keys(repas.recettes).length > 0 ? (
                                        <TableContainer>
                                            <Table aria-label="Table recettes" size="small">
                                            <TableHead>
                                                <TableRow>
                                                <TableCell>Nom</TableCell>
                                                <TableCell align="right" style={{ width: 50 }}>Quantité</TableCell>
                                                <TableCell align="left" style={{ width: 50 }}></TableCell>
                                                <TableCell style={{ width: 50 }}></TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {Object.keys(repas.recettes).map(key => (
                                                    <TableRow key={key}>
                                                        <TableCell component="th" scope="row">{repas.recettes[key].element.name}</TableCell>
                                                        <TableCell align="right">
                                                            <InputBase type="number" value={repas.recettes[key].quantity} onChange={e => this.onChangeRecette(e, key)}/>
                                                        </TableCell>
                                                        <TableCell align="left">personnes(s)</TableCell>
                                                        <TableCell>
                                                            <IconButton size="small" color="error" aria-label="Supprimer" onClick={(e) => this.delRecette(key)}>
                                                                <DeleteIcon color="error"/>
                                                            </IconButton>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                            </Table>
                                        </TableContainer>
                                    ) : "Aucune recette"}
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </RequestModal>
        )
    }
}
RepasFormModal.defaultProps = {
    modal: {
        modal_key: "repas-form", title:"Formulaire de repas", btn_title:"Appliquer", btn_success: "Appliquer"
    }
  }

export default RepasFormModal