// @ts-check
/**
 * Manejo de tabla de datos
 * @module modules/table
 */

import { formatCurrency, normalizeText } from '../utils/formatters.js';

/**
 * Clase para manejar la tabla de inventario
 */
export class DataTable {
  /**
   * @param {string} tableSelector - Selector CSS de la tabla
   * @param {string} searchSelector - Selector CSS del input de búsqueda
   */
  constructor(tableSelector, searchSelector) {
    this.table = document.querySelector(tableSelector);
    this.searchInput = document.querySelector(searchSelector);
    this.tbody = this.table?.querySelector('tbody');
    this.originalData = [];
    this.filteredData = [];
    this.sortColumn = null;
    this.sortDirection = 'asc';
    
    this.init();
  }

  /**
   * Inicializa la tabla
   */
  init() {
    if (!this.table || !this.searchInput) {
      console.warn('Table or search input not found');
      return;
    }

    // Event listeners
    this.searchInput.addEventListener('input', (e) => {
      this.filterData(e.target.value);
    });

    // Agregar event listeners para ordenamiento
    const headers = this.table.querySelectorAll('th.sortable');
    headers.forEach(header => {
      header.addEventListener('click', () => {
        const column = header.dataset.column;
        const type = header.dataset.type || 'text';
        this.sortData(column, type);
      });
    });
  }

  /**
   * Carga datos en la tabla
   * @param {Object[]} data - Datos a mostrar
   */
  loadData(data) {
    this.originalData = [...data];
    this.filteredData = [...data];
    this.renderTable();
  }

  /**
   * Filtra datos según el término de búsqueda
   * @param {string} searchTerm - Término de búsqueda
   */
  filterData(searchTerm) {
    if (!searchTerm.trim()) {
      this.filteredData = [...this.originalData];
    } else {
      const normalizedSearch = normalizeText(searchTerm);
      this.filteredData = this.originalData.filter(item => {
        return Object.values(item).some(value => {
          if (value == null) return false;
          return normalizeText(String(value)).includes(normalizedSearch);
        });
      });
    }
    this.renderTable();
  }

  /**
   * Ordena datos por columna
   * @param {string} column - Nombre de la columna
   * @param {string} type - Tipo de dato (text, number, boolean)
   */
  sortData(column, type) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.filteredData.sort((a, b) => {
      let aVal = a[column];
      let bVal = b[column];

      // Convertir según el tipo
      if (type === 'number') {
        aVal = Number(aVal) || 0;
        bVal = Number(bVal) || 0;
      } else if (type === 'boolean') {
        aVal = Boolean(aVal);
        bVal = Boolean(bVal);
      } else {
        aVal = String(aVal).toLowerCase();
        bVal = String(bVal).toLowerCase();
      }

      let result = 0;
      if (aVal < bVal) result = -1;
      else if (aVal > bVal) result = 1;

      return this.sortDirection === 'desc' ? -result : result;
    });

    this.updateSortIcons();
    this.renderTable();
  }

  /**
   * Actualiza iconos de ordenamiento
   */
  updateSortIcons() {
    const headers = this.table.querySelectorAll('th.sortable .sort-icon');
    headers.forEach(icon => {
      icon.textContent = '↕️';
    });

    const activeHeader = this.table.querySelector(`th[data-column="${this.sortColumn}"] .sort-icon`);
    if (activeHeader) {
      activeHeader.textContent = this.sortDirection === 'asc' ? '↑' : '↓';
    }
  }

  /**
   * Renderiza la tabla con los datos filtrados
   */
  renderTable() {
    if (!this.tbody) return;

    this.tbody.innerHTML = '';

    this.filteredData.forEach(item => {
      const row = document.createElement('tr');
      
      // Agregar clase si el item necesita reorden
      if (item.stock <= item.nivel_reorden) {
        row.classList.add('low-stock');
      }
      
      if (item.descontinuado) {
        row.classList.add('discontinued');
      }

      row.innerHTML = `
        <td>${item.id}</td>
        <td>${item.nombre}</td>
        <td>${formatCurrency(item.precio)}</td>
        <td>${item.stock}</td>
        <td>${formatCurrency(item.valor)}</td>
        <td>${item.nivel_reorden}</td>
        <td>${item.lead_time}</td>
        <td>
          ${item.stock <= item.nivel_reorden ? 
            `<span class="badge badge-warning">Necesario</span>` : 
            `<span class="badge badge-success">Suficiente</span>`
          }
        </td>
        <td>
          ${item.descontinuado ? 
            `<span class="badge badge-danger">Sí</span>` : 
            `<span class="badge badge-info">No</span>`
          }
        </td>
      `;

      this.tbody.appendChild(row);
    });
  }

  /**
   * Exporta datos a CSV
   * @param {string} filename - Nombre del archivo
   */
  exportToCSV(filename = 'inventario.csv') {
    const headers = ['ID', 'Nombre', 'Precio', 'Stock', 'Valor', 'Nivel Reorden', 'Lead Time', 'Pedido', 'Descontinuado'];
    
    const csvContent = [
      headers.join(','),
      ...this.filteredData.map(item => [
        item.id,
        `"${item.nombre}"`,
        item.precio,
        item.stock,
        item.valor,
        item.nivel_reorden,
        item.lead_time,
        item.stock <= item.nivel_reorden ? 'Necesario' : 'Suficiente',
        item.descontinuado ? 'Sí' : 'No'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
