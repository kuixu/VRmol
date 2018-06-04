<?php
	define('PGHOST','192.168.1.200');
	define('PGPORT',5432);
	define('PGDATABASE','btcppi');
	define('PGUSER', 'postgres');
	define('PGPASSWORD', '');
	define('PGCLIENTENCODING','UNICODE');
	define('ERROR_ON_CONNECT_FAILED','Sorry, can not connect the database server now!');

	class DBconn{
		var $conn=false;
		//连接数据库
		function __construct(){
			//$this->conn=pg_connect("host=192.168.1.105 dbname=dbppi user=postgres password=''");
			$this->conn=pg_pconnect('host=' . PGHOST . ' port=' . PGPORT . ' dbname=' . PGDATABASE . ' user=' . PGUSER . ' password=' . PGPASSWORD);
		}
		//获取数据库中的多条记录
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
		//获取单条记录
		function get_row($sql){
			if($result=pg_query($sql)){
				$row=pg_fetch_array($result);
				return $row;
			}
			return false;
		}
		//增删改方法1（如果改的时候没有改变原有记录就弹修改失败窗口）
		function changeRow1($sql){
			$result=pg_query($sql);
			if(!$result||pg_affected_rows()==0){
				//$this->close();
				return false;
			}
			//$this->close();
			return true;
		}
		//增删改方法2（如果根本没有改，也会弹修改成功的窗口）
		function changeRow2($sql){
			$result=pg_query($sql);
			if(!$result){
				//$this->close();
				return false;
			}
			//$this->close();
			return true;
		}
		//关闭数据库
		function close(){
			if($this->conn){
				pg_close($this->conn);
			}
		}
	}
