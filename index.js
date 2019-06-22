function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

function genCharArray(charA, charZ) {
    var a = [], i = charA.charCodeAt(0), j = charZ.charCodeAt(0);
    for (; i <= j; ++i) {
        a.push(String.fromCharCode(i));
    }
    return a;
}


var elements = 0;
var origOptions = 4;
var options = 4;
var allOptions = [];
var answer = [];
var finalAnswer;
var finalShuffle = [];
var ans;
var seconds = 400;
var timing;
var selecting;
var currentStreak = 0;
var maxperrow = 5;
var maxCards = 26;
var showLetters = false;
var letters = [];
var help = 3;

        

$(document).ready(function(){
    
    showAnimation();
       
    $("#help, #helpDash, #helpCount").hide();
    
    $("#checkLight").on("change", function(){
        var showLight = $("#checkLight").is(":checked");
        switchTheme(showLight);
    })
    
    $(window).on("click", function(e){
        if(e.target.classList[0] == "startButton"){
            return;
        }
        
        var target = $(e.target);    
        if (target.parents('div#settingsPage').length) {
            return;
        }
        
        if((parseInt($("#settingsPage").css("left").replace("px")) == 0) && ($("#settingsPage").is(":visible"))){
                toggleSettings();
           }
    })
    
    if(localStorage.getItem("elements") == undefined || localStorage.getItem("elements") == null){
        elements = 2;
        localStorage.setItem("elements", elements);
    }else{
        elements = parseInt(localStorage.getItem("elements"));
        elements = elements > maxCards ? maxCards : elements;
    }
    
    $("#elements").text(elements);
    
    if(localStorage.getItem("help") == undefined || localStorage.getItem("help") == null){
        help = 3;
        localStorage.setItem("help", help);
    }else{
        help = parseInt(localStorage.getItem("help"));
    }
    $("#helpCount").text(help);
    
    if(localStorage.getItem("currentStreak") == undefined || localStorage.getItem("currentStreak") == null){
        currentStreak = 0;
        localStorage.setItem("currentStreak", currentStreak);
    }else{
        currentStreak = parseInt(localStorage.getItem("currentStreak"));
    }
    
    if(localStorage.getItem("wantSound") == undefined || localStorage.getItem("wantSound") == null){
        $("#checkSounds").click();
        localStorage.setItem("wantSound", 1);
    }else{
        var wantSound = parseInt(localStorage.getItem("wantSound"));
        if(wantSound == "1"){
            $("#checkSounds").click();
        }
    }
    
    $("#checkSounds").on("change", function(){
        var wantSounds = $("#checkSounds").is(":checked");
        wantSounds = wantSounds == true ? 1 : 0;
        localStorage.setItem("wantSound", wantSounds);
        if(wantSounds == 0){
            var audio = $('audio').get(0);
            audio.pause();
        }
    })
    
    $("#switchAlpha").on("click", function(){
        showLetters = $("#checkAlpha").is(":checked");
    })
    
    //elements = parseInt($("#elements").text());
    options = elements == 2 ? 2 : origOptions;
    $("#remainToPass").text(needToPass() - currentStreak);
    $("#playAgain").hide();
    letters = genCharArray('a', 'z');
    letters.unshift("");
})

function showAnimation(){
    changeColor();
    var par = $("#slogan").width();
    var child = $("#slogan span").width();
    var mrg = parseInt((par - child)/2);
    $("#slogan span").css("margin-left", mrg + "px");
    
    var height = $("#slogan").height();
    $("#slogan").css("height", height + "px")
    $("#slogan").addClass("animate");
    $("#slogan").css("opacity", 1);

    setTimeout(function(){
       $(".splash").remove();
    },4000);
}

function needToPass(){
    var pass = elements;
    if(elements > 5 && elements < 6){
        pass = 5;
    }else if(elements >= 6 && elements < 13){
        pass = 3;
        seconds = 600;
    }else if(elements >= 13){
        pass = 2;
        seconds = 1000;
    }
    return pass;
}

function stopAnimations(){
    var myDiv = $( ".box" );
    myDiv.clearQueue();
    myDiv.stop();
    clearTimeout(selecting);
    clearTimeout(timing);
    index = 0;
}

function generateNumbers(){
    if($("#firework-canvas").length > 0){
        $("#firework-canvas").remove();
   	    cancelAnimationFrame(loop);    
    }
    
    if($("#checkSounds").is(":checked")){
        var audio = $('audio').get(0);
        audio.play();
    }
    
    elements = parseInt($("#elements").text());
    elements = elements > maxCards ? maxCards : elements;
    stopAnimations();
    allOptions = [];
    finalShuffle = [];
    answer = [];
    $("#answers").empty();
    $("#rightAns").empty();
    $(".ansText").hide();
    $("#playAgain").hide();
    
    //$("#testAns, #options, #boxes").empty();
    $("#options, #boxes").empty();
    for(var i = 0; i < elements; i++){
        var num = i + 1;
        var display = "";
        if(showLetters){
            display = letters[num];
        }else{
            display = num;
        }
        
        answer.push(display + "*");
        
        var half = parseInt(elements / 2);
        //create box
        var width = 85 / maxperrow;
        
        
        var box = $("<div class='box' id='box-" + display + "'>" + display + "</div>");
        $(box).css("width", width + "%");
        $(box).on("click", function(e){
            e.preventDefault();
            clickBox(this);
        })
        $("#boxes").append(box);
        if (num % maxperrow == 0) {
            $("#boxes").append($("<div class='separator'></div>"));
        }
    }
    //set height and font-size of box
    var hgt = Math.ceil((($("#boxes").height() / $(window).height()) * 100) * 0.8);
    var dividers = $(".separator").length + 1;
    hgt = Math.ceil((hgt / dividers));
    var font = Math.floor(hgt/2);
    font = font > 5 ? 5 : font;
    $(".box").css("height", hgt + "vh");
    $(".box").css("font-size", font + "vh");
    
    ans = answer.join("");
    //allOptions.push(ans);
    options = elements == 2 ? 2 : origOptions;
    generateOptions();
    finalAnswer = allOptions[allOptions.length - 1];
    //$("#testAns").text(finalAnswer);
    finalShuffle = shuffle(allOptions);
    //createOptions(finalShuffle);
    timing = setTimeout(blinkLight, seconds);
}

function generateOptions(){
    while(allOptions.length != options){
        var newOpt = shuffle(answer);
        newOpt = newOpt.join("");
        if(allOptions.indexOf(newOpt) == -1){
            allOptions.push(newOpt);
        }
    }
}

function createOptions(create){
   for(var i = 0; i < create.length; i++) {
       var passed = false;
       passed = create[i] == finalAnswer ? true : passed;
       var opt = $("<button class='option " + passed + "'>" + create[i].split("").join("**") + "</button>");
       $(opt).on("click", function(e){
           e.preventDefault();
           if($(this).hasClass(true)){
               alert("passed");
               $(".box").removeClass("select");
               currentStreak += 1;
               $("#remainToPass").text(elements - currentStreak);
               if(elements == currentStreak){
                  alert("moved to new level"); 
                  elements += 1
                    $("#elements").text(elements);
                    currentStreak = 0;
                    $("#remainToPass").text(elements - currentStreak);
                   
               }
               index = 0;
               generateNumbers();
           }else{
               alert("missed");
               generateNumbers();
           }
       })
       $("#options").append(opt);
   }
}

var color = ["#000022","#191938","#32324e","#f40000","#c10000","#58C9C9","#000022","#191938","#32324e","#f40000","#c10000","#0000220",
             "#000022","#191938","#32324e","#f40000","#c10000","#58C9C9","#000022","#191938","#32324e","#f40000","#c10000","#0000220",
             "#000022","#191938","#32324e","#f40000","#c10000","#58C9C9","#000022","#191938","#32324e","#f40000","#c10000","#0000220"];

var colors1 = ["#0659a9", "#0094de", "#83c0ed", "#ff9e8b", "#fe664e","#0659a9", "#0094de", "#83c0ed", "#ff9e8b", "#fe664e","#0659a9", "#0094de", "#83c0ed", "#ff9e8b", "#fe664e","#0659a9", "#0094de", "#83c0ed", "#ff9e8b", "#fe664e","#0659a9", "#0094de", "#83c0ed", "#ff9e8b", "#fe664e","#0659a9", "#0094de", "#83c0ed", "#ff9e8b", "#fe664e" ];

var colors = ["#192EB5", "#1D65A6", "#72A2C0","#f40000", "#c10000","#192EB5", "#1D65A6", "#72A2C0","#f40000", "#c10000","#192EB5", "#1D65A6", "#72A2C0","#f40000", "#c10000","#192EB5", "#1D65A6", "#72A2C0","#f40000", "#c10000","#192EB5", "#1D65A6", "#72A2C0","#f40000", "#c10000","#192EB5", "#1D65A6", "#72A2C0","#f40000", "#c10000",]
var index = 0;
function blinkLight(){
    var seq = finalAnswer.split("*");
    if(index <= elements - 1){
        //$(".box").removeClass("select");
        $("#box-" + seq[index]).addClass("select");
        $("#box-" + seq[index]).css("background-color", colors[index]);
        //$("#box-" + seq[index]).addClass("selected");
        index += 1;
        var timer = seconds; //  / elements
        
        selecting = setTimeout(blinkLight, timer);
    }else{
        //$(".box").removeClass("select");
        $("#help, #helpDash, #helpCount").show();
        index = 0;
        
        if($("#checkSounds").is(":checked")){
            var audio = $('audio').get(0);
            audio.pause();
        }
    }
}

function changeColor(){
    var text = $("#memorize").find("span").text().split("");
    $("#memorize").find("span").remove();
    for (var i = 0; i < text.length; i++){
        var l = text[i];
        var span = $("<span class='eachLet'>" + l + "</span>");
        $(span).css("color", colors[i]);
        $("#memorize").append(span);
    }
}

function showAgain(){
    $(".box").removeClass("select");
    timing = setTimeout(blinkLight, 500);
}

function clickBox(box){
    
    if($("#checkSounds").is(":checked")){
        var audio = $('audio').get(1);
        audio.play();
    }
    
     if($("#playAgain").is(":visible")){
        return;
    }
    var boxLen = $(".box").length;
    var selectLen = $(".select").length;
    if(boxLen == selectLen){
        if($(box).hasClass("clicked")){
            $(box).removeClass("clicked");
            var id = $(box).attr("id").replace("box-", "");
            $("#ans-" + id).remove();
           return;
        }
        var text = $(box).attr("id").replace("box-", "");
        var color = $(box).css("background-color");
        $(box).addClass("clicked");
        userSelect(text, color);
    }
    
}

function userSelect(num, color){ 
    var width = Math.ceil((($("#answers").width() / $(window).width()) * 100) * 0.72);
    width = Math.floor(width/elements);
    width = width > 10 ? 10 : width;
    width = width < 2.8 ? 2.8 : width;
    var box = $("<div class='ans' id='ans-" + num + "'>" + num + "</div>");
    $(box).css("width", width + "vw");
    $(box).css("background-color", color);
    var font = (width/3) < 2.5 ? 2.5 : (width/3);
    $(box).css("font-size", font + "vw");
    $(box).on("click", function(e){
        e.preventDefault();
            removeBox(this);
        })
    $("#answers").append(box);
    
    //check complete selection
    var ansLen = $(".ans").length;
    var boxLen = $(".box").length;
        if(boxLen == ansLen){
            setTimeout(checkAnswer, 200);
        }
}

function removeBox(box){
    
    if($("#checkSounds").is(":checked")){
        var audio = $('audio').get(1);
        audio.play();
    }
    
    if($("#playAgain").is(":visible")){
        return;
    }
    var id = $(box).attr("id").replace("ans-", "");
    $("#box-" + id).removeClass("clicked");
    $(box).remove();
}

function checkAnswer(){
    var correctAnswer = finalAnswer.split("*").join("");
    var userAnswer = $(".ans").text();
    if(correctAnswer == userAnswer){
        if(needToPass() != (currentStreak + 1)){
        	//alert("correct");
            showPassButton("Correct", false);
            help += 2;
        }
        
         currentStreak += 1;
        $("#remainToPass").text(needToPass() - currentStreak);
               if(needToPass() == currentStreak){
                   if(elements >= maxCards){
                       //alert("You have reached the max level. Congrats!!!"); 
                       showPassButton("Max level reached. Congrats", true);
                   }else{
                       //alert("moved to new level"); 
                       showPassButton("Proceed to next level", true);
                       help += 3;
                   }
                  
                  elements += 1;
                   elements = elements > maxCards ? maxCards : elements;
                    $("#elements").text(elements);
                    currentStreak = 0;
                    $("#remainToPass").text(needToPass() - currentStreak);
                   
               }
               index = 0;
                
                localStorage.setItem("currentStreak", currentStreak);
                localStorage.setItem("elements", elements);
                localStorage.setItem("help", help);
                $("#helpCount").text(help);
               //generateNumbers();
    }else{
        //alert("wrong");
        //$("#answers").empty();
        showRightAnswer();
        //generateNumbers();
    }
}

function showRightAnswer(){
    var ans = finalAnswer.split("*").filter(Boolean);
    var width = Math.ceil((($("#rightAns").width() / $(window).width()) * 100) * 0.72);
    width = Math.floor(width/elements);
    width = width > 10 ? 10 : width;
    width = width < 2.8 ? 2.8 : width;
    for(var i = 0; i < ans.length; i++){
        var box = $("<div class='ans corAns'>" + ans[i] + "</div>");
        $(box).css("width", width + "vw");
        var font = (width/3) < 2.5 ? 2.5 : (width/3);
        $(box).css("font-size", font + "vw");
        $("#rightAns").append(box);
    }
    $(".ans").css("background","darkred");
    $(".ansText").show();
    $("#help, #helpDash, #helpCount").hide();
    $("#playAgainButton").text("Incorrect, try again");
    $("#playAgainButton").removeClass("passed").addClass("wrong");
    $("#playAgain").css("display","table").fadeIn("slow");

}

function showPassButton(text, anim) {
    if(anim){
        showFire();
    }
	
	$("#playAgainButton").addClass("fire");
    $("#playAgainButton").text(text);
    $("#playAgainButton").removeClass("wrong").addClass("passed");
    $("#playAgain").css("display","table").fadeIn("slow");
    $("#help, #helpDash, #helpCount").hide();
   }

   function clearFire() {
   	generateNumbers();
    $("#firework-canvas").remove();
   	cancelAnimationFrame(loop);
   }

function clue(){
    if($(".select").length != elements){
        return;
    }
    
    if(help <= 0){
        alert("Help exhausted!!!");
        return;
    }
    help -= 1;
    $("#helpCount").text(help);
    
    var helpAvail = false;
    var correctAnswer = finalAnswer.split("*").join("").split("");
    var userWrongAnswer = $(".ans").text();
    var userAnswer = $(".ans").text().split("");
    if(userAnswer == ""){
        var first = finalAnswer.split("*").join("").split("")[0];
        $("#box-" + first).click();
        return;
    }
    $(".ans").click();
    for(var i = 0; i < correctAnswer.length; i++){
        if((i + 1) > userAnswer.length && help == false){
            var text = correctAnswer[i];
            $("#box-" + text).click();
            helpAvail = true;
            return;
        }
        
        if(userAnswer[i] != correctAnswer[i]){
            if(!helpAvail){
               var text = correctAnswer[i];
                $("#box-" + text).click();
                helpAvail = true; 
            }else{
                break;
            }
            
        }else{
            var text = correctAnswer[i];
            $("#box-" + text).click();
        }
    }
}

function switchTheme(white){
    if(white){
       $("body").css({
        "background":"ghostwhite",
        "color": "black"
    });
        $("#settingsPage").removeAttr("style").css({
        "background":"black",
        "color": "white"
    });
    $(".startButton").addClass("white");
    $("#boxes").addClass("blackBox");
    $("#closeSettings").css("background", "turquoise");
    $("#answers").addClass("blackAnswers");
    $(".note").addClass("black");
    $("#helpDash").addClass("black");
    $("#helpCount").addClass("black"); 
    }else{
        $("body").removeAttr("style");
        $("#closeSettings").removeAttr("style");
        $("#settingsPage").removeAttr("style").css({
        "background":"white",
        "color": "black"
        });
        $(".startButton").removeClass("white");
        $("#boxes").removeClass("blackBox");
        $("#answers").removeClass("blackAnswers");
        $(".note").removeClass("black");
        $("#helpDash").removeClass("black");
        $("#helpCount").removeClass("black");
    }
    
}

function toggleSettings(){
    var w = $("#settingsPage").width();
    if(!$("#settingsPage").is(":visible")){
        $("#settingsPage").css("left",(0 - w) + "px");
        $("#settingsPage").show();
        
    }
    
    
    if(parseInt($("#settingsPage").css("left").replace("px")) == 0){
        $("#settingsPage").animate({left:(0 - w) + "px"},350);
    }else{
        $("#settingsPage").animate({left: "0px"},350);
    }
}

function resetGame(){
    var con = confirm("This will wipe all your records and start afresh, are you sure you want to do this?");
    if(con){
        if($("#firework-canvas").length > 0){
            $("#firework-canvas").remove();
   	        cancelAnimationFrame(loop);    
        }
        
        elements = 2;
        localStorage.setItem("elements", elements);
        $("#elements").text(elements);
        
        help = 3;
        localStorage.setItem("help", help);
        $("#helpCount").text(help);
        
        currentStreak = 0;
        localStorage.setItem("currentStreak", currentStreak);
        
        seconds = 400;
        
        options = elements == 2 ? 2 : origOptions;
    $("#remainToPass").text(needToPass() - currentStreak);
    $("#playAgain").hide();
    letters = genCharArray('a', 'z');
    letters.unshift("");
        toggleSettings();
        $("#boxes").empty();
        $("#answers").empty();
        $("#rightAns").empty();
        $(".ansText").hide();

        
        //generateNumbers();
    }
}
