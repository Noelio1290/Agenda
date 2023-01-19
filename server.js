const express = require("express");
const app = express();
const port = 8008;
const DB = require('./DB.json')
const cors = require('cors');

//Se levanta puerto

app.listen(port, function(){
    console.log(`Inicializado en el puerto ${port}`);
    console.log(`http://localhost:${port}`);
});

//Manejar las peticiones

//app.use(respuesta)
app.use(cors())
app.use(express.json())
app.use('/noel-todo-wey', express.static('store'));

app.get('/:id', getSingleUser);
app.get('/', getUserInfo); //Trae algo
app.post('/', createUser); // Enviar algo
app.put('/:id', editUserInfo);
app.delete('/:id', deleteUser);


// obtener un solo usuario

function getSingleUser(request, response){
    const id = request.params.id;
    response.setHeader("Content-Type", "text/html");
    let contactFound = false
    let find = {};
    for(let i = 0; i < DB.contactList.length; i ++){ 
        if(DB.contactList[i].id == id){
            find = DB.contactList[i];
            contactFound = true;
        }
    }

    if(!contactFound){
        find = ["Usuario no encontrado"];
    }
    response.send(find);
    response.end();
};


//obtener info de usuario

function getUserInfo(request, response){
    response.setHeader("Content-Type", "text/html");
    response.send(DB);
    response.end();
}


//Crear usuario

function createUser(request, response){
    //TODO Hacer que el ID no se repitan *
    const newUser = request.body;
    let dataBaseSize = 100;
    const warningMessage = ["Se ha llegado al límite de usuarios"];
    
    
    if(dataBaseSize == DB.contactList.length){
        response.send(warningMessage);
    } else {
        newUser.id = Math.floor(Math.random()*dataBaseSize);
    
        for(let i = 0; i < DB.contactList.length; i ++){
            if(DB.contactList[i].id == newUser.id){
                newUser.id = Math.floor(Math.random()*(dataBaseSize + .999));
                i = 0;
            }
        }
        DB.contactList.push(newUser);
        response.send(DB);
        response.end();
    }

}


//Edita usuario

function editUserInfo(request, response){
    const id = request.params.id;
    let userToUpdate = {};
    
    for(let i = 0; i < DB.contactList.length; i ++){
        
        if(DB.contactList[i].id == id){
            userToUpdate = DB.contactList[i];
        }    
    }


    if(request.body.name){
        const newName = request.body.name;
        userToUpdate.name = newName;
    }

    if(request.body.email){
        const newEmail = request.body.email;
        userToUpdate.email = newEmail;
    }

    if(request.body.ubication){
        const newUbication = request.body.ubication;
        userToUpdate.ubication = newUbication;
    }
    //Agregar las demás propiedades *
    //Hacer que se tome el ID en lugar de la posición*
    response.send(DB);
}


//Borrar usuario

function deleteUser(request, response){
    const id = request.params.id;
    for(let i = 0; i < DB.contactList.length; i ++){
        if(DB.contactList[i].id == id){
            DB.contactList.splice(i, 1);
        }
    }
    response.send(DB);
}