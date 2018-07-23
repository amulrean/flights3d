import {Component, OnDestroy, OnInit} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {TileSet} from '../models/map';
import {Observable, Subscription} from 'rxjs';
import {getSelectedTileSet, MapState} from '../reducers/map';
import {OpenSkyState} from '../models/planes';
import {getLiveStates} from '../reducers/planes';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, OnDestroy {

  viewer;
  selectedTileSet$: Observable<TileSet>;
  liveStates$: Observable<OpenSkyState[]>;
  subscriptions: Subscription[] = [];

  constructor(private store: Store<MapState>) {
    this.selectedTileSet$ = store.pipe(
      select(getSelectedTileSet)
    );
    this.liveStates$ = store.pipe(
      select(getLiveStates)
    );
  }

  ngOnInit() {
    // tslint:disable-next-line:max-line-length
    Cesium.Ion.defaultAccessToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2Y2VlNTZiMy04YzE5LTQ3OWYtYmQ0MC03NGZlODdlZmJhMDYiLCJpZCI6MjI0NCwiaWF0IjoxNTMyMTg3Mzc1fQ.6E2ATk75Gdk9uzyuTPd-QcHKksPxfqx82wifY2zJ5P0`;
    this.viewer = new Cesium.Viewer('cesiumContainer', {
      sceneMode: Cesium.SceneMode.SCENE3D,
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
      this.liveStates$.subscribe(liveState => {
        this.addPlanes(liveState);
      }));
  }

  ngOnDestroy() {
    this.subscriptions.map(sub => sub.unsubscribe());
  }

  addPlanes(liveState: OpenSkyState[]) {
    this.viewer.entities.removeAll();
    for (const planeState of liveState) {
      if (!planeState.on_ground && planeState.callsign) {
        this.viewer.entities.add({
          name: planeState.callsign,
          position: Cesium.Cartesian3.fromDegrees(planeState.longitude, planeState.latitude, planeState.geo_altitude),
          point: {
            pixelSize: 5,
            color: Cesium.Color.RED,
            outlineColor: Cesium.Color.WHITE,
            outlineWidth: 2
          },
          label: {
            text: `${planeState.callsign} - ${planeState.velocity}`,
          }
        });
      }
    }

  }
}
