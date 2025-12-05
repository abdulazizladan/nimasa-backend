import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { Info } from './entities/info.entity';
import { Contact } from './entities/contact.entity';
import { Status } from './enums/status.enum';
import { Role } from './enums/role.enum';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Info)
    private readonly infoRepository: Repository<Info>,
    @InjectRepository(Contact)
    private readonly contactRepository: Repository<Contact>
  ) { }

  /**
   * Creates a new user in the database, including related contact and info.
   * @param createUserDto - DTO containing user, contact, and info details
   * @returns An object indicating success or failure, the user data, and a message
   */
  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await User.hashPassword(createUserDto.password);
    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
      contact: await this.contactRepository.save(createUserDto.contact),
      info: await this.infoRepository.save(createUserDto.info)
    });
    return this.userRepository.save(user);
  }

  /**
   * Retrieves statistics about users by status and roles.
   * @returns An object containing user stats and a message
   */
  async getStats() {
    const totalUsers = await this.userRepository.count()
    const activeUsers = await this.userRepository.countBy({ status: Status.active })
    const suspendedUsers = await this.userRepository.countBy({ status: Status.suspended })
    const removedUsers = await this.userRepository.countBy({ status: Status.removed })
    const adminCount = await this.userRepository.countBy({ role: Role.admin })
    const guestsCount = await this.userRepository.countBy({ role: Role.guest })

    return {
      total: totalUsers,
      active: activeUsers,
      suspended: suspendedUsers,
      removed: removedUsers,
      admin: adminCount,
      guests: guestsCount
    };
  }

  /**
   * Retrieves all users, including their info, contact, and station relations.
   * @returns An object with users array and a message
   */
  async findAll() {
    const users = await this.userRepository.find({
      relations: [
        'info',
        'contact',
      ],
      select: [
        'email',
        'contact',
        'info',
        'role',
        'status'
      ]
    });
    return users;
  }

  /**
   * Retrieves a single user by email, including info, contact, reports, and tickets.
   * @param email - The email of the user
   * @returns An object with the user or not found message
   */
  async findOne(email: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email },
      relations: [
        'info',
        'contact',
        //'reports',
        //'tickets',
      ]
    });

    if (!user) {
      throw new NotFoundException(`User with email "${email}" not found.`);
    }

    return user;
  }

  /**
   * Finds a user by email.
   * @param email - The email of the user
   * @returns An object with the user or a message if not found
   */
  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email }
    });

    if (!user) {
      throw new NotFoundException(`User with email "${email}" not found.`);
    }

    return user;
  }

  /**
   * Updates a user by email.
   * @param email - The email of the user
   * @param updateUserDto - DTO containing updated user data
   * @returns An object indicating success or failure and a message
   */
  async update(email: string, updateUserDto: UpdateUserDto): Promise<User> {
    // 1. Attempt the update directly based on the email (where clause).
    const updateResult: UpdateResult = await this.userRepository.update(
      { email: email },
      updateUserDto,
    );

    // 2. Check the result: If no row was affected, the user was not found.
    //    Throwing a NestJS exception handles the 404 HTTP response automatically.
    if (updateResult.affected === 0) {
      throw new NotFoundException(`User with email "${email}" not found.`);
    }

    // 3. If the update succeeded, fetch the full, updated entity with relations.
    const updatedUser = await this.userRepository.findOne({
      where: { email },
      relations: ['info', 'contact'],
    });

    // Since 'affected' was greater than 0, we can safely assume updatedUser exists.
    // But updatedUser may still be null at the type level. Add a check to ensure type safety.
    if (!updatedUser) {
      // This is a very rare edge case but should be handled for correctness.
      throw new NotFoundException(`User with email "${email}" not found after update.`);
    }
    return updatedUser;
  }

  /**
   * Deletes a user by email.
   * @param email - The email of the user
   * @returns An object indicating success or failure and a message
   */
  async remove(email: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundException(`User with email "${email}" not found.`);
    }

    await this.userRepository.remove(user);
  }
}
