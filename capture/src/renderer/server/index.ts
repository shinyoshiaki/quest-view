declare global {
  interface Window {
    require: any;
  }
}

export default async function server() {
  await new Promise(r => setTimeout(r, 1000));
  console.log(window);
  const WS: any = window.require("ws");

  console.log("server");

  const wss = new WS.Server({ port: 8080 });

  wss.on("connection", (ws: any) => {
    ws.on("message", (v: any) => {
      console.log(v);
    });
    ws.send("server");
  });
}
