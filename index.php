<!DOCTYPE html>
<html lang="it">

<?php
include 'head.php';
?>

<body>
    <div class="alert" style="display: none;"></div>
    <main>
        <?php
        include "html/header.html";

        $php_page = 'html/' . $page . '.html';

        if (file_exists($php_page))
            include $php_page;
        else
            include 'html/404.html';
        ?>
    </main>

    <?php
    include 'footer.php';
    ?>

</body>

</html>
