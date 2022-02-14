import UserModel from "../../data/models/UserModel";
import { AddUser } from "../../data/usecases/RegisterUser";
import { Prisma, PrismaClient } from "@prisma/client";
import EncryptAdapter from "../../adapters/services/EncryptAdapter";
import UserDAOImp from "./UserDAOImp";

export default class UserRepository extends UserDAOImp<
  UserModel,
  Prisma.UserFindUniqueArgs,
  Prisma.UserUpdateInput,
  Prisma.UserDeleteArgs
> implements AddUser {
  private readonly encrypter: EncryptAdapter;

  constructor(encrypter: EncryptAdapter) {
    const prisma = new PrismaClient();
    super(prisma.user);
    this.encrypter = encrypter;
  }

  async addUser(req: UserModel): Promise<Omit<UserModel, "password">> {
    const { email, name, password } = req;
    const hash = await this.encrypter.encrypt(password);
    const result = await this.add({ email, name, password: hash }) as Omit<UserModel, "password">

    return {
      email: result.email,
      name: result.name,
    };
  }
} 