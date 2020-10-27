// Copyright (c) 2018 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
ml5 Example
PoseNet example using p5.js
=== */

let video;
let poseNet;
let poses = [];
let born_score;
let pre_born;
let now_born;
let bonus_color_flag;
let count;

function setup() {
  // var video = document.getElementById("myVideo");
  born_score = 0;
  pre_born = 0;
  bonus_color_flag = 0;
  count = 0;
  canvas = createCanvas(500, 300);
  video = createCapture(VIDEO);
  console.log("bbb");
  console.log(video);
  video.size(width, height);
  video.parent("myVideo");
  // Create a new poseNet method with a single detection
  poseNet = ml5.poseNet(video, modelReady);
  // poseNet.parent("myVideo");
  // This sets up an event that fills the global variable "poses"
  // with an array every time new poses are detected
  poseNet.on('pose', function(results) {
    poses = results;
  });
  // Hide the video element, and just show the canvas
  video.hide();

}

// posenetの準備ができたら、検出を行う
function modelReady() {
  // select('#status').html('Model Loaded');
}

//drawはposeがみつかるまで何もしない
function draw() {

  for (let i = 0;i < poses.length;i++) {
    //poseが持つ情報を出力
    let pose = poses[i].pose;
    // console.log('全体の精度' + pose.score);
    // rect(0, 0, pose.score, pose.score);

    for(let j = 0;j < pose.keypoints.length;j++) {
      let keypoint = pose.keypoints[j];
      // console.log('部位名:' + keypoint.part);
      // console.log('精度:' + keypoint.score);
      // console.log('x位置:' + keypoint.position.x);
      // console.log('y位置:' + keypoint.position.y);
    }
  }

  //videoをp5.jsのキャンバスに描画する(video, x, y, width, height)
  image(video, 0, 0, width, height);

  count += 1;
  if(count == 1000) {
    // new Blobにて、ファイルを作成(追記モードにしたい　＆　pathを変更videoフォルダ内に指定したい(現状のプログラムだとローカルでしか使えない))
    // Blobの第一引数は配列で、ファイルに記述する内容
    // 第二引数はファイルの種類(MIMEタイプ)の指定　今回はcsvファイルなのでtext/csv テキストファイルの場合はtext/plan
    let blob = new Blob([born_score], {type:"text/csv"});
    let link = document.createElement('a');
    // この1行は無くてもいいかも
    link.href = URL.createObjectURL(blob);
    // ダウンロードした際のファイル名を指定
    link.download = 'score.csv';
    // link.click()ですぐにダウンロードする
    link.click();
  }

  // We can call both functions to draw all keypoints and the skeletons
  drawKeypoints();
  drawSkeleton();
  // 呼吸バー表示用の関数
  drawBar();

}

function drawBar() {
  // micro = 30;
  // quad(最初の点のx座標, 最初の点のy座標, 2番目の点のx座標, 2番目の点のy座標, 3番目の、、、) (右下、左下、左上、右上)
  quad(width, height, width-40, height, width-40, height-born_score*4, width, height-born_score*4);
  // console.log(born_score);
  fill(255, 0, 0);
}

// A function to draw ellipses over the detected keypoints
function drawKeypoints()  {
  // 検出された全ての姿勢を走査する
  for (let i = 0; i < poses.length; i++) {
    // 検出された各姿勢について、全てのキーポイントを走査する
    let pose = poses[i].pose;
    //各部位のスコアの平均がpose全体のスコアとして出力される(pose.score)
    // pose.keypoints.length == 17
    // keypoint.part(pose.keypoints[j].part)
    // 0:nose, 1:leftEye, 2:rightEye, 3:leftEar, 4:rightEar, 5:leftShoulder, 6:rightShoulder
    // 7:leftElbow, 8:rightElbow, 9:leftWrist, 10:rightWrist, 11:leftHip, 12:rightHip
    // 13:leftKnee, 14:rightKnee, 15:leftAnkle, 16:rightAnkle
    for (let j = 0; j < pose.keypoints.length; j++) {
      // keypointは、部位を表すオブジェクト
      let keypoint = pose.keypoints[j];
      // 検出された姿勢の各部位(鼻～右足首)のスコアを走査し、尤度が0.5より大きいものだけ円を描く(0.2とか0.3だと割とすぐに検出してしまう)
      if (keypoint.score > 0.5) {
        //検出された部位が左肩だったら(ポーズに必要な部位だけ表示出来たら良い)
        if(keypoint.part == 'leftShoulder') {
          // console.log("left_shoulder");
          // console.log(keypoint.position.x);
        }

        fill(255, 255, 0);  // 図形の塗りつぶしに使用する色を設定
        noStroke(); // 線や図形の輪郭線を描かなくする
        ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
        if(j == 3) {
          // console.log(keypoint.part[j]);
          // console.log(keypoint.position.x);

          now_born = keypoint.position.x;

          /*ある条件を満たせばスコア上昇*/
          // console.log(Math.abs(pre_born-now_born));
          // console.log(born_score);
          if(Math.abs(pre_born-now_born) < 1 && Math.abs(pre_born-now_born) != 0) {
            if(born_score < 50) {
              born_score += 1;
            }
          }
          else if(Math.abs(pre_born-now_born) > 5) {
            if(born_score > 0) {
              born_score -=1;
            }
          }
          pre_born = now_born;
        }
      }
    }
  }
}

           // 0:nose, 1: leftEye, 2:rightEye, 3: leftEar, 4: rightEar, 5:leftShoulder, 6: rightShoulder, 7: leftElbow, 8:rightElbow, 9: leftWrist, 10:rightWrist
            // 11:leftHip, 12:rightHip, 13:leftKnee, 14: rightKnee, 15:leftAnkle, 16:rightAnkle


// 骨格を描く
function drawSkeleton() {
  // 検出された全ての骨格を走査する
  for (let i = 0; i < poses.length; i++) {
    let skeleton = poses[i].skeleton;
    // console.log(skeleton);
    // 全てのskeletonに関し、部位の接続を走査する。
    for (let j = 0; j < skeleton.length; j++) {
      let partA = skeleton[j][0];
      let partB = skeleton[j][1];
      stroke(0, 255, 0);  // 図形の周りに線や境界線を描くために使用する色を設定(R,G,B)
      //線(partAとpartBの2点を結ぶ直線)を描画する
      line(partA.position.x, partA.position.y, partB.position.x, partB.position.y);
    }
  }
}