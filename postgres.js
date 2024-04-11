
function register (email, password, res, successFunc) {
    pool.query('INSERT into login (email, password_hash, userType) VALUES ($1, $2, 0) RETURNING *', [email, password], (error, result) => {
        if (error) {
          console.error('Error updating user profile:', error);
          res.status(500).send('Internal server error');
        } else {
          addProfile(result[0], res);
          successFunc(result);
        }
      });
}

function addProfile (id, res) {
  pool.query('INSERT into user_profiles (id) VALUES ($1)', [id], (error) => {
    if (error) {
      console.error('Error updating user profile:', error);
      res.status(500).send('Internal server error');
    }
  });
}

function sendUserInfo (user_id, res) {
  pool.query('SELECT email userType age gender FROM user_profiles JOIN login WHERE user_id = $1', [user_id], (error, result) => {
    if (error) {
      console.error('Error fetching user profile:', error);
      res.status(500).send('Internal server error');
    } else {
      const profile = result.rows[0] || {};
      res.json(profile);
    }
  });
}