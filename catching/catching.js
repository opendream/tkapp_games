(function() {
  var IconItem, addCharacter, blockPattern, blockPatternHard, buildSetOfAnimation, callbackFactory, getIdxMap, randomItemManager, sceneCenterX, sceneCenterY, sceneHeight, sceneWidth, setUp, spawnQuestionAndAnswer, startTimer;

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

  this.allScenes = [];

  this.answerAnimationFactory = [];

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

  blockPatternHard = [[0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 1], [0, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1], [1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0], [0, 0, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1], [0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 0]];

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

  this.score = (function() {
    var add, getScore, reset, _score;
    _score = 0;
    add = function() {
      _score++;
      return this;
    };
    reset = function() {
      return _score = 0;
    };
    getScore = function() {
      return _score;
    };
    return {
      getScore: getScore,
      add: add,
      reset: reset
    };
  })();

  setUp = function(opts) {
    var margin, startX;
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
        } else {
          startX = 100;
          margin = 245;
          return [
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
            }), addCharacter("block_pipe.png", {
              x: startX + margin,
              y: 50,
              w: 104,
              h: 122,
              absolute: true,
              at: opts.at,
              callback: function(char) {
                return char.setAnchorPoint(0, 0);
              }
            }), addCharacter("block_pipe.png", {
              x: startX + (2 * margin),
              y: 50,
              w: 104,
              h: 122,
              absolute: true,
              at: opts.at,
              callback: function(char) {
                return char.setAnchorPoint(0, 0);
              }
            }), addCharacter("block_pipe.png", {
              x: startX + (3 * margin),
              y: 50,
              w: 104,
              h: 122,
              absolute: true,
              at: opts.at,
              callback: function(char) {
                return char.setAnchorPoint(0, 0);
              }
            })
          ];
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
    var correctIdx, flatIdx, imageLayer, item, local_blockPattern, margin, positionX, positionY, question, randomManager, row, startX, x, y, _fn;
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
    row = 3;
    for (x = 0; 0 <= col ? x < col : x > col; 0 <= col ? x++ : x--) {
      _fn = function(item, flatIdx) {
        var listen_key;
        listen_key = goog.events.listen(item, ['click', 'touchstart'], function(e) {
          var correctArrow, moveUp, moveUpOut, position, runningSchedule, that, wrongArrow;
          that = this;
          if (flatIdx === correctIdx) {
            goog.array.forEach(muteMe, function(e, i) {
              return goog.events.removeAll(e);
            });
            runningSchedule = answerAnimationFactory.pop();
            lime.scheduleManager.unschedule(runningSchedule.callback, runningSchedule.scope);
            score.add();
            moveUp = new lime.animation.MoveBy(0, -120).setDuration(0.4);
            correctArrow = addCharacter("correct.png", {
              x: that.position_.x,
              y: that.position_.y,
              absolute: true,
              at: imageLayer
            });
            moveUp.addTarget(correctArrow).play();
            return (function() {
              var callback;
              callback = function() {
                imageLayer.removeAllChildren();
                return spawnQuestionAndAnswer({
                  questionLayer: opts.questionLayer,
                  background: opts.background
                });
              };
              return setTimeout(callback, 500);
            })();
          } else {
            wrongArrow = addCharacter("wrong.png", {
              x: that.position_.x,
              y: that.position_.y,
              absolute: true,
              at: imageLayer
            });
            moveUp = new lime.animation.MoveBy(0, -100).setDuration(0.8);
            goog.events.removeAll(that);
            position = that.position_;
            x = position.x;
            y = position.y;
            moveUpOut = new lime.animation.Spawn(new lime.animation.MoveTo(x, y - 200), new lime.animation.FadeTo(0)).setDuration(1);
            that.setHidden(true);
            return wrongArrow.runAction(moveUpOut);
          }
        });
        items.push(item);
        return muteMe.push(item);
      };
      for (y = 0; 0 <= row ? y < row : y > row; 0 <= row ? y++ : y--) {
        flatIdx = x * row + y;
        if (-1 === local_blockPattern.indexOf(flatIdx)) continue;
        item = addCharacter(randomManager.getItem(), {
          x: -sceneCenterX,
          y: -sceneCenterY,
          at: imageLayer,
          Idx: flatIdx,
          name: "Image " + flatIdx
        });
        if (col === 3) {
          positionX = startX * (x + 1) + 55;
          positionY = 20 + y * 100;
        } else {
          startX = 155;
          margin = 245;
          positionX = startX + (x * margin);
          positionY = 20 + y * 100;
        }
        item.setPosition(positionX, positionY);
        _fn(item, flatIdx);
      }
    }
    imageLayer.row_ = row;
    return imageLayer;
  };

  spawnQuestionAndAnswer = function(opts) {
    var ORDER, animate01, background, col, imageLayer, questionLayer, velocity;
    background = opts.background;
    col = catching.level === 'hard' ? 4 : 3;
    questionLayer = opts.questionLayer;
    questionLayer.removeAllChildren();
    imageLayer = buildSetOfAnimation(col, {
      questionLayer: questionLayer,
      background: background
    });
    background.appendChild(imageLayer);
    background.appendChild(questionLayer);
    velocity = 0.1;
    ORDER = 0;
    animate01 = function(dt) {
      var position, runningSchedule;
      console.log("ANIMATE ORDER", ORDER);
      position = this.getPosition();
      position.y += velocity * dt;
      if (position.y > 700) {
        goog.array.forEach(muteMe, function(e) {
          return goog.events.removeAll(e);
        });
        runningSchedule = answerAnimationFactory.pop();
        lime.scheduleManager.unschedule(runningSchedule.callback, runningSchedule.scope);
        imageLayer.removeAllChildren();
        spawnQuestionAndAnswer({
          background: background,
          questionLayer: questionLayer
        });
      }
      return this.setPosition(position);
    };
    answerAnimationFactory.push({
      callback: animate01,
      scope: imageLayer
    });
    setUp({
      part: 'blockPipe',
      by: col,
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
      ORDER++;
      return lime.scheduleManager.schedule(animate01, imageLayer);
    })(velocity, imageLayer);
  };

  catching.start = function() {
    var scene;
    catching.director = new lime.Director(document.body, sceneWidth, sceneHeight);
    return scene = catching.intro();
  };

  catching.intro = function() {
    var background, btnStart, btnState1, btnState2, scene, smoke;
    this.allScenes = [];
    scene = new lime.Scene;
    allScenes.push(scene);
    background = new lime.Layer;
    smoke = [new lime.Sprite().setFill('assets/images/smoke-1.png'), new lime.Sprite().setFill('assets/images/smoke-2.png'), new lime.Sprite().setFill('assets/images/smoke-3.png'), new lime.Sprite().setFill('assets/images/smoke-4.png')];
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
    var background, boy, boyAction, btnEasyState1, btnEasyState2, btnLv2State1, btnLv2State2, buttonEasy, buttonHard, buttonLayer, fadeIn, girl, girlAction, moveTitleUp, postbox, postboxAction, scene, title1, title2;
    scene = new lime.Scene;
    allScenes.push(scene);
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
    btnEasyState1 = new lime.Sprite().setFill('assets/images/btn-lv1.png');
    btnEasyState2 = new lime.Sprite().setFill('assets/images/btn-lv1-hover.png');
    buttonEasy = new lime.Button(btnEasyState1, btnEasyState2).setPosition(sceneCenterX, sceneCenterY - 50);
    btnLv2State1 = new lime.Sprite().setFill('assets/images/btn-lv2.png');
    btnLv2State2 = new lime.Sprite().setFill('assets/images/btn-lv2-hover.png');
    buttonHard = new lime.Button(btnLv2State1, btnLv2State2).setPosition(sceneCenterX, sceneCenterY + 50);
    buttonLayer.appendChild(buttonEasy);
    buttonLayer.appendChild(buttonHard);
    fadeIn.addTarget(buttonEasy);
    fadeIn.addTarget(buttonHard);
    fadeIn.play();
    scene.appendChild(buttonLayer);
    goog.events.listen(buttonEasy, ['click', 'touchstart'], function() {
      score.reset();
      catching.level = 'easy';
      catching.blockPatternIdx = goog.array.map(blockPattern, function(e, i) {
        return getIdxMap(e);
      });
      return catching.secondScene();
    });
    goog.events.listen(buttonHard, ['click', 'touchstart'], function() {
      score.reset();
      catching.level = 'hard';
      catching.blockPatternIdx = goog.array.map(blockPatternHard, function(e, i) {
        return getIdxMap(e);
      });
      return catching.secondScene();
    });
    return catching.director.replaceScene(scene);
  };

  catching.secondScene = function() {
    var background, clock, questionLayer, scene;
    scene = new lime.Scene;
    allScenes.push(scene);
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
    catching.lblTimer.setSize(50, 50).setFontSize(40).setPosition(clock.position_.x - 33, clock.position_.y - 5);
    catching.lblTimer.setFontColor('#000');
    scene.appendChild(catching.lblTimer);
    catching.director.replaceScene(scene);
    return startTimer({
      limit: catching.level === 'hard' ? 70 : 80,
      delay: 10,
      limeScope: callbackFactory,
      runningCallback: function(rt) {
        return catching.lblTimer.setText(rt);
      },
      timeoutCallback: function(rt) {
        var runningSchedule;
        catching.lblTimer.setText("0 ");
        runningSchedule = answerAnimationFactory.pop();
        lime.scheduleManager.unschedule(runningSchedule.callback, runningSchedule.scope);
        lime.scheduleManager.unschedule(callbackFactory.timer, callbackFactory);
        scene = catching.lastScene();
        return catching.director.replaceScene(scene);
      }
    });
  };

  catching.lastScene = function() {
    var background, boy, bubble, girl, menu, menu1, menu2, scene, scoreLabel, title1;
    scene = new lime.Scene;
    allScenes.push(scene);
    background = new lime.Layer;
    setUp({
      part: 'gameFrame',
      at: background
    });
    menu = addCharacter("list.png", {
      x: -295,
      y: -170,
      at: background
    });
    menu.setScale(1.2);
    title1 = addCharacter("title_1.png", {
      x: -295,
      y: -310,
      at: background
    });
    title1.setScale(0.5);
    menu1 = addCharacter("menu-story.png", {
      x: -295,
      y: -230,
      at: background
    });
    menu1.setScale(1.3);
    menu2 = addCharacter("menu-replay.png", {
      x: -295,
      y: -156,
      at: background
    });
    menu2.setScale(1.3);
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
    bubble = addCharacter("bubble-point.png", {
      x: 180,
      y: -80,
      at: background
    });
    bubble.setScale(1.4);
    scoreLabel = new lime.Label;
    scoreLabel.setText(score.getScore()).setPosition(bubble.position_.x + 10, bubble.position_.y - 36).setFontColor('red').setFontSize(48);
    scene.appendChild(background);
    scene.appendChild(scoreLabel);
    return scene;
  };

  this.catching = catching;

}).call(this);
