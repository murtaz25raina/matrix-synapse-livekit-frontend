import { useCallback, useEffect, useState } from "react";
import { ClientEvent, Room } from "matrix-js-sdk";
import { useClientContext } from "../providers/ClientProvider";
import { getLocalStorage } from "../helpers/localStorage";

interface RoomListHook {
  rooms: Room[] | null;
  setRooms: React.Dispatch<React.SetStateAction<Room[] | null>>;
}

const useRoomList = (): RoomListHook => {
  const [rooms, setRooms] = useState<Room[] | null>(null);
  const { client } = useClientContext();

  const filterRooms = useCallback((rooms: Room[]) => {
    const userId = getLocalStorage("user_id") as string;
    return rooms?.filter(
      (room) => room.getMember(userId)?.membership !== "leave"
    );
  }, []);

  useEffect(() => {
    if (!client) return;
    const handleSync = () => {
      const syncState = client.getSyncState();
      if (syncState === "PREPARED" || syncState === "SYNCING") {
        setRooms(filterRooms(client.getRooms()));
      }
    };

    handleSync();

    client.on(ClientEvent.Sync, handleSync);

    return () => {
      client.off(ClientEvent.Sync, handleSync);
    };
  }, [client, filterRooms]);
  return {
    rooms,
    setRooms,
  };
};

export default useRoomList;
