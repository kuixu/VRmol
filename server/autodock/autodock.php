<?php
// config URL
$outmodel = 9; 
$mgtools  = '/home/vr/tools/mgltools_x86_64Linux2_1.5.6/bin';
$vina     = '/home/vr/tools/autodock_vina_1_1_2_linux_x86/bin/vina';
$pdb_url  = 'http://files.rcsb.org/view/';
// $smol_url = 'http://vr.zhanglab.net/data/drugbank/';
$smol_url = 'https://www.drugbank.ca/structures/small_molecule_drugs/';
// get nequest parameter
// $pdbid    = $_POST['pdbid'];
// $smolid   = $_POST['smolid'];
$pdbid    = $_GET['pdbid'];
$smolid   = $_GET['smolid'];
// $pdbid= '1mbs';
// $smolid   = 'DB04464';
// $x_c      = 10;
// $y_c      = 10;
// $z_c      = 10;
// $x_s      = 10;
// $y_s      = 10;
// $z_s      = 10;
$x_c      = $_GET['x_c'];
$y_c      = $_GET['y_c'];
$z_c      = $_GET['z_c'];
$x_s      = $_GET['x_s'];
$y_s      = $_GET['y_s'];
$z_s      = $_GET['z_s'];

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

exec("mkdir jobs/".$dir_name);
exec("wget ".$pdbfile.' -O '.$o_pdbfile);
exec("wget ".$smolfile.' -O '.$o_smolfile);
//file_put_contents("x.base64", $audio);
// test 
// exec('cp jobs/*.pdbqt jobs/'.$dir_name);
// exec('mv SIAtoSIA2.pdbqt '.)
// exec('cd jobs/'.$dir_name.'; babel '.$pdbid.'.pdb '.$pdbid.'.pdbqt');
// exec('cd jobs/'.$dir_name.'; babel '.$smolid.'.pdb '.$smolid.'.pdbqt');
exec('cd jobs/'.$dir_name.'; '.$mgtools.'/prep_pdb.sh '.$pdbid.'.pdb '.$pdbid.'.pdbqt');
exec('cd jobs/'.$dir_name.'; '.$mgtools.'/prep_smol.sh '.$smolid.'.pdb '.$smolid.'.pdbqt');

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
$cmd = $cmd.' '.$mgtools.'/splitpdb.sh '.$smolid.'_out &';
// exec('cd jobs/'.$dir_name.';'.$vina.' --config config >log 2>&1 ; babel &');
exec($cmd);
exec('sleep 2');
// echo '<p>'.exec("ls jobs/".$dir_name).'</p>';
$outdir = "http://vr.zhanglab.net/server/autodock/jobs/".$dir_name;
$log = $outdir.'/log';
$target = $smolid.'_out.pdb';
$target_url = $outdir.'/'.$target ;

// n models
$model_list = array();
foreach (range(1, $outmodel) as $number) {
    $name = $smolid.'_out_'.$number.'.pdb'; 
    $model_list[] = $name;
    // $model_list[] = $outdir.'/'.$name;
}

$out = array('jobid' => $dir_name, 'log' => $log, 'pdbid' => $pdbid, 'smolid' => $smolid, 'fullmodel' => $target, 'fullmodel_url' => $target_url, 'model_list' => $model_list, 'outdir' => $outdir );
echo json_encode($out);
?>
