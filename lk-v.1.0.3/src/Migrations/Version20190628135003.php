<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20190628135003 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'postgresql', 'Migration can only be executed safely on \'postgresql\'.');

        $this->addSql('ALTER TABLE interactive_log ADD initiator_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE interactive_log ADD CONSTRAINT FK_CA6D914B7DB3B714 FOREIGN KEY (initiator_id) REFERENCES users (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE INDEX IDX_CA6D914B7DB3B714 ON interactive_log (initiator_id)');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'postgresql', 'Migration can only be executed safely on \'postgresql\'.');

        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE interactive_log DROP CONSTRAINT FK_CA6D914B7DB3B714');
        $this->addSql('DROP INDEX IDX_CA6D914B7DB3B714');
        $this->addSql('ALTER TABLE interactive_log DROP initiator_id');
    }
}
