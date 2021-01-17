<?php


function connectToServer() {

	$link = mysqli_connect("localhost", "root", "", "productdb");
	if ($link==null)
		die ('Αδυναμία σύδεσης: ' . mysqli_connect_error());

	mysqli_set_charset($link, "utf8"); 
	
	return $link;
}
// meiwsa ligo to height
function printCanvas(){
?>


<canvas id='gamecanvas' width="1920" height="1000">
</canvas>
<?php
}


//Τύπωμα των κατηγοριών
function printCategories() {
	
	//Συνδέσου με τον server
	$link = connectToServer();
	
	//Εκτέλεσε το ερώτημα
	$sqlquery = "select * from categories";
	$sqlres = mysqli_query($link, $sqlquery);
	//Αν δεν εκτελέστηκε σωστά, τύπωσε το λάθος 
	//και σταμάτησε το script
	if ($sqlres==null)
		die('Δεν μπορώ να επιλέξω τις κατηγορίες ' . mysqli_error($link));
	
	//Πάρε τον αριθμό των εγγραφών που επιλέχτηκαν
	$nr = mysqli_num_rows($sqlres);
	
	echo "<label for='category'>Κατηγορία:</label>";
	echo "<select name='category'>";
	
	for ($i=0; $i<$nr; ++$i) {
		$row = mysqli_fetch_array($sqlres);
		echo "<option value='" . $row["id"] . "'>" . $row["name"] ."</option>";
	}
	echo "</select><br />";
	
	mysqli_close($link);
	
}


function registerUser($username, $pwd, $photopath) {
	//Συνδέσου με τον server
	$link = connectToServer();
	
	
	$sqlquery = "select from users where username='" . $username . "'";
	$sqlres = mysqli_query($link, $sqlquery);
	//Αν δεν εκτελέστηκε σωστά, τύπωσε το λάθος 
	//και σταμάτησε το script
	if ($sqlres==null)
		die('Δεν μπορώ να επιλεξω τους χρήστες' . mysqli_error($link));
	
	//Πάρε τον αριθμό των εγγραφών που επηρρεάστηκαν
	$nr = mysqli_affected_rows($link);
	if(nr>0){
		mysqli_close($link);
		echo "<strong>Name already taken </strong>";
		return;
	}
	// an den uparxei xrhsths sunexise thn egrafh
	
	
	
	
	
	$hashpwd = password_hash($pwd, PASSWORD_DEFAULT);
	//Εκτέλεσε το ερώτημα
	$sqlquery = "insert into users (username, password, photo) values ('$username', '$hashpwd', '$photopath')";
	$sqlres = mysqli_query($link, $sqlquery);
	//Αν δεν εκτελέστηκε σωστά, τύπωσε το λάθος 
	//και σταμάτησε το script
	if ($sqlres==null)
		die('Δεν μπορώ να εισάγω τον χρήστη ' . mysqli_error($link));
	
	//Πάρε τον αριθμό των εγγραφών που επηρρεάστηκαν
	$nr = mysqli_affected_rows($link);	
	if ($nr==1) {
		echo "<p>Η εγγραφή σας έγινε, παρακαλώ συνδεθείτε για πλήρη δικαιώματα.</p>";
		mysqli_close($link);
		return true;
	}
	else {
		echo "<p>Η εγγραφή σας δεν έγινε!</p>";
		mysqli_close($link);
		return false;
	}
		
}


function insertProduct($prod, $quant, $price, $categ) {
	//Συνδέσου με τον server
	$link = connectToServer();
	$prod = mysqli_real_escape_string($link, $prod);
	$quant = mysqli_real_escape_string($link, $quant);
	$price = mysqli_real_escape_string($link, $price);
	$categ = mysqli_real_escape_string($link, $categ);
	
	//Εκτέλεσε το ερώτημα
	$sqlquery = "insert into products (name, price, quantity, catid) values ('$prod', $price, $quant, $categ)";
	$sqlres = mysqli_query($link, $sqlquery);
	//Αν δεν εκτελέστηκε σωστά, τύπωσε το λάθος 
	//και σταμάτησε το script
	if ($sqlres==null)
		die('Δεν μπορώ να εισάγω το προϊόν ' . mysqli_error($link));
	
	//Πάρε τον αριθμό των εγγραφών που επηρρεάστηκαν
	$nr = mysqli_affected_rows($link);	
	if ($nr==1) {
		echo "<p>Το προϊόν εισήχθει !</p>";
		mysqli_close($link);
		return true;
	}
	else {
		echo "<p>Το προϊόν δεν εισήχθει !</p>";
		mysqli_close($link);
		return false;
	}	
}

//Τύπωμα των προϊόντων
function printProducts() {
	
	//Συνδέσου με τον server
	$link = connectToServer();
	
	//Εκτέλεσε το ερώτημα
	$sqlquery = "select * from products";
	$sqlres = mysqli_query($link, $sqlquery);
	//Αν δεν εκτελέστηκε σωστά, τύπωσε το λάθος 
	//και σταμάτησε το script
	if ($sqlres==null)
		die('Δεν μπορώ να επιλέξω τα προϊόντα ' . mysqli_error($link));
	
	//Πάρε τον αριθμό των εγγραφών που επιλέχτηκαν
	$nr = mysqli_num_rows($sqlres);
	
	echo "<table>";
	echo "<tr><th>Κωδικός</th><th>Όνομα</th><th>Τιμή</th><th>Ποσότητα</th><th>Κατηγορία</th></tr>";
	
	for ($i=0; $i<$nr; ++$i) {
		$row = mysqli_fetch_array($sqlres);
		echo "<tr>";
		echo "<td>" . $row["id"] . "</td>";
		echo "<td>" . $row["name"] . "</td>";
		echo "<td>" . $row["price"] . "</td>";
		echo "<td>" . $row["quantity"] . "</td>";
		echo "<td>" . $row["catid"] . "</td>";
		echo "</tr>";
	}
	echo "</table><br />";
	
	mysqli_close($link);
	
}
//tupoma gia diaxeirhsh
function printProductsForms() {
	
	//Συνδέσου με τον server
	$link = connectToServer();
	
	//Εκτέλεσε το ερώτημα
	$sqlquery = "select * from products";
	$sqlres = mysqli_query($link, $sqlquery);
	//Αν δεν εκτελέστηκε σωστά, τύπωσε το λάθος 
	//και σταμάτησε το script
	if ($sqlres==null)
		die('Δεν μπορώ να επιλέξω τα προϊόντα ' . mysqli_error($link));
	
	//Πάρε τον αριθμό των εγγραφών που επιλέχτηκαν
	$nr = mysqli_num_rows($sqlres);
	
	//echo "<table>";
	//echo "<tr><th>Κωδικός</th><th>Όνομα</th><th>Τιμή</th><th>Ποσότητα</th><th>Κατηγορία</th></tr>";
	
	for ($i=0; $i<$nr; ++$i) {
		$row = mysqli_fetch_array($sqlres);
		echo "<form class='prodform' action='index.php?page=3' method='post'>\n";
		echo "<input type='hidden' name='pid' value='" . $row["id"] . "'>\n";
		echo "<label class='pname'>" . $row["name"] . "</label>\n";
		echo "<label>" . $row["price"] . "</label>\n";
		echo "<input name='quant' type='number' value='" . $row["quantity"] . "'>\n";
		echo "<label>" . $row["catid"] . "</label>\n";
		echo "<input type='submit' value='Update'>\n";
		echo "<a href='index.php?page=3&removeprod=" . $row['id'] . "'><button>Delete</button></a>";
		echo "</form>";
	}
	//echo "</table><br />";
	
	mysqli_close($link);
	
}

function processProdForm(){
	if(isset($_GET['removeprod'])){
		$link = connectToServer();
		
		$sqlquery = "Delete from products where id=" . $_GET['removeprod'];
		$sqlres = mysqli_query($link, $sqlquery);
		
		if ($sqlres==null)
			die('No product deleted ' . mysqli_error($link));
		mysqli_close($link);
	}
	if(isset($_POST['pid'])){
		$link = connectToServer();
		
		$sqlquery = "update products set quantity=" . $_POST['quant'] . " where id=" . $_POST['pid'];
		$sqlres = mysqli_query($link, $sqlquery);
		
		if ($sqlres==null)
			die('No product updated ' . mysqli_error($link));
		mysqli_close($link);
	}
	
	
}



function checkLogin($u, $p) {
	//Συνδέσου με τον server
	$link = connectToServer();
	
	//Εκτέλεσε το ερώτημα
	$sqlquery = "select * from users where username='" . $u . "'";
	$sqlres = mysqli_query($link, $sqlquery);
	//Αν δεν εκτελέστηκε σωστά, τύπωσε το λάθος 
	//και σταμάτησε το script
	if ($sqlres==null)
		die('Δεν μπορώ να επιλέξω τους χρήστες ' . mysqli_error($link));
	
	//Πάρε τον αριθμό των εγγραφών που επιλέχτηκαν
	$nr = mysqli_num_rows($sqlres);	
	
	if ($nr==1) {
		$row = mysqli_fetch_array($sqlres);
		
		if (password_verify($p, $row['password'])) {
			$_SESSION['user'] = $row['username'];
			$_SESSION['photo'] = $row['photo'];
			mysqli_close($link);
			return true;
		}
		else {
			mysqli_close($link);
			return false;
		}
	}
	else {
		mysqli_close($link);
		return false;
	}
	
}


