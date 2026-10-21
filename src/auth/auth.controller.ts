import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { User } from 'src/user/entities/user.entity';
import { Role } from './enums/role.enum';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { ApiOperation, ApiTags, ApiBody, ApiOkResponse, ApiCreatedResponse, ApiUnauthorizedResponse, ApiBadRequestResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './roles.guard';
import { Roles } from './roles.decorator';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {

    constructor(
        private readonly  authService: AuthService
    ){

    }

    /**
     * Login to the system with email and password.
     * @param user - Login credentials
     * @returns JWT token and user information
     */
    @ApiOperation({
            summary: 'Login',
        description: 'Login to the system with email and password'
    })
    @ApiOkResponse({
        description: 'Login successful',
        schema: {
            type: 'object',
            properties: {
                access_token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
                user: {
                    type: 'object',
                    properties: {
                        id: { type: 'number', example: 1 },
                        email: { type: 'string', example: 'abdulazizladan@gmail.com' },
                        role: { type: 'string', example: 'admin' },
                        status: { type: 'string', example: 'active' }
                    }
                }
            }
        }
    })
    @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
    @ApiBadRequestResponse({ description: 'Invalid input data' })
    @ApiBody({
        type: LoginDto,
        examples: {
            admin: {
                summary: 'Admin Login',
                description: 'Login as admin user',
                value: {
                    email: 'abdulazizladan@gmail.com',
                    password: 'password'
                }
            },
            guest: {
                summary: 'Guest Login',
                description: 'Login as guest user',
                value: {
                    email: 'guest@example.com',
                    password: 'password'
                }
            }
        }
    })
    @Post("login")
    login(@Body() user: LoginDto) {
        return this.authService.login(user);
    }

    @ApiOperation({
        summary: "User registration",
        description: "Registers a new admin or guest user in the system. Admin only"
    })
    @ApiCreatedResponse({
        description: 'User successfully created'
    })
    @ApiBadRequestResponse({ 
        description: 'Invalid input data or email already exists' 
    })
    @ApiBody({
        type: CreateUserDto,
        examples: {
            admin: {
                summary: 'New Admin User',
                description: 'Register a new admin user',
                value: {
                    email: 'iibrahimbuba@gmail.com',
                    password: 'password',
                    role: 'admin',
                    status: 'active',
                    info: {
                        firstName: 'Ibrahim',
                        lastName: 'Buba'
                    },
                    contact: {
                        phone: '0000000000'
                    }
                }
            }
        }
    })
    // Creating accounts is an admin task; login stays open
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.admin)
    @ApiBearerAuth()
    @Post("register")
    register(@Body() user: CreateUserDto) {
        return this.authService.register(user);
    }
   
    /**
     * Reset user password.
     * @returns Password reset response
     */
    @ApiOperation({
            summary: "Password reset",
        description: "Reset user password"
    })
    @ApiOkResponse({
        description: 'Password reset successful',
        schema: {
            type: 'object',
            properties: {
                success: { type: 'boolean', example: true },
                message: { type: 'string', example: 'Password reset email sent successfully' }
            }
        }
    })
    @ApiBadRequestResponse({ description: 'Invalid email address' })
    @Post("reset-password")
    resetPassword(@Body() body: { email: string }) {
        // TODO: Implement password reset functionality
        return {
            success: true,
            message: 'Password reset email sent successfully to ' + body.email
        };
    }
}
