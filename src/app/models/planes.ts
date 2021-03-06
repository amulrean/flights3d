import { OpenSkyState, Plane } from './planes';
// https://opensky-network.org/api/states/all?lamin=45.8389&lomin=5.9962&lamax=47.8229&lomax=10.5226

// Washington DC
// https://opensky-network.org/api/states/all?lomin=-77.651154&lamin=38.666108&lomax=-76.705472&lamax=39.173612

// api/tracks/all?icao24=3c4b26&time=0
// ac7256

// -77.651154,38.666108,-76.705472,39.173612
// https://opensky-network.org/apidoc/rest.html#operation

type OpenSkyStateResponse = [
  string,
  string,
  string,
  number,
  number,
  number,
  number,
  number,
  boolean,
  number,
  number,
  number,
  number[],
  number,
  string,
  boolean,
  number
];

export interface OpenSkyStatesAllResponse {
  time: number;
  states: OpenSkyStateResponse[];
}

export interface OpenSkyState {
  icao24: string; // Unique ICAO 24-bit address of the transponder in hex string representation.
  callsign: string; // Callsign of the vehicle (8 chars). Can be null if no callsign has been received.
  origin_country: string; // Country name inferred from the ICAO 24-bit address.
  time_position: number; // Unix timestamp (seconds) for the last position update.
  // Can be null if no position report was received by OpenSky within the past 15s.
  last_contact: number; // Unix timestamp (seconds) for the last update in general.
  // This field is updated for any new, valid message received from the transponder.
  longitude: number; // WGS-84 longitude in decimal degrees. Can be null.
  latitude: number; // WGS-84 latitude in decimal degrees. Can be null.
  geo_altitude: number; // Geometric altitude in meters. Can be null.
  on_ground: boolean; // Boolean value which indicates if the position was retrieved from a surface position report.
  velocity: number; // Velocity over ground in m/s. Can be null.
  true_track: number; // True track in decimal degrees clockwise from north (north=0°). Can be null.
  vertical_rate: number; // Vertical rate in m/s. A positive value indicates that the airplane is climbing,
  // a negative value indicates that it descends. Can be null.
  sensors: number[]; // IDs of the receivers which contributed to this state vector.
  // Is null if no filtering for sensor was used in the request.
  baro_altitude: number; // Barometric altitude in meters. Can be null.
  squawk: string; // The transponder code aka Squawk. Can be null.
  spi: boolean; // Whether flight status indicates special purpose indicator.
  position_source: number; // Origin of this state’s position: 0 = ADS-B, 1 = ASTERIX, 2 = MLAT
}

export interface Plane {
  icao24: string; // Unique ICAO 24-bit address of the transponder in hex string representation.
  callsign: string; // Callsign of the vehicle (8 chars). Can be null if no callsign has been received.
  origin_country: string; // Country name inferred from the ICAO 24-bit address.
  currentState: OpenSkyState;
  states: OpenSkyState[];
}

export interface LivePlanes {
  [key: string]: Plane;
}

export function createOpenSkyState(stateArray: OpenSkyStateResponse): OpenSkyState {
  return {
    icao24: stateArray[0],
    callsign: stateArray[1],
    origin_country: stateArray[2],
    time_position: stateArray[3],
    last_contact: stateArray[4],
    longitude: stateArray[5],
    latitude: stateArray[6],
    geo_altitude: stateArray[7],
    on_ground: stateArray[8],
    velocity: stateArray[9],
    true_track: stateArray[10],
    vertical_rate: stateArray[11],
    sensors: stateArray[12],
    baro_altitude: stateArray[13],
    squawk: stateArray[14],
    spi: stateArray[15],
    position_source: stateArray[16]
  };
}

export function createPlaneFromState(openSkyState: OpenSkyState): Plane {
  return {
    icao24: openSkyState.icao24,
    callsign: openSkyState.callsign,
    origin_country: openSkyState.origin_country,
    currentState: openSkyState,
    states: [openSkyState]
  };
}

export function addOrCreateOpenSkyStateToPlane(plane: Plane, openSkyState: OpenSkyState): Plane {
  if (plane !== undefined) {
    plane.currentState = openSkyState;
    plane.states.push(openSkyState);
    return plane;
  } else {
    return createPlaneFromState(openSkyState);
  }
}
