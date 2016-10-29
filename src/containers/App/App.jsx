import React, { PropTypes, Component } from "react";

import "./App.css";
import { login, logout, isLoggedIn } from "../../services/session";

class App extends Component {
  static propTypes = {
    children: PropTypes.node,
  };

  constructor(props) {
    super(props);

    this.loginWithGithub = () => { login("github"); };
    this.loginWithTwitter = () => { login("twitter"); };
  }

  render() {
    return (
      <div>
        {isLoggedIn() ?
          <div>
            <button onClick={logout}>Logout</button>
          </div>
          :
          <div>
            Login:&nbsp;
            <button onClick={this.loginWithGithub}>GitHub</button>
            <button onClick={this.loginWithTwitter}>Twitter</button>
          </div>
        }
        {this.props.children}
      </div>
    );
  }
}

export default App;
