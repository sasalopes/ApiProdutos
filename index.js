require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const multer = require('multer');
const swaggerjsdoc = require("swagger-jsdoc");
const swaggerui = require("swagger-ui-express");
const swaggerDocs = require("./swagger.json");

// Configuração do App
const app = express();
app.use(express.json());
app.use(express.static('uploads'));
app.use("/api-docs", swaggerui.serve, swaggerui.setup(swaggerDocs));


// Configuração do Banco de Dados
mongoose.connect(process.env.MONGODB_URL);
const Produto = require("./models/produto");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
      const extensaoArquivo = file.originalname.split('.')[1];
      const novoNomeArquivo = require('crypto')
          .randomBytes(64)
          .toString('hex');
      cb(null, `${novoNomeArquivo}.${extensaoArquivo}`)
  }
});
const upload = multer({ storage:storage});

// Criação de um novo Produto
app.post("/produtos",  upload.single('imagem'), async (req, res) => {
  try {

    const {nome, descricao, quantidade, preco, desconto, dataDesconto, categoria} = req.body;
    const produto = new Produto ({nome, descricao, quantidade, preco, desconto, dataDesconto, categoria, imagem: req.file.filename});
    await produto.save();
  res.json(produto)
 } catch (err) {
  console.log(err);
  res.status(500).json({ message: "Um erro aconteceu." });
}
});

// Listagem de todos os Produtos
 app.get("/produtos", async (req,res) => {
    const { nome } = req.query;
    const filtro = {};
    if (nome) {
        filtro.nome = { $regex: nome, $options: "i" };
    }
    const produtos = await Produto.find(filtro);
    res.json(produtos);
});

    // Listagem de um Produto especifico (GET)
   app.get("/produtos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { nome } = req.query; // Recupera o parâmetro "nome" da querystring

    let filtro = { _id: id };
    if (nome) {
      filtro.nome = nome;
    }

    const produtoExistente = await Produto.findOne(filtro);

    if (produtoExistente) {
      res.json(produtoExistente);
    } else {
      res.status(404).json({ message: "Produto não encontrado" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Um erro aconteceu" });
  }
});
   
 // Atualização de um Produto (PUT)
 app.put("/produtos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { quantidade, preço } = req.body;

    const filtro = { _id: id };
    const update = {};
    if (quantidade) {
      update.quantidade = quantidade;
    }
    if (preço) {
      update.preço = preço;
    }

    const produtoExistente = await Produto.findByIdAndUpdate(filtro, update);

    if (produtoExistente) {
      res.json({ message: "Produto editado." });
    } else {
      res.status(404).json({ message: "Produto não encontrado." });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Um erro aconteceu." });
  }
});

  // Remoção de um Produto (DELETE)
app.delete("/produtos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { categoria } = req.query; // obter categoria da query

    let produtoExistente;

    if (categoria) {
      // se a categoria estiver definida na query, exclui todos os produtos com essa categoria
      produtoExistente = await Produto.deleteMany({ categoria });
    } else {
      // caso contrário, exclui apenas o produto com o ID fornecido
      produtoExistente = await Produto.findByIdAndRemove(id);
    }

    if (produtoExistente) {
      res.json({ message: "Produto(s) excluído(s)." });
    } else {
      res.status(404).json({ message: "Produto(s) não encontrado(s)." });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Um erro aconteceu." });
  }
});
  
     // Escuta de eventos
app.listen(7000, () => {
    console.log("Servidor rodando em http://localhost:7000/");
});
swaggerUtils.applyTagsMetadata(app, "/produtos/:id", "delete", "Produtos", "Remoção de um Produto");