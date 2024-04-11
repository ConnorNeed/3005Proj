window.onload = function () {
    getActivities();
}

function changeType(selector) {
    const index = selector.selectedIndex;
    if(index === 0) {
        document.getElementById("activity-attr").innerHTML = "";
        return;
    }
    if(index <= 2) {
        document.getElementById("activity-attr").innerHTML = '<input type="number" value="0" min="0" max="999"></input><span style="margin-left:10px;">km</span> <input id="h" name="h" type="number" min="0" max="23"> <label for="h">h</label> <input id="m" name="m" type="number" min="0" max="59"> <label for="m">m</label> <input id="s" name="s" type="number" min="0" max="59"> <label for="s">s</label>';
        return;
    }
    if (index === 3) {
        document.getElementById("activity-attr").innerHTML = '<select name="lift" id="lift"><option value="Deadlift">Deadlift</option><option value="Squat">Squat</option><option value="Bench Press">Bench Press</option><option value="Shoulder Press">Shoulder Press</option><option value="Weighted Lunge">Shoulder Press</option></select> <input type="number" value="0.0" min="0" max="9999"></input><span style="margin-left:10px;">lbs</span>';
        return;
    }
}

function addRow() {
    const children = document.getElementById("activity-attr").children;
    if(children.length < 2) {
        return;
    }
    const type = +document.getElementById("activity_type").selectedIndex;
    const val1 = document.getElementById("activity-attr").children[0].value;
    var val2;
    if(type === 3) {
        val2 = children[1].value;
        sendActivity(type, document.getElementById("activity-attr").children[0].selectedIndex, val2);
    } else {
        var hours = children[2].value || 0;
        var minutes = children[4].value || 0;
        var seconds = children[6].value || 0;
        val2 = hours + ' h, ' + minutes + ' m, ' + seconds + ' s';
        sendActivity(type, +val1, hours*3600 + minutes*60 + seconds);
    }
    addToTable(type, val1, val2);
}

function liftTypeString(type) {
    if(type === 0) {
        return "Deadlift";
    } else if(type === 1) {
        return "Squat";
    } else if(type === 2) {
        return "Bench Press";
    } else if(type === 3) {
        return "Shoulder Press";
    } else if(type === 4) {
        return "Weighted Lunge";
    } else {
        console.error("Invalid lift type");
    }
}
function addToTable(type, val1, val2) {
    var typeStr;
    if(type === 1) {
        typeStr = "Run";
        val1 = val1 + " km";
    } else if(type === 2) {
        typeStr = "Cycle";
        val1 = val1 + " km";
    } else if(type === 3) {
        typeStr = "Lifting";
        val1 = liftTypeString(val1);
    } else {
        console.error("Invalid type");
    }
    var row = document.getElementById("table-body").insertRow();
    row.innerHTML = '<tr><td>'+typeStr+'</td><td>'+val1+'</td><td>'+val2+'</td><td><button onclick="deleteRow(this)">Delete</button></td></tr>';
}

async function sendActivity(type, value1, value2) {
    const url = "/user/addActivity";
    type = type-1;
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({type: type, value1: value1, value2: value2})
        });
        if (response.ok) {
            alert("Activity saved successfully");
        } else {
            console.error('Failed to save activity:', response.statusText);
        }
    } catch (error) {
        console.error("An error occurred while saving the activity:", error);
    }
}

async function deleteRow(button) {
    var row = button.parentNode.parentNode;
    const url = "/user/delActivity";
    var type = row.cells[0].innerText;
    var val1;
    var val2;
    if(type === "Run") {
        type = 0;
        val1 = +row.cells[1].innerText;
        var time = row.cells[2].innerText.split(", ");
        var hours = time[0].split(" ")[0];
        var minutes = time[1].split(" ")[0];
        var seconds = time[2].split(" ")[0];
        val2 = +hours*3600 + + minutes*60 + + seconds;
    } else if(type === "Cycle") {
        type = 1;
        val1 = +row.cells[1].innerText;
        var time = row.cells[2].innerText.split(", ");
        var hours = time[0].split(" ")[0];
        var minutes = time[1].split(" ")[0];
        var seconds = time[2].split(" ")[0];
        val2 = +hours*3600 + + minutes*60 + + seconds;
    } else if(type === "Lifting") {
        type = 2;
        val1 = +row.cells[1].innerText;
        val2 = +row.cells[2].innerText;
    } else {
        console.error("Invalid type");
    }

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({type: type, value1: val1, value2: val2})
        });
        if (response.ok) {
            alert("Activity deleted successfully");
        } else {
            console.error('Failed to deleted activities:', response.statusText);
        }
    } catch (error) {
        console.error("An error occurred while deleting the activities:", error);
    }
    row.parentNode.removeChild(row);
}

function getActivities() {
    const url = "/user/activities";
    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                console.error("Failed to get activities");
            }
        })
        .then(activities => {
            var table = document.getElementById("user-activities-table");
            table.children[1].innerHTML = "";
            activities.forEach(activity => {
                const activityType = +activity.activity_type+1;
                console.log(activityType, activity);
                if (activityType <= 2) {
                    let hours = Math.floor(activity.duration / 3600);
                    let minutes = Math.floor((activity.duration - 3600 * hours) / 60);
                    let seconds = activity.duration % 60;
                    addToTable(activityType, activity.distance, hours + ' h, ' + minutes + ' m, ' + seconds + ' s');
                } else {
                    addToTable(activityType, activity.activity_type, activity.amount);
                }
            });
        });
}