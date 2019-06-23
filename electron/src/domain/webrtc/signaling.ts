import WebRTC from "../../lib/webrtc";

const url = "ws://localhost:8080";

type Action = { type: string; [key: string]: any };

export function create(roomId: string, trickle: boolean) {
  return new Promise<WebRTC>(async resolve => {
    const rtc = new WebRTC({ trickle: false });
    rtc.onSignal.subscribe((session: any) => {
      console.log({ session });
      const { type, sdp } = session;
      const data = type + "%" + sdp;
      console.log("signal", { sdp: data, roomId });
      send({ type: "sdp", sdp: data, roomId });
    });

    rtc.onConnect.once(() => {
      console.log("connect");
      resolve(rtc);
    });

    rtc.onData.once(e => console.log("connected", e.data));

    const socket = new WebSocket(url);

    const send = (action: Action) => socket.send(JSON.stringify(action));

    socket.addEventListener("message", event => {
      const { data } = event;
      try {
        const action: Action = JSON.parse(data);
        console.log({ action });
        switch (action.type) {
          case "sdp":
            rtc.setSdp(action.sdp);
            break;
          case "join":
            console.log("onjoin");
            rtc.makeOffer();
            break;
        }
      } catch (error) {}
    });

    socket.addEventListener("open", () => {
      send({ type: "create", roomId });
    });
  });
}
