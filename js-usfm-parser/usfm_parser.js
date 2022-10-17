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
chapternumber_query=new Query(USFM3,'(c (chapterNumber) @chapter-number)');
versenum_query=new Query(USFM3,'(v(verseNumber) @verse)');
versetext_query=new Query(USFM3,'(verseText)@verse-text')
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
	
	// 	/* Coverts syntax tree to JSON, based on filter option given */
		if (filt ==([Filter.SCRIPTURE_BCV])){
			//console.log(this.syntaxTree);
 
           var objoutput={};                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
           const matches = bookcode_query.matches(this.syntaxTree);
           const cap=matches[0]
        
           objoutput.book={'bookcode':cap.captures[0].node.text};
           objoutput['book']['chapters']=[]
           const matches1=chapter_query.matches(this.syntaxTree);
		   const cap1=matches1[0]
		   const chapters=cap1.captures[0].node.text;
		   for(let chapts in chapters[0]){
			const matches2=chapternumber_query.matches(this.syntaxTree)
			const chapterNumber=matches2[0].captures[0].node.text;
			
		
			objoutput.book.chapters.push({'chapterNumber':chapterNumber,"contents":[]})
			console.log(objoutput.book.chapters[0].contents);
			//console.log(JSON.stringify(objoutput, null, 2));
			
			const versenum_captures = versenum_query.matches(this.syntaxTree)
			console.log(versenum_captures);
			const versetext_captures=versetext_query.matches(this.syntaxTree)
			console.log(versetext_captures);
			for(let each in versenum_captures){
				
			const verseNumber=versenum_captures[each].captures[0].node.text
			
			const versetext=versetext_captures[each].captures[0].node.text
			console.log({'verseNumber':verseNumber},{'verseText':versetext});
			objoutput.book.chapters[0].contents.push({'VerseNumber':verseNumber,'verseText':versetext})
			}
			console.log(JSON.stringify(objoutput, null, 2));
			
			
		   }
		
		



           
           
            

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

