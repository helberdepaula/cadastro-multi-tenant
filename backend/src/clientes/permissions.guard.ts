// src/modules/users/permissions.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { ClientesService } from './clientes.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    public readonly clientesService: ClientesService,
    public readonly accessLevel: string,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user?.id) {
      throw new ForbiddenException('Usuário não autenticado');
    }

    const role = user.role;

    if (role === 'ADMIN') return true;

    if (role === 'USER') return true;

    if (role === 'GUEST') {
      if ( this.accessLevel !== 'READ') {
        throw new ForbiddenException('Usuário GUEST só pode visualizar clientes');
      }
      return true;
    }

    throw new ForbiddenException('Permissão insuficiente');
  }
}


export function createPermissionsGuard(accessLevel: string) {
  @Injectable()
  class DynamicPermissionsGuard extends PermissionsGuard {
    constructor(clientesService: ClientesService) {
      super(clientesService,  accessLevel);
    }
  }
  return DynamicPermissionsGuard;
}
