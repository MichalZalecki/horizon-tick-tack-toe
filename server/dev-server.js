const path = require("path");
const express = require("express");
const webpack = require("webpack");
const webpackDevMiddleware = require("webpack-dev-middleware");
const webpackHotMiddleware = require("webpack-hot-middleware");
const config = require("../webpack/webpack.dev.config");
const DashboardPlugin = require("webpack-dashboard/plugin");

const horizon = require("@horizon/server");
const http = require("http");
const https = require("https");
const fs = require("fs");

const sslOptions = {
  key: fs.readFileSync(path.join(__dirname, "ssl/key.pem")),
  cert: fs.readFileSync(path.join(__dirname, "ssl/cert.pem")),
  passphrase: "zaq1@WSX",
};

const PORT = process.env.PORT || 8080;

const app = express();

const compiler = webpack(config);

compiler.apply(new DashboardPlugin());

const middleware = webpackDevMiddleware(compiler, {
  contentBase: "build",
  stats: { colors: true },
});

app.use(middleware);
app.use(webpackHotMiddleware(compiler));

app.get("*", (req, res) => {
  res.write(middleware.fileSystem.readFileSync(path.resolve("build/index.html")));
  res.end();
});

const httpServer = https.createServer(sslOptions, app).listen(PORT, () => {
  console.log("express started at https://localhost:%d", httpServer.address().port);
});

const horizonServer = horizon(httpServer, {
  project_name: "horizon_tick_tack_toe",
  auto_create_collection: true,
  auth: {
    token_secret: "my_super_secret_secret",
    allow_unauthenticated: true,
  },
});

horizonServer.add_auth_provider(
  horizon.auth.github,
  {
    id: "3857213892ade4e35924",
    secret: "ed89987c6d672de03dec864d9faa19dbdf553dd8",
    path: "github",
  }
);

horizonServer.add_auth_provider(
  horizon.auth.twitter,
  {
    id: "2j9bHWTvuakOipllccqbBzmPv",
    secret: "YcTjXNje4jUPuVTl38ZbUqqvzYvaXAQqEbTguREt9zfyEioxlh",
    path: "twitter",
  }
);

const { winner } = require("../src/services/GameInfo");

horizonServer._reql_conn._ready_promise.then((reql_conn) => {
  const r = horizon.r;
  const connection = reql_conn.connection();

  r.table("games").changes().run(connection, (err, cursor) => {
    if (err) throw err;
    cursor.each((err, row) => {
      if (err) throw err;
      const game = row.new_val;
      const win = winner(game);
      if (win) {
        r.table("games").get(game.id).update({ winner: win }).run(connection);
      }
    });
  });
});
