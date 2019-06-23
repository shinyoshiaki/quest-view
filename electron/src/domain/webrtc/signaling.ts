import WebRTC from "../../lib/webrtc";

const url = "ws://localhost:8080";

type Action = { type: string; [key: string]: any };

export function create(roomId: string, trickle: boolean) {
  return new Promise<WebRTC>(resolve => {
    const rtc = new WebRTC({ nodeId: "answer", trickle });
    const socket = new WebSocket(url);

    const send = (action: Action) => socket.send(JSON.stringify(action));

    socket.addEventListener("message", event => {
      const { data } = event;
      try {
        const action: Action = JSON.parse(data);
        switch (action.type) {
          case "sdp":
            rtc.setSdp(action.sdp);
            break;
        }
      } catch (error) {}
      console.log("Message from server ", event.data);
    });

    socket.addEventListener("open", () => {
      send({ type: "create", roomId });

      const onSignal = rtc.onSignal.subscribe((sdp: any) => {
        console.log({ sdp, roomId });
        send({ type: "sdp", sdp, roomId });
      });

      rtc.onConnect.once(() => {
        console.log("connect");
        onSignal.unSubscribe();
        resolve(rtc);
      });
    });
  });
}
