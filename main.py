from flask import *
from flask_socketio import SocketIO
import secrets

app = Flask(__name__, template_folder="static")
app.config["SECRET_KEY"] = secrets.token_urlsafe(50)
socketio = SocketIO(app)


@app.route('/')
def board():
    try:
        return render_template('test.html')
    except:
        return 'Bad'


@app.route('/tr_id')
def tr_id():
    try:
        z = secrets.token_urlsafe(50)
        session['tr_id'] = z
        return jsonify({'tr_id': z, 'url_for_join': f'{request.host_url}join_stream?id={hash(z)}', 'hash': str(hash(z))})
    except:
        return 'Bad'


@app.route('/st')
def st():
    try:
        socketio.emit(session['tr_id'], session['last'])
        return 'Ok'
    except:
        return 'Bad'


@socketio.on('stream')
def stream(data):
    try:
        data = json.loads(data)['body']
        socketio.emit(str(hash(data['tr_id'])), {'pic': data['pic']})
    except:
        return 'Bad'


@app.route('/join_stream')
def join_steam():
    try:
        return render_template('join.html')
    except:
        return 'Bad'


@app.route('/sos', methods=['post'])
def sos():
    try:
        socketio.emit(str(json.loads(request.get_data().decode('utf-8'))['sos_signal']))
        return 'Ok'
    except:
        return 'Bad'


if __name__ == '__main__':
    socketio.run(app, host="192.168.1.104", port=5000)
