import { Server } from "socket.io";

export default function SocketHandler(req, res) {
  console.log("hi");
  // It means that socket server was already initialised
  if (res.socket.server.io) {
    console.log("Already set up");
    res.end();
    return;
  }

  const io = new Server(res.socket.server);
  res.socket.server.io = io;

  const onConnection = (socket) => {
    console.log("conected");
    socket.on("createdMessage", (msg) => {
      socket.emit("newIncomingMessage", "FUCK!");
      console.log(msg);
    });
  };

  // Define actions inside
  io.on("connection", onConnection);
  // Define actions inside

  console.log("Setting up socket");
  res.end();
}
