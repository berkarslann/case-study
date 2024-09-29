import { Injectable, OnModuleInit } from '@nestjs/common';
import * as mysql from 'mysql2/promise';
import * as bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class DatabaseService implements OnModuleInit {
  private connection: mysql.Connection;

  async onModuleInit() {
    this.connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });

    await this.connection.query(
      `CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`,
    );
    await this.connection.changeUser({ database: process.env.DB_NAME });

    await this.createUserTable();
  }

  private async createUserTable() {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS Users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100),
        surname VARCHAR(100),
        email VARCHAR(100) UNIQUE,
        password VARCHAR(255),
        phone VARCHAR(20),
        age INT,
        country VARCHAR(50),
        district VARCHAR(50),
        role VARCHAR(50),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `;
    await this.connection.query(createTableQuery);

    await this.insertMockData();
  }

  private async insertMockData() {
    const mockUsersData = [
      {
        name: 'Mevlana',
        surname: 'Acıkgöz',
        email: 'example1@example.com',
        password: 'password123',
        phone: '1234567890',
        age: 30,
        country: 'TR',
        district: 'Istanbul',
        role: 'Admin',
      },
      {
        name: 'Gökalp',
        surname: 'Caymaz',
        email: 'example2@example.com',
        password: 'password123',
        phone: '0987654321',
        age: 25,
        country: 'TR',
        district: 'Istanbul',
        role: 'User',
      },
      {
        name: 'Sevin',
        surname: 'Balliktas',
        email: 'example3@example.com',
        password: 'password123',
        phone: '1234567890',
        age: 30,
        country: 'TR',
        district: 'Istanbul',
        role: 'Admin',
      },
      {
        name: 'Burak',
        surname: 'Öztürk',
        email: 'example4@example.com',
        password: 'password123',
        phone: '1234567890',
        age: 30,
        country: 'TR',
        district: 'Istanbul',
        role: 'Admin',
      },
      {
        name: 'Yusuf',
        surname: 'Berkay',
        email: 'example5@example.com',
        password: 'password123',
        phone: '1234567890',
        age: 30,
        country: 'TR',
        district: 'Istanbul',
        role: 'Admin',
      },
      {
        name: 'Ahmet',
        surname: 'Batuhan',
        email: 'example6@example.com',
        password: 'password123',
        phone: '1234567890',
        age: 30,
        country: 'TR',
        district: 'Istanbul',
        role: 'Admin',
      },
      {
        name: 'Ferhat',
        surname: 'Demir',
        email: 'example7@example.com',
        password: 'password123',
        phone: '1234567890',
        age: 30,
        country: 'TR',
        district: 'Istanbul',
        role: 'Admin',
      },
      {
        name: 'Mahmut',
        surname: 'Yakan',
        email: 'example8@example.com',
        password: 'password123',
        phone: '1234567890',
        age: 30,
        country: 'TR',
        district: 'Istanbul',
        role: 'Admin',
      },
      {
        name: 'Ugurcan',
        surname: 'Yanık',
        email: 'example9@example.com',
        password: 'password123',
        phone: '1234567890',
        age: 30,
        country: 'TR',
        district: 'Istanbul',
        role: 'Admin',
      },
      {
        name: 'Ece',
        surname: 'Aslan',
        email: 'example10@example.com',
        password: 'password123',
        phone: '1234567890',
        age: 30,
        country: 'TR',
        district: 'Istanbul',
        role: 'Admin',
      },
      {
        name: 'Tansu',
        surname: 'Sabuncu',
        email: 'example11@example.com',
        password: 'password123',
        phone: '1234567890',
        age: 30,
        country: 'TR',
        district: 'Istanbul',
        role: 'Admin',
      },
      {
        name: 'Sena',
        surname: 'Özaydın',
        email: 'example12@example.com',
        password: 'password123',
        phone: '1234567890',
        age: 30,
        country: 'TR',
        district: 'Istanbul',
        role: 'Admin',
      },
      {
        name: 'Berfin',
        surname: 'Bozdağ',
        email: 'example13@example.com',
        password: 'password123',
        phone: '1234567890',
        age: 30,
        country: 'TR',
        district: 'Istanbul',
        role: 'Admin',
      },
      {
        name: 'Koray',
        surname: 'Gültekin',
        email: 'example14@example.com',
        password: 'password123',
        phone: '1234567890',
        age: 30,
        country: 'TR',
        district: 'Istanbul',
        role: 'Admin',
      },
      {
        name: 'Olcay',
        surname: 'Kaplan',
        email: 'example15@example.com',
        password: 'password123',
        phone: '1234567890',
        age: 30,
        country: 'TR',
        district: 'Istanbul',
        role: 'Admin',
      },
      {
        name: 'Melis',
        surname: 'Uzun',
        email: 'example16@example.com',
        password: 'password123',
        phone: '1234567890',
        age: 30,
        country: 'TR',
        district: 'Istanbul',
        role: 'Admin',
      },
      {
        name: 'Lale',
        surname: 'Akbaba',
        email: 'example17@example.com',
        password: 'password123',
        phone: '1234567890',
        age: 30,
        country: 'TR',
        district: 'Istanbul',
        role: 'Admin',
      },
      {
        name: 'Beyza',
        surname: 'Poyraz',
        email: 'example18@example.com',
        password: 'password123',
        phone: '1234567890',
        age: 30,
        country: 'TR',
        district: 'Istanbul',
        role: 'Admin',
      },
      {
        name: 'Elif',
        surname: 'Önal',
        email: 'example19@example.com',
        password: 'password123',
        phone: '1234567890',
        age: 30,
        country: 'TR',
        district: 'Istanbul',
        role: 'Admin',
      },
      {
        name: 'Murat',
        surname: 'Ulutaş',
        email: 'example20@example.com',
        password: 'password123',
        phone: '1234567890',
        age: 30,
        country: 'TR',
        district: 'Istanbul',
        role: 'Admin',
      },
      {
        name: 'Elif',
        surname: 'Salkı',
        email: 'example21@example.com',
        password: 'password123',
        phone: '1234567890',
        age: 30,
        country: 'TR',
        district: 'Istanbul',
        role: 'Admin',
      },
    ];

    for (const user of mockUsersData) {
      user.password = await bcrypt.hash(user.password, 10);

      const query = `
        INSERT INTO Users (name, surname, email, password, phone, age, country, district, role)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const params = [
        user.name,
        user.surname,
        user.email,
        user.password,
        user.phone,
        user.age,
        user.country,
        user.district,
        user.role,
      ];

      await this.connection.query(query, params);
    }
  }

  getConnection() {
    return this.connection;
  }
}
