import React, { Component, PropTypes } from "react";
import { connect } from "rx_state";
import { Link } from "react-router";

import horizon from "../../horizon";
import gamesActions from "../../actions/gamesActions";
import { currentUser, isLoggedIn } from "../../services/session";
import { firstPlayerMoves, secondPlayerMoves } from "../../services/GameInfo";
import cls from "./Game.css";

class Game extends Component {
  static propTypes = {
    game: PropTypes.object,
    params: PropTypes.shape({ id: PropTypes.string.isRequired }).isRequired,
  };

  constructor(props) {
    super(props);

    this.join = this.join.bind(this);
  }

  componentDidMount() {
    horizon("games").find(this.props.params.id).watch().subscribe(gamesActions.setGame$);
  }

  status() {
    if (!isLoggedIn()) return "You must be logged in";

    const { game } = this.props;

    if (game.winner) {
      return game.winner !== "draw" ? `${game.winner} won!` : "draw";
    }
    if (game.player1 === currentUser().id && !game.player2) {
      return "waiting for player 2 to join";
    }
    if (!game.player2) {
      return "player 1 is waiting";
    }
    if (this.nextMove() === game.player1) {
      return "waiting for player 1 to move";
    }
    if (this.nextMove() === game.player2) {
      return "waiting for player 2 to move";
    }
    return "...";
  }

  canJoin() {
    if (!isLoggedIn()) return false;
    return this.props.game.player1 !== currentUser().id && !this.props.game.player2;
  }

  you() {
    if (!isLoggedIn()) {
      return "anonymous";
    }
    if (this.props.game.player1 === currentUser().id) {
      return "player1";
    }
    if (this.props.game.player2 === currentUser().id) {
      return "player2";
    }
    return "spectator";
  }

  join() {
    const { game } = this.props;
    const player2 = currentUser().id;
    const first = Math.random() > 0.5 ? "player1" : "player2";

    horizon("games").update({ ...game, player2, first });
  }

  nextMove() {
    const { game } = this.props;

    const second = game.first === "player1" ? game.player2 : game.player1;
    return game.moves.length % 2 === 0 ? game[game.first] : second;
  }

  select(x, y) {
    const { game } = this.props;

    if (this.validateSelection(game, { x, y })) {
      const moves = [...this.props.game.moves, [x, y]];
      horizon("games").update({ ...game, moves });
    }
  }

  validateSelection(game, { x, y }) {
    if (game.winner) {
      alert(`${game.winner} won already!`);
      return false;
    }
    if (this.nextMove() !== currentUser().id) {
      alert("It's not your move!");
      return false;
    }
    if (game.moves.map(m => JSON.stringify(m)).includes(JSON.stringify([x, y]))) {
      alert("This move was already done!");
      return false;
    }
    return true;
  }

  ellipsePos(x) {
    return (x * 10) + (x * 100) + 50;
  }

  crossPos(x) {
    return (x * 10) + (x * 100);
  }

  render() {
    const { game } = this.props;

    if (!game) return null;

    return (
      <div>
        <Link to="/">&lt; Back to games</Link>
        <h1>{game.name}</h1>
        {this.canJoin() ? <button onClick={this.join}>Join</button> : null}
        <ul>
          <li><strong>status:</strong> {this.status()}</li>
          <li><strong>you:</strong> {this.you()}</li>
          <li><strong>moves:</strong> {game.moves.length}</li>
        </ul>
        <div className="boardWrapper">
          <svg xmlns="http://www.w3.org/2000/svg" width="320" height="320" viewBox="0 0 320 320">
            <rect width="320" height="320" fill="#3f6661" />

            <rect width="100" height="100" fill="#3bb874" x="0" y="0" className={cls.boardField} onClick={() => { this.select(0, 0); }} />
            <rect width="100" height="100" fill="#3bb874" x="110" y="0" className={cls.boardField} onClick={() => { this.select(1, 0); }} />
            <rect width="100" height="100" fill="#3bb874" x="220" y="0" className={cls.boardField} onClick={() => { this.select(2, 0); }} />

            <rect width="100" height="100" fill="#3bb874" x="0" y="110" className={cls.boardField} onClick={() => { this.select(0, 1); }} />
            <rect width="100" height="100" fill="#3bb874" x="110" y="110" className={cls.boardField} onClick={() => { this.select(1, 1); }} />
            <rect width="100" height="100" fill="#3bb874" x="220" y="110" className={cls.boardField} onClick={() => { this.select(2, 1); }} />

            <rect width="100" height="100" fill="#3bb874" x="0" y="220" className={cls.boardField} onClick={() => { this.select(0, 2); }} />
            <rect width="100" height="100" fill="#3bb874" x="110" y="220" className={cls.boardField} onClick={() => { this.select(1, 2); }} />
            <rect width="100" height="100" fill="#3bb874" x="220" y="220" className={cls.boardField} onClick={() => { this.select(2, 2); }} />

            {firstPlayerMoves(game).map(([x, y]) =>
              <g fill="#3f6661" transform={`rotate(45 ${this.crossPos(x) + 50} ${this.crossPos(y) + 50})`} style={{ pointerEvents: "none" }}>
                <rect width="80" height="10" x={this.crossPos(x) + 10} y={this.crossPos(y) + 45} fill="#3f6661" />
                <rect width="10" height="80" x={this.crossPos(x) + 45} y={this.crossPos(y) + 10} fill="#3f6661" />
              </g>
            )}

            {secondPlayerMoves(game).map(([x, y]) =>
              <circle cx={this.ellipsePos(x)} cy={this.ellipsePos(y)} r="36" fill="none" stroke="#3f6661" strokeWidth="9" style={{ pointerEvents: "none" }} />
            )}
          </svg>
        </div>
      </div>
    );
  }
}

export default connect(({ game }) => ({ game }))(Game);
