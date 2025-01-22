const User = require("../models/user");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../middlewares/jwt");
const jwt = require("jsonwebtoken");

//REGISTER
const register = async (req, res) => {
  try {
    const { email, password, firstname, lastname } = req.body;

    if (!email || !password || !firstname || !lastname) {
      return res
        .status(400)
        .json({ success: false, message: "Missing inputs" });
    }

    const user = await User.findOne({ email: email });
    if (user) {
      res.status(400).json({
        success: false,
        message: "Email and/or Mobile already exist",
      });
    } else {
      const newUser = await User.create(req.body);
      return res.status(200).json({
        success: newUser ? true : false,
        message: newUser ? "Register Successfully!" : "Something went wrong",
        newUser,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

//LOGIN
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Missing inputs" });
    }

    const response = await User.findOne({ email: email });
    const isCorrectPassword = await response.isCorrectPassword(password);

    if (response && isCorrectPassword) {
      // Tách password và role ra khỏi response
      const { password, role, ...userData } = response.toObject();
      // Tạo accessToken (Xác thực ng dùng, phân quyền ng dùng)
      const accessToken = generateAccessToken(response._id, role);
      // Tạo refreshToken (Cấp mới accessToken)
      const refreshToken = generateRefreshToken(response._id);
      // Lưu refreshToken vào DB
      await User.findByIdAndUpdate(
        response._id,
        { refreshToken: refreshToken },
        { new: true }
      );
      // Lưu refreshToken vào Cookies

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.status(200).json({
        success: true,
        message: "Login successfully!",
        accessToken,
        userData,
      });
    } else {
      return res
        .status(500)
        .json({ success: false, message: "Invalid email and/or password" });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Invalid email and/or password",
    });
  }
};

//GET CURRENT USER
const getCurrent = async (req, res) => {
  try {
    const { _id } = req.user;
    const user = await User.findById(_id).select(
      "-refreshToken -password -role"
    );
    return res
      .status(200)
      .json({ success: true, result: user ? user : "User not found" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

//Refresh Access Token
const refreshAccessToken = async (req, res) => {
  try {
    //Lấy token từ cookies
    const cookie = req.cookies;
    //Check xem có token hay 0
    if (!cookie && !cookie.refreshToken) {
      return res
        .status(400)
        .json({ success: false, message: "No refresh token in cookie" });
    }
    //Check token có còn hạn hay 0
    jwt.verify(
      cookie.refreshToken,
      process.env.JWT_SECRET,
      async (err, decode) => {
        if (err) {
          return res
            .status(401)
            .json({ success: false, message: "Invalid refresh token" });
        }
        //Check xem token này có khớp với token đã lưu trong DB hay 0
        const response = await User.findOne({
          _id: decode._id,
          refreshToken: cookie.refreshToken,
        });
        return res.status(200).json({
          success: response ? true : false,
          newAccessToken: response
            ? generateAccessToken(response._id, response.role)
            : "Refresh token not matched",
        });
      }
    );
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

//LOG OUT
const logout = async (req, res) => {
  try {
    const cookie = req.cookies;
    if (!cookie || !cookie.refreshToken) {
      return res.status(400).json({
        success: false,
        message: "No refresh token in cookies",
      });
    }

    //Xóa refresh token ở DB
    await User.findOneAndUpdate(
      { refreshToken: cookie.refreshToken },
      { refreshToken: "" },
      { new: true }
    );

    //Xóa refresh token ở cookies trình duyệt
    res.clearCookie("refreshToken", { httpOnly: true, secure: true });

    return res
      .status(200)
      .json({ success: true, message: "Logout successfully!" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

//FORGOT PASSWORD
// Client gửi lên email
// Server check xem email có hợp lệ hay 0 => gửi mail cho client + kèm link (password change token)
// Client check email => click vào link
// Client gửi api kèm theo token
// Server check xem cái token có giống với cái token đã gửi hay 0
// Change password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Missing email",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    // const resetToken
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

module.exports = {
  register,
  login,
  getCurrent,
  refreshAccessToken,
  logout,
  forgotPassword,
};
