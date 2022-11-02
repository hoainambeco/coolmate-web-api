import { Test, TestingModule } from '@nestjs/testing';
import { OdersController } from './oders.controller';
import { OdersService } from './oders.service';

describe('OdersController', () => {
  let controller: OdersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OdersController],
      providers: [OdersService],
    }).compile();

    controller = module.get<OdersController>(OdersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
