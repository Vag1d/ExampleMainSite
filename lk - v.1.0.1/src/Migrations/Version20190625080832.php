<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20190625080832 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'postgresql', 'Migration can only be executed safely on \'postgresql\'.');

        $this->addSql('CREATE SEQUENCE upload_diagnostics_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE trace_route_diagnostics_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE TABLE upload_diagnostics (id INT NOT NULL, device_id INT DEFAULT NULL, rom_time VARCHAR(45) DEFAULT NULL, bom_time VARCHAR(45) DEFAULT NULL, eom_time VARCHAR(45) DEFAULT NULL, test_file_length INT DEFAULT NULL, total_bytes_sent INT DEFAULT NULL, tcp_open_request_time VARCHAR(45) DEFAULT NULL, tcp_open_response_time VARCHAR(45) DEFAULT NULL, num_index INT DEFAULT NULL, type INT DEFAULT NULL, create_date TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE TABLE trace_route_diagnostics (id INT NOT NULL, response_time INT DEFAULT NULL, route_hops_number_of_entries INT DEFAULT NULL, device_id INT DEFAULT NULL, create_date TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, PRIMARY KEY(id))');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'postgresql', 'Migration can only be executed safely on \'postgresql\'.');

        $this->addSql('CREATE SCHEMA public');
        $this->addSql('DROP SEQUENCE upload_diagnostics_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE trace_route_diagnostics_id_seq CASCADE');
        $this->addSql('DROP TABLE upload_diagnostics');
        $this->addSql('DROP TABLE trace_route_diagnostics');
    }
}
