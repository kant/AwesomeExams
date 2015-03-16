var QUESTION_COUNT = 1;

function ExamContext() {
    
    this.answerKeyVisible = true;

    this.hideAnswerKey = function() {

    }


    this.showAnswerKey = function () {
	if (this.answerKeyVisible)  {	    
	    // We are toggling back to no answers visible, 
	    // and bringing back hidden stuff
	    
	    $(".hideOnKey").each( function(i) { $(this).show();});
	    // Hide all answers
	    $(".answer").each(function (i) {$(this).hide();});
	    // No border on the circled answers
	    $(".circledAnswerWithBorder").each(function (i) {
		    $(this).addClass("circledAnswerNoBorder");
		    $(this).removeClass("circledAnswerWithBorder");
		});
	    // Not sure why we have this too... is it a duplicate? 
	    $(".circledAnswer").each(function (i) {
		    $(this).addClass("circledAnswerNoBorder");
		    $(this).removeClass("circledAnswer");
		});
	    // toggle the state, and the inner text of the button
	    ec.answerKeyVisible = false;
	    $(".showAnswerKey").each(function (i) {
		    $(this).text("show answer key");
		});	    
	} else {
	    // toggling from showing questions to showing answers
	    $(".hideOnKey").each( function(i) { $(this).hide();});
	    // show all answers
	    $(".answer").each(function (i) {$(this).show();});
	    // circle all answers
	    $(".circledAnswerNoBorder").each(function (i) {
		    $(this).addClass("circledAnswerWithBorder");
		    $(this).removeClass("circledAnswerNoBorder");
		});
	    ec.answerKeyVisible = true;
	    $(".showAnswerKey").each(function (i) {
		    $(this).text("hide answer key");
		});
	} // if / else
    }; // showAnswerKey

    this.generatePageHeader = function(examNum,pageNum) {	
	return "<div class='examNumber'>" +
	"<table class='pageHeaderTable'>" + 
	"<tr>" +
	"<td class='bigPageNum' width='15%'>" 
	+ pageNum + 
	"</td>" + 
	"<td style='vertical-align:bottom; width:70%;'> Exam #" +
	+ examNum + ' Page: ' + pageNum + 
	" Name: _____________________________________" + "</td>" +
	"<td class='bigPageNum' width='15%'>" + 
	examNum + 
	" </td></tr></table></div>";
    }

    this.pointCountText = function(text) {
	var totalPts = 0;
	var pointRegExp = /\([ ]*([0-9]+)[ ]*pt[s]?[ ]*\)/g;  
	
	while (match = pointRegExp.exec(text)) {
	    totalPts += parseInt(match[1]);
	}
	return totalPts;	
    }

}

function updateAwesomeQuestions(seed)
{
    $(".pa-question").each( function() {
        var pa_params = $(this).data("pa-params");
        pa_params = pa_params.replace(/'/g, '"');
        var showPts = true; //$(this).data("pa-showPts") == "true"; TODO: don't hardcode true, figure out who comparison failing
        var pts = $(this).data("pa-pts");
        var ptsString = null;

        if(showPts)
        {
            ptsString = "(" + pts + (pts == "1" ? "pt" : "pts") + ")";
        }

        var quizJson = JSON.parse(pa_params);
        var quiz = new Quiz(seed, quizJson);

        $(this).html((showPts ? ptsString : "") + quiz.formatQuestionsHTML() + "<br>" + quiz.formatAnswersHTML());
    });

}

// data-pa-params="{'version':0.1,'title':'beef','quiz':[{'question':'cppBooleanEval','repeat':'1'}]}"
function makeQuestionJsonString(questionType)
{
    var questionObject = "[{'question':'" + questionType + "','repeat':'1'}]";
    var qStr = "{'version':0.1,'title':'Awesome Question','quiz':" + questionObject + "}";

    return qStr;
}

function insertHtmlQuestion()//li, ta)
{
    console.log("Button beep");
    //$(li).html($(ta).value());
}

function addHtmlQuestion()
{
    $(".theQuestions").append('<li class="html-question html-question' + QUESTION_COUNT + ' pageBreakBefore" data-pa-showPts="true" data-pa-pts="10">');

    $(".html-question" + QUESTION_COUNT).html(
        "<textarea id='textarea-html-question" + QUESTION_COUNT + "' rows='10' cols='50'>Enter question HTML here</textarea><br>" +
        "<button id='button-html-question" + QUESTION_COUNT + "' type='button'>Insert question</button>"
    );

    var b = $(".button-html-question" + QUESTION_COUNT);
    if(b === [])
    {
        console.log("Couldn't find the button.");
    }
        //.click(insertHtmlQuestion);
    //    function() {
    //    var liId = '#html-question' + QUESTION_COUNT;
    //    var taId = '#textarea-html-question' + QUESTION_COUNT;
    //    insertHtmlQuestion(liId, taId);
    //});

    QUESTION_COUNT++;
}

function addAwesomeQuestion()
{
    var url = purl(); //Parse the current URL using the purl library
    var seed = parseInt(url.param("start"));

    var qJsonString = makeQuestionJsonString($('#awesomeQuestionType').val());
    $(".theQuestions").append('<li class="pa-question pa-question' + QUESTION_COUNT + ' pageBreakBefore" data-pa-params="'+ qJsonString +'" data-pa-showPts="true" data-pa-pts="10">');

    qJsonString = qJsonString.replace(/'/g, '"');
    var qJson = JSON.parse(qJsonString);
    var question = new Quiz(seed, qJson);

    $(".pa-question" + (QUESTION_COUNT++)).html("(10 pst) " + question.formatQuestionsHTML() + "<br>" + question.formatAnswersHTML());
}

function showHideAnswers()
{
    $(".pa-question-answer").each( function()
    {
        $(this).toggle();
    });
}

	
$(document.body).ready(function () {
	
	var ec = new ExamContext();

	var url = purl(); //Parse the current URL using the purl library
	    
	var startExamNum = parseInt(url.param("start"));
	var examCount = parseInt(url.param("count"));

    addOptionForEachQuestionType($("#awesomeQuestionType"));
    //updateAwesomeQuestions(startExamNum);

    $("#htmlQuestionButton").click(addHtmlQuestion);
    $("#awesomeQuestionButton").click(addAwesomeQuestion);
    $("#showHideKey").click(showHideAnswers);

	$(".showAnswerKey").click(function(){
		ec.showAnswerKey();
	    });
	
	
	$(".makeCopies").click(function(){
		$(this).css("background-color","red");
		$("#containerCopies").empty();
		$("#container").each(function (j) { 
			console.log("#container j=" + j); 
			console.log("startExamNum=" + startExamNum + " examCount=" + examCount); 
			
			for (var i=startExamNum; i<startExamNum+examCount; i++) { 
			    $(this).clone().removeAttr("id").addClass("containerCopy").data("sequence",i).appendTo("#containerCopies");
			}
		    });
		$(".containerCopy").each( function(k) {
		     var sequence = $(this).data("sequence");
		     console.log(".containerCopy k=" + k + " sequence=" + sequence);


		     $(this).find("ol.theQuestions li").each( function(i) {
			     console.log("setting questionNum to " + (i+1));
			     $(this).data("questionNum",i+1);
			     $(this).find(".continued").data("questionNum",i+1);
			 });

		     $(this).find(".awesome").each( function (n) {
			     var theJson = $(this).data("awesome-json");
			     console.log(".awesome n= " + n + 
					 " sequence=" + sequence + " json=" + theJson);
			     var thisQuiz = new Quiz(sequence,json);
			     $(this).append(thisQuiz.formatQuestionsHTML +
                               "<div class='answerKey'>" +
					    thisQuiz.formatAnswersHTML +
					    "</div>");
			 });

		 $(this).find(".pageBreakBefore").each( function(n) {
		     var theHTML = generatePageHeader(sequence, n+1);
		     console.log("pageBreakBefore n= " + n + " sequence=" + sequence);
		     console.log("pageBreakBefore, theHTML=" + theHTML);
		     $(this).before(theHTML);
                             $(this).before($('<hr/>', {class: 'pageHeader'}));

		      }); 

		     $(this).find(".continued").each( function(n) {
			     console.log("continued n= " + n + " sequence=" + sequence);
			     var qNum = $(this).data("questionNum");
			     $(this).before($('<p/>', {class: 'continuedLabel',
					     text: "Extra space for answer to question " + qNum
					     }));


		      }); 

		     var text= $(this).contents().text();
		     var totalPoints = pointCountText(text);
		     console.log("Found: " + text + " totalPoints=" + totalPoints);

		     $(this).find(".pointCount").text("total points=" + totalPoints);

		 });

	     
	 });

	

     
	
    }); // document.body ready function


