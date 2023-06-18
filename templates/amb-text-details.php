<?php

$prev_chapter = $amBible->chapter - 1;
$next_chapter = $amBible->chapter + 1;
$base_link = "<a class='amb-d-flex-switch' href='الكتاب-المقدس?testament=all&book={$amBible->book}&chapter=";
$prev_link = "{$base_link}{$prev_chapter}&verse=0'><</a>";
$next_link = "{$base_link}{$next_chapter}&verse=0'>></a>";
?>

<section class="amb-text-details">
    <div class="amb-d-flex amb-align-items-center">
        <h2 class="amb-bible-name">
            <?php
            if (sizeof($amBible->books) > 0 && $amBible->selected_book["testament"] === "old") {
                echo "سفر ";
            }
            echo $amBible->selected_book["book"];
            ?>
        </h2>

        <?php if ($amBible->chapter > 1) echo $prev_link; ?>
        <h2>أصحاح: <?php echo $amBible->chapter; ?></h2>
        <?php if ($amBible->chapter !== sizeof($amBible->selected_book["chapters"])) echo $next_link; ?>

    </div>
</section>