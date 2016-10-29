import Rx from "rxjs";

import gamesActions from "../actions/gamesActions";

const initialState = [];
const { setGames$ } = gamesActions;

const gamesReducer$ = Rx.Observable.of(() => initialState)
  .merge(
    setGames$.map(games => () => games),
  );

export default gamesReducer$;
