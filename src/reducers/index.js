import Rx from "rxjs";

import gamesReducer$ from "./gamesReducer";
import gameReducer$ from "./gameReducer";

const reducer$ = Rx.Observable.merge(
  gamesReducer$.map(games => ["games", games]),
  gameReducer$.map(game => ["game", game]),
);

export default reducer$;
