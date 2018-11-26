import { Component, OnInit } from '@angular/core';
import { Observable, timer } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { TileSet } from '../../models/map';
import { LivePlanes } from '../../models/planes';
import { MapState, getSelectedTileSet } from '../../state/reducers/map';
import { getLivePlanes, getLivePlanesLength } from '../../state/reducers/planes';
import { SelectTileSet, UnselectTile } from '../../state/actions/map';
import { RefreshStatesAll } from '../../state/actions/planes';

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
      url: 'https://s3.amazonaws.com/amulrean-vricon/usa/washington_dc/tileset.json'
    },
    {
      name: 'North Korea',
      url: 'https://s3.amazonaws.com/amulrean-vricon/north_korea/pyongyang/tileset.json'
    },
    {
      name: 'Brazil',
      url: 'https://s3.amazonaws.com/amulrean-vricon/brazil/rio_de_janeiro/tileset.json'
    }
  ];

  constructor(private store: Store<MapState>) {
    this.selectedTileSet$ = store.pipe(select(getSelectedTileSet));

    this.liveStates$ = store.pipe(select(getLivePlanes));

    this.liveStatesLength$ = store.pipe(select(getLivePlanesLength));
  }

  ngOnInit() {
    this.refreshPlanes();
  }

  selectTileSet(selected: TileSet) {
    this.store.dispatch(new SelectTileSet(selected));
  }

  reset() {
    this.store.dispatch(new UnselectTile());
  }

  refreshPlanes() {
    this.store.dispatch(new RefreshStatesAll());
  }
}
