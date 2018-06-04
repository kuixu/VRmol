<?php


	require_once('pgdao.php');
	require_once('conservation.php');

	//require_once('mysql_connect-rise.php');
	//echo "=======</br>";

    	$msgArray = array('code'=>0, 'data'=>array(), 'message'=>'parameter error!');
        $taskid = isset($_GET['taskid']) ? trim($_GET['taskid']) : null;
        $pdbid = isset($_GET['pdbid']) ? trim($_GET['pdbid']) : null;
	//$taskid = isset($_POST['taskid']) ? trim($_POST['taskid']) : null;
	//echo $pdbid;
	
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
			$msgArray= getEMDB(strtoupper($pdbid));
			break;
		default:
			# code...
			break;
	}
	
	
	//var_dump($response);
	echo json_encode($msgArray);

?>
