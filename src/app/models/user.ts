export class User {
  userId: number = 0;
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  isAdmin: boolean = false;
  passwordHash: string | null = null;
  passwordSalt: string | null = null;
  postalCodeId: number = 0;
}
