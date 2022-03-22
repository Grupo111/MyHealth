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
    }
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