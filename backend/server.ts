import { createServer } from "http";
import app from "./src/app";
import { config } from "./src/config";
import { initSocket } from "./src/config/socket";
import { initReservationQueue } from "./src/jobs/reservation.expiry.job";

const httpServer = createServer(app);

initSocket(httpServer);
initReservationQueue();

httpServer.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
