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
    console.log("conected", socket.id);

    socket.on("joinroom1", (msg) => {
      //join mechanic working as expected!!
      console.log("join room 1");
      socket.join("1");
    });

    socket.on("joinroom2", (msg) => {
      console.log("join room 2");
      socket.join("2");
    });

    socket.on("createdMessage", (msg) => {
      io.to("1").emit("newIncomingMessage", msg + "sss");
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
