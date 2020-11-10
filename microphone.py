from flask import Flask, render_template, Response, url_for, request, redirect

# from camera import VideoCamera
import os
import shutil
import sys
import csv
import datetime
import pandas as pd

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

@app.route('/past_log')
def past_log():
    score_list = []
    year_list = []
    month_list = []
    date_list = []
    name_list = []
    df = pd.read_csv('./static/score/score_sheet.csv', encoding="SHIFT_JIS")
    # 総合スコア順で降順ソート(大きい値が上に来るようにする)
    df_s = df.sort_values('総合スコア', ascending=False)
    # ソート結果をlist化して格納
    sort_list = df_s.values.tolist()


    for i in range(5):
        score_list.append(sort_list[i][3])
        year_list.append(sort_list[i][0][0:4])
        month_list.append(sort_list[i][0][5:7])
        date_list.append(sort_list[i][0][8:10])
        name_list.append(sort_list[i][4])


    print(score_list)

    return render_template('past_log.html', name=user_name, score_list=score_list, year=year_list, month=month_list, date=date_list, name_list=name_list)

@app.route('/select_teacher')
def select_teacher():
    # value = request.args.get("1")
    return render_template('/select_teacher.html', name=user_name)

@app.route('/play_yoga', methods=["post"])
def play_yoga():
    # gen(videoCamera())
    global broadcast_video
    global video
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
    # score = [born_score, breath_score, all_score, pre_score, rank]
    breath_score = 24
    # javascriptで保存されたborn_scoreを所定の場所に移動(jsではファイルの保存先が指定できなかったため)
    new_score_path = shutil.move('./../../Downloads/born_score.csv', './static/score/')
    print(new_score_path)
    with open('./static/score/born_score.csv') as f:
        # csvファイルの読み込みにはcsv.readerクラスを使う
        reader = csv.reader(f)
        l = [row for row in reader]
        # 要素をint型で取得して骨格スコアとする
        born_score = int(l[0][0])
    print(user_name)
    all_score = born_score+breath_score # 総合スコアの算出
    if(all_score < 21):
        rank = "E"
    elif(all_score >= 21 and all_score < 41):
        rank = "D"
    elif(all_score >= 41 and all_score < 61):
        rank = "C"
    elif(all_score >= 61 and all_score < 81):
        rank = "B"
    else:
        rank = "A"

    # 各種情報をcsvファイルに追記
    with open('./static/score/score_sheet.csv', 'a', newline="") as f:
        writer = csv.writer(f)
        writer.writerow([datetime.date.today(), born_score, breath_score, all_score, user_name])

    # born_score.csvは必要なくなるので消しておく
    os.remove('./static/score/born_score.csv')

    df = pd.read_csv('./static/score/score_sheet.csv', encoding="SHIFT_JIS")
    # 前回の総合スコアを抽出する
    last_score=df.loc[len(df)-2]
    last_all_score=last_score[3]

    return render_template('/score.html', rank=rank, all_score=all_score, born_score=born_score, breath_score=breath_score, name=user_name, broadcast_video=broadcast_video, pose=video, last_all_score=last_all_score)

#おまじない　プログラム実行後、http://localhost:8080/のURLにアクセスすると、一連の流れを実行可能にする
#例： http://localhost:8080/menu で、メニュー画面に直接アクセス
if __name__ == '__main__':
    # app.run(host='localhost', debug=True, port=8080)
    app.run(host='localhost', port=8080, debug=True)
    # app.run(host='0.0.0.0', port=80, debug=True)
    # app.run(debug=True)
