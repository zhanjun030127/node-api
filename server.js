
  const WebSocket = require("ws");

  const server = new WebSocket.Server({ port: 3008, path:"/socket" });

  server.on("connection", (ws) => {
    ws.on("message", (message) => {
      // 广播收到的消息给所有客户端
      server.clients.forEach((client) => {
        let messageToSend = (message instanceof Buffer)? message.toString() : message;
        client.send(messageToSend);
      });
    });
    function sendMessages() {
        const message = '这是服务端发送的消息：' + new Date().toISOString();
        ws.send(message);
    }

    // 立即发送第一条消息
    sendMessages();

    // 每隔一定时间（这里是3秒）就发送一次消息
    setInterval(sendMessages, 3000);
    ws.on("close", () => {
      console.log("Client disconnected");
      clearInterval(sendMessages);
    });

    ws.send("Welcome to WebSocket server!");
  });

  console.log("WebSocket server is running on ws://localhost:3008");

