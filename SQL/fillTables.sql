-- All passwords are 1234
INSERT INTO 'login' (email, password_hash, user_type) VALUES ('admin', '$2a$10$T5/j7u4bUiVTJNP1omeSQujDjfzgWgs3AOGvRRpmXvVWM2ZJEM.tS', 2);
INSERT INTO 'login' (email, password_hash, user_type) VALUES ('member', '$2a$10$l2uKlkotW1D/7JBO7VpEyeup84dm9wB70UYB/gRcS38Nt6qOrHBzC', 0);
INSERT INTO 'login' (email, password_hash, user_type) VALUES ('trainer', '$2a$10$w6B3bQQO.BQuepIlJ76Qc.1DUoJd9KUxKctDt25TSOx.A49WZckFK', 1);

INSERT INTO user_profiles (id, full_name, bio, age, gender) VALUES (2, 'Member', 'I want to get ripped', 25, 0);
INSERT INTO user_profiles (id, full_name, bio, age, gender) VALUES (3, 'Trainer', 'I will get you ripped', 35, 1);

INSERT INTO user_goals (user_id, goal_type) VALUES (2, 0);
INSERT INTO run_goals (user_goal_id, distance, duration) VALUES (1, 5, 30);

INSERT INTO user_goals (user_id, goal_type) VALUES (2, 1);
INSERT INTO cycle_goals (user_goal_id, distance, duration) VALUES (2, 10, 45);

INSERT INTO user_goals (user_id, goal_type) VALUES (2, 2);
INSERT INTO body_goals (user_goal_id, amount) VALUES (3, 180);

INSERT INTO user_goals (user_id, goal_type) VALUES (2, 3);
INSERT INTO lifting_goals (user_goal_id, lift_type, amount) VALUES (4, 0, 200);

INSERT INTO user_goals (user_id, goal_type) VALUES (2, 3);
INSERT INTO lifting_goals (user_goal_id, lift_type, amount) VALUES (5, 1, 200);

INSERT INTO activities (user_id, activity_type) VALUES (2, 0);
INSERT INTO runs (activity_id, distance, duration) VALUES (1, 5, 30);

INSERT INTO activities (user_id, activity_type) VALUES (2, 1);
INSERT INTO cycles (activity_id, distance, duration) VALUES (2, 10, 45);

INSERT INTO activities (user_id, activity_type) VALUES (2, 2);
INSERT INTO lifts (activity_id, lift_type, amount) VALUES (3, 0, 200);

INSERT INTO activities (user_id, activity_type) VALUES (2, 2);
INSERT INTO lifts (activity_id, lift_type, amount) VALUES (4, 1, 200);

INSERT INTO trainers (trainer_id, rating) VALUES (3, 9);

INSERT INTO group_classes (trainer_id, class_type, start_time, end_time) VALUES (3, 0, '2024-04-01 10:00:00', '2024-04-01 11:00:00');
INSERT INTO group_classes (trainer_id, class_type, start_time, end_time) VALUES (3, 1, '2024-04-01 12:00:00', '2024-04-01 13:00:00');

INSERT INTO trainer_availability (trainer_id, start_time, end_time) VALUES (3, '2024-04-01 10:00:00', '2024-04-01 16:00:00');
INSERT INTO trainer_availability (trainer_id, start_time, end_time) VALUES (3, '2024-04-02 09:00:00', '2024-04-02 21:00:00');
INSERT INTO trainer_availability (trainer_id, start_time, end_time) VALUES (3, '2024-04-03 09:00:00', '2024-04-03 21:00:00');
INSERT INTO trainer_availability (trainer_id, start_time, end_time) VALUES (3, '2024-04-04 09:00:00', '2024-04-04 21:00:00');
INSERT INTO trainer_availability (trainer_id, start_time, end_time) VALUES (3, '2024-04-05 09:00:00', '2024-04-05 21:00:00');

INSERT INTO class_members (class_id, user_id) VALUES (1, 2);

INSERT INTO private_classes (trainer_id, user_id, start_time, end_time) VALUES (3, 2, '2024-04-02 14:00:00', '2024-04-02 15:00:00');

INSERT INTO admins (admin_id, full_name) VALUES (1, 'Admin');

INSERT INTO priceList (item_name, price) VALUES ('Group Class', 10);
INSERT INTO priceList (item_name, price) VALUES ('Private Class', 50);
INSERT INTO priceList (item_name, price) VALUES ('Monthly Membership', 25);
INSERT INTO priceList (item_name, price) VALUES ('Monthly Free Group Class', 0);
INSERT INTO priceList (item_name, price) VALUES ('Monthly Free Private Class', 0);
INSERT INTO priceList (item_name, price) VALUES ('Water Bottle', 2);
INSERT INTO priceList (item_name, price) VALUES ('Protein Bar', 3);
INSERT INTO priceList (item_name, price) VALUES ('Protein Shake', 5);
INSERT INTO priceList (item_name, price) VALUES ('T-Shirt', 10);
INSERT INTO priceList (item_name, price) VALUES ('Sweatpants', 15);
INSERT INTO priceList (item_name, price) VALUES ('Sweatshirt', 20);
INSERT INTO priceList (item_name, price) VALUES ('Sneakers', 50);

INSERT INTO equipment (equipment_name) VALUES ('Treadmill');
INSERT INTO equipment (equipment_name) VALUES ('Elliptical');
INSERT INTO equipment (equipment_name) VALUES ('Stationary Bike');
INSERT INTO equipment (equipment_name) VALUES ('Rowing Machine');
INSERT INTO equipment (equipment_name) VALUES ('Weight Machines');

INSERT INTO rooms (room_name, room_capacity) VALUES ('Main Room', 10);
INSERT INTO rooms (room_name, room_capacity) VALUES ('Weight Room', 20);
INSERT INTO rooms (room_name, room_capacity) VALUES ('Cardio Room', 15);
INSERT INTO rooms (room_name, room_capacity) VALUES ('Room 1', 30);
INSERT INTO rooms (room_name, room_capacity) VALUES ('Room 2', 5);
INSERT INTO rooms (room_name, room_capacity) VALUES ('Room 3', 10);

INSERT INTO invoices (user_id, admin_id) VALUES (2, 1);
INSERT INTO invoices (user_id, admin_id) VALUES (2, 1);

INSERT INTO invoice_items (invoice_id, item_id, quantity) VALUES (1, 1, 2);
INSERT INTO invoice_items (invoice_id, item_id, quantity) VALUES (1, 2, 1);
INSERT INTO invoice_items (invoice_id, item_id, quantity) VALUES (1, 3, 1);

INSERT INTO invoice_items (invoice_id, item_id, quantity) VALUES (2, 4, 1);
INSERT INTO invoice_items (invoice_id, item_id, quantity) VALUES (2, 5, 2);

INSERT INTO transactions (invoice_id, admin_id) VALUES (1, 1);

INSERT INTO work_orders (equipment_id, problem_description, reported_by, completed) VALUES (1, 'Broken', 1, FALSE);
INSERT INTO work_orders (equipment_id, problem_description, reported_by, completed) VALUES (2, 'Broken', 1, FALSE);

INSERT INTO room_reservations (room_id, user_id, start_time, end_time) VALUES (1, 2, '2024-04-01 10:00:00', '2024-04-01 11:00:00');
INSERT INTO room_reservations (room_id, user_id, start_time, end_time) VALUES (2, 2, '2024-04-01 12:00:00', '2024-04-01 13:00:00');
INSERT INTO room_reservations (room_id, user_id, start_time, end_time) VALUES (3, 2, '2024-04-01 14:00:00', '2024-04-01 15:00:00');