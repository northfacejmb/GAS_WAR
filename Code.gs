//create player variables
var player_1_score;
var player_1_deck =[];
var player_1_discard =[];

var player_2_score;
var player_2_deck =[];
var player_2_discard =[];

//set active spreadsheet and get names for palyers
let ss = SpreadsheetApp.getActiveSpreadsheet();
let sheet = ss.getSheetByName("Sheet1");
let p1Name = sheet.getRange("c2").getValue();
let p2Name = sheet.getRange("d2").getValue();

//create player objects
var player_1 = {name: p1Name,
                score: player_1_score,
                discard: player_1_discard,
                deck: player_1_deck};

var player_2 = {name: p2Name,
                score: player_2_score,
                discard: player_2_discard,
                deck: player_2_deck};


//function to setup the sheet. This will clear past games and shuffle the deck. 
function setup(){
  let ss = SpreadsheetApp.getActiveSpreadsheet();
let sheet = ss.getSheetByName("Sheet1");

//get a deck of cards from the new Deck ucntion
var deck = newDeck();

//shuffle the deck!
deck = shuffle(deck);
//console.log("The deck has been shuffled")
sheet.getRange("a1").setValue("The game of war. v1");
sheet.getRange("a2").setValue("the Deck has been shuffled")
 player_1.deck = deck.slice(0,Math.ceil(deck.length/2));
 player_2.deck = deck.slice(-Math.ceil(deck.length /2));
 player_1.discard = [];
 player_2.discard = [];
 player_1.score = 0      
  player_2_score = 0   

sheet.getRange(1,10).setValue(JSON.stringify(player_1));
sheet.getRange(1,11).setValue(JSON.stringify(player_2));
sheet.getRange(1,12).setValue(JSON.stringify([]));
//console.log(player_1.deck[0]);

   
console.log("We've split the deck. good luck!");
sheet.getRange("a3").setValue("We've split the deck. good luck!");
console.log(" the value of player_1 is: ");
sheet.getRange("a4").setValue("The value of player_1 deck is:");
console.log(player_1.deck)
sheet.getRange("b4").setValue(JSON.stringify(player_1.deck));
sheet.getRange("a5").setValue("The value of player_2 deck is:");
console.log(player_2.deck)
sheet.getRange("b5").setValue(JSON.stringify(player_2.deck));
sheet.getRange(9,1,sheet.getLastRow(),5).clear();
}

//console.log(player_1);

//this function will run the game 20 times
function runalot(){
  for( let i = 0 ; i < 20; i ++){
    setup();
    autoPlay();
  }
}
//auto play the game until you get to a battle, then pause and wait for user input. 
function autoPlaytoBattle(){
  let i = 1;
  var status = true;
// play but pause for battles
while(status == true){
//play without pausing
//while(status != false){
 status = play_hand();
  i++;
}
  let ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet3 = ss.getSheetByName("Logs");
    sheet3.getRange(sheet3.getLastRow(),2).setValue(i);

}
//auto play until the game is over and there is a winner. 
function autoPlayGame(){
  let i = 1;
  var status = true;
// play but pause for battles
//while(status == true){
//play without pausing
while(status != false){
 status = play_hand();
  i++;
}
  let ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet3 = ss.getSheetByName("Logs");
    sheet3.getRange(sheet3.getLastRow(),2).setValue(i);

}

//play a hand of the game. 
 function play_hand(){
    let ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName("Sheet1");
    sheet.insertRowAfter(8);
    let row = 9;
    let play         = sheet.getRange(row+1,1);
    let cell         = sheet.getRange(row+1,2);
    let winningstack = sheet.getRange(row+1,5);
    let cell2 = sheet.getRange(row+1,2);
    let winnings = JSON.parse(sheet.getRange(1,12).getValue());
    let player_1_var = sheet.getRange(1,10);
    let player_2_var = sheet.getRange(1,11);
    let gameOn = true;
   
    let player_1= JSON.parse(player_1_var.getValue());
    let player_2= JSON.parse(player_2_var.getValue());
//console.log(player_1);

 //function play_hand(player_1,player_2){
    if(player_1.deck.length == 0 || player_2.deck.length ==0){
        if (player_1.deck.length > player_2.deck.length){
        play.setValue("Game over").setBackground("Red");
        cell.setValue(player_1.name +" has won!");
             let sheet3 = ss.getSheetByName("Logs");
          sheet3.getRange(sheet3.getLastRow()+1,1).setValue(player_1.name);
        return false}
        else{play.setValue("Game over").setBackground("Red");
            cell.setValue(player_2.name +" has won!");
            let sheet3 = ss.getSheetByName("Logs");
            sheet3.getRange(sheet3.getLastRow()+1,1).setValue(player_2.name);
            
            sheet.getRange("C6:D6").getValues();
           
        return false}

    }else{
    
   //console.log(player_1);
    let p1_hand = player_1.deck.shift();
    let p2_hand = player_2.deck.shift();
    winnings = winnings.concat([p1_hand,p2_hand]);
    winnings = shuffle(winnings);
    //console.log(p1_hand);
    
    play.setValue(player_1.name + ": " + p1_hand.name + " of "+ p1_hand.suit +" vs "+player_2.name + ": " + p2_hand.name + " of " + p2_hand.suit);

    if(p1_hand.value == p2_hand.value){
            //pretty sure we don't need this block because of recursive logic
            /*if (cell2.getValue() == "Battle!"){
              //create winnings array
              sheet.getRange(1,12).setValue(JSON.stringify(winnings));
              winningstack.setValue(JSON.stringify(winnings));
              console.log(winnings);
              //play_hand();

            }*/
            //will only run on the first tie 
            //else
            {
              cell.setValue("Battle!").setBackground("RED");
              winnings = winnings.concat(player_1.deck.splice(0,4));
              winnings = winnings.concat(player_2.deck.splice(0,4));
              winnings = shuffle(winnings);
              sheet.getRange(1,12).setValue(JSON.stringify(winnings));
              console.log(winnings);
              winningstack.setValue(JSON.stringify(winnings));
              gameOn = "Battle" ;
              player_1_var.setValue(JSON.stringify(player_1));
              player_2_var.setValue(JSON.stringify(player_2));
              return gameOn;
             
             }
          
    }else {if(p1_hand.value > p2_hand.value){
        player_1.deck = player_1.deck.concat(winnings);
        cell.setValue(handWinner(player_1)).setBackground("turquoise");
        winningstack.setValue(JSON.stringify(winnings));
        sheet.getRange(1,12).setValue(JSON.stringify([]));
        console.log(winnings);
        //console.log(player_1.deck);
        

    }else{
        player_2.deck = player_2.deck.concat(winnings);
        cell.setValue(handWinner(player_2)).setBackground("pink");
        winningstack.setValue(JSON.stringify(winnings));
        sheet.getRange(1,12).setValue(JSON.stringify([]));
        console.log(winnings);
        //console.log(player_2.deck);

        
    }} 

  let sheet3 = ss.getSheetByName("Logs");
    //p1 deck size
    sheet.getRange(row+1,3).setValue(player_1.deck.length);
    sheet3.getRange("H4").setValue(player_1.deck.length);
    //p2 score deck size
    sheet.getRange(row+1,4).setValue(player_2.deck.length);
    sheet3.getRange("I4").setValue(player_2.deck.length);

        player_1_var.setValue(JSON.stringify(player_1));
        player_2_var.setValue(JSON.stringify(player_2));

    }

    return gameOn
}


//let scoreboard = [player_1.name +" " + player_1.score,player_2.name + " " + player_2.score];

//this function shuffles an array of cards
function shuffle(deck){
    let m = deck.length, t,i;

    // while there remain elements to shuffle.
    while(m != 0 ){
        //pick a remaining element.
        i = Math.floor(Math.random() * m--);
        //and swap it with the current element.
        t = deck[m];
        deck[m] = deck[i];
        deck[i]= t;
    }
    return deck
}

//this function returns the winner of the hand and the current score
function handWinner(winner) {

return winner.name + " wins.";
} 

//this function creates a deck of cards
function newDeck(){
    var deck2 = new Array();   
   
   for (let i = 2; i <= 14; i++){
     card(i,"red","Hearts",deck2);
     card(i,"black","Spaids",deck2);
     card(i,"black","Clubs",deck2);
     card(i,"red","Diamonds",deck2);
   }
   
   function card(i,c,s,deck2){
   
   let n = "";
   switch(i){
     case 14 : n = "Ace"; 
     break;
     case 11 : n = "Jack";
     break;
     case 12 : n = "Queen";
     break;
     case 13 : n = "King";
     break;
     default: n = i;
       }
   let card = {value: i,
               color: c,
               suit: s,
               name: n};
   deck2.push(card);
   
   return deck2
   }
   
   return deck2}


