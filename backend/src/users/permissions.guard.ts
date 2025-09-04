// src/modules/users/permissions.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { UsersService } from './users.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    public readonly usersService: UsersService,
    public readonly accessLevel: string,
  ) { }

  /*
  * ADMIN: pode tudo
  * USER: pode cadastrar, editar e visualizar clientes, e apenas visualizar usuários
  * GUEST: pode apenas visualizar a lista de clientes
  */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user?.id) {
      throw new ForbiddenException('Usuário não autenticado');
    }

    const role = user.role;

    if (role === 'ADMIN') return true;

    if (role === 'USER') {
      if (this.accessLevel !== 'READ') {
        throw new ForbiddenException('Usuário USER só pode visualizar usuários');
      }
      return true;
    }

    if (role === 'GUEST') {
      if (this.accessLevel === 'READ') {
        return true;
      }
      throw new ForbiddenException('Usuário GUEST só pode visualizar clientes');
    }

    throw new ForbiddenException('Permissão insuficiente');
  }
}

export function createPermissionsGuard(accessLevel: string) {
  @Injectable()
  class DynamicPermissionsGuard extends PermissionsGuard {
    constructor(usersService: UsersService) {
      super(usersService, accessLevel);
    }
  }
  return DynamicPermissionsGuard;
}
