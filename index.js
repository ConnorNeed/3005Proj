const express = require('express');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const pgSession = require('connect-pg-simple')(session);
const { Pool } = require('pg');
const path = require('path');
const { profile } = require('console');


const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'final_proj',
  password: '1902',
  port: 5432,
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
  try {
    const result = await pool.query('SELECT * FROM login WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user || !bcrypt.compareSync(password, user.password_hash)) {
      return done(null, false, { message: 'Incorrect email or password' });
    }

    return done(null, user);
  } catch (error) {
    return done(error);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const result = await pool.query('SELECT * FROM login WHERE id = $1', [id]);
    const user = result.rows[0];
    done(null, user);
  } catch (error) {
    done(error);
  }
});

app.post('/login', passport.authenticate('local', {
  successRedirect: '/dashboard',
  failureRedirect: '/login',
  failureFlash: false,
}));

app.post('/register', async (req, res) => {
  bcrypt.hash(req.body.password, 10, function (err, hash) {
    if (err) {
      console.error(err)
      res.status(500).send('Internal server error');
      return;
    }
    register(req.body.email, hash, req, res);
  });
});

app.get('/profile', async (req, res) => {
  if (!req.isAuthenticated()) {
    res.redirect('/login');
  }
  res.sendFile(path.join(__dirname, 'public', 'user', 'profile.html'));
});

app.get('/dashboard', async (req, res) => {
  if (!req.isAuthenticated()) {
    res.redirect('/login');
  }
  if (req.user.usertype === 1) {
    res.sendFile(path.join(__dirname, 'public', 'trainer', 'dashboard.html'));
    return;
  }
  if (req.user.usertype === 2) {
    res.sendFile(path.join(__dirname, 'public', 'admin', 'dashboard.html'));
    return;
  }
  res.sendFile(path.join(__dirname, 'public', 'user', 'dashboard.html'));
});

// profile page
app.get('/user/profile', async (req, res) => {
  if (!req.isAuthenticated()) {
    res.redirect('/login');
  }
  const userId = req.user.id;
  sendUserInfo(userId, res);
});

app.post('/profile', async (req, res) => {
  if (!req.isAuthenticated()) {
    res.redirect('/login');
  }
  const userId = req.user.id;
  const { fullName, age, bio, gender } = req.body;
  updateProfile(userId, fullName, age, gender, bio, res);
});

// goals page
app.post('/user/goals', async (req, res) => {
  if (!req.isAuthenticated()) {
    res.redirect('/login');
  }
  const userId = req.user.id;
  clearGoals(userId);
  saveGoals(userId, req.body);
  res.sendStatus(200);
});

app.get('/user/goals', async (req, res) => {
  if (!req.isAuthenticated()) {
    res.redirect('/login');
  }
  const userId = req.user.id;
  sendGoals(userId, res);
});

app.get('/goal', async (req, res) => {
  if (!req.isAuthenticated()) {
    res.redirect('/login');
  }
  res.sendFile(path.join(__dirname, 'public', 'user', 'userGoals.html'));
});

// activities page
app.get('/user/activities', async (req, res) => {
  if (!req.isAuthenticated()) {
    res.redirect('/login');
  }
  const userId = req.user.id;
  sendActivities(userId, res);
});
app.post('/user/addActivity', async (req, res) => {
  if (!req.isAuthenticated()) {
    res.redirect('/login');
  }
  const userId = req.user.id;
  saveActivity(userId, req.body);
  res.sendStatus(200);
});
app.post('/user/delActivity', async (req, res) => {
  if (!req.isAuthenticated()) {
    res.redirect('/login');
  }
  const userId = req.user.id;
  delActivity(userId, req.body);
  res.sendStatus(200);
});
app.get('/activity', async (req, res) => {
  if (!req.isAuthenticated()) {
    res.redirect('/login');
  }
  res.sendFile(path.join(__dirname, 'public', 'user', 'activities.html'));
});

// group classes page
app.get('/groupClassReg', async (req, res) => {
  if (!req.isAuthenticated()) {
    res.redirect('/login');
  }
  res.sendFile(path.join(__dirname, 'public', 'user', 'groupClasses.html'));
});
app.get('/user/availibleClasses', async (req, res) => {
  if (!req.isAuthenticated()) {
    res.redirect('/login');
  }
  sendAllGroupClasses(res);
});
app.get('/user/registeredClasses', async (req, res) => {
  if (!req.isAuthenticated()) {
    res.redirect('/login');
  }
  sendRegisteredGroupClasses(req.user.id, res);
});
app.post('/user/registerForClass', async (req, res) => {
  if (!req.isAuthenticated()) {
    res.redirect('/login');
  }
  registerForClass(req.user.id, req.body.class_id, res);
});
app.post('/user/deregisterForClass', async (req, res) => {
  if (!req.isAuthenticated()) {
    res.redirect('/login');
  }
  deregisterForClass(req.user.id, req.body.class_id, res);
});


// private class registration page
app.get('/privateClassReg', async (req, res) => {
  if (!req.isAuthenticated()) {
    res.redirect('/login');
  }
  res.sendFile(path.join(__dirname, 'public', 'user', 'privateClassReg.html'));
});
app.get('/user/trainers', async (req, res) => {
  if (!req.isAuthenticated()) {
    res.redirect('/login');
  }
  sendTrainers(res);
});
app.post('/user/privateClassReg', async (req, res) => {
  if (!req.isAuthenticated()) {
    res.redirect('/login');
  }
  const userId = req.user.id;
  addPrivateClass(userId, req.body.trainer, req.body.start, req.body.end, res);
});

// trainer pages
// schedule page
app.get('/trainer/schedule', async (req, res) => {
  if (!req.isAuthenticated()) {
    res.redirect('/login');
  }
  res.sendFile(path.join(__dirname, 'public', 'trainer', 'schedule.html'));
});
app.get('/trainer/getSchedule', async (req, res) => {
  if (!req.isAuthenticated()) {
    res.redirect('/login');
  }
  if (req.user.usertype != 1) {
    res.redirect('/dashboard');
  }
  sendSchedule(req.user.id, res);
});
app.post('/trainer/addavailability', async (req, res) => {
  if (!req.isAuthenticated()) {
    res.redirect('/login');
  }
  if (req.user.usertype != 1) {
    res.redirect('/dashboard');
  }
  saveavailability(req.user.id, req.body, res);
});
app.post('/trainer/deleteavailability', async (req, res) => {
  if (!req.isAuthenticated()) {
    res.redirect('/login');
  }
  if (req.user.usertype != 1) {
    res.redirect('/dashboard');
  }
  deleteavailability(req.body.id, res);
});

// group classes page
app.get('/schedule', async (req, res) => {
  if (!req.isAuthenticated()) {
    res.redirect('/login');
  }
  if (req.user.usertype != 1) {
    res.redirect('/dashboard');
  }
  res.sendFile(path.join(__dirname, 'public', 'trainer', 'schedule.html'));
});

// member search page
app.get('/trainer/memberSearch', async (req, res) => {
  if (!req.isAuthenticated()) {
    res.redirect('/login');
  }
  if (req.user.usertype != 1) {
    res.redirect('/dashboard');
  }
  res.sendFile(path.join(__dirname, 'public', 'trainer', 'memberSearch.html'));
});
app.post('/trainer/memberSearch', async (req, res) => {
  if (!req.isAuthenticated()) {
    res.redirect('/login');
  }
  if (req.user.usertype != 1) {
    res.redirect('/dashboard');
  }
  getMembersInfo(req.body.name, res);
});


// admin pages
// classes page
app.get('/admin/groupClasses', async (req, res) => {
  if (!req.isAuthenticated()) {
    res.redirect('/login');
  }
  if (req.user.usertype != 2) {
    res.redirect('/dashboard');
  }
  sendGroupClasses(res);
});
app.post('/admin/addGroupClass', async (req, res) => {
  if (!req.isAuthenticated()) {
    res.redirect('/login');
  }
  if (req.user.usertype != 2) {
    res.redirect('/dashboard');
  }
  saveGroupClass(req.body, res);
});
app.post('/admin/delGroupClass', async (req, res) => {
  if (!req.isAuthenticated()) {
    res.redirect('/login');
  }
  if (req.user.usertype != 2) {
    res.redirect('/dashboard');
  }
  delGroupClass(req.body, res);
});
app.get('/admin/classes', async (req, res) => {
  if (!req.isAuthenticated()) {
    res.redirect('/login');
  }
  if (req.user.usertype != 2) {
    res.redirect('/dashboard');
  }
  res.sendFile(path.join(__dirname, 'public', 'admin', 'classes.html'));
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

function goalTypeTableInfo(goalType) {
  switch (goalType) {
    case 0:
      return { goalTypeTableName: 'run_goals', val1Name: 'distance', val2Name: 'duration' };
    case 1:
      return { goalTypeTableName: 'cycle_goals', val1Name: 'distance', val2Name: 'duration' };
    case 2:
      return { goalTypeTableName: 'body_goals', val1Name: 'amount' };
    case 3:
      return { goalTypeTableName: 'lifting_goals', val1Name: 'lift_type', val2Name: 'amount' };
  }
}
function activityTypeTableInfo(activityType) {
  switch (activityType) {
    case 0:
      return { activityTypeTableName: 'runs', val1Name: 'distance', val2Name: 'duration' };
    case 1:
      return { activityTypeTableName: 'cycles', val1Name: 'distance', val2Name: 'duration' };
    case 2:
      return { activityTypeTableName: 'lifts', val1Name: 'lift_type', val2Name: 'amount' };
  }
}

//postgres functions
//General functions
function register(email, password, req, res) {
  pool.query('INSERT into login (email, password_hash, usertype) VALUES ($1, $2, 0) RETURNING *', [email, password], (error, result) => {
    if (error) {
      if (error.code == '23505') {
        res.status(500).send('Account already exists');
        return;
      }
      console.error('Error error creating user account:', error);
      res.status(500).send('Internal server error');
      return;
    } else {
      initProfile(result.rows[0].id, res);
      const user = result.rows[0];
      req.login(user, function (err) {
        if (!err) {
          res.redirect('/profile');
        } else {
          console.error(err);
          res.status(500).send('Internal server error');
          return;
        }
      });
    }
  });
}

function initProfile(id, res) {
  pool.query('INSERT into user_profiles (id) VALUES ($1)', [id], (error) => {
    if (error) {
      console.error('Error updating user profile:', error);
      res.status(500).send('Internal server error');
      return;
    }
  });
}

function updateProfile(id, fullName, age, gender, bio, res) {
  pool.query('UPDATE user_profiles SET full_name = $2, age = $3, bio = $4, gender = $5 WHERE id = $1', [id, fullName, age, bio, gender], (error) => {
    if (error) {
      console.error('Error updating user profile:', error);
      res.status(500).send('Internal server error');
      return;
    } else {
      res.sendStatus(200);
    }
  });
}

function sendUserInfo(user_id, res) {
  pool.query('SELECT user_profiles.full_name, user_profiles.age, user_profiles.gender, user_profiles.bio FROM login JOIN user_profiles ON login.id = user_profiles.id where login.id = $1', [user_id], (error, result) => {
    if (error) {
      console.error('Error fetching user profile:', error);
      res.status(500).send('Internal server error');
      return;
    } else {
      const profile = result.rows[0] || {};
      res.json(profile);
    }
  });
}


//member functions
//goal functions
function clearGoals(user_id) {
  pool.query('DELETE FROM user_goals WHERE user_id = $1', [user_id], (error) => {
    if (error) {
      console.error('Error clearing goals:', error);
      return;
    }
  });
}
function saveGoals(user_id, goals) {
  goals.forEach(goal => {
    var goalType = goal.goalType;
    var tableInfo = goalTypeTableInfo(goalType);
    pool.query('INSERT INTO user_goals (user_id, goal_type) VALUES ($1, $2) RETURNING goal_id', [user_id, goalType], (error, result) => {
      if (error) {
        console.error('Error saving goals:', error);
        return;
      } else {
        if (goalType == 2) {
          pool.query('INSERT INTO ' + tableInfo.goalTypeTableName + ' (user_goal_id, amount) VALUES ($1, $2)', [result.rows[0].goal_id, goal.val1], (error) => {
            if (error) {
              console.error('Error saving goals:', error);
              return;
            }
          });
        } else {
          pool.query('INSERT INTO ' + tableInfo.goalTypeTableName + ' (user_goal_id, ' + tableInfo.val1Name + ', ' + tableInfo.val2Name + ') VALUES ($1, $2, $3)', [result.rows[0].goal_id, goal.val1, goal.val2], (error) => {
            if (error) {
              console.error('Error saving goals:', error);
              return;
            }
          });
        }
      }
    });
  });
}
async function sendGoals(user_id, res) {
  var goals = [];
  for (var goalType = 0; goalType < 4; goalType++) {
    const tableInfo = goalTypeTableInfo(goalType);
    try {
    const result = await pool.query('SELECT * FROM user_goals JOIN ' + tableInfo.goalTypeTableName + ' ON user_goals.goal_id = ' + tableInfo.goalTypeTableName + '.user_goal_id WHERE user_goals.user_id = $1', [user_id]);
    goals = goals.concat(result.rows);
    } catch (error) {
      console.error('Error fetching user goals1:', error);
      res.status(500).send('Internal server error');
      return;
    }
  }
  res.json(goals);
}
//activity functions
async function sendActivities(user_id, res) {
  var activities = [];
  for (var activityType = 0; activityType < 3; activityType++) {
    const tableInfo = activityTypeTableInfo(activityType);
    try {
    const result = await pool.query('SELECT * FROM activities JOIN ' + tableInfo.activityTypeTableName + ' ON activities.activity_id = ' + tableInfo.activityTypeTableName + '.activity_id WHERE activities.user_id = $1', [user_id]);
    activities = activities.concat(result.rows);
    } catch (error) {
      console.error('Error fetching user activities:', error);
      res.status(500).send('Internal server error');
      return;
    }
  }
  res.json(activities);
}
function saveActivity(user_id, activity) {
  const activityType = activity.type;
  pool.query('INSERT INTO activities (user_id, activity_type) VALUES ($1, $2) RETURNING activity_id', [user_id, activityType], (error, result) => {
    if (error) {
      console.error('Error saving activities:', error);
      return;
    } else {
      const tableInfo = activityTypeTableInfo(activityType);
      const activityId = result.rows[0].activity_id;
      pool.query('INSERT INTO ' + tableInfo.activityTypeTableName + ' (activity_id, ' + tableInfo.val1Name + ', ' + tableInfo.val2Name + ') VALUES ($1, $2, $3)', [activityId, activity.value1, activity.value2], (error) => {
        if (error) {
          console.error('Error saving activities:', error);
          return;
        }
      });
    }
  });
}
function delActivity(user_id, activity) {
  const activityType = activity.type;
  const tableInfo = activityTypeTableInfo(activityType);
  pool.query('DELETE FROM activities USING ' + tableInfo.activityTypeTableName + ' WHERE activities.activity_id='+tableInfo.activityTypeTableName + '.activity_id AND activities.user_id = $1 AND activities.activity_type = $2 AND ' +tableInfo.activityTypeTableName + '.'+tableInfo.val1Name + ' = $3 AND '+tableInfo.activityTypeTableName + '.'+tableInfo.val2Name + '=$4', [user_id, activityType, activity.value1, activity.value2], (error) => {
    if (error) {
      console.error('Error deleting activities:', error);
      return;
    }
  });
}
//register group classes
async function sendAllGroupClasses(res) {
  var result = await pool.query("SELECT group_classes.class_id, class_type, start_time, end_time, class_difficulty, user_profiles.full_name AS name, rating FROM group_classes JOIN user_profiles ON group_classes.trainer_id = user_profiles.id JOIN trainers ON trainers.trainer_id = group_classes.trainer_id");
  res.json(result.rows);
}
async function sendRegisteredGroupClasses(user_id, res) {
  var result = await pool.query("SELECT group_classes.class_id, class_type, start_time, end_time, class_difficulty, user_profiles.full_name AS name, rating FROM group_classes JOIN user_profiles ON group_classes.trainer_id = user_profiles.id JOIN trainers ON trainers.trainer_id = group_classes.trainer_id JOIN class_members ON class_members.class_id = group_classes.class_id WHERE class_members.user_id = $1", [user_id]);
  res.json(result.rows);
}
async function registerForClass(user_id, class_id, res) {
  pool.query("INSERT INTO class_members (user_id, class_id) VALUES ($1, $2)", [user_id, class_id], (error) => {
    if (error) {
      if (error.code == '23505') {
        res.status(409).send('Already registered for class');
        return;
      }
      console.error('Error registering for class:', error);
      res.status(500).send('Internal server error');
      return;
    }
    res.sendStatus(200);
  });
}
async function deregisterForClass(user_id, class_id, res) {
  pool.query("DELETE FROM class_members WHERE user_id = $1 AND class_id = $2", [user_id, class_id], (error) => {
    if (error) {
      console.error('Error deregistering for class:', error);
      res.status(500).send('Internal server error');
      return;
    }
    res.sendStatus(200);
  });
}
// private class functions
function sendTrainers(res) {
  pool.query('SELECT id, user_profiles.full_name FROM trainers JOIN user_profiles ON user_profiles.id=trainers.trainer_id', (error, result) => {
    if (error) {
      console.error('Error fetching trainers:', error);
      res.status(500).send('Internal server error');
      return;
    }
    res.json(result.rows);
  });
}
async function registerPrivateClass(user_id, trainer_id, start, end, res) {
  var result = await pool.query('SELECT count(trainer_id) FROM trainer_availability WHERE trainer_id = $1 AND (start_time <= $2 AND end_time > $3)', [trainer_id, start, end]);
  if (result.rows[0].count == 0) {
    res.sendStatus(299);
    return;
  }
  result = await pool.query('SELECT count(trainer_id) FROM private_classes WHERE trainer_id = $1 AND (end_time > $2 AND start_time < $3)', [trainer_id, start, end]);
  var count = result.rows[0];
  result = await pool.query('SELECT count(trainer_id) FROM group_classes WHERE trainer_id = $1 AND (end_time > $2 AND start_time < $3)', [trainer_id, start, end]);
  count += result.rows[0];
  if (count > 0) {
    res.sendStatus(299);
    return;
  }
  
  pool.query('INSERT INTO private_classes (user_id, trainer_id, start_time, end_time) VALUES ($1, $2, $3, $4)', [user_id, trainer_id, start, end], (error) => {
    if (error) {
      console.error('Error saving private class:', error);
      res.status(500).send('Internal server error');
      return;
    }
    res.sendStatus(200);
  });
}


//trainer functions
//availability functions
function saveavailability(user_id, slot, res) {
  pool.query('INSERT INTO trainer_availability (trainer_id, start_time, end_time) VALUES ($1, $2, $3)', [user_id, slot.start, slot.end], (error) => {
    if (error) {
      console.error('Error saving group class:', error);
      res.status(500).send('Internal server error');
      return;
    }
    res.sendStatus(200);
  });
}
function deleteavailability(slotId, res) {
  pool.query('DELETE FROM trainer_availability WHERE availability_id = $1', [slotId], (error) => {
    if (error) {
      console.error('Error deleting group class:', error);
      res.status(500).send('Internal server error');
      return;
    }
    res.sendStatus(200);
  });
}
async function sendSchedule(user_id, res) {
  var availability = await pool.query('SELECT * FROM trainer_availability WHERE trainer_id = $1 ORDER BY start_time', [user_id]);
  var privateClasses = await pool.query('SELECT start_time, end_time, user_profiles.full_name AS name FROM private_classes JOIN user_profiles ON private_classes.user_id = user_profiles.id WHERE trainer_id = $1 ORDER BY start_time', [user_id]);
  var groupClasses = await pool.query('SELECT class_type, start_time, end_time, class_difficulty, COUNT(class_members.user_id) AS member_count FROM group_classes LEFT JOIN class_members ON class_members.class_id=group_classes.class_id WHERE trainer_id = $1 GROUP BY class_members.class_id, class_type, start_time, end_time, class_difficulty ORDER BY start_time', [user_id]);
  res.json({availability: availability.rows, privateClasses: privateClasses.rows, groupClasses: groupClasses.rows});
}

//trainer search functions
async function getMembersInfo(name, res){
  const result = await pool.query('SELECT login.id AS id, full_name, email, bio, age, gender FROM user_profiles JOIN login ON user_profiles.id=login.id WHERE full_name = $1', [name]);
  var members = [];
  var user_id;
  for (var i = 0; i < result.rows.length; i++) {
    var member = {profile:null, goals:null, activities:null};
    user_id = result.rows[i].id;
    member.profile = result.rows[i];
    member.goals = await getGoals(user_id);
    member.activities = await getActivities(user_id);
    members.push(member);
  }
  res.json(members);
}
async function getGoals(user_id) {
  var goals = [];
  for (var goalType = 0; goalType < 4; goalType++) {
    const tableInfo = goalTypeTableInfo(goalType);
    const result = await pool.query('SELECT * FROM user_goals JOIN ' + tableInfo.goalTypeTableName + ' ON user_goals.goal_id = ' + tableInfo.goalTypeTableName + '.user_goal_id WHERE user_goals.user_id = $1', [user_id]);
    goals = goals.concat(result.rows);
  }
  return goals;
}
async function getActivities(user_id) {
  var activities = [];
  for (var activityType = 0; activityType < 3; activityType++) {
    const tableInfo = activityTypeTableInfo(activityType);
    const result = await pool.query('SELECT * FROM activities JOIN ' + tableInfo.activityTypeTableName + ' ON activities.activity_id = ' + tableInfo.activityTypeTableName + '.activity_id WHERE activities.user_id = $1', [user_id]);
    activities = activities.concat(result.rows);
  }
  return activities;
}



// admin functions
function sendGroupClasses(res) {
  pool.query('SELECT user_profiles.full_name, class_id, class_type, start_time, end_time, class_difficulty FROM group_classes JOIN user_profiles ON user_profiles.id = group_classes.trainer_id', (error, result) => {
    if (error) {
      console.error('Error fetching group classes:', error);
      res.status(500).send('Internal server error');
      return;
    } else {
      res.json(result.rows);
    }
  });
}
function saveGroupClass(groupClass, res) {
  pool.query('INSERT INTO group_classes (trainer_id, class_type, start_time, end_time, class_difficulty) VALUES ($1, $2, $3, $4, $5)', [groupClass.trainer, groupClass.type, groupClass.start, groupClass.end, groupClass.difficulty], (error) => {
    if (error) {
      console.error('Error saving group class:', error);
      res.status(500).send('Internal server error');
      return;
    }
    res.sendStatus(200);
  });
}
function delGroupClass(groupClass, res) {
  pool.query('DELETE FROM group_classes WHERE class_id = $1', [groupClass.id], (error) => {
    if (error) {
      console.error('Error deleting group class:', error);
      res.status(500).send('Internal server error');
      return;
    }
    res.sendStatus(200);
  });
}