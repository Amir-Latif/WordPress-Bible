<?php

$prev_chapter = $slBible->chapter - 1;
$next_chapter = $slBible->chapter + 1;
$base_link = "<a class='slb-d-flex-switch' href='الكتاب-المقدس?testament=all&book={$slBible->book}&chapter=";
$prev_link = "{$base_link}{$prev_chapter}&verse=0'><</a>";
$next_link = "{$base_link}{$next_chapter}&verse=0'>></a>";
?>

<section class="slb-text-details">
    <div class="slb-d-flex slb-align-items-center">
        <h2 class="slb-bible-name">
            <?php
            if (sizeof($slBible->books) > 0 && $slBible->selected_book["testament"] === "old") {
                echo "سفر ";
            }
            echo $slBible->selected_book["book"];
            ?>
        </h2>

        <?php if ($slBible->chapter > 1) echo $prev_link; ?>
        <h2>أصحاح: <?php echo $slBible->chapter; ?></h2>
        <?php if ($slBible->chapter !== sizeof($slBible->selected_book["chapters"])) echo $next_link; ?>

    </div>
</section>