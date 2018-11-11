-- MySQL Script generated by MySQL Workbench
-- Sat Nov 10 23:46:35 2018
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Table `users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `users` (
  `user_id` INT NOT NULL,
  `nome` VARCHAR(45) NOT NULL,
  `contacto` BIGINT(14) NULL,
  `email` VARCHAR(45) NULL,
  `password` VARCHAR(255) NULL,
  `endereco` TEXT(400) NULL,
  `nif` BIGINT(30) NULL,
  `tipo` VARCHAR(7) NOT NULL COMMENT 'pode ser tecnico ou cliente',
  PRIMARY KEY (`user_id`),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC),
  UNIQUE INDEX `contacto_UNIQUE` (`contacto` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `assistencias`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `assistencias` (
  `assistencia_id` INT NOT NULL,
  `cliente_user_id` INT NOT NULL,
  `tecnico_user_id` LONGTEXT NOT NULL,
  `categoria` VARCHAR(45) NOT NULL,
  `marca` VARCHAR(45) NULL,
  `modelo` VARCHAR(45) NULL,
  `cor` VARCHAR(45) NULL,
  `serial` VARCHAR(45) NULL,
  `problema` TEXT(2000) NOT NULL,
  `orcamento` BIGINT(8) NULL,
  `relatorio_interno` TEXT(10000) NULL,
  `relatorio_cliente` TEXT(1000) NULL,
  `material` LONGTEXT NULL,
  `preco` VARCHAR(8) NULL,
  `estado` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`assistencia_id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `artigos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `artigos` (
  `artigo_id` INT NOT NULL,
  `marca` VARCHAR(45) NULL,
  `modelo` VARCHAR(45) NULL,
  `descricao` VARCHAR(255) NOT NULL,
  `localizacao` VARCHAR(5) NULL,
  `qty` INT NULL,
  PRIMARY KEY (`artigo_id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `encomendas`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `encomendas` (
  `encomenda_id` INT NOT NULL,
  `artigo_id` INT NOT NULL,
  `assistencia_id` INT NULL,
  `cliente_user_id` INT NULL,
  `observacao` TEXT(1000) NULL,
  `estado` VARCHAR(45) NOT NULL,
  `previsao_entrega` DATE NOT NULL,
  `orcamento` INT NULL,
  `fornecedor` VARCHAR(200) NULL,
  `qty` INT NULL,
  PRIMARY KEY (`encomenda_id`))
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
