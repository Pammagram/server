import { AuthService } from '@modules/auth';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DummyService {
  constructor(private readonly authService: AuthService) {}
}
