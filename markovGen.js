function markovFull(options,callback){
	/*
	Generates a markov string of word length 'length'
	from the url 'url'
	*/
	_.defaults(options,{url:"pride.txt",length:30,startString:undefined,endString:undefined,functionToRun:function(){}})
	$.ajax({
		async: false,
		type: 'GET',
		url: options.url,
		success: callback
	});
	
	
}
function markov(options){
	markovFull(options,function(data) {
			options.functionToRun();
			data=data.slice(data.indexOf(options.startString)+options.startString.length,data.indexOf(options.endString));
			//replace newline
			data=data.replace(/\r?\n|\r/g," ");
			//make speechmarks okay in string
			//data=data.replace(/"/g, '\\"');
			//remove all punctuation
			//data=data.replace(/(~|`|!|@|#|$|%|^|&|\*|\(|\)|{|}|\[|\]|;|:|\"|'|<|,|\.|>|\?|\/|\\|\||-|_|\+|=)/g,"");
			data=data.split(" ");
			//data=data.slice(0,1500);			
			counter=0;
			while(counter<data.length){
				if(data[counter]==""){
					data.splice(counter,1);
				}
				else{
					counter++;
				}
			}
			words=data;
			for(i=0;i<words.length;i++){words[i]=words[i].toLowerCase();}
			
			
			//START MAKING MARKOV String
			
			//First word
			markovArray=[]
			markovArray[0]=choose(words);
			//markovArray[0]=words[1335]
			
			//Loop for each word
			for(j=1;j<options.length;j++){
				markovArray[j]=markovChoose(words,markovArray[j-1]);
			}
			markovString=markovArray.join(" ");
			markovObj={
				sourceUrl:options.url,
				result:markovString
			}
		});
		
		return markovObj
}
function choose(array){
	return array[Math.floor(Math.random()*array.length)]
}
function markovChoose(array,element){
	//c
	possibleOptions=[]
	searchFrom=0
	searchForOptions=true;
	while(searchForOptions){
		//console.log(element,array.indexOf(element,searchFrom),searchFrom);
		if(array.indexOf(element,searchFrom)!=-1){
			possibleOptionsIndex=-1;
			for(i=0;i<possibleOptions.length;i++){
				if(possibleOptions[i].nextWord==array[array.indexOf(element,searchFrom)+1]){
					//alert("called");
					possibleOptionsIndex=i;
				}
				//console.log(possibleOptions[i]);
			}
			if(possibleOptionsIndex==-1){
				possibleOptions.push({index:array.indexOf(element,searchFrom),nextWord:array[array.indexOf(element,searchFrom)+1],freq:1});
			}
			else{
				possibleOptions[possibleOptionsIndex].freq++;
			}
			searchFrom=array.indexOf(element,searchFrom)+1;
		}
		else{
			searchForOptions=false;
		}
	}
	/*console.log("___",element,"___");
	console.log(possibleOptions);*/
	possibleOptionsFreqSum=0;
	for(i=0;i<possibleOptions.length;i++){
		possibleOptionsFreqSum+=possibleOptions[i].freq;
	}
	randomChoice=Math.random()*possibleOptionsFreqSum;
	//console.log(randomChoice);
	currentWordIndex=-1;
	frequencyRollingSum=0;
	while(frequencyRollingSum<randomChoice){
		currentWordIndex++;
		//console.log(currentWordIndex,frequencyRollingSum<randomChoice,frequencyRollingSum,possibleOptions[currentWordIndex])
		frequencyRollingSum+=possibleOptions[currentWordIndex].freq;
	}
	chosenWord=possibleOptions[currentWordIndex];
	return chosenWord.nextWord
}