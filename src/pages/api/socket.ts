import { Server } from "socket.io";

//For now, everyone will join room name after their own id, and will
//send message to other room by their id

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
    let currentroom = "1"; //enter my room
    let target = ""; //sent to who

    console.log("conected", socket.id);

    //Startchat, put both client into right room address
    socket.on("startChat", (msg) => {
      console.log("now your id is: ", msg);
      currentroom = msg.host;
      target = msg.to;
      socket.join(currentroom);
    });

    //new message from client coming, ready to sent to other client
    socket.on("createdMessage", (msg) => {
      io.to(target).emit("newIncomingMessage", msg);

      //console.log(socket.id);
    });
  };

  // Define actions inside
  io.on("connection", onConnection);
  // Define actions inside

  console.log("Setting up socket");
  res.end();
}
