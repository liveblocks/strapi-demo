/*
 *
 * HomePage
 *
 */
import { format, formatDistance } from "date-fns";
import React, { useEffect, useState } from "react";
import pluginId from "../../pluginId";
import {
  Stack,
  Box,
  HeaderLayout,
  Link,
  Badge,
  Typography,
  Table,
  Tbody,
  Thead,
  Tr,
  Td,
  Tooltip,
  Th,
  VisuallyHidden,
} from "@strapi/design-system";
import { getRoomsWithThreads, Room, RoomWithThreads } from "../../api";

const HomePage = () => {
  const [rooms, setRooms] = useState<RoomWithThreads[]>([]);

  useEffect(() => {
    async function run() {
      const fetchedRooms = await getRoomsWithThreads();
      setRooms(fetchedRooms);
    }

    run();
  }, []);

  // TODO - add preview URL to metadata and link to it
  // TODO - details summary with list of threads
  return (
    <Stack gap={0} paddingBottom={10}>
      <HeaderLayout
        title="Liveblocks Comments"
        subtitle={`${rooms.length} room${
          rooms.length > 1 ? "s" : ""
        } found with comments.`}
        as="h2"
      />
      {rooms.length ? (
        <Box paddingLeft={10} paddingRight={10}>
          <Table>
            <Thead>
              <Tr>
                <Th>
                  <Typography variant="sigma">Room ID</Typography>
                </Th>
                <Th>
                  <Typography variant="sigma">Resolved thread(s)</Typography>
                </Th>
                <Th>
                  <Typography variant="sigma">Created</Typography>
                </Th>
                <Th>
                  <Typography variant="sigma">Last connection</Typography>
                </Th>
                <Th>
                  <VisuallyHidden>Actions</VisuallyHidden>
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {rooms.map((room) => (
                <Tr key={room.id}>
                  <Td>
                    <Link
                      to={`${pluginId}/room/${encodeURIComponent(room.id)}`}
                    >
                      {room.id}
                    </Link>
                  </Td>
                  <Td>
                    {room.threads ? (
                      <Badge
                        style={{
                          fontVariantNumeric: "tabular-nums",
                        }}
                        active={
                          room.threads.filter(
                            (thread) => thread.metadata.resolved
                          ).length === room.threads.length
                        }
                      >
                        {
                          room.threads.filter(
                            (thread) => thread.metadata.resolved
                          ).length
                        }
                        /{room.threads.length}
                      </Badge>
                    ) : null}
                  </Td>
                  <Td>
                    <Tooltip
                      description={format(
                        new Date(room.createdAt),
                        "LLL d, h:mm aa"
                      )}
                      position="bottom"
                    >
                      <button>
                        {formatDistance(new Date(room.createdAt), new Date(), {
                          addSuffix: true,
                          includeSeconds: true,
                        })}
                      </button>
                    </Tooltip>
                  </Td>
                  <Td>
                    <Tooltip
                      description={format(
                        new Date(room.lastConnectionAt),
                        "LLL d, h:mm aa"
                      )}
                      position="bottom"
                    >
                      <button>
                        {formatDistance(
                          new Date(room.lastConnectionAt),
                          new Date(),
                          {
                            addSuffix: true,
                            includeSeconds: true,
                          }
                        )}
                      </button>
                    </Tooltip>
                  </Td>
                  <Td></Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      ) : null}
    </Stack>
  );
};

export default HomePage;
