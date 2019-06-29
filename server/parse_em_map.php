<?php

// API URL: http://www.ebi.ac.uk/pdbe/api/pdb/entry/summary/6qw6
function parse_em_map($pdbid){
//$pdbid="6qw6";
$pdb_api = "http://www.ebi.ac.uk/pdbe/api/pdb/entry/summary/".$pdbid;
// $ch = curl_init();
// curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
// curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
// curl_setopt($ch, CURLOPT_URL, $pdb_api);
// $result = curl_exec($ch);
// curl_close($ch);
$result = file_get_contents($pdb_api);
$obj = json_decode($result, true);
// var_dump($obj);

$method = $obj[$pdbid][0]['experimental_method_class'];
if (in_array("em", $method)){
   $id = $obj[$pdbid][0]['related_structures'][0]['accession'];
   $md = 'em';
   $msgArray = array('code'=>1, 'data'=> [$id], 'method'=>$md, 'pdbid'=>$pdbid, 'message'=>'success');
}elseif(in_array("x-ray", $method)){
   $id = $pdbid;
   $md = 'x-ray';
   $msgArray = array('code'=>1, 'data'=> [$id], 'method'=>$md, 'pdbid'=>$pdbid, 'message'=>'success');
}else{
   $id = '';
   $md = '';
   $msgArray = array('code'=>0, 'message'=>'no fitted PDB in current EMDB.');
}
// echo "<br>5222222<br>";
// echo $md;
return $msgArray;

}
// $a=parse_em_map("5ftm");
// var_dump($a);
?>
