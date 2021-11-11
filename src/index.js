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
    
    var node = document.getElementById(params.portletElementId);
    const {api, ids, propiedades, idsDates, propDates, idsSelects, propSelects, propSelectsValues, almaLocal, idActualizar} = params.configuration.portletInstance;
    let inputs = ids.split(', ');
    let prop = propiedades.split(', ');
    let propFechas = propDates.split(', ');
    let idsFechas = idsDates.split(', ');
    let idsSelect = idsSelects.split(', ');
    let propSelect = propSelects.split(', ');
    let propSelectsValue = propSelectsValues.split(', ');
    // let inputs = ["inputdoc5", "inputdoc6", "inputdoc7", "inputdoc8", "inputdoc9", "inputdoc10", "inputdoc11", "inputdoc13", "inputdoc15", "inputdoc16", "inputdoc17", "inputdoc23", "inputisss1", "inputinpep1", "inputnit2", "inputdoc1", "inputdoc20"];  
    // let prop = ["primer_nombre", "segundo_nombre", "primer_apellido", "segundo_apellido", "apellido_casada", "conocido_por", "nombre_completo", "nombre_padre", "nombre_madre", "nombre_conyuge", "profesion_afiliado", "lugar_expedicion_id", "num_id"]; 
    // let propFechas = ["fecha_expiracion_id", "fecha_expedicion_id", "fecha_nacimiento", "fecha_emision_nit", "fecha_emision_isss", "fecha_emision_inpep"]
    // let idsFechas = ["inputdoc3", "inputdoc2", "inputdoc18", "inputNit", "inputisss9", "inputinpep7"]
    // let idsSelect = ["selectTipoDoc", "select2", "inputdoc14"]
    // let propSelect = ["desc_tipo_id", "desc_estado_civil", "desc_genero"]
    // let propSelectsValue = ["tipo_id", "estado_civil", "cod_genero"]
    // console.log(inputs)
    // console.log(prop)
    // console.log(propFechas)
    // console.log(idsSelect)
    function cargarDatos(){
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
                
                const {persona} = data;
                // document.writeln(Object.keys(persona));
               
                for (var i in persona) {
                    
                    // console.log(i)
                    // console.log(persona[i])
                    
                    localStorage.setItem(i, persona[i])
                }
                for(x = 0; x < inputs.length; x++){
                    // console.log("inputs")
                    // console.log(inputs[x])
                    try{
                        document.getElementById(inputs[x]).value = persona[prop[x]];
                    }
                    catch(err){
                        console.log(err)
                    }
                    
                    // localStorage.setItem(prop[x], persona[prop[x]])
                    
                   
                }

                for(y = 0; y < propFechas.length; y++){
                    
                    setDate(idsFechas[y], persona[propFechas[y]])
                    
                    // localStorage.setItem(propFechas[y], persona[propFechas[y]])
                    
                }

              const agregar = (id, texto, valor) => {
                
                  let selector = document.getElementById(id)
                  const option = document.createElement('option');
                  option.value = valor;
                  option.text = texto;
                  if(id == "selectTipoDoc"){
                    const optionC = document.createElement('option');
                    optionC.value = 3;
                    optionC.text = "CARNET DE RESIDENTE";
                    selector.appendChild(optionC);
                  }else if(id == "selectEstadoCivil"){
                    const optionE = document.createElement('option');
                    optionE.value = 3;
                    optionE.text = "SOLTERO(A)";
                    selector.appendChild(optionE);
                  }
                  
                  selector.appendChild(option);
                  
                  selector.value = valor;
                };

                for(x = 0; x < idsSelect.length; x++){

                    if(prop[x] == "desc_tipo_id"){
                        formatoNumeros(persona[propSelectsValue[x]], idsSelect[x])
                    }
                    agregar(idsSelect[x], persona[propSelect[x]], persona[propSelectsValue[x]])
                    
                    
                    // localStorage.setItem(propSelectsValue[x], persona[propSelectsValue[x]])
                  
                  
               }

                function setDate(id, fecha){
                    // if(id == "idFechaExpiracion" && fecha == ""){
                    //   $("#alert1").modal("show")
                    // }
                    var fecha1 = fecha.split('/');
                    document.getElementById(id).value = fecha1[2]+"-"+fecha1[1]+"-"+fecha1[0];
                    
                  }

                if(persona["cod_nacionalidad"] != "222"){
                  $("#ayuda2").hide()
                }
                
            }
        }).fail(function () {
        });
    }

    cargarDatos()

    function cargarDatosLocalStorage(){
        for(x = 0; x < inputs.length; x++){   
            document.getElementById(inputs[x]).value = localStorage.getItem(prop[x]);
        }

        for(y = 0; y < propFechas.length; y++){
                    
            setDate(idsFechas[y], localStorage.getItem(propFechas[y]))
        }
        for(x = 0; x < idsSelect.length; x++){

            // if(prop[x] == "desc_tipo_id"){
            //     formatoNumeros(persona[propSelectsValue[x]], idsSelect[x])
            // }
            agregar(idsSelect[x], localStorage.getItem(propSelect[x]), localStorage.getItem(propSelectsValue[x]))
          
       }
    }

    

        document.getElementById("buttonActualizar").addEventListener("click", function(e){
            e.preventDefault()
            let datosInputs = []
            let datosFechas = [""]
            let datosSelect= []
            let fechasId = ["idFechaExpiracion", "idFechaExpedicion", "idFechaNacimiento"]
            console.log("inputs actualizar")
            console.log(inputs)
            for(x = 0; x < inputs.length; x++){  
                try{
                    datosInputs[x] = document.getElementById(inputs[x]).value
                }
                catch(err){

                }
            }
            console.log(propFechas)   
            for(y = 0; y < fechasId.length; y++){
                console.log("id fecha")
                console.log(propFechas[y])      
                datosFechas[y] = document.getElementById(fechasId[y]).value
            }

            for(x = 0; x < idsSelect.length; x++){
                let seleccion = document.getElementById(idsSelect[x])
                // datosSelect[x] =  document.getElementById(idsSelect[x]).value;
                datosSelect[x] = seleccion.options[seleccion.selectedIndex].text;
           }
           const dataInput = datosInputs.concat(datosSelect, datosFechas);
           
        //    const idsDataInput = inputs.concat(datosSelect, datosFechas);
            // console.log(datosInputs)
            // console.log(datosFechas)
            // console.log(propFechas)
            console.log("valores inputs")
            console.log(dataInput)
            const valoresServicio = cargarDatosLocalStorage()
            registrarCambios(dataInput, valoresServicio)
        })

        
        function cargarDatosLocalStorage(){
            let inputsLocal = []
            let selectLocal = []
            let fechaLocal = []
            let idinputsLocal = []
            let idselectLocal = []
            let idfechaLocal = []
            for(x = 0; x < inputs.length; x++){   
                inputsLocal[x] = localStorage.getItem(prop[x]);
            }
    
            for(y = 0; y < propFechas.length; y++){
                 
                fechaLocal[y] = localStorage.getItem(propFechas[y])
            }
            for(x = 0; x < idsSelect.length; x++){

                selectLocal[x] = localStorage.getItem(propSelect[x])
              
           }
           const dataInputLocal = inputsLocal.concat(selectLocal, fechaLocal);
        //    console.log(inputsLocal)
        //     console.log(selectLocal)
        console.log("valores locales")
            console.log(dataInputLocal)
            return dataInputLocal
        }



        function registrarCambios(dataInput, dataInputLocal){
            
            const idsDataInput = inputs.concat(idsSelect, idsFechas);
            let cambios = []
            let ids = []
            for(x = 0; x < dataInputLocal.length; x++){
    
                if(dataInput[x] != dataInputLocal[x]){
                    cambios.push(dataInput[x])
                    ids.push(idsDataInput[x])
                }
            }
            console.log("cambios")
            console.log(dataInput)
            console.log(dataInputLocal)
            if(cambios.length){

                localStorage.setItem("dataCambiada", JSON.stringify(cambios))
                localStorage.setItem("idsCambios", JSON.stringify(ids))
                window.location.href = "https://desa.virtualafpconfia.com/web/afiliado/confirmar";
            }
            
        }
        
    


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
        //       cargarDatos()
        //     }
        //   }

        // //   let arregloIds = ["inputdoc3", "inputdoc2", "inputdoc18", "inputisss9", "inputinpep7", "inputnit7"];

        // // let arregloIds = ["inputdoc3", "inputdoc2", "inputdoc18"];
        // // idsFechas.forEach(id => {
        //     document.getElementById("inputdoc3").onchange = function(){
              
        //           validarExpiracion(getDateToday(), this.value)
                
                
        //     }
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
