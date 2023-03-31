import React from 'react';
import RequestModal from '../utils/RequestModal'

import { InputBase, CardContent, Grid, CardHeader, Card, Divider, TextField, InputAdornment, Button, IconButton, Table, TableHead, TableRow, TableCell, TableBody, TableContainer } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import ButtonSpinner from '../utils/material/ButtonSpinner';
import DeleteIcon from '@mui/icons-material/Delete';
import * as RESTApi from "../../RESTApi";

class RecetteFormModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {recette: JSON.parse(JSON.stringify(props.recette)), search_ing: "", currentFoodSelect: undefined, currentQuantityEnter: 0};

        this.reset = this.reset.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onChangeIngredient = this.onChangeIngredient.bind(this);
        this.getIngredients = this.getIngredients.bind(this);
        this.addIngredient = this.addIngredient.bind(this);
        this.delIngredient = this.delIngredient.bind(this);

        this.onChangeFoodSelect = (k) => {
            this.setState({currentFoodSelect: this.state.food[k]})
        }
    }

    reset(){
        this.setState({recette: JSON.parse(JSON.stringify(this.props.recette))})
    }

    onChange(k, v) {
        this.state.recette[k] = v;
        this.forceUpdate();
    }

    onChangeIngredient(e, key){
        this.state.recette.elements[key].quantity = parseFloat(e.target.value)
        this.forceUpdate();
    }

    addIngredient(){
        const id = this.state.currentFoodSelect.id;
        const quantity = this.state.currentQuantityEnter;

        this.state.recette.elements[id] =  {
            "quantity": parseFloat(quantity), 
            "element": {
                "name": this.state.food[id].name, "unit": this.state.food[id].unit, "id": this.state.food[id].id
            }
        }
        this.forceUpdate();
    }

    delIngredient(id){
        delete this.state.recette.elements[id];
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

    render() {
        const { recette, food, currentFoodSelect } = this.state

        const ingredientsList = [];

        if(food){
            // eslint-disable-next-line array-callback-return
            Object.keys(food).map(k => {
                ingredientsList.push({value: k, label: food[k].name})
            })
        }

        return (
            <RequestModal mode="icon" size={this.props.size} startIcon={this.props.startIcon} title={this.props.modal.title} btn_title={this.props.modal.btn_title} btn_success={this.props.modal.btn_success}
                onClose={this.reset} onSuccess={() => this.props.onApply(recette)}>
                <Grid container direction="column" spacing={2}>
                    <Grid item xs>
                        <Card variant="outlined">
                            <CardHeader title="Ingrédients" titleTypographyProps={{variant: "h6"}}/>
                            <Divider/>
                            <CardContent>
                            {Object.keys(recette.elements).length > 0 ? (
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
                                        {Object.keys(recette.elements).map(key => (
                                            <TableRow key={key}>
                                                <TableCell component="th" scope="row">{recette.elements[key].element.name}</TableCell>
                                                <TableCell align="right">
                                                    <InputBase type="number" value={recette.elements[key].quantity} onChange={e => this.onChangeIngredient(e, key)}/>
                                                </TableCell>
                                                <TableCell align="left">{recette.elements[key].element.unit}</TableCell>
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
                    <Grid item xs>
                        <Grid container direction="row" spacing={2}>
                            <Grid item xs="12" sm={6} md>
                                <TextField fullWidth id={"input-"+recette.id+"-name"} label="Nom" value={recette.name} variant="outlined"
                                    onChange={e => this.onChange("name", e.target.value)}/>
                            </Grid>
                            <Grid item xs="12" sm={6} md>
                                <TextField fullWidth id={"input-"+recette.id+"-guest"} type="number" label="Nombre de personne" value={recette.guest} variant="outlined"
                                    onChange={e => this.onChange("guest", e.target.value)}/>
                            </Grid>
                            <Grid item xs="12" sm={6} md>
                                <TextField fullWidth id={"input-"+recette.id+"-recette"} multiline label="Description / Recette" value={recette.recette} variant="outlined"
                                    onChange={e => this.onChange("recette", e.target.value)}/>
                            </Grid>
                            <Grid item xs="12">
                                <TextField fullWidth id={"input-food-search-"+recette.id} label="Ajouter un ingrédient" variant="outlined"
                                    helperText="Si votre ingrédient n'existe pas ajouter le dans le menu principal (Tableau de bord)."
                                    margin="normal" InputLabelProps={{ shrink: true }} onChange={(e) => this.setState({search_ing: e.target.value})}
                                    InputProps={{
                                        endAdornment: <InputAdornment position="start">
                                            <ButtonSpinner size="small" onAction={this.getIngredients}>Rechercher</ButtonSpinner>
                                        </InputAdornment>
                                    }}
                                />
                            </Grid>
                            <Divider/>
                            {food ? Object.keys(food).length > 0 ? (
                                <>
                                <Grid item xs="12" sm={8} md="8">
                                    <Autocomplete fullWidth id={"input-ing-"+recette.id} options={ingredientsList}
                                        onChange={(event, value) => this.onChangeFoodSelect(value.value)}
                                        getOptionLabel={(option) => option.label}
                                        renderInput={(params) => <TextField {...params} variant="outlined" label={"Choisir un ingrédient (Résultat(s):"+Object.keys(food).length+")"} />}
                                    />
                                </Grid>
                                <Grid item xs="12" sm={8} md="4">
                                    <TextField fullWidth label="Quantité" id={"input-quantity-ing-"+recette.id} variant="outlined"
                                        InputProps={{
                                            endAdornment: <InputAdornment position="start">{currentFoodSelect.unit}</InputAdornment>,
                                        }}
                                        onChange={(e) => {
                                            this.setState({currentQuantityEnter: parseFloat(e.target.value)})
                                        }}
                                    />
                                </Grid>
                                <Grid item xs="12">
                                    <Button color="primary" variant="contained" onClick={this.addIngredient}>Ajouter cet ingrédient</Button>
                                </Grid>
                                </>
                        ) : (<p className={{color: "red"}}>Aucun résultat</p>) : ""}
                        </Grid>
                    </Grid>
                </Grid>
            </RequestModal>

        )
    }
}
RecetteFormModal.defaultProps = {
    modal: {
        modal_key: "recette-form", title:"Formulaire de recette", btn_title:"Appliquer", btn_success: "Appliquer"
    }
}

export default RecetteFormModal