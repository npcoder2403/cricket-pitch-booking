import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useQueryClient } from "@tanstack/react-query";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:4000";

export function useSocket(pitchId: string, date: string) {
  const socketRef = useRef<Socket | null>(null);
  const queryClient = useQueryClient();
  const dateRef = useRef(date);

  useEffect(() => {
    if (!pitchId) return;

    const socket = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("join-pitch", pitchId);
    });

    socket.on("slot:reserved", (data: { pitchId: string }) => {
      if (data.pitchId === pitchId) {
        queryClient.invalidateQueries({
          queryKey: ["slots", pitchId, dateRef.current],
        });
      }
    });

    socket.on("slot:released", (data: { pitchId: string }) => {
      if (data.pitchId === pitchId) {
        queryClient.invalidateQueries({
          queryKey: ["slots", pitchId, dateRef.current],
        });
      }
    });

    socket.on("slot:booked", (data: { pitchId: string }) => {
      if (data.pitchId === pitchId) {
        queryClient.invalidateQueries({
          queryKey: ["slots", pitchId, dateRef.current],
        });
      }
    });

    return () => {
      socket.emit("leave-pitch", pitchId);
      socket.disconnect();
      socketRef.current = null;
    };
  }, [pitchId, queryClient]);
}
