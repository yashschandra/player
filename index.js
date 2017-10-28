var express=require('express');
var app=express();
var webSocketServer=require('ws').Server;
var server=require('http').createServer(app);
var path=require('path');
var settings=require('./settings');
var port=settings.PORT;
wss=new webSocketServer({server: server});
var clients=[];

app.use('/static', express.static(path.join(__dirname, 'static')));

wss.on('connection', function connection(ws){
	clients.push(ws);
	ws.on('message', function incoming(message){
		var data=JSON.parse(message);
		for(i=0; i<clients.length; i++){
			clients[i].send(message);
		}
	});
	ws.on('close', function(){
		for(i=0; i<clients.length; i++){
			if(clients[i]==ws){
				clients.splice(i, 1);
				break;
			}
		}
	});
});

server.listen(port);
module.exports=app;
