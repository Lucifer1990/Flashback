<?php
$ext = ".json";
echo $get_file = trim($_POST['albumName']);
$file = "../json/" .$get_file.$ext;
 if(fopen( $file, 'w+' ))
  echo $file.'created';
?>
