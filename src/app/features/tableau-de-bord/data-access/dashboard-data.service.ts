import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

/**
 * ⚠️ IMPORTANT : DONNÉES STATIQUES TEMPORAIRES
 * 
 * Ce service utilise des données statiques pour le développement.
 * 
 * TODO: Remplacer par des appels API réels :
 * - GET /api/v1/dashboard/statistics
 * - GET /api/v1/dashboard/recent-orders
 * - GET /api/v1/dashboard/low-stock-products
 * - GET /api/v1/dashboard/top-selling-products
 * - GET /api/v1/dashboard/revenue-chart
 */

export interface DashboardStatistics {
  total_revenue: number;
  total_orders: number;
  total_stores: number;
  total_users: number;
  total_products: number;
}

export interface RecentOrder {
  id: number;
  order_id: string;
  created_at: string;
  consumer_name: string;
  total: number;
  order_payment_status: string;
}

export interface ProductStock {
  id: number;
  product_thumbnail: string;
  name: string;
  quantity: number;
  stock: string;
}

export interface TopProduct {
  id: number;
  name: string;
  product_thumbnail: any;
  created_at: string;
  sale_price: number;
  orders_count: number;
  quantity: number;
  order_amount: number;
}

export interface TopStore {
  id: number;
  store_name: string;
  orders_count: number;
  order_amount: number;
}

export interface Review {
  id: number;
  product: {
    name: string;
    product_thumbnail: any;
  };
  consumer: {
    name: string;
  };
  rating: number;
}

export interface Blog {
  id: number;
  title: string;
  blog_thumbnail: any;
  created_at: string;
}

@Injectable({
  providedIn: 'root',
})
export class DashboardDataService {

  constructor() {
    console.log('⚠️ DashboardDataService : Utilisation de données statiques temporaires');
  }

  /**
   * Obtenir les statistiques du tableau de bord
   * TODO: Remplacer par GET /api/v1/dashboard/statistics
   */
  getStatistics(): Observable<DashboardStatistics> {
    const statistics: DashboardStatistics = {
      total_revenue: 85420.50,
      total_orders: 342,
      total_stores: 8,
      total_users: 156,
      total_products: 89,
    };

    return of(statistics).pipe(delay(500)); // Simuler un délai réseau
  }

  /**
   * Obtenir les commandes récentes
   * TODO: Remplacer par GET /api/v1/dashboard/recent-orders
   */
  getRecentOrders(): Observable<RecentOrder[]> {
    const orders: RecentOrder[] = [
      {
        id: 1,
        order_id: '#AE001',
        created_at: '2025-10-12T10:30:00Z',
        consumer_name: 'Sophie Martin',
        total: 125.50,
        order_payment_status: 'Payé',
      },
      {
        id: 2,
        order_id: '#AE002',
        created_at: '2025-10-12T11:15:00Z',
        consumer_name: 'Jean Dupont',
        total: 89.99,
        order_payment_status: 'En attente',
      },
      {
        id: 3,
        order_id: '#AE003',
        created_at: '2025-10-12T12:00:00Z',
        consumer_name: 'Marie Leroy',
        total: 210.00,
        order_payment_status: 'Payé',
      },
      {
        id: 4,
        order_id: '#AE004',
        created_at: '2025-10-12T14:20:00Z',
        consumer_name: 'Pierre Dubois',
        total: 45.75,
        order_payment_status: 'Payé',
      },
      {
        id: 5,
        order_id: '#AE005',
        created_at: '2025-10-12T15:45:00Z',
        consumer_name: 'Claire Petit',
        total: 156.30,
        order_payment_status: 'En attente',
      },
      {
        id: 6,
        order_id: '#AE006',
        created_at: '2025-10-12T16:10:00Z',
        consumer_name: 'Thomas Bernard',
        total: 78.90,
        order_payment_status: 'Payé',
      },
      {
        id: 7,
        order_id: '#AE007',
        created_at: '2025-10-12T17:30:00Z',
        consumer_name: 'Emma Rousseau',
        total: 198.50,
        order_payment_status: 'Payé',
      },
    ];

    return of(orders).pipe(delay(500));
  }

  /**
   * Obtenir les produits avec stock faible
   * TODO: Remplacer par GET /api/v1/dashboard/low-stock-products
   */
  getLowStockProducts(): Observable<ProductStock[]> {
    const products: ProductStock[] = [
      {
        id: 1,
        product_thumbnail: 'assets/images/product.png',
        name: 'Huile Essentielle Lavande Bio 10ml',
        quantity: 5,
        stock: 'Stock faible',
      },
      {
        id: 2,
        product_thumbnail: 'assets/images/product.png',
        name: 'Diffuseur Ultrasonique Aroma',
        quantity: 3,
        stock: 'Stock critique',
      },
      {
        id: 3,
        product_thumbnail: 'assets/images/product.png',
        name: 'Bougie Parfumée Rose & Vanille',
        quantity: 8,
        stock: 'Stock faible',
      },
      {
        id: 4,
        product_thumbnail: 'assets/images/product.png',
        name: 'Huile de Massage Relaxante 250ml',
        quantity: 6,
        stock: 'Stock faible',
      },
      {
        id: 5,
        product_thumbnail: 'assets/images/product.png',
        name: 'Coffret Découverte 5 Huiles',
        quantity: 2,
        stock: 'Stock critique',
      },
    ];

    return of(products).pipe(delay(500));
  }

  /**
   * Obtenir les produits les plus vendus
   * TODO: Remplacer par GET /api/v1/dashboard/top-selling-products
   */
  getTopSellingProducts(): Observable<TopProduct[]> {
    const topProducts: TopProduct[] = [
      {
        id: 1,
        name: 'Huile Essentielle Lavande Bio 10ml',
        product_thumbnail: { original_url: 'assets/images/product.png' },
        created_at: '2025-10-01T10:00:00Z',
        sale_price: 15.90,
        orders_count: 245,
        quantity: 120,
        order_amount: 3895.50,
      },
      {
        id: 2,
        name: 'Diffuseur Ultrasonique Premium',
        product_thumbnail: { original_url: 'assets/images/product.png' },
        created_at: '2025-09-15T14:30:00Z',
        sale_price: 45.00,
        orders_count: 189,
        quantity: 45,
        order_amount: 8505.00,
      },
      {
        id: 3,
        name: 'Bougie Parfumée Luxe Rose & Vanille',
        product_thumbnail: { original_url: 'assets/images/product.png' },
        created_at: '2025-09-20T09:15:00Z',
        sale_price: 22.50,
        orders_count: 167,
        quantity: 78,
        order_amount: 3757.50,
      },
      {
        id: 4,
        name: 'Coffret Bien-Être Essentiel',
        product_thumbnail: { original_url: 'assets/images/product.png' },
        created_at: '2025-08-10T16:45:00Z',
        sale_price: 79.90,
        orders_count: 134,
        quantity: 32,
        order_amount: 10706.60,
      },
    ];

    return of(topProducts).pipe(delay(500));
  }

  /**
   * Obtenir les meilleurs vendeurs/boutiques
   * TODO: Remplacer par GET /api/v1/dashboard/top-stores
   */
  getTopStores(): Observable<TopStore[]> {
    const topStores: TopStore[] = [
      {
        id: 1,
        store_name: 'Boutique Paris Centre',
        orders_count: 456,
        order_amount: 25680.50,
      },
      {
        id: 2,
        store_name: 'Boutique Lyon Bellecour',
        orders_count: 389,
        order_amount: 22145.00,
      },
      {
        id: 3,
        store_name: 'Boutique Marseille Vieux-Port',
        orders_count: 312,
        order_amount: 18920.75,
      },
      {
        id: 4,
        store_name: 'Boutique Toulouse Capitole',
        orders_count: 278,
        order_amount: 16550.25,
      },
      {
        id: 5,
        store_name: 'Boutique Nice Promenade',
        orders_count: 245,
        order_amount: 14230.00,
      },
      {
        id: 6,
        store_name: 'Boutique Bordeaux Centre',
        orders_count: 198,
        order_amount: 11890.50,
      },
    ];

    return of(topStores).pipe(delay(500));
  }

  /**
   * Obtenir les derniers avis
   * TODO: Remplacer par GET /api/v1/dashboard/latest-reviews
   */
  getLatestReviews(): Observable<Review[]> {
    const reviews: Review[] = [
      {
        id: 1,
        product: {
          name: 'Huile Essentielle Lavande Bio',
          product_thumbnail: { original_url: 'assets/images/product.png' },
        },
        consumer: {
          name: 'Sophie Martin',
        },
        rating: 5,
      },
      {
        id: 2,
        product: {
          name: 'Diffuseur Ultrasonique Premium',
          product_thumbnail: { original_url: 'assets/images/product.png' },
        },
        consumer: {
          name: 'Jean Dupont',
        },
        rating: 4,
      },
      {
        id: 3,
        product: {
          name: 'Bougie Parfumée Rose & Vanille',
          product_thumbnail: { original_url: 'assets/images/product.png' },
        },
        consumer: {
          name: 'Marie Leroy',
        },
        rating: 5,
      },
      {
        id: 4,
        product: {
          name: 'Coffret Bien-Être Essentiel',
          product_thumbnail: { original_url: 'assets/images/product.png' },
        },
        consumer: {
          name: 'Pierre Dubois',
        },
        rating: 4,
      },
    ];

    return of(reviews).pipe(delay(500));
  }

  /**
   * Obtenir les derniers articles de blog
   * TODO: Remplacer par GET /api/v1/dashboard/latest-blogs
   */
  getLatestBlogs(): Observable<Blog[]> {
    const blogs: Blog[] = [
      {
        id: 1,
        title: 'Les bienfaits de l\'aromathérapie au quotidien',
        blog_thumbnail: { original_url: 'assets/images/blog.png' },
        created_at: '2025-10-10T14:30:00Z',
      },
      {
        id: 2,
        title: 'Comment choisir son diffuseur d\'huiles essentielles',
        blog_thumbnail: { original_url: 'assets/images/blog.png' },
        created_at: '2025-10-08T09:15:00Z',
      },
    ];

    return of(blogs).pipe(delay(500));
  }

  /**
   * Obtenir les données pour le graphique de revenus
   * TODO: Remplacer par GET /api/v1/dashboard/revenue-chart
   */
  getRevenueChartData(): Observable<any> {
    const chartData = {
      categories: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
      series: [
        {
          name: 'Revenus 2025',
          data: [5200, 6100, 7300, 6800, 8500, 9200, 8800, 10500, 9800, 11200, 10800, 12500],
        },
        {
          name: 'Revenus 2024',
          data: [4500, 5300, 6200, 5900, 7100, 7800, 7500, 8900, 8400, 9500, 9200, 10800],
        },
      ],
    };

    return of(chartData).pipe(delay(500));
  }

  /**
   * Filtrer les statistiques par période
   * TODO: Implémenter le filtrage réel avec l'API
   */
  filterStatistics(period: string): Observable<DashboardStatistics> {
    console.log(`⚠️ Filtre temporaire : ${period}`);
    
    // Simuler différentes valeurs selon la période
    const multipliers: { [key: string]: number } = {
      'today': 0.1,
      'last_week': 0.3,
      'last_month': 0.8,
      'this_year': 1.0,
    };

    const multiplier = multipliers[period] || 1.0;

    const statistics: DashboardStatistics = {
      total_revenue: Math.round(85420.50 * multiplier),
      total_orders: Math.round(342 * multiplier),
      total_stores: 8,
      total_users: Math.round(156 * multiplier),
      total_products: 89,
    };

    return of(statistics).pipe(delay(300));
  }
}
