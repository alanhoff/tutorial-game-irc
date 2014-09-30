// http://webchat.freenode.net?channel=#nodebr

var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io').listen(http);
var irc = require('irc');
var commands = ['up', 'down', 'left', 'right', 'reset'];

// Conexão com o IRC do canal
var client = new irc.Client('chat.freenode.net', 'botdogame', {
    channels: ['#canaldogame'],
    port: 6667
});


client.addListener('error', function(err){
    throw err;
});


// Ao receber uma msg verificamos se é um comando
client.addListener('message#canaldogame', function (from, message) {
    var cmd = commands.filter(function(val){
        return message.toLowerCase().indexOf(val) === 0;
    })[0];


    // Se for um comando eviamos para o navegador
    if(cmd)
        io.sockets.emit('command', {
            user: from,
            command : cmd
        });
});

// Nada de novo aqui, só o express
app.use(express.static('./public'));


// Servimos a página principal com um iframe e
// um painel lateral
app.get('/', function(req, res){
    res.sendfile(__dirname + '/view/index.html');
});

// O jogo mesmo, carrega dentro de um iframe, assim
// não precisamos mexer no CSS, hue hue br
app.get('/game', function(req, res){
    res.sendfile(__dirname + '/view/game.html');
});

// Iniciamos a aplicação
http.listen(8080);
