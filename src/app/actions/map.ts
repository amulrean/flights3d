import {Action} from '@ngrx/store';
import {TileSet} from '../models/map';

export enum MapActionTypes {
  SelectTileSet = '[Map] Select Tile Set',
  ResetPosition = '[Map] Reset Position',
}


export class SelectTileSet implements Action {
  readonly type = MapActionTypes.SelectTileSet;

  constructor(public payload: TileSet) {}
}

export class ResetPosition implements Action {
  readonly type = MapActionTypes.ResetPosition;

  constructor() {}
}

export type MapActions = SelectTileSet | ResetPosition;
