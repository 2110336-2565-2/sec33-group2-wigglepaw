import { Server } from "socket.io";

export default function SocketHandler(req, res) {
  // It means that socket server was already initialised
  if (res.socket.server.io) {
    console.log("Already set up");
    res.end();
    return;
  }

  const io = new Server(res.socket.server);
  res.socket.server.io = io;

  const onConnection = (socket) => {
    let currentroom = "1";

    console.log("conected", socket.id);

    socket.on("startChat", (msg) => {
      console.log("now your id is: ", msg);
      currentroom = msg;
      socket.join(currentroom); //now will send to room itself
    });

    socket.on("createdMessage", (msg) => {
      io.to(currentroom).emit("newIncomingMessage", msg);
      console.log(socket.id);
      console.log(msg);
    });
  };

  // Define actions inside
  io.on("connection", onConnection);
  // Define actions inside

  console.log("Setting up socket");
  res.end();
}
