//set main namespace
goog.provide('balance');


//get requirements
goog.require('lime.Director');
goog.require('lime.Scene');
goog.require('lime.Layer');
goog.require('lime.Circle');
goog.require('lime.Label');
goog.require('lime.GlossyButton');
goog.require('lime.animation.Sequence');
goog.require('lime.animation.Spawn');
goog.require('lime.animation.FadeTo');
goog.require('lime.animation.ScaleTo');
goog.require('lime.animation.MoveBy');
goog.require('lime.animation.MoveTo');
goog.require('lime.animation.Easing');
goog.require('lime.animation.KeyframeAnimation');
goog.require('lime.audio.Audio');

var callbackFactory, correctCount = 0, score = 0,
 balanceProperty = ["0L","0R","1L","1R","2L","2R"];

//path 
imagePath = "assets/images/";
soundPath = "assets/sound/";

//screen attributes
sceneWidth = 800;
sceneHeight = 600;
sceneCenterX = sceneWidth/2;
sceneCenterY = sceneHeight/2;

callbackFactory = {
  timer: function() {}
};

problems = [
  {
      id:"A",
      onBalance:"char1_balance.png",
      onAnswer:"char1.png"
  },
  {
      id:"B",
      onBalance:"char2_balance.png",
      onAnswer:"char2.png"
  },
  {
      id:"C",
      onBalance:"char3_balance.png",
      onAnswer:"char3.png"
  },
  {
      id:"D",
      onBalance:"char4_balance.png",
      onAnswer:"char4.png"
  },
  {
      id:"E",
      onBalance:"char5_balance.png",
      onAnswer:"char5.png"
  },
  {
      id:"F",
      onBalance:"char6_balance.png",
      onAnswer:"char6.png"
  }
];

randomItemManager = function() {
  var IconItemArray, lastGetIdx, size;
  size = goog.object.getCount(problems);
  IconItemArray = goog.object.getValues(problems);
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
      return IconItemArray[idx];
    }
  };
};

timerManager = function(opts) {
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
  (function() {
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
  return {
    addTime: function(time) {
      counter += time;
      return opts != null ? typeof opts.runningCallback === "function" ? opts.runningCallback(counter) : void 0 : void 0;
    }
  };
};

// entrypoint
balance.start = function(){

	balance.director = new lime.Director(document.body, sceneWidth, sceneHeight);
  var sceneIntro = new lime.Scene();
  var sceneLevel = new lime.Scene();
  var sceneEasyPlay = new lime.Scene();
  var sceneHardPlay = new lime.Scene();
  var sceneScore = new lime.Scene();
  var sprite = new lime.Sprite();

  var startButton = setupIntro(sceneIntro);

  goog.events.listen(startButton,['click', 'touchstart'], function (e){
      setupLevelScene(sceneLevel,
          function(btn){
              goog.events.listen(btn, ['click','touchstart'], function (){
                  setupEasyGame(sceneEasyPlay,function(score){
                    correctCount = 0;
                    console.log("Score easy mode: "+score);
                    setupScoreScene(sceneScore);
                    balance.director.replaceScene(sceneScore);
                  });
                  balance.director.replaceScene(sceneEasyPlay);
              });
          },
          function(btn){
              goog.events.listen(btn, ['click','touchstart'], function (){
                  setupHardGame(sceneHardPlay);
                  balance.director.replaceScene(sceneHardPlay);
              });
          }
      );
      balance.director.replaceScene(sceneLevel);
  });

  balance.director.replaceScene(sceneIntro);
}

setupIntro = function(scene){
    var background = new lime.Layer().setSize(sceneWidth,sceneHeight).setPosition(0,0);
    var border = new lime.Sprite().setAnchorPoint(0,0).setFill(imagePath+"border.png").setPosition(0,0);
    var gameBg = new lime.Sprite().setAnchorPoint(0,0).setFill(imagePath+"bg_game.png").setSize(sceneWidth-50,sceneHeight-50).setPosition(25,20);
    var titleTh = new lime.Sprite().setFill(imagePath+"title_1.png").setPosition(sceneCenterX,sceneCenterY+70);
    var titleEn = new lime.Sprite().setFill(imagePath+"title_2.png").setPosition(sceneCenterX,sceneCenterY+160);
    var balanceIntro = new lime.Sprite().setFill(imagePath+"balance_intro.png").setPosition(sceneCenterX,sceneCenterY).setScale(0.8);
    var startButton = new lime.Sprite();
    startButton.domClassName = goog.getCssName('lime-button');
    startButton.setFill(imagePath+"button_start.png").setPosition(sceneCenterX,sceneCenterY+210);
    var boy = new lime.Sprite().setFill(imagePath+"boy.png").setPosition(sceneCenterX-210,sceneCenterY+230);
    var girl = new lime.Sprite().setFill(imagePath+"girl.png").setPosition(sceneCenterX+210,sceneCenterY+230);

    // add background to scene

    background.appendChild(gameBg);
    background.appendChild(balanceIntro);
    background.appendChild(titleTh);
    background.appendChild(titleEn);
    background.appendChild(boy);
    background.appendChild(girl);
    background.appendChild(border);    
    background.appendChild(startButton);

    // background
    scene.appendChild(background);
    return startButton;
}

setupLevelScene = function(scene,callbackEasy,callbackHard){
    var background = new lime.Layer().setSize(sceneWidth,sceneHeight).setPosition(0,0);
    var border = new lime.Sprite().setAnchorPoint(0,0).setFill(imagePath+"border.png").setPosition(0,0);
    var gameBg = new lime.Sprite().setAnchorPoint(0,0).setFill(imagePath+"bg_game.png").setSize(sceneWidth-50,sceneHeight-50).setPosition(25,20);
    var titleTh = new lime.Sprite().setFill(imagePath+"title_1.png").setPosition(sceneCenterX,50);
    var titleEn = new lime.Sprite().setFill(imagePath+"title_2.png").setPosition(sceneCenterX,130);
    var easyButton = new lime.Layer().setSize(303, 80).setPosition(sceneCenterX,sceneCenterY);
    var hardButton = new lime.Layer().setSize(303, 80).setPosition(sceneCenterX,sceneCenterY+90);
    var greenButton1 = new lime.Sprite().setFill(imagePath+"button_green.png");
    var greenButton2 = new lime.Sprite().setFill(imagePath+"button_green.png");
    var easyText = new lime.Sprite().setFill(imagePath+"lbl_level1.png");
    var hardText = new lime.Sprite().setFill(imagePath+"lbl_level2.png");
    var boy = new lime.Sprite().setFill(imagePath+"boy.png").setPosition(80,sceneCenterY+230);
    var girl = new lime.Sprite().setFill(imagePath+"girl.png").setPosition(sceneWidth-80,sceneCenterY+230);

    easyButton.domClassName = goog.getCssName('lime-button');
    easyButton.appendChild(greenButton1).appendChild(easyText);

    hardButton.domClassName = goog.getCssName('lime-button');
    hardButton.appendChild(greenButton2).appendChild(hardText);

    // add background to scene

    background.appendChild(gameBg);
    background.appendChild(boy);
    background.appendChild(girl);
    background.appendChild(border);
    background.appendChild(titleTh);
    background.appendChild(titleEn);    
    background.appendChild(easyButton);
    background.appendChild(hardButton);

    callbackEasy(easyButton);
    callbackHard(hardButton);
    
    goog.events.listen(hardButton, ['click', 'touchstart'], function (e){
        setupHardGame(sceneHardPlay);
        director.replaceScene(sceneHardPlay);
    });

    scene.appendChild(background);
}

spawnAnimationWithString = function (scene,s){
  var spawnImage;
  if (s == "correct"){
    spawnImage = new lime.Sprite().setFill(imagePath + "correct.png").setScale(0.8).setPosition(sceneCenterX, sceneCenterY);
  }else if (s == "incorrect"){
    spawnImage = new lime.Sprite().setFill(imagePath + "incorrect.png").setScale(0.8).setPosition(sceneCenterX, sceneCenterY);
  }
  var spawnAnimation = new lime.animation.Sequence(
      new lime.animation.FadeTo(1).setDuration(0.5),
      new lime.animation.FadeTo(0).setDuration(0.5)
    );
  spawnImage.runAction(spawnAnimation);
  scene.appendChild(spawnImage);
}

setCorrectBalance = function(balanceItem){
  balanceItem.setPosition(balanceItem.getPosition().x,balanceItem.getPosition().y+30);
}

generateQuestion = function(gamePlayLayer,scene){
  // Game
  if(correctCount<5){//level 1
    // prepare
    var randItemMng = new randomItemManager();
    var generatedAnswer = {};
    var itemCount = 0, index =0;
    for(; index < 1; index++){
      generatedAnswer[balanceProperty[itemCount++]] = randItemMng.getItem();
      generatedAnswer[balanceProperty[itemCount++]] = randItemMng.getItem();
    }
    var answer = Math.floor(Math.random()*itemCount);
    // question
    var balanceBg = new lime.Sprite().setFill(imagePath+"balance1.png").setPosition(sceneCenterX,sceneCenterY+50).setScale(2);
    var leftBalance = new lime.Sprite().setFill(imagePath+"on_balance.png").setPosition(sceneCenterX-balanceBg.getSize().width + 10,sceneCenterY-30);
    var rightBalance = new lime.Sprite().setFill(imagePath+"on_balance.png").setPosition(sceneCenterX+balanceBg.getSize().width - 10,sceneCenterY-30);

    if(answer==0){
      setCorrectBalance(leftBalance);
    }else if(answer==1){
      setCorrectBalance(rightBalance);
    }

    gamePlayLayer.appendChild(balanceBg);
    gamePlayLayer.appendChild(leftBalance);
    gamePlayLayer.appendChild(rightBalance);

    // answer
    var answerBar = new lime.Sprite().setFill(imagePath+"answer1.png")
    .setPosition(sceneCenterX,sceneCenterY+200);
    gamePlayLayer.appendChild(answerBar);

    for(var answerCount = 0; answerCount < itemCount; answerCount++){
      var answerBtn = new lime.Sprite().setFill(imagePath + 
        generatedAnswer[balanceProperty[answerCount]].onAnswer)
      .setPosition(sceneCenterX + (((answerCount<itemCount/2)?-1:1) * 70 )
        ,sceneCenterY+170);
      answerBtn.domClassName = goog.getCssName('lime-button');

      !function(localBtn,currentIndex){
        goog.events.listen(localBtn, ['click', 'touchstart'], function (e){
          if(answer == currentIndex){
            spawnAnimationWithString(scene,"correct");
            correctCount++;
            score+=5;
            console.log("correct: "+score);
          }else{
            spawnAnimationWithString(scene,"incorrect");
            console.log("incorrect: "+score);
          }
          gamePlayLayer.removeAllChildren();

          // generate and added next question
          generateQuestion(gamePlayLayer,scene);
          
        });
      }(answerBtn,answerCount);
  
      gamePlayLayer.appendChild(answerBtn);
    }

  }else if(correctCount<10){//level 2

  }else{//level 3

  }

  return gamePlayLayer;
}

setupEasyGame = function(scene,callbackSummaryScore){
  score = 0;
  var background = new lime.Layer().setSize(sceneWidth,sceneHeight).setPosition(0,0);
  var border = new lime.Sprite().setAnchorPoint(0,0).setFill(imagePath+"border.png").setPosition(0,0);
  var gameBg = new lime.Sprite().setAnchorPoint(0,0).setFill(imagePath+"bg_game.png").setSize(sceneWidth-50,sceneHeight-50).setPosition(25,20);
  var titleTh = new lime.Sprite().setAnchorPoint(0,0).setFill(imagePath+"title_1.png").setPosition(60,10).setScale(0.6);    
  var timer = new lime.Sprite().setFill(imagePath + "timer.png").setPosition(700,100);
  var timerLabel = new lime.Label()
    .setSize(50,60)
    .setFontSize(30)
    .setPosition(timer.getPosition().x, timer.getPosition().y + 30)
    .setFontColor('#000');
  var playLayer = new lime.Layer().setSize(sceneWidth,sceneHeight).setPosition(0,0);

  background.appendChild(gameBg);
  background.appendChild(timer);

  generateQuestion(playLayer,scene);

  background.appendChild(playLayer);
  background.appendChild(border);
  background.appendChild(titleTh);

  timerManager({
    limit: 10,
    delay: 1000,
    limeScope: callbackFactory,
    runningCallback: function(rt) {
      return timerLabel.setText(rt);
    },
    timeoutCallback: function(rt) {
      timerLabel.setText("0 ");
      lime.scheduleManager.unschedule(callbackFactory.timer, callbackFactory);
      callbackSummaryScore(score);
    }
  })

  scene.appendChild(background);
  scene.appendChild(timerLabel);
}

setupScoreScene = function(scene){
  var background = new lime.Layer().setSize(sceneWidth,sceneHeight).setPosition(0,0);
  var border = new lime.Sprite().setAnchorPoint(0,0).setFill(imagePath+"border.png").setPosition(0,0);
  var gameBg = new lime.Sprite().setAnchorPoint(0,0).setFill(imagePath+"bg_game.png").setSize(sceneWidth-50,sceneHeight-50).setPosition(25,20);
  var titleTh = new lime.Sprite().setAnchorPoint(0,0).setFill(imagePath+"title_1.png").setPosition(60,10).setScale(0.6);    
  var girl = new lime.Sprite().setFill(imagePath+"girl.png").setPosition(sceneCenterX+200,sceneHeight- 120);
  var scoreLbl = new lime.Label().setText("หนูทำได้    " + score + "    คะแนน").setFontSize(32).setPosition(sceneCenterX - 50, sceneCenterY);
  var scoreBg = new lime.Sprite().setFill(imagePath+"bg_score.png").setPosition(sceneCenterX + 60, sceneCenterY + 20);

  background.appendChild(gameBg);
  background.appendChild(girl);
  background.appendChild(border);
  background.appendChild(titleTh);
  background.appendChild(scoreBg);
  background.appendChild(scoreLbl);

  scene.appendChild(background);
}

//this is required for outside access after code is compiled in ADVANCED_COMPILATIONS mode
goog.exportSymbol('balance.start', balance.start);
