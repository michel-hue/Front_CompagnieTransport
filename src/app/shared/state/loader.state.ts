import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';

import {
  HideLoaderAction,
  ShowLoaderAction,
  ShowButtonSpinnerAction,
  HideButtonSpinnerAction,
} from '../action/loader.action';

export class LoaderStateModel {
  public status: boolean = false;           // ✅ Plus optionnel, valeur par défaut
  public loadingCount: number = 0;
  public button_spinner: boolean = false;  // ✅ Plus optionnel
  public button_id: string | null = null;  // ✅ Typage explicite
}

@State<LoaderStateModel>({
  name: 'loader',
  defaults: {
    status: false,
    loadingCount: 0,
    button_spinner: false,
    button_id: null,
  },
})
@Injectable()
export class LoaderState {
  @Selector()
  public static status(state: LoaderStateModel): boolean {  // ✅ Return type explicite
    return state.status;
  }

  @Selector()
  public static loadingCount(state: LoaderStateModel): number {
    return state.loadingCount;
  }

  @Selector()
  public static buttonSpinner(state: LoaderStateModel): boolean {
    return state.button_spinner;
  }

  @Action(ShowLoaderAction)
  public showLoaderAction(
    ctx: StateContext<LoaderStateModel>,
    action: ShowLoaderAction,
  ) {
    const state = ctx.getState();
    const count = state.loadingCount;  // ✅ Plus besoin de ?. car toujours défini
    ctx.patchState({
      status: action.loading,
      loadingCount: count + 1,
    });
  }

  @Action(HideLoaderAction)
  public hideLoaderAction(ctx: StateContext<LoaderStateModel>) {
    const state = ctx.getState();
    ctx.patchState({
      status: state.loadingCount === 1 ? false : true,
      loadingCount: state.loadingCount - 1,
    });
  }

  @Action(ShowButtonSpinnerAction)
  public showButtonSpinnerAction(
    ctx: StateContext<LoaderStateModel>,
    action: ShowButtonSpinnerAction,
  ) {
    ctx.patchState({ button_spinner: action.loading });
  }

  @Action(HideButtonSpinnerAction)
  public hideButtonSpinnerAction(ctx: StateContext<LoaderStateModel>) {  // ✅ camelCase
    ctx.patchState({ button_spinner: false });
  }
}
