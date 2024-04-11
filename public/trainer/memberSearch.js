document.getElementById("search-button").addEventListener ("click", search, false);

async function search() {
    const name = document.getElementById("search").value;
    const url = "/trainer/memberSearch";
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({name: name})
        });
        if (!response.ok) {
            console.error('Failed to search for members:', response.statusText);
            return;
        } else {
            const members = await response.json();
            if (members.length === 0) {
                alert("No members found");
                return;
            }
            var membersDisplay = document.getElementById("members");
            membersDisplay.innerHTML = "";
            members.forEach(member => {
                console.log(member);
                addProfile(membersDisplay, member.profile);
                addGoals(membersDisplay, member.goals);
                addActivities(membersDisplay, member.activities);
            });
        }
    } catch (error) {
        console.error("An error occurred while searching for members:", error);
    }
}

function addProfile(display, profile){
    display.innerHTML += '<div class="profile">';
    display.innerHTML += `<h3>Name: ${profile.full_name}</h3>`;
    display.innerHTML += `<p>Email: ${profile.email}</p>`;
    display.innerHTML += `<p>Age: ${profile.age}</p>`;
    display.innerHTML += `<p>Gender: ${profile.gender}</p>`;
    display.innerHTML += `<p>Bio: ${profile.bio}</p>`
    display.innerHTML += '</div>';
}

function addGoals(display, goals){
    display.innerHTML += '<div class="goals">';
    display.innerHTML += `<b>Goals:</b>`;
    goals.forEach(goal => {
        const goalType = +goal.goal_type;
        if(goalType === 0) {
            var h = Math.floor(goal.duration / 3600);
            var m = Math.floor((goal.duration - 3600 * h) / 60);
            var s = goal.duration % 60;
            display.innerHTML += `<p>Run ${goal.distance} miles in ${h}:${m}:${s}</p>`;
        } else if(goalType === 1) {
            var h = Math.floor(goal.duration / 3600);
            var m = Math.floor((goal.duration - 3600 * h) / 60);
            var s = goal.duration % 60;
            display.innerHTML += `<p>Cycle ${goal.distance} miles in ${h}:${m}:${s}</p>`;
        } else if(goalType === 2) {
            const liftType = getLiftTypeString(goal.lift_type);
            display.innerHTML += `<p>Lift ${goal.amount} pounds (${liftType})</p>`;
        } else if(goalType === 3) {
            display.innerHTML += `<p>Weight ${goal.amount} pounds</p>`;
        } else {
            console.error("Invalid goal type");
        }
        display.innerHTML += `<br>`;
    });
    display.innerHTML += '</div>';
}

function addActivities(display, activities){
    display.innerHTML += '<div class="activities">';
    display.innerHTML += `<b>Activities:</b>`;
    activities.forEach(activity => {
        const type = +activity.activity_type;
        if(type === 0) {
            var h = Math.floor(activity.duration / 3600);
            var m = Math.floor((activity.duration - 3600 * h) / 60);
            var s = activity.duration % 60;
            display.innerHTML += `<p>Ran ${activity.distance} miles in ${h}:${m}:${s}</p>`;
        } else if(type === 1) {
            var h = Math.floor(activity.duration / 3600);
            var m = Math.floor((activity.duration - 3600 * h) / 60);
            var s = activity.duration % 60;
            display.innerHTML += `<p>Cycled ${activity.distance} miles in ${h}:${m}:${s}</p>`;
        } else if(type === 2) {
            const liftType = getLiftTypeString(activity.lift_type);
            display.innerHTML += `<p>Lifted ${activity.amount} pounds (${liftType})</p>`;
        } else {
            console.error("Invalid activity type");
        }
        display.innerHTML += `<br>`;
    });
}

function getLiftTypeString(type) {
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