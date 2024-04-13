var items = [];
window.onload = refresh;

function refresh () {
    var table = document.getElementById("admin-invoice-table");
    table.children[1].innerHTML = "";
    items = [];
    getItems();
    getUsers();
}

function getItems() {
    const url = "/admin/items";
    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                console.error("Failed to get items");
            }
        })
        .then(items => {
            const menu = document.getElementById("item-menu");
            menu.innerHTML = '"<option value="None">Select Item...</option>"';
            items.forEach(item => {
                const name = item.item_name;
                const id = item.item_id;
                const price = item.price;
                menu.innerHTML += `<option value="${id}" data="${price}">${name}</option>`;
            });
        });
}

function getUsers() {
    const url = "/admin/users";
    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                console.error("Failed to get users");
            }
        })
        .then(users => {
            const menu = document.getElementById("user-menu");
            menu.innerHTML = '"<option value="None">Select User...</option>"';
            users.forEach(user => {
                const name = user.full_name;
                const id = user.id;
                menu.innerHTML += `<option value="${id}">${name}</option>`;
            });
        });
}

function addRow() {
    const form = document.getElementById("add-form");
    const selector = form.children[0];
    const item = selector.options[selector.selectedIndex].value;
    const name = selector.options[selector.selectedIndex].text;
    const quantity = form.children[1].value;
    const price = selector.options[selector.selectedIndex].getAttribute("data");
    if (item === "None") {
        alert("Please select a item");
        return;
    }
    addToTable(item, name, quantity, items.length, price);
    items.push({id: item, name: name, quantity: quantity});
}

function addToTable(id, name, quantity, index, price) {
    var row = document.getElementById("table-body").insertRow();
    row.innerHTML = `<tr><td>${id}</td><td>${name}</td><td>${quantity}</td><td>${price}</td><td>${price*quantity}</td><td><button onclick="deleteRow(this, ${index})">Delete</button></td></tr>`;
}

async function createInvoice() {
    const url = "/admin/invoice";
    const user = document.getElementById("user-menu").value;
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({items:items, user:user})
        });
        if (response.ok) {
            alert("Invoice created successfully");
            refresh();
        } else {
            console.error('Failed to create invoice:', response.statusText);
        }
    } catch (error) {
        console.error("An error occurred while creating the invoice:", error);
    }
}

async function deleteRow(button, index) {
    row = button.parentNode.parentNode;
    items.splice(index, 1);
    row.parentNode.removeChild(row);
}