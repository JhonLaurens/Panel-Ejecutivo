// @ts-check
// =======================
// Type declarations for global objects
/**
 * @typedef {Object} InventoryItem
 * @property {number} reorden
 * @property {string} id
 * @property {string} nombre
 * @property {string} descripcion
 * @property {number} precio
 * @property {number} stock
 * @property {number} valor
 * @property {number} nivel_reorden
 * @property {number} lead_time
 * @property {number} cant_pedido
 * @property {boolean} descontinuado
 */

/**
 * @typedef {Object} GlobalData
 * @property {InventoryItem[]} items
 * @property {number[]} inflation
 */

// =======================
// Configuration and data
const inflationSeries = (window.__DATA__ && window.__DATA__.inflation) || [
  0.32, 0.41, 0.55, 0.38, 0.62, 0.44, 0.71, 0.59, 0.35, 0.49, 0.52, 0.47,
];
const months = [
  "Ene",
  "Feb",
  "Mar",
  "Abr",
  "May",
  "Jun",
  "Jul",
  "Ago",
  "Sep",
  "Oct",
  "Nov",
  "Dic",
];
const items = (window.__DATA__ && window.__DATA__.items) || [];

// =======================
// Utilities
const fmtMoney = (v) =>
  v.toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  });
const fmtNum = (v) => v.toLocaleString("es-CO");
const todayStr = new Date().toLocaleDateString("es-CO", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});
const lastUpdateElement = document.getElementById("lastUpdateText");
if (lastUpdateElement) {
  lastUpdateElement.textContent = `Last update: ${todayStr}`;
}

// Inventory KPIs
const totalValor = items.reduce(
  (a, i) => a + (Number(i.valor) || i.precio * i.stock),
  0
);
const lowStock = items.filter((i) => i.stock < i.nivel_reorden).length;
const discontinued = items.filter((i) => i.descontinuado).length;

const inventoryElement = document.getElementById("kpiInventario");
if (inventoryElement) {
  inventoryElement.textContent = fmtMoney(totalValor);
}

// Derive IPC index base 100 from monthly inflation rate (chained)
let ipc = 100;
const ipcSeries = [ipc];
for (const m of inflationSeries) {
  ipc *= 1 + m / 100;
  ipcSeries.push(ipc);
}
const ipcActual = +ipc.toFixed(1);
const nextMonth = +(
  ipc *
  (1 + (inflationSeries[inflationSeries.length - 1] || 0) / 100)
).toFixed(1);

const ipcElement = document.getElementById("kpiIpc");
const projElement = document.getElementById("kpiProy");
if (ipcElement) ipcElement.textContent = String(ipcActual);
if (projElement) projElement.textContent = String(nextMonth);

// =======================
// Chart 1: General inflation (line)
const ctx1 = document.getElementById("chartInflacion");
if (ctx1 && typeof window.Chart !== 'undefined') {
  new window.Chart(ctx1, {
    type: "line",
    data: {
      labels: months.slice(0, inflationSeries.length + 1),
      datasets: [
        {
          label: "Price Index (CPI)",
          data: ipcSeries,
          borderColor: "#22d3ee",
          backgroundColor: "rgba(34,211,238,.12)",
          tension: 0.3,
          fill: true,
          pointBackgroundColor: "#22d3ee",
          pointBorderColor: "#ffffff",
          pointBorderWidth: 2,
        },
        {
          label: "Annual target (4%)",
          data: Array(ipcSeries.length).fill(100 * 1.04),
          borderDash: [6, 6],
          borderColor: "#22c55e",
          fill: false,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 0,
      },
      interaction: {
        intersect: false,
        mode: "index",
      },
      plugins: {
        legend: {
          labels: { color: "#e5e7eb", font: { family: "Inter" } },
        },
        tooltip: {
          mode: "index",
          intersect: false,
          backgroundColor: "rgba(0,0,0,0.8)",
          titleColor: "#e5e7eb",
          bodyColor: "#e5e7eb",
        },
      },
      scales: {
        x: {
          ticks: { color: "#9ca3af" },
          grid: { color: "rgba(148,163,184,.15)" },
          border: { color: "#374151" },
        },
        y: {
          ticks: { color: "#9ca3af" },
          grid: { color: "rgba(148,163,184,.1)" },
          border: { color: "#374151" },
        },
      },
    },
  });
}

// =======================
// Chart 2: Inventory status (doughnut)
const activeItems = items.length - discontinued;
const doughnutChart = document.getElementById("chartInventario");
if (doughnutChart && typeof window.Chart !== 'undefined') {
  new window.Chart(doughnutChart, {
    type: "doughnut",
    data: {
      labels: ["Active", "Discontinued", "Low stock"],
      datasets: [
        {
          data: [activeItems, discontinued, lowStock],
          backgroundColor: ["#22c55e", "#ef4444", "#eab308"],
          borderColor: ["#134e4a", "#7f1d1d", "#713f12"],
          borderWidth: 2,
          cutout: "65%",
          hoverOffset: 8,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 0,
      },
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            color: "#e5e7eb",
            font: { family: "Inter" },
            padding: 20,
            usePointStyle: true,
          },
        },
        tooltip: {
          backgroundColor: "rgba(0,0,0,0.8)",
          titleColor: "#e5e7eb",
          bodyColor: "#e5e7eb",
          callbacks: {
            label: (ctx) =>
              `${ctx.label}: ${fmtNum(ctx.raw)} (${(
                (ctx.raw / items.length) *
                100
              ).toFixed(1)}%)`,
          },
        },
      },
    },
  });
}

// =======================
// Variables for sorting and filtering
let currentSortColumn = null;
let currentSortDirection = "asc";
let filteredItems = [...items];

// =======================
// Table
const tbody = document.querySelector("#tbl tbody");
const renderRow = (i) => {
  const tr = document.createElement("tr");
  const warn = i.stock < i.nivel_reorden;
  tr.innerHTML = `
    <td>${i.id}</td>
    <td>${i.nombre}</td>
    <td>${fmtMoney(i.precio)}</td>
    <td>${fmtNum(i.stock)}</td>
    <td>${fmtMoney(Number(i.valor) || i.precio * i.stock)}</td>
    <td>${fmtNum(i.nivel_reorden)}</td>
    <td>${fmtNum(i.lead_time)}</td>
    <td><span class="badge ${warn ? "warn" : "ok"}">${
    warn ? "Reorder" : "OK"
  }</span></td>
    <td>${i.descontinuado ? "Yes" : "No"}</td>`;
  return tr;
};

const renderTable = (rows) => {
  if (tbody) {
    tbody.innerHTML = "";
    rows.forEach((r) => tbody.appendChild(renderRow(r)));
  }
};

// =======================
// Sorting functions
const sortData = (column, type, direction) => {
  return filteredItems.sort((a, b) => {
    let valueA, valueB;

    // Get values according to column type
    switch (column) {
      case "pedido":
        valueA = a.stock < a.nivel_reorden ? "Reorder" : "OK";
        valueB = b.stock < b.nivel_reorden ? "Reorder" : "OK";
        break;
      case "valor":
        valueA = Number(a.valor) || a.precio * a.stock;
        valueB = Number(b.valor) || b.precio * b.stock;
        break;
      default:
        valueA = a[column];
        valueB = b[column];
    }

    // Convert according to data type
    if (type === "number") {
      valueA = Number(valueA) || 0;
      valueB = Number(valueB) || 0;
    } else if (type === "boolean") {
      valueA = valueA ? 1 : 0;
      valueB = valueB ? 1 : 0;
    } else {
      valueA = String(valueA).toLowerCase();
      valueB = String(valueB).toLowerCase();
    }

    // Compare values
    let result = 0;
    if (valueA < valueB) result = -1;
    else if (valueA > valueB) result = 1;

    return direction === "desc" ? -result : result;
  });
};

const updateSortIcons = (activeColumn, direction) => {
  // Clear all icons
  document.querySelectorAll(".sortable").forEach((th) => {
    th.classList.remove("asc", "desc");
  });

  // Add class to active header
  if (activeColumn) {
    const activeHeader = document.querySelector(
      `[data-column="${activeColumn}"]`
    );
    if (activeHeader) {
      activeHeader.classList.add(direction);
    }
  }
};

// =======================
// Event listeners for headers
document.querySelectorAll(".sortable").forEach((header) => {
  header.addEventListener("click", () => {
    const column = header.getAttribute("data-column");
    const type = header.getAttribute("data-type");

    // Determine sort direction
    if (currentSortColumn === column) {
      currentSortDirection = currentSortDirection === "asc" ? "desc" : "asc";
    } else {
      currentSortDirection = "asc";
    }

    currentSortColumn = column;

    // Sort and render
    const sortedData = sortData(column, type, currentSortDirection);
    renderTable(sortedData);
    updateSortIcons(column, currentSortDirection);
  });
});

renderTable(filteredItems);

function toCSV(rows) {
  const headers = [
    "Reorder",
    "ID",
    "Name",
    "Description",
    "Price",
    "Stock",
    "Value",
    "Reorder level",
    "Lead time",
    "Order quantity",
    "Discontinued",
  ];

  // Function to escape CSV values
  const escapeCSV = (value) => {
    if (value === null || value === undefined) return "";
    const str = String(value);
    // If contains semicolon, quotes or line breaks, wrap in quotes
    if (str.includes(";") || str.includes('"') || str.includes("\n")) {
      return '"' + str.replace(/"/g, '""') + '"';
    }
    return str;
  };

  const lines = [headers.map(escapeCSV).join(";")];

  for (const r of rows) {
    const row = [
      r.reorden || "",
      r.id || "",
      r.nombre || "",
      r.descripcion || "",
      r.precio || "",
      r.stock || "",
      Number(r.valor) || r.precio * r.stock || "",
      r.nivel_reorden || "",
      r.lead_time || "",
      r.cant_pedido || "",
      r.descontinuado ? "Yes" : "No",
    ];
    lines.push(row.map(escapeCSV).join(";"));
  }

  return lines.join("\n");
}

// Simple filter
const input = document.getElementById("search");
if (input) {
  input.addEventListener("input", (e) => {
    const target = e.target;
    if (target && 'value' in target) {
      const q = String(target.value).toLowerCase();

      // Filter items
      filteredItems = items.filter(
        (i) =>
          i.id.toLowerCase().includes(q) ||
          i.nombre.toLowerCase().includes(q) ||
          i.descripcion.toLowerCase().includes(q)
      );

      // Apply current sorting if exists
      if (currentSortColumn) {
        const activeHeader = document.querySelector(
          `[data-column="${currentSortColumn}"]`
        );
        if (activeHeader) {
          const type = activeHeader.getAttribute("data-type");
          filteredItems = sortData(
            currentSortColumn,
            type || "text",
            currentSortDirection
          );
        }
      }

      renderTable(filteredItems);
    }
  });
}

// Export CSV
const btnExport = document.getElementById("btnExport");
if (btnExport) {
  btnExport.addEventListener("click", () => {
    const csv = toCSV(filteredItems);

    // Add BOM for UTF-8 to ensure correct encoding
    const BOM = "\uFEFF";
    const csvWithBOM = BOM + csv;

    const blob = new Blob([csvWithBOM], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "inventory_" + new Date().toISOString().slice(0, 10) + ".csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });
}