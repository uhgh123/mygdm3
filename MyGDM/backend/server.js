const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();



const app = express();
// Middleware
app.use(cors());
app.use(express.json());
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);
const reminderRoutes = require('./routes/reminders');
app.use('/api/reminders', reminderRoutes);
const forumRoutes = require('./routes/forum');
app.use('/api/forum', forumRoutes);
const forumCommentRoutes = require('./routes/forumComments');
app.use('/api/forum/comments', forumCommentRoutes);
const faqRoutes = require('./routes/faq');
app.use('/api/faqs', faqRoutes);
const recipesRouter = require("./routes/recipes");
app.use("/api/recipes", recipesRouter);
const userFavoritesRouter = require('./routes/userFavourites');
app.use('/api/users', userFavoritesRouter);
const informationRoutes = require('./routes/information');
app.use('/api/information', informationRoutes);

const port = process.env.PORT || 5000;




// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Routes
const gdmLogsRoute = require('./routes/gdmLogs');
app.use('/api/logs', gdmLogsRoute);

// Test route
app.get('/', (req, res) => {
  res.send('MyGDM Backend is running 🎉');
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
