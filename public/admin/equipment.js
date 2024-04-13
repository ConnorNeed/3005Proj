window.onload = refresh;

function refresh() {
    var table = document.getElementById("admin-equipment-table");
    table.children[1].innerHTML = "";
    getWorkOrders();
    getEquipment();
}

function getWorkOrders() {
    const url = "/admin/workOrders";
    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                console.error("Failed to get work orders");
            }
        })
        .then(orders => {
            var table = document.getElementById("admin-equipment-table");
            table.children[1].innerHTML = "";
            orders.forEach(o => {
                console.log(o);
                var row = table.children[1].insertRow();
                row.insertCell().appendChild(document.createTextNode(o.work_order_id));
                row.insertCell().appendChild(document.createTextNode(o.equipment_name));
                row.insertCell().appendChild(document.createTextNode(o.problem_description));
                row.insertCell().appendChild(document.createTextNode(o.reported_by));
                row.insertCell().innerHTML = `<button onclick='completeWorkOrder(${o.work_order_id})'>Complete</button>`;
            });
        });
}

function addWorkOrder() {
    const form = document.getElementById("add-workorder");
    const selector = form.children[0];
    const equipment = selector.options[selector.selectedIndex].value;
    const description = form.children[1].value;
    if (equipment === "None") {
        alert("Please select an equipment");
        return;
    }
    sendWorkOrder(equipment, description);
}

function sendWorkOrder(equipment, description) {
    const url = "/admin/equipment";
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({equipment: equipment, description: description})
    })
        .then(response => {
            if (response.ok) {
                alert("Work order added");
                //refresh();
            } else {
                console.error('Failed to add work order:', response.statusText);
            }
        });
}

function getEquipment(){
    const url = "/admin/equipmentList";
    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                console.error("Failed to get equipment");
            }
        })
        .then(equipment => {
            const menu = document.getElementById("equipment-menu");
            menu.innerHTML = '"<option value="None">Select Equipment...</option>"';
            equipment.forEach(e => {
                const id = e.equipment_id;
                const name = e.equipment_name;
                menu.innerHTML += `<option value="${id}">${name}</option>`;
            });
        });
}

function completeWorkOrder(id){
    const url = "/admin/completeWorkOrder";
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({order_id: id})
    })
        .then(response => {
            if (response.ok) {
                alert("Work order completed");
                refresh();
            } else {
                console.error('Failed to complete work order:', response.statusText);
            }
        });
}