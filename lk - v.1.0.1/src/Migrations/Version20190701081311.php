<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20190701081311 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'postgresql', 'Migration can only be executed safely on \'postgresql\'.');

        $this->addSql('ALTER TABLE trace_route_diagnostics ALTER response_time TYPE VARCHAR(45)');
        $this->addSql('ALTER TABLE trace_route_diagnostics ALTER response_time DROP DEFAULT');
        $this->addSql('ALTER TABLE trace_route_diagnostics ALTER route_hops_number_of_entries TYPE VARCHAR(45)');
        $this->addSql('ALTER TABLE trace_route_diagnostics ALTER route_hops_number_of_entries DROP DEFAULT');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'postgresql', 'Migration can only be executed safely on \'postgresql\'.');

        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE trace_route_diagnostics ALTER response_time TYPE INT');
        $this->addSql('ALTER TABLE trace_route_diagnostics ALTER response_time DROP DEFAULT');
        $this->addSql('ALTER TABLE trace_route_diagnostics ALTER response_time TYPE INT');
        $this->addSql('ALTER TABLE trace_route_diagnostics ALTER route_hops_number_of_entries TYPE INT');
        $this->addSql('ALTER TABLE trace_route_diagnostics ALTER route_hops_number_of_entries DROP DEFAULT');
        $this->addSql('ALTER TABLE trace_route_diagnostics ALTER route_hops_number_of_entries TYPE INT');
    }
}
