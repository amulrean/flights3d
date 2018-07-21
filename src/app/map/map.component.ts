import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  viewer;

  constructor() { }

  ngOnInit() {
    // tslint:disable-next-line:max-line-length
    Cesium.Ion.defaultAccessToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2Y2VlNTZiMy04YzE5LTQ3OWYtYmQ0MC03NGZlODdlZmJhMDYiLCJpZCI6MjI0NCwiaWF0IjoxNTMyMTg3Mzc1fQ.6E2ATk75Gdk9uzyuTPd-QcHKksPxfqx82wifY2zJ5P0`;
    this.viewer = new Cesium.Viewer('cesiumContainer', {
      sceneMode: Cesium.SceneMode.SCENE3D,
    });

    const tileset = this.viewer.scene.primitives.add(new Cesium.Cesium3DTileset({
        url : 'https://s3.amazonaws.com/amulrean-vricon/usa/washington_dc/tileset.json'
    }));
    this.viewer.zoomTo(tileset);
  }

}
