import { MoveEnd } from './../actions/map';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {TileSet, ICameraState, IRectangle, IMoveEndPayload} from '../models/map';
import {Observable, Subscription} from 'rxjs';
import {getSelectedTileSet, MapState} from '../reducers/map';
import { getAllCesiumPlaneEntities } from '../reducers/cesium';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, OnDestroy {

  viewer;
  selectedTileSet$: Observable<TileSet>;
  livePlanes$: Observable<any>;
  subscriptions: Subscription[] = [];

  constructor(private store: Store<MapState>) {
    this.selectedTileSet$ = store.pipe(
      select(getSelectedTileSet)
    );
    this.livePlanes$ = store.pipe(
      select(getAllCesiumPlaneEntities)
    );
  }

  ngOnInit() {
    // tslint:disable-next-line:max-line-length
    // Cesium.Ion.defaultAccessToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2Y2VlNTZiMy04YzE5LTQ3OWYtYmQ0MC03NGZlODdlZmJhMDYiLCJpZCI6MjI0NCwiaWF0IjoxNTMyMTg3Mzc1fQ.6E2ATk75Gdk9uzyuTPd-QcHKksPxfqx82wifY2zJ5P0`;
    this.viewer = new Cesium.Viewer('cesiumContainer', {
      sceneMode: Cesium.SceneMode.SCENE3D,
      geocoder: false,
      // imageryProvider : new Cesium.ImageryProvider(),
    });

    this.viewer.camera.moveEnd.addEventListener(() => {
      this.store.dispatch(new MoveEnd(this.getMoveEndPayload()));
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
      this.livePlanes$.subscribe(planeEntities => {
        this.addEntities(planeEntities);
      }));
  }

  ngOnDestroy() {
    this.subscriptions.map(sub => sub.unsubscribe());
  }

  addEntities(planeEntities: any[]) {
    planeEntities.forEach(planeEntity => {
      const viewerEntity = this.viewer.entities.getOrCreateEntity(planeEntity.id);
      const keys = Object.keys(planeEntity);
      keys.forEach(value => {
          if (value !== 'id') {
            viewerEntity[value] = planeEntity[value];
          }
      });
    });
    this.viewer.flyTo(this.viewer.entities);
  }

  private getMoveEndPayload(): IMoveEndPayload {
    return {
      camera: this.getCurrentCameraState(),
      viewRectangle: this.getCurrentViewRectangle(),
    };
  }

  private getCurrentViewRectangle(): IRectangle {
    return this.viewer.camera.computeViewRectangle();
  }

  private getCurrentCameraState(): ICameraState {
    return {
        position: this.viewer.camera.position,
        heading: this.viewer.camera.heading,
        pitch: this.viewer.camera.pitch,
        roll: this.viewer.camera.roll
    };
}
}
