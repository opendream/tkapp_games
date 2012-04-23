//set main namespace
goog.provide('shadow');


//get requirements
goog.require('lime.Director');
goog.require('lime.Scene');
goog.require('lime.Layer');
goog.require('lime.Circle');
goog.require('lime.Label');
goog.require('lime.GlossyButton');
goog.require('lime.animation.Spawn');
goog.require('lime.animation.FadeTo');
goog.require('lime.animation.ScaleTo');
goog.require('lime.animation.MoveBy');
goog.require('lime.animation.MoveTo');
goog.require('lime.animation.Easing');
goog.require('lime.animation.KeyframeAnimation');
goog.require('lime.audio.Audio');

	var callbackFactory, choiceAmount = 3;

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
			shadowID: "A",
			shadow: "",
			noneshadow: "char1.png"
		},
		{
			shadowID: "B",
			shadow: "",
			noneshadow: "char2.png"
		},
		{
			shadowID: "C",
			shadow: "",
			noneshadow: "char3.png"
		},
		{
			shadowID: "D",
			shadow: "",
			noneshadow: "char4.png"
		},
		{
			shadowID: "E",
			shadow: "",
			noneshadow: "char5.png"
		},
		{
			shadowID: "F",
			shadow: "",
			noneshadow: "char6.png"
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
	        return IconItemArray[0];
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
shadow.start = function() {
	var director = new lime.Director(document.body, 800, 600),
        sceneIntro = new lime.Scene(),
		sceneLevel = new lime.Scene(),
        sceneEasyPlay = new lime.Scene(),
		sceneHardPlay = new lime.Scene(),
		sceneScore = new lime.Scene(),
		sprite = new lime.Sprite(),
		score = 0,
		
		setupIntro = function(scene) {
			var background = new lime.Layer().setSize(sceneWidth,sceneHeight).setPosition(0,0),
				border = new lime.Sprite().setAnchorPoint(0, 0).setFill(imagePath + "border.png").setPosition(0, 0),
				sky = new lime.Sprite().setAnchorPoint(0, 0).setFill(imagePath + "sky.bmp").setSize(sceneWidth-50,sceneHeight-50).setPosition(25, 20),
				startButton = new lime.Sprite(),
				gameName = new lime.Sprite().setFill(imagePath + "gamename.png").setPosition(sceneCenterX,100),
				engGamename = new lime.Sprite().setFill(imagePath + "engGamename.png").setPosition(sceneCenterX,200),
				tree1 = new lime.Sprite().setFill(imagePath + "tree1.png").setPosition(90,430),
				tree2 = new lime.Sprite().setFill(imagePath + "tree2.png").setPosition(650,420),
				tree3 = new lime.Sprite().setFill(imagePath + "tree3.png").setPosition(400,500),
				boy = new lime.Sprite().setFill(imagePath + "boyBG.png").setPosition(600,450),
				girl = new lime.Sprite().setFill(imagePath + "girlBG.png").setPosition(280,430),
				doll = new lime.Sprite().setFill(imagePath + "doll.png").setOpacity(0.1),
				dollShadow = new lime.Sprite().setFill(imagePath + "dollShadow.png"),
				dollLayer = new lime.Layer();
				
			startButton.domClassName = goog.getCssName('lime-button');
			startButton
				.setFill(imagePath + "startButton.png")
				.setPosition(sceneCenterX, 260);
			
			//add Background to intro screen
			
			dollLayer.setSize(134, 133).setPosition(sceneCenterX, sceneCenterY + 80).setScale(0.9);
			dollLayer
				.appendChild(dollShadow)
				.appendChild(doll);
			
			background
				.appendChild(sky)
				.appendChild(tree3)
				.appendChild(tree1)
				.appendChild(tree2)
				.appendChild(boy)
				.appendChild(girl)
				.appendChild(border)
				.appendChild(startButton)
				.appendChild(gameName)
				.appendChild(engGamename)
				.appendChild(dollLayer);
			
			//add Character to intro screen
			
			scene.appendChild(background);
			
			//begin Button
			
			background.appendChild(startButton);
			
			goog.events.listen(startButton,['click', 'touchstart'], function (e){
				setupLevelScene(sceneLevel);
				director.replaceScene(sceneLevel);	
			});
		},
		
		setupLevelScene = function (scene){
			var background = new lime.Layer().setSize(sceneWidth,sceneHeight).setPosition(0,0),
				border = new lime.Sprite().setAnchorPoint(0, 0).setFill(imagePath + "border.png").setPosition(0, 0),
				sky = new lime.Sprite().setAnchorPoint(0, 0).setFill(imagePath + "sky.bmp").setSize(sceneWidth-50,sceneHeight-50).setPosition(25, 20),
				gameName = new lime.Sprite().setFill(imagePath + "gamename.png").setPosition(sceneCenterX,100),
				engGamename = new lime.Sprite().setFill(imagePath + "engGamename.png").setPosition(sceneCenterX,200),
				tree1 = new lime.Sprite().setFill(imagePath + "tree1.png").setPosition(90,430).setOpacity(0.2),
				tree2 = new lime.Sprite().setFill(imagePath + "tree2.png").setPosition(650,420).setOpacity(0.2),
				tree3 = new lime.Sprite().setFill(imagePath + "tree3.png").setPosition(400,500).setOpacity(0.2),
				boy = new lime.Sprite().setFill(imagePath + "boyBG.png").setPosition(600,450).setOpacity(0.1),
				girl = new lime.Sprite().setFill(imagePath + "girlBG.png").setPosition(280,430).setOpacity(0.1),
				easyButtonLayer = new lime.Layer().setSize(303, 80).setPosition(sceneCenterX,sceneCenterY),
				hardButtonLayer = new lime.Layer().setSize(303, 80).setPosition(sceneCenterX, sceneCenterY + 90),
				blueButton1 = new lime.Sprite().setFill(imagePath + "blueButton.png"),
				blueButton2 = new lime.Sprite().setFill(imagePath + "blueButton.png"),
				easyText = new lime.Sprite().setFill(imagePath + "level1.png"),
				hardText = new lime.Sprite().setFill(imagePath + "level2.png");
			
			easyButtonLayer.domClassName = goog.getCssName('lime-button');
			easyButtonLayer
				.appendChild(blueButton1)
				.appendChild(easyText);
				
			hardButtonLayer.domClassName = goog.getCssName('lime-button');
			hardButtonLayer
				.appendChild(blueButton2)
				.appendChild(hardText);
			
			//add Background to intro screen
			
			background
				.appendChild(sky)
				.appendChild(tree3)
				.appendChild(tree1)
				.appendChild(tree2)
				.appendChild(boy)
				.appendChild(girl)
				.appendChild(border)
				.appendChild(gameName)
				.appendChild(engGamename)
				.appendChild(easyButtonLayer)
				.appendChild(hardButtonLayer);
			
			//add Character to intro screen
			
			scene.appendChild(background);
			
			goog.events.listen(easyButtonLayer, ['click','touchstart'], function (e){
				setupEasyGame(sceneEasyPlay);
				director.replaceScene(sceneEasyPlay);
			});
			
			goog.events.listen(hardButtonLayer, ['click', 'touchstart'], function (e){
				console.log("Under Construction");
			});
		},
		
		setupEasyGame = function (scene) {
			var background = new lime.Layer().setSize(sceneWidth,sceneHeight).setPosition(0,0),
				border = new lime.Sprite().setAnchorPoint(0, 0).setFill(imagePath + "border.png").setPosition(0, 0),
				sky = new lime.Sprite().setAnchorPoint(0, 0).setFill(imagePath + "sky.bmp").setSize(sceneWidth-50,sceneHeight-50).setPosition(25, 20),
				gameName = new lime.Sprite().setFill(imagePath + "gamename.png").setPosition(230,50).setScale(0.6),
				tree1 = new lime.Sprite().setFill(imagePath + "tree1.png").setPosition(90,430).setOpacity(0.2),
				tree2 = new lime.Sprite().setFill(imagePath + "tree2.png").setPosition(650,420).setOpacity(0.2),
				tree3 = new lime.Sprite().setFill(imagePath + "tree3.png").setPosition(400,500).setOpacity(0.2),
				boy = new lime.Sprite().setFill(imagePath + "boyBG.png").setPosition(600,450).setOpacity(0.1),
				girl = new lime.Sprite().setFill(imagePath + "girlBG.png").setPosition(280,430).setOpacity(0.1),
				tv = new lime.Sprite().setFill(imagePath + "tv.png").setPosition(sceneCenterX,sceneCenterY-30),
				timer = new lime.Sprite().setFill(imagePath + "timer.png").setPosition(700,100),
				timerLabel = new lime.Label()
					.setSize(50,60)
					.setFontSize(30)
					.setPosition(timer.getPosition().x, timer.getPosition().y + 30)
					.setFontColor('#000'),
				allChoice,problem,count = 0,
				generateProblem = function (){
					var randomX = Math.floor(Math.random()*450) + 120;
						randomY = Math.floor(Math.random()*150) + 200;
						randomManager = randomItemManager();
						shadowProblem = randomManager.getItem();
						problemShadow = new lime.Sprite().setFill(imagePath + shadowProblem.noneshadow).setPosition(randomX, randomY).setScale(0.5)
					return problemShadow;
				},
				buildChoice = function () {
					var buildChoiceAnswer = function (imageName, isCorrect){
						var answerLayer = new lime.Layer(),
							wood = new lime.Sprite().setFill(imagePath + "woodborder.bmp").setScale(0.8),
							choiceImage = new lime.Sprite().setFill(imagePath + imageName).setScale(0.3),
							isCorrect,tmp;
							
						answerLayer.domClassName = goog.getCssName('lime-button');
						
						answerLayer
							.appendChild(wood)
							.appendChild(choiceImage)
							.setSize(139, 117);
							
						!function(localLayer) {
							goog.events.listen(localLayer, ['click', 'touchstart'], function (e){
								if(isCorrect){
									console.log("correct");
									score += 5;
									++count;
									if (count >= 3)
										choiceAmount = 4;
									scene
										.removeChild(problemShadow)
										.removeChild(choiceLabel);
									problem = generateProblem();
									allChoice = generateChoice(choiceAmount);
									choiceLabel = buildChoice();
									scene
										.appendChild(problemShadow)
										.appendChild(choiceLabel);
								}else {
									console.log("incorrect");
								}
							});
						}(answerLayer)
						
						return answerLayer;
					}; 
					
					var choiceLabel = new lime.Node();
					
					var startPosX = gap = 200;
					if(choiceAmount == 4){
						startPosX = 220;
						gap = 150;
					}
						var posX = sceneCenterX - startPosX;
						allChoice.forEach (function (element, index, array){
							isCorrect = (shadowProblem.shadowID == element.shadowID);
							tmp = buildChoiceAnswer(element.noneshadow, isCorrect);
							tmp.setPosition(posX, sceneCenterY + 210);

							choiceLabel.appendChild(tmp);	
							posX = posX + gap;
						});
					
					
					return choiceLabel;
				},
				generateChoice = function (c){
					var allChoiceTMP;
					while(true){
						var exist = false;
						randomManager2 = randomItemManager();
						allData = randomManager2.getAll();
						allChoiceTMP = goog.array.slice(allData,0,c);

						allChoiceTMP.forEach (function (element, index, array){
							if (element.shadowID === shadowProblem.shadowID){
								exist = true;
							}
						});

						if(exist === true)
							break;
					}

					for(var i=0; i<3; ++i){
						goog.array.shuffle(allChoiceTMP);
					}
					
					return allChoiceTMP;
				}
				
				background
					.appendChild(sky)
					.appendChild(tree3)
					.appendChild(tree1)
					.appendChild(tree2)
					.appendChild(boy)
					.appendChild(girl)
					.appendChild(tv)
					.appendChild(timer)
					.appendChild(border)
					.appendChild(gameName)
					
				problem = generateProblem();
				allChoice = generateChoice(3);
				choiceLabel = buildChoice();
				
				timerManager({
			      limit: 30,
			      delay: 1000,
			      limeScope: callbackFactory,
			      runningCallback: function(rt) {
			        return timerLabel.setText(rt);
			      },
			      timeoutCallback: function(rt) {
			        timerLabel.setText("0 ");
			        lime.scheduleManager.unschedule(callbackFactory.timer, callbackFactory);
			        console.log("Game Ended --> Score is: " + score);
					setupScoreScene(sceneScore);
					director.replaceScene(sceneScore);
			      }
			    })
				
				scene
					.appendChild(background)
					.appendChild(problemShadow)
					.appendChild(choiceLabel)
					.appendChild(timerLabel);
		},
		setupHardGame = function (scene) {
			var background = new lime.Layer().setSize(sceneWidth,sceneHeight).setPosition(0,0),
				border = new lime.Sprite().setAnchorPoint(0, 0).setFill(imagePath + "border.png").setPosition(0, 0),
				sky = new lime.Sprite().setAnchorPoint(0, 0).setFill(imagePath + "sky.bmp").setSize(sceneWidth-50,sceneHeight-50).setPosition(25, 20),
				gameName = new lime.Sprite().setFill(imagePath + "gamename.png").setPosition(230,50).setScale(0.6),
				tree1 = new lime.Sprite().setFill(imagePath + "tree1.png").setPosition(90,430).setOpacity(0.2),
				tree2 = new lime.Sprite().setFill(imagePath + "tree2.png").setPosition(650,420).setOpacity(0.2),
				tree3 = new lime.Sprite().setFill(imagePath + "tree3.png").setPosition(400,500).setOpacity(0.2),
				boy = new lime.Sprite().setFill(imagePath + "boyBG.png").setPosition(600,450).setOpacity(0.1),
				girl = new lime.Sprite().setFill(imagePath + "girlBG.png").setPosition(280,430).setOpacity(0.1),
				tv = new lime.Sprite().setFill(imagePath + "tv.png").setPosition(sceneCenterX,sceneCenterY-30),
				timer = new lime.Sprite().setFill(imagePath + "timer.png").setPosition(700,100),
				timerLabel = new lime.Label()
					.setSize(50,60)
					.setFontSize(30)
					.setPosition(timer.getPosition().x, timer.getPosition().y + 30)
					.setFontColor('#000'),
				allChoice,problem1,problem2,count = 0,
				generateProblem = function (){
					var randomX = Math.floor(Math.random()*450) + 120;
						randomY = Math.floor(Math.random()*150) + 200;
						randomManager = randomItemManager();
						shadowProblem = randomManager.getItem();
						problemShadow = new lime.Sprite().setFill(imagePath + shadowProblem.noneshadow).setPosition(randomX, randomY).setScale(0.5)
					return problemShadow;
				},
				buildChoice = function () {
					var buildChoiceAnswer = function (imageName, isCorrect){
						var answerLayer = new lime.Layer(),
							wood = new lime.Sprite().setFill(imagePath + "woodborder.bmp").setScale(0.8),
							choiceImage = new lime.Sprite().setFill(imagePath + imageName).setScale(0.3),
							isCorrect,tmp;
							
						answerLayer.domClassName = goog.getCssName('lime-button');
						
						answerLayer
							.appendChild(wood)
							.appendChild(choiceImage)
							.setSize(139, 117);
							
						!function(localLayer) {
							goog.events.listen(localLayer, ['click', 'touchstart'], function (e){
								if(isCorrect){
									console.log("correct");
									score += 5;
									++count;
									if (count >= 3)
										choiceAmount = 4;
									scene
										.removeChild(problemShadow)
										.removeChild(choiceLabel);
									problem = generateProblem();
									allChoice = generateChoice(choiceAmount);
									choiceLabel = buildChoice();
									scene
										.appendChild(problemShadow)
										.appendChild(choiceLabel);
								}else {
									console.log("incorrect");
								}
							});
						}(answerLayer)
						
						return answerLayer;
					}; 
					
					var choiceLabel = new lime.Node();
					
					var startPosX = gap = 200;
					if(choiceAmount == 4){
						startPosX = 220;
						gap = 150;
					}
						var posX = sceneCenterX - startPosX;
						allChoice.forEach (function (element, index, array){
							isCorrect = (shadowProblem.shadowID == element.shadowID);
							tmp = buildChoiceAnswer(element.noneshadow, isCorrect);
							tmp.setPosition(posX, sceneCenterY + 210);

							choiceLabel.appendChild(tmp);	
							posX = posX + gap;
						});
					
					
					return choiceLabel;
				},
				generateChoice = function (c){
					var allChoiceTMP;
					while(true){
						var exist = false;
						randomManager2 = randomItemManager();
						allData = randomManager2.getAll();
						allChoiceTMP = goog.array.slice(allData,0,c);

						allChoiceTMP.forEach (function (element, index, array){
							if (element.shadowID === shadowProblem.shadowID){
								exist = true;
							}
						});

						if(exist === true)
							break;
					}

					for(var i=0; i<3; ++i){
						goog.array.shuffle(allChoiceTMP);
					}
					
					return allChoiceTMP;
				}
				
				background
					.appendChild(sky)
					.appendChild(tree3)
					.appendChild(tree1)
					.appendChild(tree2)
					.appendChild(boy)
					.appendChild(girl)
					.appendChild(tv)
					.appendChild(timer)
					.appendChild(border)
					.appendChild(gameName)
					
				problem1 = generateProblem();
				problem2 = generateProblem();
				allChoice = generateChoice(3);
				choiceLabel = buildChoice();
				
				timerManager({
			      limit: 60,
			      delay: 1000,
			      limeScope: callbackFactory,
			      runningCallback: function(rt) {
			        return timerLabel.setText(rt);
			      },
			      timeoutCallback: function(rt) {
			        timerLabel.setText("0 ");
			        lime.scheduleManager.unschedule(callbackFactory.timer, callbackFactory);
			        console.log("Game Ended --> Score is: " + score);
					setupScoreScene(sceneScore);
					director.replaceScene(sceneScore);
			      }
			    })
				
				scene
					.appendChild(background)
					.appendChild(problem1)
					.appendChild(problem2)
					.appendChild(choiceLabel)
					.appendChild(timerLabel);
		},
		setupScoreScene = function (scene) {
			var background = new lime.Layer().setSize(sceneWidth,sceneHeight).setPosition(0,0),
				border = new lime.Sprite().setAnchorPoint(0, 0).setFill(imagePath + "border.png").setPosition(0, 0),
				sky = new lime.Sprite().setAnchorPoint(0, 0).setFill(imagePath + "sky.bmp").setSize(sceneWidth-50,sceneHeight-50).setPosition(25, 20),
				gameName = new lime.Sprite().setFill(imagePath + "gamename.png").setPosition(230,50).setScale(0.6),
				tree1 = new lime.Sprite().setFill(imagePath + "tree1.png").setPosition(90,430).setOpacity(0.2),
				tree2 = new lime.Sprite().setFill(imagePath + "tree2.png").setPosition(650,420).setOpacity(0.2),
				tree3 = new lime.Sprite().setFill(imagePath + "tree3.png").setPosition(400,500).setOpacity(0.2),
				boy = new lime.Sprite().setFill(imagePath + "boyBG.png").setPosition(600,450).setOpacity(0.1),
				girl = new lime.Sprite().setFill(imagePath + "girlBG.png").setPosition(280,430).setOpacity(0.1),
				tv = new lime.Sprite().setFill(imagePath + "tv.png").setPosition(sceneCenterX,sceneCenterY-30),
				bless = new lime.Label().setText("เก่งมากจ้ะ").setFontSize(32).setPosition(sceneCenterX - 50, sceneCenterY - 50),
				getScoreLabel = new lime.Label().setText("หนูทำได้    " + score + "    คะแนน").setFontSize(32).setPosition(sceneCenterX - 50, sceneCenterY);
			
				background
					.appendChild(sky)
					.appendChild(tree3)
					.appendChild(tree1)
					.appendChild(tree2)
					.appendChild(boy)
					.appendChild(girl)
					.appendChild(tv)
					.appendChild(border)
					.appendChild(gameName);
					
				scene
					.appendChild(background)
					.appendChild(bless)
					.appendChild(getScoreLabel);
		}
		
	// set up intro layer
    setupIntro(sceneIntro);

	// set current scene active
	//director.replaceScene(sceneIntro);
	
	setupHardGame(sceneHardPlay);
	director.replaceScene(sceneHardPlay);
}


//this is required for outside access after code is compiled in ADVANCED_COMPILATIONS mode
goog.exportSymbol('shadow.start', shadow.start);
