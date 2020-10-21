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

function setup() {
  // var video = document.getElementById("myVideo");
  born_score = 0;
  console.log(born_score);
  pre_born = 0;
  createCanvas(500, 300);
  video = createCapture(VIDEO);
  video.size(width, height);
  video.parent("myVideo");
  // Create a new poseNet method with a single detection
  poseNet = ml5.poseNet(video, modelReady);
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

  image(video, 0, 0, width, height);

  // We can call both functions to draw all keypoints and the skeletons
  drawKeypoints();
  drawSkeleton();
  drawBar();

}

function drawBar() {
  // micro = 30;
  // quad(最初の点のx座標, 最初の点のy座標, 2番目の点のx座標, 2番目の点のy座標, 3番目の、、、) (右下、左下、左上、右上)
  quad(width, height, width-40, height, width-40, height-born_score*2, width, height-born_score*2);
  // console.log(born_score);
  fill(255, 0, 0);

  // background(204, 226, 225);

  // fill(255, 0, 0);
  // ellipse(132, 82, 200, 200);

  // fill(0, 255, 0);
  // ellipse(228, -16, 200, 200);

  // fill(0, 0, 255);
  // ellipse(268, 118, 200, 200);
}

// A function to draw ellipses over the detected keypoints
function drawKeypoints()  {
  // 検出された全ての姿勢を走査する
  for (let i = 0; i < poses.length; i++) {
    // 検出された各姿勢について、全てのキーポイントを走査する
    let pose = poses[i].pose;
    for (let j = 0; j < pose.keypoints.length; j++) {
      // keypointは、部位を表すオブジェクト
      let keypoint = pose.keypoints[j];
      // 姿勢の確率が0.2より大きいものだけ円を描く
      if (keypoint.score > 0.3) {
        fill(255, 255, 0);  // 図形の塗りつぶしに使用する色を設定
        noStroke(); // 線や図形の輪郭線を描かなくする
        ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
        if(j == 3) {
          // console.log(keypoint.part[j]);
          // console.log(keypoint.position.x);

          now_born = keypoint.position.x;

          /*ある条件を満たせばスコア上昇*/
          console.log(Math.abs(pre_born-now_born));
          // console.log(born_score);
          if(Math.abs(pre_born-now_born) < 1 && Math.abs(pre_born-now_born) != 0) {
            if(born_score < 100) {
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
      line(partA.position.x, partA.position.y, partB.position.x, partB.position.y);
    }
  }
}