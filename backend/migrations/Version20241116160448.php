<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20241116160448 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE product (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, description VARCHAR(255) NOT NULL, price NUMERIC(10, 2) NOT NULL, quantity INT NOT NULL, image VARCHAR(255) NOT NULL, seller_id INT DEFAULT NULL, INDEX IDX_D34A04AD8DE820D9 (seller_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('ALTER TABLE product ADD CONSTRAINT FK_D34A04AD8DE820D9 FOREIGN KEY (seller_id) REFERENCES seller (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE product DROP FOREIGN KEY FK_D34A04AD8DE820D9');
        $this->addSql('DROP TABLE product');
    }
}
