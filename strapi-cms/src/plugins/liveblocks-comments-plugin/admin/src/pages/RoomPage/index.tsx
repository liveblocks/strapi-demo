/*
 *
 * HomePage
 *
 */
import { format, formatDistance, formatRelative, subDays } from "date-fns";
import React, { useEffect, useState } from "react";
import pluginId from "../../pluginId";
import {
  BaseHeaderLayout,
  Stack,
  Box,
  HeaderLayout,
  Plus,
  Link,
  ArrowLeft,
  Button,
  Pencil,
  Table,
  Tooltip,
  Tbody,
  Thead,
  Tr,
  Td,
  Th,
  VisuallyHidden,
  Typography,
} from "@strapi/design-system";
import { getThreadsInRoom, getRooms, Room } from "../../api";
import { ThreadData } from "@liveblocks/client";

const RoomPage = (a) => {
  const roomId = a.match.params[0];
  const [threads, setThreads] = useState<ThreadData[]>([]);

  useEffect(() => {
    async function run() {
      const fetchedThreads = await getThreadsInRoom(roomId);
      setThreads(fetchedThreads);
    }

    run();
  }, []);

  return (
    <Stack gap={0} paddingBottom={10}>
      <HeaderLayout
        title="Threads"
        subtitle={`${threads.length} thread${
          threads.length > 1 ? "s" : ""
        } found in room "${roomId}".`}
        as="h2"
      />
      <Box paddingLeft={10} paddingRight={10}>
        <Table>
          <Thead>
            <Tr>
              <Th>
                <Typography variant="sigma">Thread ID</Typography>
              </Th>
              <Th>
                <Typography variant="sigma">Comment(s)</Typography>
              </Th>
              <Th>
                <Typography variant="sigma">Created</Typography>
              </Th>
              <Th>
                <VisuallyHidden>Actions</VisuallyHidden>
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {threads.map((thread) => (
              <Tr key={thread.id}>
                <Td>{thread.id}</Td>
                <Td>{thread.comments.length}</Td>
                <Td>
                  <Tooltip
                    description={format(
                      new Date(thread.createdAt),
                      "LLL d, h:mm aa"
                    )}
                    position="bottom"
                  >
                    <button>
                      {formatDistance(new Date(thread.createdAt), new Date(), {
                        addSuffix: true,
                        includeSeconds: true,
                      })}
                    </button>
                  </Tooltip>
                </Td>
                <Td></Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Stack>
  );
};

export default RoomPage;
