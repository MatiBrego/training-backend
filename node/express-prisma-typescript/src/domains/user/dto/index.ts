export class UserDTO {
  
  constructor(user: UserDTO) {
    this.id = user.id;
    this.name = user.name;
    this.createdAt = user.createdAt;
  }

  id: string;
  name: string | null;
  createdAt: Date;
}

export class ExtendedUserDTO extends UserDTO {

  constructor(user: ExtendedUserDTO) {
    super(user)
    this.email = user.email;
    this.name = user.name;
    this.password = user.password;
  }

  email!: string;
  username!: string;
  password!: string;
}
