<?php

ini_set('memory_limit', '1024M');

        require_once('PgsqlConn.php');

        $db=new DBconn();
	$tb_tcga="mu_tcga_42";
	$tb_ccle="mu_ccle_33";
	$tb_exac="mu_exac_32";


//	var_dump( getDrugs("5FTM"));
//	var_dump( getEMDB("5FTM"));
//	var_dump( getTCGA("Q9NZ08"));
//	var_dump( getDBSNP("Q96M02"));
//	var_dump( getCCLE("O00273"));
//	var_dump( getExAC("P29965"));
//	var_dump( getUniprotAC("2YGD"));
//	var_dump(getMutByPDB("2YGD","tcga"));
	function getInt($str){
		return preg_replace('/\D/', '', $str);
	}

	function getTCGA($unprotac){
		global $db;
		$query = "select id, Variant_Classification as v_class, variant_type as v_type, Genome_Change as g_change, 
				Protein_Change as p_change, disease ,left(uniprot_aapos, length(uniprot_aapos)-2) as pos from mu_tcga_42 
				where swissprot_acc_id ='".$unprotac."' and Protein_Change!=''";
		$response = $db->get_rows($query);
		$db->close();
                return $response;
	}
	function getCCLE($unprotac){
		global $db;
		$query = "SELECT id, Variant_Classification as v_class, variant_type as v_type, Genome_Change as g_change, 
				Protein_Change as p_change, system FROM mu_ccle_33 where SwissProt_acc_Id='".$unprotac."' and protein_change!=''";
		$response = $db->get_rows($query);
		for ($i=0;$i< count($response);$i=$i+1) {
			$response[$i]['pos'] = getInt($response[$i]['p_change']);
		}
		$db->close();
                return $response;
	}
	function getExAC($unprotac){
		global $db;
		$query = "SELECT id, Variant_Classification as v_class, variant_type as v_type, Genome_Change as g_change, 
				Protein_Change as p_change FROM mu_exac_32 where swissprot_acc_id='".$unprotac."' and protein_change!=''";
		$response = $db->get_rows($query);
		for ($i=0;$i< count($response);$i=$i+1) {
			$response[$i]['pos'] = getInt($response[$i]['p_change']);
		}
		$db->close();
                return $response;
	}
	function getDBSNP($unprotac){
                global $db;
                $query = "SELECT id, Variant_Classification as v_class, variant_type as v_type, Genome_Change as g_change, 
				Protein_Change as p_change FROM dbsnp where swissprot_acc_id='".$unprotac."' and protein_change!=''";
                $response = $db->get_rows($query);
                for ($i=0;$i< count($response);$i=$i+1) {
                        $response[$i]['pos'] = getInt($response[$i]['p_change']);
                }
                $db->close();
                return $response;
        }
	function getEMDB($pdbid){
                global $db;
                $query = "SELECT emdbid from pdb_emd where pdbid ='".$pdbid."'";
                $res = $db->get_rows($query);
		$emdbids = array();
		foreach ($res as $obj) {
                        array_push($emdbids,$obj['emdbid']);
                }
		if(is_array($res)){
			$msgArray = array('code'=>1, 'data'=>$emdbids, 'message'=>'success');
			//$msgArray = array('code'=>1, 'data'=>$res, 'message'=>'success' , 'debug'=>$query);
		}else{
			$msgArray = array('code'=>0, 'message'=>'no fitted PDB in current EMDB.');
		}
                $db->close();
                return $msgArray;
        }
	function getDrugs($pdbid){
		$resArr= getUniprotAC($pdbid);
		$msgArray ="";
		if(is_array($resArr)){
			$uniprotac=$resArr[1];
			
                	global $db;
                	$query = "SELECT * from chemistry where uniprotac ='".$uniprotac."'";
                	$res = $db->get_rows($query);
                	if(is_array($res)){
                	        $msgArray = array('code'=>1, 'data'=>$res, 'message'=>'success');
                	}else{
                	        $msgArray = array('code'=>0, 'message'=>'no drugs target on '.$pdbid.' in the 5 Drug Databases.');
                	}
                	$db->close();

		}else{
                	$msgArray = array('code'=>0, 'message'=>'no drugs target on '.$pdbid.' in the 5 Drug Databases.');
                }

                return $msgArray;
        }
	function getUniprotAC($pdbid){
                global $db;
                $query = "select uniprot_ac,chain_id from uniprot_pdb where pdb_id ='".$pdbid."'";
                $response = $db->get_rows($query);

                if(is_array($response) ){
			$chain = array();
			foreach ($response as $obj) {
                	    array_push($chain,$obj['chain_id']);
                	}
			$uniprot_ac = $response[0]['uniprot_ac'];
			return [$chain,$uniprot_ac];
                }
                return "";

        }
	function getMutByPDB($pdbid, $dataset){
		$resArr= getUniprotAC($pdbid);
		if(is_array($resArr)){
			$mutation=null;
			if($dataset =="tcga"){
				$mutation=getTCGA($resArr[1]);
			}elseif($dataset =="ccle"){
				$mutation=getCCLE($resArr[1]);
			}elseif($dataset =="exac"){
				$mutation=getExAC($resArr[1]);
			}elseif($dataset =="dbsnp"){
				$mutation=getDBSNP($resArr[1]);
			}

			if(is_array($mutation)){
				//$posarr = array();
				//foreach ($pos as $obj) {
                            	//	array_push($posarr,$obj['pos']);
                        	//}
				//sort($posarr);
				//$posarr = array_unique($posarr);
				
				$chain=$resArr[0];
				$data =array('mutations'=>$mutation, 'chains'=>$chain, 'pdbid'=>$pdbid, 'dataset'=>$dataset);
				$msgArray = array('code'=>1, 'data'=>$data, 'message'=>'success');
			}else{
				$msgArray = array('code'=>0, 'message'=>'no mutation information in the current '.$dataset.' database.');	
			}
		}else{
			$msgArray = array('code'=>0, 'message'=>'no corresponding Uniprot-AC');
			//$db->close();
		}
		return $msgArray;
	}


?>
