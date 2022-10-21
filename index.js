const express = require('express')
const mongoose = require('mongoose')
const bodyparser = require("body-parser");
const app = express()
const port = 5000

const { get, getOne, getImage, getOneAndDelete } = require("./server.js")

const mongo_url = 'mongodb+srv://denesg:chebu997@cluster0.mcn7j6b.mongodb.net/MyDatabase?retryWrites=true&w=majority'

const { Schema } = mongoose;

const PokemonTypes = new mongoose.Schema({ value: 
    { type: String, enum: ['Normal', 'Fighting', 'Flying', 'Poison', 'Ground', 'Rock', 'Bug',
                           'Ghost', 'Steel', 'Fire', 'Water', 'Grass', 'Electric', 'Psychic',
                           'Ice', 'Dragon', 'Dark', 'Fairy'] 
                        }});

const pokemonSchema = new Schema({
    "id": {
        type: Number,
        min: 0,
        unique: true},
    "base": {
        "HP": Number,
        "Attack": Number,
        "Defense": Number,
        "Speed": Number,
        "Speed Attack": Number,
        "Speed Defense": Number
    },
    "name": {
        "english": String,
        "japanese": String,
        "chinese": String,
        "french": String
    },
    "type": 
          {type: [String],
           enum: ['Normal', 'Fighting', 'Flying', 'Poison', 'Ground', 'Rock', 'Bug',
                  'Ghost', 'Steel', 'Fire', 'Water', 'Grass', 'Electric', 'Psychic',
                'Ice', 'Dragon', 'Dark', 'Fairy']  },
    "__v": Number
});

app.use(bodyparser.urlencoded({
    extended: true
  }));
  
app.use(express.json())
mongoose.connect(mongo_url).then(() => console.log('db connected'))
  
const pokemonModel = mongoose.model('pokemons2', pokemonSchema); 

const deletedPokemon = mongoose.model('deletedPokemons', pokemonSchema)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

app.get('/api/v1/pokemons', (req, res) => {
    if (isNaN(parseInt(req.query.count)) || isNaN(parseInt(req.query.after))) {
        res.json( {msg: "the count and after parameters need to be numbers"} )
        process.exit()
    }
    pokemonModel.find({})
      .then(docs => {
        count = parseInt(req.query.count)
        after = parseInt(req.query.after)
        newcount = (count - docs.length)
        get(after, count, res, docs)
      })
      .catch(err => {
        console.error(err)
        res.json({ msg: "db reading .. err.  Check with server devs" })
      })
    
  })

app.get('/api/v1/pokemon/:id', (req, res) => {
deletedPokemon.find({id: req.params.id }).then(doc => {
    if (doc == []) {
        console.log("beep")
    }
    else {
    console.log(doc)
    res.send({msg: "this pokemon is deleted"})
    }
}).catch(err => {
    pokemonModel.find({ id: req.params.id})
.then(doc => {
    getOne(req.params.id, res, doc)
   /*  if (doc === []) {
        getOne(req.params.id, res)
    }
    else {
        res.json(doc)
    } */
    })
.catch(err => {
    getOne(req.params.id, res)
    console.error(err)
    res.json({ msg: "db reading .. err.  Check with server devs" })
})
})

})

app.get('/api/v1/pokemonImage/:id', (req, res) => {
    getImage(req.params.id, res)
  })

app.post('/api/v1/pokemon', (req, res) => {
pokemonModel.create(req.body, function(err) {
    if(err) console.log(err);
})

res.json(req.body)
})

app.delete('/api/v1/pokemon/:id', (req, res) => {
    pokemonModel.deleteOne({ id: req.params.id }, function (err, result) {
        pokemonModel.find({ id: req.params.id})
        .then(doc => {
            getOneAndDelete(req.params.id, res, doc, deletedPokemon)
           /*  if (doc === []) {
                getOne(req.params.id, res)
            }
            else {
                res.json(doc)
            } */
            })
        .catch(err => {
            console.error(err)
            res.json({ msg: "db reading .. err.  Check with server devs" })
    });
    
    })})
