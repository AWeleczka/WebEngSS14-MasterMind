<?php
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

session_start();

/* Moegliche Farben */
$colors = array('rot', 'gruen', 'blau', 'gelb', 'lila', 'teal');

/*
 * Initialisierung der Farbkombination, falls no keine in der Session existiert
 */
if(!isset($_SESSION['code'])) {

    $solution = array();
    for($i = 1; $i <= 4; $i++) {
        $solution['c' . $i] = $colors[array_rand($colors)];
    }
    $_SESSION['code'] = json_encode($solution);

}

/*
 * Spieler hat eine Kombination geraten, pruefe eingabe
 */
if(isset($_GET['guess'])) {

    if(isset($_POST['data'])) {
        $guesses = json_decode($_POST['data']);
    } else {
        $guesses = array();
    }

    $guess = array('c1' => $_POST['c1'], 'c2' => $_POST['c2'], 'c3' => $_POST['c3'], 'c4' => $_POST['c4']);
    $original = json_decode($_SESSION['code'], TRUE);

    /* Bestimme uebereinstimmende Positionen zwischen der Originalkombination und der Benutzereingabe */
    $pMatch = 0;
    foreach($guess as $k => $g) {
        if($g == $original[$k]) {
            $pMatch++;
        }
    }

    /* Bestimme uebereinstimmende Farben zwischen der Originalkombination und der Benutzereingabe */
    $cMatch = 0;
    foreach($guess as $g) {
        if(in_array($g, $colors)) {
            foreach($original as $k => $o) {
                if($g == $o) {
                    $cMatch++;
                    unset($original[$k]);
                    break;
                }
            }
        }
    }
	
    $guess['pMatch'] = $pMatch;
    $guess['cMatch'] = $cMatch - $pMatch;

    /* Entferne doppelte eintraege (Farbe an richtiger position zaehlt nur einmalig als Position) */
    //$guess['cMatch'] = $guess['cMatch'] - $guess['pMatch'];

    array_push($guesses, $guess);
    echo json_encode($guesses);

/*
 * Spieler moechte das Spiel neu starten - erzeuge neue Farbkombination
 */
} else if(isset($_GET['reset'])) {

    $solution = array();
    for($i = 1; $i <= 4; $i++) {
        $solution['c' . $i] = $colors[array_rand($colors)];
    }
    $_SESSION['code'] = json_encode($solution);

}

//EOF