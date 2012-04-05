//set main namespace
goog.provide('grand_father'); 

//get requirements
goog.require('lime.Director');
goog.require('lime.Scene');
goog.require('lime.Layer');
goog.require('lime.Circle');
goog.require('lime.Label');
goog.require('lime.RoundedRect');
goog.require('lime.animation.Spawn');
goog.require('lime.animation.FadeTo');
goog.require('lime.animation.ScaleTo');
goog.require('lime.animation.MoveTo');
goog.require('lime.animation.RotateBy');
goog.require('lime.animation.Sequence');
goog.require('lime.animation.Loop');
goog.require('lime.Button');
goog.require('lime.audio.Audio');

var sceneWidth = 1024;
var sceneHeight = 768;
var sceneCenterX = sceneWidth/2;
var sceneCenterY = sceneHeight/2;
var gameAnswer = [2,3,4];
var currentGame = 0;

var bell;
var pop;

// entrypoint
grand_father.start = function(){
  
  var director = new lime.Director(document.body, sceneWidth, sceneHeight);
  director.makeMobileWebAppCapable();
  var scene = new lime.Scene;

  bell = new lime.audio.Audio('assets/sounds/bell.mp3');
  pop = new lime.audio.Audio('assets/sounds/pop.mp3');

  //
  // Background
  //
  var background = new lime.Layer();
  var backgroundColor = new lime.Sprite().setSize(sceneWidth, sceneHeight).setPosition(sceneCenterX, sceneCenterY).setFill(248, 137, 0);
  background.appendChild(backgroundColor);

  var board = new lime.RoundedRect().setSize(sceneWidth-200, sceneHeight-200).setPosition(sceneCenterX, sceneCenterY).setFill(251, 198, 0).setRadius(20);
  background.appendChild(board);

  scene.appendChild(background);

  //
  // Games
  //
  var game = grand_father.getGame(currentGame);
  scene.appendChild(game);

  // 
  // Games Controller
  //
  var gameController = new lime.Layer();
  var btnIndex = 0;
  var btnWidth = -150;
  var btns = [];

  // create game controller
 for(;btnIndex < 4;btnIndex++){
   button = grand_father.makeGameAnswerButton(btnIndex+1, (sceneWidth/2) + btnWidth, 600);
   btnWidth += 100;

   !function(btnIndex){
      goog.events.listen(button, ['mousedown', 'touchstart'], function(e) {
        var dragMe = false

        e.swallow(['mouseup','touchend'], function(e2){
          var answer = btnIndex+1;
          pop.stop();
          pop.play();
          game = grand_father.answer(answer, game, scene, gameController);
        });
     });
   }(btnIndex);

   gameController.appendChild(button);
 }

 scene.appendChild(gameController);    

  //
  // Foreground
  //
  var foreground = new lime.Layer()
  var titleBackground = new lime.Sprite().setFill("assets/images/bg_logo.png").setPosition(144,117);
  foreground.appendChild(titleBackground);

  var titleText = new lime.Sprite().setFill("assets/images/game_text.png").setPosition(105+70,78+50);
  foreground.appendChild(titleText);  

  var titleAnimateLoop = new lime.animation.Sequence(
    new lime.animation.RotateBy(-5).setDuration(0.5),
    new lime.animation.RotateBy(5).setDuration(0.5));
  titleText.runAction(new lime.animation.Loop(titleAnimateLoop));

  scene.appendChild(foreground);

	// set current scene active
	director.replaceScene(scene);
}

grand_father.answer = function(answer, game, scene, gameController) {
  var gameLayer = game;

  if(answer == gameAnswer[currentGame]){
    currentGame++;
    var correctLayer;
    if(currentGame>2){
      currentGame = 0;
      gameLayer = grand_father.getGame(currentGame);
      correctLayer = grand_father.makeAnswerPage('All Correct', 'New Game', scene, gameLayer, gameController);
    }else{
      gameLayer = grand_father.getGame(currentGame);
      correctLayer = grand_father.makeAnswerPage('Correct', 'Next Game', scene, gameLayer, gameController);
    }

    scene.appendChild(correctLayer);
    scene.removeChild(game);
    scene.removeChild(gameController);

  }else{
    var incorrectLayer = grand_father.makeAnswerPage('Incorrect', 'Play again', scene, game, gameController);
    scene.appendChild(incorrectLayer);
    scene.removeChild(game);
    scene.removeChild(gameController);
  }
  return gameLayer;
}

// get current game
grand_father.getGame = function(gameLevel){
  switch(gameLevel){
    case 0:
      return grand_father.game_1();
    case 1:
      return grand_father.game_2();
    case 2:
      return grand_father.game_3();
  }
}

// create game 1
grand_father.game_1 = function(){
  var game = new lime.Layer();

  var char_1 = new lime.Sprite().setFill("assets/images/grandfather.png");
  char_1.setScale(2,2).setPosition(670,350);
  game.appendChild(char_1);

  var char_2 = new lime.Sprite().setFill("assets/images/grandmother.png");
  char_2.setScale(2,2).setPosition(350,350);
  game.appendChild(char_2); 

  var plus_1 = new lime.Sprite().setFill("assets/images/game_grandfather_plus.png");
  plus_1.setScale(2,2).setPosition(500,400);
  game.appendChild(plus_1);

  var equal_1 = new lime.Sprite().setFill("assets/images/game_grandfather_answer.png");
  equal_1.setScale(2,2).setPosition(820,400);
  game.appendChild(equal_1);

  return game;
}

// create game 2
grand_father.game_2 = function(){
  var game = new lime.Layer();
  var scale = 1.4;

  var char_1 = new lime.Sprite().setFill("assets/images/grandfather.png");
  char_1.setScale(scale,scale).setPosition(710,350);
  game.appendChild(char_1);

  var char_2 = new lime.Sprite().setFill("assets/images/grandmother.png");
  char_2.setScale(scale,scale).setPosition(350,350);
  game.appendChild(char_2); 

  var char_3 = new lime.Sprite().setFill("assets/images/game_grandfather_child.png");
  char_3.setScale(scale-0.3,scale-0.3).setPosition(510,360);
  game.appendChild(char_3); 

  var plus_1 = new lime.Sprite().setFill("assets/images/game_grandfather_plus.png");
  plus_1.setScale(scale,scale).setPosition(600,350);
  game.appendChild(plus_1);

  var equal_1 = new lime.Sprite().setFill("assets/images/game_grandfather_answer.png");
  equal_1.setScale(scale,scale).setPosition(820,350);
  game.appendChild(equal_1);

  return game;
}

// create game 3
grand_father.game_3 = function(){
  var game = new lime.Layer();
  var scale = 1.2;

  var char_1 = new lime.Sprite().setFill("assets/images/grandfather.png");
  char_1.setScale(scale,scale).setPosition(570,350);
  game.appendChild(char_1);

  var char_2 = new lime.Sprite().setFill("assets/images/grandmother.png");
  char_2.setScale(scale,scale).setPosition(400,350);
  game.appendChild(char_2); 

  var char_3 = new lime.Sprite().setFill("assets/images/mouse.png");
  char_3.setScale(scale,scale).setPosition(260,380);
  game.appendChild(char_3);

  var char_4 = new lime.Sprite().setFill("assets/images/dog_1.png");
  char_4.setScale(scale,scale).setPosition(720,400);
  game.appendChild(char_4); 

  var plus_1 = new lime.Sprite().setFill("assets/images/game_grandfather_plus.png");
  plus_1.setScale(scale,scale).setPosition(480,350);
  game.appendChild(plus_1);

  var equal_1 = new lime.Sprite().setFill("assets/images/game_grandfather_answer.png");
  equal_1.setScale(scale,scale).setPosition(850,350);
  game.appendChild(equal_1);

  return game;
}

// create game answer button
grand_father.makeGameAnswerButton = function(label, posWidth, posHeight){
  var btn1 = new lime.Layer();
  var lbl1 = new lime.Label().setText(label).setFontSize(50).setSize(80,80).setPosition(0,10);
  var crl1 = new lime.Circle();
  crl1.setSize(80,80).setFill(248, 137, 0);
  crl1.setStroke(new lime.fill.Stroke(10,0,0,0));
  btn1.appendChild(crl1);
  btn1.appendChild(lbl1);

  var btn2 = new lime.Layer();
  var img2 = new lime.Sprite().setSize(80,80).setFill('assets/images/correct.png');
  var crl2 = new lime.Circle();
  crl2.setSize(80,80).setFill(248, 137, 0);
  crl2.setStroke(new lime.fill.Stroke(10,0,0,0));
  btn2.appendChild(crl2);
  btn2.appendChild(img2);

  var button = new lime.Button(
    btn1,
    btn2
  ).setPosition(posWidth,posHeight);

  return button;
};

// create incorrect page
grand_father.makeAnswerPage = function(title, btnLabel, scene, gameLayer, controller){
  var btnWidth = 200;
  var btnHeight = 80;

  var layer = new lime.Layer();
  var lblTitle = new lime.Label();
  lblTitle.setText(title).setFontSize(100).setFontColor('#f00').setPosition(sceneCenterX,sceneCenterY-100);

  var btnBg1 = new lime.Sprite().setSize(btnWidth,btnHeight).setFill('assets/images/btn_1.png');
  var lblBtn1 = new lime.Label();
  lblBtn1.setText(btnLabel).setFontSize(30).setSize(btnWidth,btnHeight).setFontColor('#000').setPosition(0,20);

  var btnBg2 = new lime.Sprite().setSize(btnWidth,btnHeight).setFill('assets/images/btn_2.png');
  var lblBtn2 = new lime.Label();
  lblBtn2.setText(btnLabel).setFontSize(30).setSize(btnWidth,btnHeight).setFontColor('#000').setPosition(0,20);

  var btn1 = new lime.Layer();
  btn1.appendChild(btnBg1);
  btn1.appendChild(lblBtn1);

  var btn2 = new lime.Layer();
  btn2.appendChild(btnBg2);
  btn2.appendChild(lblBtn2);

  var button = new lime.Button(
    btn1,
    btn2
  ).setPosition(sceneCenterX,sceneCenterY+100);;

  layer.appendChild(lblTitle);
  layer.appendChild(button);

  goog.events.listen(button, 'click', function() {
    bell.stop();
    bell.play();
    scene.removeChild(layer);
    scene.appendChild(gameLayer);
    scene.appendChild(controller);
  });

  return layer;
};

function Client() {
}
 
Client.prototype.mobileClients = [
  "midp",
  "240x320",
  "blackberry",
  "netfront",
  "nokia",
  "panasonic",
  "portalmmm",
  "sharp",
  "sie-",
  "sonyericsson",
  "symbian",
  "windows ce",
  "benq",
  "mda",
  "mot-",
  "opera mini",
  "philips",
  "pocket pc",
  "sagem",
  "samsung",
  "sda",
  "sgh-",
  "vodafone",
  "xda",
  "iphone",
  "android"
];
 
Client.prototype.isMobileClient = function(userAgent)
{
      userAgent=userAgent.toLowerCase();
      for (var i in this.mobileClients) {
      if (userAgent.indexOf(this.mobileClients[i]) != -1) {
      return true;
      }
    }
  return false;
}

//this is required for outside access after code is compiled in ADVANCED_COMPILATIONS mode
goog.exportSymbol('grand_father.start', grand_father.start);
