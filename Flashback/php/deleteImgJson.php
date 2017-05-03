<?php
$src = trim($_POST['src']);
$get_file2 = trim($_POST['album']);
$file_link = "../json/".$get_file2.".json";
$file = file_get_contents($file_link);
$data = json_decode($file);

$i=0 ;
foreach($data as $val)
{

	if(trim($val->src)==trim($src))
	{	echo  $val->src ;
		unset($data[$i]) ;
	}
	$i++;
}

$data = array_merge($data); 


//save the file
file_put_contents($file_link,json_encode($data, JSON_UNESCAPED_SLASHES));
unset($data);//release memory

?>