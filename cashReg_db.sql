CREATE DATABASE IF NOT EXISTS cashReg_db;

USE cashReg_db;


/* Création des tables */

CREATE TABLE IF NOT EXISTS item_cashReg (
	idint_items int PRIMARY KEY AUTO_INCREMENT,
	idext_item int,
	name_item varchar(20),
	description_item text,
	value_item numeric(5,2),
	quantity_item int
) ENGINE=InnoDB;




/* INSERTION DE QUELQUES DONNEES DE BASE */

INSERT INTO items_cashReg (idext_item, name_item, description_item, value_item, quantity_item) VALUES 
	(16111147,'Premier Item', 'ceci est un item', 2.50, -1),
	(16111216,'Item 2', 'description de l\'item 2', 4.20, 17),
	(16111224,'Item trois', 'courte description', 3.17, 0);
