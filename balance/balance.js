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

var callbackFactory, correctCount = 0, score = 0;

//path 
imagePath = "assets/images/";
soundPath = "assets/sound/";
atype = navigator.userAgent.toLowerCase().match('firefox')? 'ogg': 'mp3';

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

generatePattern = function(level){
  var p;
  if(level==1){
    p = [ [0,1] ];
  }else if(level==2){
    p = [ [0,1],[1,2] ];
  }else if(level==3){
    p = [ [0,1],[1,2],[0,2] ];
  }

  for(var i = 0; i < p.length; i++){
    goog.array.shuffle(p[i]);
  }

  goog.array.shuffle(p);

  return {
    getPair: function(){
      return p;
    },
    getAll: function(){
        var result = [];
        var count = 0;
        for(var r =0; r<p.length; r++){
          for(var c=0; c<2; c++){
            result[count] = p[r][c];
            count++;
          }
        }
      return result;
    }
  };
}

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
                  setupHardGame(sceneHardPlay,function(score){
                    correctCount = 0;
                    console.log("Score hard mode: "+score);
                    setupScoreScene(sceneScore);
                    balance.director.replaceScene(sceneScore);
                  });
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

    var gameNameSound = new lime.audio.Audio(soundPath + "game_start." + atype);
    setTimeout(function () {
      gameNameSound.play();
    }, 200);

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

    scene.appendChild(background);
}

spawnAnimationWithString = function (scene,s){
  var correctSound = new lime.audio.Audio(soundPath + "game_correct." + atype);
  var incorrectSound = new lime.audio.Audio(soundPath + "game_incorrect." + atype);
  var spawnImage;
  if (s == "correct"){
    spawnImage = new lime.Sprite().setFill(imagePath + "correct.png").setScale(0.8).setPosition(sceneCenterX, sceneCenterY);
    setTimeout(function () {
          correctSound.play();
        }, 100);
  }else if (s == "incorrect"){
    spawnImage = new lime.Sprite().setFill(imagePath + "incorrect.png").setScale(0.8).setPosition(sceneCenterX, sceneCenterY);
    setTimeout(function () {
          incorrectSound.play();
        }, 100);
  }
  var spawnAnimation = new lime.animation.Sequence(
      new lime.animation.FadeTo(1).setDuration(0.5),
      new lime.animation.FadeTo(0).setDuration(0.5)
    );
  spawnImage.runAction(spawnAnimation);
  scene.appendChild(spawnImage);
}

setCorrectBalance = function(balanceItem, height){
  return balanceItem.setPosition(balanceItem.getPosition().x,balanceItem.getPosition().y+height);
}

generateProblem = function(layer, level, answerItems, balanceList, balanceBgs){
  var gamePattern = generatePattern(level).getPair();
  var answer;
  for(var i = 0; i<gamePattern.length; i++){
    var p = gamePattern[i];
    if(p[0]<p[1]){
      balanceList[i][0] = setCorrectBalance(balanceList[i][0],20);
    }else{
      balanceList[i][1] = setCorrectBalance(balanceList[i][1],20);
    }

    // check for answer
    if(p[0]==0){
      answer = answerItems[0].id;
    }else if(p[1]==0){
      answer = answerItems[0].id;
    }

    layer.appendChild(balanceBgs[i]);
    layer.appendChild(balanceList[i][0]);
    layer.appendChild(balanceList[i][1]);

    // add problem
    var problem1 = new lime.Sprite();
    problem1.setFill(imagePath+answerItems[p[0]].onBalance);
    problem1.setPosition(balanceList[i][0].getPosition().x,balanceList[i][0].getPosition().y-problem1.getSize().height/2.5);
    problem1.setScale(0.8);
    var problem2 = new lime.Sprite();
    problem2.setFill(imagePath+answerItems[p[1]].onBalance);
    problem2.setPosition(balanceList[i][1].getPosition().x,balanceList[i][1].getPosition().y-problem2.getSize().height/2.5);
    problem2.setScale(0.8);

    layer.appendChild(problem1);
    layer.appendChild(problem2);
  }
  return answer;
}

generateQuestion = function(gamePlayLayer,scene){
  // Game
  if(correctCount<5){//level 1
    // prepare
    var randItemMng = new randomItemManager();
    var generatedAnswer = [];
    var itemCount = 0, index =0;
    for(; index < 2; index++){
      generatedAnswer[itemCount++] = randItemMng.getItem();
    }

    // question
    var balanceBg = new lime.Sprite().setFill(imagePath+"balance1.png").setPosition(sceneCenterX,sceneCenterY+50).setScale(2);
    var leftBalance = new lime.Sprite().setFill(imagePath+"on_balance.png").setPosition(sceneCenterX-balanceBg.getSize().width + 10,sceneCenterY-30);
    var rightBalance = new lime.Sprite().setFill(imagePath+"on_balance.png").setPosition(sceneCenterX+balanceBg.getSize().width - 10,sceneCenterY-30);

    var balanceList = [
      [leftBalance, rightBalance]
    ];
    var balanceBgs = [balanceBg];
    answer = generateProblem(gamePlayLayer, 1, generatedAnswer, balanceList, balanceBgs);

    goog.array.shuffle(generatedAnswer);

    // answer
    var answerBar = new lime.Sprite().setFill(imagePath+"answer1.png")
    .setPosition(sceneCenterX,sceneCenterY+200);
    gamePlayLayer.appendChild(answerBar);

    for(var answerCount = 0; answerCount < itemCount; answerCount++){
      var answerBtn = new lime.Sprite().setFill(imagePath + 
        generatedAnswer[answerCount].onAnswer)
      .setPosition(sceneCenterX + (((answerCount<itemCount/2)?-1:1) * 70 )
        ,sceneCenterY+170);
      answerBtn.domClassName = goog.getCssName('lime-button');

      !function(localBtn,currentIndex,id){
        goog.events.listen(localBtn, ['click', 'touchstart'], function (e){
          if(answer == id){
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
      }(answerBtn,answerCount,generatedAnswer[answerCount].id);
  
      gamePlayLayer.appendChild(answerBtn);
    }

  }else if(correctCount<10){//level 2
    // prepare
    var randItemMng = new randomItemManager();
    var generatedAnswer = [];
    var itemCount = 0, index =0;
    for(; index < 3; index++){
      generatedAnswer[itemCount++] = randItemMng.getItem();
    }

    // question
    var balanceBg1 = new lime.Sprite().setFill(imagePath+"balance2.png").setPosition(sceneCenterX - sceneCenterX/3 - 40,sceneCenterY + 10).setScale(0.6);
    var leftBalance1 = new lime.Sprite().setFill(imagePath+"on_balance.png").setPosition(balanceBg1.getPosition().x-balanceBg1.getSize().width/2 + 85,sceneCenterY - 20).setScale(0.6);
    var rightBalance1 = new lime.Sprite().setFill(imagePath+"on_balance.png").setPosition(balanceBg1.getPosition().x+balanceBg1.getSize().width/2 - 85,sceneCenterY - 20).setScale(0.6);
    var balanceBg2 = new lime.Sprite().setFill(imagePath+"balance2.png").setPosition(sceneCenterX + sceneCenterX/3 + 40,sceneCenterY + 10).setScale(0.6);
    var leftBalance2 = new lime.Sprite().setFill(imagePath+"on_balance.png").setPosition(balanceBg2.getPosition().x-balanceBg1.getSize().width/2 + 85,sceneCenterY - 20).setScale(0.6);
    var rightBalance2 = new lime.Sprite().setFill(imagePath+"on_balance.png").setPosition(balanceBg2.getPosition().x+balanceBg1.getSize().width/2 - 85,sceneCenterY - 20).setScale(0.6);
    
    var balanceList = [
      [leftBalance1, rightBalance1],
      [leftBalance2, rightBalance2]
    ];
    var balanceBgs = [balanceBg1, balanceBg2];
    answer = generateProblem(gamePlayLayer, 2, generatedAnswer, balanceList, balanceBgs);

    goog.array.shuffle(generatedAnswer);

    // answer
    var answerBar = new lime.Sprite().setFill(imagePath+"answer2.png")
    .setPosition(sceneCenterX,sceneCenterY+150);
    gamePlayLayer.appendChild(answerBar);

    for(var answerCount = 0; answerCount < itemCount; answerCount++){
      var answerBtn = new lime.Sprite().setFill(imagePath + 
        generatedAnswer[answerCount].onAnswer)
      .setPosition( 50 + (sceneWidth/3*(answerCount+1)) - ((sceneWidth/3*(answerCount+1))/3), sceneCenterY+170);
      answerBtn.domClassName = goog.getCssName('lime-button');

      !function(localBtn,currentIndex,id){
        goog.events.listen(localBtn, ['click', 'touchstart'], function (e){
          if(answer == id){
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
      }(answerBtn,answerCount,generatedAnswer[answerCount].id);
  
      gamePlayLayer.appendChild(answerBtn);
    }
  }else{//level 3
    // prepare
    var randItemMng = new randomItemManager();
    var generatedAnswer = [];
    var itemCount = 0, index =0;
    for(; index < 3; index++){
      generatedAnswer[itemCount++] = randItemMng.getItem();
    }

    // question
    var balanceBg1 = new lime.Sprite().setFill(imagePath+"balance1.png").setPosition(sceneCenterX - sceneCenterX/3 - 40,sceneCenterY + 60).setScale(1);
    var leftBalance1 = new lime.Sprite().setFill(imagePath+"on_balance.png").setPosition(balanceBg1.getPosition().x-balanceBg1.getSize().width/2 + 5,sceneCenterY + 10).setScale(0.6);
    var rightBalance1 = new lime.Sprite().setFill(imagePath+"on_balance.png").setPosition(balanceBg1.getPosition().x+balanceBg1.getSize().width/2 - 5,sceneCenterY + 10).setScale(0.6);
    var balanceBg2 = new lime.Sprite().setFill(imagePath+"balance1.png").setPosition(sceneCenterX + sceneCenterX/3 + 40,sceneCenterY + 60).setScale(1);
    var leftBalance2 = new lime.Sprite().setFill(imagePath+"on_balance.png").setPosition(balanceBg2.getPosition().x-balanceBg2.getSize().width/2 + 5,sceneCenterY + 10).setScale(0.6);
    var rightBalance2 = new lime.Sprite().setFill(imagePath+"on_balance.png").setPosition(balanceBg2.getPosition().x+balanceBg2.getSize().width/2 - 5,sceneCenterY + 10).setScale(0.6);
    var balanceBg3 = new lime.Sprite().setFill(imagePath+"balance3.png").setPosition(sceneCenterX,sceneCenterY + 10).setScale(1.1);
    var leftBalance3 = new lime.Sprite().setFill(imagePath+"on_balance.png").setPosition(balanceBg3.getPosition().x-balanceBg3.getSize().width/2 - 5,sceneCenterY - 150).setScale(0.6);
    var rightBalance3 = new lime.Sprite().setFill(imagePath+"on_balance.png").setPosition(balanceBg3.getPosition().x+balanceBg3.getSize().width/2 + 5,sceneCenterY - 150).setScale(0.6);

    var balanceList = [
      [leftBalance1, rightBalance1],
      [leftBalance2, rightBalance2],
      [leftBalance3, rightBalance3]
    ];
    var balanceBgs = [balanceBg1, balanceBg2, balanceBg3];
    answer = generateProblem(gamePlayLayer, 3, generatedAnswer, balanceList, balanceBgs);

    goog.array.shuffle(generatedAnswer);

    // answer
    var answerBar = new lime.Sprite().setFill(imagePath+"answer2.png")
    .setPosition(sceneCenterX,sceneCenterY+150);
    gamePlayLayer.appendChild(answerBar);

    for(var answerCount = 0; answerCount < itemCount; answerCount++){
      var answerBtn = new lime.Sprite().setFill(imagePath + 
        generatedAnswer[answerCount].onAnswer)
      .setPosition( 50 + (sceneWidth/3*(answerCount+1)) - ((sceneWidth/3*(answerCount+1))/3), sceneCenterY+170);
      answerBtn.domClassName = goog.getCssName('lime-button');

      !function(localBtn,currentIndex,id){
        goog.events.listen(localBtn, ['click', 'touchstart'], function (e){
          if(answer == id){
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
      }(answerBtn,answerCount,generatedAnswer[answerCount].id);
  
      gamePlayLayer.appendChild(answerBtn);
    }
  }

  return gamePlayLayer;
}

setupEasyGame = function(scene,callbackSummaryScore){
  var themeSound = new lime.audio.Audio(soundPath + "game_play." + atype);
  var timeoutSound = new lime.audio.Audio(soundPath + "game_timeout." + atype);
  
  correctCount = 0;
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

  setTimeout(function () {
    themeSound.baseElement.loop = true;
    themeSound.play();
  }, 500);

  timerManager({
    limit: 60,
    delay: 1000,
    limeScope: callbackFactory,
    runningCallback: function(rt) {
      return timerLabel.setText(rt);
    },
    timeoutCallback: function(rt) {
      if (themeSound.isPlaying())
        themeSound.stop();

      timeoutSound.play();

      timerLabel.setText("0 ");
      lime.scheduleManager.unschedule(callbackFactory.timer, callbackFactory);
      callbackSummaryScore(score);
    }
  })

  scene.appendChild(background);
  scene.appendChild(timerLabel);
}

setupHardGame = function(scene,callbackSummaryScore){
  var themeSound = new lime.audio.Audio(soundPath + "game_play." + atype);
  var timeoutSound = new lime.audio.Audio(soundPath + "game_timeout." + atype);

  correctCount = 5;
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

  setTimeout(function () {
    themeSound.baseElement.loop = true;
    themeSound.play();
  }, 500);  

  timerManager({
    limit: 60,
    delay: 1000,
    limeScope: callbackFactory,
    runningCallback: function(rt) {
      return timerLabel.setText(rt);
    },
    timeoutCallback: function(rt) {
      if (themeSound.isPlaying())
        themeSound.stop();

      timeoutSound.play();

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
