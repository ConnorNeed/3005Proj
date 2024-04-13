
window.onload = refresh;

function refresh () {
    var table = document.getElementById("trainer-classes-table");
    table.children[1].innerHTML = "";
    getTrainers();
    getClasses();
}

function getTrainers() {
    const url = "/user/trainers";
    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                console.error("Failed to get activities");
            }
        })
        .then(trainer => {
            const menu = document.getElementById("trainer-menu");
            menu.innerHTML = '"<option value="None">Select Trainer...</option>"';
            trainer.forEach(trainer => {
                const name = trainer.full_name;
                const id = trainer.id;
                menu.innerHTML += `<option value="${id}">${name}</option>`;
            });
        });
}


function addRow() {
    const form = document.getElementById("add-form");
    const trainer = form.children[0].value;
    const typeIndex = form.children[1].selectedIndex-1;
    const start = form.children[2].value;
    const end = form.children[3].value;
    const difficulty = form.children[4].value;
    if (start > end) {
        alert("Start time must be before end time");
        return;
    }
    if (typeIndex === -1){
        alert("Please select a class type");
        return;
    }
    if (trainer === "None") {
        alert("Please select a trainer");
        return;
    }
    sendClass(trainer, typeIndex, start, end, difficulty);
}

function addToTable(trainerName, classId, type, start, end, difficulty) {
    var row = document.getElementById("table-body").insertRow();
    row.innerHTML = `<tr><td>${trainerName}</td><td>${type}</td><td>${start}</td><td>${end}</td><td>${difficulty}</td><td><button onclick="deleteRow(${classId})">Delete</button></td></tr>`;
}

async function sendClass(trainer, type, start, end, difficulty) {
    const url = "/admin/addGroupClass";
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({trainer: trainer, type: type, start: start, end: end, difficulty: difficulty})
        });
        if (response.ok) {
            alert("Class saved successfully");
            refresh();
        } else {
            console.error('Failed to save class:', response.statusText);
        }
    } catch (error) {
        console.error("An error occurred while saving the class:", error);
    }
}

async function deleteRow(id) {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({id: id})
        });
        if (response.ok) {
            alert("Class deleted successfully");
            refresh();
        } else {
            console.error('Failed to deleted class:', response.statusText);
        }
    } catch (error) {
        console.error("An error occurred while deleting the class:", error);
    }
    row.parentNode.removeChild(row);
}

function getClasses() {
    const url = "/admin/groupClasses";
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
                addToTable(c.full_name, c.class_id, type, c.start_time, c.end_time, c.class_difficulty);
            });
        });
}