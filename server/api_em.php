<?php header('Access-Control-Allow-Origin: *');
//
// Created by Kui XU on 2017/08/08.
// mail: xukui.cs@gmail.com
//
$DEBUG=False;
#require_once('pgdao.php');
require_once('parse_em_map.php');
// require_once('conservation.php');

if($DEBUG){
	$pdbid = '5ftm';
}else{
	$pdbid  = isset($_GET['pdbid'])  ? trim($_GET['pdbid'])  : null;

}

$msgArray = parse_em_map(strtolower($pdbid));

//var_dump($response);
echo json_encode($msgArray);

?>
