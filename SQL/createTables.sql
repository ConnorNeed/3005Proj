CREATE TABLE "session" (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL
) WITH (OIDS=FALSE);
ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;
CREATE INDEX "IDX_session_expire" ON "session" ("expire");

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
    gender SMALLINT,
    PRIMARY KEY (id)
);

CREATE TABLE user_goals (
    goal_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES user_profiles (id) ON DELETE CASCADE,
    goal_type SMALLINT
);

CREATE TABLE run_goals (
    user_goal_id INT REFERENCES user_goals (goal_id) ON DELETE CASCADE,
    distance INT,
    duration INT,
    PRIMARY KEY (user_goal_id)
);

CREATE TABLE cycle_goals (
    user_goal_id INT REFERENCES user_goals (goal_id) ON DELETE CASCADE,
    distance INT,
    duration INT,
    PRIMARY KEY (user_goal_id)
);

CREATE TABLE body_goals (
    user_goal_id INT REFERENCES user_goals (goal_id) ON DELETE CASCADE,
    amount INT,
    PRIMARY KEY (user_goal_id)
);
CREATE TABLE lifting_goals (
    user_goal_id INT REFERENCES user_goals (goal_id) ON DELETE CASCADE,
    lift_type INT,
    amount INT,
    PRIMARY KEY (user_goal_id)
);

CREATE TABLE activities (
    activity_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES user_profiles (id) ON DELETE CASCADE,
    activity_type SMALLINT
);
CREATE TABLE runs (
    activity_id INT REFERENCES activities (activity_id) ON DELETE CASCADE,
    distance INT,
    duration INT,
    PRIMARY KEY (activity_id)
);
CREATE TABLE cycles (
    activity_id INT REFERENCES activities (activity_id) ON DELETE CASCADE,
    distance INT,
    duration INT,
    PRIMARY KEY (activity_id)
);
CREATE TABLE lifts (
    activity_id INT REFERENCES activities (activity_id) ON DELETE CASCADE,
    lift_type INT,
    amount INT,
    PRIMARY KEY (activity_id)
);

CREATE TABLE trainers (
    trainer_id INT UNIQUE REFERENCES login (id) ON DELETE CASCADE,
    rating INT,
    PRIMARY KEY (trainer_id)
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
    user_id INT REFERENCES user_profiles (id) ON DELETE CASCADE,
    PRIMARY KEY (class_id, user_id)
);

CREATE TABLE private_classes (
    private_class_id SERIAL PRIMARY KEY,
    trainer_id INT REFERENCES trainers (trainer_id) ON DELETE CASCADE,
    user_id INT REFERENCES user_profiles (id) ON DELETE CASCADE,
    start_time TIMESTAMP,
    end_time TIMESTAMP
);

CREATE TABLE admins (
    admin_id INT UNIQUE REFERENCES login (id) ON DELETE CASCADE,
    full_name VARCHAR(255),
    PRIMARY KEY (admin_id)
);

CREATE TABLE priceList (
    item_id SERIAL PRIMARY KEY,
    item_name VARCHAR(255),
    price INT
);

CREATE TABLE invoices (
    invoice_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES user_profiles (id),
    admin_id INT REFERENCES admins (admin_id)
);
CREATE TABLE transactions (
    invoice_id INT REFERENCES invoices (invoice_id),
    admin_id INT REFERENCES admins (admin_id),
    PRIMARY KEY (invoice_id)
);
CREATE TABLE invoice_items (
    invoice_id INT REFERENCES invoices (invoice_id),
    item_id INT REFERENCES priceList (item_id),
    quantity INT
);

CREATE TABLE equipment (
    equipment_id SERIAL PRIMARY KEY,
    equipment_name VARCHAR(255)
);

CREATE TABLE work_orders (
    work_order_id SERIAL PRIMARY KEY,
    equipment_id INT REFERENCES equipment (equipment_id),
    problem_description VARCHAR(255),
    reported_by INT REFERENCES admins (admin_id),
    completed BOOLEAN
);

CREATE TABLE rooms (
    room_id SERIAL PRIMARY KEY,
    room_name VARCHAR(255),
    room_capacity INT
);

CREATE TABLE room_reservations (
    reservation_id SERIAL PRIMARY KEY,
    room_id INT REFERENCES rooms (room_id),
    user_id INT REFERENCES user_profiles (id),
    start_time TIMESTAMP,
    end_time TIMESTAMP
);
