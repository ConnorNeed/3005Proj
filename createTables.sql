
CREATE TABLE login (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    usertype SMALLINT
);

CREATE TABLE user_profiles (
    id INT UNIQUE REFERENCES login (id) ON DELETE CASCADE,
    full_name VARCHAR(255),
    bio VARCHAR(255),
    age INT,
    gender SMALLINT
);

CREATE TABLE user_goals (
    goal_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES user_profiles (id) ON DELETE CASCADE,
    goal_type SMALLINT
);

CREATE TABLE run_goals (
    run_goal_id SERIAL PRIMARY KEY,
    user_goal_id INT REFERENCES user_goals (goal_id) ON DELETE CASCADE,
    distance INT,
    duration INT
);

CREATE TABLE cycle_goals (
    run_goal_id SERIAL PRIMARY KEY,
    user_goal_id INT REFERENCES user_goals (goal_id) ON DELETE CASCADE,
    distance INT,
    duration INT
);

CREATE TABLE body_goals (
    body_goal_id SERIAL PRIMARY KEY,
    user_goal_id INT REFERENCES user_goals (goal_id) ON DELETE CASCADE,
    amount INT
);
CREATE TABLE lifting_goals (
    lift_goal_id SERIAL PRIMARY KEY,
    user_goal_id INT REFERENCES user_goals (goal_id) ON DELETE CASCADE,
    lift_type INT,
    amount INT
);
CREATE TABLE activities (
    activity_id SERIAL PRIMARY KEY,
    user_id INT,
    activity_type SMALLINT
);
CREATE TABLE runs (
    run_activity_id SERIAL PRIMARY KEY,
    activity_id INT REFERENCES activities (activity_id) ON DELETE CASCADE,
    distance INT,
    duration INT
);
CREATE TABLE cycles (
    cycle_activity_id SERIAL PRIMARY KEY,
    activity_id INT REFERENCES activities (activity_id) ON DELETE CASCADE,
    distance INT,
    duration INT
);
CREATE TABLE lifts (
    lift_activity_id SERIAL PRIMARY KEY,
    activity_id INT REFERENCES activities (activity_id) ON DELETE CASCADE,
    lift_type INT,
    amount INT
);

CREATE TABLE trainers (
    trainer_id INT UNIQUE REFERENCES login (id) ON DELETE CASCADE,
    rating INT
);

CREATE TABLE group_classes (
    class_id SERIAL PRIMARY KEY,
    trainer_id INT REFERENCES trainers (trainer_id) ON DELETE CASCADE,
    class_type SMALLINT,
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    class_difficulty SMALLINT
);

CREATE TABLE trainer_availability (
    availability_id SERIAL PRIMARY KEY,
    trainer_id INT REFERENCES trainers (trainer_id) ON DELETE CASCADE,
    start_time TIMESTAMP,
    end_time TIMESTAMP
);

CREATE TABLE class_members (
    class_id INT REFERENCES group_classes (class_id) ON DELETE CASCADE,
    user_id INT REFERENCES user_profiles (id) ON DELETE CASCADE
    PRIMARY KEY (class_id, user_id)
);

CREATE TABLE private_classes (
    private_class_id SERIAL PRIMARY KEY,
    trainer_id INT REFERENCES trainers (trainer_id) ON DELETE CASCADE,
    user_id INT REFERENCES user_profiles (id) ON DELETE CASCADE,
    start_time TIMESTAMP,
    end_time TIMESTAMP
);
