<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250212142858 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE feedback DROP FOREIGN KEY FK_D2294458FCDAEAAA');
        $this->addSql('DROP INDEX IDX_D2294458FCDAEAAA ON feedback');
        $this->addSql('ALTER TABLE feedback ADD order_id INT NOT NULL, DROP order_id_id, CHANGE comment comment VARCHAR(255) DEFAULT NULL, CHANGE image image VARCHAR(255) DEFAULT NULL, CHANGE user_id user_id INT NOT NULL, CHANGE product_id product_id INT NOT NULL');
        $this->addSql('ALTER TABLE feedback ADD CONSTRAINT FK_D22944588D9F6D38 FOREIGN KEY (order_id) REFERENCES `order` (id)');
        $this->addSql('CREATE INDEX IDX_D22944588D9F6D38 ON feedback (order_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE feedback DROP FOREIGN KEY FK_D22944588D9F6D38');
        $this->addSql('DROP INDEX IDX_D22944588D9F6D38 ON feedback');
        $this->addSql('ALTER TABLE feedback ADD order_id_id INT DEFAULT NULL, DROP order_id, CHANGE comment comment VARCHAR(255) NOT NULL, CHANGE image image VARCHAR(255) NOT NULL, CHANGE user_id user_id INT DEFAULT NULL, CHANGE product_id product_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE feedback ADD CONSTRAINT FK_D2294458FCDAEAAA FOREIGN KEY (order_id_id) REFERENCES `order` (id)');
        $this->addSql('CREATE INDEX IDX_D2294458FCDAEAAA ON feedback (order_id_id)');
    }
}
