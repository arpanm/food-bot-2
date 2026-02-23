import { BadRequestException, Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import {
  ApprovalDecisionDto,
  CreateRestaurantDto,
  SignContractDto,
  UploadDocsDto,
} from './dto/onboarding.dto';
import { OnboardingService } from './onboarding.service';

@Controller('onboarding')
export class OnboardingController {
  constructor(private readonly onboarding: OnboardingService) {}

  @Post('restaurants')
  create(@Body() dto: CreateRestaurantDto) {
    return this.onboarding.create(dto);
  }

  @Get('restaurants/:id')
  get(@Param('id') id: string) {
    return this.onboarding.getOrThrow(id);
  }

  @Patch('restaurants/:id/documents')
  uploadDocs(@Param('id') id: string, @Body() dto: UploadDocsDto) {
    try {
      return this.onboarding.uploadDocs(id, dto);
    } catch (e) {
      throw new BadRequestException((e as Error).message);
    }
  }

  @Post('restaurants/:id/contract')
  signContract(@Param('id') id: string, @Body() dto: SignContractDto) {
    try {
      return this.onboarding.signContract(id, dto);
    } catch (e) {
      throw new BadRequestException((e as Error).message);
    }
  }

  @Post('restaurants/:id/approval')
  approvalDecision(@Param('id') id: string, @Body() dto: ApprovalDecisionDto) {
    try {
      return this.onboarding.approvalDecision(id, dto);
    } catch (e) {
      throw new BadRequestException((e as Error).message);
    }
  }
}
