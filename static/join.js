var canvas = document.getElementById('canvas');
var board = canvas.getContext('2d');
var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);
var url = new URL(window.location.href);
fetch('/sos', {
    method: 'post',
    body: JSON.stringify({
        "sos_signal": url.searchParams.get('id') + 'sos'
    })
})
socket.on(url.searchParams.get('id'), function (msg) {
    var image = new Image();
    image.onload = function () {
        canvas.width = image.width;
        canvas.height = image.height;
        board.drawImage(image, 0, 0, image.width, image.height);
    };
    image.src = msg.pic;
})
