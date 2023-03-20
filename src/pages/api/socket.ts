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
    let currentroom = "1";
    console.log("conected", socket.id);

    socket.on("joinroom1", (msg) => {
      //join mechanic working as expected!!
      //console.log("join room 1");
      currentroom = "1";
      socket.join("1");
      socket.leave("2");
    });

    socket.on("joinroom2", (msg) => {
      //console.log("join room 2");
      currentroom = "2";
      socket.join("2");
      socket.leave("1");
    });

    socket.on("createdMessage", (msg) => {
      console.log(socket.room);
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
