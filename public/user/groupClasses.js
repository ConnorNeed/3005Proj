window.onload = function() {
    getRegisteredGroupClasses();
    getAvailibleGroupClasses();
}
function getRegisteredGroupClasses() {
    const url = "user/registeredClasses";
    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                console.error("Failed to get activities");
            }
        })
        .then(classes => {
            var table = document.getElementById("registered-group-classes-table");
            table.children[1].innerHTML = "";
            classes.forEach(c => {
                var row = table.children[1].insertRow();
                row.insertCell().appendChild(document.createTextNode(c.class_id));
                row.insertCell().appendChild(document.createTextNode(classTypeToString(c.class_type)));
                row.insertCell().appendChild(document.createTextNode(c.start_time));
                row.insertCell().appendChild(document.createTextNode(c.end_time));
                row.insertCell().appendChild(document.createTextNode(c.class_difficulty));
                row.insertCell().appendChild(document.createTextNode(c.name));
                row.insertCell().innerHTML = "<button onclick='deregisterForClass(this)'>Drop</button>";
            });
        });
}

function getAvailibleGroupClasses() {
    const url = "user/availibleClasses";
    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                console.error("Failed to get activities");
            }
        })
        .then(classes => {
            var table = document.getElementById("availible-group-classes-table");
            table.children[1].innerHTML = "";
            classes.forEach(c => {
                var row = table.children[1].insertRow();
                row.insertCell().appendChild(document.createTextNode(c.class_id));
                row.insertCell().appendChild(document.createTextNode(classTypeToString(c.class_type)));
                row.insertCell().appendChild(document.createTextNode(c.start_time));
                row.insertCell().appendChild(document.createTextNode(c.end_time));
                row.insertCell().appendChild(document.createTextNode(c.class_difficulty));
                row.insertCell().appendChild(document.createTextNode(c.name));
                row.insertCell().innerHTML = "<button onclick='registerForClass(this)'>Add</button>";
            });
        });
}
function classTypeToString(type) {
    if (type === 0) {
        return "Yoga";
    } else if (type === 1) {
        return "Cycling";
    } else if (type === 2) {
        return "Lifting";
    } else {
        console.error("Invalid type");
    }
}

async function registerForClass(button) {
    const row = button.parentNode.parentNode;
    const classId = row.cells[0].innerText;
    const url = "user/registerForClass";
    const body = JSON.stringify({class_id: classId});
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: body
        });
        if (response.ok) {
            alert("Class added successfully");
            getAvailibleGroupClasses();
            getRegisteredGroupClasses();
        } else {
            if (response.status === 409) {
                alert("You are already registered for this class");
            } else {
                console.error('Failed to add class:', response.statusText);
            }
        }
    }catch (error) {
        console.error("An error occurred while registering for the class:", error);
    }
}

async function deregisterForClass(button) {
    const row = button.parentNode.parentNode;
    const classId = row.cells[0].innerText;
    const url = "user/deregisterForClass";
    const body = JSON.stringify({class_id: classId});
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: body
        });
        if (response.ok) {
            alert("Class dropped successfully");
            getAvailibleGroupClasses();
            getRegisteredGroupClasses();
        } else {
            console.error('Failed to drop class:', response.statusText);
        }
    }catch (error) {
        console.error("An error occurred while dropping the class:", error);
    }
}