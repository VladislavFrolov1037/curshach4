<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250316140321 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE promo_code (id INT AUTO_INCREMENT NOT NULL, code VARCHAR(255) NOT NULL, discount DOUBLE PRECISION NOT NULL, max_uses INT NOT NULL, used_count INT NOT NULL, expires_at DATETIME NOT NULL, created_at DATETIME NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('ALTER TABLE `order` ADD promo_code_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE `order` ADD CONSTRAINT FK_F52993982FAE4625 FOREIGN KEY (promo_code_id) REFERENCES promo_code (id)');
        $this->addSql('CREATE INDEX IDX_F52993982FAE4625 ON `order` (promo_code_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('DROP TABLE promo_code');
        $this->addSql('ALTER TABLE `order` DROP FOREIGN KEY FK_F52993982FAE4625');
        $this->addSql('DROP INDEX IDX_F52993982FAE4625 ON `order`');
        $this->addSql('ALTER TABLE `order` DROP promo_code_id');
    }
}
