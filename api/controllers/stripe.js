import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_KEY);

const stripePayment = async (req, res) => {
  const { token, amount, description } = req.body;

  try {
    // Thực hiện thanh toán với Stripe
    const charge = await stripe.charges.create({
      source: token,
      amount,
      currency: "usd", // Cập nhật với loại tiền tệ mong muốn của bạn
      description,
    });

    console.log(charge);
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export default stripePayment;
