<?php
$get_folder = trim($_POST['src']);
$path = '../'.$get_folder;
 if(unlink($path))
  echo 'deleted';
?>