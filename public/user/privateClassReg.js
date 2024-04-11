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
            menu.innerHTML = '"<option value="Any">Any</option>"';
            trainer.forEach(activity => {
                const name = trainer.name;
                const id = trainer.id;
                menu.innerHTML += `<option value="${id}">${name}</option>`;
            });
        });
}
async function register() {
    const url = "/user/privateClassReg";
    const trainer = document.getElementById("trainer").value;
    const start = document.getElementById("start").value;
    const end = document.getElementById("end").value;
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({trainer: trainer, start: start, end: end})
        });
        if (response.ok) {
            alert("Class registered successfully");
        } else if (response.status === 299) {
            alert("Trainer not availible at that time");
        } else {
            console.error('Failed to register class:', response.statusText);
        }
    } catch (error) {
        console.error("An error occurred while registering the class:", error);
    }
}