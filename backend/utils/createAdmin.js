// utils/createAdmin.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const userModel = require('../models/User');
require('dotenv').config();

const createAdmin = async () => {
  try {
    const hashedPassword = await bcrypt.hash('123456', 10);

    const admin = await userModel.create({
      name: 'Nofil',
      email: 'nofilhafeez1@gmail.com',
      password: hashedPassword,
      isAdmin: true,
    });

    await admin.save();
    console.log('Admin created successfully!');
    process.exit();
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};
module.exports = createAdmin;

