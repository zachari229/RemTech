import {
  Controller,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Étudiant — son profil
  @Get('profile')
  @ApiOperation({ summary: 'Mon profil' })
  getProfile(@CurrentUser() user: any) {
    return this.usersService.getProfile(user.id);
  }

  // Étudiant — modifier son profil
  @Patch('profile')
  @ApiOperation({ summary: 'Modifier mon profil' })
  updateProfile(@CurrentUser() user: any, @Body() dto: UpdateProfileDto) {
    return this.usersService.updateProfile(user.id, dto);
  }

  // Étudiant — ses commandes
  @Get('my-orders')
  @ApiOperation({ summary: 'Mes commandes' })
  getMyOrders(@CurrentUser() user: any) {
    return this.usersService.getMyOrders(user.id);
  }

  // Étudiant — ses formations
  @Get('my-enrollments')
  @ApiOperation({ summary: 'Mes formations achetées' })
  getMyEnrollments(@CurrentUser() user: any) {
    return this.usersService.getMyEnrollments(user.id);
  }

  // Admin — liste des étudiants
  @Get()
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Liste des étudiants (Admin)' })
  @ApiQuery({ name: 'search', required: false })
  findAll(@Query('search') search?: string) {
    return this.usersService.findAll(search);
  }

  // Admin — voir un étudiant
  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Voir un étudiant (Admin)' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  // Admin — suspendre/activer
  @Patch(':id/toggle-status')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Suspendre/Activer un étudiant (Admin)' })
  toggleStatus(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.toggleStatus(id);
  }

  // Admin — supprimer
  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Supprimer un étudiant (Admin)' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }
}