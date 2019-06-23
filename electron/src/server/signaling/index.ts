import WS_ from "ws";
import uuid from "uuid/v4";
const load = (window as any).require;
const WS: typeof WS_ = load("ws");

type Action = { type: string; [key: string]: any };

export default function signalingServer() {
  const wss = new WS.Server({ port: 8080 });

  console.log("start");

  const roomList: { [key: string]: { hostId: string; guestId: string } } = {};
  const wsList: { [id: string]: WS_ } = {};

  type roomObj = {
    roomId: string;
  };

  wss.on("connection", ws => {
    const send = (action: Action, ws: WS_) => ws.send(JSON.stringify(action));

    const id = uuid();
    wsList[id] = ws;

    const create = (data: roomObj) => {
      const { roomId } = data;
      console.log("create", roomId);
      roomList[roomId] = { hostId: id, guestId: "" };
      console.log("roomList", roomList);
    };

    const connect = (data: roomObj) => {
      const { roomId } = data;
      console.log("connected", roomId, id);
      const { hostId, guestId } = roomList[roomId];
      delete roomList[roomId];
      wsList[hostId].close();
      delete wsList[hostId];
      wsList[guestId].close();
      delete wsList[guestId];
    };

    const sdp = (data: { roomId: string; sdp: string }) => {
      try {
        const { roomId, sdp } = data;

        const room = roomList[roomId];

        console.log({ type: "sdp", sdp });

        if (id === room.hostId) {
          const ws = wsList[room.guestId];
          if (ws) send({ type: "sdp", sdp }, ws);
        } else {
          const ws = wsList[room.hostId];
          if (ws) send({ type: "sdp", sdp }, ws);
        }
      } catch (error) {
        console.log(error);
      }
    };

    const join = (data: roomObj) => {
      const { roomId } = data;
      if (Object.keys(roomList).includes(roomId)) {
        console.log("join", roomId);
        const room = roomList[roomId];
        room.guestId = id;
        console.log("roomList", roomList);
        const ws = wsList[room.hostId];
        send({ type: "join", room: roomId }, ws);
      }
    };

    ws.on("message", data => {
      console.log("message", data);
      try {
        const action = JSON.parse(data as string);
        switch (action.type) {
          case "create":
            create(action);
            break;
          case "connect":
            connect(action);
            break;
          case "join":
            join(action);
            break;
          case "sdp":
            sdp(action);
            break;
        }
      } catch (error) {}
    });
  });
}
