import { getFetchClient } from "@strapi/helper-plugin";
import pluginId from "./pluginId";
import { ThreadData } from "@liveblocks/client"

export type Room = {
  type: "room";
  id: string;
  createdAt: string;
  lastConnectionAt: string;
  defaultAccesses: string[];
  groupsAccesses: Record<string, string[]>;
  usersAccesses: Record<string, string[]>;
  metadata: Record<string, string | string[]>;
}

const { get } = getFetchClient()

export async function getRooms(): Promise<Room[]> {
  try {
    const response = await get(`/${pluginId}/getLiveblocksRooms`)
    return response.data.data;
  } catch(err) {
    console.log(err)
    return []
  }
}

export async function getThreadsInRoom(roomId: string): Promise<ThreadData[]> {
  try {
    const response = await get(`/${pluginId}/getLiveblocksRoomThreads?roomId=${roomId}`)
    return response.data.data;
  } catch(err) {
    console.log(err)
    return []
  }
}
