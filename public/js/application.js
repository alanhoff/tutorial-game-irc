// Wait till the browser is ready to render the game (avoids glitches)
window.requestAnimationFrame(function () {
  window.game = new GameManager(4, KeyboardInputManager, HTMLActuator, LocalScoreManager);
});

var socket = io.connect();
socket.on('command', function (data) {
    var moves = ['up', 'right', 'down', 'left'];
    if(moves.indexOf(data.command) !== -1){
        if(window.game)
            window.game.move(moves.indexOf(data.command));
    } else if(data.command === 'reset') {
        if(window.game)
            window.game.restart();
    }
});
