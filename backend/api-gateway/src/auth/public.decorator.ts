import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

/** Routes marked @Public() skip JWT auth (e.g. health, login). */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
