// const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');
// const User = require('./models/user.model'); // Замените на путь к вашей модели User

// async function hashAllPasswords() {
//     try {
//         await mongoose.connect('YOUR_MONGODB_URI', { // Замените на URI вашей базы данных
//             useNewUrlParser: true,
//             useUnifiedTopology: true,
//         });

//         const users = await User.find({});
//         console.log(`Found ${users.length} users. Starting hashing...`);

//         for (const user of users) {
//             if (!user.password.startsWith('$2b$')) { // Check if the password is not already hashed
//                 const saltRounds = 10;
//                 const salt = await bcrypt.genSalt(saltRounds);
//                 const hashedPassword = await bcrypt.hash(user.password, salt);
//                 user.password = hashedPassword;
//                 user.salt = salt; // Important: Also update the salt!
//                 await user.save();
//                 console.log(`Hashed password for user: ${user.telegramUsername}`);
//             } else {
//                 console.log(`Password already hashed for user: ${user.telegramUsername}`);
//             }
//         }

//         console.log('Hashing complete!');
//         mongoose.disconnect();
//     } catch (error) {
//         console.error('Error hashing passwords:', error);
//     }
// }

// hashAllPasswords();
