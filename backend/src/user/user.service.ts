import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class UserService {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAllUsers(page: number, pageSize: number, search: string) {
    try {
      const connection = this.databaseService.getConnection();
      const offset = (page - 1) * pageSize;

      let query = 'SELECT * FROM Users';
      let countQuery = 'SELECT COUNT(*) as total FROM Users';
      const params = [];

      if (search) {
        query += ` WHERE name LIKE ? OR surname LIKE ? OR email LIKE ?`;
        countQuery += ` WHERE name LIKE ? OR surname LIKE ? OR email LIKE ?`;
        const searchParam = `%${search}%`;
        params.push(searchParam, searchParam, searchParam);
      }

      query += ` LIMIT ? OFFSET ?`;
      params.push(pageSize, offset);

      const [rows]: any[] = await connection.query(query, params);
      const [totalResult]: any[] = await connection.query(
        countQuery,
        params.slice(0, -2),
      );

      const totalRows = totalResult[0].total;
      const totalPages = Math.ceil(totalRows / pageSize);

      return { data: rows, totalRows, totalPages };
    } catch (error) {
      console.error('Error in findAllUsers:', error);
      throw new InternalServerErrorException('Failed to retrieve users');
    }
  }

  async findUserById(id: number) {
    try {
      const connection = this.databaseService.getConnection();
      const [rows]: any[] = await connection.query(
        `SELECT * FROM Users WHERE id = ?`,
        [id],
      );

      if (rows.length === 0) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      return rows[0];
    } catch (error) {
      console.error('Error in findUserById:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to retrieve user by ID');
    }
  }

  async createUser(user: any) {
    try {
      const connection = this.databaseService.getConnection();
      const hashedPassword = await bcrypt.hash(user.password, 10);

      const query = `
        INSERT INTO Users (name, surname, email, password, phone, age, country, district, role)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const params = [
        user.name,
        user.surname,
        user.email,
        hashedPassword,
        user.phone,
        user.age,
        user.country,
        user.district,
        user.role,
      ];

      const [result]: any = await connection.query(query, params);
      return { id: result.insertId, ...user, password: undefined };
    } catch (error) {
      console.error('Error in createUser:', error);
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  async updateUser(id: number, updatedFields: any) {
    try {
      const connection = this.databaseService.getConnection();
      const setClause = [];
      const params = [];

      for (const key in updatedFields) {
        if (key === 'password') {
          const hashedPassword = await bcrypt.hash(updatedFields[key], 10);
          setClause.push(`${key} = ?`);
          params.push(hashedPassword);
        } else {
          setClause.push(`${key} = ?`);
          params.push(updatedFields[key]);
        }
      }
      console.log(setClause);
      const updateQuery = `UPDATE Users SET ${setClause.join(', ')} WHERE id = ?`;
      params.push(id);

      const [result]: any = await connection.query(updateQuery, params);

      if (result.affectedRows === 0) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      return { id, ...updatedFields };
    } catch (error) {
      console.error('Error in updateUser:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update user');
    }
  }
}
