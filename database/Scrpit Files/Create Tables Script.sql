USE osl_election_db;

CREATE TABLE departments (
    department_id INT primary key AUTO_INCREMENT,
    department_name VARCHAR(50) NOT NULL,
    description VARCHAR(200),
    date_added DATETIME DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE locations (
    location_id INT primary key AUTO_INCREMENT,
    location_name VARCHAR(20) NOT NULL,
    description VARCHAR(200),
    date_added DATETIME DEFAULT CURRENT_TIMESTAMP
);
insert into locations (location_name) values ('Bo'),('Freetown'),('Makeni')




CREATE TABLE voters (
    voters_id INT primary KEY NOT NULL auto_increment,
    fullname VARCHAR(150) NOT NULL,
    sex CHAR(1) NOT NULL,
    department_id INT NOT NULL,
    location_id INT NOT NULL,
    vote_count INT(1) DEFAULT 1,
    date_added DATETIME DEFAULT CURRENT_TIMESTAMP
);

desc voters

 
alter table voters modify column fullname varchar(150);

ALTER TABLE voters ADD CONSTRAINT fk_voter_department FOREIGN KEY (department_id) REFERENCES departments(department_id) on delete cascade on update cascade;

ALTER TABLE voters ADD CONSTRAINT fk_voter_location FOREIGN KEY (location_id) REFERENCES locations(location_id) on delete cascade on update cascade;

CREATE TABLE election_status (
    status_id INT PRIMARY KEY AUTO_INCREMENT,
    status_name VARCHAR(50) NOT NULL,
    description VARCHAR(200),
    date_added DATETIME DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE elections (
    election_id INT primary key AUTO_INCREMENT,
    title VARCHAR(250) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status_id INT NOT NULL,
    date_added DATETIME DEFAULT CURRENT_TIMESTAMP
);
alter table elections modify column start_date varchar(20) not null;
alter table elections modify column end_date varchar(20) not null

alter table elections add constraint fk_election_status foreign key(status_id) references election_status(status_id) on delete cascade on update cascade;




CREATE TABLE ballots (
    ballot_id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(200) NOT NULL,
    election_id INT NOT NULL,
    description VARCHAR(200),
    date_added DATETIME DEFAULT CURRENT_TIMESTAMP
);

ALTER tABLE ballots add constraint fk_ballot_election foreign key (election_id) references elections(election_id) on delete cascade on update cascade;

alter table ballots drop foreign key fk_ballot_election

truncate table elections


select * from elections



CREATE TABLE candidates (
    candidate_id INT PRIMARY KEY AUTO_INCREMENT,
    fullname VARCHAR(200) NOT NULL,
    photo VARCHAR(300) NOT NULL,
    ballot_id INT NOT NULL,
    date_added DATETIME DEFAULT CURRENT_TIMESTAMP
);

alter table candidates add constraint fk_candidate_ballot foreign key(ballot_id) references ballots(ballot_id)
on delete cascade on update cascade
alter table candidates drop foreign key fk_candidate_ballot


CREATE TABLE votes (
    vote_id INT PRIMARY KEY AUTO_INCREMENT,
    voters_id INT NOT NULL,
    election_id INT NOT NULL,
    candidate_id INT NOT NULL,
    date_added DATETIME DEFAULT CURRENT_TIMESTAMP
);

alter table votes add constraint fk_votes_voter foreign key(voters_id) references voters(voters_id);
alter table votes add constraint fk_votes_election foreign key(election_id) references elections(election_id)
ON DELETE CASCADE ON UPDATE CASCADE;
alter table votes add constraint fk_votes_candidate foreign key(candidate_id) references candidates(candidate_id)
ON DELETE CASCADE ON UPDATE CASCADE;

alter table votes drop foreign key fk_votes_election;
alter table votes drop foreign key fk_votes_candidate


select title,start_date,end_date,status_name from elections inner join election_status
on elections.status_id = election_status.status_id

select * from elections
select c.candidate_id,c.fullname,c.photo,c.ballot_id, b.title from candidates as c 
inner join ballots as b on c.ballot_id = b.ballot_id



delete from elections where election_id = 1;

select * from voters

insert into candidates (fullname,photo,ballot_id) values (?,?,?);

select * from departments order by date_added;
insert into departments (department_name) values ('Technical'),('Customer Care'),('Orange Money'),('Administration');

insert into departments (department_name) values ('CEO\'S OFFICE');
insert into departments (department_name) values ('CEO\'S OFFICE - DX');
insert into departments (department_name) values ('CEO\'S OFFICE - FOUNDATION');
insert into departments (department_name) values ('STRATEGIC PLANNING');
insert into departments (department_name) values ('GENERAL SECRETARY');
insert into departments (department_name) values ('IT & N');
insert into departments (department_name) values ('HUMAN RESOURCES');
insert into departments (department_name) values ('FINANCE');
insert into departments (department_name) values ('FINANCE - SCM');
insert into departments (department_name) values ('AUDIT,RISK & INTERNAL CONTROL');
insert into departments (department_name) values ('COMMERCIAL - S&D');
insert into departments (department_name) values ('COMMERCIAL - ENTERPRISE');
insert into departments (department_name) values ('COMMERCIAL - CX');
insert into departments (department_name) values ('ORANGE MOBILE FINANCE (SL) LTD');


insert into departments (department_name) values ('MARKETING & COMMUNICATION')
,('COMMERCIAL - KYC'),
('COMMERCIAL - ORANGE MONEY'),
('ORANGE MONEY'),
('MARKETING')


select * from departments
select * from voters

delete from locations
where location_id between 1 and 5

insert into locations (location_name) values ('FREETOWN');
insert into locations (location_name) values ('KENEMA');
insert into locations (location_name) values ('WELLINGTON');
insert into locations (location_name) values ('MAKENI');
insert into locations (location_name) values ('KONO');
insert into locations (location_name) values ('BO');


select  election_id,title,start_date,end_date,status_name from elections inner join election_status on elections.status_id = election_status.status_id where status_name = 'Begining' limit 1


desc voters

alter table voters add column voter_key varchar(50) after sex
alter table voters add column voter_pass varchar(50) after voter_key

alter table voters add column voter_type varchar(20) after location_id


select * from voters

truncate table voters

select voters_id, fullname, sex,voter_key,voter_pass, department_name,location_name,vote_count,voter_type from voters inner join departments on voters.department_id = departments.department_id inner join locations on voters.location_id = locations.location_id where voters_id = 1

select voters_id, fullname, sex,voter_key,voter_pass, department_name,location_name,vote_count,voter_type from voters inner join departments on voters.department_id = departments.department_id inner join locations on voters.location_id = locations.location_id where voter_key = 'vt01'

select * from votes where voters_id = 1 LIMIT 1



alter table votes drop column election_id


alter table votes drop foreign key fk_votes_election



delete from votes where vote_id between 1 and 10