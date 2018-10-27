import { LivePlanes } from './../models/planes';
import { Component, OnInit } from '@angular/core';
import {Observable, timer} from 'rxjs';
import {select, Store} from '@ngrx/store';
import {ResetPosition, SelectTileSet} from '../actions/map';
import {TileSet} from '../models/map';
import {RefreshStatesAll} from '../actions/planes';
import {getSelectedTileSet, MapState} from '../reducers/map';
import {getLivePlanes, getLivePlanesLength} from '../reducers/planes';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  selectedTileSet$: Observable<TileSet>;

  liveStates$: Observable<LivePlanes>;
  liveStatesLength$: Observable<number>;

  tileSets = [
    {
      name: 'Washington DC',
      url : 'https://s3.amazonaws.com/amulrean-vricon/usa/washington_dc/tileset.json'
    },
    {
      name: 'North Korea',
      url : 'https://s3.amazonaws.com/amulrean-vricon/north_korea/pyongyang/tileset.json'
    },
    {
      name: 'Brazil',
      url : 'https://s3.amazonaws.com/amulrean-vricon/brazil/rio_de_janeiro/tileset.json'
    },
  ];

  constructor(private store: Store<MapState>) {
    this.selectedTileSet$ = store.pipe(
      select(getSelectedTileSet)
    );

    this.liveStates$ = store.pipe(
      select(getLivePlanes)
    );

    this.liveStatesLength$ = store.pipe(
      select(getLivePlanesLength)
    );
  }

  ngOnInit() {
    this.refreshPlanes();
  }

  selectTileSet(selected: TileSet) {
    this.store.dispatch(new SelectTileSet(selected));
  }

  reset() {
    this.store.dispatch(new ResetPosition());
  }

  refreshPlanes() {
    // timer(0, 5000).subscribe( () => this.store.dispatch(new RefreshStatesAll()));
    this.store.dispatch(new RefreshStatesAll());
  }

}
