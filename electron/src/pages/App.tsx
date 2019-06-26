import React, { FC, useState, useEffect } from "react";
import Display from "../components/display";
import { create } from "../domain/webrtc/signaling";
import { moveMouse, clickMouse, keyTap } from "../server/robot";
import ipv4 from "../server/ip";

const Cast: FC = () => {
  const [ip, setIp] = useState("");

  useEffect(() => {
    (async () => {
      const res = await ipv4();
      setIp(res);
    })();
  }, []);

  const onStream = async (stream: MediaStream) => {
    const peer = await create("room", stream);

    peer.onData.subscribe((msg: any) => {
      console.log(msg);
      const data = JSON.parse(msg.data);
      switch (data.type) {
        case "move":
          moveMouse.execute(data.payload);
          break;
        case "click":
          clickMouse.execute();
          break;
        case "key":
          keyTap.execute(data.payload);
          break;
      }
    });
  };

  return (
    <div>
      <p>pin code</p>
      <p>{ip}</p>
      <Display onStream={onStream} />
    </div>
  );
};

export default Cast;
