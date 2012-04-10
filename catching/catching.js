(function() {
  var addCharacter, sceneCenterX, sceneCenterY, sceneHeight, sceneWidth;

  goog.provide('catching');

  goog.require('lime.Director');

  goog.require('lime.Scene');

  goog.require('lime.Layer');

  goog.require('lime.Circle');

  goog.require('lime.Label');

  goog.require('lime.Button');

  goog.require('lime.RoundedRect');

  goog.require('lime.fill.LinearGradient');

  goog.require('lime.animation.Spawn');

  goog.require('lime.animation.FadeTo');

  goog.require('lime.animation.ScaleTo');

  goog.require('lime.animation.MoveTo');

  sceneWidth = 1024;

  sceneHeight = 768;

  sceneCenterX = sceneWidth / 2;

  sceneCenterY = sceneHeight / 2;

  catching.start = function() {
    var scene;
    catching.director = new lime.Director(document.body, sceneWidth, sceneHeight);
    scene = catching.intro();
    return catching.director.replaceScene(scene);
  };

  addCharacter = function(image, opts) {
    var char, height, posX, posY, width;
    char = new lime.Sprite();
    char.setFill("assets/images/" + image);
    posX = sceneCenterX + opts.x;
    posY = sceneCenterY + opts.y;
    width = sceneWidth + opts.w;
    height = sceneHeight + opts.h;
    if ((opts.x != null) && (opts.y != null)) char.setPosition(posX, posY);
    if ((opts.w != null) && (opts.h != null)) char.setSize(width, height);
    opts.at.appendChild(char);
    return char;
  };

  catching.intro = function() {
    var background, btnStart, btnState1, btnState2, scene;
    scene = new lime.Scene;
    background = new lime.Layer();
    scene.appendChild(background);
    addCharacter("scene_bg.png", {
      x: 4,
      y: -10,
      w: -150,
      h: -130,
      at: background
    });
    addCharacter("boy.png", {
      x: -280,
      y: 180,
      at: background
    });
    addCharacter("girl.png", {
      x: -100,
      y: 200,
      at: background
    });
    addCharacter("postbox.png", {
      x: 350,
      y: 150,
      at: background
    });
    addCharacter("game_frame.png", {
      x: 0,
      y: 0,
      w: 40,
      h: -20,
      at: background
    });
    addCharacter("game_bg.png", {
      x: 0,
      y: 0,
      w: 0,
      h: 0,
      at: background
    });
    addCharacter("title_1.png", {
      x: 0,
      y: -200,
      at: background
    });
    addCharacter("title_2.png", {
      x: 0,
      y: -75,
      at: background
    });
    btnState1 = new lime.Sprite().setFill('assets/images/btn_start_normal.png');
    btnState2 = new lime.Sprite().setFill('assets/images/btn_start_active.png');
    btnStart = new lime.Button(btnState1, btnState2).setPosition(sceneCenterX + 300, sceneCenterY + 260).setScale(1.3);
    background.appendChild(btnStart);
    return scene;
  };

  this.catching = catching;

}).call(this);
