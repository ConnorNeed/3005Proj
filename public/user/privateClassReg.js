window.onload = function() {
    getTrainers();
    getRegisteredPrivateClasses();
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
            menu.innerHTML = '"<option value="None">Select</option>"';
            trainer.forEach(trainer => {
                const name = trainer.full_name;
                const id = trainer.id;
                menu.innerHTML += `<option value="${id}">${name}</option>`;
            });
        });
}
async function register() {
    const url = "/user/privateClassReg";
    const selector = document.getElementById("trainer-menu");
    const trainer = selector.options[selector.selectedIndex].value;
    const start = document.getElementById("start_time").value;
    const end = document.getElementById("end_time").value;
    if (trainer === "None"){
        alert("Please select a trainer");
        return;
    }
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({trainer: trainer, start: start, end: end})
        });
        if (response.status === 299) {
            alert("Trainer not availible at that time");
        } else if (response.ok) {
            alert("Class registered successfully");
            getRegisteredPrivateClasses();
        } else {
            console.error('Failed to register class:', response.statusText);
        }
    } catch (error) {
        console.error("An error occurred while registering the class:", error);
    }
}
function getRegisteredPrivateClasses() {
    const url = "/user/privateClasses";
    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                console.error("Failed to get activities");
            }
        })
        .then(classes => {
            var table = document.getElementById("registered-private-classes-table");
            table.children[1].innerHTML = "";
            classes.forEach(c => {
                var row = table.children[1].insertRow();
                row.insertCell().appendChild(document.createTextNode(c.name));
                row.insertCell().appendChild(document.createTextNode(c.start_time));
                row.insertCell().appendChild(document.createTextNode(c.end_time));
            });
        }
    );
}