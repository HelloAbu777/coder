import Payment from '../models/payment.model.js';
import User from '../models/user.model.js';

// @returns {Object} — to'lov yaratish (pending)
const createPayment = async (req, res) => {
  try {
    const { method } = req.body;
    const existing = await Payment.findOne({ user: req.user._id, status: 'paid' });
    if (existing) return res.status(400).json({ message: 'Siz allaqachon to\'lov qilgansiz' });

    const payment = await Payment.create({
      user: req.user._id,
      method,
      amount: 299000,
      status: 'pending'
    });

    // Payme / Click redirect URL (sandbox)
    let redirectUrl = '';
    if (method === 'payme') {
      redirectUrl = `https://checkout.paycom.uz/${process.env.PAYME_MERCHANT_ID}?amount=${payment.amount * 100}&order_id=${payment._id}`;
    } else if (method === 'click') {
      redirectUrl = `https://my.click.uz/services/pay?service_id=${process.env.CLICK_SERVICE_ID}&merchant_id=${process.env.CLICK_MERCHANT_ID}&amount=${payment.amount}&transaction_param=${payment._id}`;
    }

    res.status(201).json({ paymentId: payment._id, redirectUrl });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @returns {Object} — to'lov callback (Payme/Click webhook)
const paymentCallback = async (req, res) => {
  try {
    const { order_id, transaction_param, status } = req.body;
    const paymentId = order_id || transaction_param;

    const payment = await Payment.findById(paymentId);
    if (!payment) return res.status(404).json({ message: 'To\'lov topilmadi' });

    if (status === 'success' || status === 2) {
      payment.status = 'paid';
      payment.paidAt = new Date();
      await payment.save();

      await User.findByIdAndUpdate(payment.user, { isPaid: true, role: 'student', paymentId: payment._id });
    } else {
      payment.status = 'failed';
      await payment.save();
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @returns {Object} — to'lov holatini tekshirish
const checkPayment = async (req, res) => {
  try {
    const payment = await Payment.findOne({ user: req.user._id }).sort({ createdAt: -1 });
    if (!payment) return res.status(404).json({ message: 'To\'lov topilmadi' });
    res.json(payment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @returns {Object} — test rejim: to'lovsiz faollashtirish (v1 test uchun)
const testActivate = async (req, res) => {
  try {
    await Payment.findOneAndDelete({ user: req.user._id });
    await Payment.create({
      user: req.user._id,
      method: 'test',
      amount: 299000,
      status: 'paid',
      paidAt: new Date()
    });
    await User.findByIdAndUpdate(req.user._id, { isPaid: true, role: 'student' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export { createPayment, paymentCallback, checkPayment, testActivate };
