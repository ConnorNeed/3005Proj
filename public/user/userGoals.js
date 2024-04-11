window.onload = function () {
    getGoals();
}

function addRow() {
    var table = document.getElementById("user-goals-table");
    var row = table.getElementsByTagName('tbody')[0].insertRow();
    row.innerHTML = '<tr><td><select name="goal_type" id="goal_type" onchange="changeType(this)"><option value="Select Type">Select Type</option><option value="Running">Running</option><option value="Cycle">Cycle</option><option value="Body Weight">Body Weight</option><option value="Lifting">Lifting</option></select></td><td></td><td></td><td><button onclick="deleteRow(this)">Delete</button></td></tr>';
    return row;
}

function parseGoals() {
    var table = document.getElementById("user-goals-table");
    var goals = [];
    for (var i = 1; i < table.rows.length; i++) {
        const row = table.rows[i];
        const goalType = row.cells[0].children[0].selectedIndex - 1;
        if(goalType === -1) {
            continue;
        }
        if (goalType === 3) {
            var val1 = row.cells[1].children[0].selectedIndex;
        } else {
            var val1 = +row.cells[1].children[0].value;
        }
        if (goalType === 2) {
            var goal = {
                goalType: goalType,
                val1: val1
            };
            goals.push(goal);
            continue;
        } else if (goalType === 3) {
            var val2 = row.cells[2].children[0].value;
        } else {
            var val2 = + row.cells[2].children[0].value * 3600 + + row.cells[2].children[2].value * 60 + + row.cells[2].children[4].value;
        }
        var goal = {
            goalType: goalType,
            val1: val1,
            val2: val2
        };
        goals.push(goal);
    }
    return goals;
}

async function saveGoals() {
    const goals = parseGoals();
    const url = "/user/goals";
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(goals)
        });
        if (response.ok) {
            alert("Goals saved successfully");
        } else {
            console.error('Failed to save goals:', response.statusText);
        }
    } catch (error) {
        console.error("An error occurred while saving the goals:", error);
    }
}

function deleteRow(button) {
    var row = button.parentNode.parentNode;
    row.parentNode.removeChild(row);
}

function changeType(selector) {
    var row = selector.parentNode.parentNode;
    const cellData = selector.options[selector.selectedIndex].value;
    if (cellData === "Running") {
        row.cells[1].innerHTML = '<input type="number" value="0.0" min="0" max="999"></input><span style="margin-left:10px;">km</span>';
        row.cells[2].innerHTML = "<input id='h' name='h' type='number' min='0' max='23'> <label for='h'>h</label> <input id='m' name='m' type='number' min='0' max='59'> <label for='m'>m</label> <input id='s' name='s' type='number' min='0' max='59'> <label for='s'>s</label>";
        return;
    }
    if (cellData === "Cycle") {
        row.cells[1].innerHTML = '<input type="number" value="0.0" min="0" max="999"></input><span style="margin-left:10px;">km</span>';
        row.cells[2].innerHTML = "<input id='h' name='h' type='number' min='0' max='23'> <label for='h'>h</label> <input id='m' name='m' type='number' min='0' max='59'> <label for='m'>m</label> <input id='s' name='s' type='number' min='0' max='59'> <label for='s'>s</label>";
        return;
    }
    if (cellData === "Body Weight") {
        row.cells[1].innerHTML = '<input type="number" value="0.0" min="0" max="9999"></input><span style="margin-left:10px;">lbs</span>';
        row.cells[2].innerHTML = '<td></td>';
        return;
    }
    if (cellData === "Lifting") {
        row.cells[1].innerHTML = '<select name="lift" id="lift"><option value="Deadlift">Deadlift</option><option value="Squat">Squat</option><option value="Bench Press">Bench Press</option><option value="Shoulder Press">Shoulder Press</option><option value="Weighted Lunge">Shoulder Press</option></select>';
        row.cells[2].innerHTML = '<input type="number" value="0.0" min="0" max="9999"></input><span style="margin-left:10px;">lbs</span>';
        return;
    }
    if (cellData === "Select Type") {
        row.cells[1].innerHTML = '<td></td>';
        row.cells[2].innerHTML = '<td></td>';
        return;
    }
}

function getGoals() {
    const url = "/user/goals";
    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                console.error("Failed to get goals");
            }
        })
        .then(goals => {
            var table = document.getElementById("user-goals-table");
            table.children[1].innerHTML = "";
            goals.forEach(goal => {
                const goalType = +goal.goal_type;
                var row = addRow();
                row.cells[0].children[0].selectedIndex = goalType + 1;
                changeType(row.cells[0].children[0]);

                if (goalType <= 1) {
                    row.cells[1].innerHTML = '<input type="number" value="' + goal.distance + '" min="0" max="999"></input><span style="margin-left:10px;">km</span>';
                    let hours = Math.floor(goal.duration / 3600);
                    let minutes = Math.floor((goal.duration - 3600 * hours) / 60);
                    let seconds = goal.duration % 60;
                    row.cells[2].innerHTML = '<input id="h" name="h" type="number" value="' + hours + '" min="0" max="23"> <label for="h">h</label> <input id="m" name="m" type="number" value="' + minutes + '" min="0" max="59"> <label for="m">m</label> <input id="s" name="s" type="number" value="' + seconds + '" min="0" max="59"> <label for="s">s</label>';
                } else if (goalType === 2) {
                    row.cells[1].innerHTML = '<input type="number" value="' + goal.amount + '" min="0" max="9999"></input><span style="margin-left:10px;">lbs</span>';
                    row.cells[2].innerHTML = '<td></td>';
                } else {
                    row.cells[1].innerHTML = '<select name="lift" id="lift"><option value="Deadlift">Deadlift</option><option value="Squat">Squat</option><option value="Bench Press">Bench Press</option><option value="Shoulder Press">Shoulder Press</option><option value="Weighted Lunge">Shoulder Press</option></select>';
                    row.cells[1].children[0].selectedIndex = goal.lift_type;
                    row.cells[2].innerHTML = '<input type="number" value="' + goal.amount + '" min="0" max="9999"></input><span style="margin-left:10px;">lbs</span>';
                }
            });
        });
}