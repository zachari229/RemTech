import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Headers,
  UseGuards,
  ParseIntPipe,
  HttpCode,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { ChariowWebhookDto } from './dto/chariow-webhook.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // Étudiant — créer une commande
  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Créer une commande' })
  create(@CurrentUser() user: any, @Body() dto: CreateOrderDto) {
    return this.ordersService.create(user.id, dto);
  }

 // Webhook PUBLIC — reçoit les notifications Chariow (Pulses)
  // Sécurisé par un token secret dans l'URL (Chariow ne fournit pas de signature HMAC)
  @Post('webhook/chariow/:token')
  @HttpCode(200)
  @ApiOperation({ summary: 'Webhook Chariow (Pulse) — appelé par Chariow, pas par le frontend' })
  handleChariowWebhook(
    @Param('token') token: string,
    @Body() payload: ChariowWebhookDto,
  ) {
    return this.ordersService.handleChariowWebhook(payload, token);
  }

  // Étudiant — ses commandes
  @Get('my-orders')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Mes commandes' })
  findMyOrders(@CurrentUser() user: any) {
    return this.ordersService.findMyOrders(user.id);
  }

  // Admin — toutes les commandes
  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Toutes les commandes (Admin)' })
  findAll() {
    return this.ordersService.findAll();
  }

  // Admin — voir une commande
  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Voir une commande (Admin)' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.findOne(id);
  }
}