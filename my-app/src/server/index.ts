console.log(window);
const { remote } = (window as any)('electron');
const WS: any = (window as any).require("ws");

console.log("server");

const wss = new WS.Server({ port: 8080 });

wss.on("connection", (ws: any) => {
  ws.on("message", (v: any) => {
    console.log(v);
  });
  ws.send("server");
});
