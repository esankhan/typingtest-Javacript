var dataModule= ( function () {
	
	var lineReturn = '|';
	// shuffle function
	 var shuffle = function (array) {
		var newArray=[];
		var randomIndex; 
		while(array.length>0) {
			//rake random ele from array and add to new array
			randomIndex=Math.floor(Math.random()* array.length);
			var randomElement=array[randomIndex];
			newArray.push(randomElement);
			//delete from old array
			array.splice(randomIndex,1);
		}
		return newArray;
	 
	 };
	
	// capitalize random
	String.prototype.capitalize=function () {
		var newString="";
		var firstCharCap=this.charAt(0).toUpperCase();
		var remainingChar = this.slice(1);
		newString=firstCharCap+remainingChar;
		return newString;
	};
	
	var capitalizeRandom= function(arrayOfStrings){
		return arrayOfStrings.map( function (currentWord){
			var x= Math.floor(4*Math.random());
			if(x==3)
			{
		return currentWord.capitalize();
			}
			else
			{
				return currentWord;
			}
		});
	};

	
	// add random puctuation function
	 var addRandomPunctuation=function(arrayOfStrings) {		 
		 return arrayOfStrings.map(function(currentWord){
			 var randomPunctuation='';
			 var items = [lineReturn,lineReturn,lineReturn,lineReturn,'?','?','?', ',' , ',', ',', ',', ',', ',', ',', ',', ',','.','.','.','.','.','.','.','.','.','.','.','.', '!', '!', '!',''];
			var randomIndex=Math.floor(Math.random()* items.length);
			randomPunctuation= items[randomIndex];
			//console.log(randomPunctuation);
			return currentWord+ randomPunctuation;
		 });
	 };
	 	//var words=['word1','word2','word3'];
	// console.log(addRandomPunctuation(words));
	
	//used to calculate no of correct chars inseide current word;
	   var nbofCorrectChars;
			var charCallBack= function(currentElement,index){
			nbofCorrectChars += (currentElement == this.characters.user[index])? 1 : 0;
		};
	
	var appData={
		indicators: {
			testStarted:false,
			testEnded:false,
			totalTestTime:0,
			timeLeft:0
		},
		results: {
			wpm:0,
			wpmChange: 0,
			cpm:0,
			cpmChange: 0,
			accuracy: 0,
			accuracyChange: 0,
			numOfCorrectWords: 0,
			numOfCorrectCharacters: 0,
			numOfTestCharacters: 0
			
		},
		words: {
			currentWordIndex: -1,
			testWords: [],
			currentWord: {}
		},
	};
	
	//word constructor
	// {
	// value: {
		// correct:
		//user:
		//isCorrect:false
	//},
	//characters: { correct:[], user:[], totalCorrect: ),totalTest:0 }
	//}
	var word = function (index) {
		//word values correct vs user
		this.value= {
		correct: appData.words.testWords[index] + ' ',
		user: '',
		isCorrect: false
		 
		};
		
		// chars correct vs usrs
		
		this.characters= {
		correct: this.value.correct.split(''),
		user: [],
		totalCorrect: 0,
		totalTest:this.value.correct.length
		
		};
	};
	//update method:the word typed by user
	word.prototype.update=function(value){
		//user value
		this.value.user=value;
		
		//update the word status
		
		this.value.isCorrect= (this.value.correct == this.value.user);
		
		//update user chars
		
		this.characters.user=this.value.user.split('');
		
		//calculate the no of correct chars
		 nbofCorrectChars=0;

		
		  var charCallBack2 = charCallBack.bind(this);
		
		this.characters.correct.forEach(charCallBack2);
		
		this.characters.totalCorrect = nbofCorrectChars;
		
	};
	
	return {
		setTestTime: function(x){
			appData.indicators.totalTestTime=x;
			
		}, //sets the total test time to x
		initializeTimeLeft:
		function(){
			appData.indicators.timeLeft=appData.indicators.totalTestTime;
		}, // initializes time left to the total test time
		startTest: function(){
			
			appData.indicators.testStarted=true;
		},
		endTest:function(){
			appData.indicators.testEnded=true;
			
		},
		getTimeLeft: function(){
			return appData.indicators.timeLeft;
		}, // return the remaining time
		reduceTime: function(){
			appData.indicators.timeLeft--;
			return appData.indicators.timeLeft;
		}, // reduce the time 1 sec
		timeLeft: function(){
			
			return appData.indicators.timeLeft!=0;
		}, //checks if there is time left to continue test
		testEnded(){
			return appData.indicators.testEnded;
		}, // if the test has already ended
		testStarted: function(){
			return appData.indicators.testStarted;
		}, // if test has started
		calculateWpm: function(){
			var wpmOld=appData.results.wpm;
			var numOfCorrectCharacters=appData.results.numOfCorrectCharacters;
			if(appData.indicators.timeLeft != appData.indicators.totalTestTime)
				{
					appData.results.wpm= Math.round(60* (numOfCorrectCharacters/(appData.indicators.totalTestTime-appData.indicators.timeLeft)));
					//console.log(appData.results.cpm);
				}
				else
				{
					appData.results.wpm=0;
				}
				appData.results.wpmChange=appData.results.wpm-wpmOld;
				//console.log(appData.results.wpmChange);
				
				return [appData.results.wpm,appData.results.wpmChange];
		},
		//sappData.results.wpmChange, // calculates wpm and wpmChange and update in appData
		calculateCpm: function() {
			
			var cpmOld=appData.results.cpm;
			var numOfCorrectCharacters=appData.results.numOfCorrectCharacters;
			if(appData.indicators.timeLeft != appData.indicators.totalTestTime)
				{
					appData.results.cpm= Math.round(60* (numOfCorrectCharacters/(appData.indicators.totalTestTime-appData.indicators.timeLeft)));
					//console.log(appData.results.cpm);
				}
				else
				{
					appData.results.cpm=0;
				}
				appData.results.cpmChange=appData.results.cpm-cpmOld;
				//console.log(appData.results.cpmChange);
				
				return [appData.results.cpm,appData.results.cpmChange];
			
			
		}, // calculates cpm and cpmChange and update in appData
		
		
		calculateAccuracy: function() 
			
			{
			
			var accuracyOld=appData.results.accuracy;
			var numOfCorrectCharacters=appData.results.numOfCorrectCharacters;
			var numOfTestCharacters = appData.results.numOfTestCharacters;
			if(appData.indicators.timeLeft != appData.indicators.totalTestTime)
				{
					if(numOfTestCharacters!=0)
					{
					appData.results.accuracy= Math.round(100* (numOfCorrectCharacters/numOfTestCharacters));
					//console.log(appData.results.cpm);
					}
					else
					{
						appData.results.accuracy=0;
					}
				}
				else
				{
					appData.results.accuracy=0;
				}
				appData.results.accuracyChange=appData.results.accuracy-accuracyOld;
				//console.log(appData.results.cpmChange);
				
				return [appData.results.accuracy,appData.results.accuracyChange];
			
			
		}, //calculates accuracy and accuracyChange and update in appData
		
		//test words
		
		fillListOfTestWords:
		function(textNumber, words){
			var result= words.split(" ");
			//appData.words.testWords=result;
			if(textNumber==0) {
				// shuffle words
				result = shuffle(result);
				
				// capitalise random strings
				result=capitalizeRandom(result);
				
				
				// add random punctuation
				result=addRandomPunctuation(result);
			}
			//console.log(result);
			appData.words.testWords=result;
		},
		getListOfTestWords:
		function(){
			return appData.words.testWords;
		},
		
		moveToNewWord: function(){
			if(appData.words.currentWordIndex>-1)
			{
				//update no of correct words
				if(appData.words.currentWord.value.isCorrect){
					appData.results.numOfCorrectWords++;
					
				}
				//update no of correct characters
				appData.results.numOfCorrectCharacters += appData.words.currentWord.characters.totalCorrect;
				
				//update no of test characters
				appData.results.numOfTestCharacters += appData.words.currentWord.characters.totalTest;
			}
			appData.words.currentWordIndex++;
			var currIndex=appData.words.currentWordIndex;
			 var newWord=new word(currIndex);
			 appData.words.currentWord=newWord;
			
			
		}, //increments the currentWordIndex-updates the current word(appData.words.currentWord) by creating
		// a new instance of word class -updates numOfCorrectWords,numOfCorrectCharacters and numOfTestCharacters
		updateCurrentWord: function(value){
			appData.words.currentWord.update(value);
		}, // updates current word using user input
		 
		 getLineReturn() {
			 return lineReturn;
			 
		 },
		 
		 //get current word index
		 
		 getCurrentWordIndex: function(){
		 
		 return appData.words.currentWordIndex;
			 
		 },
		 //getCurrent Word
		 getCurrentWord: function(){
				var currentWord=appData.words.currentWord;
				return {
					value: {
						correct:currentWord.value.correct,
						user:currentWord.value.user
					}
				};
		 },
		 getCertificateData: function() {
			//console.log(appData.indicators.wpm);
			//	console.log(appData.indicators.accuracy);
			return {
				
				wpm: appData.results.wpm,
				accuracy: appData.results.accuracy,
			};
			 
		 },
		// returnData() {
			//console.log(appData);
			 
		// }
	
	}
	
})();