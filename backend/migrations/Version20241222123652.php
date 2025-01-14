<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20241222123652 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE feedback_reply (id INT AUTO_INCREMENT NOT NULL, comment VARCHAR(255) NOT NULL, created_at DATETIME NOT NULL, feedback_id INT DEFAULT NULL, user_id INT DEFAULT NULL, INDEX IDX_69095F85D249A887 (feedback_id), INDEX IDX_69095F85A76ED395 (user_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('ALTER TABLE feedback_reply ADD CONSTRAINT FK_69095F85D249A887 FOREIGN KEY (feedback_id) REFERENCES feedback (id)');
        $this->addSql('ALTER TABLE feedback_reply ADD CONSTRAINT FK_69095F85A76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE feedback_reply DROP FOREIGN KEY FK_69095F85D249A887');
        $this->addSql('ALTER TABLE feedback_reply DROP FOREIGN KEY FK_69095F85A76ED395');
        $this->addSql('DROP TABLE feedback_reply');
    }
}
