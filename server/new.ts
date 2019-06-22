import WS from "ws";
import uuid from "uuid/v4";
const wss = new WS.Server({ port: 8080 });

console.log("start");

const roomList: { [key: string]: { hostId: string; guestId: string } } = {};
const wsList: { [id: string]: WS } = {};

type roomObj = {
  roomId: string;
};

wss.on("connection", ws => {
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

      console.log("sdp", { room, data });

      if (id === room.hostId) {
        if (wsList[room.guestId]) wsList[room.guestId].emit("sdp", { sdp });
      } else {
        if (wsList[room.hostId]) wsList[room.hostId].emit("sdp", { sdp });
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
      ws.emit("join", { room: roomId });
    }
  };

  ws.on("message", data => {
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
