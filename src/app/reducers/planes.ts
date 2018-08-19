import {AppState} from './index';
import {LivePlanes, OpenSkyState} from '../models/planes';
import {PlanesActions, PlanesActionTypes} from '../actions/planes';

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
        newLiveStates.push(newState);
      });

      for (const openSkyState of newLiveStates) {
        if (state.livePlanes[openSkyState.icao24] !== undefined) {
          state.livePlanes[openSkyState.icao24].currentState = openSkyState;
          state.livePlanes[openSkyState.icao24].states.push(openSkyState);
        } else {
          const newPlane = {
            icao24: openSkyState.icao24,
            callsign: openSkyState.callsign,
            origin_country: openSkyState.origin_country,
            currentState: openSkyState,
            states: [openSkyState]
          };
          state.livePlanes[openSkyState.icao24] = newPlane;
        }
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

export const getLivePlanes = (state: AppState) => state.planes.livePlanes;
export const getLivePlanesLength = (state: AppState) => Object.keys(state.planes.livePlanes).length;
