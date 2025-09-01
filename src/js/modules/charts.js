// @ts-check
/**
 * Configuración de gráficos con Chart.js
 * @module modules/charts
 */

/**
 * Configuración base para gráficos
 */
const CHART_CONFIG = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
      labels: {
        usePointStyle: true,
        padding: 20,
        font: {
          family: 'Inter, sans-serif',
          size: 12
        }
      }
    },
    tooltip: {
      backgroundColor: 'rgba(15, 23, 42, 0.9)',
      titleColor: '#f1f5f9',
      bodyColor: '#f1f5f9',
      borderColor: '#22d3ee',
      borderWidth: 1,
      cornerRadius: 8,
      padding: 12
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(255, 255, 255, 0.1)'
      },
      ticks: {
        color: '#94a3b8'
      }
    },
    x: {
      grid: {
        color: 'rgba(255, 255, 255, 0.1)'
      },
      ticks: {
        color: '#94a3b8'
      }
    }
  }
};

/**
 * Crea gráfico de línea para inflación
 * @param {HTMLCanvasElement} canvas - Canvas element
 * @param {number[]} data - Datos de inflación
 * @param {string[]} labels - Etiquetas de meses
 * @returns {Chart} Instancia del gráfico
 */
export function createInflationChart(canvas, data, labels) {
  const ctx = canvas.getContext('2d');
  
  return new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Tasa de Inflación (%)',
        data,
        borderColor: '#22d3ee',
        backgroundColor: 'rgba(34, 211, 238, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#22d3ee',
        pointBorderColor: '#0f172a',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8
      }]
    },
    options: {
      ...CHART_CONFIG,
      scales: {
        ...CHART_CONFIG.scales,
        y: {
          ...CHART_CONFIG.scales.y,
          title: {
            display: true,
            text: 'Porcentaje (%)',
            color: '#94a3b8'
          }
        }
      }
    }
  });
}

/**
 * Crea gráfico de dona para inventario
 * @param {HTMLCanvasElement} canvas - Canvas element
 * @param {Object[]} data - Datos de inventario procesados
 * @returns {Chart} Instancia del gráfico
 */
export function createInventoryChart(canvas, data) {
  const ctx = canvas.getContext('2d');
  
  return new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: data.map(item => item.label),
      datasets: [{
        label: 'Valor de Inventario',
        data: data.map(item => item.value),
        backgroundColor: [
          '#22d3ee',
          '#8b5cf6',
          '#f59e0b',
          '#ef4444',
          '#10b981'
        ],
        borderColor: '#0f172a',
        borderWidth: 2,
        hoverBorderWidth: 3
      }]
    },
    options: {
      ...CHART_CONFIG,
      plugins: {
        ...CHART_CONFIG.plugins,
        legend: {
          ...CHART_CONFIG.plugins.legend,
          position: 'right'
        }
      },
      cutout: '60%'
    }
  });
}

/**
 * Procesa datos de inventario para el gráfico de dona
 * @param {Object[]} items - Items de inventario
 * @returns {Object[]} Datos procesados para el gráfico
 */
export function processInventoryData(items) {
  // Agrupar por rangos de stock
  const ranges = [
    { label: 'Stock Bajo (< 50)', min: 0, max: 49 },
    { label: 'Stock Medio (50-100)', min: 50, max: 100 },
    { label: 'Stock Alto (101-150)', min: 101, max: 150 },
    { label: 'Stock Muy Alto (> 150)', min: 151, max: Infinity }
  ];
  
  return ranges.map(range => {
    const itemsInRange = items.filter(item => 
      item.stock >= range.min && item.stock <= range.max
    );
    
    const totalValue = itemsInRange.reduce((sum, item) => sum + item.valor, 0);
    
    return {
      label: range.label,
      value: totalValue,
      count: itemsInRange.length
    };
  }).filter(range => range.count > 0);
}
