<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250518094322 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE image DROP sequence');
        $this->addSql('ALTER TABLE `order` CHANGE total_price total_price DOUBLE PRECISION NOT NULL');
        $this->addSql('ALTER TABLE payment CHANGE auth_code auth_code LONGTEXT NOT NULL');
        $this->addSql('ALTER TABLE promo_code CHANGE discount discount INT NOT NULL');
        $this->addSql('ALTER TABLE user DROP discount');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE image ADD sequence INT NOT NULL');
        $this->addSql('ALTER TABLE `order` CHANGE total_price total_price INT NOT NULL');
        $this->addSql('ALTER TABLE payment CHANGE auth_code auth_code TEXT NOT NULL');
        $this->addSql('ALTER TABLE promo_code CHANGE discount discount DOUBLE PRECISION NOT NULL');
        $this->addSql('ALTER TABLE user ADD discount NUMERIC(10, 2) DEFAULT NULL');
    }
}
