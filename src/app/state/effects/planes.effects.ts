import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {Action} from '@ngrx/store';
import {catchError, map, mergeMap} from 'rxjs/operators';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {HttpClient} from '@angular/common/http';
import {PlanesActionTypes} from '../actions/planes';

@Injectable()
export class PlanesEffects {

  washDCStateURL = 'https://opensky-network.org/api/states/all?lomin=-77.651154&lamin=38.666108&lomax=-76.705472&lamax=39.173612';

  @Effect()
  refreshState$: Observable<Action> = this.actions$.pipe(
    ofType(PlanesActionTypes.RefreshStatesAll),
    mergeMap(action =>
      this.http.get(this.washDCStateURL).pipe(
        // If successful, dispatch success action with result
        map(data => ({ type: PlanesActionTypes.LoadStatesAll, payload: data })),
        // If request fails, dispatch failed action
        catchError(() => of({ type: PlanesActionTypes.ClearStatesAll }))
      )
    )
  );

  constructor(private http: HttpClient, private actions$: Actions) {}
}
