//##################################################################
// Variables
//##################################################################
var modal = new bootstrap.Modal(document.getElementById('staticBackdrop'), {
    keyboard: false,
    focus: true,
    backdrop: 'static'
});
var canvas = document.getElementById('board');
var board = canvas.getContext('2d');
var pen = 1;
var drawing = false;
var place1 = [];
var place2 = [];
var undo = [];
var be_click;
var none_b;
var socket = io.connect(document.location.href);
var user = {
    'tr_id': false,
}
var now = 0;
var pages = [];
var page_now = 0;
//##################################################################
// Settings
//##################################################################
var style = 'green';
//##################################################################
// Functions
//##################################################################
function copy_url() {
    const el = document.createElement('textarea');
    el.type = 'hidden';
    el.value = document.getElementById('url').value;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
}

function color_ch() {
    var color = document.getElementById('inp_color').value;
    var c2 = document.createElement('button');
    c2.style.backgroundColor = color;
    c2.className = "btn";
    c2.onclick = carry(click, [color]);
    document.getElementById('gener').appendChild(c2);

}

function pen1(x, y, dx, dy) {
    board.moveTo(x, y);
    board.lineTo(dx, dy);
    board.stroke();
}

function get_tr(id_t) {
    user.tr_id = id_t;
}

function Up(id, min) {
    var dis = document.getElementById(id).style.height;
    if (dis === min) {
        document.getElementById(id).style.height = '90%';
    } else {
        document.getElementById(id).style.height = min;
    }
}

function click(ar) {
    style = ar;
    board.strokeStyle = style;
    document.getElementById('color_now').style.backgroundColor = style;
}

function carry(callback, arglist) {
    var thisObj = this;
    return (function () {
        callback.apply(thisObj, arglist)
    });
}

function colors() {
    modal.show()
}

function load() {
    board.lineWidth = 59;
    board.strokeStyle = 'green';
    board.lineCap = "round";
    canvas.style.cursor = 'crosshair';
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    var palette = document.getElementById('palitra');
    for (var r = 0; r < 255; r += 255) {
        for (var g = 0; g < 255; g += 125) {
            for (var b = 0; b < 255; b += 125) {
                var color = document.createElement('button');
                color.style.backgroundColor = 'rgb(' + r + ', ' + g + ', ' + b + ')';
                color.className = "btn";
                color.onclick = carry(click, ['rgb(' + r + ', ' + g + ', ' + b + ')']);
                palette.appendChild(color);
            }
        }
    }
    var palette2 = document.getElementById('red');
    for (var r1 = 0; r1 < 255; r1 += 5) {
        var c1 = document.createElement('button');
        c1.style.backgroundColor = 'rgb(' + r1 + ', 0, 0)';
        c1.className = "btn";
        c1.onclick = carry(click, ['rgb(' + r1 + ', 0, 0)']);
        palette2.appendChild(c1);
    }
    var palette3 = document.getElementById('green');
    for (var g1 = 0; g1 < 255; g1 += 5) {
        var c2 = document.createElement('button');
        c2.style.backgroundColor = 'rgb( 0, ' + g1 + ', 0)';
        c2.className = "btn";
        c2.onclick = carry(click, ['rgb(0, ' + g1 + ', 0)']);
        palette3.appendChild(c2);
    }
    var palette4 = document.getElementById('blue');
    for (var b1 = 0; b1 < 255; b1 += 5) {
        var c = document.createElement('button');
        c.style.backgroundColor = 'rgb(0, 0, ' + b1 + ')';
        c.className = "btn";
        c.onclick = carry(click, ['rgb(0, 0, ' + b1 + ')']);
        palette4.appendChild(c);
    }
    var pal5 = document.getElementById('white');
    for (var b2 = 0; b2 < 255; b2 += 5) {
        var c3 = document.createElement('button');
        c3.style.backgroundColor = 'rgb(' + b2 + ', ' + b2 + ', ' + b2 + ')';
        c3.className = "btn";
        c3.onclick = carry(click, ['rgb(' + b2 + ', ' + b2 + ', ' + b2 + ')']);
        pal5.appendChild(c3);
    }
    var pal6 = document.getElementById('yellow');
    for (var b3 = 0; b3 < 255; b3 += 5) {
        var c4 = document.createElement('button');
        c4.style.backgroundColor = 'rgb(' + b3 + ', ' + b3 + ', 0)';
        c4.className = "btn";
        c4.onclick = carry(click, ['rgb(' + b3 + ', ' + b3 + ', 0)']);
        pal6.appendChild(c4);
    }
    var pal7 = document.getElementById('wblue');
    for (var b4 = 0; b4 < 255; b4 += 5) {
        var c5 = document.createElement('button');
        c5.style.backgroundColor = 'rgb(0,' + b4 + ', ' + b4 + ')';
        c5.className = "btn";
        c5.onclick = carry(click, ['rgb(0,' + b4 + ', ' + b4 + ')']);
        pal7.appendChild(c5);
    }
    var pal8 = document.getElementById('purple');
    for (var b5 = 0; b5 < 255; b5 += 5) {
        var c6 = document.createElement('button');
        c6.style.backgroundColor = 'rgb(' + b5 + ', 0, ' + b5 + ')';
        c6.className = "btn";
        c6.onclick = carry(click, ['rgb(' + b5 + ', 0, ' + b5 + ')']);
        pal8.appendChild(c6);
    }
    none_b = canvas.toDataURL('image/png');
    fetch('/tr_id').then(
        resp => resp.json()
    ).then(
        json => {
            if (json['tr_id'] !== 'BAD') {
                get_tr(json['tr_id']);
                document.getElementById('url').value = json['url_for_join'];
                socket.on(json['hash'] + 'sos', send);
            }
        }
    )
    pages.push(canvas.toDataURL('image/png'));
    document.getElementById('color_now').style.backgroundColor = style;
}

function ref() {
    var red = document.getElementById('red');
    var green = document.getElementById('green');
    var blue = document.getElementById('blue');
    red.style.backgroundColor = 'rgb(' + red.value + ', 0, 0)';
    green.style.backgroundColor = 'rgb(0, ' + green.value + ', 0)';
    blue.style.backgroundColor = 'rgb(0, 0, ' + blue.value + ')';
    document.getElementById('color').style.backgroundColor = 'rgb(' + red.value + ', ' + green.value + ', ' + blue.value + ')';
    document.getElementById('color').onclick = carry(click, ['rgb(' + red.value + ', ' + green.value + ', ' + blue.value + ')'])
}

function change() {
    board.lineWidth = document.getElementById('size').value;
}


function pen2(x, y, dx, dy) {
    var width = document.getElementById('size').value;
    board.globalCompositeOperation = 'destination-out';
    board.strokeStyle = "rgb(255,255,255)"; // зададим белый цвет, чтобы проверить,
    board.lineWidth = width;
    pen1(x, y, dx, dy);
    board.globalCompositeOperation = "source-over";
}


function return_settings() {
    board.lineWidth = document.getElementById('size').value;
    board.strokeStyle = style;
    board.lineCap = "round";
}


function start(mouse) {
    var x = mouse.offsetX;
    var y = mouse.offsetY;
    var dx = x - mouse.movementX;
    var dy = y - mouse.movementY;
    drawing = true;
    board.beginPath();
    if (pen === 3) {
        be_click = canvas.toDataURL('image/png');
        place1 = [x, y, dx, dy];
    }
    return_settings();
    undo.push(canvas.toDataURL('image/png'));
    if (undo.length > 30) {
        undo.shift()
    }
    now = undo.length;
}

function undo_redo(go) {
    if (-1 < now + go && now + go < undo.length) {
        var image = new Image();
        image.onload = function () {
            canvas.width = image.width;
            canvas.height = image.height;
            board.drawImage(image, 0, 0, image.width, image.height);
            send();
        }
        now += go
        image.src = undo[now];
    }
}

function exportPdf() {
    let pdf = new jsPDF('l', 'pt', 'a4');
    pdf.deletePage(1);
    pages[page_now] = canvas.toDataURL('image/png');
    pdf.deletePage()
    for (let i = 0; i < pages.length; i++) {
        let img = new Image();
        img.src = pages[i];
        img.onload = function () {
            const imgWidth = this.width;
            const imgHeight = this.height;
            pdf.addPage([imgWidth, imgHeight]);
            pdf.setPage(i + 1);
            pdf.addImage(img, 'JPEG', 0, 0, imgWidth, imgHeight, null, 'NONE');
            if (i === pages.length - 1) {
                pdf.save('pages.pdf');
            }
        }
    }
}

function cl() {
    undo.push(canvas.toDataURL('image/png'));
    if (undo.length > 30) {
        undo.shift()
    }
    now = undo.length;
    var image = new Image();
    image.onload = function () {
        canvas.width = image.width;
        canvas.height = image.height;
        board.drawImage(image, 0, 0, image.width, image.height);
        send();
    }
    image.src = none_b;
}

function end(mouse) {
    var x = mouse.offsetX;
    var y = mouse.offsetY;
    var dx = x - mouse.movementX;
    var dy = y - mouse.movementY;
    drawing = false;
    board.closePath();
    place2 = [x, y, dx, dy];
    send();
}

function send() {
    var obj = {
        method: 'post',
        body: ({
            pic: canvas.toDataURL('image/png'),
            tr_id: user.tr_id
        })
    }
    socket.emit('stream', JSON.stringify(obj));
}

function draw_canv(x, y, dx, dy) {
    if (drawing) {
        if (pen === 1) {
            pen1(x, y, dx, dy);
        }
        if (pen === 3) {
            var image = new Image();
            image.onload = function () {
                canvas.width = image.width;
                canvas.height = image.height;
                board.drawImage(image, 0, 0, image.width, image.height);
                return_settings();
                var x1 = place1[0];
                var y1 = place1[1];
                pen1(x1, y1, dx, dy);
            };
            image.src = be_click;
        }
        if (pen === 2) {
            pen2(x, y, dx, dy);
        }
    }
}

function tools() {
    pen = parseInt(document.getElementById('tools').value);
}


function page(p, s) {
    if (s === 0) {
        pages[page_now] = canvas.toDataURL('image/png');
    }
    page_now = p;
    var image = new Image();
    image.onload = function () {
        canvas.width = image.width;
        canvas.height = image.height;
        board.drawImage(image, 0, 0, image.width, image.height);
        return_settings();
        send();
        document.getElementById('page').innerHTML = page_now + 1;
        document.getElementById('a_page').innerHTML = pages.length;
        undo = [];
    };
    image.src = pages[page_now];
}


function next_page() {
    pages[page_now] = canvas.toDataURL('image/png');
    page_now++;
    if (page_now >= pages.length) {
        var li = document.createElement('li');
        li.className = "page-item";
        var a = document.createElement('a');
        a.className = "page-link";
        a.onclick = carry(page, [page_now, 0]);
        a.href = '#';
        a.innerText = page_now + 1;
        li.appendChild(a);
        document.getElementById('pages').appendChild(li);
        pages.push(none_b);
    }
    page(page_now, 1);
}


function prev_page() {
    if (page_now > 0) {
        pages[page_now] = canvas.toDataURL('image/png');
        page_now--;
        page(page_now, 1);
    }
}


//##################################################################
// Events
//##################################################################
canvas.onpointermove = function (mouse) {
    var x = mouse.offsetX;
    var y = mouse.offsetY;
    var dx = x - mouse.movementX;
    var dy = y - mouse.movementY;
    draw_canv(x, y, dx, dy);
}
window.onload = load;
canvas.onpointerdown = start;
canvas.onpointerup = end;
