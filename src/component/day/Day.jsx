import React, {useState, useEffect, useCallback} from 'react';
import NutrimentsTable from '../utils/NutrimentsTable';
import DayRepasForm from './DayRepasForm';
import ConfirmModal from '../utils/material/ConfirmModal';

import AddIcon from '@mui/icons-material/Add';
import {Grid, Card, CardContent, CardHeader, Divider} from '@mui/material';
import { List, ListItem, ListItemText } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FastFoodIcon from "@mui/icons-material/Fastfood";
import {useSnackbar} from "notistack";
import {addOrUpdateDayRepas, deleteRepasDay, getNutrimentsDayWeek, getNutrimentsWeek} from "../../RESTApi";

const Days = {
    0: "Lundi", 1: "Mardi", 2: "Mercredi", 3: "Jeudi", 4: "Vendredi", 5: "Samedi", 6: "Dimanche"
}


function Day({ id_profil, week, dayRang, repasList }) {
    const [day_name] = useState(Days[dayRang]);
    const [day, setDay] = useState(undefined);

    const sortDay = useCallback(() => {
        const elements = Object.entries(day.elements).sort((a, b) => a[0].localeCompare(b[0]));
        setDay({...day, elements: Object.fromEntries(elements)});
    }, [day])

    useEffect(() => {
        if(week.elements) setDay(week.elements[dayRang]);
        if(day) sortDay();
    }, [day, dayRang, sortDay, week.elements]);

    const addOrUpdateRepasDay = (last_name, name, id_repas) => {
        return addOrUpdateDayRepas(id_profil, week.id, dayRang, last_name, name, id_repas).then(data => {
            setDay(data, () => {
                if(day) sortDay();
            });
        })
    }

    const del = (repas_name) => {
        return deleteRepasDay(id_profil, week.id, dayRang, repas_name).then(data => {
            const newDay = {...day};
            delete newDay.elements[repas_name];
            setDay(newDay);
        })
    }

    const getDefaultSelectValue = (repas_name) => {
        return Object.values(repasList).find(repas => repas.value === day.elements[repas_name].id);
    }

    return (
        <Grid item xs>
            <Card elevation={3}>
                <CardHeader title={day_name} action={
                    <>
                        {day && (
                            <NutrimentsTable nutriments={day.nutriments} updateNutriments={() => getNutrimentsDayWeek(id_profil, week.id, dayRang)} sideCanvasParams={{
                                color: "secondary",
                                mode:"icon",
                                startIcon: (<FastFoodIcon fontSize="small" />),
                                size:"small",
                                title: "Nutriments",
                                canvas_key: "nutriments-"+week.id+"-"+dayRang
                            }}/>
                        )}

                        <DayRepasForm startIcon={<AddIcon />} title="Ajouter un repas" btn_title="Ajouter" id_week={week.id} dayRang={dayRang} onApply={addOrUpdateRepasDay} modal={
                            {modal_key: `ajout-${week.id}-${dayRang}-repas`, title: "Ajouter un repas", btn_title: "Ajouter", btn_success: "Ajouter"}
                        } repasList={repasList}>

                        </DayRepasForm>
                    </>
                } titleTypographyProps={{variant: "h6"}}/>
                <Divider/>
                <CardContent>
                    <Grid container direction="column" spacing={1}>
                        <List dense={true}>
                            {
                                day && day.elements ? Object.keys(day.elements).map(name => (
                                    <ListItem key={`week-${week.id}-${dayRang}-${name}`} secondaryAction={
                                        <>
                                            <DayRepasForm startIcon={<EditIcon fontSize="small"/>} size="small" title="Modifier le repas" btn_title="Modifier"
                                                          id_week={week.id} dayRang={dayRang} name={name} id_repas={day.elements[name].id}
                                                          onApply={addOrUpdateRepasDay}
                                                          modal={{modal_key: `edit-${week.id}-${dayRang}-${name}`, title: "Modifier le repas", btn_title: "Modifier", btn_success: "Confirmer"}}
                                                          repasList={repasList} getDefaultSelectValue={getDefaultSelectValue}>
                                            </DayRepasForm>
                                            <ConfirmModal color="error" mode="icon" size="small" startIcon={<DeleteIcon fontSize="small"/>} modal_key={"del-repas-day-"+week.id+"-"+dayRang+"-"+name} title="Supprimer le repas" btn_title="Supprimer" onSuccess={() => del(name)}>
                                                Etes-vous sur de vouloir supprimer : {name}
                                            </ConfirmModal></>
                                    }>
                                        <ListItemText
                                            primary={name}
                                            secondary={day.elements[name].name}
                                        />
                                    </ListItem>
                                )) : (<span style={{ textAlign: "center", width: "100%"}}>Aucune repas ajouté ici</span>)
                            }
                        </List>
                    </Grid>
                </CardContent>
            </Card>
        </Grid>
    )

}

export default Day
