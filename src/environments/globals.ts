'use strict';

export let userid: string;
export let userPermissions = '23';
export let userRole: number;
export let userUsername: string;
export let userAnagrafica: string;
export let userTipologia: string;
export let tipologiaUtente: number;

export let userAgent: string;

export let version = '2.5.96';

export function changeUserID(params) {
    const parsedParams = JSON.parse(params);
    userid = 'Bearer ' + parsedParams.access_token;
    userPermissions = parsedParams.utente.idTipologia;
    userRole = parsedParams.utente.role;
    userUsername = parsedParams.utente.username;
    userAnagrafica = parsedParams.utente.name;
    userTipologia = parsedParams.utente.tipologia;
    tipologiaUtente = parsedParams.utente.idTipologia;
}

export function changeUserAgent(params) {
    userAgent = params;
}