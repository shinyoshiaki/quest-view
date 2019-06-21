import WS from "ws";

console.log("server");

const wss = new WS.Server({ port: 8080 });

wss.on("connection", ws => {
  ws.on("message", v => {
    console.log(v);
    ws.send("server");
  });

  ws.send("server");
});
