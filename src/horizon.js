import horizon from "@horizon/client";

const hz = horizon({
  host: "localhost:8080",
  // authType: "token",
});

export default hz;
