<?php $current_book = array_values(
    array_filter($_SESSION["books"], function ($e) {
        return $e["abbr"] === $_SESSION["book"];
    })
)[0];

$base_link = "<a class='amb-d-flex-switch' href='الكتاب-المقدس?testament=all&book=";
$base_link .= $_SESSION['book'] . "&chapter=";
$prev_link = $base_link . $_SESSION['chapter'] - 1 . "&verse=0'><</a>";
$next_link = $base_link . $_SESSION['chapter'] + 1 . "&verse=0'>></a>";
?>

<section class="amb-text-details">
    <div class="amb-d-flex amb-align-items-center">
        <h1 class="amb-bible-name">
            <?php
            if (sizeof($books) > 0 && $current_book["testament"] === "old") {
                echo "سفر";
            }
            echo $current_book["book"];
            ?>
        </h1>
        
        <?php if ($_SESSION["chapter"] > 1) echo $prev_link; ?>
        <h1>أصحاح: <?php echo $_SESSION["chapter"]; ?></h1>
        <?php if ($_SESSION["chapter"] !== sizeof($current_book["chapters"])) echo $next_link; ?>

    </div>
</section>