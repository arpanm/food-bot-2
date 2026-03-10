import { Injectable, NotFoundException } from '@nestjs/common';
import type { CampaignDto, CreateCampaignDto, SegmentDto, UpdateCampaignDto } from './dto/campaign.dto';

@Injectable()
export class CampaignsService {
  private campaigns = new Map<string, CampaignDto & { id: string }>();
  private segments = new Map<string, SegmentDto & { id: string }>();
  private nextCampaignId = 1;
  private nextSegmentId = 1;

  listCampaigns(restaurantId: string): (CampaignDto & { id: string })[] {
    return Array.from(this.campaigns.values()).filter((c) => c.restaurantId === restaurantId);
  }

  getCampaign(restaurantId: string, id: string): (CampaignDto & { id: string }) | null {
    const c = this.campaigns.get(id);
    return c && c.restaurantId === restaurantId ? c : null;
  }

  createCampaign(restaurantId: string, dto: CreateCampaignDto): CampaignDto & { id: string } {
    const id = `camp-${this.nextCampaignId++}`;
    const now = new Date().toISOString();
    const campaign: CampaignDto & { id: string } = {
      id,
      restaurantId,
      name: dto.name,
      title: dto.title,
      body: dto.body,
      ctaLabel: dto.ctaLabel,
      ctaUrl: dto.ctaUrl,
      imageUrl: dto.imageUrl,
      segmentId: dto.segmentId,
      channels: dto.channels,
      startAt: dto.startAt,
      endAt: dto.endAt,
      active: dto.active ?? true,
      createdAt: now,
    };
    this.campaigns.set(id, campaign);
    return { ...campaign };
  }

  updateCampaign(restaurantId: string, id: string, dto: UpdateCampaignDto): CampaignDto & { id: string } {
    const c = this.getCampaign(restaurantId, id);
    if (!c) throw new NotFoundException('Campaign not found');
    Object.assign(c, dto);
    return { ...c };
  }

  deleteCampaign(restaurantId: string, id: string): void {
    const c = this.getCampaign(restaurantId, id);
    if (!c) throw new NotFoundException('Campaign not found');
    this.campaigns.delete(id);
  }

  listSegments(restaurantId: string): (SegmentDto & { id: string })[] {
    return Array.from(this.segments.values()).filter((s) => s.restaurantId === restaurantId);
  }

  createSegment(restaurantId: string, dto: { name: string; description?: string; rule?: string }): SegmentDto & { id: string } {
    const id = `seg-${this.nextSegmentId++}`;
    const now = new Date().toISOString();
    const seg: SegmentDto & { id: string } = {
      id,
      restaurantId,
      name: dto.name,
      description: dto.description,
      rule: dto.rule,
      createdAt: now,
    };
    this.segments.set(id, seg);
    return { ...seg };
  }
}
