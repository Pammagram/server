import { Config } from '@config';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';

export const FIREBASE_APP = 'FIREBASE_APP';

const firebaseProvider = {
  provide: FIREBASE_APP,
  inject: [ConfigService],
  useFactory: (configService: ConfigService<Config>) => {
    const firebaseConfig = configService.getOrThrow('firebase', {
      infer: true,
    });

    return admin.initializeApp({
      credential: admin.credential.cert(firebaseConfig),
    });
  },
};

@Module({
  imports: [ConfigModule],
  providers: [firebaseProvider],
  exports: [FIREBASE_APP],
})
export class FirebaseModule {}
