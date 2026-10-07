import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';

import { AdminContentGuard } from './admin-content.guard.js';
import { ContentService } from './content.service.js';

@Controller('v1/content')
export class ContentController {
  constructor(private readonly content: ContentService) {}

  @Get('menu/:slug')
  async getMenu(@Param('slug') slug: string) {
    const data = await this.content.getMenu(slug);
    if (!data) throw new NotFoundException('Published menu was not found');
    return { data };
  }

  @Get('story/:slug')
  async getStory(@Param('slug') slug: string) {
    const data = await this.content.getStory(slug);
    if (!data) throw new NotFoundException('Published story was not found');
    return { data };
  }

  @Get('gallery')
  async getGallery(@Query('category') category?: string) {
    const data = await this.content.getGallery(category);
    if (!data) throw new NotFoundException('Published gallery was not found');
    return { data };
  }

  @Get('home/:slug')
  async getHome(@Param('slug') slug: string) {
    const data = await this.content.getHome(slug);
    if (!data)
      throw new NotFoundException('Published Home content was not found');
    return { data };
  }

  @Get('media/:id')
  async getMedia(@Param('id') id: string) {
    const data = await this.content.getMedia(id);
    if (!data) throw new NotFoundException('Published media was not found');
    return { data };
  }

  @Get('private-dining/:slug')
  async getPrivateDining(@Param('slug') slug: string) {
    const data = await this.content.getPrivateDining(slug);
    if (!data)
      throw new NotFoundException(
        'Published Private Dining content was not found',
      );
    return { data };
  }
}

@Controller('v1/admin/content')
@UseGuards(AdminContentGuard)
export class AdminContentController {
  constructor(private readonly content: ContentService) {}

  @Get(':type')
  async listDocuments(@Param('type') type: string) {
    return { data: await this.content.listAdminDocuments(type) };
  }

  @Get(':type/:slug')
  async getDocument(@Param('type') type: string, @Param('slug') slug: string) {
    return { data: await this.content.getAdminDocument(type, slug) };
  }

  @Put(':type/:slug/draft')
  async saveDraft(
    @Param('type') type: string,
    @Param('slug') slug: string,
    @Body() body: unknown,
  ) {
    return { data: await this.content.saveDraft(type, slug, body) };
  }

  @Post(':type/:slug/publish')
  async publish(@Param('type') type: string, @Param('slug') slug: string) {
    return { data: await this.content.publish(type, slug) };
  }

  @Post(':type/:slug/archive')
  async archive(@Param('type') type: string, @Param('slug') slug: string) {
    return { data: await this.content.archive(type, slug) };
  }
}
