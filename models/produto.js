const {model, Schema} = require("mongoose");


const Produto = model(
    "produto", 
    new Schema({ 
        nome:{
            type: String, 
            required: true,
        },
        descricao:{
            type: String, 
            required: true,
        },
        quantidade:{
            type: Number, 
            required: true,
                    },
        preco:{
            type: Number, 
            required: true,
        },
        desconto:{
            type: Number, 
            required: true,
            default: 0
        },
        dataDesconto:{
            type: Date, 
            required: true,
        },
        categoria:{
            type: String, 
            required: true,
        },
        imagem:{
            type: String, 
            required: true,
        }
    

    })
);
module.exports = Produto;