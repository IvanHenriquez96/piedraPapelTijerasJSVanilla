//Inicializacion para Toasts
const toastTrigger = document.getElementById('liveToastBtn')
const toastLiveExample = document.getElementById('liveToast')



//Declara variables
let resultados = [];
const botones = document.querySelectorAll('.btn_opcion');
const opciones_maquina = ['piedra', 'papel', 'tijeras'];
const nombre_jugador = document.querySelector('#nombre_jugador');
const btn_cambiar_nombre = document.querySelector('#btn_cambiar_nombre');
const input_nombre = document.querySelector('#input_nombre');
let puntaje_jugador = 0;
let puntaje_maquina = 0;
let miStorage = window.localStorage;

let errors = [];


let logros = [
    {
        id: 1,
        nombre: 'BUEN GUSTO!',
        desc: 'Cambia tu nombre de jugador por primera vez!',
        ganado: false
    },

    {
        id: 2,
        nombre: 'SUERTE ES MI SEGUNDO NOMBRE',
        desc: 'Supera por 5 puntos a la CPU',
        ganado: false
    },
];

let emojis = {
    piedra: "9994",
    papel: "9995",
    tijeras: "9996"
}





//Inicialización de datos, verifica LocalStorage

const inicializar = () => {

    // console.log(miStorage);
    //Existen resultados en la sesión?
    if (miStorage.getItem("resultados") !== null) {
        resultados = JSON.parse(miStorage.getItem("resultados"));
        console.log('tiene datos', resultados)
        //recorre los resultados y los escribe en el log
        resultados.forEach(res => {
            escribeResultados(res);
        });
    }

    if (miStorage.getItem("nombre_jugador") !== null) {
        let nombre = miStorage.getItem("nombre_jugador");
        nombre_jugador.innerHTML = `${nombre}`;
    }

    if (miStorage.getItem("logros") !== null) {
        let lg = JSON.parse(miStorage.getItem("logros"));
        logros = lg;
    }



    //escribir logros
    cargarLogros();
    //Inicializa Popper para Tooltips
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
}



//AddEventsListeners
botones.forEach(boton => {
    boton.addEventListener('click', (e) => {
        hacerJugada(e);
    });
});

btn_cambiar_nombre.addEventListener('click', (e) => {
    validaNombre(input_nombre.value);
});


document.querySelector('#resetear_juego').addEventListener('click', (e) => {

    Swal.fire({
        title: 'Cuidado!',
        text: 'Estas a punto de borrar tu progreso!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Borrar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            miStorage.clear();
            location.reload();
        }
    })

});


//Funciones


const validaNombre = (nombre) => {
    //Limpia los errores
    let div_errores = document.querySelector('#div_errores');
    errors = [];
    div_errores.innerHTML = "";

    if (nombre.length < 1) {
        errors.push({ error: true, desc: "El Campo no puede estar vacío" });
    }

    if (nombre.length > 8) {
        errors.push({ error: true, desc: "Máximo 8 carácteres!" });
    }

    if (errors.length == 0) {
        cambiarNombre(nombre);

        let exampleModal = document.getElementById('exampleModal');
        let modal = bootstrap.Modal.getInstance(exampleModal);
        modal.hide();

    } else {
        errors.forEach(error => {
            div_errores.innerHTML = `<p class="error m-2">-${error.desc}</p>`;
        });
    }

}

const cambiarNombre = (nombre) => {
    nombre_jugador.innerHTML = `${nombre}`;
    miStorage.setItem('nombre_jugador', nombre);

    //revisar si ya posee el logro del cambio de nombre
    if (!logros[0].ganado) {
        conseguirLogro(1);
    }


}

const conseguirLogro = (id_logro) => {
    //Encuentra el logro y cambia el estado a ganado
    let logro_encontrado = '';

    logros.forEach(logro => {
        if (logro.id == id_logro) {
            logro.ganado = true;
            logro_encontrado = logro;
        }
    });

    //Sube los logros al Storage
    miStorage.setItem('logros', JSON.stringify(logros));
    let todos_logros = document.querySelector('#logros');
    todos_logros.innerHTML = "";
    cargarLogros();
    //Inicializa Popper para Tooltips
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

    //Muestra el logro
    const toast = new bootstrap.Toast(toastLiveExample)
    document.querySelector('#logro_nombre_t').innerHTML = `${logro_encontrado.nombre}`;
    document.querySelector('#toast-body').innerHTML = `${logro_encontrado.desc}`;
    toast.show();
}

const cargarLogros = () => {
    logros.forEach(logro => {
        let todos_logros = document.querySelector('#logros');

        let div_logro = document.createElement('div');
        div_logro.classList.add('border');
        div_logro.classList.add('m-2');

        let ruta_img = '';

        if (logro.ganado) {
            ruta_img = "./img/trofeo.png";
        } else {
            ruta_img = "./img/logro-removebg-preview.png";
        }

        div_logro.innerHTML = `<img src="${ruta_img}" alt="" class="imagen_trofeo bg-light" data-bs-toggle="tooltip" data-bs-placement="top"
        data-bs-custom-class="custom-tooltip"
        title="${logro.nombre} - ${logro.desc}">`;

        todos_logros.appendChild(div_logro);

    });

}

const escribeResultados = ({ resultado, opcion_jugador, opcion_maquina }) => {
    //Crea el nodo
    let nodo_li = document.createElement('li');
    nodo_li.textContent = `${resultado}! ${String.fromCodePoint(parseInt(emojis[opcion_jugador]))} VS ${String.fromCodePoint(parseInt(emojis[opcion_maquina]))}`;

    if (resultado == 'Ganaste') {
        nodo_li.classList.add('ganador');
        puntaje_jugador++;
        miStorage.setItem('puntaje_jugador', puntaje_jugador);
    } else {
        if (resultado == 'Perdiste') {
            nodo_li.classList.add('perdedor');
            puntaje_maquina++;
            miStorage.setItem('puntaje_maquina', puntaje_maquina);
        }
    }
    //Agrega el nodo
    lista_resultados.appendChild(nodo_li);

    //baja el scroll automaticamente al ultimo resultado
    let tablero_juego = document.querySelector('#tablero_juego');
    tablero_juego.scrollTop = tablero_juego.scrollHeight;


    cargaPuntaje();

}


const cargaPuntaje = () => {
    let pts_jugador = document.querySelector('#puntaje_jugador');
    let pts_maquina = document.querySelector('#puntaje_maquina');

    pts_jugador.innerHTML = puntaje_jugador;
    pts_maquina.innerHTML = puntaje_maquina;

}

const hacerJugada = (e) => {


    let tipo = e.target.getAttribute('tipo');
    let opcion_maquina = opciones_maquina[Math.floor(Math.random() * opciones_maquina.length)];

    let datos_resultado = {
        resultado: '',
        opcion_jugador: tipo,
        opcion_maquina: opcion_maquina
    };


    if (tipo == 'piedra') {
        opcion_maquina == 'tijeras' ? datos_resultado.resultado = 'Ganaste' : datos_resultado.resultado = 'Perdiste';
    }

    if (tipo == 'papel') {
        opcion_maquina == 'piedra' ? datos_resultado.resultado = 'Ganaste' : datos_resultado.resultado = 'Perdiste';
    }

    if (tipo == 'tijeras') {
        opcion_maquina == 'papel' ? datos_resultado.resultado = 'Ganaste' : datos_resultado.resultado = 'Perdiste';
    }

    if (tipo == opcion_maquina) {
        datos_resultado.resultado = 'Empate';
    }

    //Agrega el reusltado al array de reaultados y lo guarda en localstraoge
    resultados.push(datos_resultado);
    miStorage.setItem("resultados", JSON.stringify(resultados));


    escribeResultados(datos_resultado);

    //Verificar Trofeo id 2
    if (!logros[1].ganado) {

        if ((puntaje_jugador - puntaje_maquina) >= 5) {
            conseguirLogro(2);
        }

    }
}


window.onload = inicializar();
