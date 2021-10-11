import { BrandAPI } from '../brand/brand';
import { TipologiaAPI } from '../tipologia/tipologia';

export interface Modello { }

export interface ModelloAPI {
    id: number;
    idBrand: number;
    idTipologia: number;
    modello: string;
    batteria: number;
    brand: BrandAPI;
    tipologia?: TipologiaAPI;
}
