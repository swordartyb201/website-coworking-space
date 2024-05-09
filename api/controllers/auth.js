import User from "../models/user.js";
import bcrypt from "bcryptjs";
import { createError } from "../utils/error.js";
import jwt from "jsonwebtoken";
import transporter from "../utils/nodemailer.js";

export const register = async (req, res, next) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    // Kiểm tra nếu các trường thông tin bắt buộc (username, password, email, phone) không được gửi lên
    if (
      !req.body.username ||
      !req.body.email ||
      !req.body.phone ||
      !req.body.password
    ) {
      return res
        .status(400)
        .json({ message: "Tên đăng nhập, mật khẩu và email là bắt buộc" });
    }

    // Kiểm tra nếu đã tồn tại người dùng với tên đăng nhập đã cung cấp
    const existingUser = await User.findOne({ username: req.body.username });
    if (existingUser) {
      return res.status(400).json({ message: "Tên đăng nhập đã tồn tại" });
    }

    const existingEmail = await User.findOne({ email: req.body.email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email đã tồn tại" });
    }

    // Tạo một đối tượng người dùng mới với thông tin cung cấp và mật khẩu đã mã hóa
    const newUser = new User({
      ...req.body,
      password: hash,
    });

    // Lưu người dùng mới vào cơ sở dữ liệu
    await newUser.save();
    res.status(200).send("Tài khoản đã được tạo");
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    // Tìm người dùng với tên đăng nhập đã cung cấp
    const user = await User.findOne({ username: req.body.username });
    if (!user) return next(createError(404, "Tài khoản không tồn tại!"));

    // So sánh mật khẩu đã cung cấp với mật khẩu đã mã hóa trong cơ sở dữ liệu
    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isPasswordCorrect)
      return next(createError(400, "Sai tài khoản hoặc mật khẩu!"));

    // Tạo mã thông báo JWT với dữ liệu người dùng và khóa bí mật
    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT
    );

    const { password, isAdmin, ...otherDetails } = user._doc;
    res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .status(200)
      .json({ details: { ...otherDetails }, isAdmin });
  } catch (err) {
    next(err);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.params.id; // Lấy userId từ thông tin người dùng đã đăng nhập
    // Tìm người dùng theo ID
    const user = await User.findById(userId);

    // Kiểm tra mật khẩu cũ
    const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordCorrect) {
      return next(createError(400, "Mật khẩu cũ không đúng"));
    }

    // Mã hóa mật khẩu mới
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(newPassword, salt);

    // Cập nhật mật khẩu mới trong cơ sở dữ liệu
    await User.findByIdAndUpdate(user.id, { password: hash });

    res
      .status(200)
      .json({ success: true, message: "Mật khẩu đã được thay đổi" });
  } catch (err) {
    next(err);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    // Tìm người dùng theo email
    const user = await User.findOne({ email: email });
    if (!user) {
      return next(
        createError(404, "Không tìm thấy người dùng với địa chỉ email này")
      );
    }
    // Tạo mã xác nhận ngẫu nhiên
    const token = jwt.sign({ id: user._id }, process.env.JWT, {
      expiresIn: "1h",
    });

    // Gửi email xác nhận với mã xác nhận
    const mailOptions = {
      from: "skyactvn@gmail.com",
      to: user.email,
      subject: "Đặt lại mật khẩu tại Sky Office",
      text: `Click vào đường link sau để đặt lại mật khẩu, đường link có thời hạn 1 tiếng: http://localhost:4000/reset-password/${user._id}/${token}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Lỗi gửi email:", error);
        return next(createError(500, "Đã có lỗi xảy ra khi gửi email"));
      }

      console.log("Email đã được gửi: " + info.response);
      res.status(200).json({
        message: "Một email xác nhận đã được gửi đến địa chỉ của bạn",
      });
    });
  } catch (err) {
    next(err);
  }
};

export const resetPassword = (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;
  console.log(id, token, password);
  jwt.verify(token, process.env.JWT, (err, decoded) => {
    if (err) {
      return res.json({ Status: "Đường link không hợp lệ hoặc đã hết hạn" });
    } else {
      bcrypt
        .hash(password, 10)
        .then((hash) => {
          User.findByIdAndUpdate(id, { password: hash })
            .then((u) => res.send({ Status: "Mật khẩu đã được thay đổi" }))
            .catch((err) =>
              res.send({
                Status: "Đã có lỗi xảy ra khi thay đổi mật khẩu",
                err,
              })
            );
        })
        .catch((err) => res.send({ Status: err }));
    }
  });
};
