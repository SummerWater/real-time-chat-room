$(function () {
  var socket = io();

  // 点击提交，发送 chat message事件
  $('form').submit(function(){
    processUserInput(socket);
    return false;
  });

  // 输入状态
  $('#m').bind('input propertychange', () => {
    var msg = $('#m').val();
    socket.emit('inputing', msg);
  })

  socket.on('inputStatus', (chat_status) => {
    $('#guestNumber').text(chat_status);
  })

  socket.on('inputStatus', (status) => {
    $('#guestNumber').text(status);
  })


  // 接收chat message 事件, 将信息广播给用户
  socket.on('chat message', (msg) => {
    $('#messages').append($('<li>').text(msg));
    messageScrollTop();
  });

  // 系统广播
  socket.on('chat broadcast', (msg) => {
    $('#messages').append($('<li class="red">').text(msg));
  })

  // 房间人数
  socket.on('guest number', (num) => {
    $('#guestNumber').text('房间人数：' + num + '人')
  })
});

function processUserInput(socket) {
  var msg = $('#m').val();
  if(msg.charAt(0) == '/'){
    var command = msg.split(' ')[0].substr(1);
    // 用户命令
    switch(command) {
      case 'name':
        var newName = msg.split(' ')[1];
        if(newName && newName != ''){
          socket.emit('changeName', newName);
          $('#messages').append($('<li class="red">').text('恭喜，改名成功！'));
          messageScrollTop();
        }else{
          $('#messages').append($('<li class="red">').text('名字不能为空.修改名字格式：/name xxx'));
          messageScrollTop();
        }
        break;
      default:
        $('#messages').append($('<li class="red">').text('请输入正确的命令.name/ xxx命令可以修改名字'));
        messageScrollTop();
        break;
    }
  }else{
    socket.emit('chat message', msg);
  }
  $('#m').val('');
}

// 底部消息滚动到顶部
function messageScrollTop(){
  if($('#messages').is(':animated')){
    $('#messages').stop();
    // 消息量巨大启用
    // $('#messages').scrollTop($('#messages').prop('scrollHeight'));
    // 消息数量少启用
    $('#messages').animate({scrollTop: $('#messages').prop('scrollHeight')}, 500)
  }else{
    $('#messages').animate({scrollTop: $('#messages').prop('scrollHeight')}, 500)
  }
}