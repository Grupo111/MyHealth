// API
const API = "http://app.professordaniloalves.com.br/api/v1";

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

function validateCpf() {
    var cpf = document.getElementById("cpf").value;

    var digit1 = cpf.substring(9, 10);
    var digit2 = cpf.substring(10, 11);
    var currentCpf = cpf.substring(0, 9);

    var sum1 = 0;
    var j = 0;
    for(var i = 1; i < 10; i++) {
        var digit = currentCpf.substring(j, i);
        sum1 += digit * i;

        j++;
    }
    var rest1 = sum1 % 11;
    if(rest1 == 10) rest1 = 0;
    currentCpf += rest1;

    var sum2 = 0;
    j = 1;
    for(var i = 0; i < 10; i++){
        var digit = currentCpf.substring(i, j);
        sum2 += digit * i;

        j++;
    }
    var rest2 = sum2 % 11;
    if(rest2 == 10) rest2 = 0;

    if(digit1 == rest1 && digit2 == rest2)
    {
        document.getElementById("cpf").style.setProperty("border", "none");
        document.getElementById("cpf").style.setProperty("border-bottom", "2px solid #323232");
        return true;
    }
    else 
    {
        alert("CPF Inválido!");
        document.getElementById("cpf").style.setProperty("border", "1px solid red");
        document.getElementById("cpf").focus();
    }
}

function isEmpty(id){
    if(document.getElementById(id).value === "")
    {
        document.getElementById(id).style.setProperty("border", "1px solid red");
        return true;
    }
    else 
    {
        document.getElementById(id).style.setProperty("border", "none");
        document.getElementById(id).style.setProperty("border-bottom", "2px solid #323232");

        return false;
    }
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

function calculateIMC(){
    var weight = document.getElementById("weight").value;
    var height = document.getElementById("height").value;

    var result = weight / Math.pow(height, 2);
    result = result.toFixed(1);

    var resultText = document.getElementById("imcCalcResult"); 
    if(result < 18.5) {  
        resultText.innerHTML = result + " - Magreza (0)";
        resultText.style.setProperty("color", "red", "important");
    }
    else if(result >= 18.5 && result <= 24.9){
        resultText.innerHTML = result + " - Normal (0)";
        resultText.style.setProperty("color", "green", "important");
    }
    else if(result >= 25 && result <= 29.9){
        resultText.innerHTML = result + " - Sobrepeso (I)";
        resultText.style.setProperty("color", "red", "important");
    }
    else if(result >= 30 && result <= 39.9){
        resultText.innerHTML = result + " - Obesidade (II)";
        resultText.style.setProperty("color", "red", "important");
    }
    else if(result >= 40){
        resultText.innerHTML = result + " - Obesidade Grave (III)";
        resultText.style.setProperty("color", "red", "important");
    } 
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
        //console.log(response);

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

getUF();

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

function getUF(){
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

function submitButton(){
    var shouldAlert = false;

    if(isEmpty("name"))
        shouldAlert = true;

    if(isEmpty("cpf"))
        shouldAlert = true;

    if(isEmpty("birthdate"))
        shouldAlert = true;

    if(isEmpty("street"))
        shouldAlert = true;

    if(isEmpty("streetNumber"))
        shouldAlert = true;
    
    if(isEmpty("cep"))
        shouldAlert = true;

    if(isEmpty("city"))
        shouldAlert = true;

    if(isEmpty("uf"))
        shouldAlert = true;

    if(shouldAlert)
        alert("Preencha todos os dados!");
    else
    {
        var cpfOkay = validateCpf();

        if(cpfOkay)
        {
            var content = document.getElementById("signupContent");
            content.innerHTML = '<p style="text-align:center">Cadastrado com sucesso!</p>';
        }
    }
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

    fetch(API + "/cadastro", {
        method: "POST",
        headers: new Headers({
            Accept: "application/json",
            'Content-Type': "application/json",
        }),
        body: JSON.stringify({
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
        })
    }).then(response => {
        return new Promise((myResolve, myReject) => {
            response.json().then(json => {
                myResolve({"status": response.status, json});
            });
        });
    }).then(response => {
        //console.log(response);

        if(response.status == 201)
        {
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