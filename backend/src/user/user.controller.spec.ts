import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { NotFoundException, InternalServerErrorException, BadRequestException } from '@nestjs/common';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

 
  const mockUserService = {
    findAllUsers: jest.fn(),
    findUserById: jest.fn(),
    createUser: jest.fn(),
    updateUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{ provide: UserService, useValue: mockUserService }],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllUsers', () => {
    it('should return a list of users', async () => {
      const mockUsers = [{ id: 1, name: 'Test User' }];
      const mockResponse = { data: mockUsers, totalRows: 1, totalPages: 1 };

      mockUserService.findAllUsers.mockResolvedValue(mockResponse);

      const result = await userController.getAllUsers('1', '10', '');

      expect(result).toEqual(mockResponse);
      expect(mockUserService.findAllUsers).toHaveBeenCalledWith(1, 10, '');
    });

    it('should handle errors and throw InternalServerErrorException', async () => {
      mockUserService.findAllUsers.mockRejectedValue(new Error('Failed to retrieve users'));

      await expect(userController.getAllUsers('1', '10', '')).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('getUserById', () => {
    it('should return a user when ID is valid', async () => {
      const mockUser = { id: 1, name: 'Test User' };
      mockUserService.findUserById.mockResolvedValue(mockUser);

      const result = await userController.getUserById('1');

      expect(result).toEqual(mockUser);
      expect(mockUserService.findUserById).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when user ID is not found', async () => {
      mockUserService.findUserById.mockRejectedValue(new NotFoundException('User not found'));

      await expect(userController.getUserById('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('createUser', () => {
    it('should create a new user and return the user details', async () => {
      const mockUser = { name: 'New', surname: 'User', email: 'newuser@example.com' };
      const mockCreatedUser = { id: 1, ...mockUser, password: undefined };
      mockUserService.createUser.mockResolvedValue(mockCreatedUser);

      const result = await userController.createUser(mockUser);

      expect(result).toEqual(mockCreatedUser);
      expect(mockUserService.createUser).toHaveBeenCalledWith(mockUser);
    });

    it('should handle errors and throw InternalServerErrorException', async () => {
      mockUserService.createUser.mockRejectedValue(new Error('Failed to create user'));

      await expect(userController.createUser({})).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('updateUser', () => {
    it('should update the user and return updated user details', async () => {
      const mockUser = { id: 1, name: 'Updated Name' };
      mockUserService.updateUser.mockResolvedValue(mockUser);

      const result = await userController.updateUser({ id: '1', name: 'Updated Name' });

      expect(result).toEqual(mockUser);
      expect(mockUserService.updateUser).toHaveBeenCalledWith(1, { name: 'Updated Name' });
    });

    it('should throw BadRequestException when "id" is missing in request body', async () => {
      await expect(userController.updateUser({ name: 'Updated Name' })).rejects.toThrow(BadRequestException);
    });

    it('should handle errors and throw InternalServerErrorException', async () => {
      mockUserService.updateUser.mockRejectedValue(new Error('Failed to update user'));

      await expect(userController.updateUser({ id: '1', name: 'Updated Name' })).rejects.toThrow(InternalServerErrorException);
    });
  });
});
