import { ModelloAPI } from '../modello/modello';

export interface Radiocomando {
    id: number;
    unitcode: string;
    brand: string;
    modello: string;
}

export interface RadiocomandoAPI {
    id: number;
    idModello: number;
    unitcode: string;
    imei: string;
    sim: string;
    modello: ModelloAPI;
    note: any[];
}
