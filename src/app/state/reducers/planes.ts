import { OpenSkyState, createOpenSkyState, addOrCreateOpenSkyStateToPlane, LivePlanes} from '../../models/planes';
import {PlanesActions, PlanesActionTypes} from '../actions/planes';
import { createFeatureSelector, createSelector } from '@ngrx/store';

export interface PlanesState {
  currentTime: number;
  livePlanes: LivePlanes;
}

const initialState: PlanesState = {
  currentTime: 0,
  livePlanes: {}
};

export function planesReducer(state = initialState,
  action: PlanesActions): PlanesState {
  switch (action.type) {
    case PlanesActionTypes.LoadStatesAll:

      const newLiveStates: OpenSkyState[] = [];
      action.payload.states.map( stateArray => {
        const newState: OpenSkyState = createOpenSkyState(stateArray);
        newLiveStates.push(newState);
      });

      for (const openSkyState of newLiveStates) {
        state.livePlanes[openSkyState.icao24] = addOrCreateOpenSkyStateToPlane(
          state.livePlanes[openSkyState.icao24],
          openSkyState
        );
      }

      return {
        ...state,
        currentTime: action.payload.time,
        livePlanes: {...state.livePlanes}
      };

    case PlanesActionTypes.ClearStatesAll:
      return {
        ...state,
        currentTime: 0,
        livePlanes: {}
      };

    default:
      return state;
  }
}

export const getPlanesState = createFeatureSelector<PlanesState>('planes');

export const getLivePlanes = createSelector(
  getPlanesState,
  state => state.livePlanes
);

export const getLivePlanesLength = createSelector(
  getPlanesState,
  state => Object.keys(state.livePlanes).length
);

export const getAllPlanes = createSelector(
  getLivePlanes,
  planes => {
    return Object.keys(planes).map(id => planes[id]);
  }
);
