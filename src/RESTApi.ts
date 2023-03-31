import Cookies from 'js-cookie';
import axios from "axios";

const hostname = "https://sante.hedwin.fr/";
const auth="abcd";


export async function addFood(x: object): Promise<Object> {
    try {
        const response = await axios.post(hostname+"api/food", x, {
            headers: {'Content-Type': 'application/json', 'Authorization': `Bearer abcd`}
        });
        return response.data;
    } catch (e) {
        return Promise.reject(e);
    }
}
export async function getIngredient(name: string){
    try {
        const response = await axios.get(hostname+`api/food?name=${name}`, {
            headers: {'Authorization': `Bearer abcd`}
        });
        return response.data;
    } catch (e) {
        return Promise.reject(e);
    }
}
export async function getRecette(id_profil: string, name: string): Promise<Response> {
    try {
        const response = await axios.get(hostname + "api/recette/" + id_profil + "/filter?name=" + name, {
            headers: {'Authorization': `Bearer abcd`}
        });
        return response.data;
    } catch (e) {
        return Promise.reject(e);
    }
}
export function getNutriments(type: string, idProfil: string, id: string) : Promise<Object> {
    return fetch(hostname+"api/"+type+"/"+idProfil+"/"+id+"?nutriments=true", {
        headers: {
            'Authorization': 'Bearer '+auth
        },
    })
    .then(res => res.json())
    .then((result) => {
        return result.nutriments
    })
    .catch(error => console.log(error));
}


// CONNECTION / USERS

export function connection(email: string, password: string, remember: boolean): Promise<Object> {
    return fetch(hostname+"api/user/login?email="+email+"&password="+password, {
        method: 'PUT',
        headers: {
            'Authorization': 'Bearer '+auth
        },
    })
    .then(async response => {
        const isJson = response.headers.get('content-type')?.includes('application/json');
        const data = isJson && await response.json();

        // check for error response
        if (!response.ok) {
            const error = (data && data.message) || response.status;
            return Promise.reject(error);
        }
        if(data != null) {
            if(remember) Cookies.set("login_key", data.login_key,{expires: 7})
            return data;
        }
        else return Promise.reject("Mot de passe ou email incorrect");
    })
}
export function creacteUserAndConnect(name: string, email: string, password: string, remember: boolean): Promise<Object>{
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer '+auth },
        body: JSON.stringify({
            "name": name, "email": email, "password": password
        })
    };
    return fetch(hostname+"api/user", requestOptions)
        .then(async response => {
            const isJson = response.headers.get('content-type')?.includes('application/json');
            const data = isJson && await response.json();

            // check for error response
            if (!response.ok) {
                // get error message from body or default to response status
                const error = (data && data.message) || response.status;
                return Promise.reject(error);
            }
            if(Object.keys(data).length === 1) {
                if(remember) Cookies.set("login_key", data.login_key,{expires: 7})
                return data;
            }
        });
}
export function autoReconnect(): Promise<Object> {
    const login_key = Cookies.get('login_key');

    if(!login_key) return Promise.reject("Aucun cookie d'utilisateur trouvé !");

    return fetch(hostname+"api/user/login?login_key="+login_key, {
        headers: {
            'Authorization': 'Bearer '+auth
        },
    })
    .then(async response => {
        const isJson = response.headers.get('content-type')?.includes('application/json');
        const data = isJson && await response.json();

        // check for error response
        if (!response.ok) {
            const error = (data && data.message) || response.status;
            return Promise.reject(error);
        }
        if(data != null){
            return data;
        }
    });
}
export async function getProfiles(id_user: string): Promise<Object> {
    try {
        const response = await axios.get(`https://sante.hedwin.fr/api/profil?id_user=${id_user}`, {
            headers: {'Authorization': `Bearer abcd`}
        });
        return response.data;
    } catch (e) {
        return Promise.reject(e);
    }
}
export async function addProfile(profil: any): Promise<Object> {
    try {
        const response = await axios.post(`https://sante.hedwin.fr/api/profil`, profil, {
            headers: {'Content-Type': 'application/json', 'Authorization': `Bearer abcd`}
        });
        return response.data;
    } catch (e) {
        return Promise.reject(e);
    }
}
export async function updatePorfile(profil: any){
    try {
        const response = await axios.put(`https://sante.hedwin.fr/api/profil`, profil, {
            headers: {'Content-Type': 'application/json', 'Authorization': `Bearer abcd`}
        });
        return response.data;
    } catch (e) {
        return Promise.reject(e);
    }
}
export async function deleteProfile(id_profil: string) {
    try {
        const response = await axios.delete(`https://sante.hedwin.fr/api/profil/${id_profil}`, {
            headers: {'Authorization': `Bearer abcd`}
        });
        return response.data;
    } catch (e) {
        return Promise.reject(e);
    }
}

// REPAS

export async function getAllRepas(id_profil: string, wNutriment: boolean): Promise<Object> {
    try {
        const response = await axios.get(hostname + "api/repas/" + id_profil + "?nutriments=" + (wNutriment ? "true" : "false"), {
            headers: {'Authorization': `Bearer abcd`}
        });
        const result = response.data;
        Object.keys(result).forEach(e => Object.assign(result[e], {fav: !Math.round(Math.random())}));
        return result;
    } catch (e) {
        return Promise.reject(e);
    }
}
export async function addRepas(id_profil: string, repas: any): Promise<Response> {
    try {
        const response = await axios.post(hostname + "api/repas/" + id_profil, repas, {
            headers: {'Content-Type': 'application/json', 'Authorization': `Bearer abcd`}
        });
        return response.data;
    } catch (e) {
        return Promise.reject(e);
    }
}
export async function getRepas(id_profil: string, id: string, wNutriment: boolean): Promise<Object> {
    try {
        const response = await axios.get(hostname + "api/repas/" + id_profil + "/" + id + "?nutriments=" + (wNutriment ? "true" : "false"), {
            headers: {'Authorization': `Bearer abcd`}
        });
        return response.data;
    } catch (e) {
        return Promise.reject(e);
    }
}
export function updateRepas(id_profil: string, repas: any): Promise<Response[]> {
    const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer '+auth },
        body: JSON.stringify(repas)
    };

    let fetches = [fetch(hostname+"api/repas/"+id_profil, requestOptions)];

    if(repas.elements){
        let deleted_ing_ids: any[] = [];
        // eslint-disable-next-line array-callback-return
        Object.keys(repas.elements).map(k => {
            if(!(k in repas.elements)) deleted_ing_ids.push(k);
        })
        if(deleted_ing_ids.length > 0) fetches.push(fetch(hostname+"api/repas/"+id_profil+"/"+repas.id+"/del_ing?ids="+deleted_ing_ids.join(","), {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer '+auth
            },
        }));
    }

    if(repas.recettes){
        let deleted_rec_ids: any[] = [];
        // eslint-disable-next-line array-callback-return
        Object.keys(repas.recettes).map(k => {
            if(!(k in repas.recettes)) deleted_rec_ids.push(k);
        })
        if(deleted_rec_ids.length > 0) fetches.push(fetch(hostname+"api/repas/"+id_profil+"/"+repas.id+"/del_rec?ids="+deleted_rec_ids.join(","), {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer '+auth
            },
        }));
    }

    return Promise.all(fetches);
}
export async function deleteRepas(id_profil: string, id: string): Promise<Response> {
    try {
        const response = await axios.delete(hostname + "api/repas/" + id_profil + "?id_repas=" + id, {
            headers: {'Authorization': `Bearer abcd`}
        });
        return response.data;
    } catch (e) {
        return Promise.reject(e);
    }
}
export async function getNutrimentsRepas(id_profil: string, id: string): Promise<Object> {
    try {
        const response = await axios.get(`https://sante.hedwin.fr/api/repas/${id_profil}/${id}?nutriments=true`, {
            headers: {'Authorization': `Bearer abcd`}
        });
        return response.data;
    } catch (e) {
        return Promise.reject(e);
    }
}

// RECETTES

export async function getRecettes(id_profil: string): Promise<Object> {
    try {
        const response = await axios.get(`https://sante.hedwin.fr/api/recette/${id_profil}?nutriments=true`, {
            headers: {'Authorization': `Bearer abcd`}
        });
        return response.data;
    } catch (e) {
        return Promise.reject(e);
    }
}
export async function addRecette(id_profil: string, recette: any): Promise<Object>{
    try {
        const response = await axios.post(`https://sante.hedwin.fr/api/recette/${id_profil}`, recette, {
            headers: {'Authorization': `Bearer abcd`}
        });
        return response.data;
    } catch (e) {
        return Promise.reject(e);
    }
}
export async function updateRecette(recette: any): Promise<Response[]> {

    const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(recette)
    };

    console.log(JSON.stringify(recette))
    let fetches = [await fetch("https://sante.hedwin.fr/api/recette/" + recette.id_profil, requestOptions)];


    if(recette.elements){
        let deleted_ids: string[] = [];
        // eslint-disable-next-line array-callback-return
        Object.keys(recette.elements).map(k => {
            if(!(k in recette.elements)) deleted_ids.push(k);
        })
        if(deleted_ids.length > 0) fetches.push(await fetch("https://sante.hedwin.fr/api/recette/" + recette.id_profil + "/" + recette.id + "/del_ing?ids=" + deleted_ids.join(","), {
            method: 'DELETE'
        }));
    }

    return Promise.all(fetches);
}
export async function delRecette(id_profil: string, id: string): Promise<Object>{
    try {
        const response = await axios.delete(`https://sante.hedwin.fr/api/recette/${id_profil}?id_recette=${id}`, {
            headers: {'Authorization': `Bearer abcd`}
        });
        return response.data;
    } catch (e) {
        return Promise.reject(e);
    }
}
export async function getNutrimentsRecette(id_profil: string, id: string): Promise<Object> {
    try {
        const response = await axios.get(`https://sante.hedwin.fr/api/recette/${id_profil}/${id}?nutriments=true`, {
            headers: {'Authorization': `Bearer abcd`}
        });
        return response.data;
    } catch (e) {
        return Promise.reject(e);
    }
}

// WEEK

export async function getRepasListForWeek(id_profil: string): Promise<Object> {
    try {
        const response = await axios.get(`https://sante.hedwin.fr/api/repas/${id_profil}`, {
            headers: {'Authorization': `Bearer abcd`}
        });
        return response.data;
    } catch (e) {
        return Promise.reject(e);
    }
}
export async function getWeeks(id_profil: string): Promise<Object> {
    try {
        const response = await axios.get(`https://sante.hedwin.fr/api/week/${id_profil}?nutriments=true`, {
            headers: {'Authorization': `Bearer abcd`}
        });
        return response.data;
    } catch (e) {
        return Promise.reject(e);
    }
}
export async function getWeek(id_profil: string, id_week: string) {
    try {
        const response = await axios.get(`https://sante.hedwin.fr/api/week/${id_profil}/${id_week}?nutriments=true`, {
            headers: {'Authorization': `Bearer abcd`}
        });
        return response.data;
    } catch (e) {
        return Promise.reject(e);
    }
}
export async function addWeek(id_profil: string, weekName: string): Promise<Object>{
    try {
        const response = await axios.post(`https://sante.hedwin.fr/api/week/${id_profil}?week_name=${weekName}`, {
            headers: {'Authorization': `Bearer abcd`}
        });
        return response.data;
    } catch (e) {
        return Promise.reject(e);
    }
}
export async function deleteWeek(id_profil: string, id: string): Promise<Object> {

    try {
        const response = await axios.delete(`https://sante.hedwin.fr/api/week/${id_profil}/${id}`, {
            headers: {'Authorization': `Bearer abcd`}
        });
        return response.data;
    } catch (e) {
        return Promise.reject(e);
    }
}
export function getNutrimentsWeek(id_profil: string, id_week: string): Promise<Response>{
    return fetch("https://sante.hedwin.fr/api/week/"+id_profil+"/"+id_week+"?nutriments=true")
        .then(res => res.json())
        .catch(error => console.warn(error));
}

// DAY

export function getNutrimentsDayWeek(id_profil: string, id_week: string, dayRang: string): Promise<Response>{
    return fetch("https://sante.hedwin.fr/api/week/"+id_profil+"/"+id_week+"/day/"+dayRang+"?nutriments=true")
        .then(res => res.json())
        .catch(error => console.warn(error));
}
export async function addOrUpdateDayRepas(id_profil: string, id_week: string, dayRang: string, last_name: string, name: string, id_repas: string): Promise<Object> {
    if (last_name === undefined) last_name = name;
    try {
        const response = await axios.put(`https://sante.hedwin.fr/api/week/${id_profil}/${id_week}/aou_repas_day?day=${dayRang}&last_name=${last_name}&name=${name}&id_repas=${id_repas}`, {
            headers: {'Authorization': `Bearer abcd`}
        });
        console.log(response.data)
        return response.data;
    } catch (e) {
        console.log(e)
        return Promise.reject(e);
    }
}
export async function deleteRepasDay(id_profil: string, id_week: string, dayRang: string, repas_name: string){
    console.log("test")
    return await axios.delete(`https://sante.hedwin.fr/api/week/${id_profil}/${id_week}/delete_repas?day=${dayRang}&repas_name=${repas_name}`, { method: 'DELETE'});
}


/*

import axios from 'axios';

const hostname = "http://sante.hedwin.fr/";
const auth = "abcd";

export async function addFood(x: object): Promise<Object> {
    try {
        const response = await axios.post(`${hostname}api/food`, x, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${auth}`
            }
        });
        return response.data;
    } catch (error) {
        return Promise.reject(error);
    }
}

export async function getNutriments(type: string, idProfil: string, id: string) : Promise<Object> {
    try {
        const response = await axios.get(`${hostname}api/${type}/${idProfil}/${id}?nutriments=true`);
        return response.data.nutriments;
    } catch (error) {
        return Promise.reject(error);
    }
}

// CONNECTION / USERS

export async function connection(email: string, password: string, remember: boolean): Promise<Object> {
    try {
        const response = await axios.put(`${hostname}api/user/login?email=${email}&password=${password}`, null, {
            headers: {'Authorization': `Bearer ${auth}`}
        });
        if (remember) {
            Cookies.set("login_key", response.data.login_key, { expires: 7 });
        }
        return response.data;
    } catch (error) {
        return Promise.reject(error);
    }
}

export async function creacteUserAndConnect(name: string, email: string, password: string, remember: boolean): Promise<Object>{
    try {
        const response = await axios.post(`${hostname}api/user`, { name, email, password }, {
            headers: {'Authorization': `Bearer ${auth}`}
        });
        if(remember) Cookies.set("login_key", response.data.login_key,{expires: 7});
        return response.data;
    } catch (error) {
        return Promise.reject(error);
    }
}

export async function autoReconnect(): Promise<Object> {
    const login_key = Cookies.get('login_key');
    if(!login_key) return Promise.reject("Aucun cookie d'utilisateur trouvé !");

    try {
        const response = await axios.put(`${hostname}api/user/login?login_key=${login_key}`, {
            headers: {'Authorization': `Bearer ${auth}`}
        });
        return response.data;
    } catch (error) {
        return Promise.reject(error);
    }
}

// REPAS

export async function getAllRepas(id_profil: string, wNutriment: boolean): Promise<Object> {
    try {
        const response = await axios.get(`${hostname}api/repas/${id_profil}?nutriments=${wNutriment ? "true" : "false"}`, {
            headers: {'Authorization': `Bearer ${auth}`}
        });
        return response.data;
    } catch (error) {
        return Promise.reject(error);
    }
}

export async function addRepas(id_profil: string, repas: any): Promise<Object> {
    try {
        const response = await axios.post(`${hostname}api/repas/${id_profil}`, repas, {
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${auth}`
            },
        })
        return response.data;
    } catch (error) {
        return Promise.reject(error);
    }
}

export async function getRepas(id_profil: string, id: string, wNutriment: boolean): Promise<Object> {
    try {
        const response = await axios.get(`${hostname}api/repas/${id_profil}/${id}?nutriments=${wNutriment ? "true" : "false"}`, {
            headers: {
                'Authorization': `Bearer ${auth}`
            },
        })
        return response.data;
    } catch (error) {
        return Promise.reject(error);
    }
}

export async function updateRepas(id_profil: string, repas: any): Promise<Response[]> {
    const fetches=[axios.put(`${hostname}api/repas/${id_profil}`,repas, {
        headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth}`
        },
    })]

    if(repas.elements){
        let deleted_ing_ids: any[] = [];
        Object.keys(repas.elements).map(k => {
            if(!(k in repas.elements)) deleted_ing_ids.push(k);
        })
        if(deleted_ing_ids.length > 0) fetches.push(axios.delete(`${hostname}api/repas/${id_profil}/${repas.id}/del_ing?ids=${deleted_ing_ids.join(",")}`, {
            headers: {
                'Authorization': `Bearer ${auth}`
            },
        }));
    }

    if(repas.recettes){
        let deleted_rec_ids: any[] = [];
        Object.keys(repas.recettes).map(k => {
            if(!(k in repas.recettes)) deleted_rec_ids.push(k);
        })
        if(deleted_rec_ids.length > 0) fetches.push(axios.delete(`${hostname}api/repas/${id_profil}/${repas.id}/del_rec?ids=${deleted_rec_ids.join(",")}`, {
            headers: {
                'Authorization': `Bearer ${auth}`
            },
        }));
    }
    const results= await Promise.all(fetches);
    return results.map(res => res.data)
}

export async function delRepas(id_profil: string, id: string): Promise<Object>{
    try {
        const response = await axios.delete(`${hostname}api/repas/${id_profil}?id_repas=${id}`, {
            headers: {
            'Authorization': `Bearer ${auth}`
            }
        });
        return response.data;
    }catch (error) {
        return Promise.reject(error);
    }
}

// RECETTES

export async function getRecette(id_profil: string, name: string): Promise<Object> {
    try {
        const response = await axios.get(`${hostname}api/recette/${id_profil}/filter?name=${name}`, {
            headers: {
            'Authorization': `Bearer ${auth}`
            }
        })
        return response.data;
    }catch (error) {
        return Promise.reject(error);
    }
}

// WEEK

export async function addOrUpdateRepasDay(id_profil: string, week_id: string, day: string, repas_name: string, id_repas: string): Promise<Object> {
    try {
        const response = await axios.put(`${hostname}api/week/${id_profil}/${week_id}/aou_repas?day=${day}&repas_name=${repas_name}&id_repas=${id_repas}`, {
            headers: {'Authorization': `Bearer ${auth}`}
        })
        return response.data;
    } catch (error) {
        return Promise.reject(error);
    }

}

export async function deleteRepasDay(id_profil: string, week_id: string, day: string, repas_name: string): Promise<Response> {
    try {
        const response = await axios.delete(`${hostname}api/week/${id_profil}/${week_id}/delete_repas?day=${day}&repas_name=${repas_name}`, {
            headers: {'Authorization': `Bearer ${auth}`}
        })
        return response.data;
    } catch (error) {
        return Promise.reject(error);
    }
}*/