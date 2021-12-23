/**
 * This is the main entry point of the portlet.
 *
 * See https://tinyurl.com/js-ext-portlet-entry-point for the most recent 
 * information on the signature of this function.
 *
 * @param  {Object} params a hash with values of interest to the portlet
 * @return {void}
 */
function main(params) {

    $( document ).ready(function(){
        
        setTimeout(actualizarData, 3000);
        
    });
    
    var node = document.getElementById(params.portletElementId);
    // obteniendo propiedades de las configuraciones
    const {api, ids, propiedades, idsDates, propDates, idsSelects, propSelects, propSelectsValues, almaLocal, idActualizar} = params.configuration.portletInstance;
    
    // convirtiendo en arreglo las propiedades de elementos separados por comas
    let inputs = ids.split(', ');
    let prop = propiedades.split(', ');
    let propFechas = propDates.split(', ');
    let idsFechas = idsDates.split(', ');
    let idsSelect = idsSelects.split(', ');
    let propSelect = propSelects.split(', ');
    let propSelectsValue = propSelectsValues.split(', ');

// funcion para realizar la peticion al servicio

// $(window).on("load",function(){
// 	console.log("Evento load!!!");
// 	setTimeout(verificarCarga, 3000);
// });
// function verificarCarga(){
//     var verificarServicio = localStorage.getItem("cargado")
//     console.log(verificarServicio)
//     if(verificarServicio){
//         cargarDatosLocal()
//     }else{
//         cargarDatos()
//     }
// }
    




    function cargarDatos(){
        var datosDoc = []
    $.ajax
        ({
            type: "POST",
            url: api,
            dataType: "JSON",
            "headers": {
                "Authorization": "Bearer " + localStorage.getItem('token'),
                "Content-Type": "application/json"
            },
            data: '{"id": "' + localStorage.getItem('id') + '"}',
            success: function (data) {
                // desestructurando respuesta
                const {persona} = data;
               
                // guardar en localstorage todo lo que viene en respuesta
                for (var i in persona) {
                    
                    localStorage.setItem(i, persona[i])
                }
                localStorage.setItem('info_persona',JSON.stringify(data));
                

                // agregando la informacion en los campos inputs 
                for(x = 0; x < inputs.length; x++){
                 
                    try{
                        document.getElementById(inputs[x]).value = persona[prop[x]];
                    }
                    catch(err){
                        console.log(err)
                    }
                    datosDoc.push({
                        id: inputs[x],
                        data: persona[prop[x]]
                    })
                    localStorage.setItem(prop[x], persona[prop[x]])
                    
                   
                }
                // agregando los campos de fecha
                for(y = 0; y < propFechas.length; y++){
                    
                    setDate(idsFechas[y], persona[propFechas[y]])
                    let fecha1 = persona[propFechas[y]].split('/');
                    
                    datosDoc.push({
                        id: idsFechas[y],
                        data: fecha1[0]+"/"+fecha1[1]+"/"+fecha1[2]
                    })
                    localStorage.setItem(propFechas[y], persona[propFechas[y]])
                    
                }

              
                // agregando los campos en los select
                for(x = 0; x < idsSelect.length; x++){

                    if(prop[x] == "desc_tipo_id"){
                        formatoNumeros(persona[propSelectsValue[x]], idsSelect[x])
                    }
                    // agregar(idsSelect[x], persona[propSelect[x]], persona[propSelectsValue[x]])
                    
                    datosDoc.push({
                        id: idsSelect[x],
                        data: persona[propSelectsValue[x]]
                    })
                    
                    localStorage.setItem(propSelectsValue[x], persona[propSelectsValue[x]])
                  
                  
               }
               // conversion de fecha
               
                  // mensaje de ayuda dependiendo nacionalidad
                if(persona["cod_nacionalidad"] != "222"){
                  $("#ayuda2").hide()
                }
                datosDoc.push({
                    id: "idNacionalidad",
                    data: "Salvadoreña"
                })
                
                localStorage.setItem('datosDocumentos',JSON.stringify(datosDoc));
                localStorage.setItem('newObject',JSON.stringify(datosDoc));
                localStorage.setItem('cargado', true)
                console.log("Cargado desde el servicio")
            }
        }).fail(function () {
            cargarDatosLocal()
        });
    }
    try{
        // capturamos si es la primera vez que se ejecuta
        cargarDatos()
    }
    catch(err){
        // se ejecuta si falla la anterior 
        cargarDatosLocal()
        
    }
    

    function setDate(id, fecha){
        // if(id == "idFechaExpiracion" && fecha == ""){
        //   $("#alert1").modal("show")
        // }
        var fecha1 = fecha.split('/');
        document.getElementById(id).value = fecha1[0]+"/"+fecha1[1]+"/"+fecha1[2];
        
        
      }
      document.getElementById("idNacionalidad").value = "Salvadoreña"
    // agregar("cod_nacionalidad", "Salvadoreña", 222)
    function cargarDatosLocal(){

        let datos = JSON.parse(localStorage.getItem("datosDocumentos"))

        datos.forEach(elemento => {
            document.getElementById(elemento.id).value = elemento.data;
        })

        // for(x = 0; x < inputs.length; x++){   
        //     document.getElementById(inputs[x]).value = localStorage.getItem(prop[x]);
        // }

        // for(y = 0; y < propFechas.length; y++){
                    
        //     setDate(idsFechas[y], localStorage.getItem(propFechas[y]))
        // }
        
       console.log("Cargado desde el localstorage")
    }

    // const optionC = document.createElement('option');
    // optionC.value = 3;
    // optionC.text = "CARNET DE RESIDENTE";

    // function agregar(id, texto, valor){
    //       console.log(id, texto, valor)      
    //     let selector = document.getElementById(id)
    //     const option = document.createElement('option');
    //     option.value = valor;
    //     option.text = texto;
    //     // if(id == "selectTipoDoc"){
    //     //   const optionC = document.createElement('option');
    //     //   optionC.value = 3;
    //     //   optionC.text = "CARNET DE RESIDENTE";
    //     //   selector.appendChild(optionC);
    //     // }else if(id == "selectEstadoCivil"){
    //     //   const optionE = document.createElement('option');
    //     //   optionE.value = 3;
    //     //   optionE.text = "SOLTERO(A)";
    //     //   selector.appendChild(optionE);
    //     // }
        
    //     selector.appendChild(option);
        
    //     selector.value = valor;
    //   };
        function actualizarData(){
            document.getElementById("buttonActualizar").addEventListener("click", (e) => {

                e.preventDefault();
                // let respuesta = true;

                // respuesta = validaValores()
                comparacion();
                // validaValores()
                window.location.href = `/web/afiliado/confirmar`;
               


            })
        var datosDirectos = ["fecha_expiracion_id", "nombre_conyuge", "nombre_padre", "nombre_madre", "profesion", "fecha_emision_isss", "fecha_emision_inpep", "fecha_emision_nit"]
        var dataUpdate = {}
        var grupo01 = []
        var grupo02 = []
        var grupo03 = []
        function comparacion(){
            let objetoData = JSON.parse(localStorage.getItem("datosDocumentos"))
            let newObject = JSON.parse(localStorage.getItem("newObject"))
            // let tipoDocumento = document.getElementById("selectTipoDoc").value
            let cambios = []
            newObject.forEach((elemento, index) => {
                console.log(elemento.id)
                // console.log(elemento)
                let valorCampo = document.getElementById(elemento.id)
                
                let columna = valorCampo.getAttribute("data-columna")
                let json = valorCampo.getAttribute("data-json")
                let grupo = valorCampo.getAttribute("data-grupo")
                let label = valorCampo.getAttribute("data-label")
                let valorLocal = elemento.data
                
                if(valorCampo.value != valorLocal){
                    cambios.push({
                        id: elemento.id,
                        valorActual: valorLocal,
                        valorNuevo: valorCampo.value,
                        columna: columna,
                        json: json,
                        grupo: grupo,
                        label: label
                    })

                    objetoData.splice(index, 1, {
                        id: elemento.id,
                        data: valorCampo.value
                    })

                   if(datosDirectos.includes(json)){

                        dataUpdate[json] = valorCampo.value
                   }

                   if(grupo == '01'){
                        grupo01.push({
                            codigo_columna: columna,
                            descripcion_columna: json,
                            valor_anterior: valorLocal,
                            valor_nuevo: valorCampo.value
                        })
                   }

                   if(grupo == '02'){
                    grupo02.push({
                        codigo_columna: columna,
                        descripcion_columna: json,
                        valor_anterior: valorLocal,
                        valor_nuevo: valorCampo.value
                    })
                    }

                    if(grupo == '03'){
                        grupo03.push({
                            codigo_columna: columna,
                            descripcion_columna: json,
                            valor_anterior: valorLocal,
                            valor_nuevo: valorCampo.value
                        })
                   }
                   
                }


            })

            console.log(grupo01)
            console.log(grupo02)
            console.log(grupo03)

            let grupos = []

            if(grupo01.length > 0){
                grupos.push(grupo01)
            }
            if(grupo02.length > 0){
                grupos.push(grupo02)
            }
            if(grupo03.length > 0){
                grupos.push(grupo03)
            }

            console.log(grupos.length)

            localStorage.setItem("info_grupos", JSON.stringify(grupos))
            localStorage.setItem("datosDocumentos", JSON.stringify(objetoData))
            localStorage.setItem("cambios", JSON.stringify(cambios))
            localStorage.setItem("infoUpdateDirect", JSON.stringify(dataUpdate))
        }
        }
       


        document.getElementById("selectTipoDoc").addEventListener("change", function(){
            console.log("Valor del select tipo", this.value)

            let modalFrente = document.getElementById("idModalImagenFrente")
            let modalReverso = document.getElementById("idModalImagenReverso")
            if(this.value == '10'){
                modalFrente.setAttribute("data-imagenDoc", "DUI_FRENTE")
                modalReverso.setAttribute("data-imagenDoc", "DUI_REVERSO")
            }else if(this.value == '2'){
                modalFrente.setAttribute("data-imagenDoc", "CARNET_RESIDENTE_FRENTE")
                modalReverso.setAttribute("data-imagenDoc", "CARNET_RESIDENTE_REVERSO")
            }else if(this.value == '3'){
                modalFrente.setAttribute("data-imagenDoc", "PASAPORTE_FRENTE")
                modalReverso.setAttribute("data-imagenDoc", "PASAPORTE_REVERSO")
            }

        })



    function validaValores(){

        let tipoDoc = document.getElementById("selectTipoDoc").value
        // let tipo = ""
        // if(valor == "10"){
            // tipo = "Dui"
            var requeridos = [
                {
                    id: "inputProfesion",
                    nombre: "Profesión u oficio",
                    longitudMaxima: 200,
                    requerido: true,
                    tipoDocumento: ["10"]
                },
                {
                    id: "inputNombreConyuge",
                    nombre: "Cónyuge",
                    longitudMaxima: 200,
                    requerido: true,
                    tipoDocumento: ["10"]
                },
                {
                    id: "inputNombreMadre",
                    nombre: "Nombre de la madre",
                    longitudMaxima: 200,
                    requerido: true,
                    tipoDocumento: ["10"]
                },
                {
                    id: "inputNombrePadre",
                    nombre: "Nombre del padre",
                    longitudMaxima: 200,
                    requerido: true,
                    tipoDocumento: ["10"]
                },
                {
                    id: "selectGenero",
                    nombre: "Género",
                    longitudMaxima: 2,
                    requerido: true,
                    tipoDocumento: ["3", "10"]
                },
                {
                    id: "idFechaNacimiento",
                    nombre: "Fecha nacimiento",
                    longitudMaxima: 100,
                    requerido: true,
                    tipoDocumento: ["2", "3", "10"]
                },
                {
                    id: "selectEstadoCivil",
                    nombre: "Estado civil",
                    longitudMaxima: 2,
                    requerido: true,
                    tipoDocumento: ["10"]
                },
                {
                    id: "inputConocidoPor",
                    nombre: "Conocido por",
                    longitudMaxima: 50,
                    requerido: false,
                    tipoDocumento: ["2", "3", "10"]
                },
                {
                    id: "inputApellidoCasada",
                    nombre: "Apellido casada",
                    longitudMaxima: 20,
                    requerido: false,
                    tipoDocumento: ["2", "3", "10"]
                },
                {
                    id: "inputSegundoApellido",
                    nombre: "Segundo apellido",
                    longitudMaxima: 20,
                    requerido: true,
                    tipoDocumento: ["2", "3", "10"]
                },
                {
                    id: "inputPrimerApellido",
                    nombre: "Primer apellido",
                    longitudMaxima: 20,
                    requerido: true,
                    tipoDocumento: ["2", "3", "10"]
                },
                {
                    id: "Segundo_nombre",
                    nombre: "Segundo nombre",
                    longitudMaxima: 20,
                    requerido: true,
                    tipoDocumento: ["2", "3", "10"]
                },
                {
                    id: "Primer_nombre",
                    nombre: "Primer nombre",
                    longitudMaxima: 20,
                    requerido: true,
                    tipoDocumento: ["2", "3", "10"]
                },
                {
                    id: "idFechaExpiracion",
                    nombre: "Fecha expiración",
                    longitudMaxima: 100,
                    requerido: true,
                    tipoDocumento: ["2", "3", "10"]
                },
                {
                    id: "idFechaExpedicion",
                    nombre: "Fecha expedición",
                    longitudMaxima: 100,
                    requerido: true,
                    tipoDocumento: ["2", "3", "10"]
                },
                {
                    id: "inputLugarExpedicion",
                    nombre: "Lugar de expedición",
                    longitudMaxima: 100,
                    requerido: true,
                    tipoDocumento: ["2", "10"]
                },
                {
                    id: "idInputNumDocumento",
                    nombre: "Numero documento",
                    longitudMaxima: tipoDoc == "10" ? "10" : tipoDoc == "3" ? "15" : "11",
                    requerido: true,
                    tipoDocumento: ["2", "3", "10"]
                },
                {
                    id: "selectTipoDoc",
                    nombre: "Tipo Documento",
                    longitudMaxima: 5,
                    requerido: true,
                    tipoDocumento: ["2", "3", "10"]
                }
            ]
       

        
        requeridos.forEach(elemento => {
            
            let valorInput = document.getElementById(elemento.id).value
            console.log(tipoDoc)
            
            if(elemento.tipoDocumento.includes(tipoDoc) && elemento.requerido){
                if(valorInput < 1 || valorInput == "DEFAULT"){
                    $("#msjModalError").html(`${elemento.nombre} es un campo requerido`);
                    $('#modalCiError').modal();
                    return false
                }
                
            }
            if(valorInput.length > elemento.longitudMaxima){
                $("#msjModalError").html(`${elemento.nombre} debe ser menor que ${elemento.longitudMaxima} caracteres`);
                $('#modalCiError').modal();
                return false
            }
        })
      

        

    }
        // function cargarDatosLocalStorage(){
        //     let inputsLocal = []
        //     let selectLocal = []
        //     let fechaLocal = []
        //     let idinputsLocal = []
        //     let idselectLocal = []
        //     let idfechaLocal = []
        //     for(x = 0; x < inputs.length; x++){   
        //         inputsLocal[x] = localStorage.getItem(prop[x]);
        //     }
    
        //     for(y = 0; y < propFechas.length; y++){
                 
        //         fechaLocal[y] = localStorage.getItem(propFechas[y])
        //     }
        //     for(x = 0; x < idsSelect.length; x++){

        //         selectLocal[x] = localStorage.getItem(propSelect[x])
              
        //    }
        //    const dataInputLocal = inputsLocal.concat(selectLocal, fechaLocal);
        // //    console.log(inputsLocal)
        // //     console.log(selectLocal)
        // console.log("valores locales")
        //     console.log(dataInputLocal)
        //     return dataInputLocal
        // }



        // function registrarCambios(dataInput, dataInputLocal){
            
        //     const idsDataInput = inputs.concat(idsSelect, idsFechas);
        //     let cambios = []
        //     let ids = []
        //     for(x = 0; x < dataInputLocal.length; x++){
    
        //         if(dataInput[x] != dataInputLocal[x]){
        //             cambios.push(dataInput[x])
        //             ids.push(idsDataInput[x])
        //         }
        //     }
        //     console.log("cambios")
        //     console.log(dataInput)
        //     console.log(dataInputLocal)
        //     if(cambios.length){
        //         // storage.removeItem("dataCambiada");
        //         // storage.removeItem("idsCambios");
        //         localStorage.setItem("dataCambiada", JSON.stringify(cambios))
        //         localStorage.setItem("idsCambios", JSON.stringify(ids))
        //         window.location.href = "https://desa.virtualafpconfia.com/web/afiliado/confirmar";
        //     }
            
        // }
        
        

    // window.seleccionar = () => {
    //     console.log("hola se llamo desde portlet")
    //     document.getElementById("selectTipoDoc").value = "3"
    // }
    // validar()

        //   function getDateToday(){

        //     var today = new Date();
        //     var dd = today.getDate();
        //     var mm = today.getMonth() + 1; //January is 0!
        //     var yyyy = today.getFullYear();
          
        //     if (dd < 10) {
        //       dd = '0' + dd;
        //     }
          
        //     if (mm < 10) {
        //       mm = '0' + mm;
        //     }
          
        //     today = yyyy + '-' + mm + '-' + dd;
        //     return today;
          
        //   }

        //   function validarExpiracion(hoy, fechaDoc){
        //     if(fechaDoc < hoy || fechaDoc == ""){
        //       console.log(hoy)
        //       console.log(fechaDoc)
        //       console.log("expiradad")
        //       $("#alert1").modal("show")
        //       $("#select2").empty();
        //       $("#selectTipoDoc").empty();
        //     //   cargarDatos()
        //     }
        //   }

        // //   let arregloIds = ["inputdoc3", "inputdoc2", "inputdoc18", "inputisss9", "inputinpep7", "inputnit7"];

        // // let arregloIds = ["inputdoc3", "inputdoc2", "inputdoc18"];
        // // idsFechas.forEach(id => {
        //     document.getElementById("idFechaExpiracion").onchange = function(){
                  
                
                
        //     }
        // document.getElementById("idFechaExpiracion").addEventListener("change", function(){
        //     console.log("validar fecha")
        //     validarExpiracion(getDateToday(), this.value)
        // })

        

        // $("#"+idInput).change(function(){
        //     var optionSelected = $(this).find("option:selected");
        //     var valueSelected  = optionSelected.val()
        //     let estado = localStorage.getItem('idModalfrenteIsss')

        //     if(!estado){
        //         $("#alert1").modal("show")
        //     }
            
        // })
    
        

        // // })

        
        // $("#select2").change(function(){
        //     var optionSelected = $(this).find("option:selected");
        //     var valueSelected  = optionSelected.val()
        //     let estado = localStorage.getItem('idModalfrenteIsss')

        //     if(!estado){
        //         $("#alert1").modal("show")
        //     }
            
        // })

        // function limpiarCampos(campos){
        //     campos.forEach(function(campos){

        //     })
        // }

        // const limpiarSelect = (elemento) => {
        //   for (let i = elemento.options.length; i >= 0; i--) {
        //     $select.remove(i);
        //   }
        // };

        // // function  validarFormulario(valor) {
            
        // // }

       
        //     let requeridosInput = ["inputdoc5", "inputdoc6", "inputdoc7", "inputdoc8", "inputdoc18", "inputdoc13", "inputdoc1", "inputdoc2", "inputdoc3", "inputdoc15", "inputdoc16", "inputdoc17", "inputdoc23", "inputdoc20"]
        //     let requeridosSelect = ["selectTipoDoc", "inputdoc13", "selectGenero"];
            
           
        //     requeridosInput.forEach(function(id){
        //         let elemento = document.getElementById(id)
        //         console.log(elemento)
                
                
        //         $(`#${id}`).blur(function(){
                    
        //             console.log(this.value)
                
        //             let valor = this.value
        //             console.log(valor)
        //             if(valor == null || valor.length == 0){
        //                 // alert("No puede estar vacio")
        //                 elemento.style.borderColor = 'red';
        //             }else{
        //                 elemento.style.borderColor = '#50D7F9';
        //             }
        //         });
        //     })
        //         requeridosSelect.forEach(function(idSelect){
        //             $("#"+idSelect).change(function(){
        //                 var optionSelected = $(this).find("option:selected");
        //                 var valueSelected  = optionSelected.val()
        //                 let elemento = document.getElementById(idSelect)
        //                 console.log(valueSelected)
        //                 if(valueSelected == "Seleccione"){
        //                     elemento.style.borderColor = 'red';
        //                 }else{
        //                     elemento.style.borderColor = '#50D7F9';
        //                 }
                        
                        
                        
        //             })
        //         })
                
        //         let correos = ["inputcon3", "inputcon4"]
        //         correos.forEach(function(idCorreo){
        //             const email = document.getElementById(idCorreo);

        //             email.addEventListener("input", function (event) {
        //                 if (email.validity.typeMismatch) {
        //                     email.style.borderColor = 'red';
        //                     // document.getElementById(<%= idMensajeRequerido %>).innerHtml = "Correo no es valido"
        //                 } else {
        //                     email.style.borderColor = '#50D7F9';
        //                 }
        //         });
        //         })

        //         function formatoNumeros(tipoDoc, id){
                    
        //             if(tipoDoc == "NÚMERO ÚNICO DE IDENTIDAD"){
        //                 document.addEventListener('DOMContentLoaded', function() {
        //                     applyInputMask(id, '00000000-0');
        //                 });
        //             }else if(tipoDoc == "CARNET DE RESIDENTE"){
        //                 document.addEventListener('DOMContentLoaded', function() {
        //                     applyInputMask(id, '000-000-000');
        //                 });
        //             }
                    
        //         }

                
        //         applyInputMask('inputdoc20', '00000000-0');
        //         applyInputMask('inputnit2', '0000-000000-000-0');
        //         applyInputMask('inputisss1', '000000000');
        //         applyInputMask('inputinpep1', '000000000000');
                

        //         function applyInputMask(elementId, mask) {
        //         let inputElement = document.getElementById(elementId);
        //         let content = '';
        //         let maxChars = numberCharactersPattern(mask);
                
        //         inputElement.addEventListener('keydown', function(e) {
        //             e.preventDefault();
        //             if (isNumeric(e.key) && content.length < maxChars) {
        //             content += e.key;
        //             }
        //             if(e.keyCode == 8) {
        //             if(content.length > 0) {
        //                 content = content.substr(0, content.length - 1);
        //             }
        //             }
        //             inputElement.value = maskIt(mask, content);
        //         })
        //         }

        //         function isNumeric(char) {
        //         return !isNaN(char - parseInt(char));
        //         }

        //         function maskIt(pattern, value) {
        //         let position = 0;
        //         let currentChar = 0;
        //         let masked = '';
        //         while(position < pattern.length && currentChar < value.length) {
        //             if(pattern[position] === '0') {
        //             masked += value[currentChar];
        //             currentChar++;
        //             } else {
        //             masked += pattern[position];
        //             }
        //             position++;
        //         }
        //         return masked;
        //         }

        //         function numberCharactersPattern(pattern) {
        //         let numberChars = 0;
        //         for(let i = 0; i < pattern.length; i++) {
        //             if(pattern[i] === '0') {
        //             numberChars ++;
        //             }
        //         }
        //         return numberChars;
        //         }
                
        
        
}

module.exports = main;
