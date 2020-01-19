var UIModule=( function() {
	//classes used to select HTML elements
	var DOMElements = {
		//indicators-test controllers
		timeLeft:document.getElementById('timeLeft'),//, //HTML element displaying time left
		//test results
		wpm:document.getElementById('wpm'),
		wpmChange:document.getElementById('wpmChange'),
		cpm:document.getElementById('cpm'),
		cpmChange:document.getElementById('cpmChange'),
		accuracy:document.getElementById('accuracy'),
		accuracyChange:document.getElementById('accuracyChange'),
		//user input
		textInput:document.querySelector('#input'), // just the use of query selector
		nameInput:document.querySelector('.form-group'),
		nameField:document.getElementById('name'), 
		//test words
		content:document.getElementById('content'),
		activeWord:'',
		//modal
		modal:$('#modal'),
		downloadCer:document.getElementById('downloadCer')
	};
						var userValue;
				var returnCharClass =
				function(currentChar,index) {
				return (index<userValue.length)?(currentChar==userValue[index] ? 'correctChar': 'wrongChar'):'0';
			
			};
	
	var splitArray= function(string){
		return string.split('');
	};
	var addSpace= function(array)
	{
		 array.push(' ');
		 return array;
	};
	 var addSpanTag = function(array)
	 {
		 return array.map(function(currentChar){
			return '<span>' + currentChar + '</span>'; 
		 });
		 
	 };
	 
	 var addWordSpanTags = function(array){
		array.push('</span>');
		array.unshift('<span>');
		return array;
	 };
	 
	 
	 var joinEachWord= function(array) {
			return array.join('');
	 };
	 
	 var updateChange= function(value,changeElement) {
		 
         //determine the class to add to the change element	 and html content to enter
		 var classToAdd,htmlCon;
		 [classToAdd,htmlCon]=(value>=0)?['scoreUp','+' + value]:['scoreDown',  value];
		 
		 //add Precentage to accuracy
		 if(changeElement== DOMElements.accuracyChange)
			{
				htmlCon += '%';
			 
			}
		 
		 //update the change elements
		 changeElement.innerHTML=htmlCon;
		 
		 
		 //style the change elements
		 changeElement.removeAttribute('class');
		 changeElement.className=classToAdd;
		 fadeElements(changeElement);
	 };
	 
	 var fadeElements = function(element) {
		 element.style.opacity=1;
		 setTimeout(function() {
			 element.style.opacity=.85;
		 }, 100)
	 }
	 
	 
	 
	 
	 
	return {
		//get DOM Elements
		getDOMElements: function(){
			return {
			textInput:DOMElements.textInput,
			downloadCer:DOMElements.downloadCer
			};
			
		},
		//indicators-test Control
		updateTimeLeft: function(x) {
			DOMElements.timeLeft.innerHTML=x;
			
		},
		//results
		
		updateResults: function(results) {
			//update wpmD
			//console.log(results);
		//	document.getElementById('wpm').innerHTML='76';
			DOMElements.wpm.innerHTML= results.wpm;
			DOMElements.cpm.innerHTML= results.cpm;
			DOMElements.accuracy.innerHTML= results.accuracy+ '%';
			
			
			//update changes
			
			updateChange(results.wpmChange,DOMElements.wpmChange);
			updateChange(results.cpmChange,DOMElements.cpmChange);
			updateChange(results.accuracyChange,DOMElements.accuracyChange);
			
		},
		fillModal: function(wpm) {
			var results;
			
			if(wpm<40)
			{
				results = {
						type: 'turtle',
						imag: 'turtle.png',
						level: 'Beginner'
						
				};
			} else if(wpm>40 && wpm<70)
			{
				results = {
						type: 'horse',
						imag: 'horse.png',
						level: 'Average'
						
				};
			}
			else {
				results = {
						type: 'puma',
						imag: 'puma.png',
						level: 'Expert'
						
				};
			}
			var htmlTemplate = '<div class="modal-result"><p>You are a *type* !</p><p>You type at a speed of *val* words per minute</p><img width="200" height="200" class="rounded-circle" src="images/*imag*" alt=*alter*></div>';
			htmlTemplate=htmlTemplate.replace('*type*', results.type);
			htmlTemplate=htmlTemplate.replace('*val*', wpm);
			htmlTemplate=htmlTemplate.replace('*imag*', results.imag);
			htmlTemplate=htmlTemplate.replace('*alter*', results.type);
			
			//insert html before form-group
			DOMElements.nameInput.insertAdjacentHTML('beforebegin',htmlTemplate);
			
			
			//store the element in download button
			
			DOMElements.downloadCer.setAttribute('level',results.level);
			
			
		},
		showModal: function() {
			DOMElements.modal.modal('show');
			 console.log('ahjdshsdfihdf');
			
			
		},
		
		// user input
		inputFocus: function() {
			DOMElements.textInput.focus();
			
		},
		isNameEmpty: function() {
			return DOMElements.nameField.value == '';
		},
		flagNameInput: function() {
			
			DOMElements.nameField.style.borderColor='red';
			
		},
		spacePressed: function (event) {
			return event.data==" ";
		},
		enterPressed: function (lineReturn) {
			return DOMElements.textInput.value.includes(lineReturn + ' ');
 
		},
		emptyInput: function() {
			
			DOMElements.textInput.value= '';
		},
		getTypedWord: function() {
			
			return DOMElements.textInput.value;
		},
		
		//test words
		
		fillContent: function(array,lineReturn) {
			//var wordss=['word1', 'word2']
			var content = array.map(splitArray);
			//console.log(content);
			
		//add a space at the end of each element
		
		content= content.map(addSpace);
		//console.log(content);
			
		//surround each characters with span tags
		content=content.map(addSpanTag);
		//console.log(content);		
		
		//Add opening span at very beginning and closing span at very end of each word.
		
		content=content.map(addWordSpanTags);
		//console.log(content);	
		// join each word for now
		
		content=content.map(joinEachWord);
		//console.log(content);
		// join every word
		content=content.join('');
		//console.log(content);
		// if found '|'=> <span>&crarr</span>
		//content=content.replace('<span>|</span>',);
		//split and join
		content=content.split('<span>'+lineReturn+'</span>').join('<span>&crarr;</span>');
	//	console.log(content);
		
		//fill Content in test
		
		DOMElements.content.innerHTML=content;
				
		},
		
		
		formatWord: function(wordObject){
			var activeWord=DOMElements.activeWord;
			
			//highlight the current word
			activeWord.className='activeWord';
			
			
			//format individula character
			var correctValue=wordObject.value.correct;
			 userValue=wordObject.value.user;
			
			
			//correct value word1
			//user value wwrd1

			var classes=Array.prototype.map.call(correctValue,returnCharClass);
			
			
			//ghet active word
			var activeWord= DOMElements.activeWord;
			var characters=activeWord.children;
			
			//add classes to childern
			
			for(var i=0;i< characters.length;i++){
				characters[i].removeAttribute('class');
				characters[i].className=classes[i];
			}
			
		},
		
		
		setActiveWord: function(index) {
			DOMElements.activeWord= DOMElements.content.children[index];
			
		},
		deactivateCurrentWord : function(){
			DOMElements.activeWord.removeAttribute('class');
			
		},
		scrolling: function() {
			var activeWord=DOMElements.activeWord;
			var top1=activeWord.offsetTop;
			var top2=DOMElements.content.offsetTop;
			var diff=top1-top2;
			//scroll the content of
			
			DOMElements.content.scrollTop=diff-40;
			
		}	
		
	}
	
})();