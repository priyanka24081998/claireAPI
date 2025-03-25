const AM = require('../model/adminModel')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


exports.createAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // ✅ Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10); // 10 is salt rounds

        // ✅ Save admin with hashed password
        const admin = await AM.create({
            email,
            password: hashedPassword
        });
        res.status(201).json({
            status: 'success',
            message: 'Admin created successfully',
            data: { email: admin.email } // Don't return password!
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
};

exports.adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // ✅ Find admin by email
        const admin = await AM.findOne({ email });
        if (!admin) {
            return res.status(401).json({ status: 'fail', message: 'Invalid email or password' });
        }

        // ✅ Compare password
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ status: 'fail', message: 'Invalid email or password' });
        }

        const token = jwt.sign({ id: admin._id, email: admin.email }, 'claireDiamonds');


        res.status(200).json({ status: 'success', message: 'Login successful',token:token });

    } catch (error) {
        res.status(500).json({ status: 'fail', message: error.message });
    }
};

