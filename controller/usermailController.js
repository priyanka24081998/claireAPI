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

exports.getusermail = async(req, res) =>{
    try {
        const id = req.params.id
     const user = await UMM.findById(id)
     
     if (!user) {
      return res.status(404).json({ status: "fail", message: "user not found" });
    }
    
     res.status(200).json({ status: "success", data: user });}
     catch (error) {
      res.status(400).json({
        status: "fail",
        message: error.message,
      });
    }
}
exports.viewalluser = async (req, res) => {
  try {

    // ✅ Get all products
    const users = await UMM.find()

    res.status(200).json({
      status: "success",
      results: users.length,
      data: users,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};
exports.deleteUsermail = async (req, res) => {
  try {
    const user = await UMM.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


