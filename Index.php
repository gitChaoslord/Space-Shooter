<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Star Command</title>
    <link rel="stylesheet" href="css/main.css">
</head>
<body>
    <menu>
        <ul class="menu">
            <li><a href="index.php?page=1">Play</a></li>
            <li><a href="index.php?page=2">Options</a></li>
            <li><a href="index.php?page=3">Highscores</a></li>
            <li><a href="index.php?page=4">Register</a></li>
		</ul>
	</menu><div id="mainpage">
		<div id="gameinfopanel">
			<div id="lives">3</div>
			<div id="Score">Score : 500</div>
			<div id="Timer">2m:31s</div>
		</div>
<?php 
include "sqlfunctions.php";

if (isset($_GET['page'])) {
	$choice = $_GET['page'];
	
	switch ($choice) {
			case "1":
				//echo "<h1>Play</h1>";
				printCanvas();
				break;
			case "2":
				echo "<h1>Options</h1>";
				break;
			case "3":
				echo "<h1>Highscores</h1>";
				break;
			case "4":
				echo "<h1>Register</h1>";
			break;
			default:
				echo "<h1>Play</h1>";
				break;
	}
}
else {
	echo "<h1>Play!</h1>";
}
?>
		
	</div>
</body>
<script src="Scripts/gamecode.js"></script> 
</html>