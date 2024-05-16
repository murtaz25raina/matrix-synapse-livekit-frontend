import {
  createContext,
  useContext,
  useEffect,
  FC,
  ReactNode,
  useState,
} from "react";
import { MatrixClient, createClient } from "matrix-js-sdk";
import * as sdk from "matrix-js-sdk";

interface ClientContextProps {
  client: MatrixClient;
  startClient: () => Promise<void>;
  setupSync: () => void;
}

const ClientContext = createContext<ClientContextProps | null>(null);

export const useClientContext = () => {
  const context = useContext(ClientContext);
  if (!context) {
    throw new Error("useClientContext must be used within a ClientProvider");
  }
  return context;
};

interface ClientProviderProps {
  children: ReactNode;
}

export const ClientProvider: FC<ClientProviderProps> = ({ children }) => {
  const [client, setClient] = useState<MatrixClient>(
    createClient({
      baseUrl: "http://localhost:8008/",
    })
  );
  const accessToken = localStorage.getItem("access_token") || undefined;
  const userId = localStorage.getItem("user_id") || undefined;
  const deviceId = localStorage.getItem("device_id") || undefined;

  useEffect(() => {
    if (!accessToken || !userId || !deviceId) return;
    async function init() {
      if (client && client.clientRunning) {
        return;
      }
      await startClient();
      setupSync();
    }
    init();
  }, [client, accessToken, deviceId, userId]);

  useEffect(() => {
    if (!client) return;
    const handleRoomMember = (event: sdk.MatrixEvent, member: any) => {
      if (member.membership === "invite" && member.userId === userId) {
        client.joinRoom(member.roomId).then(function () {
          console.log("Auto-joined %s", member.roomId);
        });
      }
    };
    client.on(sdk.RoomMemberEvent.Membership, handleRoomMember);
    return () => {
      client.off(sdk.RoomMemberEvent.Membership, handleRoomMember);
    };
  }, [client, userId]);

  async function startClient() {
    const indexedDBStore = new sdk.IndexedDBStore({
      indexedDB: window.indexedDB,
      localStorage: window.localStorage,
      dbName: "web-sync-store",
    });

    indexedDBStore.setUserCreator((uid) => sdk.User.createUser(uid, client));
    await indexedDBStore.startup();

    const accessToken = localStorage.getItem("access_token") || undefined;
    const userId = localStorage.getItem("user_id") || undefined;
    const deviceId = localStorage.getItem("device_id") || undefined;
    const newMatrixClient = createClient({
      baseUrl: "http://localhost:8008/",
      accessToken,
      userId,
      deviceId,
      store: indexedDBStore,
      timelineSupport: true,
    });

    await newMatrixClient.startClient({
      lazyLoadMembers: true,
      initialSyncLimit: 10,
    });

    newMatrixClient.setMaxListeners(15);
    setClient(newMatrixClient);
  }
  function setupSync() {
    client.on(sdk.ClientEvent.Event, function (event: sdk.MatrixEvent) {
      // console.log(event, "EVENT");
    });
  }
  return (
    <ClientContext.Provider value={{ client, startClient, setupSync }}>
      {children}
    </ClientContext.Provider>
  );
};
