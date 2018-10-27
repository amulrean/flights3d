import {Component, OnDestroy, OnInit} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {TileSet} from '../models/map';
import {Observable, Subscription} from 'rxjs';
import {getSelectedTileSet, MapState} from '../reducers/map';
import {LivePlanes, OpenSkyState} from '../models/planes';
import {getLivePlanes} from '../reducers/planes';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, OnDestroy {

  viewer;
  selectedTileSet$: Observable<TileSet>;
  livePlanes$: Observable<LivePlanes>;
  subscriptions: Subscription[] = [];

  constructor(private store: Store<MapState>) {
    this.selectedTileSet$ = store.pipe(
      select(getSelectedTileSet)
    );
    this.livePlanes$ = store.pipe(
      select(getLivePlanes)
    );
  }

  ngOnInit() {
    // tslint:disable-next-line:max-line-length
    Cesium.Ion.defaultAccessToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2Y2VlNTZiMy04YzE5LTQ3OWYtYmQ0MC03NGZlODdlZmJhMDYiLCJpZCI6MjI0NCwiaWF0IjoxNTMyMTg3Mzc1fQ.6E2ATk75Gdk9uzyuTPd-QcHKksPxfqx82wifY2zJ5P0`;
    this.viewer = new Cesium.Viewer('cesiumContainer', {
      sceneMode: Cesium.SceneMode.SCENE3D,
      // imageryProvider : new Cesium.ImageryProvider(),
    });

    this.subscriptions.push(
      this.selectedTileSet$.subscribe(selectedTileSet => {
        if (selectedTileSet) {
          const tileset = this.viewer.scene.primitives.add(new Cesium.Cesium3DTileset({
            url: selectedTileSet.url
          }));
          this.viewer.zoomTo(tileset);
        }
      }));

    this.subscriptions.push(
      this.livePlanes$.subscribe(livePlanes => {
        this.addPlanes(livePlanes);
      }));
  }

  ngOnDestroy() {
    this.subscriptions.map(sub => sub.unsubscribe());
  }

  addPlanes(liveState: LivePlanes) {
    this.viewer.entities.removeAll();
    for (const planeKey of Object.keys(liveState)) {
      const currentPlane = liveState[planeKey];

      if (currentPlane.currentState.callsign) {

        const sampledPosition = new Cesium.SampledPositionProperty();

        for (const sampleState of currentPlane.states) {
          const position = Cesium.Cartesian3.fromDegrees(
            sampleState.longitude,
            sampleState.latitude,
            sampleState.geo_altitude
          );
          const time = Cesium.JulianDate.fromDate(new Date(sampleState.time_position * 1000));
          sampledPosition.addSample(time, position);
        }
        const sampledAvailability = new Cesium.TimeIntervalCollection([new Cesium.TimeInterval({
            start : Cesium.JulianDate.fromDate(new Date(currentPlane.states[0].time_position * 1000)),
            stop : Cesium.JulianDate.fromDate(new Date(currentPlane.states[currentPlane.states.length - 1].time_position * 1000))
        })]);

        const currentPosition = Cesium.Cartesian3.fromDegrees(
          currentPlane.currentState.longitude,
          currentPlane.currentState.latitude,
          currentPlane.currentState.geo_altitude
        );
        const heading = Cesium.Math.toRadians(currentPlane.currentState.true_track);
        const pitch = 0;
        const roll = 0;
        const hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
        const orientation = Cesium.Transforms.headingPitchRollQuaternion(currentPosition, hpr);
        // const orientation = new Cesium.VelocityOrientationProperty(sampledPosition);
        const url = 'assets/models/fr-24/b737.glb';

        const minimumPixelSize = currentPlane.currentState.on_ground ? 10 : 50;

        const model = {
          uri : url,
          minimumPixelSize : minimumPixelSize,
          maximumScale : 20000
        };

        const newEntity = {
          name: currentPlane.currentState.callsign,
          // availability: sampledAvailability,
          // position: sampledPosition,
          position: currentPosition,
          orientation: orientation,
          model: model,
          // label: {
          //   text: `${currentPlane.currentState.icao24} - ${currentPlane.currentState.geo_altitude}`,
          // }
        };
        this.viewer.entities.add(newEntity);
      }
    }
    this.viewer.flyTo(this.viewer.entities);
  }
}
