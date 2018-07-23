import {AppState} from './index';
import {OpenSkyState} from '../models/planes';
import {PlanesActions, PlanesActionTypes} from '../actions/planes';

export interface PlanesState {
  currentTime: number;
  liveStates: OpenSkyState[];
}

const initialState: PlanesState = {
  currentTime: 0,
  liveStates: []
};

export function planesReducer(state = initialState,
  action: PlanesActions) {
  switch (action.type) {
    case PlanesActionTypes.LoadStatesAll:

      const newLiveState: OpenSkyState[] = [];
      action.payload.states.map( stateArray => {
        const newState: OpenSkyState = {
          icao24:	stateArray[0],
          callsign:	stateArray[1],
          origin_country: stateArray[2],
          time_position: stateArray[3],
          last_contact:	stateArray[4],
          longitude: stateArray[5],
          latitude: stateArray[6],
          geo_altitude:	stateArray[7],
          on_ground:	stateArray[8],
          velocity: stateArray[9],
          true_track:	stateArray[10],
          vertical_rate:	stateArray[11],
          sensors:	stateArray[12],
          baro_altitude: stateArray[13],
          squawk:	stateArray[14],
          spi:	stateArray[15],
          position_source:	stateArray[16],
        };
        newLiveState.push(newState);
      });


      return {
        ...state,
        currentTime: action.payload.time,
        liveStates: newLiveState
      };

    case PlanesActionTypes.ClearStatesAll:
      return {
        ...state,
        currentTime: 0,
        liveStates: []
      };

    default:
      return state;
  }
}

export const getLiveStates = (state: AppState) => state.planes.liveStates;
export const getLiveStatesLength = (state: AppState) => state.planes.liveStates.length;
