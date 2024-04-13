
window.onload = refresh;

function refresh() {
    var table = document.getElementById("trainer-classes-table");
    table.children[1].innerHTML = "";
    table = document.getElementById("trainer-avail-table");
    table.children[1].innerHTML = "";
    getSchedule();
}

function addavailability() {
    const form = document.getElementById("add-form");
    const start = form.children[0].value;
    const end = form.children[1].value;
    if (start > end) {
        alert("Start time must be before end time");
        return;
    }
    sendavailability(start, end);
}

async function sendavailability(start, end) {
    const url = "/trainer/addavailability";
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
            refresh();
        } else {
            console.error('Failed to save class:', response.statusText);
        }
    } catch (error) {
        console.error("An error occurred while saving the class:", error);
    }
}

async function deleteRow(id) {
    const url = "/trainer/deleteavailability";
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
            console.error('Failed to delete class:', response.statusText);
        }
    } catch (error) {
        console.error("An error occurred while deleting the class:", error);
    }
}

async function getSchedule() {
    const url = "/trainer/getSchedule";
    try {
        const response = await fetch(url);
        if (response.ok) {
            const schedule = await response.json();
            const availability = schedule.availability;
            const groupClasses = schedule.groupClasses;
            const privateClasses = schedule.privateClasses;
            const classTable = document.getElementById("trainer-classes-table");
            const availabilityTable = document.getElementById("trainer-avail-table");
            console.log(availability);
            for (let i = 0; i < availability.length; i++) {
                const row = availabilityTable.insertRow(-1);
                row.insertCell(0).innerText = availability[i].start_time;
                row.insertCell(1).innerText = availability[i].end_time;
                row.insertCell(2).innerHTML = `<button onclick='deleteRow(${availability[i].availability_id})'>Delete</button>`;
            }
            var groupPtr = 0;
            var privatePtr = 0;
            for (let i=0; i < groupClasses.length+privateClasses.length; i++) {
                const row = classTable.insertRow(-1);
                console.log(groupClasses[groupPtr]);
                if(privatePtr >= privateClasses.length-1 || (groupPtr < groupClasses.length-1 && groupClasses[groupPtr].start_time < privateClasses[privatePtr].start_time)) {
                    row.insertCell(0).innerText = typeToString(groupClasses[groupPtr].class_type);
                    row.insertCell(1).innerText = groupClasses[groupPtr].start_time;
                    row.insertCell(2).innerText = groupClasses[groupPtr].end_time;
                    row.insertCell(3).innerText = groupClasses[groupPtr].class_difficulty;
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