<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20241217122249 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE order_item ADD request_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE order_item ADD CONSTRAINT FK_52EA1F09427EB8A5 FOREIGN KEY (request_id) REFERENCES `order` (id)');
        $this->addSql('CREATE INDEX IDX_52EA1F09427EB8A5 ON order_item (request_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE order_item DROP FOREIGN KEY FK_52EA1F09427EB8A5');
        $this->addSql('DROP INDEX IDX_52EA1F09427EB8A5 ON order_item');
        $this->addSql('ALTER TABLE order_item DROP request_id');
    }
}
