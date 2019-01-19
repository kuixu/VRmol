<?php
define('PGHOST','192.168.1.200');
define('PGPORT',5432);
define('PGDATABASE','btcppi');
define('PGUSER', 'postgres');
define('PGPASSWORD', '');
define('PGCLIENTENCODING','UNICODE');
define('ERROR_ON_CONNECT_FAILED','Sorry, can not connect the database server now!');
// ==================================== method 1 ============================================
$dbconn=pg_pconnect('host=' . PGHOST . ' port=' . PGPORT . ' dbname=' . PGDATABASE . ' user=' . PGUSER . ' password=' . PGPASSWORD);
//$dbconn = pg_connect("host=localhost dbname=publishing user=www password=foo")
    //or die('Could not connect: ' . pg_last_error());
$query="SELECT * FROM mu_tcga_42 limit 1;"; 
$result = pg_query($query) or die('Query failed: ' . pg_last_error());


// Printing results in HTML
echo "<table>\n";
while ($line = pg_fetch_array($result, null, PGSQL_ASSOC)) {
    echo "\t<tr>\n";
    foreach ($line as $col_value) {
        echo "\t\t<td>$col_value</td>\n";
    }
    echo "\t</tr>\n";
}
echo "</table>\n";

// Free resultset
pg_free_result($result);

// Closing connection
pg_close($dbconn);


// ==================================== method 2 ============================================
include_once 'PgsqlConn.php';
$db=new DBconn();
$sql="SELECT * FROM mu_tcga_42 limit 1;";
$get_array=$db->get_rows($sql);
var_dump($get_array);
$sql="insert into tb_test2 (id,name,time) values (2,'xk','2016-01-27 08:47:08');";
//echo -e "\n";
//$get_array=$db->changeRow2($sql);
//var_dump($get_array);
?>
