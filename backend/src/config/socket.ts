import { Server as HttpServer } from "http";
import { Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import Redis from "ioredis";
import { config } from "./index";

let io: Server;

export function initSocket(httpServer: HttpServer): Server {
  io = new Server(httpServer, {
    cors: {
      origin: config.frontendUrls,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  const pubClient = new Redis(config.redisUrl);
  const subClient = pubClient.duplicate();

  io.adapter(createAdapter(pubClient, subClient));

  io.on("connection", (socket) => {
    socket.on("join-pitch", (pitchId: string) => {
      socket.join(`pitch:${pitchId}`);
    });

    socket.on("leave-pitch", (pitchId: string) => {
      socket.leave(`pitch:${pitchId}`);
    });
  });

  return io;
}

export function getIO(): Server {
  return io;
}
