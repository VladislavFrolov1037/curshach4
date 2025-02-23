<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20241209154132 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE valid_value (id INT AUTO_INCREMENT NOT NULL, value VARCHAR(255) NOT NULL, category_attribute_id INT DEFAULT NULL, INDEX IDX_6FB2F2CF6C310D68 (category_attribute_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('ALTER TABLE valid_value ADD CONSTRAINT FK_6FB2F2CF6C310D68 FOREIGN KEY (category_attribute_id) REFERENCES category_attribute (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE valid_value DROP FOREIGN KEY FK_6FB2F2CF6C310D68');
        $this->addSql('DROP TABLE valid_value');
    }
}
