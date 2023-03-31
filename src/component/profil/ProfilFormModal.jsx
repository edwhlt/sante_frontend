import React from 'react';
import RequestModal from '../utils/RequestModal'

import { InputBase, CardContent, Grid, CardHeader, Card, Divider, TextField, InputLabel, Select, FormControl, MenuItem } from '@mui/material';

class ProfilFormModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {profil: JSON.parse(JSON.stringify(props.profil))};

        this.reset = this.reset.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    reset(){
        this.setState({profil: JSON.parse(JSON.stringify(this.props.profil))})
    }

    onChange(k, v) {
        this.state.profil[k] = v;
        this.forceUpdate();
    }

    render() {
        const { profil } = this.state;

        return (
            <RequestModal mode="icon" size={this.props.size} startIcon={this.props.startIcon} modal_key={this.props.modal.modal_key} title={this.props.modal.title} btn_title={this.props.modal.btn_title} btn_success={this.props.modal.btn_success} 
                onClose={this.reset} onSuccess={() => this.props.onApply(profil)}>
                <Grid container direction="column" spacing={2}>
                    <Grid item container direction="row" spacing={2} xs>
                        <Grid item xs="12" sm={6} md="3">
                            <TextField fullWidth id={"input-"+profil.id+"-name"} label="Nom" value={profil.name}
                                onChange={e => this.onChange("name", e.target.value)} variant="outlined"/>
                        </Grid>
                        <Grid item xs="12" sm={6} md="3">
                            <TextField fullWidth type="number" id={"input-"+profil.id+"-weight"} label="Poids (kg)" value={profil.weight}
                                onChange={e => this.onChange("weight", e.target.value)} inputProps={{ step: 0.1 }} variant="outlined"/>
                        </Grid>
                        <Grid item xs="12" sm={6} md="3">
                            <TextField fullWidth type="number" id={"input-"+profil.id+"-size"} label="Taille (cm)" value={profil.size}
                                onChange={e => this.onChange("size", e.target.value)} inputProps={{ step: 0.1 }} variant="outlined"/>
                        </Grid>
                        <Grid item xs="12" sm={6} md="3">
                            <TextField fullWidth type="number" id={"input-"+profil.id+"-age"} label="Age" value={profil.age}
                                onChange={e => this.onChange("age", e.target.value)} variant="outlined"/>
                        </Grid>
                    </Grid>
                    
                    <Grid item container direction="row" spacing={2} xs>
                        <Grid item xs="12" sm={6} md="6">                            
                            <FormControl fullWidth variant="outlined">
                                <InputLabel htmlFor="genre-label">Genre</InputLabel>
                                <Select native inputProps={{ name: 'genre', id: 'genre-label' }} label="Genre"
                                    value={profil.sexe} onChange={e => this.onChange("sexe", e.target.value)}>
                                    <option value="0">Homme</option>
                                    <option value="1">Femme</option>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs="12" sm={6} md="6">
                            <FormControl fullWidth variant="outlined">
                                <InputLabel htmlFor="facteur-activity-label">Facteur d'activité</InputLabel>
                                <Select native inputProps={{ name: 'physical_activity', id: 'facteur-activity-label' }} label="Facteur d'activité"
                                    value={profil.physical_activity} onChange={e => this.onChange("physical_activity", e.target.value)}>
                                    <option value="1.375">Sédentaire</option>
                                    <option value="1.56">Activité physique légère</option>
                                    <option value="1.64">Activité physique modérée</option>
                                    <option value="1.82">Activité physique intense</option>
                                </Select>
                            </FormControl>
                        </Grid>
                        
                        <Grid item xs="12" sm={12} md="12">
                            <TextField fullWidth type="number" id={"input-"+profil.id+"-factor"} label="Multiplicateur (&lt;1 perte de poids, &gt;1 prise de poids)" 
                                value={profil.factor} onChange={e => this.onChange("factor", e.target.value)} inputProps={{ step: 0.01 }} variant="outlined"/>
                        </Grid>
                    </Grid>                                    
                </Grid>
            </RequestModal>
        );
    }
}
ProfilFormModal.defaultProps = {
    modal: {
        modal_key: "profil-form", title:"Formulaire de profil", btn_title:"Appliquer", btn_success: "Appliquer"
    }
  }

export default ProfilFormModal