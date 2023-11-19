import dotenv from "dotenv";
dotenv.config();

import app from "./app";

function init() {
  app.listen(app.get("port"));
}

init();
