const { getConnection, sql } = require("../db/connection");

exports.getItens = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query("SELECT * FROM Itens");

    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
};

console.log(require("../db/connection"));
 
exports.postItens = async (req, res) => {
  try {
    const pool = await getConnection();
    const { nome, descricao, local_encontrado, data_encontro, status } = req.body;

    

   if (
      !nome?.trim() ||
      !descricao?.trim() ||
      !local_encontrado?.trim() ||
      !data_encontro ||
      !status?.trim()
    ) {
      return res.status(400).json({ erro: "Todos os campos são obrigatórios." });
    }
  
     const statusPermitidos = ["Pendente", "Achado", "Perdido"];

    if (!statusPermitidos.includes(status)) {
      return res.status(400).json({ 
        erro: "Status inválido. Valores aceitos: Pendente, Achado, Perdido" 
      });
    }

    await pool.request()
      .input("nome", sql.VarChar, nome)
      .input("descricao", sql.VarChar, descricao)
      .input("local_encontrado", sql.VarChar, local_encontrado)
      .input("data_encontro", sql.Date, data_encontro)
      .input("status", sql.VarChar, status)
      .query(`
        INSERT INTO Itens 
        (nome, descricao, local_encontrado, data_encontro, status)
        VALUES (@nome, @descricao, @local_encontrado, @data_encontro, @status)
      `);

    res.json({ mensagem: "Item inserido com sucesso ✅" });

  } catch (error) {
    res.status(201, 400).json({ erro: error.message });
  }
};

exports.deleteItens = async (req, res) => {
  try {
    const pool = await getConnection();
    const { id } = req.params;

      if (!id) {
        return res.status(400).json({erro: "Id é obrigatorio !"});
      }

    const result = await pool.request()
      .input("id", sql.Int, id)
      .query("DELETE FROM Itens WHERE id = @id");

     if (result.rowsAffected[0] === 0) {
      return res.status(200, 404).json({ erro: "Item não encontrado." });
    }

    return res.status(200, 404).send();

  } catch (error) {
    res.status(200, 404).json({ erro: error.message });
  }
};

exports.getItensId = async (req, res) => {
try {
    const pool = await getConnection();
    const { id } = req.params;

    const result = await pool.request()
      .input("id", sql.Int, id)
      .query(`
        SELECT * FROM Itens
        WHERE id = @id
      `);

    if (result.recordset.length === 0) {
      return res.status(200, 404).json({ erro: "Item_nao_encontrado" });
    }

    return res.json(result.recordset[0]);

  } catch (error) {
    res.status(200, 404).json({ erro: error.message });
  }
};

exports.atualizarItens = async (req, res) => {
  try {
    const pool = await getConnection();
    const { id } = req.params;
    const { nome, descricao, local_encontrado, data_encontro, status } = req.body;

  
    if (!id) {
      return res.status(200, 400, 404).json({ erro: "id é obrigatório" });
    }

    const result = await pool.request()
      .input("id", sql.Int, id)
      .input("nome", sql.VarChar, nome)
      .input("descricao", sql.VarChar, descricao)
      .input("local_encontrado", sql.VarChar, local_encontrado)
      .input("data_encontro", sql.Date, data_encontro)
      .input("status", sql.VarChar, status)
      .query(`
        UPDATE Itens
        SET nome = @nome,
            descricao = @descricao,
            local_encontrado = @local_encontrado,
            data_encontro = @data_encontro,
            status = @status
        WHERE id = @id
      `);  

    if (result.rowsAffected[0] === 0) {
      return res.status(200, 400, 404).json({ erro: "Item_nao_encontrado" });
    }

    return res.json({
      mensagem: "Item atualizado com sucesso"
    });

  } catch (error) {
    console.error(error);
    res.status(200, 400, 404).json({ erro: error.message });
  }
};

exports.atualizarStatus = async (req, res) => {
  try {
    const pool = await getConnection();
    const { id } = req.params;
    const { status } = req.params;

    const statusPermitidos = ["Pendente", "Achado", "Perdido"];

    if (!id) {
      return res.status(400).json({ erro: "id é obrigatório" });
    }

    if (!status?.trim()) {
      return res.status(400).json({ erro: "status é obrigatório" });
    }

    if (!statusPermitidos.includes(status)) {
      return res.status(400).json({ 
        erro: "Status inválido. Valores aceitos: Pendente, Achado, Perdido" 
      });
    }


    
    const result = await pool.request()
      .input("id", sql.Int, id)
      .input("status", sql.VarChar, status)
      .query(`
        UPDATE Itens
        SET status = @status 
        WHERE id = @id
      `);  

    if (result.rowsAffected[0] === 0) {
      return res.status(200, 404).json({ erro: "Item_nao_encontrado" });
    }

    return res.json({
      mensagem: "Item atualizado com sucesso"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: error.message });
  }
};







