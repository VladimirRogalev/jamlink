import { Server as HttpServer } from "http";
import { Socket, Server as SocketIOServer } from "socket.io";
import config from "../config";
import { handleConnection } from "./events.controller";
import { getUserById } from "../services/users.service";
import {
  ServerToClientEvents,
  ClientToServerEvents,
  InterServerEvents,
  SocketData,
} from "./types";
import logger from "../utils/logger";
import { createErrorLog } from "../utils/errorHandler";

let io: SocketIOServer<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
> | null = null;

export function setupSocketIO(
  httpServer: HttpServer
): SocketIOServer<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
> {
  if (io) {
    logger.info("Cleaning up existing Socket.IO server");
    io.disconnectSockets(true);
    io.close();
  }

  io = new SocketIOServer<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >(httpServer, {
    cors: {
      origin: config.corsOrigin,
      methods: ["GET", "POST"],
      credentials: true,
    },
    cookie: {
      name: "jamlink-socket",
      httpOnly: true,
      secure: config.nodeEnv === "production",
    },
    connectionStateRecovery: {
      maxDisconnectionDuration: 10000,
      skipMiddlewares: true,
    },
    pingTimeout: 20000,
    pingInterval: 10000,
  });

  io.use((socket, next) => {
    try {
      const userId = socket.handshake.auth.userId as string | undefined;
      if (userId) {
        logger.debug("Socket auth: User ID provided in auth payload", { userId });
        const user = getUserById(userId);
        if (user) {
          socket.data.userId = userId;
          socket.data.user = user;
          logger.info("Socket auth: User authenticated successfully", { userId });
          return next();
        } else {
          logger.warn("Socket auth: User not found in database", { userId });
        }
      }

      if (config.nodeEnv === "development") {
        if (userId) {
          logger.debug("Socket auth: Development mode - allowing connection", { userId });
          socket.data.userId = userId;
          const user = getUserById(userId);
          if (user) {
            socket.data.user = user;
          }
          return next();
        }
      }

      return next(new Error("Authentication required"));
    } catch (err) {
      logger.error("Socket authentication error", createErrorLog(err));
      next(new Error("Authentication failed"));
    }
  });

  io.on("connection", (socket) => {
    logger.info("New socket connection", { 
      socketId: socket.id, 
      userId: socket.data.userId 
    });
    handleConnection(io!, socket);
  });

  logger.info("Socket.IO server initialized successfully");
  return io;
}

export function getSocketServer() {
  return io;
}

export function closeSocketServer() {
  if (io) {
    logger.info("Closing Socket.IO server");
    io.disconnectSockets(true);
    io.close();
    io = null;
  }
}
