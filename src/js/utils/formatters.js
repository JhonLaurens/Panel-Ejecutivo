// @ts-check
/**
 * Utilidades para formateo de datos
 * @module utils/formatters
 */

/**
 * Formatea un número como moneda colombiana
 * @param {number} value - Valor a formatear
 * @returns {string} Valor formateado como moneda
 */
export const formatCurrency = (value) => {
  return value.toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};

/**
 * Formatea un número como porcentaje
 * @param {number} value - Valor a formatear (decimal)
 * @returns {string} Valor formateado como porcentaje
 */
export const formatPercentage = (value) => {
  return (value * 100).toFixed(1) + "%";
};

/**
 * Formatea una fecha
 * @param {Date} date - Fecha a formatear
 * @returns {string} Fecha formateada
 */
export const formatDate = (date) => {
  return date.toLocaleDateString("es-CO", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Trunca texto a una longitud específica
 * @param {string} text - Texto a truncar
 * @param {number} maxLength - Longitud máxima
 * @returns {string} Texto truncado
 */
export const truncateText = (text, maxLength = 50) => {
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};

/**
 * Normaliza texto para búsqueda (sin acentos, minúsculas)
 * @param {string} text - Texto a normalizar
 * @returns {string} Texto normalizado
 */
export const normalizeText = (text) => {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
};
