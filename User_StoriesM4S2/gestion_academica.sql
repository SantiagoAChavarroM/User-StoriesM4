-- =========================================
-- WEEK 2 - ACADEMIC SYSTEM 
-- File: gestion_academica.sql
-- =========================================

DROP DATABASE IF EXISTS gestion_academica_universidad;
CREATE DATABASE gestion_academica_universidad;

USE gestion_academica_universidad;

-- =========================================

CREATE TABLE docentes (
    id_docente INT AUTO_INCREMENT PRIMARY KEY,
    nombre_completo VARCHAR(100) NOT NULL,
    correo_institucional VARCHAR(100) NOT NULL UNIQUE,
    departamento_academico VARCHAR(100) NOT NULL,
    anios_experiencia INT NOT NULL,
    CHECK (anios_experiencia >= 0)
);

-- =========================================

CREATE TABLE estudiantes (
    id_estudiante INT AUTO_INCREMENT PRIMARY KEY,
    nombre_completo VARCHAR(100) NOT NULL,
    correo_electronico VARCHAR(100) NOT NULL UNIQUE,
    genero CHAR(1) NOT NULL,
    identificacion VARCHAR(20) NOT NULL UNIQUE,
    carrera VARCHAR(100) NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    fecha_ingreso DATE NOT NULL,
    CHECK (genero IN ('M','F','O'))
);

-- =========================================

CREATE TABLE cursos (
    id_curso INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    codigo VARCHAR(20) NOT NULL UNIQUE,
    creditos INT NOT NULL,
    semestre INT NOT NULL,
    id_docente INT,
    CHECK (creditos > 0),
    FOREIGN KEY (id_docente)
        REFERENCES docentes(id_docente)
        ON DELETE SET NULL
);

-- =========================================

CREATE TABLE inscripciones (
    id_inscripcion INT AUTO_INCREMENT PRIMARY KEY,
    id_estudiante INT NOT NULL,
    id_curso INT NOT NULL,
    fecha_inscripcion DATE NOT NULL,
    calificacion_final DECIMAL(4,2),
    CHECK (calificacion_final BETWEEN 0 AND 5),
    FOREIGN KEY (id_estudiante)
        REFERENCES estudiantes(id_estudiante)
        ON DELETE CASCADE,
    FOREIGN KEY (id_curso)
        REFERENCES cursos(id_curso)
        ON DELETE CASCADE
);

-- =========================================
-- DATA INSERTION (DML) ACADEMIC SYSTEM 
-- =========================================

INSERT INTO docentes 
(nombre_completo, correo_institucional, departamento_academico, anios_experiencia)
VALUES
('Laura Gómez', 'laura@uni.edu', 'Ingeniería', 8),
('Carlos Pérez', 'carlos@uni.edu', 'Ciencias', 4),
('Ana Martínez', 'ana@uni.edu', 'Humanidades', 10);

-- =========================================

INSERT INTO estudiantes
(nombre_completo, correo_electronico, genero, identificacion, carrera, fecha_nacimiento, fecha_ingreso)
VALUES
('Juan Torres','juan@mail.com','M','1001','Ingeniería','2002-05-10','2021-01-15'),
('María Ríos','maria@mail.com','F','1002','Administración','2001-03-12','2020-01-10'),
('Sofía Castro','sofia@mail.com','F','1003','Psicología','2003-07-08','2022-01-20'),
('Andrés León','andres@mail.com','M','1004','Ingeniería','2000-09-14','2019-07-15'),
('Camila Díaz','camila@mail.com','O','1005','Ingeniería','2002-12-01','2021-07-01');

-- =========================================

INSERT INTO cursos (nombre, codigo, creditos, semestre, id_docente)
VALUES
('Bases de Datos','BD101',4,2,1),
('Programación I','PRG101',3,1,1),
('Estadística','EST201',3,2,2),
('Ética Profesional','ETI301',2,3,3);

-- =========================================

INSERT INTO inscripciones 
(id_estudiante, id_curso, fecha_inscripcion, calificacion_final)
VALUES
(1,1,'2024-02-01',4.5),
(1,3,'2024-02-02',3.8),
(2,1,'2024-02-01',3.0),
(2,4,'2024-02-03',4.9),
(3,2,'2024-02-01',2.8),
(3,3,'2024-02-02',3.5),
(4,1,'2024-02-01',4.0),
(5,1,'2024-02-01',4.7);

-- =========================================
-- QUERIES (DQL) ACADEMIC SYSTEM 
-- =========================================
-- JOIN students + courses
-- =========================================

SELECT e.nombre_completo, c.nombre, i.calificacion_final
FROM estudiantes e
JOIN inscripciones i ON e.id_estudiante = i.id_estudiante
JOIN cursos c ON i.id_curso = c.id_curso;

-- =========================================
-- Courses with teachers > 5 years of experience 
-- =========================================

SELECT c.nombre, d.nombre_completo, d.anios_experiencia
FROM cursos c
JOIN docentes d ON c.id_docente = d.id_docente
WHERE d.anios_experiencia > 5;

-- =========================================
-- Average per course 
-- =========================================

SELECT c.nombre, ROUND(AVG(i.calificacion_final),2) AS promedio
FROM cursos c
JOIN inscripciones i ON c.id_curso = i.id_curso
GROUP BY c.nombre;

-- =========================================
-- Students with more than one course 
-- =========================================

SELECT e.nombre_completo, COUNT(*) AS total_cursos
FROM estudiantes e
JOIN inscripciones i ON e.id_estudiante = i.id_estudiante
GROUP BY e.nombre_completo
HAVING COUNT(*) > 1;

-- =========================================
-- ALTER TABLE 
-- =========================================

ALTER TABLE estudiantes
ADD estado_academico VARCHAR(20) DEFAULT 'ACTIVO';

-- =========================================
-- Test DELETE 
-- =========================================

DELETE FROM docentes WHERE id_docente = 2;
SELECT * FROM cursos;

-- =========================================
-- Courses with more than 2 enrollments 
-- =========================================

SELECT c.nombre, COUNT(i.id_inscripcion) AS inscritos
FROM cursos c
JOIN inscripciones i ON c.id_curso = i.id_curso
GROUP BY c.nombre
HAVING COUNT(i.id_inscripcion) > 2;

-- =========================================
-- SUBQUERIES ACADEMIC SYSTEM 
-- =========================================
-- Compares each student's average with the overall average.
-- =========================================

SELECT e.nombre_completo,
       ROUND(AVG(i.calificacion_final),2) AS promedio_estudiante
FROM estudiantes e
JOIN inscripciones i ON e.id_estudiante = i.id_estudiante
GROUP BY e.nombre_completo
HAVING AVG(i.calificacion_final) >
      (SELECT AVG(calificacion_final) FROM inscripciones);

-- =========================================
-- Filters careers of students enrolled in courses semester >= 2.
-- =========================================

SELECT DISTINCT carrera
FROM estudiantes
WHERE id_estudiante IN (
    SELECT i.id_estudiante
    FROM inscripciones i
    JOIN cursos c ON i.id_curso = c.id_curso
    WHERE c.semestre >= 2
);

-- =========================================
-- INDICATORS (FUNCTIONS) ACADEMIC SYSTEM 
-- ROUND / SUM / MAX / MIN / COUNT
-- =========================================

SELECT 
    COUNT(*) AS total_inscripciones,
    ROUND(AVG(calificacion_final),2) AS promedio_general,
    MAX(calificacion_final) AS max_nota,
    MIN(calificacion_final) AS min_nota,
    SUM(calificacion_final) AS suma_notas
FROM inscripciones;

-- =========================================
-- ACADEMIC SYSTEM VIEW 
-- vista_historial_academico
-- =========================================

CREATE VIEW vista_historial_academico AS
SELECT e.nombre_completo AS estudiante,
       c.nombre AS curso,
       d.nombre_completo AS docente,
       c.semestre,
       i.calificacion_final
FROM inscripciones i
JOIN estudiantes e ON i.id_estudiante = e.id_estudiante
JOIN cursos c ON i.id_curso = c.id_curso
LEFT JOIN docentes d ON c.id_docente = d.id_docente;

-- =========================================
-- ACCESS CONTROL (DCL)
-- =========================================

CREATE ROLE revisor_academico;

GRANT SELECT ON gestion_academica_universidad.vista_historial_academico
TO revisor_academico;

REVOKE INSERT, UPDATE, DELETE
ON gestion_academica_universidad.inscripciones
FROM revisor_academico;

-- =========================================
-- TRANSACTIONS (TCL)
-- BEGIN / SAVEPOINT / ROLLBACK / COMMIT
-- =========================================

START TRANSACTION;

UPDATE inscripciones
SET calificacion_final = 4.9
WHERE id_inscripcion = 3;

SAVEPOINT punto1;

UPDATE inscripciones
SET calificacion_final = 1.0
WHERE id_inscripcion = 4;

ROLLBACK TO punto1;

COMMIT;

-- =========================================
-- EVIDENCE
-- =========================================

SHOW TABLES;

SELECT * FROM vista_historial_academico;

SELECT 
    COUNT(*) AS total_estudiantes
FROM estudiantes;