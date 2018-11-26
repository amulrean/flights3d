import {Action} from '@ngrx/store';
import {TileSet, IMoveEndPayload} from '../../models/map';

export enum MapActionTypes {
  SelectTileSet = '[Map] Select Tile Set',
  UnselectTile = '[Map] Unselect Tile Set',
  MoveEnd = '[Map] Move End',
}


export class SelectTileSet implements Action {
  readonly type = MapActionTypes.SelectTileSet;

  constructor(public payload: TileSet) {}
}

export class UnselectTile implements Action {
  readonly type = MapActionTypes.UnselectTile;

  constructor() {}
}

export class MoveEnd implements Action {
  readonly type = MapActionTypes.MoveEnd;

  constructor(public payload: IMoveEndPayload) {}
}

export type MapActions = SelectTileSet | UnselectTile | MoveEnd;
