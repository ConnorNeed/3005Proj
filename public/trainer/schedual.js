
window.onload = function () {
    var table = document.getElementById("trainer-classes-table");
    table.children[1].innerHTML = "";
    getClasses();
    getPrivate();
}


function addRow() {
    const form = document.getElementById("add-form");
    const typeIndex = form.children[0].selectedIndex;
    const type = form.children[0].value;
    const start = form.children[1].value;
    const end = form.children[2].value;
    const difficulty = form.children[3].value;
    if (start > end) {
        alert("Start time must be before end time");
        return;
    }
    if (typeIndex === 0){
        alert("Please select a class type");
        return;
    }
    addToTable(type, start, end, difficulty);
    sendClass(typeIndex, start, end, difficulty);
}

function addToTable(type, start, end, difficulty) {
    var row = document.getElementById("table-body").insertRow();
    row.innerHTML = '<tr><td>'+type+'</td><td>'+start+'</td><td>'+end+'</td><td>'+difficulty+'</td><td><button onclick="deleteRow(this)">Delete</button></td></tr>';
}

async function sendClass(type, start, end, difficulty) {
    const url = "/trainer/addGroupClass";
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({type: type, start: start, end: end, difficulty: difficulty})
        });
        if (response.ok) {
            alert("Class saved successfully");
        } else {
            console.error('Failed to save class:', response.statusText);
        }
    } catch (error) {
        console.error("An error occurred while saving the class:", error);
    }
}

async function deleteRow(button) {
    var row = button.parentNode.parentNode;
    var type = row.cells[0].innerText;
    var start = row.cells[1].innerText;
    var end = row.cells[2].innerText;
    var difficulty = row.cells[3].innerText;
    if (difficulty === "") {
        const url = "/trainer/delPrivateClass";
        body = JSON.stringify({name: type, start: start, end: end});
    } else {
        const url = "/trainer/delGroupClass";
        body = JSON.stringify({type: +type, start: start, end: end, difficulty: +difficulty});
    }
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: body
        });
        if (response.ok) {
            alert("Class deleted successfully");
        } else {
            console.error('Failed to deleted class:', response.statusText);
        }
    } catch (error) {
        console.error("An error occurred while deleting the class:", error);
    }
    row.parentNode.removeChild(row);
}

function getClasses() {
    const url = "/trainer/groupClasses";
    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                console.error("Failed to get classes: ", response.statusText);
            }
        })
        .then(classes => {
            classes.forEach(c => {
                var type = +c.class_type;
                if (type === 0) {
                    type = "Yoga";
                } else if (type === 1) {
                    type = "Cycling";
                } else if (type === 2) {
                    type = "Lifting";
                } else if (type === 3) {
                    type = "Block off";
                } else {
                    console.error("Invalid type");
                }
                addToTable(type, c.start_time, c.end_time, c.class_difficulty);
            });
        });
}
function getPrivate() {
    const url = "/trainer/privateClasses";
    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                console.error("Failed to get private classes: ", response.statusText);
            }
        })
        .then(classes => {
            classes.forEach(c => {
                addToTable(c.name, c.start_time, c.end_time, "");
            });
        });
}