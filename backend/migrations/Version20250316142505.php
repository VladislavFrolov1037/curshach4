<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250316142505 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE promo_code ADD category_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE promo_code ADD CONSTRAINT FK_3D8C939E12469DE2 FOREIGN KEY (category_id) REFERENCES category (id)');
        $this->addSql('CREATE INDEX IDX_3D8C939E12469DE2 ON promo_code (category_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE promo_code DROP FOREIGN KEY FK_3D8C939E12469DE2');
        $this->addSql('DROP INDEX IDX_3D8C939E12469DE2 ON promo_code');
        $this->addSql('ALTER TABLE promo_code DROP category_id');
    }
}
