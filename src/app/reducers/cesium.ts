import { getAllPlanes } from './planes';
import { createSelector } from '@ngrx/store';
import { Plane } from '../models/planes';

export const getAllCesiumPlaneEntities = createSelector(
    getAllPlanes,
    planes => {
      const returnEntitties = [];
      planes.forEach(plane => {
        returnEntitties.push(createPlaneEntity(plane));
      });
      return returnEntitties;
    }
  );


function createPlaneEntity(planeState: Plane) {
  const sampledPosition = new Cesium.SampledPositionProperty();

  for (const sampleState of planeState.states) {
    const position = Cesium.Cartesian3.fromDegrees(
      sampleState.longitude,
      sampleState.latitude,
      sampleState.geo_altitude
    );
    const time = Cesium.JulianDate.fromDate(new Date(sampleState.time_position * 1000));
    sampledPosition.addSample(time, position);
  }
  const sampledAvailability = new Cesium.TimeIntervalCollection([new Cesium.TimeInterval({
      start : Cesium.JulianDate.fromDate(new Date(planeState.states[0].time_position * 1000)),
      stop : Cesium.JulianDate.fromDate(new Date(planeState.states[planeState.states.length - 1].time_position * 1000))
  })]);

  const currentPosition = Cesium.Cartesian3.fromDegrees(
    planeState.currentState.longitude,
    planeState.currentState.latitude,
    planeState.currentState.geo_altitude
  );
  const heading = Cesium.Math.toRadians(planeState.currentState.true_track);
  const pitch = 0;
  const roll = 0;
  const hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
  const orientation = Cesium.Transforms.headingPitchRollQuaternion(currentPosition, hpr);
  // const orientation = new Cesium.VelocityOrientationProperty(sampledPosition);
  const url = 'assets/models/fr-24/b737.glb';

  const minimumPixelSize = planeState.currentState.on_ground ? 10 : 50;

  const model = {
    uri : url,
    minimumPixelSize : minimumPixelSize,
    maximumScale : 20000
  };

  const newEntity = {
    id: planeState.icao24,
    name: planeState.currentState.callsign,
    // availability: sampledAvailability,
    // position: sampledPosition,
    position: currentPosition,
    orientation: orientation,
    model: model,
    // label: {
    //   text: `${currentPlane.currentState.icao24} - ${currentPlane.currentState.geo_altitude}`,
    // }
  };
  return newEntity;
}
