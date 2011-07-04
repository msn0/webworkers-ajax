<?php

date_default_timezone_set('UTC');

//sleep(round(rand()/1000000000));

if ($_GET['t'] == 0) {
    $d = getdate();
    $m = microtime(true) . "";
    print_r("{\"s\":\"$d[seconds]\",\"m\":\"$d[minutes]\",\"h\":\"$d[hours]\",\"u\":\"." . $m[11]. "\"}");
}
if ($_GET['t'] == 1) {
    $d = time();
    print_r("$d");
}
?>
