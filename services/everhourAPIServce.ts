import axios from 'axios';
import { EverhourData, EverhourRequestOptions } from '../types/types';
import everhourConfig from '../tokens/everhour-api';

export const getEverhourAPIData = async (params: EverhourRequestOptions) => {
    const {data} = await axios.post<EverhourData>(everhourConfig.url, params, {headers: {'X-Api-Key': everhourConfig.key}});
    return data;
}
