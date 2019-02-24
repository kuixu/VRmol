<?php
//
// Created by Kui XU on 2017/08/08.
// mail: xukui.cs@gmail.com
//
define('PGHOST','192.168.1.200');
define('PGPORT',5432);
define('PGDATABASE','btcppi');
define('PGUSER', 'postgres');
define('PGPASSWORD', '');
define('PGCLIENTENCODING','UNICODE');
define('ERROR_ON_CONNECT_FAILED','Sorry, can not connect the database server now!');

class DBconn{
		var $conn=false;
		//connect database
		function __construct(){
			//$this->conn=pg_connect("host=192.168.1.105 dbname=dbppi user=postgres password=''");
			$this->conn=pg_pconnect('host=' . PGHOST . ' port=' . PGPORT . ' dbname=' . PGDATABASE . ' user=' . PGUSER . ' password=' . PGPASSWORD);
		}
		// get multi-line data
		function get_rows($sql){
			if($result = pg_query($sql)){
				$rows=null;
				while ($row = pg_fetch_array($result, null, PGSQL_ASSOC)) {
					$rows[] = $row;
				}
				pg_free_result($result);
				//$this->close();
				return $rows;
			}
			//if($result=mysql_query($sql)){
			//	while($row=mysql_fetch_array($result)){
			//		$rows[] = $row;
			//	}
			//	return $rows;
			//}
			//$this->close();
			return false;
		}
		// get single-line data
		function get_row($sql){
			if($result=pg_query($sql)){
				$row=pg_fetch_array($result);
				return $row;
			}
			return false;
		}
		// add change, no change with fail
		function changeRow1($sql){
			$result=pg_query($sql);
			if(!$result||pg_affected_rows()==0){
				//$this->close();
				return false;
			}
			//$this->close();
			return true;
		}
		// add change, no change with success
		function changeRow2($sql){
			$result=pg_query($sql);
			if(!$result){
				//$this->close();
				return false;
			}
			//$this->close();
			return true;
		}
		//close db
		function close(){
			if($this->conn){
				pg_close($this->conn);
			}
		}
	}
