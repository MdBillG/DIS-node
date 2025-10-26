require('dotenv').config();
const connectToDB = require('../config/database');
const Role = require('../models/role');
const User = require('../models/user');

const createAdminRole = async () => {
    try {
        // Check if admin role exists
        const existingRole = await Role.findOne({ name: 'admin' });
        if (existingRole) {
            console.log('Admin role already exists');
            return existingRole;
        }

        // Create admin role
        const adminRole = await Role.create({
            name: 'admin',
            displayName: 'System Administrator',
            description: 'Full system access and control',
            permissions: {
                roleManagement: {
                    create: true,
                    update: true,
                    delete: true
                },
                userManagement: {
                    create: true,
                    update: true,
                    deactivate: true
                },
                batch: {
                    create: true,
                    read: true,
                    update: true,
                    delete: true,
                    ownOnly: false
                },
                student: {
                    create: true,
                    read: true,
                    update: true,
                    delete: true,
                    ownOnly: false,
                    promoteOrRetain: true
                },
                attendance: {
                    mark: true,
                    read: true,
                    ownOnly: false
                },
                grades: {
                    assign: true,
                    read: true,
                    ownOnly: false
                },
                announcements: {
                    create: true,
                    read: true,
                    delete: true
                },
                timetable: {
                    manage: true,
                    view: true
                }
            },
            isSystemRole: true,
            canLogin: true
        });

        console.log('Admin role created successfully');
        return adminRole;
    } catch (error) {
        console.error('Error creating admin role:', error);
        throw error;
    }
};

const createAdminUser = async (roleId) => {
    try {
        // Check if admin user exists
        const existingUser = await User.findOne({ email: 'admin@school.com' });
        if (existingUser) {
            console.log('Admin user already exists');
            return;
        }

        // Create admin user
        const adminUser = await User.create({
            username: 'admin',
            email: 'admin@school.com',
            password: 'Admin@123',
            fullName: 'System Administrator',
            roleId: roleId,
            roleName: 'admin',
            isActive: true,
            phoneNumber: '9876543210',
            dateOfBirth: '1990-01-01',
            dateOfJoining: new Date(),
            address: {
                street: 'Admin Street',
                city: 'Admin City',
                state: 'Admin State',
                postalCode: '123456',
                country: 'India'
            }
        });

        console.log('Admin user created successfully');
        console.log('Admin login credentials:');
        console.log('Email: admin@school.com');
        console.log('Password: Admin@123');
    } catch (error) {
        console.error('Error creating admin user:', error);
        throw error;
    }
};

const seedInitialSetup = async () => {
    try {
        await connectToDB();
        const adminRole = await createAdminRole();
        await createAdminUser(adminRole._id);
        console.log('Initial setup completed successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error in initial setup:', error);
        process.exit(1);
    }
};

seedInitialSetup();