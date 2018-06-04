<?php

class DBconn{
	var $conn=false;
  	function __construct($server='localhost'
  	     ,$username='rise2'
  	     ,$password='3hXmf5q81xFa'
  	     ,$db_name='rise'){
  	 	$this->conn=mysql_connect($server,$username,$password);
  	 	mysql_select_db($db_name);
  	 	mysql_query('set names utf8');
  	}
  	function get_rows($sql){
  	 	if($result=mysql_query($sql)){
  	 	 	while($row=mysql_fetch_array($result)){
  	 	 	 $rows[] = $row;
  	 	 	}
  	 	 	return $rows;
  	 	}
  	 	return false;
  	}
  	function get_row($sql){
  	 	if($result=mysql_query($sql)){
  	 	 	$row=mysql_fetch_array($result);
  	 	 	return $row;
  	 	}
  	 	return false;
  	}
  	function changeRow1($sql){
  	 	$result=mysql_query($sql);
  	 	if(!$result||mysql_affected_rows()==0){
  	 	 	return false;
  	 	}
  	 	return true;
  	}
  	function changeRow2($sql){
  	 	$result=mysql_query($sql);
  	 	if(!$result){
  	 	 	return false;
  	 	}
  	 	return true;
  	}
  	function close(){
  	 	if($this->conn){
  	 	 	mysql_close($this->conn);
  	 	}
  	}
 }


?>

