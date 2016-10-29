import Rx from "rxjs";

import gamesActions from "../actions/gamesActions";

const initialState = null;
const { setGame$ } = gamesActions;

const gameReducer$ = Rx.Observable.of(() => initialState)
  .merge(
    setGame$.map(game => () => game),
  );

export default gameReducer$;
