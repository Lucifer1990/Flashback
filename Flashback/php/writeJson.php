<?php
$get_file1 = trim($_POST['imageName']);
$get_file2 = trim($_POST['albumName']);
$get_file3 = trim($_POST['mode']);
$get_file4 = trim($_POST['title']);
$file_link = "../json/".$get_file2.".json";
$file = file_get_contents($file_link);
$data = json_decode($file);
unset($file);//prevent memory leaks for large json.
//insert data here

$newArr['src']="albums/".$get_file2."/".$get_file1;
$newArr['ratio']=(float)$get_file3;
$newArr['title']=$get_file4;
$newArr['album']=$get_file2;

$data[]=$newArr ;
//save the file
file_put_contents($file_link,json_encode($data, JSON_UNESCAPED_SLASHES));
unset($data);//release memory

?>

