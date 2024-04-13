window.onload = refresh;
function refresh() {
    var table = document.getElementById("admin-roomBookings-table");
    table.children[1].innerHTML = "";
    getRoomBookings();
    getRooms();
    getUsers();
}

function getRooms() {
    const url = "/admin/roomList";
    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                console.error("Failed to get rooms");
            }
        })
        .then(rooms => {
            const menu = document.getElementById("room-menu");
            menu.innerHTML = '"<option value="None">Select Room...</option>"';
            rooms.forEach(r => {
                const id = r.room_id;
                const name = r.room_name;
                menu.innerHTML += `<option value="${id}">${name}</option>`;
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
    var selector = form.children[0];
    const userId = selector.options[selector.selectedIndex].value;
    selector = form.children[1];
    const room = selector.options[selector.selectedIndex].value;
    const start = form.children[2].value;
    const end = form.children[3].value;
    if (userId === "None") {
        alert("Please select a user");
        return;
    }
    if (room === "None") {
        alert("Please select a room");
        return;
    }
    if (start > end) {
        alert("Start time must be before end time");
        return;
    }
    bookRoom(room, userId, start, end);
}

function bookRoom(room, userId, start, end) {
    const url = "/admin/bookRoom";
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({room: room, user: userId, start: start, end: end})
    })
        .then(response => {
            if (response.status === 299) {
                alert("Room already booked");
                return;
            }
            if (response.ok) {
                alert("Room booked");
                refresh();
            } else {
                console.error('Failed to book room:', response.statusText);
            }
        });
}

function getRoomBookings() {
    const url = "/admin/roomBookings";
    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                console.error("Failed to get room bookings");
            }
        })
        .then(bookings => {
            var table = document.getElementById("admin-roomBookings-table");
            table.children[1].innerHTML = "";
            bookings.forEach(b => {
                console.log(b);
                var row = table.children[1].insertRow();
                row.insertCell().appendChild(document.createTextNode(b.reservation_id));
                row.insertCell().appendChild(document.createTextNode(b.room_name));
                row.insertCell().appendChild(document.createTextNode(b.booked_by));
                row.insertCell().appendChild(document.createTextNode(b.start_time));
                row.insertCell().appendChild(document.createTextNode(b.end_time));
                row.insertCell().innerHTML = `<button onclick='cancel(${b.reservation_id})'>Cancel</button>`;
            });
        });
}

function cancel(booking_id) {
    const url = "/admin/cancelBooking";
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({booking_id: booking_id})
    })
        .then(response => {
            if (response.ok) {
                alert("Booking cancelled");
                refresh();
            } else {
                console.error('Failed to cancel booking:', response.statusText);
            }
        });
}