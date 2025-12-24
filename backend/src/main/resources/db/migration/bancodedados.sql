-- Tabela Perfil
CREATE TABLE perfil (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  nome VARCHAR(255)
);


--tabela usuario
CREATE TABLE usuario (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  nome VARCHAR(255),
  username VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  status BOOLEAN NOT NULL,
  igreja_id BIGINT
);

ALTER TABLE usuario
   ADD CONSTRAINT fk_usuario_igreja
   FOREIGN KEY (igreja_id) REFERENCES igreja(id);


-- Tabela de junção entre Usuario e Perfil (many-to-many)
CREATE TABLE usuario_perfil (
   id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
   id_usuario BIGINT,
   id_perfil BIGINT,
   FOREIGN KEY (id_usuario) REFERENCES usuario(id),
   FOREIGN KEY (id_perfil) REFERENCES perfil(id)
);


-- Tabela Aluno
CREATE TABLE aluno (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    nome VARCHAR(255),
	aniversario DATE,
	perfil_id BIGINT,
	usuario_id BIGINT,
	area VARCHAR(55),
	novo_convertido BOOLEAN,
	sexo CHAR(1)
);

ALTER TABLE aluno
ADD CONSTRAINT fk_aluno_usuario FOREIGN KEY (usuario_id) REFERENCES usuario(id);

ALTER TABLE aluno
ADD CONSTRAINT fk_aluno_perfil FOREIGN KEY (perfil_id) REFERENCES perfil(id);


-- Tabela Aula
CREATE TABLE aula (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    licao VARCHAR(255),
    dia DATE,
    alunos_matriculados VARCHAR(50),
    trimestre VARCHAR(50),
    ausentes VARCHAR(50),
    presentes VARCHAR(50),
    visitantes VARCHAR(50),
    total_assistencia VARCHAR(50),
    biblias VARCHAR(50),
    revistas VARCHAR(50),
    oferta numeric (10,2)
);

-- Tabela Turma
CREATE TABLE turma (
   id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
   nome VARCHAR(255),
   idade_minima INTEGER,
   idade_maxima INTEGER
);


-- Tabela de junção entre Aluno e Aula (many-to-many)
CREATE TABLE aluno_aula (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
	id_aluno BIGINT,
    id_aula BIGINT,
	nome_aluno VARCHAR(255),
	presente BOOLEAN,
    FOREIGN KEY (id_aluno) REFERENCES aluno(id),
    FOREIGN KEY (id_aula) REFERENCES aula(id)
);



-- Tabela de junção entre Aluno e Turma (many-to-many)
CREATE TABLE aluno_turma (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
	aluno_id BIGINT,
    turma_id BIGINT,
    FOREIGN KEY (aluno_id) REFERENCES aluno(id),
    FOREIGN KEY (turma_id) REFERENCES turma(id)
);


-- Tabela de junção entre Aula e Turma (many-to-many)
CREATE TABLE aula_turma (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    id_aula BIGINT,
    id_turma BIGINT,
	FOREIGN KEY (id_aula) REFERENCES aula(id),
	FOREIGN KEY (id_turma) REFERENCES turma(id)
);



-- Tabela EBD (Escola Bíblica Dominical)
CREATE TABLE ebd (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    nome VARCHAR(255),
	coordenador VARCHAR(255),
	vice_coordenador VARCHAR(255),
	presbitero VARCHAR(255)
);



-- Tabela de junção entre EBD e Turma (many-to-many)
CREATE TABLE ebd_turma (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    id_ebd BIGINT,
    id_turma BIGINT,
    FOREIGN KEY (id_ebd) REFERENCES ebd(id),
    FOREIGN KEY (id_turma) REFERENCES turma(id)
);



-- Tabela Igreja
CREATE TABLE igreja (
	id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
	nome VARCHAR(255),
	endereco VARCHAR(255),
	complemento VARCHAR(255),
    cnpj VARCHAR(14)
    CHECK (cnpj ~ '^[0-9]+$')
    CHECK (char_length(cnpj) = 14),
	bairro VARCHAR(255),
	cidade VARCHAR(255),
	area VARCHAR(255),
    cep VARCHAR(8)
        CHECK (cep ~ '^[0-9]+$')
        CHECK (char_length(cep) = 8)
);


-- Tabela de junção entre Igreja e EBD (many-to-many)
CREATE TABLE igreja_ebd (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
	id_igreja BIGINT,
    id_ebd BIGINT,
    FOREIGN KEY (id_igreja) REFERENCES igreja(id),
    FOREIGN KEY (id_ebd) REFERENCES ebd(id)
);

-- Tabela Professor
CREATE TABLE professor (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    nome VARCHAR(255),
	perfil_id BIGINT,
	usuario_id BIGINT,
	aniversario DATE
);
ALTER TABLE professor
ADD CONSTRAINT fk_professor_usuario FOREIGN KEY (usuario_id) REFERENCES usuario(id),
ADD CONSTRAINT fk_professor_perfil FOREIGN KEY (perfil_id) REFERENCES perfil(id);


-- Tabela de junção entre Professor e Aula (many-to-many)
CREATE TABLE professor_aula (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
	id_professor BIGINT,
    id_aula BIGINT,
    FOREIGN KEY (id_professor) REFERENCES professor(id),
    FOREIGN KEY (id_aula) REFERENCES aula(id)
);


-- Tabela de junção entre Professor e Turma (many-to-many)
CREATE TABLE professor_turma (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
	id_professor BIGINT,
    id_turma BIGINT,
    FOREIGN KEY (id_professor) REFERENCES professor(id),
    FOREIGN KEY (id_turma) REFERENCES turma(id)
);

-- Tabela de Pedidos
CREATE TABLE pedido (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    nome varchar (255),
	data_pedido DATE NOT NULL,
    data_entrega_prevista DATE NOT NULL,
    igreja_id BIGINT NOT NULL,
    descricao TEXT NOT NULL, -- Descrição detalhada do pedido (formatos de revista, quantidade, etc)
	status VARCHAR(50),
	trimestre VARCHAR(50),
	total DECIMAL(10, 2),
    FOREIGN KEY (igreja_id) REFERENCES igreja(id)
);


-- Tabela de Revista (para alunos e professores)
CREATE TABLE revista (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    nome VARCHAR(255) NOT NULL,
    formato VARCHAR(255) NOT NULL, -- Exemplo: "Juniores", "Juniores Caderno"
    tipo VARCHAR(50) CHECK (tipo IN ('ALUNO', 'PROFESSOR')) NOT NULL, -- Define o tipo de revista
    preco DECIMAL(10, 2) NOT NULL -- Preço da revista
);


CREATE TABLE pedido_revista (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    pedido_id BIGINT NOT NULL,
    revista_id BIGINT NOT NULL,
    quantidade INT NOT NULL,
    FOREIGN KEY (pedido_id) REFERENCES pedido(id),
    FOREIGN KEY (revista_id) REFERENCES revista(id)
);

CREATE TABLE pagamento (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    valor_total DECIMAL(15, 2) NOT NULL,
    parcelas INT NOT NULL CHECK (parcelas <= 2),
    status VARCHAR(20) NOT NULL CHECK (status IN ('PENDENTE', 'QUITADO', 'ATRASADO')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE parcela (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    numero INT NOT NULL,
    valor DECIMAL(15, 2) NOT NULL,
    data_vencimento DATE NOT NULL,
	data_pagamento DATE,
	status varchar(100),
    atraso INT DEFAULT 0
);


CREATE TABLE pagamento_parcela (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
	pagamento_id BIGINT NOT NULL,
    parcela_id BIGINT NOT NULL,
    FOREIGN KEY (pagamento_id) REFERENCES pagamento(id),
    FOREIGN KEY (parcela_id) REFERENCES parcela(id)
);

-- Tabela pedido_pagamento
CREATE TABLE pedido_pagamento (
	id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    pedido_id BIGINT NOT NULL,
    pagamento_id BIGINT NOT NULL,
    igreja_id BIGINT NOT NULL,  -- Novo campo para referenciar a tabela igreja
    FOREIGN KEY (pedido_id) REFERENCES pedido(id) ON DELETE CASCADE,
    FOREIGN KEY (pagamento_id) REFERENCES pagamento(id) ON DELETE CASCADE,
    FOREIGN KEY (igreja_id) REFERENCES igreja(id) ON DELETE CASCADE  -- Referência para a tabela igreja
);

-- Tabela de Pagamento de Revistas
CREATE TABLE pagamento_revista (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    revista_id BIGINT NOT NULL,
    aluno_id BIGINT,
    professor_id BIGINT,
    data_pagamento DATE,
    pago BOOLEAN NOT NULL,
    data_vencimento DATE NOT NULL,
    parcela SMALLINT CHECK (parcela BETWEEN 1 AND 2),
    valor_pago DECIMAL(10, 2),
    FOREIGN KEY (revista_id) REFERENCES revista(id),
    FOREIGN KEY (aluno_id) REFERENCES aluno(id),
    FOREIGN KEY (professor_id) REFERENCES professor(id),
    CHECK ((aluno_id IS NOT NULL AND professor_id IS NULL) OR (aluno_id IS NULL AND professor_id IS NOT NULL))
);


-- Tabela de Entrega de Revistas
CREATE TABLE entrega_revista (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    revista_id BIGINT NOT NULL,
    aluno_id BIGINT,
    professor_id BIGINT,
    data_entrega DATE NOT NULL,
    FOREIGN KEY (revista_id) REFERENCES revista(id),
    FOREIGN KEY (aluno_id) REFERENCES aluno(id),
    FOREIGN KEY (professor_id) REFERENCES professor(id)
);

-- Tabela de verificação de codigo
CREATE TABLE codigo_verificacao (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    email VARCHAR(255),
    codigo VARCHAR(50),
    expiracao TIMESTAMP
);

-- Criação da função do gatilho
CREATE OR REPLACE FUNCTION update_updated_at()
    RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;  -- Atualiza a coluna `updated_at`
    RETURN NEW;  -- Retorna o registro modificado
END;
$$ LANGUAGE plpgsql;

-- Criação do gatilho (trigger) para a tabela `pagamento`
CREATE TRIGGER trigger_update_updated_at
    BEFORE UPDATE ON pagamento
    FOR EACH ROW
EXECUTE FUNCTION update_updated_at();


CREATE OR REPLACE FUNCTION atualizar_atraso()
    RETURNS TRIGGER AS $$
BEGIN
    NEW.atraso := GREATEST(0, CURRENT_DATE - NEW.data_vencimento);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_atualizar_atraso
    BEFORE INSERT OR UPDATE ON parcela
    FOR EACH ROW
EXECUTE FUNCTION atualizar_atraso();

INSERT INTO perfil (nome) VALUES
                              ('ADMIN'),
                              ('COORDENADOR'),
                              ('PROFESSOR'),
                              ('SECRETARIA'),
                              ('ALUNO'),
                              ('ADMIN_IGREJA');

INSERT INTO usuario (nome, email, senha, perfil_id)
VALUES ('Administrador do Sistema', 'admin@sistema.com', '$2b$10$HASH_DA_SENHA_AQUI', 1);

/*


--Limpa tabela pedido_pagamento
DELETE FROM pedido_pagamento
WHERE pagamento_id NOT IN (SELECT id FROM pagamento)
   OR pedido_id NOT IN (SELECT id FROM pedido);


--INSERTS

INSERT INTO igreja (nome, endereco, complemento, cnpj, cep) VALUES
('Congregação Monte Sinai', 'Rua Jericó nº 41', 'Perto da Praça', 12345678901234, '67125098'),
('Congregação Pedra Angular', 'Avenida do Amor', 'Bairro Feliz', 98765432109876, '98765432'),
('Congregação Porta Formosa', 'Rua da Esperança', 'Vila Esperança', 56789012345678, '54321876');



INSERT INTO ebd (nome, coordenador, vice_coordenador, presbitero) 
VALUES 
('EBD Monte Sinai', 'Josivan Vieira', 'Leonardo Magalhães', 'Ernandes Prata'),
('EBD Pedra Angular', 'Pedro Almeida', 'Ana Costa', 'Carlos Souza'),
('EBD Monte Horebe', 'Mariana Pereira', 'Rafael Santos', 'Paula Oliveira'),
('EBD Porta Formosa', 'Fernando Lima', 'Carla Rodrigues', 'Antônio Costa'),
('EBD Monte Gerizim', 'Lucas Mendes', 'Patrícia Alves', 'Roberto Silva');

INSERT INTO turma (nome, idade_minima , idade_maxima) VALUES
    ('Maternal', 3, 4),
    ('Senhoras Guerreiras do Sinai', 25 , 80),
    ('Adolescentes Monte Sinai', 11, 14 ),
    ('Jardim de Infância', 5, 6 ),
    ('Primários', 7, 8),
    ('Obreiros Valentes do Sinai', 25, 80),
    ('Juniores', 9, 10),
    ('Jovens', 18, 25),
    ('Juvenis', 15, 17),
    ('Berçario - Pedra', 0, 2),
	('Discipulados', 10, 100),
	('Adolescentes de Jesus - Porta formosa', 11,14),
	('Rosas do Jardim - Pedra', 25, 80),
	('Valentes do Senhor - Pedra', 25, 80),
	('Berçario - Monte Sinai', 0, 2),
	('Adolescentes - Pedra', 11, 14),
	('Senhoras Maturidade Cristã - Porta Formosa', 25, 80);


INSERT INTO aula (licao, dia, alunos_matriculados, trimestre, ausentes, presentes, visitantes, total_assistencia, biblias, revistas, oferta) 
VALUES 
('Lições de Matemática', '2024-04-20', '100', '1º trimestre', '5', '90', '5', '95', '50', '30', 10.00),
('História Antiga', '2024-04-21', '80', '2º trimestre', '2', '78', '10', '88', '40', '25', 12.50),
('Geografia Mundial', '2024-04-22', '120', '3º trimestre', '10', '110', '8', '118', '60', '40', 18.75),
('Ciências Naturais', '2024-04-23', '95', '1º trimestre', '3', '92', '7', '99', '55', '35', 15.25),
('Língua Portuguesa', '2024-04-24', '110', '2º trimestre', '6', '104', '6', '110', '70', '45', 20.00);


INSERT INTO aluno (nome, aniversario) VALUES
('Noelle Bushkins', '2008-03-28'), ('Ayaka Kokomy', '2010-01-25'), ('Aether Traveller', '2009-06-19'),
('Nilma Bentes', '2000-02-28'), ('Ekaterine Joules', '2002-05-31'),('Marcos Dantas', '2015-06-18'), 
('Bianca Klin', '2000-01-28'), ('Carolina Fell Nungen', '2022-12-03'),('João Silva', '2002-03-12'), 
('Maria Santos', '2008-03-28'), ('Pedro Oliveira', '2009-05-04'),('Ana Souza Farias', '1997-03-24'), 
('Carlos Lima', '1983-05-04'), ('Juliana Pereira', '2015-12-05'), ('Lucas Rodrigues', '2002-07-21'), 
('Fernanda Almeida', '2000-06-09'), ('Rafael Martins', '2005-08-23'), ('Mariana Costa', '2007-12-12'),
('Ana Silva', '1994-03-15'), ('Bruno Costa', '1996-07-22'), ('Carla Oliveira', '1998-11-10'),
('Daniel Santos', '2000-05-05'), ('Elisa Ferreira', '2002-09-18'), ('Felipe Almeida', '2004-01-30'),
('Gabriela Rocha', '2006-06-12'), ('Henrique Lima', '2008-12-25'), ('Isabela Martins', '2010-08-08'),
('João Pereira', '2012-02-14'), ('Karina Souza', '2014-04-27'), ('Lucas Mendes', '2016-10-03'),
('Mariana Ribeiro', '2018-01-19'), ('Nicolas Carvalho', '2020-07-07'), ('Olivia Duarte', '2022-11-21'),
('Pedro Gomes', '1993-09-09'), ('Queila Barbosa', '1995-12-16'), ('Rafael Teixeira', '1997-04-02'),
('Sofia Nunes', '1999-08-28'), ('Thiago Azevedo', '2001-03-13'), ('Uriel Monteiro', '2003-05-24'),
('Valentina Cardoso', '2005-11-11'), ('William Farias', '2007-06-06'), ('Ximena Lopes', '2009-12-29'),
('Yuri Vieira', '2011-02-15'), ('Zaira Pinto', '2013-04-01'), ('Arthur Silva', '2015-10-20'),
('Beatriz Costa', '2017-01-05'), ('Caio Oliveira', '2019-07-23'), ('Daniela Santos', '2021-11-14'),
('Eduardo Ferreira', '1994-03-30'), ('Fabiana Almeida', '1996-09-17'), ('Gustavo Rocha', '1998-05-08'),
('Helena Lima', '2000-12-26'), ('Igor Martins', '2002-08-11'), ('Julia Pereira', '2004-02-03'),
('Kevin Souza', '2006-04-19'), ('Larissa Mendes', '2008-10-27'), ('Matheus Ribeiro', '2010-01-12'),
('Natália Carvalho', '2012-07-07'), ('Otávio Duarte', '2014-11-21'), ('Paula Gomes', '2016-09-09'),
('Quirino Barbosa', '2018-12-16'), ('Renata Teixeira', '2020-04-02'), ('Samuel Nunes', '2022-08-28'),
('Tainá Azevedo', '1993-03-13'), ('Ulisses Monteiro', '1995-05-24'), ('Vanessa Cardoso', '1997-11-11'),
('Wagner Farias', '1999-06-06'), ('Yasmin Lopes', '2001-12-29');



INSERT INTO professor (nome) VALUES
    ('João Silva'),
    ('Maria Oliveira'),
    ('Pedro Santos'),
    ('Ana Costa'),
    ('Luiza Pereira');
	
INSERT INTO professor_aula (id_professor, id_aula) VALUES
	(5,1),(1,2),(3,4),(2,5),(4,3);

	
INSERT INTO professor_turma (id_professor, id_turma) VALUES
	(5,1),(1,2),(3,4),(2,5),(4,3), (5,11), (4,10), (3,9), (2,8), (1,7), (3,6);
	
INSERT INTO ebd_turma (id_ebd, id_turma) VALUES
	(1,10),(3,4),(3,8),(2,3),(2,1),(4,2),(4,9),(5,5),(5,6);
	
INSERT INTO aluno_aula (id_aluno, id_aula, nome_aluno, presente) VALUES
    (12,6, 'Marcos Dantas', true), (1,11),(2,10),(3,9),(4,8),(5,6), (6,7), (7,5), (8,4), (9,3), (10,2), (11,1);
	
INSERT INTO aluno_turma (aluno_id, turma_id) VALUES
    (12,7), (1,11),(2,10),(3,9),(4,8),(5,6), (6,7), (7,5), (8,4), (9,3), (10,2), (11,1);
	
INSERT INTO aula_turma (id_aula, id_turma) VALUES
    (13,2), (1,11),(2,10),(3,9),(4,8),(5,6), (6,7), (7,5), (8,4), (9,3), (10,2), (11,1);
	

INSERT INTO perfil (nome) VALUES 
    ('ADMIN'),
    ('COORDENADOR'),
    ('PROFESSOR'),
    ('SECRETARIA'),
    ('ALUNO'),
	('ADMIN_IGREJA');
	
INSERT INTO usuario_perfil (id_usuario, id_perfil) VALUES
(17,3);



-- Tabela de Saldo da Igreja (removida do escopo)
--CREATE TABLE saldo_igreja (
--    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
--    igreja_id BIGINT NOT NULL,
--    trimestre SMALLINT CHECK (trimestre BETWEEN 1 AND 4),
--    valor_total DECIMAL(10, 2) NOT NULL, -- Valor total a ser pago pela igreja
--    valor_pago DECIMAL(10, 2) DEFAULT 0, -- Valor já pago pela igreja
--    data_atualizacao DATE NOT NULL, -- Data da última atualização
--    data_vencimento DATE NOT NULL, -- Data de vencimento da dívida
--    FOREIGN KEY (igreja_id) REFERENCES igreja(id)
--);
*/

/*
SELECT
    a.id AS aluno_id,
    a.nome AS aluno_nome,
    t.id AS turma_id,
    t.nome AS turma_nome,
    DATE_PART('year', AGE(a.aniversario)) AS idade_aluno,
    t.idade_minima,
    t.idade_maxima
FROM 
    aluno a
JOIN 
    aluno_turma at ON a.id = at.aluno_id
JOIN 
    turma t ON at.turma_id = t.id
WHERE 
    DATE_PART('year', AGE(a.aniversario)) < t.idade_minima 
    OR 
    DATE_PART('year', AGE(a.aniversario)) > t.idade_maxima;
*/

/*
WITH AlunoNumerado AS (
    SELECT id, ROW_NUMBER() OVER (ORDER BY id) AS row_num
    FROM aluno
),
Distribuicao AS (
    SELECT id, 
           CASE 
               WHEN row_num % 11 = 1 THEN 'AREA_01'
               WHEN row_num % 11 = 2 THEN 'AREA_02'
               WHEN row_num % 11 = 3 THEN 'AREA_03'
               WHEN row_num % 11 = 4 THEN 'AREA_04'
               WHEN row_num % 11 = 5 THEN 'AREA_05'
               WHEN row_num % 11 = 6 THEN 'AREA_06'
               WHEN row_num % 11 = 7 THEN 'AREA_07'
               WHEN row_num % 11 = 8 THEN 'AREA_08'
               WHEN row_num % 11 = 9 THEN 'AREA_09'
               WHEN row_num % 11 = 10 THEN 'AREA_10'
               ELSE 'AREA_11'
           END AS area
    FROM AlunoNumerado
)
UPDATE aluno
SET area = Distribuicao.area
FROM Distribuicao
WHERE aluno.id = Distribuicao.id;


-- Atualizar 20% dos homens
WITH homens AS (
    SELECT id
    FROM aluno
    WHERE sexo = 'M'
    ORDER BY RANDOM()
    LIMIT (SELECT COUNT(*) * 0.2 FROM aluno WHERE sexo = 'M')
)
UPDATE aluno
SET novo_convertido = true
WHERE id IN (SELECT id FROM homens);

-- Atualizar 30% das mulheres
WITH mulheres AS (
    SELECT id
    FROM aluno
    WHERE sexo = 'F'
    ORDER BY RANDOM()
    LIMIT (SELECT COUNT(*) * 0.3 FROM aluno WHERE sexo = 'F')
)
UPDATE aluno
SET novo_convertido = true
WHERE id IN (SELECT id FROM mulheres);


UPDATE aluno
SET novo_convertido = false
WHERE novo_convertido IS NULL;  -->

*/