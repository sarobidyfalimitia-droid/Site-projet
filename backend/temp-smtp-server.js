const net = require('net');
const server = net.createServer((socket) => {
  let buffer = '';
  socket.write('220 localhost ESMTP\r\n');
  socket.on('data', (chunk) => {
    const data = chunk.toString('utf8');
    buffer += data;
    if (buffer.includes('\r\n')) {
      const lines = buffer.trim().split(/\r\n/);
      const cmd = lines[0].toUpperCase().split(' ')[0];
      if (cmd === 'EHLO' || cmd === 'HELO') {
        socket.write('250-localhost\r\n250 AUTH PLAIN LOGIN\r\n');
      } else if (cmd === 'MAIL') {
        socket.write('250 OK\r\n');
      } else if (cmd === 'RCPT') {
        socket.write('250 OK\r\n');
      } else if (cmd === 'DATA') {
        socket.write('354 End data with <CR><LF>.<CR><LF>\r\n');
      } else if (cmd === 'QUIT') {
        socket.write('221 Bye\r\n');
        socket.end();
      } else if (cmd === 'RSET') {
        socket.write('250 OK\r\n');
      } else {
        socket.write('250 OK\r\n');
      }
      buffer = '';
    }
  });
});
server.listen(1025, '127.0.0.1', () => {
  console.log('SMTP test server listening on 127.0.0.1:1025');
});
