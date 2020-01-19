var eventsModule = (function(dModule, cModule, wModule, uModule) {
  var addEventListener = function() {
    //character typing Event
    uModule
      .getDOMElements()
      .textInput.addEventListener("input", function(event) {
        //if test ended

        if (dModule.testEnded()) {
          return;
        }

        //if the test has not started yet start the test countdown result and so on
        if (!dModule.testStarted()) {
          //start test dmodule
          dModule.startTest();
          //start a counter

          var b = setInterval(function() {
            //calculate the results
            var results = {};
            //update wpm and wpmHCange
            [results.wpm, results.wpmChange] = dModule.calculateWpm();
            //update cpm and cpmhChange
            [results.cpm, results.cpmChange] = dModule.calculateCpm();
            //dModule.returnData();

            //update accuracy accHange
            [
              results.accuracy,
              results.accuracyChange
            ] = dModule.calculateAccuracy();
            //update the results uModule
            //console.log(results);
            uModule.updateResults(results);
            //update time left every sec
            // check if any time lfet
            //reduce dmodule
            //udate time remaining uModule

            // if no time
            // end test dmodule testEnded

            //fill modal

            //show modal
            if (dModule.timeLeft()) {
              //reduce time
              var timeLeft = dModule.reduceTime();

              //update time rem UI
              uModule.updateTimeLeft(timeLeft);
            } else {
              //end test dmodule
              clearInterval(b);
              dModule.endTest();
              //dModule.returnData();

              //fill modal
              uModule.fillModal(results.wpm);

              //show modal
              uModule.showModal();
            }
          }, 1000);
        }

        //get typed word: UI MODEULE
        var typedWord = uModule.getTypedWord();

        // update current word : data module
        dModule.updateCurrentWord(typedWord);

        //format the active word
        var currWord = dModule.getCurrentWord();
        uModule.formatWord(currWord);

        //if user presssed space or enter
        if (uModule.spacePressed(event) || uModule.enterPressed(dModule.getLineReturn())) {
          //console.log('space');
          //empty the text input
          uModule.emptyInput();

          //deactivate the current word
          uModule.deactivateCurrentWord();
          // move to new word data module
          dModule.moveToNewWord();

          // set active word: UI module
          var index = dModule.getCurrentWordIndex();
          uModule.setActiveWord(index);

          // format the active word UI module
          var currWord = dModule.getCurrentWord();
          uModule.formatWord(currWord);

          //scroll the new word into view
          uModule.scrolling();
        }
      });

    //click on download button event listener
    uModule
      .getDOMElements()
      .downloadCer.addEventListener("click", function(event) {
        if (uModule.isNameEmpty()) {
          uModule.flagNameInput();
        } else {
          var certificateData = dModule.getCertificateData();
          //console.log(certificateData);
          cModule.generateCertificate(certificateData);
        }
      });

    // click on restart button event listener
  };

  // scroll into middle view on window resizze

  window.addEventListener("resize", uModule.scrolling);

  return {
    //init function ,initializes the test before start
    init: function(duration, textNumber) {
      //fill the list of test words : data module

      var words = wModule.getWords(textNumber);
      dModule.fillListOfTestWords(textNumber, words);

      //fill the list of test words : UI module
      var lineReturn = dModule.getLineReturn();
      var testWords = dModule.getListOfTestWords();
      uModule.fillContent(testWords, lineReturn);

      //set total time
      dModule.setTestTime(duration);

      //update time left data module
      dModule.initializeTimeLeft();

      //update time left UI module
      var timeLeft = dModule.getTimeLeft();
      uModule.updateTimeLeft(timeLeft);

      // move to new word data module
      dModule.moveToNewWord();

      // set active word: UI module
      var index = dModule.getCurrentWordIndex();
      uModule.setActiveWord(index);

      // format the active word UI module
      var currWord = dModule.getCurrentWord();
      uModule.formatWord(currWord);

      // focus on text input : UI module

      uModule.inputFocus();

      // add event listener

      addEventListener();
    }
  };
})(dataModule, certificateModule, wordsModule, UIModule);
