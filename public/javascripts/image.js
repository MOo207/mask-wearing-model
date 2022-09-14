// script.js
const form = document.getElementById("form");

form.addEventListener("submit", submitForm);

var getBase64fromFile = function (file) {
    return new Promise(function (resolve, reject) {
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            resolve(reader.result);
        };
        reader.onerror = function (error) {
            reject(error);
        };
    });
};

async function submitForm(e) {
    e.preventDefault();
    const name = document.getElementById("name");
    const image = document.getElementById("image").files[0];
    const base64 = await getBase64fromFile(image);
    sendRequest(base64);

}

function sendRequest(base64) {
    // TODO: Change the link here to hold your data
    var url = "https://detect.roboflow.com/model/version?api_key=your_api_key";
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url);

    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            console.log(xhr.status);
            console.log(xhr.responseText);
            const predictions = document.getElementById("predictions");
            predictions.innerHTML = xhr.responseText;
   
            var img = $('<img/>');
            img.attr('src', base64);
            $('#output').html("").append(img);
          
        }
    };

    var data = base64;

    xhr.send(data);

    


}