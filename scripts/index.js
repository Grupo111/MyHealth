// API
const API = "https://app.professordaniloalves.com.br/api/v1";

/*
*
*   VALIDATE
*
*/

function validateNumber(evt) {
    var theEvent = evt || window.event;
  
    // Handle paste
    if (theEvent.type === 'paste') {
        key = event.clipboardData.getData('text/plain');
    } else {
    // Handle key press
        var key = theEvent.keyCode || theEvent.which;
        key = String.fromCharCode(key);
    }

    var lenght = document.getElementById("cpf").value.lenght;

    var regex = /[0-9]|\./;
    if (!regex.test(key) || lenght >= 11) {
      theEvent.returnValue = false;
      if (theEvent.preventDefault) theEvent.preventDefault();

      return false;
    }

    return true;
}

function createInputErrorText(containerID, message){
    var textNode = document.createElement("p");
    textNode.innerHTML = message;
    textNode.classList.add("inputError");
    textNode.style.setProperty("color", "red", "important");
    textNode.style.setProperty("text-align", "center", "important");

    document.getElementById(containerID).appendChild(textNode);
    var inputs = document.getElementById(containerID).getElementsByTagName("input");

    inputs[0].style.setProperty("border", "1px solid red");
}


/*
*
*   IMC
*
*/

function resetIMCInputs(){
    var elementsList = document.getElementsByClassName("imcInputContainer");

    for(let element of elementsList)
    {
        var inputs = element.getElementsByTagName("input");
        inputs[0].style.setProperty("border", "none");
        inputs[0].style.setProperty("border-bottom", "2px solid #323232");

        var texts = element.getElementsByTagName("p");
        if(texts[0])
            texts[0].remove();
    }

    document.getElementById("imcCalcResult").innerHTML = "";
}

function calculateIMCWithAPI(){
    resetIMCInputs();

    var weight = document.getElementById("weight").value;
    var height = document.getElementById("height").value;

    fetch(API + "/imc/calcular", {
        method: "POST",
        headers: new Headers({
            Accept: "application/json",
            'Content-Type': "application/json",
        }),
        body: JSON.stringify({
            peso: weight,
            altura: height
        })
    }).then(response => {
        return new Promise((myResolve, myReject) => {
            response.json().then(json => {
                myResolve({"status": response.status, json});
            });
        });
    }).then(response => {
        if(response && response.json.errors) {
            var error = "";
            Object.entries(response.json.errors).forEach((obj, index) => {
                if(obj[0] == "peso")
                    createInputErrorText("weightContainer", obj[1][0])
                else
                    createInputErrorText("heightContainer", obj[1][0])
            })
        } else {
            document.getElementById("imcCalcResult").innerHTML = response.json.message;
            document.getElementById("imcCalcResult").style.setProperty("color", "white", "important");
        }
    })
}

/*
*
*   SIGN UP
*
*/

var currentForm = "";

getUFAPI();

function resetSignupInputs(){
    var elementsList = document.getElementsByClassName("signupInputContainer");

    for(let element of elementsList)
    {
        var inputs = element.getElementsByTagName("input");
        if(inputs[0])
        {
            inputs[0].style.setProperty("border", "none");
            inputs[0].style.setProperty("border-bottom", "2px solid #323232");    
        }

        var texts = element.getElementsByTagName("p");
        if(texts[0])
            texts[0].remove();
    }
}

function createOption(value, text){
    const node = document.createElement("option");
    const textNode = document.createTextNode(text);

    node.appendChild(textNode);
    node.value = value;

    return node;
}

function getUFAPI(){
    fetch(API + "/endereco/estados", {
        headers: new Headers({
            Accept: "application/json"
        })
    }).then(response => {
        return response.json();
    }).then(ufs => {
        const ufElement = document.getElementById("uf");
        ufs.forEach((uf) => {
            ufElement.appendChild(createOption(uf.uf, uf.nome));
        })
    }).catch(err => {
        alert("Falha ao carregar lista de estados!");
        console.log(err);
    })
}

function fillAdressWithCEP(){
    const cep  = document.getElementById("cep").value;

    fetch(API + "/endereco/" + cep, {
        method: "GET",
        headers: new Headers({
            Accept: "application/json"
        })
    }).then(response => {
        return new Promise((myResolve, myReject) => {
            response.json().then(json => {
                myResolve({"status": response.status, json});
            });
        });
    }).then(response => {
        if(response.status == 200)
        {
            document.getElementById("street").value = response.json.logradouro;
            document.getElementById("city").value = response.json.localidade;
            document.getElementById("uf").value = response.json.uf;
        }
    })
}

function fillFormWithCPF(){
    document.getElementById("modal").style.display = "none";

    document.getElementById("name").value = currentForm.nomeCompleto;
    document.getElementById("email").value = currentForm.email;
    document.getElementById("cpf").value = currentForm.cpf;
    document.getElementById("birthdate").value = currentForm.dataNascimento;
    document.getElementById("sex").value = currentForm.sexo;
    document.getElementById("cep").value = currentForm.cep;
    document.getElementById("street").value = currentForm.logradouro;
    document.getElementById("streetNumber").value = currentForm.numeroLogradouro;
    document.getElementById("city").value = currentForm.cidade;
    document.getElementById("uf").value = currentForm.uf;
}

function checkCpfExistsAPI(){
    currentForm = "";

    const cpf  = document.getElementById("cpf").value;

    fetch(API + "/cadastro/" + cpf, {
        method: "GET",
        headers: new Headers({
            Accept: "application/json"
        })
    }).then(response => {
        return new Promise((myResolve, myReject) => {
            response.json().then(json => {
                myResolve({"status": response.status, json});
            });
        });
    }).then(response => {
        if(response.status == 200)
        {
            currentForm = response.json;
            document.getElementById("modal").style.display = "block";
        }
    })
}

function submitAPIButton(){
    resetSignupInputs();

    var name = document.getElementById("name").value;
    var email = document.getElementById("email").value;
    var cpf = document.getElementById("cpf").value;
    var birthdate = document.getElementById("birthdate").value;
    var sex = document.getElementById("sex").value;
    var cep = document.getElementById("cep").value;
    var street = document.getElementById("street").value;
    var streetNumber = document.getElementById("streetNumber").value;
    var city = document.getElementById("city").value;
    var uf = document.getElementById("uf").value;

    let method = "POST";
    let body = JSON.stringify({
        nomeCompleto: name,
        dataNascimento: birthdate,
        sexo: sex,
        cep: cep,  
        cpf: cpf,
        uf: uf,
        cidade: city,
        logradouro: street,
        numeroLogradouro: streetNumber,
        email: email
    });

    if(currentForm != "")
    {
        method = "PUT";
        body = JSON.stringify({
            id: currentForm.id,
            nomeCompleto: name,
            dataNascimento: birthdate,
            sexo: sex,
            cep: cep,  
            cpf: cpf,
            uf: uf,
            cidade: city,
            logradouro: street,
            numeroLogradouro: streetNumber,
            email: email
        });
    }

    fetch(API + "/cadastro", {
        method: method,
        headers: new Headers({
            Accept: "application/json",
            'Content-Type': "application/json",
        }),
        body: body
    }).then(response => {
        return new Promise((myResolve, myReject) => {
            response.json().then(json => {
                myResolve({"status": response.status, json});
            });
        });
    }).then(response => {
        if(response.status == 201 || response.status == 200)
        {
            currentForm = "";
            var content = document.getElementById("signupContent");
            content.innerHTML = '<p style="text-align:center">' + response.json.message + '</p>';

            document.getElementById("signup").scrollIntoView();

        } else if(response && response.json.errors) {
            Object.entries(response.json.errors).forEach((obj, index) => {
                createInputErrorText(obj[0] + "Container", obj[1][0])
            })

        } else {
            createInputErrorText("cpfContainer", response.json.message);
        }
    })
}

function deleteFromAPI(){
    const cpf = currentForm.cpf;

    fetch(API + "/cadastro/" + cpf, {
        method: "DELETE",
        headers: new Headers({
            Accept: "application/json"
        })
    }).then(response => {
        return new Promise((myResolve, myReject) => {
            myResolve({"status": response.status});
        });
    }).then(response => {
        if(response.status == 204){
            currentForm = "";
            document.getElementById("modal").style.display = "none";
            alert("Deletado com sucesso!");
        }
        else {
            currentForm = "";
            document.getElementById("modal").style.display = "none";
            alert("Falha ao deletar!");
        }
    })
}