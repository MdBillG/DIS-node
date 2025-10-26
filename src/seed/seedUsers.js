require('dotenv').config();
const connectToDB = require('../config/database');
const Role = require('../models/role');
const User = require('../models/user');

const createInitialAdmin = async () => {
    try {
        await connectToDB();

        // Find admin role
        const adminRole = await Role.findOne({ name: 'admin' });
        if (!adminRole) {
            console.error('Admin role not found. Please run npm run seed:roles first');
            process.exit(1);
        }

        // Check if admin user exists
        const existingAdmin = await User.findOne({ email: 'admin@school.com' });
        if (existingAdmin) {
            console.log('Admin user already exists.');
            process.exit(0);
        }

        // Create admin user
        const adminUser = await User.create({
            username: 'admin',
            email: 'admin@school.com',
            password: 'Admin@123', // Change this in production!
            fullName: 'System Administrator',
            roleId: adminRole._id,
            roleName: adminRole.name,
            isActive: true
        });

        console.log('Created admin user:', {
            email: adminUser.email,
            fullName: adminUser.fullName,
            role: adminUser.roleName
        });

        // Create example teacher
        const teacherRole = await Role.findOne({ name: 'teacher' });
        if (teacherRole) {
            const teacherUser = await User.create({
                username: 'teacher',
                email: 'teacher@school.com',
                password: 'Teacher@123', // Change this in production!
                fullName: 'Example Teacher',
                roleId: teacherRole._id,
                roleName: teacherRole.name,
                isActive: true
            });

            console.log('Created teacher user:', {
                email: teacherUser.email,
                fullName: teacherUser.fullName,
                role: teacherUser.roleName
            });
        }

        // Create example principal
        const principalRole = await Role.findOne({ name: 'principal' });
        if (principalRole) {
            const principalUser = await User.create({
                username: 'principal',
                email: 'principal@school.com',
                password: 'Principal@123', // Change this in production!
                fullName: 'Example Principal',
                roleId: principalRole._id,
                roleName: principalRole.name,
                isActive: true
            });

            console.log('Created principal user:', {
                email: principalUser.email,
                fullName: principalUser.fullName,
                role: principalUser.roleName
            });
        }

        console.log('\nDefault users created successfully!');
        console.log('\nIMPORTANT: Change these passwords in production!');
        process.exit(0);
    } catch (error) {
        console.error('Error creating initial users:', error);
        process.exit(1);
    }
};

createInitialAdmin();