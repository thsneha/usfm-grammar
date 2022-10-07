const Parser = require('tree-sitter');
const USFM3 = require('tree-sitter-usfm3');
const fs = require('fs');
const {Query, QueryCursor} = Parser

const parser = new Parser();
parser.setLanguage(USFM3);

const Filter={
	ALL :"all",
	SCRIPTURE_BCV :"scripture-bcv",
	SCRIPTURE_PARAGRAPHS : "scripture-paragraph",
	NOTES :"notes",
	NOTES_TEXT : "note-text"
}

  const Format={
	JSON : "json",
	CSV :"table",
	ST :"syntax-tree",
	USX :"usx",
	MD :"markdown"

}

bookcode_query=new Query(USFM3,'(File(book(id(bookcode)@book-code)))');
chapter_query=new Query(USFM3,'(File(chapter)@chapter)');
//console.log(bookcode_query);

class USFMParser{

	
	/* Parser class with usfmstring, syntax_tree and methods for convertions to different formats */
	constructor(usfmString){
		this.usfm = usfmString
		//console.log(this.usfm)
		this.syntaxTree = null
		this.errors = null
		let tree = null

		try{

			tree = parser.parse(this.usfm)
			//console.log(tree)
			

		} catch(err){
			console.log(err.toString());
		
		
		
     }
     //console.log(this.syntaxTree);
     this.syntaxTree = tree.rootNode;

	}

	toSyntaxTree(){
		//console.log(this.syntaxTree.toString());
		return this.syntaxTree.toString();
		
	}


	toJSON(filt=Filter.SCRIPTURE_BCV){
		//console.log(filt);
	// 	/* Coverts syntax tree to JSON, based on filter option given */
		if (filt ==([Filter.SCRIPTURE_BCV])){
			//console.log(this.syntaxTree);
 
           var objoutput={};                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
           const matches = bookcode_query.matches(this.syntaxTree);
           //console.log(matches);
           const cap=matches[0]
           console.log(cap);
           //console.log(cap.captures[0].node.startPosition.row);
           //console.log(cap.captures[0].node.startPosition.column);
           //console.log(this.usfm[cap.captures[0].node.startPosition.row])
   
           console.log(cap.captures[0].node.text)
           objoutput.book={'bookcode':cap.captures[0].node.text};
           console.log(objoutput)
           objoutput['book']['chapter']=[]
           //console.log(objoutput)
           const matches1=chapter_query.matches(this.syntaxTree);
           //console.log(matches1);
           // for cap in matches1{
           // 	 console.log(cap);
           // 	}



           
           
            

   }
	 }
}

/* -------------------------------------------------
For Testing during development
Either chanage the string value of sourceCode 
or give an inputPath to usfm file
-------------------------------------------------*/

let sourceCode = '\\id GEN\n\\c 1\n\\p\n\\v 1 In the begining..';
let parserObj = new USFMParser(sourceCode)
console.log(parserObj.toSyntaxTree())
console.log('--------------------------------------------------------')
console.log(parserObj.toJSON())
console.log('********************************************************\n\n')
let inputPath = "../tests/basic/samples/origin.usfm"
fs.readFile(inputPath, 'utf8', function (err, data) {
	if (err) throw err;
	parserObj = new USFMParser(data.toString());
	console.log(parserObj.toSyntaxTree())
	console.log('--------------------------------------------------------')
	console.log("json method is")
	console.log(parserObj.toJSON())
	console.log('********************************************************')
});

