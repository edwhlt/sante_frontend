import React, {useState} from 'react';
import RequestModal from '../utils/RequestModal'

import {
    InputBase,
    CardContent,
    Grid,
    CardHeader,
    Card,
    Divider,
    TextField,
    InputAdornment,
    Button,
    IconButton,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TableContainer,
    lighten, darken
} from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import ButtonSpinner from '../utils/material/ButtonSpinner';
import DeleteIcon from '@mui/icons-material/Delete';
import {styled} from "@mui/material/styles";

function DayRepasForm({ onApply, getDefaultSelectValue, name, id_repas, dayRang, id_week, repasList, size, startIcon, modal }){
    const [rname, setRName] = useState(name);
    const [idRepas, setIdRepas] = useState(id_repas);

    const reset = () => {
        setRName(name);
        setIdRepas(id_repas);
    }

    const onChangeRepas = (id_repas) => setIdRepas(id_repas);
    const onChangeName = (name) => setRName(name);

    return (
        <RequestModal mode="icon" size={size} startIcon={startIcon} title={modal.title} btn_title={modal.btn_title} btn_success={modal.btn_success}
                      onClose={reset} onSuccess={() => onApply(name, rname, idRepas)}>
            <Grid container direction="row" spacing={2}>
                <Grid item xs={12}>
                    <TextField label="Saisissez un nom" variant="outlined" value={rname} onChange={(event) => onChangeName(event.target.value)}/>
                </Grid>

                <Grid item xs={12}>
                    <Autocomplete
                        id={"day"+id_week+"-"+dayRang}
                        options={repasList.sort((a, b) => -b.label[0].localeCompare(a.label[0]))}
                        groupBy={(option) => option.label[0]}
                        defaultValue={getDefaultSelectValue ? getDefaultSelectValue(name) : null}
                        onChange={(event, value) => {
                            if(value) onChangeRepas(value.value);
                            else onChangeRepas(null);
                        }}
                        getOptionLabel={(option) => option.label}
                        renderInput={(params) => <TextField {...params} variant="outlined" label={"Choisir un repas (Résultat(s):"+Object.keys(repasList).length+")"} />}
                    />
                </Grid>
            </Grid>
        </RequestModal>
    )

}


DayRepasForm.defaultProps = {
    modal: {
        modal_key: "day-repas-form", title:"Formulaire de repas journalier", btn_title:"Appliquer", btn_success: "Appliquer"
    }
}

export default DayRepasForm