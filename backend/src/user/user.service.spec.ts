import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { DatabaseService } from '../database/database.service';
import {
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

describe('UserService', () => {
  let userService: UserService;
  let databaseService: DatabaseService;

  const mockQuery = jest.fn();
  const mockDatabaseService = {
    getConnection: jest.fn().mockReturnValue({
      query: mockQuery,
    }),
  };

  jest.mock('bcryptjs', () => ({
    hash: jest.fn(),
  }));

  let consoleErrorSpy: jest.SpyInstance;

  beforeAll(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterAll(() => {
    consoleErrorSpy.mockRestore();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: DatabaseService, useValue: mockDatabaseService },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    databaseService = module.get<DatabaseService>(DatabaseService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAllUsers', () => {
    it('should return paginated list of users', async () => {
      const mockUsers = [
        { id: 1, name: 'Test', surname: 'User', email: 'test@example.com' },
      ];
      const mockTotalCount = [{ total: 1 }];

      mockQuery
        .mockResolvedValueOnce([mockUsers, []])
        .mockResolvedValueOnce([mockTotalCount, []]);

      const result = await userService.findAllUsers(1, 10, '');

      expect(result).toEqual({
        data: mockUsers,
        totalRows: 1,
        totalPages: 1,
      });
    });

    it('should throw an error when database query fails', async () => {
      mockQuery.mockRejectedValue(new Error('DB Error'));

      await expect(userService.findAllUsers(1, 10, '')).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('findUserById', () => {
    it('should return a user when ID exists', async () => {
      const mockUser = {
        id: 1,
        name: 'Test',
        surname: 'User',
        email: 'test@example.com',
      };

      mockQuery.mockResolvedValue([[mockUser], []]);

      const result = await userService.findUserById(1);

      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException when user ID does not exist', async () => {
      mockQuery.mockResolvedValue([[], []]);

      await expect(userService.findUserById(999)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('createUser', () => {
    it('should create a new user and return user details', async () => {
      const mockUser = {
        name: 'New',
        surname: 'User',
        email: 'newuser@example.com',
        password: 'plaintextpassword',
        phone: '1234567890',
        age: 25,
        country: 'TR',
        district: 'Istanbul',
        role: 'User',
      };
      const hashedPassword = 'hashedpassword';
      const insertedUserId = 1;

      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      mockQuery.mockResolvedValue([{ insertId: insertedUserId }, []]);

      const result = await userService.createUser(mockUser);

      expect(result).toEqual({
        id: insertedUserId,
        ...mockUser,
        password: undefined,
      });
    });

    it('should throw an error when database query fails', async () => {
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedpassword');
      mockQuery.mockRejectedValue(new Error('DB Error'));

      await expect(userService.createUser({})).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('updateUser', () => {
    it('should update a user and return updated user details', async () => {
      const updatedFields = { name: 'Updated Name' };
      mockQuery.mockResolvedValue([{ affectedRows: 1 }, []]);

      const result = await userService.updateUser(1, updatedFields);

      expect(result).toEqual({ id: 1, ...updatedFields });
    });

    it('should throw NotFoundException when user ID does not exist', async () => {
      mockQuery.mockResolvedValue([{ affectedRows: 0 }, []]);

      await expect(
        userService.updateUser(999, { name: 'Test' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw an error when database query fails', async () => {
      mockQuery.mockRejectedValue(new Error('DB Error'));

      await expect(userService.updateUser(1, { name: 'Test' })).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
