import { FC } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { layout } from "./layout.js";
import { useWebRTC, LOCAL_VIDEO } from "@/shared/config/hooks";
import { ROUTE_PATHS } from "@/shared/config/router";

interface RoomPageProps {}

const RoomPage: FC<RoomPageProps> = () => {
  const { id: roomID } = useParams<{ id?: string }>();
  const { clients, provideMediaRef } = useWebRTC(roomID);
  console.log({ clients });
  const videoLayout = layout(clients.length);
  const navigate = useNavigate();

  const onLeaveRoom = () => {
    navigate(ROUTE_PATHS.HOME);
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexWrap: "wrap",
        height: "100vh",
        transform: "rotateY(180deg)",
      }}
    >
      {clients.map((clientID, index) => {
        return (
          <div key={clientID} style={videoLayout[index]} id={clientID}>
            <video
              width="100%"
              height="100%"
              ref={(instance) => {
                provideMediaRef(clientID, instance);
              }}
              autoPlay
              playsInline
              muted={clientID === LOCAL_VIDEO}
            />
          </div>
        );
      })}
      <button onClick={onLeaveRoom}>LEAVE</button>
    </div>
  );
};

export default RoomPage;
