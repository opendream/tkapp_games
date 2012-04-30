(function() {
  var clickSound, IconItem, IconText, addCharacter, blockPattern, blockPatternHard, buildSetOfAnimation, callbackFactory, sceneCenterX, sceneCenterY, sceneHeight, sceneWidth, spawnQuestionAndAnswer, startTimer;

  goog.provide('pointConnect');

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

  this.allScenes = [];

  pointConnect.isGameEnded = false;

  this.score = (function() {
    var add, getScore, reset, _score;
    _score = 0;
    add = function() {
      _score+=5;
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



  addCharacter = function(image, opts) {
    var character, height, posX, posY, weight, width;
    character = new lime.Sprite;
    character.setFill("assets/images/" + image);
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
    if ((opts.x != null) && (opts.y != null)) character.setPosition(posX, posY);
    if ((opts.w != null) && (opts.h != null)) character.setSize(width, height);
    opts.at.appendChild(character, weight);
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



  pointConnect.start = function() {
    var scene;
    pointConnect.director = new lime.Director(document.body, sceneWidth, sceneHeight);
    try {
      this.theme = new lime.audio.Audio("assets/sound/theme-song.mp3");
      this.theme.baseElement.loop = true;

    } catch (e) {
      if (typeof console !== "undefined" && console !== null) {
        if (typeof console.log === "function") console.log(e);
      }
    }
    return scene = pointConnect.intro();
  };
  pointConnect.stop = function() { 
      this.theme.stop();
      lime.scheduleManager.unschedule(callbackFactory.timer, callbackFactory);
  };
  pointConnect.intro = function() {
    var background, btnStart, btnState1, btnState2, scene;
    pointConnect.isGameEnded = false;
    this.allScenes = [];
    scene = new lime.Scene;
    allScenes.push(scene);
    background = new lime.Layer;
    var gameNameSound = new lime.audio.Audio("assets/sound/gamename.mp3");
    lime.scheduleManager.callAfter(function(){gameNameSound.play()}, gameNameSound, 500)
    //this.gameNameSound = new lime.audio.Audio("assets/sound/gamename.mp3");
    //this.gameNameSound.play();
    scene.appendChild(background);
    addCharacter("scene_bg.png", {
      x: 2,
      y: 10,
      at: background,
      callback: function(char) {
        return char.setScale(0.8);
      }
    });

    var _arrow = addCharacter("arrow.png", {
      x: 200,
      y: 140,
      at: background,
      callback: function(char) {
        return char.setScale(0.9);
      }
    });
    var click = new lime.Label().setFontSize(23).setFontColor("#FFF").setText("CLICK").setPosition(sceneWidth*0.73,sceneHeight*0.73);
    background.appendChild(click);

    addCharacter("game_bg.png", {
      x: 0,
      y: 0,
      at: background,
      w: sceneWidth,
      h: sceneHeight
    });
    addCharacter("game_frame.png", {
      x: -2,
      y: 5,
      at: background,
      callback: function(char) {
        return char.setScale(0.95, 0.9);
      }
    });
    
 

    btnState1 = new lime.Sprite().setFill('assets/images/btn_start_normal.png');
    btnState2 = new lime.Sprite().setFill('assets/images/btn_start_active.png');
    btnStart = new lime.Button(btnState1, btnState2).setPosition(sceneCenterX + 140, sceneCenterY + 200).setScale(0.9);
    background.appendChild(btnStart);
    pointConnect.director.replaceScene(scene);
    _arrow.domClassName = goog.getCssName('lime-button');
    clickSound = new lime.audio.Audio("assets/sound/click.mp3");

    goog.events.listen(_arrow, ['click', 'touchstart'], function() {
      clickSound.play();
      return pointConnect.secondScene();
    });
    goog.events.listen(click, ['click', 'touchstart'], function() {
      clickSound.play();
      return pointConnect.secondScene();
    });
    return goog.events.listen(btnStart, ['click', 'touchstart'], function() {
      clickSound.play();
      return pointConnect.secondScene();
    });
  };


  pointConnect.secondScene = function() {
    var background, clock, col, questionLayer, scene, helperCount,frame,wrongPicture,rightPicture,pic1,pic2;
    scene = new lime.Scene;
    allScenes.push(scene);
    background = new lime.Layer;
    this.theme.play();
    scene.appendChild(background);

    addCharacter("sky.png", {
      x: 0,
      y: 0,
      at: background,
      w: sceneWidth,
      h: sceneHeight
    });
     addCharacter("game_bg.png", {
      x: 0,
      y: 0,
      at: background,
      w: sceneWidth,
      h: sceneHeight
    });
    addCharacter("game_frame.png", {
      x: -2,
      y: 5,
      at: background,
      callback: function(char) {
        return char.setScale(0.95, 0.9);
      }
    });  
    clock = addCharacter("clock.png", {
      x: sceneWidth-80,
      y: 100,
      absolute: true,
      at: background,
      name: 'Clock',
    });
    gameLabel = addCharacter("title_1.png",{
      absolute : true,
      x: 30,
      y: 10,
      at: background,
      w:200,
      h:50,
    });
    //gameLabel.setScale(0.8)
    //GAME SECTION
    //Question
    
    var questions = [
    {
      label:[['a','b','c','d','e','f','g','h','i','j','k','l'],['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o']],
      position:[
                [
                   {x:113.21243523316059,y:221.50259067357513},
                   {x:144.300518134715,y:187.3056994818653},
                   {x:181.6062176165803,y:160.88082901554407},
                   {x:155.18134715025906,y:146.89119170984458},
                   {x:131.86528497409324,y:118.9119170984456},
                   {x:125.64766839378234,y:84.71502590673575},
                   {x:133.41968911917098,y:45.85492227979276},
                   {x:162.95336787564764,y:16.32124352331607},
                   {x:200.25906735751295,y:6.9948186528497445},
                   {x:234.45595854922277,y:11.658031088082907},
                   {x:263.9896373056995,y:25.647668393782396},
                   {x:231.34715025906735,y:34.97409326424872}
                ],[
                   {x:203.1664212076583,y:78.86597938144331}
                  ,{x:234.0942562592047,y:44.4035346097202}
                  ,{x:273.85861561119293,y:35.56701030927837}
                  ,{x:295.0662739322533,y:70.91310751104567}
                  ,{x:288.880706921944,y:125.69955817378502}
                  ,{x:250.88365243004415,y:159.27835051546396}
                  ,{x:200.51546391752578,y:161.92930780559647}
                  ,{x:196.980854197349,y:173.41678939617088}
                  ,{x:207.58468335787921,y:183.1369661266569}
                  ,{x:196.09720176730485,y:196.3917525773196}
                  ,{x:194.3298969072165,y:242.3416789396171}
                  ,{x:214.6539027982327,y:252.0618556701031}
                  ,{x:204.93372606774665,y:266.20029455081004}
                  ,{x:145.72901325478642,y:263.5493372606775}
                  ,{x:90.9425625920471,y:244.10898379970547}
                ],[
                   {x:410.8247422680413,y:183.1369661266569}
                  ,{x:405.52282768777616,y:211.4138438880707}
                  ,{x:396.6863033873343,y:229.0868924889544}
                  ,{x:376.3622974963181,y:239.69072164948454}
                  ,{x:336.5979381443299,y:191.97349042709868}
                  ,{x:326.87776141384387,y:224.66863033873346}
                  ,{x:318.0412371134021,y:217.59941089837997}
                  ,{x:319.80854197349043,y:251.1782032400589}
                  ,{x:276.5095729013255,y:237.03976435935203}
                  ,{x:287.99705449189986,y:251.1782032400589}
                  ,{x:267.67304860088365,y:256.48011782032404}
                  ,{x:289.7643593519882,y:262.6656848306333}
                ]
      ],
      before:"assets/images/problems/2b.png",
      after:"assets/images/problems/2c.png",
      gameLabel:['a','b','c']
    },
    // {
    //   label:['a','b','c','d','e'],
    //   position:[[{x:0,y:0},{x:100,y:50},{x:100,y:100},{x:100,y:150},{x:100,y:200}],[{x:0,y:0},{x:50,y:50},{x:100,y:100},{x:150,y:150},{x:200,y:200}]],
    //   before:"assets/images/problems/1b.png",
    //   after:"assets/images/problems/1c.png",
    //   gameLabel:['a','b','c']
    // }
    ];
    
    function getPoint(x,y,i){
        var outterSize = 60;
        var innerSize = 7;
        var pointLabel = new lime.Label().setText(questions[order[queueIndex]]["label"][randomIndex][i]).setSize(innerSize,innerSize).setPosition(x,y-20).setFontColor("#3355ff").setFontSize(10);
        var thePoint = new lime.Circle().setSize(innerSize,innerSize).setFill('#3355ff').setPosition(x,y);
        var pointLayer = new lime.Layer();
        //pointLayer.appendChild(pointCover);
        pointLayer.appendChild(thePoint);
        pointLayer.appendChild(pointLabel);
        return {
            point : pointLayer
            ,
            //cover : pointCover
        }
    }

    function line(size, x1, y1, x2, y2){ 
        var dx = Math.abs(x2-x1); 
        var dy = Math.abs(y2-y1); 
        var width = Math.sqrt(dx*dx+dy*dy)+size; 
        return new lime.Sprite().setSize(width, size).setAnchorPoint(size/2/width, .5).setRotation(-Math.atan2(y2-y1, x2-x1)*180/Math.PI).setPosition(x1, y1); 
    } 
    var randomIndex
    var questionManager = function(num){

        var pointIndex = 0;
        var question = questions[num];
        randomIndex =  Math.floor(Math.random() * question["position"].length);
        console.log("question[position].length",question["position"].length)
        console.log("randomIndex",randomIndex);
        var questionLength = question["position"][randomIndex].length
        return {
            dragged : function(){
                pointIndex++
            },
            question : question,
            length : questionLength,
            beforeImage : question["before"],
            afterImage : question["after"],
            startPoint : function(){
                return question["position"][randomIndex][pointIndex];
            },
            endPoint : function(){
                if(pointIndex<questionLength)
                    return question["position"][randomIndex][pointIndex+1];
                else
                    return false;
            },
            isEnd : function(){
                 if(pointIndex==questionLength-1)
                    return true
                 else
                    return true
            },
            positionList : question["position"]
        }
    }
    var queueIndex
    var order
    var gameManager = function(){
        queueIndex = 0;
        var questionsLength = questions.length
        order = []
        while(order.length < questionsLength){
            var randomnumber=Math.floor(Math.random() * questionsLength);
            var found=false;
            for(var i=0;i<order.length;i++){
              if(order[i]==randomnumber){found=true;break}
            }
            if(!found)order[order.length]=randomnumber;
        }

        return {
            getQuestionManager : function(){
                return questionManager(order[queueIndex]);
            },
            nextQuestion : function(){
                    queueIndex++;
            },
            noGame : function(){
                if(queueIndex >= questionsLength)
                    return true
                else
                    return false
            }
        }
    }

    var thisGame = gameManager();
    var base_x = 150;
    var base_y = 150;
    var points,lines
    var gameLayer = new lime.Layer();
    var thisQuestion
    var afterImage
    var makeGame = function(){
        points = new Array()
        lines = new Array()
        gameLayer = new lime.Layer();



        if(!thisGame.noGame())
          thisQuestion = thisGame.getQuestionManager()
        else 
          return
        beforeImage = new lime.Sprite().setFill(thisQuestion.beforeImage).setPosition(base_x,base_y).setAnchorPoint(0,0).setOpacity(1);
        afterImage = new lime.Sprite().setFill(thisQuestion.afterImage).setPosition(base_x,base_y).setAnchorPoint(0,0).setOpacity(0.5);
        gameLayer.appendChild(beforeImage);
        gameLayer.appendChild(afterImage);
        //console.log(thisQuestion.length,thisQuestion.beforeImage,thisQuestion.afterImage,thisQuestion.startPoint(),thisQuestion.endPoint())
        //Draw
        var positionList = thisQuestion.positionList
        var lineSize = 3
        //var freeLines = new Array()
        console.log("Drawing Phase")
        //EXTRA LINE
        for(var i = 0 ; i < positionList.length ; i++){
            !function(i){
              if(i!=randomIndex){
                  for(var j = 0 ; j <positionList[i].length ; j++){
                        !function(i,j){
                              var xPos = positionList[i][j].x+base_x;
                              var yPos = positionList[i][j].y+base_y;
                              if(j < positionList[i].length - 1){
                                    var xPosNext = positionList[i][j+1].x+base_x;
                                    var yPosNext = positionList[i][j+1].y+base_y;
                                    //console.log(xPos,yPos,xPosNext,yPosNext)
                                    gameLayer.appendChild(line(lineSize,xPos,yPos,xPosNext,yPosNext).setFill('#000'))
                              }
                        }(i,j)
                  }
              }
            }(i)
        }
        //
        for(var i = 0 ; i < positionList[randomIndex].length ; i++ ){
            !function(i){
                var xPos = positionList[randomIndex][i].x+base_x;
                var yPos = positionList[randomIndex][i].y+base_y;
                
                points.push(getPoint(xPos,yPos,i))

                if(i < positionList[randomIndex].length - 1 ){

                    var xPosNext = positionList[randomIndex][i+1].x+base_x;
                    var yPosNext = positionList[randomIndex][i+1].y+base_y;
                    !function(i){
                        lines.push(line(lineSize,xPos,yPos,xPosNext,yPosNext).setFill('#000').setOpacity(0));
                        gameLayer.appendChild(lines[i]);
                    }(i)
                }

                gameLayer.appendChild(points[i].point)
                //console.log(positionList[randomIndex][i].x,positionList[randomIndex][i].y)
            }(i)        
        }

        
        background.appendChild(gameLayer);
    }


    var insideCircle = function(num,x,y){

        checkingPoint = questions[order[queueIndex]]["position"][randomIndex][num]
        //console.log(checkingPoint.x,checkingPoint.y)
        if(x > checkingPoint.x-30 && x < checkingPoint.x+30 &&
           y > checkingPoint.y-30 && y < checkingPoint.y+30){
            return true
        }else{
            return false
        }
    }
    var questionControl = function(){
            var startIndex = 0;
            var nextIndex = 1;

                  goog.events.listen(background,['mousedown','touchstart'],function(e){
                        var clickPos = background.screenToLocal(e.screenPosition);
                        //{x:0,y:0},{}
                        console.log("{x:" + (clickPos.x-base_x) + ",y:" + (clickPos.y-base_y) + "}")
                        var startFlag = false;
                        var nextFlag = false;
                        e.swallow(['mousemove','touchmove'],function(e){
                            var pos = background.screenToLocal(e.screenPosition);
                            //console.log("x=",pos.x-base_x,"y=",pos.y-base_y);
                            for(var j = 0 ;j < thisQuestion.length ; j++){
                               !function(j){
                                     if(insideCircle(j,pos.x-base_x,pos.y-base_y)){
                                         //console.log("inside ",j)
                                         if(j == startIndex){
                                            startFlag = true
                                         }
                                         if(startFlag){
                                            if(j == nextIndex){
                                              lines[j-1].setOpacity(1);
                                               nextIndex++;
                                               score.add();
                                               if(nextIndex == thisQuestion.length){
                                                  lime.scheduleManager.callAfter(function(){nextQuestion()},gameLayer,4000)
                                               }
                                            }
                                         }
                                     }
                                }(j)
                            }
                        });
                      e.swallow(['mouseup','touchend'],function(e){
                        startIndex = nextIndex - 1;
                      })
                  });
    }

    var playGame = function(){
        score.add();
        questionControl();
    }
    var nextQuestion = function(){
        thisGame.nextQuestion();
        if(!thisGame.noGame()){ 
            background.removeChild(gameLayer)
            makeGame();
            playGame();
        }
    }
    makeGame();
    playGame();

    gameLabel.setAnchorPoint(0,0);
    pointConnect.lblTimer = new lime.Label();
    pointConnect.lblTimer.setSize(50, 50).setFontSize(40).setPosition(clock.position_.x, clock.position_.y + 20);
    pointConnect.lblTimer.setFontColor('#000');
    scene.appendChild(pointConnect.lblTimer);
    pointConnect.director.replaceScene(scene);
    return startTimer({
      limit: pointConnect.level === 'hard' ? 60 : 80,
      delay: 1000,
      limeScope: callbackFactory,
      runningCallback: function(rt) {
        return pointConnect.lblTimer.setText(rt);
      },
      timeoutCallback: function(rt) {
        pointConnect.lblTimer.setText("0 ");
        pointConnect.isGameEnded = true;
        lime.scheduleManager.unschedule(callbackFactory.timer, callbackFactory);
        scene = pointConnect.timeoutScene();
        return pointConnect.director.replaceScene(scene);
      }
    });
  };

  pointConnect.timeoutScene = function() {
    var background, changeScene, scene;
    scene = new lime.Scene;
    allScenes.push(scene);
    background = new lime.Layer;
    this.theme.stop();
    
    addCharacter("game_bg.png", {
      x: 0,
      y: 0,
      at: background,
      w: sceneWidth,
      h: sceneHeight
    });
     addCharacter("sky.png", {
      x: 0,
      y: 0,
      at: background,
      w: sceneWidth,
      h: sceneHeight
    });
    addCharacter("game_frame.png", {
      x: -2,
      y: 5,
      at: background,
      callback: function(char) {
        return char.setScale(0.95, 0.9);
      }
    });
    addCharacter("gameover.png", {
      x: 0,
      y: 0,
      at: background,
      callback: function(char) {
        char.setScale(0);
        return char.runAction(new lime.animation.ScaleTo(1.0));
      }
    });
  
    scene.appendChild(background);
    changeScene = function() {
      return pointConnect.director.replaceScene(pointConnect.lastScene());
    };
    lime.scheduleManager.scheduleWithDelay(changeScene, pointConnect, 1500, 1);
    return scene;
  };

  pointConnect.lastScene = function() {
    var background, bubble, menu, menu2, scene, scoreLabel, title1;
    scene = new lime.Scene;
    allScenes.push(scene);
    background = new lime.Layer;
    this.theme.stop();
    addCharacter("boy.png", {
      x: -230,
      y: 170,
      at: background,
      callback: function(char) {
        return char.setScale(0.8);
      }
    });
    addCharacter("girl.png", {
      x: -60,
      y: 150,
      at: background,
      callback: function(char) {
        return char.setScale(0.8);
      }
    });
 addCharacter("sky.png", {
      x: 0,
      y: 0,
      at: background,
      w: sceneWidth,
      h: sceneHeight
    });
    addCharacter("game_frame.png", {
      x: -2,
      y: 5,
      at: background,
      callback: function(char) {
        return char.setScale(0.95, 0.9);
      }
    });
    title1 = addCharacter("title_1.png", {
      x: -225,
      y: -260,
      at: background,
      callback: function(char) {
        return char.setScale(0.5);
      }
    });
    menu2bg = addCharacter("replay.png", {
      absolute: true,
      x: sceneCenterX,
      y: sceneCenterY+40,
      at: background
    });
    menu2 = addCharacter("menu-replay.png", {
      absolute: true,
      x: sceneCenterX,
      y: sceneCenterY+40,
      at: background
    });
    bubble = addCharacter("scorebg.png", {
      x: sceneCenterX,
      y: sceneCenterY-100,
      at: background,
      absolute: true
    });
    scoreLabel = new lime.Label;
    scoreLabel.setText(score.getScore()).setPosition(bubble.position_.x + 10, bubble.position_.y + 40).setFontColor('red').setFontSize(45);
    menu2.domClassName = goog.getCssName('lime-button');
    goog.events.listen(menu2, ['click', 'touchstart'], function() {
      return pointConnect.intro();
    });
    scene.appendChild(background);
    scene.appendChild(scoreLabel);
    return scene;
  };

  this.pointConnect = pointConnect;

  goog.exportSymbol('pointConnect.start', pointConnect.start);

  

}).call(this);