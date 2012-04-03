//set main namespace
goog.provide('game');


//get requirements
goog.require('lime.Director');
goog.require('lime.Scene');
goog.require('lime.Layer');
goog.require('lime.Circle');
goog.require('lime.Label');
goog.require('lime.RoundedRect');
goog.require('lime.Button');
goog.require('lime.animation.Spawn');
goog.require('lime.animation.FadeTo');
goog.require('lime.animation.ScaleTo');
goog.require('lime.animation.MoveTo');
goog.require('lime.animation.RotateBy');
goog.require('lime.animation.Sequence');
goog.require('lime.animation.Loop');

var sceneWidth = 1024;
var sceneHeight = 768;
var sceneCenterX = sceneWidth/2;
var sceneCenterY = sceneHeight/2;

var pencil = [10, 30, 50];
var pencilSize = 0;

// entrypoint
game.start = function(){

  game.director = new lime.Director(document.body,sceneWidth,sceneHeight);
  game.director.makeMobileWebAppCapable();
  var scene  = new lime.Scene();

  //
  // Background
  //
  var background = new lime.Layer();
  var backgroundColor = new lime.Sprite();
  backgroundColor.setSize(sceneWidth, sceneHeight).setPosition(sceneCenterX, sceneCenterY).setFill(85, 174, 233);
  background.appendChild(backgroundColor);

  var board = new lime.RoundedRect();
  board.setSize(sceneWidth-400, sceneHeight-200).setPosition(sceneCenterX-150, sceneCenterY).setFill(255, 255, 255).setRadius(20);
  background.appendChild(board);

  scene.appendChild(background);

  //
  // Foreground
  //
  var foreground = new lime.Layer()
  var titleBackground = new lime.Sprite().setFill("assets/images/bg_logo.png").setPosition(104,117);
  foreground.appendChild(titleBackground);

  var titleText = new lime.Sprite().setFill("assets/images/game_text.png").setPosition(105+30,78+50);
  foreground.appendChild(titleText);  

  var titleAnimateLoop = new lime.animation.Sequence(
    new lime.animation.RotateBy(-5).setDuration(0.5),
    new lime.animation.RotateBy(5).setDuration(0.5));
  titleText.runAction(new lime.animation.Loop(titleAnimateLoop));
  scene.appendChild(foreground);
	
  var lbl = new lime.Label();
  lbl.setText("Shell");
  lbl.setSize(300,100).setFontSize(50).setPosition(sceneCenterX - (board.size_.width/2), sceneCenterY + 250);
  scene.appendChild(lbl);

  var leftChar = new lime.Sprite();
  leftChar.setFill('assets/images/char_1.png').setPosition(sceneCenterX - (board.size_.width/2), sceneCenterY);
  scene.appendChild(leftChar);

  var rightChar = new lime.Sprite();
  rightChar.setFill('assets/images/char_2.png').setPosition(sceneCenterX , sceneCenterY);
  scene.appendChild(rightChar);

  var colorBoard = new lime.RoundedRect();
  colorBoard.setSize(300, 300).setPosition(sceneCenterX + (board.size_.width/2) + 25, sceneCenterY - 50).setFill(236, 236, 0).setRadius(20);
  scene.appendChild(colorBoard);

  var rubber = new lime.Sprite();
  rubber.setFill('assets/images/rubber.png');
  rubber.setPosition(sceneCenterX + (board.size_.width/2) - 50, sceneCenterY - 250);
  rubber.setScale(1.5, 1.5);
  scene.appendChild(rubber);

  var lblRubber = new lime.Label();
  lblRubber.setText("Rubber");
  lblRubber.setFontSize(40).setSize(50,50);
  lblRubber.setPosition(sceneCenterX + (board.size_.width/2) + 50, sceneCenterY - 250);
  scene.appendChild(lblRubber);

  var drawLayer = new lime.Layer();
  drawLayer.setSize(sceneWidth-400, sceneHeight-200).setPosition(sceneCenterX-150, sceneCenterY);

  goog.events.listen(rubber, 'click', function() {
    drawLayer.removeAllChildren();
  });

  goog.events.listen(board, ['mousedown', 'touchstart'], function(e1) {

    e1.swallow(['mousemove', 'touchmove'], function(e2){
      var color = new lime.Circle();
      color.setSize(pencil[pencilSize], pencil[pencilSize]);
      color.setFill(0, 0, 0);
      color.setPosition(e2.position.x, e2.position.y);
      drawLayer.appendChild(color);
    });
  });

  scene.appendChild(drawLayer);
	// set current scene active
	game.director.replaceScene(scene);

}


//this is required for outside access after code is compiled in ADVANCED_COMPILATIONS mode
goog.exportSymbol('game.start', game.start);
