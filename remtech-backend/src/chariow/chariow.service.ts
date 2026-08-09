import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import axios from 'axios';

interface ChariowCheckoutPayload {
  product_id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: {
    number: string;
    country_code: string;
  };
  redirect_url?: string;
  custom_metadata?: Record<string, string>;
}

@Injectable()
export class ChariowService {
  private readonly logger = new Logger(ChariowService.name);
  private readonly apiKey = process.env.CHARIOW_API_KEY;
  private readonly apiUrl = process.env.CHARIOW_API_URL || 'https://api.chariow.com/v1';

  async initiateCheckout(payload: ChariowCheckoutPayload) {
    try {
      const response = await axios.post(`${this.apiUrl}/checkout`, payload, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      return response.data;
    } catch (error: any) {
      this.logger.error(
        'Erreur lors de l\'initiation du paiement Chariow',
        error.response?.data || error.message,
      );

      const chariowMessage = error.response?.data?.message;
      throw new BadRequestException(
        chariowMessage || 'Impossible de créer la session de paiement',
      );
    }
  }
  async verifySale(saleId: string): Promise<{ valid: boolean; status?: string }> {
    try {
      const response = await axios.get(`${this.apiUrl}/sales/${saleId}`, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
      });

      const sale = response.data?.data;
      return {
        valid: true,
        status: sale?.status,
      };
    } catch (error: any) {
      this.logger.error(
        `Impossible de vérifier la vente Chariow ${saleId}`,
        error.response?.data || error.message,
      );
      return { valid: false };
    }
  }
}