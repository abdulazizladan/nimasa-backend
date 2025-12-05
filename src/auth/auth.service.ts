import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {

  constructor(
    private usersService: UserService,
    private jwtService: JwtService
  ) { }

  /**
   * 
   * @param userData 
   * @returns 
   */
  async validateUser(loginDto: LoginDto): Promise<any> {
    // Retrieve user including the password field
    try {
      const user = await this.usersService.findByEmail(loginDto.email);
      // Since findByEmail throws if not found, we will have a user here
      if (user && await bcrypt.compare(loginDto.password, user.password)) {
        const { password, ...result } = user;
        // console.log(result)
        return result;
      }
    } catch (error) {
      // If user not found, return null to indicate invalid credentials
      return null;
    }
    return null;
  }

  /**
   *
   * @param loginDto
   * @returns
   */
  async login(loginDto: LoginDto) {
    try {
      const user = await this.usersService.findByEmail(loginDto.email);
      const match = await bcrypt.compare(loginDto.password, user.password);
      if (!match) {
        throw new UnauthorizedException();
      }

      const payload = {
        email: user.email,
        sub: user.id,
        role: user.role
      };
      return {
        access_token: this.jwtService.sign(payload)
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid credentials');
    }
  }
}
