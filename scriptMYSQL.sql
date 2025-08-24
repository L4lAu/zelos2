drop database zelo;
-- Criar banco de dados
CREATE DATABASE zelo;
USE zelo;

-- Tabela de usuários
CREATE TABLE usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    email_criptografado TEXT NOT NULL,
    telefone_criptografado TEXT NULL,
    cpf_criptografado TEXT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    tipo ENUM('usuario', 'tecnico', 'adm') NOT NULL DEFAULT 'usuario',
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em DATETIME NULL ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela de equipamentos
CREATE TABLE equipamentos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    patrimonio VARCHAR(50) UNIQUE NOT NULL,
    descricao TEXT NULL,
    tipo VARCHAR(50) NOT NULL,
    localizacao VARCHAR(100) NULL,
    status ENUM('ativo', 'inativo', 'manutencao') NOT NULL DEFAULT 'ativo',
    criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em DATETIME NULL ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela de chamados
CREATE TABLE chamados (
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_usuario INT NOT NULL,
    id_tecnico INT NULL,
    patrimonio VARCHAR(50) NOT NULL,
    descricao TEXT NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    status ENUM('aberto', 'em_andamento', 'fechado') NOT NULL DEFAULT 'aberto',
    criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fechado_em DATETIME NULL,
    atualizado_em DATETIME NULL ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id),
    FOREIGN KEY (id_tecnico) REFERENCES usuarios(id),
    FOREIGN KEY (patrimonio) REFERENCES equipamentos(patrimonio)
);

-- Tabela de apontamentos
CREATE TABLE apontamentos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_chamado INT NOT NULL,
    id_tecnico INT NOT NULL,
    descricao TEXT NOT NULL,
    inicio DATETIME NOT NULL,
    fim DATETIME NULL,
    duracao_minutos INT NULL,
    criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em DATETIME NULL ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_chamado) REFERENCES chamados(id),
    FOREIGN KEY (id_tecnico) REFERENCES usuarios(id)
);

-- Índices para melhor performance
CREATE INDEX idx_usuarios_tipo ON usuarios(tipo);
CREATE INDEX idx_usuarios_username ON usuarios(username);
CREATE INDEX idx_equipamentos_patrimonio ON equipamentos(patrimonio);
CREATE INDEX idx_equipamentos_status ON equipamentos(status);
CREATE INDEX idx_chamados_status ON chamados(status);
CREATE INDEX idx_chamados_usuario ON chamados(id_usuario);
CREATE INDEX idx_chamados_tecnico ON chamados(id_tecnico);
CREATE INDEX idx_chamados_patrimonio ON chamados(patrimonio);
CREATE INDEX idx_apontamentos_chamado ON apontamentos(id_chamado);
CREATE INDEX idx_apontamentos_tecnico ON apontamentos(id_tecnico);
CREATE INDEX idx_apontamentos_inicio ON apontamentos(inicio);
CREATE INDEX idx_apontamentos_fim ON apontamentos(fim);

-- Inserir dados iniciais
-- Inserir usuários administradores (senha: admin123)
INSERT INTO usuarios (nome, username, email_criptografado, senha_hash, tipo) VALUES
('Administrador', 'admin', 'U2FsdGVkX1+3pW2Y3pW2Y3pW2Y3pW2Y3pW2Y3pW2Y3pW2Y=', '$2a$12$r3z4t5y6u7i8o9p0q1w2e3r4t5y6u7i8o9p0q1w2e3r4t5y6u7i8o9p0', 'adm'),
('Técnico Exemplo', 'tecnico', 'U2FsdGVkX1+3pW2Y3pW2Y3pW2Y3pW2Y3pW2Y3pW2Y3pW2Y=', '$2a$12$r3z4t5y6u7i8o9p0q1w2e3r4t5y6u7i8o9p0q1w2e3r4t5y6u7i8o9p0', 'tecnico'),
('Usuário Exemplo', 'usuario', 'U2FsdGVkX1+3pW2Y3pW2Y3pW2Y3pW2Y3pW2Y3pW2Y3pW2Y=', '$2a$12$r3z4t5y6u7i8o9p0q1w2e3r4t5y6u7i8o9p0q1w2e3r4t5y6u7i8o9p0', 'usuario');

-- Inserir equipamentos de exemplo
INSERT INTO equipamentos (patrimonio, descricao, tipo, localizacao) VALUES
('PAT001', 'Notebook Dell i7', 'notebook', 'Sala 101'),
('PAT002', 'Desktop HP EliteDesk', 'desktop', 'Sala 202'),
('PAT003', 'Impressora Laser HP', 'impressora', 'Sala 303'),
('PAT004', 'Monitor LG 24"', 'monitor', 'Sala 404'),
('PAT005', 'Tablet Samsung', 'tablet', 'Sala 505');

-- Inserir chamados de exemplo
INSERT INTO chamados (id_usuario, patrimonio, descricao, tipo, status) VALUES
(3, 'PAT001', 'Notebook não liga', 'hardware', 'aberto'),
(3, 'PAT002', 'Software travando frequentemente', 'software', 'em_andamento'),
(3, 'PAT003', 'Impressora não imprime', 'impressora', 'fechado');

-- Inserir apontamentos de exemplo
INSERT INTO apontamentos (id_chamado, id_tecnico, descricao, inicio, fim, duracao_minutos) VALUES
(2, 2, 'Análise inicial do problema', '2024-01-15 09:00:00', '2024-01-15 10:30:00', 90),
(3, 2, 'Substituição do cartucho de toner', '2024-01-10 14:00:00', '2024-01-10 15:15:00', 75);

-- Views úteis para relatórios
CREATE VIEW view_chamados_detalhados AS
SELECT 
    c.*,
    u.nome as nome_usuario,
    t.nome as nome_tecnico,
    e.descricao as descricao_equipamento,
    e.localizacao,
    TIMESTAMPDIFF(HOUR, c.criado_em, c.fechado_em) as tempo_resolucao_horas
FROM chamados c
LEFT JOIN usuarios u ON c.id_usuario = u.id
LEFT JOIN usuarios t ON c.id_tecnico = t.id
LEFT JOIN equipamentos e ON c.patrimonio = e.patrimonio;

CREATE VIEW view_apontamentos_detalhados AS
SELECT 
    a.*,
    c.patrimonio,
    c.descricao as descricao_chamado,
    t.nome as nome_tecnico,
    CASE 
        WHEN a.duracao_minutos IS NULL THEN 'Em andamento'
        WHEN a.duracao_minutos < 60 THEN CONCAT(a.duracao_minutos, 'min')
        ELSE CONCAT(FLOOR(a.duracao_minutos / 60), 'h ', MOD(a.duracao_minutos, 60), 'min')
    END as duracao_formatada
FROM apontamentos a
JOIN chamados c ON a.id_chamado = c.id
JOIN usuarios t ON a.id_tecnico = t.id;

-- Procedures para operações comuns
DELIMITER //

CREATE PROCEDURE sp_criar_chamado(
    IN p_id_usuario INT,
    IN p_patrimonio VARCHAR(50),
    IN p_descricao TEXT,
    IN p_tipo VARCHAR(50)
)
BEGIN
    DECLARE v_equipamento_exists INT;
    
    -- Verificar se o equipamento existe
    SELECT COUNT(*) INTO v_equipamento_exists 
    FROM equipamentos 
    WHERE patrimonio = p_patrimonio AND status = 'ativo';
    
    IF v_equipamento_exists = 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Patrimônio não encontrado ou não está ativo';
    ELSE
        -- Inserir o chamado
        INSERT INTO chamados (id_usuario, patrimonio, descricao, tipo, status, criado_em)
        VALUES (p_id_usuario, p_patrimonio, p_descricao, p_tipo, 'aberto', NOW());
        
        SELECT LAST_INSERT_ID() as novo_id;
    END IF;
END //

CREATE PROCEDURE sp_finalizar_apontamento(IN p_apontamento_id INT)
BEGIN
    DECLARE v_inicio DATETIME;
    DECLARE v_duracao_minutos INT;
    
    -- Obter data de início
    SELECT inicio INTO v_inicio FROM apontamentos WHERE id = p_apontamento_id;
    
    -- Calcular duração em minutos
    SET v_duracao_minutos = TIMESTAMPDIFF(MINUTE, v_inicio, NOW());
    
    -- Atualizar apontamento
    UPDATE apontamentos 
    SET fim = NOW(), duracao_minutos = v_duracao_minutos, atualizado_em = NOW()
    WHERE id = p_apontamento_id;
    
    SELECT ROW_COUNT() as linhas_afetadas;
END //

DELIMITER ;