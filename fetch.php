<?php

$elementi = array(
    array('id' => 1, 'title' => 'Memory', 'description' => 'Test your memory', 'image' => 'assets/memory/1.png', 'link' => '?p=memory'),
    array('id' => 2, 'title' => 'Dot', 'description' => 'How many clicks can you make in 10 seconds?', 'image' => 'assets/memory/2.png', 'link' => '?p=dot'),
    array('id' => 3, 'title' => 'Simon', 'description' => 'How good is your memory?', 'image' => 'assets/memory/3.png', 'link' => '?p=simon'),
    array('id' => 4, 'title' => 'Guess The Word', 'description' => 'Guess the word', 'image' => 'assets/memory/4.png', 'link' => '?p=guess_the_word'),
    array('id' => 5, 'title' => 'Title 5', 'description' => 'Lorem ipsum dolor sit amet', 'image' => 'assets/memory/5.png', 'link' => ''),
    array('id' => 6, 'title' => 'Title 6', 'description' => 'consectetur adipiscing elit', 'image' => 'assets/memory/6.png', 'link' => ''),
    array('id' => 7, 'title' => 'Title 7', 'description' => 'sed do eiusmod tempor incididunt ', 'image' => 'assets/memory/7.png', 'link' => ''),
    array('id' => 8, 'title' => 'Title 8', 'description' => 'ut labore et dolore magna aliqua.', 'image' => 'assets/memory/8.png', 'link' => '')
);

header('Content-Type: application/json'); // specifica il tipo di risposta come JSON
echo json_encode($elementi);

?>
