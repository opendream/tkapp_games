(function() {
  var IconItem, addCharacter, answerAnimationFactory, blockPattern, buildSetOfAnimation, callbackFactory, nat, randomItemManager, sceneCenterX, sceneCenterY, sceneHeight, sceneWidth, setUp, startTimer;

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

  goog.require('goog.array');

  sceneWidth = 1024;

  sceneHeight = 768;

  sceneCenterX = sceneWidth / 2;

  sceneCenterY = sceneHeight / 2;

  callbackFactory = {
    timer: function() {}
  };

  this.muteMe = [];

  answerAnimationFactory = [];

  nat = {};

  blockPattern = [[1, 4, 5, 6, 7, 8], [2, 4, 5, 6, 7, 8], [0, 2, 3, 5, 6, 8], [5, 8]];

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
      }
    };
  };

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

  buildSetOfAnimation = function(col) {
    var correctIdx, flatIdx, imageLayer, item, positionX, positionY, randomManager, row, startX, x, y, _fn;
    if (col == null) col = 3;
    imageLayer = new lime.Layer;
    startX = 235;
    goog.array.shuffle(blockPattern);
    blockPattern = blockPattern[0];
    goog.array.shuffle(blockPattern);
    correctIdx = blockPattern[0];
    randomManager = randomItemManager();
    row = 0;
    if (col === 3) {
      for (x = 0; x <= 2; x++) {
        _fn = function(item, flatIdx) {
          var listen_key;
          listen_key = goog.events.listen(item, 'click', function(e) {
            var position, that, zoomout;
            that = this;
            console.log("Click on Object is", that);
            if (flatIdx === correctIdx) {
              console.log("CORRECT", flatIdx);
              zoomout = new lime.animation.Spawn(new lime.animation.ScaleTo(5), new lime.animation.FadeTo(0));
              return that.runAction(zoomout);
            } else {
              position = that.position_;
              console.log("INCORRECT", flatIdx);
              x = position.x;
              y = position.y;
              return (function(x, y) {
                zoomout = new lime.animation.Spawn(new lime.animation.MoveTo(x, y - 200), new lime.animation.FadeTo(0));
                return that.runAction(zoomout);
              })(x, y);
            }
          });
          return muteMe.push(function() {
            return goog.events.unlistenByKey(listen_key);
          });
        };
        for (y = 0; y <= 2; y++) {
          flatIdx = x * col + y;
          if (-1 === blockPattern.indexOf(flatIdx)) continue;
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

  catching.secondScene = function() {
    var animate01, background, clock, imageLayer, scene, velocity;
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
    clock = addCharacter("clock.png", {
      x: sceneCenterX - 100,
      y: sceneCenterY - 140,
      at: background,
      name: 'Clock'
    });
    imageLayer = buildSetOfAnimation();
    console.log(imageLayer, imageLayer.row_);
    scene.appendChild(imageLayer);
    velocity = 0.1;
    animate01 = function(dt) {
      var position;
      position = this.getPosition();
      position.y += velocity * dt;
      if (position.y > 500) {
        console.log("BINGO");
        goog.array.forEach(muteMe, function(func, i) {
          return func();
        });
        lime.scheduleManager.unschedule(answerAnimationFactory.pop(), imageLayer);
      }
      return this.setPosition(position);
    };
    answerAnimationFactory.push(animate01);
    (function(velocity, imageLayer) {
      return lime.scheduleManager.schedule(animate01, imageLayer);
    })(velocity, imageLayer);
    catching.lblTimer = new lime.Label();
    console.log(clock);
    catching.lblTimer.setSize(50, 50).setFontSize(40).setPosition(clock.position_.x - 33, clock.position_.y - 5);
    catching.lblTimer.setFontColor('#000');
    scene.appendChild(catching.lblTimer);
    catching.director.replaceScene(scene);
    return startTimer({
      limit: 80,
      delay: 100,
      limeScope: nat,
      runningCallback: function(rt) {
        return catching.lblTimer.setText(rt);
      },
      timeoutCallback: function(rt) {
        catching.lblTimer.setText("0 ");
        console.log("TIME OUT");
        return lime.scheduleManager.unschedule(nat.scheduleWithDelay, nat);
      }
    });
  };

  this.catching = catching;

}).call(this);
