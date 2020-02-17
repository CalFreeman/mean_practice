function ajaxSubmitForm() {
    var usernameElement = document.getElementById("Email");
    var passwordElement = document.getElementById("password");
    //to determine which form to pass
    var formElement = document.getElementsByName("form");


    if (usernameElement && passwordElement) {
        var username = usernameElement.value;
        var password = passwordElement.value;
        var formValue = formElement[1].value;
        console.log("Username: " + username + " Password: " + password);

        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (this.readyState == 4) {
                var msg = document.getElementById("msg");
                if (msg) {
                    msg.innerHTML = this.responseText;
                    if (this.status == 200) {
                        msg.innerHTML = msg.innerHTML + " Registration Success! " +
                            "You will be redirected to the Login Page in 30 seconds " +
                            "or <a href='http://localhost/html/personalProfile.html'>click here</a>";
                        setTimeout(function() {
                            window.location.href = "http://localhost/html/personalProfile.html";
                        }, 300);
                    }
                }
            }
        };
        xhr.open("POST", "http://localhost/index", true);
        xhr.setRequestHeader("Content-type",
            "application/x-www-form-urlencoded");
        xhr.send("username="+username+"&password="+password+"&formValue"+formValue);
    }
}

function ajaxSubmitFormLogin() {
    var usernameElement = document.getElementById("emailLogin");
    var passwordElement = document.getElementById("passwordLogin");

    if (usernameElement && passwordElement) {
        var username = usernameElement.value;
        var password = passwordElement.value;
        console.log("Username: " + username + " Password: " + password);

        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (this.readyState == 4) {
                var msg = document.getElementById("msg");
                if (msg) {
                    msg.innerHTML = this.responseText;
                    if (this.status == 200) {
                        msg.innerHTML = msg.innerHTML + " Login Success! " +
                            "You will be redirected to the Profile Page in 30 seconds " +
                            "or <a href='http://localhost/html/personalProfile.html'>click here</a>";
                        setTimeout(function() {
                            window.location.href = "http://localhost/html/personalProfile.html";
                        }, 300);
                    }
                }
            }
        };
        xhr.open("POST", "http://localhost/index/login", true);
        xhr.setRequestHeader("Content-type",
            "application/x-www-form-urlencoded");
        xhr.send("username="+username+"&password="+password);
    }
}

function ajaxPersonalProfile(){
    var firstNameElement = document.getElementById("firstName");
    var lastNameElement = document.getElementById("lastName");
    var interestElement = document.getElementById("interest");
    var stateElement = document.getElementById("state");
    //to determine which form to pass
    var formElement = document.getElementsByName("form");
    //profile image
    var fileElement = document.getElementById("file");

    if (firstNameElement && lastNameElement && interestElement && stateElement) {
        var firstName = firstNameElement.value;
        var lastName = lastNameElement.value;
        var interest = interestElement.value;
        var state = stateElement.value;
        var formValue = formElement[0].value;
        var file = fileElement.value;
        /////////////////////////////////////
        console.log("First Name: "+firstName+" Last Name: "+lastName+" interests: "+interest+ " state: "+state+" formValue: "+formValue +" file: "+file);
        //accessing username from localstorage for updates
        var username = localStorage.getItem("username");
        localStorage.setItem("state", state);

        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (this.readyState == 4) {
                var msgElement = document.getElementById("msg");
                if (this.status == 200) {
                    setTimeout(function() {
                        window.location.href = "http://localhost/html/personalProfile.html";
                    }, 200);
                }
            }
        }
    };
    xhr.open("POST", "http://localhost/personalProfile/update", true);
    xhr.setRequestHeader("Content-type",
        "application/x-www-form-urlencoded");
    xhr.send("firstName="+firstName+"&lastName="+lastName+"&interest="+interest+"&username="+username+"&state="+state+"&formValue="+formValue+"&file="+file);
}

function ajaxSearch() {
    var interestSearchElement = document.getElementById("interestSearch");
    var searchRadioElementInterest = document.getElementById("interestRadio");
    var searchRadioElementLocation = document.getElementById("locationRadio");
    //assign radio values to variables
    var radioInterest = searchRadioElementInterest.value;
    var radioLocation = searchRadioElementLocation.value;
    //variable to determine which form to pass
    var formElement = document.getElementsByName("form");

    var radioPass = (searchRadioElementInterest.checked ? radioInterest : radioLocation );

    if (radioPass) {
        var formValue = formElement[1].value;
        var interestSearch = interestSearchElement.value;
        //accessing username and state from localstorage for search parameters
        var username = localStorage.getItem("username");
        var state = localStorage.getItem("state");

        console.log("interest: " + interestSearch + " radio Selection: " + radioPass + " formValue: " +formValue +" state: " +state);

        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (this.readyState == 4) {
                var msgElement = document.getElementById("msg");
                if (msgElement) {
                    msgElement.innerHTML = this.responseText;
                    if (this.status == 200) {
                        msgElement.innerHTML = msgElement.innerHTML + " Search Success! " +
                            "You will be redirected profile page in 2 seconds " +
                            "or <a href='http://localhost/html/personalProfile.html'>click here</a>";
                        setTimeout(function () {
                            window.location.href = "http://localhost/html/personalProfile.html";
                        }, 30000);
                    }
                }
            }
        };
        xhr.open("POST", "http://localhost/personalProfile/search", true);
        xhr.setRequestHeader("Content-type",
            "application/x-www-form-urlencoded");
        xhr.send("interestSearch="+interestSearch+"&radioPass="+radioPass+"&state="+state+"&formValue="+formValue);
    }
}