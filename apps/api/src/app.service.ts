import { Injectable } from '@nestjs/common';
import type { ApiStatus } from '@ember-and-oak/types';

@Injectable()
export class AppService {
  getAppInfo(): ApiStatus {
    return {
      name: 'ember-and-oak-api',
      status: 'ok',
    };
  }
}
