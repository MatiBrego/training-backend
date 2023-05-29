export class UserDTO {
  
  constructor(user: UserDTO) {
    this.id = user.id;
    this.name = user.name;
    this.createdAt = user.createdAt;
    this.isPrivate = user.isPrivate;
  }

  id: string;
  name: string | null;
  createdAt: Date;
  isPrivate: boolean;
}

export class ExtendedUserDTO extends UserDTO {

  constructor(user: ExtendedUserDTO) {
    super(user)
    this.email = user.email;
    this.name = user.name;
    this.password = user.password;
    this.profile = user.profile
  }

  email!: string;
  username!: string;
  password!: string;
  profile?: string
}
