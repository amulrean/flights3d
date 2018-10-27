import { MapState } from './map';
import {TileSet} from '../models/map';
import {AppState} from './index';
import {MapActions, MapActionTypes} from '../actions/map';
import { createFeatureSelector, State, createSelector } from '@ngrx/store';

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

export const getMapState = createFeatureSelector<MapState>('map');

export const getSelectedTileSet = createSelector(
  getMapState,
  state => state.selectedTileSet
);
