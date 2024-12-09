<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20241203165104 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE viewed_product (id INT AUTO_INCREMENT NOT NULL, viewed_at DATETIME NOT NULL, user_id INT DEFAULT NULL, product_id INT DEFAULT NULL, INDEX IDX_D9F928CFA76ED395 (user_id), INDEX IDX_D9F928CF4584665A (product_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('ALTER TABLE viewed_product ADD CONSTRAINT FK_D9F928CFA76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE viewed_product ADD CONSTRAINT FK_D9F928CF4584665A FOREIGN KEY (product_id) REFERENCES product (id)');
        $this->addSql('ALTER TABLE product ADD views_count INT NOT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE viewed_product DROP FOREIGN KEY FK_D9F928CFA76ED395');
        $this->addSql('ALTER TABLE viewed_product DROP FOREIGN KEY FK_D9F928CF4584665A');
        $this->addSql('DROP TABLE viewed_product');
        $this->addSql('ALTER TABLE product DROP views_count');
    }
}
