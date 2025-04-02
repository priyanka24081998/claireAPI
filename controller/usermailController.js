const UMM = require('../model/usermail');

exports.signup = async (req, res) => {
    try {
        const { email } = req.body;

       
        const existingUser = await UMM.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already in use" });
        }

        // Create user
        const newUser = await UMM.create({ email });

        res.status(201).json({
            status: 'success',
            message: 'User created successfully',
            data: newUser
        });
    } catch (error) {
        res.status(500).json({
            status: 'fail',
            message: error.message
        });
    }
};
