document.getElementById("updateProfileButton").addEventListener ("click", updateProfile, false);

window.onload = async function() {
  try {
    const response = await fetch('/user/profile');
    if (response.ok) {
      const profile = await response.json();
      console.log(profile);
      document.getElementById('fullName').value = profile.full_name || '';
      document.getElementById('age').value = profile.age || '';
      document.getElementById('bio').value = profile.bio || '';
      document.getElementById('gender').selectedIndex = profile.gender || 0;
    } else {
      console.error('Error fetching user profile:', response.statusText);
    }
  } catch (error) {
    console.error('Error fetching user profile:', error);
  }
}

async function updateProfile() {
  const fullName = document.getElementById('fullName').value;
  const age = document.getElementById('age').value;
  const bio = document.getElementById('bio').value;
  const gender = document.getElementById('gender').selectedIndex;

  if(!fullName || !age || !bio || !gender) {
    alert('Please fill out all fields');
    return;
  }

  try {
    const response = await fetch('/profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ fullName, age, bio, gender })
    });
    if (response.ok) {
      alert('Profile updated successfully');
    } else {
      console.error('Error updating user profile:', response.statusText);
    }
  } catch (error) {
    console.error('Error updating user profile:', error);
  }
}
  