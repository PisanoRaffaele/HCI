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
    <audio src="/assets/music.mp3" id="relaxing-music"></audio>
    <?php
    include 'footer.php';
    ?>

<script>
    document.addEventListener('DOMContentLoaded', function() {
        var audio = document.getElementById('relaxing-music');
        var audioState = localStorage.getItem('audioState');
        var audioTime = parseFloat(localStorage.getItem('audioTime'));
        if (audioState === 'playing' && !isNaN(audioTime) && isFinite(audioTime)) {
                audio.currentTime = audioTime;
                audio.play();
        }
        else {
            audio.pause();
        }
        window.addEventListener('beforeunload', function() {
            if (!audio.paused) {
                localStorage.setItem('audioState', 'playing');
                localStorage.setItem('audioTime', audio.currentTime);
            } else {
                localStorage.setItem('audioState', 'paused');
            }
        });
    });
</script>
</body>

</html>
