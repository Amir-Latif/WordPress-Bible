<?php

/**
 * Plugin Name: Bible
 * Description: Displays the bible text and provides search capability
 * Version: 1.0
 * Requires at least: 6.2
 * Requires PHP: 7.0
 * Author: Amir Latif
 * Author URI: https://amir-latif.github.io/portfolio/
 * Text Domain: Bible
 */
?>
<?php

#region data class initialization
require_once("services/amBible.php");
$amBible = new AmBible(
    $books = json_decode(file_get_contents(plugin_dir_url(__FILE__) . "src/data/books.json"), true),
    $bible_text = json_decode(file_get_contents(plugin_dir_url(__FILE__) . "src/data/bibleText.json"), true),
);
#endregion

#region Create pages: text - search on registery
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

#region Text Display using shortcode
function amb_display_bible()
{
    global $amBible;

    #region Prepare html
    $text_html = "خطأ في عنوان الصفحة";

    if (sizeof($amBible->selected_text) !== 0) {
        // Remove the above page error message before looping
        $text_html = "";

        foreach ($amBible->selected_text as $verse) {
            if (isset($verse["title"])) {
                if ($verse["v"] !== 1) {
                    $text_html .= "<hr>";
                }
                $title = $verse["title"];
                $text_html .= "<h2 class='amb-h2 amb-p'>$title</h2>";
            }

            if ($amBible->verse !== 0 && $amBible->verse === $verse["v"]) {
                $text_html .= "<p id='verse' class='amb-selected-verse'><span style='padding-inline-end: 5px' class='amb-p'>{$verse["v"]}.</span><span class='amb-p'>{$verse['text']}</span></p>";
            } else {
                $text_html .= "<p><span style='padding-inline-end: 5px' class='amb-p'>{$verse["v"]}.</span><span class='amb-p'>{$verse['text']}</span></p>";
            }
        }
    }
    #endregion Prepare text html

    #region Render
    ob_start();
    $_SESSION["text_html"] = $text_html;
    $_SESSION["error"] = sizeof($amBible->selected_text) === 0;
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
    global $amBible;

    $meta_description = "الكتاب المقدس بالتشكيل وبدون - ";

    if ($amBible->selected_book["testament"] === "old") {
        $meta_description .= "سفر ";
    }

    $meta_description .= "{$amBible->book_name} أصحاح {$amBible->chapter}،\n
    اقرأ الانجيل بالعهد القديم والعهد الجديد كاملاً مع تفسير الكتاب المقدس";


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

#region update html document title
function amb_change_page_title($title)
{
    global $amBible;

    if (urldecode($GLOBALS["pagename"]) === "الكتاب-المقدس") {
        $title['title'] = $amBible->title;
    }
    return $title;
}
add_filter('document_title_parts', 'amb_change_page_title');
#endregion update post title

#region update post title
function amb_change_post_title($post_data)
{
    // isset is due to error of wordpress undefined global variable $pagename
    if (isset($GLOBALS["pagename"]) && urldecode($GLOBALS["pagename"]) === "الكتاب-المقدس") {
        global $amBible;

        $post_data->post_title = $amBible->title;
    }
}

add_action('the_post', 'amb_change_post_title');
#endregion update post title

#region add scripts
function amb_add_scripts()
{
    global $amBible;
    $page_name = urldecode($GLOBALS["pagename"]);
    $plugin_dir = plugin_dir_url(__FILE__);

    if (
        has_shortcode($GLOBALS['post']->post_content, 'amb_display_bible')
    ) {
        // global
        wp_enqueue_style('ambCssGlobalCss', $plugin_dir . 'styles/amb-styles.css', null, time());

        // spinner
        wp_enqueue_style('ambSpinnerCss', $plugin_dir . 'styles/amb-spinner.css', null, time());
        wp_enqueue_script('ambMainJs', $plugin_dir . 'scripts/ambMain.js', array('wp-element'), time(), true);
        wp_localize_script("ambMainJs", "ambMainJsObject", ["title" => $amBible->title]);

        // build
        wp_enqueue_script('ambBuildJs', $plugin_dir . 'build/index.js', array('wp-element'), time(), true);
        wp_localize_script("ambBuildJs", "ambBuildObject", ["pageName" => $page_name]);

        // Bible Text
        if ($page_name === "الكتاب-المقدس")
            wp_enqueue_script('ambAccentjs', $plugin_dir . 'scripts/ambAccent.js', null, time(), true);
    }
}
add_action('wp_enqueue_scripts', 'amb_add_scripts');
#endregion add scripts
?>