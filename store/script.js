/*
const contenedor = document.querySelector('#contenido');
const entrada = document.querySelector('#texto');
const reset = document.querySelector("#resetBoton");


entrada.addEventListener('keyup',()=>{
    contenedor.innerHTML = entrada.value;
});
reset.addEventListener('click', () => {
    contenedor.innerHTML = ""
    entrada.value= ""
  })
*/
  
const espacioDeContactos = document.getElementById('space-for-contacts');
const iconosDeContacto = document.getElementById('icons-contact');
const contacto = document.getElementById('contacto');
const nuevoContacto = document.getElementById('new-contact');
const botonDeEnvio = document.getElementById('submit-button');
const activarModal = document.querySelector('.modal');
const modalDeEdicion = document.querySelector('.modal-edit');
const formularioDeEdicion = document.getElementById('edit-data');
const botonDeEdicion = document.getElementById('submit-edit-button');
const modalEnvioDeNuevoFormulario = document.querySelector('.modal-post-user');
const modalEliminar = document.querySelector('modal-delete');

const url = 'http://localhost:8008';

//boton que envia formuario

botonDeEnvio.addEventListener('click', event => {
    event.preventDefault()

    if(
        nuevoContacto.name.vale == "" ||
        nuevoContacto.email.value == "" ||
        nuevoContacto.location.value == ""
    ){
        alert('Llene todos los campos antes de cotinuar')
    } else {
        activarModal.classList.add('active');
        modalEnvioDeNuevoFormulario.classList.add('active');
    }
});

//funcino para tener impresos los iconos de los contactos

function printIcons(list){
    let cardsIcons = '';
    for(let user of list.contactList){
       cardsIcons += 
        `
            <label class='icon' for="icon${user.id}">
                <h4 class="text-info">${user.name} </h4>
            </label>
            <input class="icons-input" type="radio" name="formIcons" id="icon${user.id}" value="${user.id}">
        `;
    }

    iconosDeContacto.innerHTML = cardsIcons;

    const cards = document.querySelectorAll(".icons-input");

    for(let card of cards){
        card.addEventListener("change", function(){
            const getData = {
                method: 'get'
            };
            let id = iconosDeContacto.formIcons.value;
            fetch(`${url}/${id}`, getData).then(function(response){
                console.log(response);
                return response.json();
            }).then(function(user){
                contacto.innerHTML = `
                <div class='card'> 
                    <div class="card-inner">
                        <h2 class="text-info">${user.name} </h2>
                        <p class="text-info"> ${user.email}</p>
                        <p class="text-info"> ${user.ubication}</p>
                    </div>
                    <div class="card-inner">
                        <img class="img-contact" src="https://cdn3.iconfinder.com/data/icons/communication/512/contact_A-512.png" alt="">
                    </div>
                </div>
                `
            });
            
        });
    }

}

//funcion para jalar lo contactos al espacio de contactos

function getContacts(){
    const getData = {
        method: 'get'
    };
    fetch(url, getData).then(function(response){
        console.log(response);
        return response.json();
    }).then(function(responseJson) {
        console.log(responseJson);
        printIcons(responseJson);
    });
}

getContacts()



// Enviar formulario para crear contacto

function sendData() {

    const newName = nuevoContacto.name.value;
    const newEmail = nuevoContacto.email.value;
    const newLocation = nuevoContacto.location.value;

    const putData = {
        method: 'post',
        body: JSON.stringify(
            { 
                name: newName,
                email: newEmail,
                ubication: newLocation
            }
        ),
        headers:{
            'Content-Type': 'application/json'
          }
    }
    fetch(`${url}`, putData)
        .then(response => response.json()
        )
    .then(function(responseJson){
        printIcons(responseJson);
    }
    ).catch(error => console.error('Error:', error));
    activarModal.classList.remove('active');
    modalEnvioDeNuevoFormulario.classList.remove('active');
    nuevoContacto.name.value = "";
    nuevoContacto.email.value = "";
    nuevoContacto.location.value = "";

};

// No enviar formulario

function noSendData(){
    activarModal.classList.remove('active');
    modalEnvioDeNuevoFormulario.classList.remove('active');
}

//activar modal

activarModal.addEventListener('click', function(){
    if(event.target !== this){
        return
    } else {
        activarModal.classList.remove('active');
        modalDeEdicion.classList.remove('active');
        modalEnvioDeNuevoFormulario.classList.remove('active');
        modalEliminar.classList.remove('active');
    }
});

//funcion para editar

function editUser() {

    if(iconosDeContacto.formIcons.value == ""){
        alert('Por favor, seleccione un contacto');
    } else {
        activarModal.classList.add('active');
        modalDeEdicion.classList.add('active');
        let id = iconosDeContacto.formIcons.value;
        const getData = {
            method: 'get'
        };
        fetch(`${url}/${id}`, getData).then(function(response){
            console.log(response);
            return response.json();
        }).then(function(user){
            formularioDeEdicion.name.value = user.name;
            formularioDeEdicion.email.value = user.email;
            formularioDeEdicion.location.value = user.ubication;
        });

    }
};

//Boton que envia el formulario actualizado

botonDeEdicion.addEventListener('click', function(event){
    event.preventDefault()
    let edited = {};
    edited.name = formularioDeEdicion.name.value;
    edited.email = formularioDeEdicion.email.value;
    edited.ubication = formularioDeEdicion.location.value;

    if(
        formularioDeEdicion.name.value == "" ||
        formularioDeEdicion.email.value == "" ||
        formularioDeEdicion.location.value == ""
    ){
        alert('Llene todo los campos antes de enviar la actualización')
    } else {
        const putData = {
            method: 'put',
            body: JSON.stringify(edited),
            headers:{
                'Content-Type': 'application/json'
              }
        }
    
        let id = iconosDeContacto.formIcons.value;
        console.log(id)
        fetch(`${url}/${id}`, putData)
            .then(response => response.json()
            )
        .then(function(responseJson){
            printIcons(responseJson);
            const cards = document.querySelectorAll(".icons-input");
            console.log(id)
            for(let i = 0; i < cards.length; i++){
                console.log(cards[i].value == id)
                if(cards[i].value == id){
                    cards[i].click();
                }
    
                activarModal.classList.remove('active');
                modalDeEdicion.classList.remove('active');
            }
        }
        ).catch(error => console.error('Error:', error));
    }

});

//funcion para eliminar contacto

function deletUser(){
    if(iconosDeContacto.formIcons.value == ""){
        alert('Seleccione un contacto')
    } else {
        activarModal.classList.add('active');
        modalEliminar.classList.add('active');
    }
}

// funciones para modalEliminar

function delContact() {
    const delData = {
        method: 'delete',
        headers:{
            'Content-Type': 'application/json'
          }
    }

    let id = iconosDeContacto.formIcons.value;
    fetch(`${url}/${id}`, delData).then(function(response){
        return response.json();
    }).then(function(responseJson){
        printIcons(responseJson);
        contacto.innerHTML = "";
        activarModal.classList.remove('active');
        modalEliminar.classList.remove('active');
    })
};

function cancelDel() {
    activarModal.classList.remove('active');
    modalEliminar.classList.remove('active');
};