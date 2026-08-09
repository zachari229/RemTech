import {
  Controller, Post, Get, Patch, Delete, Body, Param, UseGuards, ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ModulesFeatureService } from './modules-feature.service';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Modules')
@Controller()
export class ModulesFeatureController {
  constructor(private readonly modulesService: ModulesFeatureService) {}

  @Post('courses/:courseId/modules')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: "Ajouter un module à une formation (Admin)" })
  create(@Param('courseId', ParseIntPipe) courseId: number, @Body() dto: CreateModuleDto) {
    return this.modulesService.create(courseId, dto);
  }

  @Get('courses/:courseId/modules')
  @ApiOperation({ summary: "Liste des modules d'une formation" })
  findAllForCourse(@Param('courseId', ParseIntPipe) courseId: number) {
    return this.modulesService.findAllForCourse(courseId);
  }

  @Patch('modules/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Modifier un module (Admin)' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateModuleDto) {
    return this.modulesService.update(id, dto);
  }

  @Delete('modules/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Supprimer un module (Admin)' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.modulesService.remove(id);
  }
}