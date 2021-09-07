<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20190710134646 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'postgresql', 'Migration can only be executed safely on \'postgresql\'.');

        $this->addSql('CREATE SEQUENCE client_errors_log_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE TABLE client_errors_log (id INT NOT NULL, initiator_id INT DEFAULT NULL, statuc_code INT DEFAULT NULL, status_text VARCHAR(255) DEFAULT NULL, exception VARCHAR(255) NOT NULL, time TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, service VARCHAR(255) DEFAULT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_124643477DB3B714 ON client_errors_log (initiator_id)');
        $this->addSql('ALTER TABLE client_errors_log ADD CONSTRAINT FK_124643477DB3B714 FOREIGN KEY (initiator_id) REFERENCES users (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'postgresql', 'Migration can only be executed safely on \'postgresql\'.');

        $this->addSql('CREATE SCHEMA public');
        $this->addSql('DROP SEQUENCE client_errors_log_id_seq CASCADE');
        $this->addSql('DROP TABLE client_errors_log');
    }
}
