<?php

/**
 * Plugin Name: Bible
 * Description: Displays the bible text and provides search capability
 * Version: 1.0
 * Requires at least: 6.2
 * Requires PHP: 7.0
 * Author: Amir Latif
 * Author URI: https://amir-latif.github.io/portfolio/
 * Text Domain: WordPress Plugins
 */
?>
<?php

#region Create pages: text - search
function amb_create_bible_pages()
{
    // If bible text page does not exist, create it
    if (!get_page_by_path("الكتاب-المقدس")) {
        // Create the page object
        $bible_text_page = array(
            'post_title' => 'الكتاب المقدس',
            'post_content' => "<!-- wp:shortcode -->
        [amb_display_bible]
        <!-- /wp:shortcode -->",
            'post_status' => 'publish',
            'post_type' => 'page',
        );

        // Insert the page into the database
        $bible_text_page_id = wp_insert_post($bible_text_page);
    }

    // If bible search page does not exist, create it
    if (!get_page_by_path("بحث-في-الكتاب-المقدس")) {
        $bible_search_page = array(
            'post_title'     => "بحث في الكتاب المقدس",
            'post_content' => "<!-- wp:shortcode -->
        [amb_display_bible]
        <!-- /wp:shortcode -->",
            'post_status' => 'publish',
            'post_type' => 'page',
        );

        // Insert the page into the database
        $bible_search_page_id = wp_insert_post($bible_search_page);
    }
}
register_activation_hook(__FILE__, 'amb_create_bible_pages');
#endregion

#region Text Display
function amb_display_bible()
{
    #region Prepare Text
    $books = json_decode(file_get_contents(plugin_dir_url(__FILE__) . "src/data/books.json"), true);
    $bibleText = json_decode(file_get_contents(plugin_dir_url(__FILE__) . "src/data/bibleText.json"), true);

    $selectedText = array_filter($bibleText, function ($e) {
        $book = $_GET["book"] ?? "GEN";
        $chapter = !isset($_GET["chapter"]) ? 1 : intval($_GET["chapter"]);

        return $e["b"] === $book && $e["c"] === $chapter;
    });

    $verse = !isset($_GET["verse"]) ? 0 : intval($_GET["verse"]);
    if ($verse !==  0) {

        $selectedText = array_filter($selectedText, function ($e) {
            $verse = !isset($_GET["verse"]) ? 0 : intval($_GET["verse"]);
            return $e["v"] === $verse;
        });
    }
    #endregion Prepare Text

    #region Prepare text html
    $text_html = "خطأ في عنوان الصفحة";

    if (sizeof($selectedText) !== 0) {
        $text_html = "";

        foreach ($selectedText as $verse) {
            $text_html .= "<div>";
            if (isset($verse["title"])) {
                if ($verse["v"] !== 1) {
                    $text_html .= "<hr>";
                }
                $title = $verse["title"];
                $text_html .= "<h2 class='amb-h2'>$title</h2>";
            }

            $v = $verse["v"];
            $text_html .= "<div class='amb-d-flex'><p style='padding-inline-end: 5px' class='amb-p'>$v.</p>";

            $text = $verse["text"];

            $text_html .= "<p class='amb-p'>$text</p>";

            $text_html .= "</div>";
        }
    }
    #endregion Prepare text html

    #region Render
    ob_start();
    $_SESSION["books"] = $books;
    $_SESSION["text_html"] = $text_html;
    $_SESSION["book"] = $_GET["book"] ?? "GEN";
    $_SESSION["chapter"] = isset($_GET["chapter"]) ? intval($_GET["chapter"]) : 1;
    $_SESSION["verse"] = $verse;
    $_SESSION["error"] = sizeof($selectedText) === 0;
    include('templates/amb-bible-text.php');
    include('templates/amb-spinner.php');

    $page_content = ob_get_clean();

    if (urldecode($GLOBALS["pagename"]) === "الكتاب-المقدس")
        return $page_content;
    else {
        ob_start();
        include('templates/amb-spinner.php');

        $page_content = ob_get_clean();

        return "{$page_content}<div id='amb-react'></div>";
    }
    #endregion render
}
add_shortcode('amb_display_bible', 'amb_display_bible');
#endregion Text Display

#region add meta tags
function amb_add_meta_tags()
{
    $meta_description = urldecode($GLOBALS['pagename']) === "الكتاب-المقدس" ? "نص الكتاب المقدس" : "بحث في الكتاب المقدس";

    if (
        is_singular() &&
        (has_shortcode($GLOBALS['post']->post_content, 'amb_display_bible'))
    ) {
        echo "<meta name='description' content='$meta_description'>";
        echo '<meta name="keywords" content="الكتاب المقدس">';
    }
}
add_action('wp_head', 'amb_add_meta_tags');

#endregion add meta tags

#region add scripts
function amb_add_scripts()
{
    $page_name = urldecode($GLOBALS["pagename"]);
    $plugin_dir = plugin_dir_url(__FILE__);

    if (
        is_singular() &&
        (has_shortcode($GLOBALS['post']->post_content, 'amb_display_bible'))
    ) {
        // global
        wp_enqueue_style('ambCssGlobal', $plugin_dir . 'styles/amb-styles.css', null, time());

        // spinner
        wp_enqueue_style('ambSpinnerCss', $plugin_dir . 'styles/amb-spinner.css', null, time());
        wp_enqueue_script('ambSpinnerJs', $plugin_dir . 'scripts/ambSpinner.js', array('wp-element'), time(), true);

        // build
        wp_enqueue_script('ambBuild', $plugin_dir . 'build/index.js', array('wp-element'), time(), true);
        wp_localize_script("ambBuild", "ambBuildObject", ["pageName" => $page_name, "pluginDir" => $plugin_dir]);

        // Bible Text
        if ($page_name === "الكتاب-المقدس")
            wp_enqueue_script('ambAccent', $plugin_dir . 'scripts/ambAccent.js', null, time(), true);
    }
}
add_action('wp_enqueue_scripts', 'amb_add_scripts');
#endregion add scripts
?>