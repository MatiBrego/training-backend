import { NotFoundException } from '@utils/errors';
import { OffsetPagination } from 'types';
import { UserDTO } from '../dto';
import { UserRepository } from '../repository';
import { UserService } from './user.service';
import {generateDownloadUrl, generateUploadURL} from "@utils/aws";

export class UserServiceImpl implements UserService {
  constructor(private readonly repository: UserRepository) {}

  async getUser(userId: string): Promise<UserDTO> {
    const user = await this.repository.getById(userId);
    if (!user) throw new NotFoundException('user');
    return user;
  }

  getUserRecommendations(userId: any, options: OffsetPagination): Promise<UserDTO[]> {
    // TODO: make this return only users followed by users the original user follows
    return this.repository.getRecommendedUsersPaginated(options);
  }

  deleteUser(userId: any): Promise<void> {
    return this.repository.delete(userId);
  }

  makeUserPrivate(userId: string): Promise<UserDTO> {
    return this.repository.updatePrivacy(userId, true);
  }

  makeUserPublic(userId: string): Promise<UserDTO> {
    return this.repository.updatePrivacy(userId, false);
  }

  async addProfilePic(userId: string): Promise<string>{
    await this.repository.updateProfilePic(userId)

    return await generateUploadURL(userId)
  }

  async getProfilePic(userId: string): Promise<string>{
    const key = await this.repository.getProfilePic(userId)

    if(!key) throw new NotFoundException("user");

    return await generateDownloadUrl(key)
  }
}
