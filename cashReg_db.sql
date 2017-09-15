CREATE DATABASE IF NOT EXISTS cashReg_db;

USE cashReg_db;


/* Création des tables */

CREATE TABLE IF NOT EXISTS item_cashReg (
	idint_item int PRIMARY KEY AUTO_INCREMENT,
	idext_item int,
	name_item varchar(20),
	description_item text,
	value_item numeric(5,2),
	quantity_item int
) ENGINE=InnoDB;


CREATE TABLE IF NOT EXISTS sum_cashReg (
	idint_sum int PRIMARY KEY AUTO_INCREMENT,
	idext_sum int,
	date_sum DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;


CREATE TABLE IF NOT EXISTS sum_item_cashReg (
	id_item int,
	id_sum int,
	quantity_sum int,
	FOREIGN KEY (id_item) REFERENCES item_cashReg(idint_item),
	FOREIGN KEY (id_sum) REFERENCES sum_cashReg(idint_sum)
) ENGINE=InnoDB;


CREATE TABLE IF NOT EXISTS categorie_cashReg (
	idint_categorie int PRIMARY KEY AUTO_INCREMENT,
	idext_categorie int,
	name_categorie varchar(20),
	description_categorie text
) ENGINE=InnoDB;


CREATE TABLE IF NOT EXISTS categorie_item_cashReg (
	id_item int,
	id_categorie int,
	FOREIGN KEY (id_item) REFERENCES item_cashReg(idint_item),
	FOREIGN KEY (id_categorie) REFERENCES categorie_cashReg(idint_categorie)
) ENGINE=InnoDB;




/* INSERTION DE QUELQUES DONNEES DE BASE */

INSERT INTO item_cashReg (idext_item, name_item, description_item, value_item, quantity_item) VALUES 
	(16111147,'Premier Item', 'ceci est un item', 2.50, -1),
	(16111216,'Item 2', 'description de l\'item 2', 4.20, 17),
	(16111224,'Item trois', 'courte description', 3.17, 0);



INSERT INTO sum_cashReg (idext_sum) VALUES 
	(1234),
	(1235);



INSERT INTO sum_item_cashReg (id_item, id_sum, quantity_sum) VALUES 
	(1,1,1),
	(2,1,3),
	(3,1,1),
	(1,2,1),
	(3,2,5);



INSERT INTO categorie_cashReg (idext_categorie, name_categorie, description_categorie) VALUES 
	(45678,'Categorie 1', 'ceci est une categorie'),
	(56789,'Categorie 2', 'ceci est une deuxieme categorie');



INSERT INTO categorie_item_cashReg (id_categorie, id_item) VALUES 
	(1,1),
	(2,3),
	(1,2);