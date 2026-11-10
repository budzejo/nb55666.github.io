<?php
/** @var \App\Model\Comment $comment */
/** @var \App\Service\Router $router */

$title = "Edit Comment ({$comment->getId()})";
$bodyClass = 'edit';

ob_start(); ?>
    <h1>Edit Comment</h1>
    <form action="<?= $router->generatePath('comment-edit', ['id' => $comment->getId()]) ?>" method="post" class="edit-form">
        <div class="form-group">
            <label for="author">Author</label>
            <input type="text" id="author" name="comment[author]" value="<?= htmlspecialchars($comment->getAuthor() ?? '') ?>">
        </div>
        <div class="form-group">
            <label for="content">Content</label>
            <textarea id="content" name="comment[content]"><?= htmlspecialchars($comment->getContent() ?? '') ?></textarea>
        </div>
        <div class="form-group">
            <label></label>
            <input type="submit" value="Submit">
        </div>
    </form>

    <ul class="action-list">
        <li>
            <a href="<?= $router->generatePath('comment-index') ?>">Back to list</a>
        </li>
        <li>
            <form action="<?= $router->generatePath('comment-delete', ['id' => $comment->getId()]) ?>" method="post">
                <input type="submit" value="Delete" onclick="return confirm('Are you sure?')">
            </form>
        </li>
    </ul>

<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';
