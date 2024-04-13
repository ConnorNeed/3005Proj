
window.onload = function () {
    var table = document.getElementById("trainer-classes-table");
    table.children[1].innerHTML = "";
}


function addAvailibility() {
    const form = document.getElementById("add-form");
    const start = form.children[0].value;
    const end = form.children[1].value;
    if (start > end) {
        alert("Start time must be before end time");
        return;
    }
    sendAvailibility(start, end, difficulty);
}

async function sendAvailibility(start, end) {
    const url = "/trainer/addAvailibility";
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({start: start, end: end})
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

async function deleteRow(id) {
    const url = "/trainer/deleteAvailibility";
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
        } else {
            console.error('Failed to delete class:', response.statusText);
        }
    } catch (error) {
        console.error("An error occurred while deleting the class:", error);
    }
}

async function getSchedual() {
    const url = "/trainer/getSchedual";
    try {
        const response = await fetch(url);
        if (response.ok) {
            const schedual = await response.json();
            const availibility = schedual.availibility;
            const groupClasses = schedual.groupClasses;
            const privateClasses = schedual.privateClasses;
            const classTable = document.getElementById("trainer-classes-table");
            const availibilityTable = document.getElementById("trainer-avail-table");
            for (let i = 0; i < availibility.length; i++) {
                const row = availibilityTable.insertRow(-1);
                row.insertCell(0).innerText = availibility[i].start;
                row.insertCell(1).innerText = availibility[i].end;
                row.insertCell(2).innerHTML = `<button onclick='deleteRow(${availibility[i].availability_id})'>Delete</button>`;
            }
            var groupPtr = 0;
            var privatePtr = 0;
            for (let i=0; i < groupClasses.length+privateClasses.length; i++) {
                const row = classTable.insertRow(-1);
                if(groupClasses[groupPtr].start_time < privateClasses[privatePtr].start_time) {
                    row.insertCell(0).innerText = typeToString(groupClasses[groupPtr].class_type);
                    row.insertCell(1).innerText = groupClasses[groupPtr].start_time;
                    row.insertCell(2).innerText = groupClasses[groupPtr].end_time;
                    row.insertCell(3).innerText = groupClasses[groupPtr].difficulty;
                    row.insertCell(4).innerText = groupClasses[groupPtr].member_count;
                    groupPtr++;
                }else {
                    row.insertCell(0).innerText = privateClasses[privatePtr].start_time;
                    row.insertCell(1).innerText = privateClasses[privatePtr].end_time;
                    row.insertCell(2).innerText = privateClasses[privatePtr].name;
                    privatePtr++;
                }
            }
        } else {
            console.error('Error fetching user profile:', response.statusText);
        }
    } catch (error) {
        console.error('Error fetching user profile:', error);
    }
}

function typeToString(type) {
    if (type == 0) {
        return "Yoga";
    } else if(type == 1) {
        return "Cycling";
    } else if(type == 2) {
        return "Lifting";
    } else {
        console.error("Invalid type");
        return "";
    }
}