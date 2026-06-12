import { CommonModule, DatePipe, isPlatformBrowser, SlicePipe } from '@angular/common';
import {
  Component,
  ElementRef,
  inject,
  PLATFORM_ID,
  Renderer2,
  DOCUMENT,
  viewChild,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { NgbRating, NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexFill,
  ApexGrid,
  ApexLegend,
  ApexMarkers,
  ApexResponsive,
  ApexStroke,
  ApexTitleSubtitle,
  ApexTooltip,
  ApexXAxis,
  ApexYAxis,
} from 'ng-apexcharts';
import {Select2, Select2Data, Select2UpdateEvent} from 'ng-select2-component';

export interface ChartOptions {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis?: ApexYAxis;
  stroke: ApexStroke;
  tooltip?: ApexTooltip;
  dataLabels: ApexDataLabels;
  fill?: ApexFill;
  title?: ApexTitleSubtitle;
  grid?: ApexGrid;
  markers?: ApexMarkers;
  legend?: ApexLegend;
  responsive?: ApexResponsive[];
}

import { PageWrapper } from '../../shared/components/page-wrapper/page-wrapper';
import { Table } from '../../shared/components/ui/table/table';
import { ITableConfig } from '../../shared/interface/table.interface';
import { CurrencySymbolPipe } from '../../shared/pipe/currency-symbol.pipe';
import {
  DashboardDataService,
  DashboardStatistics,
  TopProduct,
  TopStore,
  Review,
  Blog
} from './data-access';

@Component({
  selector: 'app-tableau-de-bord',
  templateUrl: './tableau-de-bord.html',
  styleUrls: ['./tableau-de-bord.scss'],
  providers: [CurrencySymbolPipe],
  imports: [
    PageWrapper,
    Table,
    RouterModule,
    NgbRating,
    CommonModule,
    SlicePipe,
    DatePipe,
    TranslateModule,
    CurrencySymbolPipe,
    Select2,
  ],
})
class TableauDeBord implements AfterViewInit, OnDestroy {
  private renderer = inject(Renderer2);
  private platformId = inject(PLATFORM_ID);
  private document = inject<Document>(DOCUMENT);
  private router = inject(Router);
  private dashboardService = inject(DashboardDataService);

  readonly chart = viewChild.required<ElementRef>('chart');

  public isBrowser: boolean;
  public chartOptions!: Partial<ChartOptions>;

  // ⚠️ DONNÉES STATIQUES - TODO: Connecter avec l'API
  public statistics: DashboardStatistics = {
    total_revenue: 0,
    total_orders: 0,
    total_stores: 0,
    total_users: 0,
    total_products: 0,
  };

  public filter: Select2Data = [
    { value: 'today', label: 'Aujourd\'hui' },
    { value: 'last_week', label: 'Semaine dernière' },
    { value: 'last_month', label: 'Mois dernier' },
    { value: 'this_year', label: 'Cette année' },
  ];

  // Données supplémentaires
  public topProducts: TopProduct[] = [];
  public topStores: TopStore[] = [];
  public reviews: Review[] = [];
  public blogs: Blog[] = [];

  public orderTableConfig: ITableConfig = {
    columns: [
      { title: 'number', dataField: 'order_id' },
      { title: 'date', dataField: 'created_at', type: 'date', date_format: 'dd MMM yyyy' },
      { title: 'name', dataField: 'consumer_name' },
      { title: 'amount', dataField: 'total', type: 'price' },
      { title: 'payment', dataField: 'order_payment_status' },
    ],
    data: [],
    total: 0,
  };

  public productStockTableConfig: ITableConfig = {
    columns: [
      {
        title: 'image',
        dataField: 'product_thumbnail',
        class: 'tbl-image',
        type: 'image',
        placeholder: 'assets/images/product.png',
      },
      { title: 'name', dataField: 'name' },
      { title: 'quantity', dataField: 'quantity' },
      { title: 'stock', dataField: 'stock' },
    ],
    data: [],
    total: 0,
  };

  public sellerTableConfig: ITableConfig = {
    columns: [
      { title: 'store_name', dataField: 'store_name' },
      { title: 'orders', dataField: 'orders_count' },
      { title: 'earning', dataField: 'order_amount', type: 'price' },
    ],
    data: [],
    total: 0,
  };

  public topProductLoader: boolean = false;
  public productStockLoader: boolean = false;
  public topSellerLoader: boolean = false;

  constructor() {
    const config = inject(NgbRatingConfig);
    const platformId = this.platformId;

    this.isBrowser = isPlatformBrowser(platformId);
    config.max = 5;
    config.readonly = true;

    // ⚠️ Chargement des données statiques temporaires
    this.loadStatistics();
    this.loadRecentOrders();
    this.loadLowStockProducts();
    this.loadTopSellingProducts();
    this.loadTopStores();
    this.loadLatestReviews();
    this.loadLatestBlogs();
  }

  ngOnInit() {
    console.log('✅ Tableau de bord initialisé avec des données statiques');
    console.log('⚠️ TODO: Connecter les endpoints API pour les données réelles');
  }

  async ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      // Charger les données du graphique
      this.dashboardService.getRevenueChartData().subscribe(async (chartData) => {
        // Configuration ApexCharts avec les couleurs de la marque Seller App
        this.chartOptions = {
          series: [
            {
              name: chartData.series[0].name,
              data: chartData.series[0].data,
              color: '#073C98', // Lavande (couleur principale)
            },
            {
              name: chartData.series[1].name,
              data: chartData.series[1].data,
              color: '#A3B29F', // Vert sauge (couleur secondaire)
            },
          ],
          chart: {
            height: 350,
            type: 'line',
            dropShadow: {
              enabled: true,
              top: 10,
              left: 0,
              blur: 3,
              color: '#073C98',
              opacity: 0.1,
            },
            zoom: {
              enabled: false,
            },
            toolbar: {
              show: true,
              tools: {
                download: true,
                zoom: true,
                zoomin: true,
                zoomout: true,
                pan: true,
                reset: true,
              },
            },
          },
          dataLabels: {
            enabled: false,
          },
          markers: {
            size: 5,
            strokeWidth: 4,
            strokeColors: '#ffffff',
            hover: {
              size: 9,
            },
          },
          stroke: {
            curve: 'smooth',
            lineCap: 'butt',
            width: 4,
          },
          grid: {
            borderColor: '#f1f1f1',
            xaxis: {
              lines: {
                show: true,
              },
            },
            yaxis: {
              lines: {
                show: false,
              },
            },
          },
          legend: {
            show: true,
            position: 'top',
            horizontalAlign: 'right',
            fontSize: '14px',
            fontFamily: 'Public Sans, sans-serif',
          },
          responsive: [
            {
              breakpoint: 1200,
              options: {
                grid: {
                  padding: {
                    right: -95,
                  },
                },
              },
            },
            {
              breakpoint: 992,
              options: {
                grid: {
                  padding: {
                    right: -69,
                  },
                },
              },
            },
            {
              breakpoint: 767,
              options: {
                chart: {
                  height: 200,
                },
              },
            },
          ],
          xaxis: {
            categories: chartData.categories,
            axisBorder: {
              show: false,
            },
            axisTicks: {
              show: false,
            },
            labels: {
              style: {
                fontSize: '12px',
                fontFamily: 'Public Sans, sans-serif',
              },
            },
          },
          yaxis: {
            labels: {
              formatter: (value: number) => {
                return value.toLocaleString('fr-FR') + ' €';
              },
              style: {
                fontSize: '12px',
                fontFamily: 'Public Sans, sans-serif',
              },
            },
          },
          tooltip: {
            shared: true,
            intersect: false,
            y: {
              formatter: (value: number) => {
                return value.toLocaleString('fr-FR', {
                  style: 'currency',
                  currency: 'EUR'
                });
              },
            },
          },
        };

        try {
          const ApexCharts = (await import('apexcharts')).default;
          const element = this.chart().nativeElement;
          const chartInstance = '';
         // await chartInstance.render();
          console.log('📈 Graphique de revenus chargé avec succès');
        } catch (error) {
          console.error('❌ Erreur lors du chargement du graphique:', error);
        }
      });
    }
  }

  /**
   * ⚠️ DONNÉES STATIQUES TEMPORAIRES
   * TODO: Remplacer par un appel API réel : GET /api/v1/dashboard/statistics
   */
  loadStatistics() {
    this.dashboardService.getStatistics().subscribe({
      next: (stats) => {
        this.statistics = stats;
        console.log('📊 Statistiques chargées:', stats);
      },
      error: (error) => {
        console.error('❌ Erreur lors du chargement des statistiques:', error);
      },
    });
  }

  /**
   * ⚠️ DONNÉES STATIQUES TEMPORAIRES
   * TODO: Remplacer par un appel API réel : GET /api/v1/dashboard/recent-orders
   */
  loadRecentOrders() {
    this.dashboardService.getRecentOrders().subscribe({
      next: (orders) => {
        this.orderTableConfig.data = orders as any;
        this.orderTableConfig.total = orders.length;
        console.log('🛒 Commandes récentes chargées:', orders.length);
      },
      error: (error) => {
        console.error('❌ Erreur lors du chargement des commandes:', error);
      },
    });
  }

  /**
   * ⚠️ DONNÉES STATIQUES TEMPORAIRES
   * TODO: Remplacer par un appel API réel : GET /api/v1/dashboard/low-stock-products
   */
  loadLowStockProducts() {
    this.dashboardService.getLowStockProducts().subscribe({
      next: (products) => {
        this.productStockTableConfig.data = products as any;
        this.productStockTableConfig.total = products.length;
        console.log('📦 Produits en stock faible chargés:', products.length);
      },
      error: (error) => {
        console.error('❌ Erreur lors du chargement des produits:', error);
      },
    });
  }

  /**
   * ⚠️ DONNÉES STATIQUES TEMPORAIRES
   * TODO: Remplacer par un appel API réel : GET /api/v1/dashboard/top-selling-products
   */
  loadTopSellingProducts() {
    this.topProductLoader = true;
    this.dashboardService.getTopSellingProducts().subscribe({
      next: (products) => {
        this.topProducts = products;
        console.log('🏆 Produits les plus vendus chargés:', products.length);
        this.topProductLoader = false;
      },
      error: (error) => {
        console.error('❌ Erreur lors du chargement des top produits:', error);
        this.topProductLoader = false;
      },
    });
  }

  /**
   * ⚠️ DONNÉES STATIQUES TEMPORAIRES
   * TODO: Remplacer par un appel API réel : GET /api/v1/dashboard/top-stores
   */
  loadTopStores() {
    this.topSellerLoader = true;
    this.dashboardService.getTopStores().subscribe({
      next: (stores) => {
        this.sellerTableConfig.data = stores as any;
        this.sellerTableConfig.total = stores.length;
        console.log('🏪 Meilleures boutiques chargées:', stores.length);
        this.topSellerLoader = false;
      },
      error: (error) => {
        console.error('❌ Erreur lors du chargement des boutiques:', error);
        this.topSellerLoader = false;
      },
    });
  }

  /**
   * ⚠️ DONNÉES STATIQUES TEMPORAIRES
   * TODO: Remplacer par un appel API réel : GET /api/v1/dashboard/latest-reviews
   */
  loadLatestReviews() {
    this.dashboardService.getLatestReviews().subscribe({
      next: (reviews) => {
        this.reviews = reviews;
        console.log('⭐ Derniers avis chargés:', reviews.length);
      },
      error: (error) => {
        console.error('❌ Erreur lors du chargement des avis:', error);
      },
    });
  }

  /**
   * ⚠️ DONNÉES STATIQUES TEMPORAIRES
   * TODO: Remplacer par un appel API réel : GET /api/v1/dashboard/latest-blogs
   */
  loadLatestBlogs() {
    this.dashboardService.getLatestBlogs().subscribe({
      next: (blogs) => {
        this.blogs = blogs;
        console.log('📝 Derniers blogs chargés:', blogs.length);
      },
      error: (error) => {
        console.error('❌ Erreur lors du chargement des blogs:', error);
      },
    });
  }

  /**
   * Filtrer les produits les plus vendus
   * TODO: Implémenter le filtrage avec l'API
   */
  filterTopProduct(data: Select2UpdateEvent) {
    console.log('⚠️ Filtre temporaire - Produits:', data.value);
    this.loadTopSellingProducts(); // Recharger pour l'instant
  }

  /**
   * Filtrer les meilleurs vendeurs
   * TODO: Implémenter le filtrage avec l'API
   */
  filterSeller(data: Select2UpdateEvent) {
    console.log('⚠️ Filtre temporaire - Vendeurs:', data.value);
    this.loadTopStores(); // Recharger pour l'instant
  }

  /**
   * Filtrer les produits par période
   * TODO: Implémenter le filtrage avec l'API
   */
  filterProduct(data: Select2UpdateEvent) {
    console.log('⚠️ Filtre temporaire - Période:', data.value);

    // Simuler un filtrage des statistiques
    this.dashboardService.filterStatistics(data.value as string).subscribe({
      next: (stats) => {
        this.statistics = stats;
        console.log('📊 Statistiques filtrées:', stats);
      },
      error: (error) => {
        console.error('❌ Erreur lors du filtrage:', error);
      },
    });
  }

  ngOnDestroy() {
    this.renderer.removeClass(this.document.body, 'loader-none');
  }
}

export default TableauDeBord

