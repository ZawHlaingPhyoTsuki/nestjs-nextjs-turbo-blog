import { Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { hash } from 'argon2';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserInput: CreateUserInput) {
    const { password, ...user } = createUserInput;
    const hasedPassword = await hash(password);

    return this.prisma.user.create({
      data: {
        password: hasedPassword,
        ...user,
      },
    });
  }
}
