import {ActionReducerMap} from '@ngrx/store';
import {mapReducer, MapState} from './map';
import {planesReducer, PlanesState} from './planes';

export interface AppState {
  map: MapState;
  planes: PlanesState;
}

export const reducers: ActionReducerMap<AppState> = {
  map: mapReducer,
  planes: planesReducer
};
