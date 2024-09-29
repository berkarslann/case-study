import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseService } from './database.service';
import * as mysql from 'mysql2/promise';
import * as bcrypt from 'bcryptjs';

jest.mock('mysql2/promise'); 

describe('DatabaseService', () => {
  let databaseService: DatabaseService;

  const mockConnection = {
    query: jest.fn(),
    changeUser: jest.fn(),
  };

  beforeEach(async () => {
    (mysql.createConnection as jest.Mock).mockResolvedValue(mockConnection);

    const module: TestingModule = await Test.createTestingModule({
      providers: [DatabaseService],
    }).compile();

    databaseService = module.get<DatabaseService>(DatabaseService);

    await databaseService.onModuleInit();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create the database and user table on module initialization', async () => {
    expect(mysql.createConnection).toHaveBeenCalledWith({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: 'password',
    });

    expect(mockConnection.query).toHaveBeenCalledWith(
      `CREATE DATABASE IF NOT EXISTS case_study_db`,
    );
    expect(mockConnection.changeUser).toHaveBeenCalledWith({
      database: 'case_study_db',
    });

    expect(mockConnection.query).toHaveBeenCalledWith(`
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
    `);
  });

  it('should return the connection object', () => {
    const connection = databaseService.getConnection();
    expect(connection).toBe(mockConnection);
  });
});
