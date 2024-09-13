const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const path=require('path')

dotenv.config();


const app = express();
const PORT = process.env.PORT || 5000;

const _dirname=path.resolve()

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));


mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Database connection error:', err);
});


app.use('/api', userRoutes);

app.use(express.static(path.join(_dirname,'/client/build')))

app.get('*',(req,res)=>{
  res.sendFile(path.resolve(_dirname,'client','build','index.html'))
})


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
