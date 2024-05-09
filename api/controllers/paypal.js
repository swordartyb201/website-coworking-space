//paypal.js
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const paypal = {
  // Tạo thanh toán PayPal
  payment: async (req, res) => {
    try {
      const requestBody1 = {
        grant_type: "client_credentials",
      };

      // Sử dụng biến môi trường cho Client ID và Secret key
      const authHeader = `Basic ${Buffer.from(
        `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
      ).toString("base64")}`;

      // Gửi yêu cầu lấy Access Token
      const response1 = await axios.post(
        "https://api.sandbox.paypal.com/v1/oauth2/token",
        requestBody1,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: authHeader,
          },
        }
      );

      // Lấy Access Token từ phản hồi
      const accessToken = response1.data.access_token;

      // Lấy thông tin giá trị thanh toán và các chi tiết từ yêu cầu của client
      const { price, description, return_url, cancel_url } = req.body;

      // Tạo đối tượng dữ liệu yêu cầu
      const requestBody = {
        intent: "sale",
        payer: {
          payment_method: "paypal",
        },
        transactions: [
          {
            amount: {
              currency: "USD",
              total: price,
            },
            description,
          },
        ],
        redirect_urls: {
          return_url,
          cancel_url,
        },
      };

      // Gửi yêu cầu tạo thanh toán PayPal
      const response = await axios.post(
        "https://api.sandbox.paypal.com/v1/payments/payment",
        requestBody,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      // Lấy URL thanh toán từ phản hồi
      const { links } = response.data;
      const approvalUrl = links.find(
        (link) => link.rel === "approval_url"
      ).href;

      // Trả về URL thanh toán cho client
      return res.json({ approvalUrl, accessToken });
    } catch (error) {
      console.error("Error creating PayPal payment:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  // Xác nhận tình trạng thanh toán PayPal
  executePayment: async (req, res) => {
    try {
      const requestBody1 = {
        grant_type: "client_credentials",
      };

      // Sử dụng biến môi trường cho Client ID và Secret key
      const authHeader = `Basic ${Buffer.from(
        `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
      ).toString("base64")}`;

      // Gửi yêu cầu lấy Access Token
      const response1 = await axios.post(
        "https://api.sandbox.paypal.com/v1/oauth2/token",
        requestBody1,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: authHeader,
          },
        }
      );

      // Lấy Access Token từ phản hồi
      const accessToken = response1.data.access_token;

      // Lấy thông tin paymentId, token và PayerID từ yêu cầu của client
      const { paymentId, PayerID, token } = req.query;

      // Gửi yêu cầu execute payment
      const requestBody2 = {
        payer_id: PayerID,
      };

      const response2 = await axios.post(
        `https://api.sandbox.paypal.com/v1/payments/payment/${paymentId}/execute`,
        requestBody2,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      // Kiểm tra kết quả execute payment
      const { state } = response2.data;
      if (state === "approved") {
        // Thanh toán thành công
        return res.json({ message: "Payment successful" });
      } else {
        // Thanh toán thất bại
        return res.json({ message: "Payment failed" });
      }
    } catch (error) {
      console.error("Error executing PayPal payment:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },
};

export default paypal;
