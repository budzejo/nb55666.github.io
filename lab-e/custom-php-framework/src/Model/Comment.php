<?php
namespace App\Model;

use App\Service\Config;
use PDO;

class Comment
{
    private ?int $id=null;
    private ?string $author=null;
    private ?string $content=null;

    public function getId():?int
    {
        return $this->id;
    }

    public function setId(?int $id): Comment
    {
        $this->id=$id;
        return $this;
    }

    public function getAuthor():?string
    {
        return $this->author;
    }

    public function setAuthor(?string $author): Comment
    {
        $this->author=$author;
        return $this;
    }

    public function getContent(): ?string
    {
        return $this->content;
    }

    public function setContent(?string $content): Comment
    {
        $this->content=$content;
        return $this;
    }

    public static function fromArray(array $array): Comment
    {
        $comment=new self();
        $comment->fill($array);
        return $comment;
    }

    public function fill(array $array): Comment
    {
        if (isset($array['id']) && !$this->getId()) {
            $this->setId((int)$array['id']);
        }
        if (isset($array['author'])) {
            $this->setAuthor($array['author']);
        }
        if (isset($array['content'])) {
            $this->setContent($array['content']);
        }
        return $this;
    }

    public static function findAll(): array
    {
        $pdo=new PDO(Config::get('db_dsn'),Config::get('db_user'),Config::get('db_pass'));
        $sql='SELECT * FROM comment';
        $statement=$pdo->prepare($sql);
        $statement->execute();

        $comments=[];
        $rows=$statement->fetchAll(PDO::FETCH_ASSOC);
        foreach ($rows as $row) {
            $comments[]=self::fromArray($row);
        }

        return $comments;
    }

    public static function find(int $id): ?Comment
    {
        $pdo=new PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql='SELECT * FROM comment WHERE id=:id';
        $statement=$pdo->prepare($sql);
        $statement->execute(['id' => $id]);

        $row=$statement->fetch(PDO::FETCH_ASSOC);
        if (!$row) {
            return null;
        }

        return self::fromArray($row);
    }

    public function save(): void
    {
        $pdo=new PDO(Config::get('db_dsn'),Config::get('db_user'),Config::get('db_pass'));
        if ($this->getId()) {
            $sql='UPDATE comment SET author = :author, content = :content WHERE id = :id';
            $statement=$pdo->prepare($sql);
            $statement->execute([
                ':author'=>$this->getAuthor(),
                ':content'=>$this->getContent(),
                ':id'=>$this->getId(),
            ]);
        } else {
            $sql='INSERT INTO comment (author, content) VALUES (:author, :content)';
            $statement = $pdo->prepare($sql);
            $statement->execute([
                ':author'=>$this->getAuthor(),
                ':content'=>$this->getContent(),
            ]);
            $this->setId((int)$pdo->lastInsertId());
        }
    }

    public function delete(): void
    {
        $pdo=new PDO(Config::get('db_dsn'),Config::get('db_user'),Config::get('db_pass'));
        $sql='DELETE FROM comment WHERE id = :id';
        $statement=$pdo->prepare($sql);
        $statement->execute([':id' => $this->getId()]);
        $this->setId(null);
    }
}
