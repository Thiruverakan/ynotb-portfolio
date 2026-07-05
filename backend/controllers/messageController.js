const Message = require('../models/Message');
const mockDbStore = require('../config/mockDbStore');

// @desc    Submit a contact message (inquiry)
// @route   POST /api/messages
// @access  Public
const createMessage = async (req, res) => {
  try {
    const { name, email, subject, message, phone, whatsappAvailable } = req.body;

    if (!phone) {
      return res.status(400).json({ success: false, message: 'Phone number is required' });
    }

    const phoneRegex = /^\+\d{7,15}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ success: false, message: 'Phone number must match international format (e.g. +94764609326)' });
    }

    if (whatsappAvailable !== undefined && typeof whatsappAvailable !== 'boolean') {
      return res.status(400).json({ success: false, message: 'whatsappAvailable must be a boolean' });
    }
    
    if (global.useMockDb) {
      const newMessage = mockDbStore.create('messages', {
        name,
        email,
        subject,
        message,
        phone,
        whatsappAvailable: whatsappAvailable || false,
        status: 'unread'
      });
      return res.status(201).json({
        success: true,
        message: 'Message sent successfully. We will get back to you soon!',
        data: newMessage
      });
    }

    const newMessage = await Message.create({
      name,
      email,
      subject,
      message,
      phone,
      whatsappAvailable: whatsappAvailable || false
    });

    res.status(201).json({
      success: true,
      message: 'Message sent successfully. We will get back to you soon!',
      data: newMessage
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get all messages
// @route   GET /api/messages
// @access  Private (Owner, Admin, Software Engineer)
const getMessages = async (req, res) => {
  try {
    if (global.useMockDb) {
      const messages = mockDbStore.find('messages');
      const sortedMessages = [...messages].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return res.json({ success: true, count: sortedMessages.length, messages: sortedMessages });
    }

    const messages = await Message.find({}).sort({ createdAt: -1 });
    res.json({ success: true, count: messages.length, messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update message status (e.g., mark as read/replied)
// @route   PUT /api/messages/:id
// @access  Private (Owner, Admin)
const updateMessageStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['unread', 'read', 'replied'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    if (global.useMockDb) {
      const messageObj = mockDbStore.findById('messages', req.params.id);
      if (!messageObj) {
        return res.status(404).json({ success: false, message: 'Message not found' });
      }
      const updated = mockDbStore.findByIdAndUpdate('messages', req.params.id, { status });
      return res.json({ success: true, message: updated });
    }

    const messageObj = await Message.findById(req.params.id);

    if (!messageObj) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    messageObj.status = status;
    await messageObj.save();

    res.json({ success: true, message: messageObj });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete a message
// @route   DELETE /api/messages/:id
// @access  Private (Owner, Admin)
const deleteMessage = async (req, res) => {
  try {
    if (global.useMockDb) {
      const messageObj = mockDbStore.findById('messages', req.params.id);
      if (!messageObj) {
        return res.status(404).json({ success: false, message: 'Message not found' });
      }
      mockDbStore.findByIdAndDelete('messages', req.params.id);
      return res.json({ success: true, message: 'Message deleted successfully' });
    }

    const messageObj = await Message.findById(req.params.id);

    if (!messageObj) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    await Message.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Message deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createMessage,
  getMessages,
  updateMessageStatus,
  deleteMessage
};
