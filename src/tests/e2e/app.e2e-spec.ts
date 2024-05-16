import { expect } from '@jest/globals';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as httpRequest from 'supertest';

import { initializeApp } from './utils/bootstrap';

describe('Cats', () => {
  let app: INestApplication;

  beforeEach(async () => {
    app = await initializeApp();
  });

  it('Server starts', async () => {
    const response = await httpRequest(app.getHttpServer()).get('/alive');

    expect(response.status).toBe(HttpStatus.OK);
  });

  afterAll(async () => {
    await app.close();
  });
});
