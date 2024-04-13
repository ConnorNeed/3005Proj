window.onload = function() {
    getPayments();
}

function getPayments() {
    const url = "/admin/outstandingPayments";
    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                console.error("Failed to get payments");
            }
        })
        .then(payments => {
            var table = document.getElementById("admin-payment-table");
            table.children[1].innerHTML = "";
            payments.forEach(p => {
                var row = table.children[1].insertRow();
                row.insertCell().appendChild(document.createTextNode(p.invoice_id));
                row.insertCell().appendChild(document.createTextNode(p.full_name));
                row.insertCell().appendChild(document.createTextNode(p.amount));
                row.insertCell().innerHTML = `<button onclick='pay(${p.invoice_id})'>Pay</button>`;
            });
        });
}

async function pay(invoice_id) {
    const url = "/admin/pay";
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({invoice_id: invoice_id})
        });
        if (response.ok) {
            alert("Payment successful");
            getPayments();
        } else {
            console.error('Failed to pay invoice:', response.statusText);
        }
    } catch (error) {
        console.error("An error occurred while paying the invoice:", error);
    }
}