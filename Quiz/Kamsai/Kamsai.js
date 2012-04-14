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


// entrypoint
Kamsai.start = function() {
    var director = new lime.Director(document.body, 800, 600),
        sceneIntro = new lime.Scene(),
        sceneChoice = new lime.Scene(),
        text = {
            arrowText: "เริ่มทำแบบทดสอบ",
            boardText: "แบบทดสอบมีทั้งหมด 10 ข้อ",
            nextQuestion: "ข้อถัดไป"
        },
        background = function () {
            var background = {};

            background.normal = new lime.Sprite()
                .setAnchorPoint(0, 0)
                .setPosition(0, 0)
                .setFill("assets/bg1.jpg");

            return background;
        },
        doctor = function () {
            var doctor = {};

            doctor.normal = new lime.Sprite()
                .setFill("assets/doctor.png")
                .setPosition(678, 425);

            return doctor;
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
                doctorNormal = doctor().normal,
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

                    return layer;
                } (),
                choice = {
                    question: "1. ผู้คนเมืองพอดีมีนิสัยอย่างไร",
                    choices: [
                        "ซื่อสัตย์",
                        "มีวินัย",
                        "ช่วยเหลือกัน"
                    ],
                    correct: 3
                },
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

                        goog.events.listen(list, 'mousedown', function (e) {
                            console.log(isCorrect);
                            if (isCorrect) {
                                scene.appendChild(nextButton);
                            }
                        });

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
                }
            ;

            board
                .setFill("assets/board2.png")
                .setPosition(300, 300);

            choiceLabel = buildChoice(choice);

            scene
                .appendChild(backgroundNormal)
                .appendChild(board)
                .appendChild(doctorNormal)
                .appendChild(choiceLabel);
        }
    ;
    
    // set up intro layer
    setupIntro(sceneIntro);

    // set up choice layer
    setupChoice(sceneChoice);

	// set current scene active
	director.replaceScene(sceneIntro);
}


//this is required for outside access after code is compiled in ADVANCED_COMPILATIONS mode
goog.exportSymbol('Kamsai.start', Kamsai.start);
