import {TileSet} from '../models/map';
import {MapActions, MapActionTypes} from '../actions/map';
import {ActionReducerMap, createFeatureSelector} from '@ngrx/store';

export interface MapState {
  selectedTileSet: TileSet;
}

const initialState: MapState = {
  selectedTileSet: undefined
};

export function mapReducer(state = initialState,
  action: MapActions) {
  switch (action.type) {
    case MapActionTypes.SelectTileSet:
      return {
        ...state,
        selectedTileSet: action.payload
      };

    case MapActionTypes.ResetPosition:
      return {
        ...state,
        selectedTileSet: undefined
      };

    default:
      return state;
  }
}
// export const getSelectedTileSet = createFeatureSelector<MapState>('selectedTileSet');
export const getSelectedTileSet = (state: AppState) => state.map.selectedTileSet;

export interface AppState {
  map: MapState;
}

export const reducers: ActionReducerMap<AppState> = {
  map: mapReducer,
};
