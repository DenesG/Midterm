var https = require('https')

const url = "https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/pokedex.json"

const get = (after, count, res, local) => {
    const request = https.request(url, (response) => {
        let data = '';
        response.on('data', (chunk) => {
            data = data + chunk.toString();
        });
        response.on('end', () => {
            jsonData = JSON.parse(data);
            result = jsonData.concat(local).slice(after, after+count)
            res.send(result)
        });
    })
      
    request.on('error', (error) => {
        console.log('An error', error);
    });
    request.end() 
}

function filterById(jsonObject, id) {return jsonObject.filter(function(jsonObject) {return (jsonObject['id'] == id);})[0];}

function pad(num, size) {
    while(num.length < size) num = "0" + num;
    return num;
}

const getOne = (id, res, local) => {
    const request = https.request(url, (response) => {
        let data = '';
        response.on('data', (chunk) => {
            data = data + chunk.toString();
        });
        response.on('end', () => {
            jsonData = JSON.parse(data);
            total = jsonData.concat(local)
            const result = filterById(total, id)
            res.send(result)
        });
    })
      
    request.on('error', (error) => {
        console.log('An error', error);
    });
    request.end() 
}

const getImage = (id, res) => {
    var url = 'https://github.com/fanzeyi/pokemon.json/blob/master/images/'
    id = pad(id, 3)
    url = url + id + '.png'
    res.json({msg: url})
}

const getOneAndDelete = (id, res, local, pokeModel) => {
    const request = https.request(url, (response) => {
        let data = '';
        response.on('data', (chunk) => {
            data = data + chunk.toString();
        });
        response.on('end', () => {
            jsonData = JSON.parse(data);
            total = jsonData.concat(local)
            const result = filterById(total, id)
            pokeModel.create(result, function(err) {
                if(err) console.log(err)
            })
            res.send("Deleted successfully?")
        });
    })
      
    request.on('error', (error) => {
        console.log('An error', error);
    });
    request.end() 
}



module.exports = { get, getOne, getImage, getOneAndDelete}