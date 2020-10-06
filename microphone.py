from flask import Flask, render_template, Response, url_for, request

# from camera import VideoCamera
import os

# Flaskを定義し利用できるようにセット
app = Flask(__name__)

# 「/」へアクセスがあった場合に、login.htmlを返す
@app.route('/')
def login():
    name = request.args.get("name")
    return render_template('/login.html', name=name)

# 「/menu」へアクセスがあった場合にmenu.htmlを返す
@app.route('/menu', methods=["post"])
def menu():
    global name
    name = request.form["name"]
    return render_template('/menu.html', name=name)

@app.route('/play_yoga')
def play_yoga():
    # gen(videoCamera())
    return render_template('/play_yoga.html', name=name)

# def gen(camera):
#     while True:
#         frame = camera.get_frame()
#         yield(b'--fram\r\n' b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')


# @app.route('/video')
# def video():
#     return Response(gen(VideoCamera()))

# def gen(camera):
#     while True:
#         frame = camera.get_frame()
#         yield(b'--frame\r\n' 
#         b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n\r\n')


@app.route('/score')
def score():
    # 多分python内でスコアは使用しない(精々呼吸スコアだけ)
    # score = [born_score, breath_score, all_score, pre_score, rank]
    score = 56
    return render_template('/score.html', breath_score=score, name=name)

#おまじない　プログラム実行後、http://localhost:8080/のURLにアクセスすると、一連の流れを実行可能にする
#例： http://localhost:8080/menu で、メニュー画面に直接アクセス
if __name__ == '__main__':
    # app.run(host='localhost', debug=True, port=8080)
    app.run(host='localhost', port=8080, debug=True)
    # app.run(host='0.0.0.0', port=80, debug=True)
    # app.run(debug=True)
