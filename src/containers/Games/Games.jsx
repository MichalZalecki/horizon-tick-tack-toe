import React, { Component, PropTypes } from "react";
import { Link, browserHistory } from "react-router";
import shortid from "shortid";
import { connect } from "rx_state";

import horizon from "../../horizon";
import gamesActions from "../../actions/gamesActions";
import { isLoggedIn, currentUser } from "../../services/session";

class Games extends Component {
  static propTypes = {
    games: PropTypes.array.isRequired,
  };

  componentDidMount() {
    horizon("games").watch().subscribe(gamesActions.setGames$);
  }

  addGame() {
    const id = shortid.generate();
    const player1 = currentUser().id;

    horizon("games").store(this.buildGame({ id, player1 }));
    browserHistory.push(`/game/${id}`);
  }

  buildGame({ id, player1 }) {
    return { id, player1, name: `Game #${id}`, moves: [] };
  }

  status(game) {
    if (!game.player2) return " (open)";
    if (!game.winner) return " (ongoing)";
    return null;
  }

  render() {
    return (
      <div>
        <h1>Games</h1>
        {isLoggedIn() ? <button onClick={::this.addGame}>New game</button> : null}
        <ul>
          {this.props.games.map(game =>
            <li key={game.id}>
              <Link to={`/game/${game.id}`}>{game.name}</Link> {this.status(game)}
            </li>)}
        </ul>
      </div>
    );
  }
}

export default connect(({ games }) => ({ games }))(Games);
