import UserModel from "../data/models/UserModel";
import { AddUser } from "../data/usecases/RegisterUser";
import GenericDAOImp from "../infra/DAO/GenericDAOImp";
import { Prisma, PrismaClient } from "@prisma/client";

export default class UserRepository extends GenericDAOImp<
  UserModel,
  Prisma.UserFindUniqueArgs,
  Prisma.UserUpdateInput,
  Prisma.UserDeleteArgs
> implements AddUser {
  constructor() {
    const prisma = new PrismaClient()
    super(prisma.user);
  }

  async addUser(req: UserModel): Promise<Omit<UserModel, "password">> {
    const result = await this.add(req) as Omit<UserModel, "password">
    return result;
  }
} 