// @ts-check
/**
 * Módulo principal de la aplicación
 * @module app
 */

import { formatCurrency, formatPercentage, formatDate } from './utils/formatters.js';
import { createInflationChart, createInventoryChart, processInventoryData } from './modules/charts.js';
import { DataTable } from './modules/table.js';

/**
 * Configuración global de la aplicación
 */
const APP_CONFIG = {
  selectors: {
    kpiIpc: '#kpiIpc',
    kpiMeta: '#kpiMeta',
    kpiProy: '#kpiProy',
    kpiInventario: '#kpiInventario',
    chartInflacion: '#chartInflacion',
    chartInventario: '#chartInventario',
    table: '#tbl',
    search: '#search',
    exportBtn: '#btnExport',
    lastUpdate: '#lastUpdateText'
  },
  months: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
  meta: 4.0
};

/**
 * Clase principal de la aplicación
 */
class DashboardApp {
  constructor() {
    this.data = window.__DATA__ || { items: [], inflation: [] };
    this.charts = {};
    this.table = null;
    
    this.init();
  }

  /**
   * Inicializa la aplicación
   */
  init() {
    // Esperar a que el DOM esté listo
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
  }

  /**
   * Configura todos los componentes
   */
  setup() {
    try {
      this.updateKPIs();
      this.createCharts();
      this.initTable();
      this.bindEvents();
      this.updateLastUpdate();
      
      console.log('✅ Dashboard inicializado correctamente');
    } catch (error) {
      console.error('❌ Error al inicializar dashboard:', error);
    }
  }

  /**
   * Actualiza los KPIs principales
   */
  updateKPIs() {
    const inflation = this.data.inflation || [];
    const items = this.data.items || [];

    // IPC actual (último valor)
    const currentIPC = inflation.length > 0 ? inflation[inflation.length - 1] : 0;
    this.updateElement(APP_CONFIG.selectors.kpiIpc, formatPercentage(currentIPC));

    // Meta anual
    this.updateElement(APP_CONFIG.selectors.kpiMeta, `${APP_CONFIG.meta}%`);

    // Proyección próximo mes (promedio de últimos 3 meses)
    if (inflation.length >= 3) {
      const lastThree = inflation.slice(-3);
      const average = lastThree.reduce((sum, val) => sum + val, 0) / lastThree.length;
      this.updateElement(APP_CONFIG.selectors.kpiProy, formatPercentage(average));
    } else {
      this.updateElement(APP_CONFIG.selectors.kpiProy, '--');
    }

    // Valor total inventario
    const totalInventory = items.reduce((sum, item) => sum + (item.valor || 0), 0);
    this.updateElement(APP_CONFIG.selectors.kpiInventario, formatCurrency(totalInventory));
  }

  /**
   * Crea los gráficos
   */
  createCharts() {
    // Gráfico de inflación
    const inflationCanvas = document.querySelector(APP_CONFIG.selectors.chartInflacion);
    if (inflationCanvas && this.data.inflation) {
      this.charts.inflation = createInflationChart(
        inflationCanvas,
        this.data.inflation,
        APP_CONFIG.months
      );
    }

    // Gráfico de inventario
    const inventoryCanvas = document.querySelector(APP_CONFIG.selectors.chartInventario);
    if (inventoryCanvas && this.data.items) {
      const processedData = processInventoryData(this.data.items);
      this.charts.inventory = createInventoryChart(inventoryCanvas, processedData);
    }
  }

  /**
   * Inicializa la tabla de datos
   */
  initTable() {
    this.table = new DataTable(APP_CONFIG.selectors.table, APP_CONFIG.selectors.search);
    
    if (this.data.items && this.data.items.length > 0) {
      this.table.loadData(this.data.items);
    }
  }

  /**
   * Vincula eventos globales
   */
  bindEvents() {
    // Botón de exportar
    const exportBtn = document.querySelector(APP_CONFIG.selectors.exportBtn);
    if (exportBtn && this.table) {
      exportBtn.addEventListener('click', () => {
        const timestamp = new Date().toISOString().slice(0, 10);
        this.table.exportToCSV(`inventario_${timestamp}.csv`);
      });
    }

    // Eventos de redimensionamiento para gráficos
    window.addEventListener('resize', this.debounce(() => {
      Object.values(this.charts).forEach(chart => {
        if (chart && typeof chart.resize === 'function') {
          chart.resize();
        }
      });
    }, 300));
  }

  /**
   * Actualiza la hora de última actualización
   */
  updateLastUpdate() {
    const lastUpdateElement = document.querySelector(APP_CONFIG.selectors.lastUpdate);
    if (lastUpdateElement) {
      lastUpdateElement.textContent = formatDate(new Date());
    }
  }

  /**
   * Actualiza el contenido de un elemento
   * @param {string} selector - Selector CSS
   * @param {string} content - Contenido a mostrar
   */
  updateElement(selector, content) {
    const element = document.querySelector(selector);
    if (element) {
      element.textContent = content;
    } else {
      console.warn(`Elemento no encontrado: ${selector}`);
    }
  }

  /**
   * Función debounce para optimizar eventos
   * @param {Function} func - Función a ejecutar
   * @param {number} wait - Tiempo de espera en ms
   * @returns {Function} Función debounced
   */
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  /**
   * Destruye la aplicación y limpia recursos
   */
  destroy() {
    // Destruir gráficos
    Object.values(this.charts).forEach(chart => {
      if (chart && typeof chart.destroy === 'function') {
        chart.destroy();
      }
    });

    // Limpiar referencias
    this.charts = {};
    this.table = null;
    this.data = null;
  }
}

// Inicializar aplicación
const app = new DashboardApp();

// Exportar para uso global
window.DashboardApp = DashboardApp;
window.app = app;

export default DashboardApp;
