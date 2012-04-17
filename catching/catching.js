(function() {
  var IconItem, addCharacter, animateSetOfAnswer, answerAnimationFactory, blockPattern, buildSetOfAnimation, callbackFactory, getIdxMap, nat, randomItemManager, sceneCenterX, sceneCenterY, sceneHeight, sceneWidth, setUp, spawnQuestionAndAnswer, startTimer;

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

  goog.require('lime.animation.MoveBy');

  goog.require('lime.animation.ScaleBy');

  goog.require('goog.array');

  goog.require('lime.GlossyButton');

  sceneWidth = 1024;

  sceneHeight = 768;

  sceneCenterX = sceneWidth / 2;

  sceneCenterY = sceneHeight / 2;

  callbackFactory = {
    timer: function() {}
  };

  this.muteMe = [];

  this.muteMeNum = [];

  answerAnimationFactory = [];

  nat = {};

  getIdxMap = function(a) {
    var map;
    map = goog.array.map(a, function(e, i) {
      if (e) return i;
    });
    return goog.array.filter(map, function(e, i) {
      return !!e;
    });
  };

  blockPattern = [[0, 0, 0, 0, 1, 1, 1, 1, 0], [0, 0, 1, 0, 1, 1, 1, 1, 1], [1, 0, 1, 1, 0, 1, 1, 0, 1], [0, 0, 0, 0, 0, 1, 0, 0, 1], [0, 0, 0, 1, 0, 1, 1, 1, 1]];

  IconItem = {
    brother: "item-brother.png",
    buff: "item-buff.png",
    gamesai: "item-gamesai.png",
    grandfather: "item-grandfather.png",
    grandmother: "item-grandmother.png",
    sister: "item-sister.png",
    sister2: "item-sister2.png",
    uncle: "item-uncle.png",
    wolf: "item-wolf.png"
  };

  randomItemManager = function() {
    var IconItemArray, lastGetIdx, size;
    size = goog.object.getCount(IconItem);
    IconItemArray = goog.object.getValues(IconItem);
    lastGetIdx = 0;
    goog.array.shuffle(IconItemArray);
    return {
      size: size,
      getItem: function() {
        return IconItemArray[lastGetIdx++];
      },
      getAll: function() {
        return IconItemArray;
      },
      getAt: function(idx) {
        return IconItemArray[0];
      }
    };
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
          return addCharacter("block_pipe.png", {
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
        }
    }
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
      callbackFactory.timer = function(dt) {
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
      return lime.scheduleManager.scheduleWithDelay(callbackFactory.timer, opts.limeScope || callbackFactory, delay);
    })();
  };

  buildSetOfAnimation = function(col, opts) {
    var correctIdx, flatIdx, imageLayer, item, local_blockPattern, positionX, positionY, question, randomManager, row, startX, x, y, _fn;
    if (col == null) col = 3;
    if (opts == null) opts = {};
    imageLayer = new lime.Layer;
    startX = 235;
    goog.array.shuffle(catching.blockPatternIdx);
    local_blockPattern = catching.blockPatternIdx[0];
    goog.array.shuffle(catching.blockPatternIdx);
    correctIdx = local_blockPattern[0];
    randomManager = randomItemManager();
    question = addCharacter(randomManager.getAt(correctIdx), {
      x: 100,
      y: sceneHeight - 200,
      at: opts.questionLayer,
      absolutePosition: true,
      callback: function(char) {
        return char.setAnchorPoint(0, 0);
      }
    });
    row = 0;
    this.items = [];
    if (col === 3) {
      for (x = 0; x <= 2; x++) {
        _fn = function(item, flatIdx) {
          var listen_key;
          listen_key = goog.events.listen(item, ['click', 'touchstart'], function(e) {
            var moveUpOut, position, that, zoomout;
            that = this;
            console.log("Click on Object is", that);
            if (flatIdx === correctIdx) {
              goog.array.forEach(muteMe, function(e, i) {
                console.log("Corrected REMOVE");
                return goog.events.removeAll(e);
              });
              lime.scheduleManager.unschedule(answerAnimationFactory.pop(), imageLayer);
              zoomout = new lime.animation.Spawn(new lime.animation.ScaleTo(5), new lime.animation.FadeTo(0));
              (function() {
                var callback;
                callback = function() {
                  imageLayer.removeAllChildren();
                  console.log(opts);
                  return spawnQuestionAndAnswer({
                    questionLayer: opts.questionLayer,
                    background: opts.background
                  });
                };
                setTimeout(callback, 500);
                return console.log("STH");
              })();
              return that.runAction(zoomout);
            } else {
              goog.events.removeAll(that);
              position = that.position_;
              console.log("INCORRECT", flatIdx, e, goog.getUid(e.target));
              x = position.x;
              y = position.y;
              moveUpOut = new lime.animation.Spawn(new lime.animation.MoveTo(x, y - 200), new lime.animation.FadeTo(0));
              return that.runAction(moveUpOut);
            }
          });
          items.push(item);
          return muteMe.push(function() {
            return goog.events.unlistenByKey(listen_key);
          });
        };
        for (y = 0; y <= 2; y++) {
          flatIdx = x * col + y;
          if (-1 === local_blockPattern.indexOf(flatIdx)) continue;
          item = addCharacter(randomManager.getItem(), {
            x: -sceneCenterX,
            y: -sceneCenterY,
            at: imageLayer,
            Idx: flatIdx,
            name: "Image " + flatIdx
          });
          positionX = startX * (x + 1) + 50;
          positionY = 20 + y * 100;
          item.setPosition(positionX, positionY);
          _fn(item, flatIdx);
        }
      }
    }
    imageLayer.row_ = row;
    return imageLayer;
  };

  catching.start = function() {
    var scene;
    catching.blockPatternIdx = goog.array.map(blockPattern, function(e, i) {
      return getIdxMap(e);
    });
    catching.director = new lime.Director(document.body, sceneWidth, sceneHeight);
    return scene = catching.intro();
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
      y: 170,
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
    return goog.events.listen(btnStart, ['click', 'touchstart'], function() {
      return catching.selectLevel();
    });
  };

  catching.selectLevel = function() {
    var background, boy, boyAction, btnEasyState1, btnEasyState2, btnLv2State1, btnLv2State2, buttonEasy, buttonLayer, buttonLv2, fadeIn, girl, girlAction, moveTitleUp, postbox, postboxAction, scene, title1, title2;
    scene = new lime.Scene;
    background = new lime.Layer;
    scene.appendChild(background);
    setUp({
      part: 'gameFrame',
      at: background
    });
    boy = addCharacter("boy.png", {
      x: -280,
      y: 170,
      at: background
    });
    girl = addCharacter("girl.png", {
      x: -100,
      y: 200,
      at: background
    });
    postbox = addCharacter("postbox.png", {
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
    title1 = addCharacter("title_1.png", {
      x: 0,
      y: -200,
      at: background
    });
    title2 = addCharacter("title_2.png", {
      x: 0,
      y: -75,
      at: background
    });
    boyAction = new lime.animation.Spawn(new lime.animation.MoveTo(boy.position_.x - 60, boy.position_.y), new lime.animation.FadeTo(100));
    moveTitleUp = new lime.animation.MoveBy(0, -80).setDuration(0.8);
    moveTitleUp.addTarget(title1);
    moveTitleUp.addTarget(title2);
    moveTitleUp.play();
    girlAction = new lime.animation.Spawn(new lime.animation.MoveTo(girl.position_.x + 480, girl.position_.y), new lime.animation.FadeTo(100));
    postboxAction = new lime.animation.Spawn(new lime.animation.FadeTo(100), new lime.animation.FadeTo(0));
    girl.runAction(girlAction.setDuration(0.8));
    postbox.runAction(postboxAction.setDuration(0.6));
    boy.runAction(boyAction.setDuration(0.8));
    buttonLayer = new lime.Layer;
    fadeIn = new lime.animation.FadeTo(100);
    btnEasyState1 = new lime.Sprite().setFill('assets/images/button.png');
    btnEasyState2 = new lime.Sprite().setFill('assets/images/btn_start_active.png');
    buttonEasy = new lime.Button(btnEasyState1, btnEasyState2).setPosition(sceneCenterX, sceneCenterY - 50);
    btnLv2State1 = new lime.Sprite().setFill('assets/images/button.png');
    btnLv2State2 = new lime.Sprite().setFill('assets/images/btn_start_active.png');
    buttonLv2 = new lime.Button(btnLv2State1, btnLv2State2).setPosition(sceneCenterX, sceneCenterY + 50);
    buttonLayer.appendChild(buttonEasy);
    buttonLayer.appendChild(buttonLv2);
    fadeIn.addTarget(buttonEasy);
    fadeIn.addTarget(buttonLv2);
    fadeIn.play();
    scene.appendChild(buttonLayer);
    goog.events.listen(buttonEasy, ['click', 'touchstart'], function() {
      return catching.secondScene();
    });
    scene.appendChild;
    return catching.director.replaceScene(scene);
  };

  animateSetOfAnswer = function(opts) {};

  spawnQuestionAndAnswer = function(opts) {
    var animate01, background, imageLayer, questionLayer, velocity;
    background = opts.background;
    questionLayer = opts.questionLayer;
    questionLayer.removeAllChildren();
    imageLayer = buildSetOfAnimation(3, {
      questionLayer: questionLayer,
      background: background
    });
    background.appendChild(imageLayer);
    background.appendChild(questionLayer);
    velocity = 0.1;
    animate01 = function(dt) {
      var position;
      position = this.getPosition();
      position.y += velocity * dt;
      if (position.y > 700) {
        console.log("BINGO");
        goog.array.forEach(muteMe, function(e) {
          console.log("REMOVED");
          return goog.events.removeAll(e);
        });
        lime.scheduleManager.unschedule(answerAnimationFactory.pop(), imageLayer);
        imageLayer.removeAllChildren();
        spawnQuestionAndAnswer({
          background: background,
          questionLayer: questionLayer
        });
      }
      return this.setPosition(position);
    };
    answerAnimationFactory.push(animate01);
    setUp({
      part: 'blockPipe',
      by: 3,
      at: background
    });
    addCharacter("game_frame.png", {
      x: 0,
      y: 0,
      w: 40,
      h: -20,
      at: background
    });
    return (function(velocity, imageLayer) {
      return lime.scheduleManager.schedule(animate01, imageLayer);
    })(velocity, imageLayer);
  };

  catching.secondScene = function() {
    var background, clock, questionLayer, scene;
    scene = new lime.Scene;
    background = new lime.Layer;
    scene.appendChild(background);
    setUp({
      part: 'gameFrame',
      at: background
    });
    clock = addCharacter("clock.png", {
      x: sceneCenterX - 100,
      y: sceneCenterY - 140,
      at: background,
      name: 'Clock'
    });
    questionLayer = new lime.Layer;
    background.appendChild(questionLayer);
    spawnQuestionAndAnswer({
      background: background,
      questionLayer: questionLayer
    });
    catching.lblTimer = new lime.Label();
    console.log(clock);
    catching.lblTimer.setSize(50, 50).setFontSize(40).setPosition(clock.position_.x - 33, clock.position_.y - 5);
    catching.lblTimer.setFontColor('#000');
    scene.appendChild(catching.lblTimer);
    catching.director.replaceScene(scene);
    return startTimer({
      limit: 80,
      delay: 1000,
      limeScope: nat,
      runningCallback: function(rt) {
        return catching.lblTimer.setText(rt);
      },
      timeoutCallback: function(rt) {
        catching.lblTimer.setText("0 ");
        console.log("TIME OUT");
        lime.scheduleManager.unschedule(nat.scheduleWithDelay, nat);
        return scene = catching.intro();
      }
    });
  };

  catching.lastScene = function() {
    var background, scene;
    scene = new lime.Scene;
    return background = new lime.Layer;
  };

  this.catching = catching;

}).call(this);
