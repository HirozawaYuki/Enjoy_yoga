from flask import Flask, render_template, Response, url_for, request, redirect

# from camera import VideoCamera
import os
import csv

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
    global user_name
    global login_step
    # 変数user_nameが存在すれば何もしない(保持)、存在しない(ログイン後すぐの)場合はログイン画面で入力したユーザー名を格納
    try:
        user_name
        print(user_name)

    except NameError:
        user_name = request.form["user_name"]
        print(user_name)
    return render_template('/menu.html', name=user_name)

@app.route('/select_teacher')
def select_teacher():
    # value = request.args.get("1")
    return render_template('/select_teacher.html', name=user_name)

@app.route('/play_yoga', methods=["post"])
def play_yoga():
    # gen(videoCamera())
    global broadcast_video

    video = request.form["video"]
    print(video)
    #select_teacher.htmlで動画Aを選択した場合、video.mp4をbroadcast_videoに格納
    if video == "戦士のポーズ2":
        broadcast_video = "./../static/video/sensi2.MOV"
    elif video == "動画B":
        broadcast_video = "./../static/video/yoga1.mp4"
    else:
        broadcast_video = "./../static/video/video.mp4"
    return render_template('/play_yoga.html', name=user_name, broadcast_video=broadcast_video)


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
    breath_score = 36
    with open('./../../Downloads/score.csv') as f:
        # csvファイルの読み込みにはcsv.readerクラスを使う
        reader = csv.reader(f)
        l = [row for row in reader]
        # 要素をint型で取得して骨格スコアとする
        born_score = int(l[0][0])
    print(user_name)
    print(born_score)
    all_score = born_score+breath_score # 総合スコアの算出
    if(all_score < 21):
        rank = "E"
    elif(all_score >= 21 & all_score < 41):
        rank = "D"
    elif(all_score >= 41 & all_score < 61):
        rank = "C"
    elif(all_score >= 61 & all_score < 81):
        rank = "B"
    else:
        rank = "A"
    return render_template('/score.html', rank=rank, all_score=all_score, born_score=born_score, breath_score=breath_score, name=user_name, broadcast_video=broadcast_video)

#おまじない　プログラム実行後、http://localhost:8080/のURLにアクセスすると、一連の流れを実行可能にする
#例： http://localhost:8080/menu で、メニュー画面に直接アクセス
if __name__ == '__main__':
    # app.run(host='localhost', debug=True, port=8080)
    app.run(host='localhost', port=8080, debug=True)
    # app.run(host='0.0.0.0', port=80, debug=True)
    # app.run(debug=True)
