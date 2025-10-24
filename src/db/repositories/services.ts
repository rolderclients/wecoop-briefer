import { BaseRepository } from './base';

export interface Service {
  id: string;
  title: string;
  archived: boolean;
  time: {
    created: string;
    updated: string;
  };
}

export class ServicesRepository extends BaseRepository<Service> {
  constructor() {
    super('service');
  }

  /**
   * Get all services
   */
  async getServices(): Promise<Service[]> {
    return this.getAll();
  }

  /**
   * Create new prompt
   */
  async createService(
    serviceData: Omit<Service, 'id' | 'time'>,
  ): Promise<Service> {
    return this.create(serviceData);
  }

  /**
   * Update existing service
   */
  async updateService(
    id: string,
    updates: Partial<Omit<Service, 'id' | 'time'>>,
  ): Promise<Service> {
    return this.update(id, updates);
  }

  /**
   * Delete service
   */
  async deleteService(id: string): Promise<void> {
    return this.delete(id);
  }

  /**
   * Get service by ID
   */
  async getServiceById(id: string): Promise<Service | null> {
    return this.getById(id);
  }
}

// Export singleton instance
export const servicesRepository = new ServicesRepository();
