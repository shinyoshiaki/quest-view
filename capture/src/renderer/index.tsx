import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

import server from "./server";

server();

ReactDOM.render(<App />, document.getElementById("app"));
