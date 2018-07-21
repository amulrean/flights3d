import {Component, OnDestroy, OnInit} from '@angular/core';
import {getSelectedTileSet, MapState} from '../reducers';
import {select, Store} from '@ngrx/store';
import {TileSet} from '../models/map';
import {Observable, Subscription} from 'rxjs';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, OnDestroy {

  viewer;
  selectedTileSet$: Observable<TileSet>;
  selectedTileSetSub: Subscription;

  constructor(private store: Store<MapState>) {
    this.selectedTileSet$ = store.pipe(
      select(getSelectedTileSet)
    );
  }

  ngOnInit() {
    // tslint:disable-next-line:max-line-length
    Cesium.Ion.defaultAccessToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2Y2VlNTZiMy04YzE5LTQ3OWYtYmQ0MC03NGZlODdlZmJhMDYiLCJpZCI6MjI0NCwiaWF0IjoxNTMyMTg3Mzc1fQ.6E2ATk75Gdk9uzyuTPd-QcHKksPxfqx82wifY2zJ5P0`;
    this.viewer = new Cesium.Viewer('cesiumContainer', {
      sceneMode: Cesium.SceneMode.SCENE3D,
    });

    this.selectedTileSetSub = this.selectedTileSet$.subscribe(selectedTileSet => {
      if (selectedTileSet) {
        const tileset = this.viewer.scene.primitives.add(new Cesium.Cesium3DTileset({
          url: selectedTileSet.url
        }));
        this.viewer.zoomTo(tileset);
      }

    });
  }

  ngOnDestroy() {
    this.selectedTileSetSub.unsubscribe();
  }

}
