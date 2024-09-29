import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Query,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number for pagination',
  })
  @ApiQuery({
    name: 'pageSize',
    required: false,
    description: 'Number of items per page',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search query for filtering users',
  })
  async getAllUsers(
    @Query('page') page = '1',
    @Query('pageSize') pageSize = '10',
    @Query('search') search = '',
  ) {
    try {
      const pageNumber = parseInt(page, 10);
      const pageSizeNumber = parseInt(pageSize, 10);
      return await this.userService.findAllUsers(
        pageNumber,
        pageSizeNumber,
        search,
      );
    } catch (err) {
      console.error('Error in getAllUsers:', err);
      throw new InternalServerErrorException('Failed to retrieve users');
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'id', description: 'User ID', type: 'number' })
  async getUserById(@Param('id') id: number) {
    try {
      return await this.userService.findUserById(id);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Post('save')
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({
    description: 'User data',
    type: Object,
    examples: {
      example1: {
        summary: 'User Data Example',
        value: {
          name: 'John',
          surname: 'Doe',
          email: 'john.doe@example.com',
          password: 'securePassword123',
          phone: '123456789',
          age: 30,
          country: 'USA',
          district: 'California',
          role: 'admin',
        },
      },
    },
  })
  async createUser(@Body() user: any) {
    try {
      return await this.userService.createUser(user);
    } catch (err) {
      console.error('Error in createUser:', err);
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  @Post('update')
  @ApiOperation({ summary: 'Update an existing user' })
  @ApiBody({
    description: 'Updated user data',
    type: Object,
  })
  async updateUser(@Body() body: any) {
    try {
      const { id, ...updatedFields } = body;
      if (!id) {
        throw new BadRequestException('Field "id" is missing');
      }

      const userId = parseInt(id, 10);

      return await this.userService.updateUser(userId, updatedFields);
    } catch (error) {
      console.error('Error in updateUser:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update user');
    }
  }
}
