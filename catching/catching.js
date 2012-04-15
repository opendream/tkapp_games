(function() {
  var addCharacter, nat, sceneCenterX, sceneCenterY, sceneHeight, sceneWidth, setUp, startTimer;

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

  nat = {};

  catching.start = function() {
    var scene;
    catching.director = new lime.Director(document.body, sceneWidth, sceneHeight);
    return scene = catching.intro();
  };

  addCharacter = function(image, opts) {
    var character, height, posX, posY, width;
    character = new lime.Sprite;
    character.setFill("assets/images/" + image);
    if ((opts.absolutePosition != null) === true || (opts.absolute != null) === true) {
      posX = opts.x;
      posY = opts.y;
    } else {
      posX = sceneCenterX + opts.x;
      posY = sceneCenterY + opts.y;
    }
    if ((opts.absoluteSize != null) === true || (opts.absolute != null) === true) {
      width = opts.w;
      height = opts.h;
    } else {
      width = sceneWidth + opts.w;
      height = sceneHeight + opts.h;
    }
    if ((opts.x != null) && (opts.y != null)) character.setPosition(posX, posY);
    if ((opts.w != null) && (opts.h != null)) character.setSize(width, height);
    opts.at.appendChild(character);
    if (typeof opts.callback === "function") opts.callback(character);
    if (opts.name != null) character.name = opts.name;
    return character;
  };

  setUp = function(opts) {
    var startX;
    switch (opts.part) {
      case "gameFrame":
        addCharacter("scene_bg.png", {
          x: 4,
          y: -10,
          w: -150,
          h: -130,
          at: opts.at
        });
        addCharacter("game_frame.png", {
          x: 0,
          y: 0,
          w: 40,
          h: -20,
          at: opts.at
        });
        return addCharacter("game_bg.png", {
          x: 0,
          y: 0,
          w: 0,
          h: 0,
          at: opts.at
        });
      case "blockPipe":
        if (opts.by === 3) {
          startX = 235;
          addCharacter("block_pipe.png", {
            x: startX,
            y: 50,
            w: 104,
            h: 122,
            absolute: true,
            at: opts.at,
            callback: function(char) {
              return char.setAnchorPoint(0, 0);
            }
          });
          addCharacter("block_pipe.png", {
            x: startX * 2,
            y: 50,
            w: 104,
            h: 122,
            absolute: true,
            at: opts.at,
            callback: function(char) {
              return char.setAnchorPoint(0, 0);
            }
          });
          addCharacter("block_pipe.png", {
            x: startX * 3,
            y: 50,
            w: 104,
            h: 122,
            absolute: true,
            at: opts.at,
            callback: function(char) {
              return char.setAnchorPoint(0, 0);
            }
          });
          return addCharacter("game_frame.png", {
            x: 0,
            y: 3,
            w: 40,
            h: -20,
            at: opts.at
          });
        }
    }
  };

  catching.intro = function() {
    var background, btnStart, btnState1, btnState2, scene;
    scene = new lime.Scene;
    background = new lime.Layer;
    scene.appendChild(background);
    setUp({
      part: 'gameFrame',
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
    catching.director.replaceScene(scene);
    return goog.events.listen(btnStart, 'click', function() {
      return catching.secondScene();
    });
  };

  startTimer = function(opts) {
    var counter, decreaseBy, delay;
    if (opts == null) opts = {};
    counter = opts.limit || 10;
    delay = opts.delay || 1000;
    decreaseBy = opts.decreaseBy || 1;
    if (opts != null) {
      if (typeof opts.runningCallback === "function") {
        opts.runningCallback(counter);
      }
    }
    counter = counter - 1;
    return (function() {
      nat.scheduleWithDelay = function(dt) {
        if (!(counter > 0)) {
          if (counter <= 0) {
            if (opts != null) {
              if (typeof opts.timeoutCallback === "function") {
                opts.timeoutCallback(counter);
              }
            }
          }
        } else {
          if (opts != null) {
            if (typeof opts.runningCallback === "function") {
              opts.runningCallback(counter);
            }
          }
        }
        return counter = counter - decreaseBy;
      };
      return lime.scheduleManager.scheduleWithDelay(nat.scheduleWithDelay, opts.limeScope || {}, delay);
    })();
  };

  catching.secondScene = function() {
    var background, scene;
    scene = new lime.Scene;
    background = new lime.Layer;
    scene.appendChild(background);
    setUp({
      part: 'gameFrame',
      at: background
    });
    setUp({
      part: 'blockPipe',
      by: 3,
      at: background
    });
    catching.lblTimer = new lime.Label();
    catching.lblTimer.setSize(50, 50).setFontSize(50).setPosition(sceneCenterX, sceneCenterY + 320);
    catching.lblTimer.setFontColor('#000');
    scene.appendChild(catching.lblTimer);
    catching.director.replaceScene(scene);
    return startTimer({
      limit: 30,
      delay: 500,
      limeScope: nat,
      runningCallback: function(rt) {
        return catching.lblTimer.setText(rt);
      },
      timeoutCallback: function(rt) {
        catching.lblTimer.setText("TIME OUT!");
        console.log("TIME OUT");
        lime.scheduleManager.unschedule(nat.scheduleWithDelay, nat);
        return catching.director.setPaused(true);
      }
    });
  };

  this.catching = catching;

}).call(this);
