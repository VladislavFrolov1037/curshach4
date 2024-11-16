<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20241116174307 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE seller ADD type VARCHAR(30) NOT NULL, ADD tax_id VARCHAR(255) NOT NULL, ADD passport VARCHAR(255) DEFAULT NULL, ADD phone VARCHAR(30) NOT NULL, ADD email VARCHAR(255) NOT NULL, ADD address VARCHAR(255) NOT NULL, ADD admin_comment VARCHAR(255) NOT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE seller DROP type, DROP tax_id, DROP passport, DROP phone, DROP email, DROP address, DROP admin_comment');
    }
}
