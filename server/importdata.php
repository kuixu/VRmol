<?php
        include_once 'PgsqlConn.php';
        $db=new DBconn();
        // $sql="SELECT * FROM mu_tcga_42 limit 1;";
        // $get_array=$db->get_rows($sql);
        // var_dump($get_array);
	// $sql="insert into tb_test2 (id,name,time) values (2,'xk','2016-01-27 08:47:08');";
	// echo -e "\n";
        // $get_array=$db->changeRow2($sql);
        // var_dump($get_array);
        $sql="";
	importdbSNP();
	//importPDBEMD();
	//importUniprotPDBChain();
	// uniprot chemistry database 
	function importChemistry(){
		global $db;
		$myfile = fopen("/data1/xukui/uniprot/uniprot-database_chemistry.tab", "r") 
				or die("Unable to open file!");
		$i=0;
		while(!feof($myfile)) {
		  $line = fgets($myfile);
		  $line = str_replace("\n", '', $line);
		  $tab = preg_split('/\t/', $line);
		  $i=$i+1;
		  $sql=$sql."insert into chemistry (id,uniprotac, bindingdb, chembl, drugbank, swisslipids, 
			guidetopharmacology) values (".$i.",'".$tab[0]."', '".$tab[1]."','".$tab[2]."','".
			$tab[3]."','".$tab[4]."','".$tab[5]."');";
		  #echo $sql."\n";
		  #break;
		}
		fclose($myfile);
		$get_array=$db->changeRow2($sql);  
        	echo $i."\n";
	}
        function importPDBEMD(){
		global $db;
                $myfile = fopen("/data1/xukui/emdb/emdb-pdb.tab", "r") or die("Unable to open file!");
                $i=0;
		$sql="";
                while(!feof($myfile)) {
                  $line = fgets($myfile);
                  $line = str_replace("\n", '', $line);
		  if($line=="") continue;
                  $tab = preg_split('/\t/', $line);
                  $i=$i+1;
                  $sql=$sql."insert into pdb_emd (id, pdbid, emdid) values (".$i.",'".$tab[0]."', '".strtoupper($tab[1])."');\n";
                }
                fclose($myfile);
                $get_array=$db->changeRow2($sql);
		$db->close();
		echo $sql."\n";
        }
	function importUniprotPDBChain(){
		global $db;
                $myfile = fopen("/data1/xukui/uniprot/uniprot_pdb.tab", "r") 
			or die("Unable to open file!");
                $i=0;
                while(!feof($myfile)) {
                  $line = fgets($myfile);
                  $line = str_replace("\n", '', $line);
                  $tab = preg_split('/\t/', $line);
		  $uniprot = $tab[0];
		  $pdbstr = preg_split('/; /', $tab[1]);
		  for($j=0;$j<count($pdbstr);$j=$j+1){
			$pdbchain = preg_split('/:/', $pdbstr[$j]);
                        $sql="insert into uniprot_pdb_chain (id, uniprotac, pdbid, chain) values 
				(".$i.",'".$uniprot."', '".$pdbchain[0]."','".$pdbchain[1]."');";
                        $i=$i+1;
			$get_array=$db->changeRow2($sql);
			//print_r($uniprot."\t".$pdbchain[0]."\t".$pdbchain[1]."\n");
		  }
                }
                fclose($myfile);
		$db->close();
                //$get_array=$db->changeRow2($sql);
                //echo $i."\n";
        }
        function importdbSNP(){
                global $db;
                $myfile = fopen("/data1/xukui/dbsnp/dbsnp_6.tab", "r") or die("Unable to open file!");
                $i=0;
                $sql="";
                while(!feof($myfile)) {
                  $line = fgets($myfile);
                  $line = str_replace("\n", '', $line);
                  if($line=="") continue;
                  $tab = preg_split('/\t/', $line);
                  if($tab[0]=="") continue;
                  $i=$i+1;
                  $sql="insert into dbsnp (id, swissprot_acc_id, Protein_Change, Genome_Change, Variant_Classification, 
			variant_type) values (".$i.",'".$tab[0]."', '".$tab[1]."','".$tab[2]."', '".$tab[3]."','".$tab[4]."');";
                  $get_array=$db->changeRow2($sql);
                }
                fclose($myfile);
                $db->close();
                echo $sql."\n";
        }




?>
