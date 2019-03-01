<?php

$lang = $_POST['lang'];
$audio = $_POST['audio'];

$file_name='x.base64';
file_put_contents("static-data/".$file_name, $audio);

$handle = fsockopen("127.0.0.1",1234); 
if($handle){
	fputs($handle,$lang);  
    $trans=fgets($handle,1024);
    echo $trans;
}
?>
