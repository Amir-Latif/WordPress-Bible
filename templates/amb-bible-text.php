<div class="amb-app">
    <main class="amb-bible-container">
        <div id="amb-react"></div>

        <?php if(!$_SESSION["error"]) include("amb-text-details.php") ?>

        <div class="amb-text-container">
            <?php echo $_SESSION['text_html'] ?>
        </div>

        <?php if(!$_SESSION["error"]) include("amb-text-details.php") ?>

    </main>
</div>