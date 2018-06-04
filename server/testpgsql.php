<?php
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
