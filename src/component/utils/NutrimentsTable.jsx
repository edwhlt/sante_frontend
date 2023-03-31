import React, {useEffect, useState} from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import LinearProgress from '@mui/material/LinearProgress';
import {IconButton, Switch, TextField} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import SortIcon from '@mui/icons-material/Sort';
import SideCanvas from "./material/SideCanvas";
import Divider from '@mui/material/Divider';
import Checkbox from "@mui/material/Checkbox";

const Nutriment = {
    "cholesterol": "Cholestérol (mg)",
    "polyols": "Polyols (g)",
    "zinc": "Zinc (mg)",
    "butyric-acid": "Acide butyrique (g)",
    "erum-proteins": "Protéines sériques (g)",
    "sucrose": "Sucrose (g)",
    "maltodextrins": "Maltodextrines (g)",
    "saturated-fat": "Graisses saturées (g)",
    "stearic-acid": "Acide stéarique (g)",
    "lignoceric-acid": "Acide lignocérique (g)",
    "palmitic-acid": "Acide palmitique (g)",
    "polyunsaturated-fat": "Graisses polyinsaturées (g)",
    "salt": "Sel (g)",
    "magnesium": "Magnésium (mg)",
    "ph": "PH",
    "glucose": "Glucose (g)",
    "vitamin-b1": "Vitamine B1 (mg)",
    "vitamin-b2": "Vitamine B2 (mg)",
    "pantothenic-acid": "Acide pantothénique (mg)",
    "caprylic-acid": "Acide caprylique (g)",
    "proteins": "Protéines (g)",
    "energy-kcal": "Énergie en kcal (kcal)",
    "behenic-acid": "Acide béhénique (g)",
    "gamma-linolenic-acid": "Acide gamma-linolénique (g)",
    "manganese": "Manganèse (mg)",
    "elaidic-acid": "Acide élaïdique (g)",
    "iron": "Fer (mg)",
    "lactose": "Lactose (g)",
    "arachidic-acid": "Acide arachidique (g)",
    "erucic-acid": "Acide érucique (g)",
    "water": "Eau (g)",
    "vitamin-pp": "Vitamine PP (mg)",
    "fluoride": "Fluor (mg)",
    "fruits-vegetables-nuts": "Fruits, légumes et noix (g)",
    "sugars": "Sucres (g)",
    "copper": "Cuivre (mg)",
    "monounsaturated-fat": "Graisses monounsaturées (g)",
    "vitamin-e": "Vitamine E (mg)",
    "iodine": "Iode (µg)",
    "sodium": "Sodium (mg)",
    "vitamin-b9": "Vitamine B9 (µg)",
    "retinol": "Rétinol (µg)",
    "alcohol": "Alcool (g)",
    "vitamin-k": "Vitamine K (µg)",
    "vitamin-c": "Vitamine C (mg)",
    "biotin": "Biotine (µg)",
    "melissic-acid": "Acide mélissique (g)",
    "molybdenum": "Molybdène (µg)",
    "nutrition-score-uk": "Score nutritionnel UK",
    "vitamin-b12": "Vitamine B12 (µg)",
    "nervonic-acid": "Acide nervonique (g)",
    "fructose": "Fructose (g)",
    "chloride": "Chlorure (mg)",
    "nucleotides": "Nucléotides (mg)",
    "casein": "Caséine (g)",
    "caproic-acid": "Acide caproïque (g)",
    "fiber": "Fibres (g)",
    "phosphorus": "Phosphore (mg)",
    "maltose": "Maltose (g)",
    "fat": "Graisses (g)",
    "myristic-acid": "Acide myristique (g)",
    "omega-9-fat": "Graisses oméga-9 (g)",
    "carbon-footprint": "Empreinte carbone (kg CO2 eq)",
    "gondoic-acid": "Acide gondoïque (g)",
    "dihomo-gamma-linolenic-acid": "Acide dihomo-gamma-linolénique (g)",
    "energy": "Énergie (kJ)",
    "mead-acid": "Acide mead (g)",
    "selenium": "Sélénium (µg)",
    "carbohydrates": "Glucides (g)",
    "omega-6-fat": "Graisses oméga-6 (g)",
    "energy-kj": "Énergie en kJ (kJ)",
    "capric-acid": "Acide caprique (g)",
    "alpha-linolenic-acid": "Acide alpha-linolénique (g)",
    "potassium": "Potassium (mg)",
    "cerotic-acid": "Acide cerotique (g)",
    "trans-fat": "Graisses trans (g)",
    "vitamin-b6": "Vitamine B6 (mg)",
    "montanic-acid": "Acide montanique (g)",
    "starch": "Amidon (g)",
    "arachidonic-acid": "Acide arachidonique (g)",
    "linoleic-acid": "Acide linoléique (g)",
    "nutrition-score-fr": "Score nutritionnel fr",
    "taurine": "Taurine (mg)",
    "caffeine": "Caféine (mg)",
    "oleic-acid": "Acide oléique (g)",
    "silica": "Silice (mg)",
    "docosahexaenoic-acid": "Acide docosahexaénoïque (g)",
    "calcium": "Calcium (mg)",
    "omega-3-fat": "Graisses oméga-3 (g)",
    "eicosapentaenoic-acid": "Acide eicosapentaénoïque (g)",
    "vitamin-a": "Vitamine A (µg)",
    "lauric-acid": "Acide laurique (g)",
    "vitamin-d": "Vitamine D (µg)",
    "bicarbonate": "Bicarbonate (mg)",
    "chromium": "Chrome (µg)"
}


function NutrimentsTable({ nutriments, updateNutriments, sideCanvasParams }) {
    const [nut, setNutriments] = useState(nutriments);
    const [sortBy, setSortBy] = useState('asc');
    const [all, setAll] = useState(true);

    const sort = () => {
        let newNut = Object.entries(nut)
            .sort(([a,],[b,]) => (sortBy === 'asc' ? Nutriment[a].localeCompare(Nutriment[b]) : Nutriment[b].localeCompare(Nutriment[a])))
            .reduce((result, [key, value]) => {
                result[key] = value;
                return result;
        }, {});
        setNutriments(newNut);
        setSortBy(sortBy === 'asc' ? 'dsc' : 'asc');
    }


    const filter = (filterText) => {
        const newNut = Object.fromEntries(Object.entries(nutriments).filter(([key,]) => {
            const funcFil = (str) => str.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
            return funcFil(Nutriment[key]).includes(funcFil(filterText))
        }));
        setNutriments(newNut);
    }

    const update = () => {
        setNutriments(null);
        updateNutriments().then((r) => {
            setNutriments(r.nutriments);
        })
    }

    /*useEffect(() => {
        setNutriments(nutriments);
    }, [nutriments])*/

    return (
        <SideCanvas {...sideCanvasParams} btn_title="Nutriments"
                    actions={(<>
                            <Switch checked={all} onChange={(e) => setAll(!all)} defaultChecked color="secondary" />
                            <IconButton onClick={update} aria-label="Recharger"><RefreshIcon/></IconButton>
                            <IconButton onClick={sort} aria-label="Trier par ordre alphabétique"><SortIcon/></IconButton>
                        </>
                    )}>
            <TextField variant="filled" style={{ width: "100%" }} label="Filtrer" size="small" onChange={(e) => filter(e.target.value)}></TextField>
            <Divider variant="middle" />
            <TableContainer>
                {
                    !nut ? (
                        <LinearProgress color="secondary" />
                    ) : (<>

                        <Table size="small" >
                            <TableHead>
                                <TableRow>
                                    <TableCell>Propriétée</TableCell>
                                    <TableCell align="right">Valeur</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>

                                {
                                    all ? Object.entries(nut).map( ([k, v]) => (
                                        <TableRow key={k}>
                                            <TableCell component="th" scope="row">{Nutriment[k]}</TableCell>
                                            <TableCell align="right">{(v/4.184).toFixed(2)}</TableCell>
                                        </TableRow>
                                    )) : Object.entries(nut).filter(([k, v]) => {
                                        return k === "energy-kcal" || k === "proteins" || k === "carbohydrates" || k === "fat"
                                    }).map( ([k, v]) => (
                                        <TableRow key={k}>
                                            <TableCell component="th" scope="row">{Nutriment[k]}</TableCell>
                                            <TableCell align="right">{(v/4.184).toFixed(2)}</TableCell>
                                        </TableRow>
                                    ))
                                }
                            </TableBody>
                        </Table>
                    </>)
                }
            </TableContainer>
        </SideCanvas>

    )
}

export default NutrimentsTable
