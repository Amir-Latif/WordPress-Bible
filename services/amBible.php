<?php
class AmBible
{
    public $books;
    public $bible_text;
    public $book;
    public $book_name;
    public $chapter;
    public $verse;
    public $selected_book;
    public $testament;
    public $selected_text;
    public $title;

    public function __construct($books, $bible_text)
    {
        $this->books = $books;
        $this->bible_text = $bible_text;

        if (isset($_GET["book"]) && $_GET["book"] !== "all") {
            $this->book = $_GET["book"];
        } else $this->book = "GEN";

        $this->chapter = !isset($_GET["chapter"]) ? 1 : intval($_GET["chapter"]);
        $this->verse = !isset($_GET["verse"]) ? 0 : intval($_GET["verse"]);

        // The book that is selected based on the query params
        $arr  = array_filter($this->books, function ($e) {
            return $e["abbr"] === $this->book;
        });
        foreach ($arr as $book) {
            $this->selected_book = $book;
        }

        // book name from abbr
        $this->book_name = $this->selected_book['book'];

        // Testament
        switch ($this->selected_book["testament"]) {
            case 'old':
                $this->testament = "العهد القديم";
                break;
            case 'new':
                $this->testament = "العهد الجديد";
                break;

            default:
                break;
        }

        // The page title and post title
        $new_title = "الكتاب المقدس | {$this->testament} | ";
        if ($this->testament === "العهد القديم") {
            $new_title .= "سفر ";
        }

        $this->title = "{$new_title}{$this->book_name} | أصحاح {$this->chapter}";

        // The text that is selected based on the query params
        $this->selected_text = array_filter($this->bible_text, function ($e) {
            return $e["b"] === $this->book && $e["c"] === $this->chapter;
        });
    }
}
