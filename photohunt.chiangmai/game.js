var game_func = function () {
  
  var atype = navigator.userAgent.toLowerCase().match('firefox')? 'ogg': 'mp3';
  
  var clickSound, IconAudio, IconItem, IconText, addchar2acter, blockPattern, blockPatternHard, buildSetOfAnimation, callbackFactory, getIdxMap, sceneCenterX, sceneCenterY, sceneHeight, sceneWidth, spawnQuestionAndAnswer, startTimer;

  goog.provide('game');

  goog.require('lime.Director');

  goog.require('lime.Scene');

  goog.require('lime.Layer');

  goog.require('lime.Circle');

  goog.require('lime.Label');

  goog.require('lime.Button');

  goog.require('lime.RoundedRect');

  goog.require('lime.fill.LinearGradient');

  goog.require('lime.animation.Spawn');

  goog.require('lime.animation.Sequence');

  goog.require('lime.animation.FadeTo');

  goog.require('lime.animation.ScaleTo');

  goog.require('lime.animation.MoveTo');

  goog.require('lime.animation.MoveBy');

  goog.require('lime.animation.ScaleBy');

  goog.require('lime.audio.Audio');

  goog.require('goog.array');

  goog.require('lime.GlossyButton');

  sceneWidth = 800;

  sceneHeight = 600;

  sceneCenterX = sceneWidth / 2;

  sceneCenterY = sceneHeight / 2;

  callbackFactory = {
    timer: function() {}
  };

  this.muteMe = [];

  this.allScenes = [];

  game.isGameEnded = false;

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


  

  this.score = (function() {
    var add, getScore, reset, _score;
    _score = 0;
    add = function() {
      _score+=4;
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



  addchar2acter = function(image, opts) {
    var char2acter, height, posX, posY, weight, width;
    char2acter = new lime.Sprite;
    char2acter.setFill("assets/images/" + image);
    if ((opts.absolutePosition != null) === true || (opts.absolute != null) === true) {
      posX = opts.x;
      posY = opts.y;
    } else {
      posX = sceneCenterX + opts.x;
      posY = sceneCenterY + opts.y;
    }
    if (opts.w != null) width = opts.w;
    if (opts.h != null) height = opts.h;
    weight = weight || 100;
    if ((opts.x != null) && (opts.y != null)) char2acter.setPosition(posX, posY);
    if ((opts.w != null) && (opts.h != null)) char2acter.setSize(width, height);
    opts.at.appendChild(char2acter, weight);
    if (typeof opts.callback === "function") opts.callback(char2acter);
    if (opts.name != null) char2acter.name = opts.name;
    return char2acter;
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



  game.start = function() {
    var scene;
    game.director = new lime.Director(document.body, sceneWidth, sceneHeight);
    try {
      this.theme = new lime.audio.Audio("assets/sound/theme-song." + atype);
      this.theme.baseElement.loop = true;

    } catch (e) {
      if (typeof console !== "undefined" && console !== null) {
        if (typeof console.log === "function") console.log(e);
      }
    }
    return scene = game.intro();
  };
    game.stop = function(){
    this.theme.stop();
  }
  game.intro = function() {
    var background, btnStart, btnState1, btnState2, scene;
    game.isGameEnded = false;
    this.allScenes = [];
    scene = new lime.Scene;
    allScenes.push(scene);
    background = new lime.Layer;
    var gameNameSound = new lime.audio.Audio("assets/sound/gamename." + atype);
    lime.scheduleManager.callAfter(function(){gameNameSound.play()}, gameNameSound, 500)
    //this.gameNameSound = new lime.audio.Audio("assets/sound/gamename." + atype);
    //this.gameNameSound.play();
    scene.appendChild(background);
    addchar2acter("scene_bg.png", {
      x: 2,
      y: 10,
      at: background,
      'callback': function(char2) {
        return char2.setScale(0.99);
      }
    });

    addchar2acter("grass.png", {
      x: 0,
      y: 200,
      at: background,
      'callback': function(char2) {
        return char2.setScale(1);
      }
    });
    addchar2acter("boy.png", {
      x: -230,
      y: 170,
      at: background,
      'callback': function(char2) {
        return char2.setScale(0.8);
      }
    });
    addchar2acter("girl.png", {
      x: -60,
      y: 150,
      at: background,
      'callback': function(char2) {
        return char2.setScale(0.8);
      }
    });
    addchar2acter("girl2.png", {
      absolute : true,
      x: sceneWidth*0.85,
      y: sceneHeight*0.83,
      at: background,
      'callback': function(char2) {
        return char2.setScale(0.9);
      }
    });
    var _arrow = addchar2acter("arrow.png", {
      x: 200,
      y: 140,
      at: background,
      'callback': function(char2) {
        return char2.setScale(0.9);
      }
    });
    var click = new lime.Label().setFontSize(23).setFontColor("#FFF").setText("CLICK").setPosition(sceneWidth*0.73,sceneHeight*0.73);
    background.appendChild(click);

    addchar2acter("game_bg.png", {
      x: 0,
      y: 0,
      at: background,
      w: sceneWidth,
      h: sceneHeight
    });
    addchar2acter("game_frame.png", {
      x: -2,
      y: 5,
      at: background,
      'callback': function(char2) {
        return char2.setScale(0.95, 0.9);
      }
    });
       addchar2acter("photo.png", {
      x: 35,
      y: -140,
      at: background,
      'callback': function(char2) {
        return char2.setScale(0.9);
      }
    });
    addchar2acter("title_1.png", {
      x: 0,
      y: 0,
      at: background,
      'callback': function(char2) {
        return char2.setScale(0.9);
      }
    });
 

    btnState1 = new lime.Sprite().setFill('assets/images/btn_start_normal.png');
    btnState2 = new lime.Sprite().setFill('assets/images/btn_start_active.png');
    btnStart = new lime.Button(btnState1, btnState2).setPosition(sceneCenterX + 140, sceneCenterY + 200).setScale(0.9);
    background.appendChild(btnStart);
    game.director.replaceScene(scene);
    _arrow.domClassName = goog.getCssName('lime-button');
    clickSound = new lime.audio.Audio("assets/sound/click." + atype);

    goog.events.listen(_arrow, ['click', 'touchstart'], function() {
      clickSound.play();
      return game.selectLevel();
    });
    goog.events.listen(click, ['click', 'touchstart'], function() {
      clickSound.play();
      return game.selectLevel();
    });
    return goog.events.listen(btnStart, ['click', 'touchstart'], function() {
      clickSound.play();
      return game.selectLevel();
    });
  };

  game.selectLevel = function() {
    var background, boy, boyAction, btnEasyState1, btnEasyState2, btnLv2State1, btnLv2State2, buttonEasy, buttonHard, buttonLayer, fadeIn, girl, girlAction, moveTitleUp, arrow, fadeAndHide, scene, title1, title2;
    scene = new lime.Scene;
    allScenes.push(scene);
    background = new lime.Layer;
    scene.appendChild(background);
    addchar2acter("scene_bg.png", {
      x: 2,
      y: 10,
      at: background,
      'callback': function(char2) {
        return char2.setScale(0.99);
      }
    });
    addchar2acter("grass.png", {
      x: 0,
      y: 200,
      at: background,
      'callback': function(char2) {
        return char2.setScale(1);
      }
    });
    boy = addchar2acter("boy.png", {
      x: -230,
      y: 170,
      at: background,
      'callback': function(char2) {
        return char2.setScale(0.8);
      }
    });
    girl = addchar2acter("girl.png", {
      x: -60,
      y: 150,
      at: background,
      'callback': function(char2) {
        return char2.setScale(0.8);
      }
    });
    addchar2acter("girl2.png", {
      absolute : true,
      x: sceneWidth*0.85,
      y: sceneHeight*0.83,
      at: background,
      'callback': function(char2) {
        return char2.setScale(0.9);
      }
    });
    arrow = addchar2acter("arrow.png", {
      x: 200,
      y: 140,
      at: background,
      'callback': function(char2) {
        return char2.setScale(0.9);
      }
    });
    var clickLabel = new lime.Label().setFontSize(23).setFontColor("#FFF").setText("CLICK").setPosition(sceneWidth*0.73,sceneHeight*0.73);
    background.appendChild(clickLabel);
    addchar2acter("game_bg.png", {
      x: 0,
      y: 0,
      at: background,
      w: sceneWidth,
      h: sceneHeight
    });
    addchar2acter("game_frame.png", {
      x: -2,
      y: 5,
      at: background,
      'callback': function(char2) {
        return char2.setScale(0.95, 0.9);
      }

    });

    title3 = addchar2acter("photo.png", {
      x: 35,
      y: -140,
      at: background,
      'callback': function(char2) {
        return char2.setScale(0.9);
      }
    });
    title1 = addchar2acter("title_1.png", {
      x: 0,
      y: 0,
      at: background,
      'callback': function(char2) {
        return char2.setScale(0.9);
      }
    });

    btnState1 = new lime.Sprite().setFill('assets/images/btn_start_normal.png');
    btnState2 = new lime.Sprite().setFill('assets/images/btn_start_active.png');
    btnStart = new lime.Button(btnState1, btnState2).setPosition(sceneCenterX + 140, sceneCenterY + 200).setScale(0.9);
    background.appendChild(btnStart);
    boyAction = new lime.animation.Spawn(new lime.animation.MoveBy(-40, 0).enableOptimizations(), new lime.animation.FadeTo(100).enableOptimizations());
    moveTitleUp = new lime.animation.MoveBy(0, -180).setDuration(0.8).enableOptimizations();
    moveTitleUp.addTarget(title1);
    fadeAndHide = new lime.animation.Spawn(new lime.animation.FadeTo(100).enableOptimizations(), new lime.animation.FadeTo(0).enableOptimizations());
    fadeAndHide.addTarget(title3);
    fadeAndHide.addTarget(btnStart);
    moveTitleUp.play();
    girlAction = new lime.animation.Spawn(new lime.animation.MoveBy(-10, 0).enableOptimizations(), new lime.animation.FadeTo(100).enableOptimizations());
  
    girl.runAction(girlAction.setDuration(0.8));
    arrow.runAction(fadeAndHide.setDuration(0.6));
    clickLabel.runAction(fadeAndHide.setDuration(0.6));
    boy.runAction(boyAction.setDuration(0.8));
    buttonLayer = new lime.Layer;
    fadeIn = new lime.animation.FadeTo(100);
    btnEasyState1 = new lime.Sprite().setFill('assets/images/btn-lv1.png');
    btnEasyState2 = new lime.Sprite().setFill('assets/images/btn-lv1-hover.png');
    buttonEasy = new lime.Button(btnEasyState1, btnEasyState2).setPosition(sceneCenterX, sceneCenterY-60);
    btnLv2State1 = new lime.Sprite().setFill('assets/images/btn-lv2.png');
    btnLv2State2 = new lime.Sprite().setFill('assets/images/btn-lv2-hover.png');
    buttonHard = new lime.Button(btnLv2State1, btnLv2State2).setPosition(sceneCenterX, sceneCenterY+40);
    buttonLayer.appendChild(buttonEasy);
    buttonLayer.appendChild(buttonHard);
    fadeIn.addTarget(buttonEasy);
    fadeIn.addTarget(buttonHard);
    fadeIn.play();
    scene.appendChild(buttonLayer);
    goog.events.listen(buttonEasy, ['click', 'touchstart'], function() {
      score.reset();
      game.level = 'easy';
      clickSound.play()
      return game.secondScene();
    });
    goog.events.listen(buttonHard, ['click', 'touchstart'], function() {
      score.reset();
      game.level = 'hard';
      clickSound.play()
      console.log(game.blockPatternIdx);
      return game.secondScene();
    });
    return game.director.replaceScene(scene);
  };

  game.secondScene = function() {
    var background, clock, col, questionLayer, scene, helperCount,frame,wrongPicture,rightPicture,questionLength,pic1,pic2;
    var correctSound = new lime.audio.Audio("assets/sound/correct." + atype);
    var wrongSound = new lime.audio.Audio("assets/sound/wrong." + atype);
    
    //Question
    var questions = [
    {
      num:6,
      position:[{x:0,y:0},{x:20,y:250},{x:50,y:180},{x:140,y:175},{x:155,y:100},{x:230,y:140}],
      correct:[0,0,0,0,0,0],
      leftImage:"assets/images/problems/image1a.jpg",
      rightImage:"assets/images/problems/image1b.jpg"
    },
    {
      num:6,
      position:[{x:50,y:55},{x:30,y:130},{x:120,y:120},{x:210,y:10},{x:210,y:120},{x:210,y:220}],
      correct:[0,0,0,0,0,0],
      leftImage:"assets/images/problems/image2a.jpg",
      rightImage:"assets/images/problems/image2b.jpg"
    },
      {
      num:6,
      position:[{x:0,y:180},{x:40,y:250},{x:190,y:0},{x:110,y:160},{x:180,y:90},{x:250,y:40}],
      correct:[0,0,0,0,0,0],
      leftImage:"assets/images/problems/image3a.jpg",
      rightImage:"assets/images/problems/image3b.jpg"
    },
    {
      num:6,
      position:[{x:130,y:30},{x:130,y:120},{x:50,y:130},{x:80,y:220},{x:180,y:120},{x:230,y:170}],
      correct:[0,0,0,0,0,0],
      leftImage:"assets/images/problems/image4a.jpg",
      rightImage:"assets/images/problems/image4b.jpg"
    }
    ];

    helperCount = game.level === 'easy' ? 3 : 2;
    scene = new lime.Scene;
    allScenes.push(scene);
    background = new lime.Layer;
    this.theme.play();
    scene.appendChild(background);

    addchar2acter("scene_bg.png", {
      x: 2,
      y: 10,
      at: background,
      'callback': function(char2) {
        return char2.setScale(0.99);
      }
    });
    addchar2acter("game_bg.png", {
      x: 0,
      y: 0,
      at: background,
      w: sceneWidth,
      h: sceneHeight
    });
    addchar2acter("game_frame.png", {
      x: -2,
      y: 5,
      at: background,
      'callback': function(char2) {
        return char2.setScale(0.95, 0.9);
      }
    });

    frame =  new lime.Sprite().setSize(sceneWidth*0.795,sceneHeight*0.795).setFill('assets/images/frame.png').setPosition(sceneCenterX,sceneCenterY);
    background.appendChild(frame);
    
    clock = addchar2acter("clock.png", {
      x: sceneCenterX+25,
      y: sceneCenterY*1.5,
      absolute: true,
      at: background,
      name: 'Clock'
    });

   wrongPicture = new lime.Sprite().setSize(226,203).setFill('assets/images/wrong.png').setPosition(sceneCenterX/2+90,sceneCenterY/2).setAnchorPoint(0,0).setOpacity(0);
   rightPicture = new lime.Sprite().setSize(226,174).setFill('assets/images/correct.png').setPosition(sceneCenterX/2+90,sceneCenterY/2).setAnchorPoint(0,0).setOpacity(0);
   questionLength = questions.length;  
  
  //Generate Random Order of question
  var order = []
  while(order.length < questionLength){
    var randomnumber=Math.floor(Math.random() * questionLength);
    var found=false;
    for(var i=0;i<order.length;i++){
      if(order[i]==randomnumber){found=true;break}
    }
    if(!found)order[order.length]=randomnumber;
  }
    //HINT BUTTON
    var hint = new Array();
    for(var i = 0;i<helperCount;i++){
      if(helperCount == 3){
        hint.push(new lime.Sprite().setSize(50,50).setPosition((sceneCenterX/helperCount)+(i*70)+30,sceneCenterY+150).setFill('assets/images/hint.png'));
      }else if (helperCount == 2){
        hint.push(new lime.Sprite().setSize(50,50).setPosition((sceneCenterX/helperCount)+(i*70),sceneCenterY+150).setFill('assets/images/hint.png'));
      }
      hint[i].domClassName = goog.getCssName('lime-button');
      scene.appendChild(hint[i]);
      !function(i){
        goog.events.listen(hint[i], ['click', 'touchstart'], function(e){
          var avialable = questions[order[queueIndex]]["correct"];
          
          var choice = new Array();
          for(var k = 0 ; k < avialable.length ; k++){
            if(avialable[k] == 0)
              choice.push(k);
          }
          var free = choice[Math.floor(Math.random() * choice.length)]
          console.log(choice);
          console.log(free);
          correctEvent(free);
          hint[i].setFill('assets/images/hintChecked.png')
          goog.events.removeAll(hint[i]);
        });
      }(i)
    }
    
    //ALL THOSE LABLE AT THE BOTTOM
    hintLabel = new lime.Sprite().setPosition((sceneCenterX/helperCount)+110,sceneCenterY+205).setFill('assets/images/hintLabel.png').setScale(0.80);
    background.appendChild(hintLabel);
    timeLabel = new lime.Sprite().setPosition(sceneCenterX,sceneCenterY+210).setFill('assets/images/time.png').setScale(0.80)
    background.appendChild(timeLabel);
    _scoreLabel = new lime.Sprite().setPosition(sceneCenterX+170,sceneCenterY+210).setFill('assets/images/score.png').setScale(0.80)
    background.appendChild(_scoreLabel);

    numberLabelBG = new lime.Sprite().setPosition(sceneWidth*0.94,70).setFill('assets/images/numberLabel.png');
    background.appendChild(numberLabelBG);
    numberAtLabel = new lime.Label();
    numberAtLabel.setSize(50, 50).setFontSize(20).setPosition(sceneWidth*0.933,80);
    numberAtLabel.setFontColor('#fff');
    numberAtLabel.setText("เกมที่")
    numberLabel = new lime.Label();
    numberLabel.setSize(50, 50).setFontSize(20).setPosition(sceneWidth*0.935,102);
    numberLabel.setFontColor('#fff');
    background.appendChild(numberAtLabel)
    background.appendChild(numberLabel);
    var queueIndex = 0
    numberLabel.setText((queueIndex+1)+'');
    var correctImage = new Array()
    var correctLayer = new lime.Layer()

    //ANIMATE WHEN USER ANSWER THE QUESTION
    var showWrongAnimation = function(){
        wrongSound.stop();
        wrongSound.play();
        wrongPicture.runAction(new lime.animation.FadeTo(1).setDuration(0.5));
        lime.scheduleManager.callAfter(function(){wrongPicture.runAction(new lime.animation.FadeTo(0).setDuration(0.5));}, wrongPicture, 500)
        //wrongSound.stop();
      };
    var showCorrectAnimation = function(){
        
        rightPicture.runAction(new lime.animation.FadeTo(1).setDuration(0.5));
        lime.scheduleManager.callAfter(function(){rightPicture.runAction(new lime.animation.FadeTo(0).setDuration(0.2));}, wrongPicture, 500)
    }


    //GET GAME LAYER TO SHOW ON THE GROUNDs
    var getShowingLayer = function() {
      var correctImage = new Array()
      var gameLayer = new lime.Layer()
      if(questions[order[queueIndex]]["num"] == 6 || questions[order[queueIndex]]["num"] == 5){
            for(var i = 0 ; i<questions[order[queueIndex]]["num"] ; i++){
                correctImage.push(new lime.Sprite().setSize( 50, 50 ).setPosition(
                    (i<3) ? 
                        sceneCenterX+(sceneCenterX/4)+(i*70) : (questions[order[queueIndex]]["num"] == 6) ? 
                            sceneCenterX+(sceneCenterX/4)+((i-3)*70) : sceneCenterX+(sceneCenterX/3)+((i-3)*70),
                    (i<3) ? 
                        sceneCenterY+120 : sceneCenterY+170).setFill('assets/images/correctUncheck.png'));
                correctLayer.appendChild(correctImage[i]);
            }
      }
      if(questions[order[queueIndex]]["num"] == 4){
            for(var i = 0 ; i<questions[order[queueIndex]]["num"] ; i++){
                correctImage.push(new lime.Sprite().setSize( 50, 50 ).setPosition(
                      sceneCenterX+(sceneCenterX/4)+(i*60)-20,sceneCenterY+130
                ).setFill('assets/images/correctUncheck.png'));
                correctLayer.appendChild(correctImage[i]);
            }
      }
      if(questions[order[queueIndex]]["num"] == 3){
            for(var i = 0 ; i<questions[order[queueIndex]]["num"] ; i++){
                correctImage.push(new lime.Sprite().setSize( 50, 50 ).setPosition(
                      sceneCenterX+(sceneCenterX/3)+(i*70)-10,sceneCenterY+130
                ).setFill('assets/images/correctUncheck.png'));
                correctLayer.appendChild(correctImage[i]);
            }
      }
      background.appendChild(correctLayer)

      //SOME POSITION ATTRUBUTE OF GAME
      var leftMargin = 101
      var circleSize = 50
      var xBase1 = leftMargin
      var xBase2 = sceneCenterX+leftMargin
      var yBase = 85
      var redCircle1 = new Array()
      var redCircle2 = new Array()
      var currObj
      var correctIndex = 0
      var pictureWidth = 296
      var pictureHeight = 315
      pic1 = new lime.Sprite().setSize(pictureWidth,pictureWidth).setFill(questions[order[queueIndex]]["leftImage"]).setAnchorPoint(0,0).setPosition(0,0)
      pic2 = new lime.Sprite().setSize(pictureWidth,pictureWidth).setFill(questions[order[queueIndex]]["rightImage"]).setAnchorPoint(0,0).setPosition(300,0)
      
    
      goog.events.listen(pic1, ['click', 'touchstart'], showWrongAnimation)
      goog.events.listen(pic2, ['click', 'touchstart'], showWrongAnimation)
      gameLayer.setPosition(xBase1,yBase).setAnchorPoint(0,0)
      gameLayer.appendChild(pic1)
      gameLayer.appendChild(pic2)
      
      for(var i = 0; i < questions[order[queueIndex]]["num"]; i++){
         currObj = questions[order[queueIndex]]["position"][i]
         redCircle1.push((new lime.Sprite().setSize(circleSize,circleSize).setAnchorPoint(0,0).setPosition(currObj.x,currObj.y).setFill("assets/images/circle.png").setOpacity(0.01)))
         gameLayer.appendChild(redCircle1[i])
         redCircle2.push((new lime.Sprite().setSize(circleSize,circleSize).setAnchorPoint(0,0).setPosition(currObj.x+300,currObj.y).setFill("assets/images/circle.png").setOpacity(0.01)))
         gameLayer.appendChild(redCircle2[i])
      }
      return {
          layer : function(){
            return gameLayer
           },
          getRedCircle1Array : function(){
            return redCircle1
          },
          getRedCircle2Array : function(){
            return redCircle2
          },
          correct : function(index){
              questions[order[queueIndex]]["correct"][index] = 1;
              correctImage[correctIndex++].setFill('assets/images/correctCheck.png')
          },
          corrected : function(){
            return correctIndex
          },
          removeAllChildren : function(){
            gameLayer.removeAllChildren()
          },
          num : function(){
            return questions[order[queueIndex]]["num"];
          }

      };
      
    }

    var showingLayer = getShowingLayer()
    background.appendChild(showingLayer.layer())
    var redCircleEvent = function(){
          for(var listenerLoop = 0;listenerLoop<showingLayer.num() ;listenerLoop++){
            !function(listenerLoop) {
              var getRedCircleEvent = function(e) {
                        e.event.stopPropagation()
                        e.cancelBubble = true
                        correctEvent(listenerLoop)
              };
              goog.events.listen(showingLayer.getRedCircle1Array()[listenerLoop], ['click', 'touchstart'], getRedCircleEvent)
              goog.events.listen(showingLayer.getRedCircle2Array()[listenerLoop], ['click', 'touchstart'], getRedCircleEvent)
            } (listenerLoop)
          }
    };
    redCircleEvent();
    
    var correctEvent = function(redCircleIndex){
          showingLayer.getRedCircle1Array()[redCircleIndex].setOpacity(1);
          showingLayer.getRedCircle2Array()[redCircleIndex].setOpacity(1);
          goog.events.removeAll(showingLayer.getRedCircle1Array()[redCircleIndex]);
          goog.events.removeAll(showingLayer.getRedCircle2Array()[redCircleIndex]);
          score.add();
          correctSound.stop();
          correctSound.play();
          showingLayer.correct(redCircleIndex);
          if(showingLayer.corrected() >= showingLayer.num()){
            
            queueIndex++;
            numberLabel.setText((queueIndex+1)+'');
            if(queueIndex<questionLength)
               {nextProblem()}
            else{
                goog.events.removeAll(showingLayer[redCircleIndex]);
            }
          }else{
              showCorrectAnimation();
          }
    }

    background.appendChild(wrongPicture)
    background.appendChild(rightPicture)
    var nextProblem = function(){
        pic1.setFill(questions[order[queueIndex]]["leftImage"]);
        pic2.setFill(questions[order[queueIndex]]["rightImage"]);
        correctLayer.removeAllChildren()
        background.removeChild(showingLayer.layer());
        showingLayer = getShowingLayer();
        background.appendChild(showingLayer.layer());
        redCircleEvent();
        background.removeChild(wrongPicture)
        background.appendChild(wrongPicture)
        background.removeChild(rightPicture)
        background.appendChild(rightPicture)
    }

    gameLabel = addchar2acter("title_1.png",{
      absolute : true,
      x: 30,
      y: 10,
      at: background,
      w:200,
      h:50
    });
    gameLabel.setAnchorPoint(0,0);
    game.lblTimer = new lime.Label();
    game.lblTimer.setSize(50, 50).setFontSize(40).setPosition(clock.position_.x - 33, clock.position_.y - 5);
    game.lblTimer.setFontColor('#000');
    scene.appendChild(game.lblTimer);
    game.director.replaceScene(scene);
    return startTimer({
      limit: game.level === 'hard' ? 60 : 80,
      delay: 1000,
      limeScope: callbackFactory,
      runningCallback: function(rt) {
        return game.lblTimer.setText(rt);
      },
      timeoutCallback: function(rt) {
        game.lblTimer.setText("0 ");
        game.isGameEnded = true;
        lime.scheduleManager.unschedule(callbackFactory.timer, callbackFactory);
        scene = game.timeoutScene();
        return game.director.replaceScene(scene);
      }
    });
  };

  game.timeoutScene = function() {
    var background, changeScene, scene;
    scene = new lime.Scene;
    allScenes.push(scene);
    background = new lime.Layer;
    this.theme.stop();
    addchar2acter("scene_bg.png", {
      x: 2,
      y: 10,
      at: background,
      'callback': function(char2) {
        return char2.setScale(0.99);
      }
    });
    addchar2acter("game_bg.png", {
      x: 0,
      y: 0,
      at: background,
      w: sceneWidth,
      h: sceneHeight
    });
    addchar2acter("game_frame.png", {
      x: -2,
      y: 5,
      at: background,
      'callback': function(char2) {
        return char2.setScale(0.95, 0.9);
      }
    });
    addchar2acter("gameover.png", {
      x: 0,
      y: 0,
      at: background,
      'callback': function(char2) {
        char2.setScale(0);
        return char2.runAction(new lime.animation.ScaleTo(1.0));
      }
    });
    scene.appendChild(background);
    changeScene = function() {
      return game.director.replaceScene(game.lastScene());
    };
    lime.scheduleManager.scheduleWithDelay(changeScene, game, 1500, 1);
    return scene;
  };

  game.lastScene = function() {
    var background, bubble, menu, menu2, scene, scoreLabel, title1;
    scene = new lime.Scene;
    allScenes.push(scene);
    background = new lime.Layer;
    this.theme.stop();
    addchar2acter("scene_bg.png", {
      x: 2,
      y: 10,
      at: background,
      'callback': function(char2) {
        return char2.setScale(0.99);
      }
    });
    addchar2acter("boy.png", {
      x: -230,
      y: 170,
      at: background,
      'callback': function(char2) {
        return char2.setScale(0.8);
      }
    });
    addchar2acter("girl.png", {
      x: -60,
      y: 150,
      at: background,
      'callback': function(char2) {
        return char2.setScale(0.8);
      }
    });
    addchar2acter("game_bg.png", {
      x: 0,
      y: 0,
      at: background,
      w: sceneWidth,
      h: sceneHeight
    });
    addchar2acter("game_frame.png", {
      x: -2,
      y: 5,
      at: background,
      'callback': function(char2) {
        return char2.setScale(0.95, 0.9);
      }
    });
    title1 = addchar2acter("title_1.png", {
      x: -225,
      y: -260,
      at: background,
      'callback': function(char2) {
        return char2.setScale(0.4);
      }
    });
    menu2bg = addchar2acter("replay.png", {
      absolute: true,
      x: sceneCenterX,
      y: sceneCenterY+40,
      at: background
    });
    menu2 = addchar2acter("menu-replay.png", {
      absolute: true,
      x: sceneCenterX,
      y: sceneCenterY+40,
      at: background
    });
    bubble = addchar2acter("scorebg.png", {
      x: sceneCenterX,
      y: sceneCenterY-100,
      at: background,
      absolute: true
    });
    scoreLabel = new lime.Label;
    scoreLabel.setText(score.getScore()).setPosition(bubble.position_.x + 10, bubble.position_.y + 40).setFontColor('red').setFontSize(45);
    menu2.domClassName = goog.getCssName('lime-button');
    goog.events.listen(menu2, ['click', 'touchstart'], function() {
      return game.intro();
    });
    scene.appendChild(background);
    scene.appendChild(scoreLabel);
    return scene;
  };

  this.game = game;

  goog.exportSymbol('game.start', game.start);

return game;
}
