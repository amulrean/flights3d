import {Action} from '@ngrx/store';
import {OpenSkyStatesAllResponse} from '../models/planes';

export enum PlanesActionTypes {
  RefreshStatesAll = '[Planes] Get States All',
  LoadStatesAll = '[Planes] Load States All',
  ClearStatesAll = '[Planes] Clear States All'
}


export class RefreshStatesAll implements Action {
  readonly type = PlanesActionTypes.RefreshStatesAll;

  constructor() {}
}

export class LoadStatesAll implements Action {
  readonly type = PlanesActionTypes.LoadStatesAll;

  constructor(public payload: OpenSkyStatesAllResponse) {}
}

export class ClearStatesAll implements Action {
  readonly type = PlanesActionTypes.ClearStatesAll;

  constructor() {}
}

export type PlanesActions = RefreshStatesAll | LoadStatesAll | ClearStatesAll;
