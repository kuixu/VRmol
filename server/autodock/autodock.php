<?php
//echo shell_shell_exec("php -v");
// config URL
$smolid   = 'DB04464';
$cmd = ' babel '.$smolid.'_out.pdbqt '.$smolid.'_out.pdb;' ;
echo shell_exec($cmd);

$server_url = 'https://inano.zhanglab.net';
$mgtools    = '/home/vr/tools/mgltools_x86_64Linux2_1.5.6/bin';
$vina       = '/home/vr/tools/autodock_vina_1_1_2_linux_x86/bin/vina';
$pdb_url    = 'http://files.rcsb.org/view/';
$smol_url   = 'https://www.drugbank.ca/structures/small_molecule_drugs/';
$outmodel   = 9; 
// get nequest parameter
$pdbid    = $_GET['pdbid'];
$smolid   = $_GET['smolid'];
$x_c      = $_GET['x_c'];
$y_c      = $_GET['y_c'];
$z_c      = $_GET['z_c'];
$x_s      = $_GET['x_s'];
$y_s      = $_GET['y_s'];
$z_s      = $_GET['z_s'];
//$pdbid= '1mbs';
//$smolid   = 'DB04464';
//$x_c      = 10;
//$y_c      = 10;
//$z_c      = 10;
//$x_s      = 10;
//$y_s      = 10;
//$z_s      = 10;

$pdbfile  = $pdb_url.$pdbid.'.pdb';
$smolfile = $smol_url.$smolid.'.pdb';
// echo $pdbfile;
// echo $smolfile;
// job dir name
date_default_timezone_set('PRC');
// now time + random: month+day+hour+minute+seconde + _ +
$dir_name=$pdbid.'_'.$smolid.'_'.date('YmdHis',time()).'_'.mt_rand(10,99);
// echo $dir_name;
$o_pdbfile = 'jobs/'.$dir_name.'/'.$pdbid.'.pdb';
$o_smolfile = 'jobs/'.$dir_name.'/'.$smolid.'.pdb';

shell_exec("mkdir jobs/".$dir_name);
shell_exec("wget ".$pdbfile.' -O '.$o_pdbfile);
shell_exec("wget ".$smolfile.' -O '.$o_smolfile);
//file_put_contents("x.base64", $audio);
// test 
// shell_exec('cp jobs/*.pdbqt jobs/'.$dir_name);
// shell_exec('mv SIAtoSIA2.pdbqt '.)
// shell_exec('cd jobs/'.$dir_name.'; babel '.$pdbid.'.pdb '.$pdbid.'.pdbqt');
// shell_exec('cd jobs/'.$dir_name.'; babel '.$smolid.'.pdb '.$smolid.'.pdbqt');
shell_exec('cd jobs/'.$dir_name.'; '.$mgtools.'/prep_pdb.sh '.$pdbid.'.pdb '.$pdbid.'.pdbqt');
shell_exec('cd jobs/'.$dir_name.'; '.$mgtools.'/prep_smol.sh '.$smolid.'.pdb '.$smolid.'.pdbqt');

$configuration = "\n
receptor = ".$pdbid.".pdbqt
ligand = ".$smolid.".pdbqt

center_x = ".$x_c."
center_y = ".$y_c."  
center_z = ".$z_c."

size_x = ".$x_s."  
size_y = ".$y_s."  
size_z = ".$z_s;

$cfgfile = 'jobs/'.$dir_name.'/config';
file_put_contents($cfgfile, $configuration);

$cmd = 'cd jobs/'.$dir_name.';'.$vina.' --config config >log 2>&1 ;' ;
$cmd = $cmd.' babel '.$smolid.'_out.pdbqt '.$smolid.'_out.pdb;' ;
$cmd = $cmd.' '.$mgtools.'/splitpdb.sh '.$smolid.'_out ;';
$cmd = $cmd." tail -10 log |head -9|awk '{print $2}' > scores &";
// shell_exec('cd jobs/'.$dir_name.';'.$vina.' --config config >log 2>&1 ; babel &');
shell_exec($cmd);
shell_exec('sleep 2');
// echo '<p>'.shell_exec("ls jobs/".$dir_name).'</p>';
$outdir = $server_url."/server/autodock/jobs/".$dir_name;
$log = $outdir.'/log';
$target = $smolid.'_out.pdb';
$target_url = $outdir.'/'.$target ;

// score file
$score_file = 'jobs/'.$dir_name.'/scores';
$str = file_get_contents($score_file);
$str_encoding = mb_convert_encoding($str, 'UTF-8', 'UTF-8,GBK,GB2312,BIG5');
$score_arr = explode("\n", $str_encoding);


// n models
$model_list = array();
foreach (range(1, $outmodel) as $number) {
    $name = $smolid.'_out_'.$number.'.pdb'; 
    $model_list[] = $name;
    // $model_list[] = $outdir.'/'.$name;
}

$out = array('jobid' => $dir_name, 'log' => $log, 'pdbid' => $pdbid, 'smolid' => $smolid, 'fullmodel' => $target, 'fullmodel_url' => $target_url, 'model_list' => $model_list, 'outdir' => $outdir, 'scores' => $score_arr);
echo json_encode($out);
?>
