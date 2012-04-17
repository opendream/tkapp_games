//set main namespace
goog.provide('Kamsai');


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

// entrypoint
Kamsai.start = function() {
    var director = new lime.Director(document.body, 800, 600),
        sceneIntro = new lime.Scene(),
        sceneChoice = new lime.Scene(),
		sceneScore = new lime.Scene(),
		no = 0,
		score = 0,
		sprite = new lime.Sprite(),
        text = {
            arrowText: "เริ่มทำแบบทดสอบ",
            boardText: "แบบทดสอบมีทั้งหมด 10 ข้อ",
            nextQuestion: "ข้อถัดไป",
			sumScore: "รวมคะแนนทั้งหมด",
			maxScore: "คะแนนเต็ม 10 คะแนน",
			getScoreText: "ทำได้",
			getScoreText2: "คะแนน",
			exitText: "ออก"
        },
        background = function () {
            var background = {};

            background.normal = new lime.Sprite()
                .setAnchorPoint(0, 0)
                .setPosition(0, 0)
                .setFill("assets/bg1.jpg");
			
			background.correct = new lime.Sprite()
				.setAnchorPoint(0, 0)
				.setPosition(0, 0)
				.setFill("assets/bg2.jpg");
			
			background.incorrect = new lime.Sprite()
				.setAnchorPoint(0, 0)
				.setPosition(0, 0)
				.setFill("assets/bg3.jpg");

            return background;
        },
        doctor = function () {
            var doctor = {};

            doctor.normal = new lime.Sprite()
                .setFill("assets/doctor.png")
                .setPosition(678, 425);

			doctor.correct = new lime.Sprite()
				.setFill("assets/doctor-correct.png")
				.setPosition(678, 425);
				
			doctor.incorrect = new lime.Sprite()
				.setFill("assets/doctor-wrong.png")
				.setPosition(678, 425);

            return doctor;
        },
		// scoreManager = function (score) {
		// 			var medal;
		// 			if (score >= 0 && score < 4)
		// 				medal = "assets/bronze-prize.png";
		// 			else if (score >= 4 && score < 7)
		// 				medal = "assets/silver-prize.png";
		// 			else
		// 				medal = "assets/gold-prize.png";
		// 				
		// 			return medal;
		// 		},
		setupScore = function (scene){
			var arrow = new lime.Sprite(),
				arrowText = new lime.Label(),
				bird = new lime.Sprite(),
				doctor = new lime.Sprite(),
				board = new lime.Sprite(),
				boardText = new lime.Label(),
				boardText2 = new lime.Label(),
				boardText3 = new lime.Label(),
				boardText4 = new lime.Label(),
				scoreText = new lime.Label(),
				medal = new lime.Sprite(),
				arrowLayer = new lime.Layer();
				
				//set medal
				var getMedal;
				if (score >= 0 && score < 4)
					getMedal = "assets/bronze-prize.png";
				else if (score >= 4 && score < 7)
					getMedal = "assets/silver-prize.png";
				else if (score >= 7 && score <= 10)
					getMedal = "assets/gold-prize.png";
					
				console.log(getMedal);
				
				medal
					.setFill(getMedal)
					.setPosition(270,285);
				
				// set board
	            board
	                .setFill("assets/board.png")
	                .setPosition(408, 358);

	            boardText
	                .setText(text.sumScore)
	                .setFontSize(35)
	                .setFontColor('#FFF')
	                .setPosition(400, 160);
				
				boardText2
					.setText(text.maxScore)
					.setFontSize(30)
					.setFontColor('#FFF')
					.setPosition(400, 335);
					
				boardText3
					.setText(text.getScoreText)
					.setFontSize(30)
					.setFontColor('#FFF')
					.setPosition(300,385);
				
				boardText4
					.setText(text.getScoreText2)
					.setFontSize(30)
					.setFontColor('#FFF')
					.setPosition(410,385)
						
				scoreText
					.setText(score)
					.setFontSize(30)
					.setFontColor('#FFF')
					.setPosition(350,385);

				// set doctor
				doctor
					.setFill("assets/doctor-write.png")
					.setPosition(675,395);
				
	            arrowLayer
	                .setSize(225, 99)
	                .setPosition(530, 475);

	            // set arrow
	            arrow
	                .setPosition(10, 43)
	                .setFill("assets/arrow2.png");
	            // set label
	            arrowText
	                .setText(text.exitText)
	                .setFontSize(24)
	                .setFontColor('#FFF')
	                .setPosition(10, 48);

	            // add both to layer
	            arrowLayer.domClassName = goog.getCssName('lime-button');
	            arrowLayer
	                .appendChild(arrow)
	                .appendChild(arrowText);

	            scene
	                .appendChild(background().normal)
	                .appendChild(board)
	                .appendChild(boardText)
					.appendChild(boardText2)
					.appendChild(boardText3)
					.appendChild(boardText4)
					.appendChild(scoreText)
	                .appendChild(doctor)
	                .appendChild(arrowLayer)
					.appendChild(medal)
	                .appendChild(bird);
		},
        setupIntro = function (scene) {
            var arrow = new lime.Sprite(),
                arrowText = new lime.Label(),
                bird = new lime.Sprite(),
                board = new lime.Sprite(),
                boardText = new lime.Label(),
                arrowLayer = new lime.Layer();

            // set board
            board
                .setFill("assets/txt-quiz.png")
                .setPosition(408, 358);

            boardText
                .setText(text.boardText)
                .setFontSize(24)
                .setFontColor('#FFF')
                .setPosition(400, 430);

            // set bird
            bird
                .setFill("assets/bird.png")
                .setPosition(400, 89);

            arrowLayer
                .setSize(225, 99)
                .setPosition(400, 100);

            // set arrow
            arrow
                .setPosition(10, 43)
                .setSize(225, 99)
                .setFill("assets/arrow.png");
            // set label
            arrowText
                .setText(text.arrowText)
                .setFontSize(24)
                .setFontColor('#FFF')
                .setPosition(10, 48);

            // add both to layer
            arrowLayer.domClassName = goog.getCssName('lime-button');
            arrowLayer
                .appendChild(arrow)
                .appendChild(arrowText);

            scene
                .appendChild(background().normal)
                .appendChild(board)
                .appendChild(boardText)
                .appendChild(doctor().normal)
                .appendChild(arrowLayer)
                .appendChild(bird);

            // bind event
            // goog.events.listen(arrowLayer, 'mouseover', function (e) {
            //     arrowLayer.runAction(
            //         new lime.animation.ScaleTo(1.1).setDuration(0));

            //     // bird.runAction(new lime.animation.Sequence(
            //     //     // new lime.animation
            //     //     //         .MoveBy(0, -10)
            //     //     //         .setDuration(.05)
            //     //     //         .setEasing(lime.animation.Easing.EASEIN),
            //     //     // new lime.animation
            //     //     //         .MoveBy(0, 8)
            //     //     //         .setDutation(.05)
            //     //     //         .setEasing(lime.animation.Easing.EASEOUT)
            //     // ));
                   
            //     e.swallow('mouseout', function () {
            //         arrowLayer.runAction(
            //             new lime.animation.ScaleTo(1.0).setDuration(.05));

            //         // bird.runAction(
            //         //     new lime.animation.MoveBy(0, 2).setDutation(.05));
            //     });
            // });

            goog.events.listen(arrowLayer, 'mousedown', function (e) {
                e.swallow('mouseup', function () {
                    director.replaceScene(sceneChoice);
                });
            });

        },
        setupChoice = function (scene) {
            var board = new lime.Sprite(),
                backgroundNormal = background().normal,
				backgroundCorrect = background().correct,
				backgroundIncorrect = background().incorrect,
                doctorNormal = doctor().normal,
				doctorCorrect = doctor().correct,
				doctorIncorrect = doctor().incorrect,
                nextButton = function () {
                    var layer = new lime.Layer(),
                        arrow = new lime.Sprite(),
                        arrowText = new lime.Label();

                    arrow
                        .setFill("assets/arrow2.png")
                        .setSize(173, 76)
                        .setPosition(90, 40);

                    arrowText
                        .setText(text.nextQuestion)
                        .setFontColor('#FFF')
                        .setFontSize(24)
                        .setPosition(84, 46);

                    layer
                        .appendChild(arrow)
                        .appendChild(arrowText)
                        .setSize(180, 80)
                        .setPosition(122, 452);
					
					goog.events.listen(layer, 'mousedown', function (e) {
				         e.swallow('mouseup', function () {
							console.log("nextButton Clicked");
							scene.removeChild(choiceLabel);
							no = no + 1;
							if(no < 10){
								choiceLabel = buildChoice(choice[no]);
								scene.appendChild(choiceLabel);
								scene.removeChild(nextButton);
								scene.removeChild(sprite);
								
								if(scene.getChildIndex(backgroundCorrect) !== false){
									scene.removeChild(backgroundCorrect);
								}
								if(scene.getChildIndex(backgroundIncorrect) !== false){
									scene.removeChild(backgroundIncorrect);
								}
								scene.appendChild(backgroundNormal,0);
								
								if(scene.getChildIndex(doctorCorrect) !== false){
									scene.removeChild(doctorCorrect);
								}
								if(scene.getChildIndex(doctorIncorrect) !== false){
									scene.removeChild(doctorIncorrect);
								}
								scene.appendChild(doctorNormal);
							}else{
								console.log("ended game");
								//set up Score Layer
								//var medal = scoreManager(score);
								setupScore(sceneScore);
								director.replaceScene(sceneScore);
							}        
						});
				    });

                    return layer;
                } (),
                choice = [
				{
					question: "1. ผู้คนเมืองพอดีมีนิสัยอย่างไร",
                    choices: [
                        "ซื่อสัตย์",
                        "มีวินัย",
                        "ช่วยเหลือกัน"
                    ],
                    correct: 3
				},
				{
					question: "2. ชาวเมืองพอดีประกอบอาชีพอะไร",
                    choices: [
                        "ทำนา",
                        "เลี้ยงสัตว์",
                        "ปลูกผัก"
                    ],
                    correct: 3
				},
				{
					question: "3. ทำไมชาวบ้านจึงซื้อสินค้าเกินพอดี",
                    choices: [
                        "ถูกหมาป่าหลอก",
                        "ของถูกและน่าซื้อ",
                        "อยากได้อยากมี"
                    ],
                    correct: 3
				},
				{
					question: "4. ทำไมสวนผักจึงเหี่ยวเฉา",
                    choices: [
                        "ชาวบ้านไม่มีน้ำรดผัก",
                        "ชาวบ้านไม่สนใจดูแล",
                        "ชาวบ้านย้ายออกจากเมือง"
                    ],
                    correct: 2
				},
				{
					question: "5. ชาวบ้านขอบคุณเด็กหญิงแก้มใสอย่างไร",
                    choices: [
                        "ให้ผักสด",
                        "สร้างบ้านใหม่",
                        "ซื้อเสื้อผ้าใหม่"
                    ],
                    correct: 1
				},
				{
					question: "6. การใช้ชีวิตแบบพอเพียงช่วยชาวเมืองได้อย่างไร",
                    choices: [
                        "มีเสื้อผ้าสีสันสดใสใส่",
                        "มีความสุขทั้งกายและใจ",
                        "มีทรัพย์สินเงินทองมากขึ้น"
                    ],
                    correct: 2
				},
				{
					question: "7. หมาป่าควรทำอย่างไรเมื่อชาวเมืองหยุดซื้อสินค้าฟุ่มเฟือย",
                    choices: [
                        "ย้ายไปอยู่อีกเมือง",
                        "ประกอบอาชีพสุจริต",
                        "หาของแปลก ๆ มาขาย"
                    ],
                    correct: 2
				},
				{
					question: "8. ข้อใดคือประโยชน์ของการกินผัก",
                    choices: [
                        "ท้องผูก",
                        "วิ่งเร็วขึ้น",
                        "ร่างกายแข็งแรง"
                    ],
                    correct: 3
				},
				{
					question: "9.เราสามารถใช้ชีวิตพอเพียงได้อย่างไรบ้าง",
                    choices: [
                        "มองโลกในแง่ดี",
                        "มีน้ำใจต่อกัน",
                        "ประหยัดอดออม"
                    ],
                    correct: 3
				},
				{
					question: "10. ถ้าเราอยากได้ของเล่น เราควรทำอย่างไร",
                    choices: [
                        "เก็บเงินซื้อเอง",
                        "ขอเงินพ่อแม",
                        "บอกให้เพื่อนซื้อ"
                    ],
                    correct: 1
				},
                ],
                buildChoice = function (choice) {
                    var buildChoiceAnswer = function (text, isCorrect) {
                        var normalColor = '#990000',
                            hoverColor = '#003399',
                            answer = new lime.Label(),
                            list = new lime.Layer(),
                            pin = new lime.Circle(),
                            answer,
                            isCorrect;

                        list.domClassName = goog.getCssName('lime-button');

                        list
                            .appendChild(pin)
                            .appendChild(answer)
                            .setSize(300, 50);

                        pin
                            .setSize(16, 16)
                            .setPosition(-160, -10)
                            .setFill(normalColor);

                        answer
                            .setText(text)
                            .setAlign('left')
                            .setFontSize(26)
                            .setSize(250, 50)
                            .setPosition(5, 0)
                            .setFontColor(normalColor);

                        goog.events.listen(list, 'mouseover', function (e) {
                            answer.setFontColor(hoverColor);
                            pin.setFill(hoverColor);

                            e.swallow('mouseout', function () {
                                answer.setFontColor(normalColor);
                                pin.setFill(normalColor);
                            });
                        });

						!function(localList) {
							 goog.events.listen(localList, 'mousedown', function (e) {
									goog.array.forEach(localList.getParent().children_, function(e, i, arr) {
									  goog.events.removeAll(e)
									});
									scene.removeChild(doctorNormal);
									scene.removeChild(backgroundNormal);
		                            if (isCorrect) {
										console.log("CORRECT")
		                                scene.appendChild(nextButton);
										scene.appendChild(doctorCorrect);
										scene.appendChild(backgroundCorrect,0);
										score = score + 1;
										
										sprite
											.setAnchorPoint(0.5, 1)
											.setPosition(400, 600)
											.setFill("assets/bg-correct1.png")
											.setScale(1.0),
										scene.appendChild(sprite,1);
										
										var animation = new lime.animation.KeyframeAnimation();
										animation.setDelay(0.03);
										for (var i=1; i<=6; ++i){
											if(i !== 5)
												animation.addFrame("assets/bg-correct" + i + ".png");
										}
										sprite.runAction(animation);
		                            }else {
										console.log("INCORRECT")		
										scene.appendChild(nextButton);
										scene.appendChild(doctorIncorrect);
										scene.appendChild(backgroundIncorrect,0);
									}
		                        });							
						}(list)
                       

                        return list;
                    };

                    var choiceLabel = new lime.Node();

                    // make question label
                    choiceLabel.appendChild(
                        new lime.Label()
                                .setSize(440, 100)
                                .setText(choice.question)
                                .setFontSize(28)
                                .setFontColor('#990000')
                                .setPosition(300, 135)
                    );

                    // make answer label
                    for (i in choice.choices) {
                        isCorrect = (parseInt(i) === (choice.correct - 1));
                        answer = buildChoiceAnswer(choice.choices[i], isCorrect);
                        answer.setPosition(340, 260 + (i * 50));

                        choiceLabel.appendChild(answer);
                    }
					
                    return choiceLabel;
                };

            board
                .setFill("assets/board2.png")
                .setPosition(300, 300);

			choiceLabel = buildChoice(choice[no]);
            
            scene
                .appendChild(backgroundNormal)
                .appendChild(board)
                .appendChild(doctorNormal)
                .appendChild(choiceLabel);
        };
    
    // set up intro layer
    setupIntro(sceneIntro);

    // set up choice layer
    setupChoice(sceneChoice);

	// set current scene active
	director.replaceScene(sceneIntro); //sceneIntro
}


//this is required for outside access after code is compiled in ADVANCED_COMPILATIONS mode
goog.exportSymbol('Kamsai.start', Kamsai.start);
