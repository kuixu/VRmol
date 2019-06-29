<?php header('Access-Control-Allow-Origin: *');
//
// Created by Kui XU on 2017/08/08.
// mail: xukui.cs@gmail.com
//

require_once('pgdao.php');
require_once('parse_em_map.php');
require_once('conservation.php');

$msgArray = array('code'=>0, 'data'=>array(), 'message'=>'parameter error!');
$taskid = isset($_GET['taskid']) ? trim($_GET['taskid']) : null;
$pdbid = isset($_GET['pdbid']) ? trim($_GET['pdbid']) : null;
// $taskid = isset($_POST['taskid']) ? trim($_POST['taskid']) : null;
//echo $pdbid;
// $taskid = '13';
// $pdbid = '5ftm';

switch ($taskid) {
	case '10':
    $ds = isset($_GET['ds']) ? trim($_GET['ds']) : null;
		$msgArray= getMutByPDB($pdbid, $ds);
		break;
	case '11':
    $chain = isset($_GET['chain']) ? trim($_GET['chain']) : null;
		$msgArray= parseConservationData($pdbid,$chain);
		break;
	case '12':
		$msgArray= getDrugs(strtoupper($pdbid));
		break;
	case '13':
		$msgArray= parse_em_map(strtolower($pdbid));
		break;
	default:
		# code...
		break;
}

//var_dump($response);
echo json_encode($msgArray);

?>
