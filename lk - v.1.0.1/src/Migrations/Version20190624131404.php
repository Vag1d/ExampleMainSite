<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20190624131404 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'postgresql', 'Migration can only be executed safely on \'postgresql\'.');

        $this->addSql('ALTER TABLE ip_ping_diagnostics ADD lost VARCHAR(45) DEFAULT NULL');
        $this->addSql('ALTER TABLE ip_ping_diagnostics ADD minimum VARCHAR(45) DEFAULT NULL');
        $this->addSql('ALTER TABLE ip_ping_diagnostics ADD maximum VARCHAR(45) DEFAULT NULL');
        $this->addSql('ALTER TABLE ip_ping_diagnostics ADD average VARCHAR(45) DEFAULT NULL');
        $this->addSql('ALTER TABLE ip_ping_diagnostics ADD device_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE ip_ping_diagnostics ADD type INT DEFAULT NULL');
        $this->addSql('ALTER TABLE ip_ping_diagnostics ADD num_index INT DEFAULT NULL');
        $this->addSql('ALTER TABLE ip_ping_diagnostics ADD create_date TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'postgresql', 'Migration can only be executed safely on \'postgresql\'.');

        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE ip_ping_diagnostics DROP lost');
        $this->addSql('ALTER TABLE ip_ping_diagnostics DROP minimum');
        $this->addSql('ALTER TABLE ip_ping_diagnostics DROP maximum');
        $this->addSql('ALTER TABLE ip_ping_diagnostics DROP average');
        $this->addSql('ALTER TABLE ip_ping_diagnostics DROP device_id');
        $this->addSql('ALTER TABLE ip_ping_diagnostics DROP type');
        $this->addSql('ALTER TABLE ip_ping_diagnostics DROP num_index');
        $this->addSql('ALTER TABLE ip_ping_diagnostics DROP create_date');
    }
}
