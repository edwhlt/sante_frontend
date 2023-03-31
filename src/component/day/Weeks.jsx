import {
    Box,
    Card, CardActions,
    Collapse,
    Grid,
    IconButton, LinearProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow, TextField
} from "@mui/material";
import Paper from "@mui/material/Paper";
import React, {useCallback, useEffect, useState} from "react";
import RefreshIcon from "@mui/icons-material/Refresh";
import ConfirmModal from "../utils/material/ConfirmModal";
import AddIcon from "@mui/icons-material/Add";
import CustomTable from "../utils/material/CustomTable";
import ProfilFormModal from "../profil/ProfilFormModal";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ListAltIcon from "@mui/icons-material/ListAlt";
import BackupTableIcon from "@mui/icons-material/BackupTable";
import Tooltip from "@mui/material/Tooltip";
import AutoAwesomeMosaicIcon from "@mui/icons-material/AutoAwesomeMosaic";
import Day from "./Day";
import FullScreenDialog from "../utils/FullScreenModal";
import NutrimentsTable from "../utils/NutrimentsTable";
import FastFoodIcon from "@mui/icons-material/Fastfood";
import {deleteWeek, getNutrimentsWeek, getRepasListForWeek} from "../../RESTApi";
import * as RESTApi from "../../RESTApi";
import useMediaQuery from "@mui/material/useMediaQuery";
import {useTheme} from "@mui/material/styles";


const Days = {
    0: "Lundi", 1: "Mardi", 2: "Mercredi", 3: "Jeudi", 4: "Vendredi", 5: "Samedi", 6: "Dimanche"
}

function Weeks({ profil }){
    const [weeks, setWeeks] = useState(null);
    const [weekName, setWeekName] = useState('');
    const [repasList, setRepasList] = useState(null);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const getWeeks = useCallback(() => {
        setWeeks(null)
        RESTApi.getWeeks(profil.id).then(setWeeks)
    }, [profil.id])

    const getWeek = (id_week) => {
        return RESTApi.getWeek(profil.id, id_week).then(data => {
            setWeeks({...weeks, [id_week]: data})
        })
    };

    const addWeek = () => {
        return RESTApi.addWeek(profil.id, weekName).then(data => {
            const newWeeks = {...weeks};
            newWeeks[data.id] = data;
            setWeeks({...weeks, [data.id]: data});
        })
    }

    const delWeek = (id) => {
        return deleteWeek(profil.id, id).then(() => {
            const newWeeks = {...weeks};
            delete newWeeks[id];
            setWeeks(newWeeks);
        })
    }

    const getRepasList = useCallback(() => {
        getRepasListForWeek(profil.id).then(data => {
            const list = [];
            // eslint-disable-next-line array-callback-return
            Object.keys(data).map((key) => {
                const r = data[key];
                list.push({label: r.name, value: r.id})
            })
            setRepasList(list);
        })
    }, [profil.id])
    
    useEffect(() => {
        getWeeks();
        getRepasList();
    }, [getRepasList, getWeeks])

    if (!weeks) {
        return (<LinearProgress color="secondary" />);
    }else{
        /*return (
            <Grid container direction="column" spacing={3}>
                <Grid item xs>
                    <Card>
                        <CardActions>
                            <IconButton onClick={getWeeks} aria-label="Recharger">
                                <RefreshIcon/>
                            </IconButton>
                            <ConfirmModal mode="icon" startIcon={<AddIcon />} title="Ajouter une semaine" btn_title="Ajouter une semaine" onSuccess={() => addWeek()}>
                                <TextField label="Choisir une lettre" variant="standard" value={weekName} onChange={(event) => {
                                    setWeekName(event.target.value)
                                }}/>
                            </ConfirmModal>
                        </CardActions>
                    </Card>
                </Grid>

                <Grid item xs>
                    {
                        (weeks && Object.keys(weeks).length > 0) ? (
                            <TableContainer component={Paper}>
                                <Table aria-label="collapsible table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell />
                                            <TableCell>Name</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {
                                            Object.keys(weeks).map(k => (
                                                <Week profil={profil} week={weeks[k]} repasList={repasList} delWeek={delWeek}/>
                                            ))
                                        }
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        ) : "Aucune semaine existante !"
                    }
                    
                </Grid>
            </Grid>
            

        )*/

        return (
            <Grid>
                <CustomTable
                    title={"Plannings de semaine"}
                    empty={"Aucune semaine"}
                    headCells={[
                        {
                            id: 'days',
                            align: 'left',
                            sortable: false,
                            filterable: false,
                            style: { width: isMobile ? 20 : 50 },
                            label: '',
                            cellRender: (row) => {

                                return (
                                    <FullScreenDialog mode="icon" size="small" startIcon={<AutoAwesomeMosaicIcon fontSize="small"/>} title={row.name} refresh={() => getWeek(row.id)}>

                                        <Box sx={{ margin: 1 }}>
                                            <Grid container spacing={2}>
                                                {
                                                    Object.keys(Days).map(key => (
                                                        <Day key={`week-${row.id}-${key}`} id_profil={profil.id} dayRang={key} week={weeks[row.id]} repasList={repasList}/>
                                                    ))
                                                }
                                            </Grid>
                                        </Box>
                                    </FullScreenDialog>
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
                            style: { width: isMobile ? 20 : 30 },
                            label: '',
                            getValue: (row) => row.nutriments,
                            cellRender: (row) => {
                                return (
                                    <NutrimentsTable nutriments={row.nutriments} updateNutriments={() => getNutrimentsWeek(profil.id, row.id)} sideCanvasParams={{
                                        color: "secondary",
                                        mode:"icon",
                                        startIcon: (<FastFoodIcon fontSize="small" />),
                                        size:"small",
                                        title: "Nutriments",
                                        canvas_key: "nutriments-"+row.id
                                    }}/>
                                )
                            }
                        },
                        {
                            id: 'excel',
                            align: 'left',
                            sortable: false,
                            filterable: false,
                            style: { width: isMobile ? 20 : 30 },
                            label: '',
                            cellRender: (row) => {
                                return (
                                    <IconButton aria-label="more" size="small" key={"Excel"} onClick={() => window.location = "https://sante.hedwin.fr/api/resource/excel/"+profil.id+"/"+row.id}>
                                        <BackupTableIcon fontSize="small"/>
                                    </IconButton>
                                )
                            }
                        },
                        {
                            id: 'quantity_week',
                            align: 'left',
                            sortable: false,
                            filterable: false,
                            style: { width: isMobile ? 20 : 30 },
                            label: '',
                            cellRender: (row) => {
                                return (
                                    <IconButton aria-label="more" size="small" key={"Liste des quantités"} onClick={() => window.location = "https://sante.hedwin.fr/api/resource/weeklyList/"+profil.id+"/"+row.id}>
                                        <ListAltIcon fontSize="small"/>
                                    </IconButton>
                                )
                            }
                        },
                        {
                            id: 'delete',
                            align: 'left',
                            sortable: false,
                            filterable: false,
                            style: { width: isMobile ? 20 : 30 },
                            label: '',
                            cellRender: (row) => {
                                return (
                                    <ConfirmModal mode="icon" size="small" startIcon={<DeleteIcon fontSize="small"/>} title="Supprimer une semaine" btn_title={"Supprimer la semaine "+row.name} onSuccess={() => delWeek(row.id)}>
                                        Etes-vous sur de vouloir supprimer la semaine {row.name}, tout les repas seront également supprimée !
                                    </ConfirmModal>
                                )
                            }
                        }
                    ]}
                    rows={Object.values(weeks)}
                    headActions={[
                        {
                            name: "Recharger",
                            content: (
                                <Tooltip title="Recharger">
                                    <IconButton onClick={getWeeks} aria-label="Recharger"><RefreshIcon/></IconButton>
                                </Tooltip>
                            )
                        },
                        {
                            name: "Ajouter un profil",
                            content: (
                                <ConfirmModal mode="icon" startIcon={<AddIcon />} title="Ajouter une semaine" btn_title="Ajouter une semaine" onSuccess={() => addWeek()}>
                                    <TextField label="Entrez un nom" variant="standard" value={weekName} onChange={(event) => {
                                        setWeekName(event.target.value)
                                    }}/>
                                </ConfirmModal>
                            )
                        }
                    ]}
                >
                </CustomTable>
            </Grid>


        )

    }
    
    

}

export default Weeks