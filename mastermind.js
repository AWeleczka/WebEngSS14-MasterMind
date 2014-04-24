/**
 * MasterMind Clone written in HTML5 with JavaScript
 * submission and PHP processing
 *
 * Clone of the commonly known game "Mastermind"
 * Featuring a HTML5-Compliant userinterface built upon Bootstrap
 * with jQuery-Based JavaScript-I/O-Processing
 * and PHP Game-Logic.
 * This Project was written as part of a practical exercise for the class
 * "Web-Engeneering" in the Summer Semester 2014 at Hochschule RheinMain
 *
 * @author     Alexander Weleczka <mail@AWeleczka.de>
 * @copyright  2014 Alexander Weleczka for WebEng006 SS14 HS-RM
 * @version    1.0
 */

var current_attempt = {};

/**
 * update the current_attempt color-array with the most recent selection
 * of a user, initiate processor-communication if all four colors are set
 */
function setColor(c) {
  if(current_attempt.c1 == null) {
    current_attempt.c1 = c;
    updateGuess(c, 'guess_1');
  } else if(current_attempt.c2 == null) {
    current_attempt.c2 = c;
    updateGuess(c, 'guess_2');
  } else if(current_attempt.c3 == null) {
    current_attempt.c3 = c;
    updateGuess(c, 'guess_3');
  } else if(current_attempt.c4 == null) {
    current_attempt.c4 = c;
    updateGuess(c, 'guess_4');

    submitGuess();
    resetGuess();
    rebuildGame();
  } else {
    console.log("Den Zustand haben wir nicht ... versucht da jemand zu mogeln?");
  }
}

/**
 * Update user frontend to represent the current color-selection
 */
function updateGuess(c, id) {
  $('#' + id).addClass(c);
  $('#' + id).removeClass('grey');
}

/**
 * Reset color-display and currently guessed colors
 */
function resetGuess() {
  current_attempt.c1 = null;
  current_attempt.c2 = null;
  current_attempt.c3 = null;
  current_attempt.c4 = null;

  $('[id^=guess_]').removeClass();
  $('[id^=guess_]').addClass('col-md-2 btn grey');
}

/**
 * Send guessed color to the processor and handle JSON-Response
 */
function submitGuess() {
  $.ajax({
    url: './processor.php?guess',
    type: "POST",
    async: false,
    data: current_attempt
  }).done(function(data) {
    current_attempt.data = data;
  });
}

/**
 * Send reset-Request to processor to generate a new color-combination
 * reset board to init-view
 */
function restartGame() {
  $.ajax({
    url: './processor.php?reset',
    async: false
  }).done(function(data) {
    current_attempt = {};
    $('#thegame').html('<div class="row"><div class="col-md-12"><h3>Ich habe mir was neues ausgedacht</h3><p>Du hast 12 Versuche!</p></div></div>');
    $('#remaining').html("12");
    $('#colSel').show(250);
  });
}
/**
 * Rebuild user frontend from JSON-Rsponse, update past guesses,
 * verify game-state and end game is nessacary
 */
function rebuildGame() {
  var json = $.parseJSON(current_attempt.data);
  var html = "";

  if(json.length < 12) {
    $.each(json, function(i, it) {
      html += '<div class="row">';
      html += '    <div class="col-md-2 btn ' +it.c1+ '">&nbsp;</div>';
      html += '    <div class="col-md-2 btn ' +it.c2+ '">&nbsp;</div>';
      html += '    <div class="col-md-2 btn ' +it.c3+ '">&nbsp;</div>';
      html += '    <div class="col-md-2 btn ' +it.c4+ '">&nbsp;</div>';
      html += '    <div class="col-md-4">' +it.cMatch+ ' Farben<br/>' +it.pMatch+ ' Positionen</div>';
      html += '</div>';
    });
    $('#remaining').html(12-json.length);

    if(json[json.length-1].pMatch == 4) {
      html += '<div class="row">';
      html += '    <div class="col-md-8"><button class="btn btn-primary btn-block" onclick="restartGame();">Neues Spiel</button></div>';
      html += '    <div class="col-md-4"><strong>WINNER</strong></div>';
      html += '</div>';
      $('#colSel').hide(250);
    }
  } else {
    $.each(json, function(i, it) {
      html += '<div class="row">';
      html += '    <div class="col-md-2 btn ' +it.c1+ '">&nbsp;</div>';
      html += '    <div class="col-md-2 btn ' +it.c2+ '">&nbsp;</div>';
      html += '    <div class="col-md-2 btn ' +it.c3+ '">&nbsp;</div>';
      html += '    <div class="col-md-2 btn ' +it.c4+ '">&nbsp;</div>';
      html += '    <div class="col-md-4">' +it.cMatch+ ' Farben<br/>' +it.pMatch+ ' Positionen</div>';
      html += '</div>';
    });
    
    html += '<div class="row">';
    html += '    <div class="col-md-8"><button class="btn btn-primary btn-block" onclick="restartGame();">Neues Spiel</button></div>';
    html += '    <div class="col-md-4"><strong>Game Over</strong></div>';
    html += '</div>';

    $('#colSel').hide(250);
  }
  
  $('#thegame').html(html);
}

//EOF