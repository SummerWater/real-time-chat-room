var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var guestnumber = 0;
var nickNames = {};
var nameUsed = [];

// 设置路由
app.get('/', (req, res) => {
	res.sendFile(__dirname + '/public/index.html');
});

app.get('/css/style.css', (req, res) => {
  res.sendFile(__dirname + '/public/css/style.css');
});

app.get('/js/chat_ui.js', (req, res) => {
  res.sendFile(__dirname + '/public/js/chat_ui.js');
});

// 用户连接的响应
io.on('connection', (socket) => {
  // 新用户加入房间
  handleUserConnect(socket);
  // 用户断开连接
  socket.on('disconnect', () => {
    handleUserDisconnect(socket);
  })
  // 用户发送信
	socket.on('chat message', (msg) => {
    handleMessage(socket, msg)
    chatStatus(socket);
	})
  // 改名命令
  socket.on('changeName', (newName) => {
    nickNames[socket.id] = newName;
    chatStatus(socket);
  })
  // 输入状态
  socket.on('inputing', (msg) => {
    chatStatus(socket, msg);
  })
});

// 新用户连接
function handleUserConnect(socket){
  handleBroadcast('系统提示：有新用户加入房间.');
  guestnumber++;
  io.emit('guest number', guestnumber);
  // 初始化名字
  nickNames[socket.id] = 'guest' + guestnumber;
}

// 用户断开
function handleUserDisconnect(socket){
  // handleBroadcast('系统提示：有用户断开连接');
  guestnumber--;
  io.emit('guest number', guestnumber);
}

// 用户发送信息
function handleMessage(socket, msg){
  io.emit('chat message', nickNames[socket.id] + ':' + msg);
}

// 广播
function handleBroadcast(broad){
  io.emit('chat broadcast', broad);
}

// 输入状态
function chatStatus(socket, msg) {
  if(msg == '' || !msg){
    io.emit('guest number', guestnumber);
  }else{
    var chat_status = nickNames[socket.id] + '正在输入...';
    io.emit('inputStatus', chat_status);
  }
}

// 监听：3000端口
http.listen(3000, () => {
	console.log('Listening  on *: 3000');
});
