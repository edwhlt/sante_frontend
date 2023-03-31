import React from 'react';
import SideCanvas from '../utils/material/SideCanvas'

import { Grid, FormControl, InputLabel, Select, TextField } from '@mui/material';
import ButtonSpinner from '../utils/material/ButtonSpinner';
import FoodBankIcon from '@mui/icons-material/FoodBank';
import {addFood} from "../../RESTApi";
import * as RESTApi from "../../RESTApi";

class FormFood extends React.Component{

    constructor(props) {
        super(props);
        this.state = {food: {unit: "g"}};

        this.reset = this.reset.bind(this);
        this.onChange = this.onChange.bind(this);
        this.addFood = this.addFood.bind(this);

        this.sideCanvas = React.createRef();
    }

    reset(){
        this.setState({food: {unit: "g"}})
    }
    
    onChange(k, v) {
        this.state.food[k] = v;
        this.forceUpdate();
    }

    addFood(){
        return RESTApi.addFood(this.state.food).then(() => {
            this.reset();
            this.sideCanvas.current.click();
        })
    }


    render(){
        const { food } = this.state;

        return (
            <SideCanvas startIcon={<FoodBankIcon/>} mode={this.props.mode} anchor="right" title="Ajouter un ingrédient" btn_title="Ajouter un ingrédient" closeRef={this.sideCanvas}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth id={"input-add-food-name"} label="Nom" value={food.name} variant="outlined"
                            onChange={e => this.onChange("name", e.target.value)}/>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth id={"input-add-food-code"} label="Code" value={food.code} variant="outlined"
                            onChange={e => this.onChange("code", e.target.value)}/>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl fullWidth variant="outlined">
                            <InputLabel htmlFor="unit-label">Choisir une unité</InputLabel>
                            <Select native inputProps={{ name: 'unit', id: 'unit-label' }} label="Choisir une unité"
                                value={food.unit} onChange={e => this.onChange("unit", e.target.value)}>
                                <option value="g">Gramme</option>
                                <option value="mL">Millilitre</option>
                                <option value="cas">Cuillere à soupe</option>
                                <option value="cac">Cuillere à café</option>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <ButtonSpinner variant="contained" color="primary" size="small" onAction={this.addFood}>Ajouter</ButtonSpinner>
                    </Grid>
                </Grid>
            </SideCanvas>
        )
    }
}

export default FormFood