import { AppController } from './app.controller';

describe('AppController', () => {
  const controller = new AppController();

  it('health returns status and service name', () => {
    expect(controller.health()).toEqual({ status: 'ok', service: 'mcp-service' });
  });
});
