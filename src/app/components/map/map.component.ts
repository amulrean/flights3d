import { Component, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { TileSet, IMoveEndPayload, IRectangle, ICameraState } from '../../models/map';
import { MapState, getSelectedTileSet } from '../../state/reducers/map';
import { getAllCesiumPlaneEntities } from '../../state/reducers/cesium';
import { MoveEnd } from '../../state/actions/map';

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
    this.selectedTileSet$ = store.pipe(select(getSelectedTileSet));
    this.livePlanes$ = store.pipe(select(getAllCesiumPlaneEntities));
  }

  ngOnInit() {
    const cartoLight = new Cesium.UrlTemplateImageryProvider({
      url: 'https://cartodb-basemaps-a.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png',
      credit: 'Map tiles by CartoDB'
    });
    this.viewer = new Cesium.Viewer('cesiumContainer', {
      sceneMode: Cesium.SceneMode.SCENE3D,
      geocoder: false,
      imageryProvider: cartoLight
    });

    this.viewer.camera.moveEnd.addEventListener(() => {
      this.store.dispatch(new MoveEnd(this.getMoveEndPayload()));
    });

    this.subscriptions.push(
      this.selectedTileSet$.subscribe(selectedTileSet => {
        if (selectedTileSet) {
          const tileset = this.viewer.scene.primitives.add(
            new Cesium.Cesium3DTileset({
              url: selectedTileSet.url
            })
          );
          this.viewer.zoomTo(tileset);
        }
      })
    );

    this.subscriptions.push(
      this.livePlanes$.subscribe(planeEntities => {
        this.addEntities(planeEntities);
      })
    );
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
  }

  private getMoveEndPayload(): IMoveEndPayload {
    return {
      camera: this.getCurrentCameraState(),
      viewRectangle: this.getCurrentViewRectangle()
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
