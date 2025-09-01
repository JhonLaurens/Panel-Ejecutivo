// =======================
// Configuración y datos
const inflationSeries = window.__DATA__.inflation || [
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
const items = window.__DATA__.items || [];

// =======================
// Utilidades
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
  lastUpdateElement.textContent = `Última actualización: ${todayStr}`;
}

// KPIs de inventario
const totalValor = items.reduce(
  (a, i) => a + (Number(i.valor) || i.precio * i.stock),
  0
);
const bajoStock = items.filter((i) => i.stock < i.nivel_reorden).length;
const descontinuados = items.filter((i) => i.descontinuado).length;

document.getElementById("kpiInventario").textContent = fmtMoney(totalValor);

// Derivar índice IPC base 100 a partir de inflación mensual (encadenado)
let ipc = 100;
const ipcSerie = [ipc];
for (const m of inflationSeries) {
  ipc *= 1 + m / 100;
  ipcSerie.push(ipc);
}
const ipcActual = +ipc.toFixed(1);
const proxMes = +(
  ipc *
  (1 + (inflationSeries[inflationSeries.length - 1] || 0) / 100)
).toFixed(1);

document.getElementById("kpiIpc").textContent = ipcActual;
document.getElementById("kpiProy").textContent = proxMes;

// =======================
// Gráfico 1: Inflación general (línea)
const ctx1 = document.getElementById("chartInflacion");
if (ctx1) {
  new Chart(ctx1, {
    type: "line",
    data: {
      labels: months.slice(0, inflationSeries.length + 1),
      datasets: [
        {
          label: "Índice de Precios (IPC)",
          data: ipcSerie,
          borderColor: "#22d3ee",
          backgroundColor: "rgba(34,211,238,.12)",
          tension: 0.3,
          fill: true,
          pointBackgroundColor: "#22d3ee",
          pointBorderColor: "#ffffff",
          pointBorderWidth: 2,
        },
        {
          label: "Meta anual (4%)",
          data: Array(ipcSerie.length).fill(100 * 1.04),
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
// Gráfico 2: Estado de inventario (rosca)
const activos = items.length - descontinuados;
const rosca = document.getElementById("chartInventario");
if (rosca) {
  new Chart(rosca, {
    type: "doughnut",
    data: {
      labels: ["Activos", "Descontinuados", "Bajo stock"],
      datasets: [
        {
          data: [activos, descontinuados, bajoStock],
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
// Variables para ordenamiento y filtrado
let currentSortColumn = null;
let currentSortDirection = "asc";
let filteredItems = [...items];

// =======================
// Tabla
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
    warn ? "Reordenar" : "OK"
  }</span></td>
    <td>${i.descontinuado ? "Sí" : "No"}</td>`;
  return tr;
};

const renderTable = (rows) => {
  if (tbody) {
    tbody.innerHTML = "";
    rows.forEach((r) => tbody.appendChild(renderRow(r)));
  }
};

// =======================
// Funciones de ordenamiento
const sortData = (column, type, direction) => {
  return filteredItems.sort((a, b) => {
    let valueA, valueB;

    // Obtener valores según el tipo de columna
    switch (column) {
      case "pedido":
        valueA = a.stock < a.nivel_reorden ? "Reordenar" : "OK";
        valueB = b.stock < b.nivel_reorden ? "Reordenar" : "OK";
        break;
      case "valor":
        valueA = Number(a.valor) || a.precio * a.stock;
        valueB = Number(b.valor) || b.precio * b.stock;
        break;
      default:
        valueA = a[column];
        valueB = b[column];
    }

    // Convertir según tipo de dato
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

    // Comparar valores
    let result = 0;
    if (valueA < valueB) result = -1;
    else if (valueA > valueB) result = 1;

    return direction === "desc" ? -result : result;
  });
};

const updateSortIcons = (activeColumn, direction) => {
  // Limpiar todos los iconos
  document.querySelectorAll(".sortable").forEach((th) => {
    th.classList.remove("asc", "desc");
  });

  // Agregar clase al encabezado activo
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
// Event listeners para encabezados
document.querySelectorAll(".sortable").forEach((header) => {
  header.addEventListener("click", () => {
    const column = header.getAttribute("data-column");
    const type = header.getAttribute("data-type");

    // Determinar dirección de ordenamiento
    if (currentSortColumn === column) {
      currentSortDirection = currentSortDirection === "asc" ? "desc" : "asc";
    } else {
      currentSortDirection = "asc";
    }

    currentSortColumn = column;

    // Ordenar y renderizar
    const sortedData = sortData(column, type, currentSortDirection);
    renderTable(sortedData);
    updateSortIcons(column, currentSortDirection);
  });
});

renderTable(filteredItems);

function toCSV(rows) {
  const headers = [
    "Volver a pedir",
    "ID",
    "Nombre",
    "Descripcion",
    "Precio",
    "Stock",
    "Valor",
    "Nivel reorden",
    "Lead time",
    "Cant pedido",
    "Descontinuado",
  ];

  // Función para escapar valores CSV
  const escapeCSV = (value) => {
    if (value === null || value === undefined) return "";
    const str = String(value);
    // Si contiene punto y coma, comillas o saltos de línea, envolver en comillas
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
      r.descontinuado ? "Si" : "No",
    ];
    lines.push(row.map(escapeCSV).join(";"));
  }

  return lines.join("\n");
}

// Filtro simple
const input = document.getElementById("search");
if (input) {
  input.addEventListener("input", (e) => {
    if (e.target) {
      const q = e.target.value.toLowerCase();

      // Filtrar items
      filteredItems = items.filter(
        (i) =>
          i.id.toLowerCase().includes(q) ||
          i.nombre.toLowerCase().includes(q) ||
          i.descripcion.toLowerCase().includes(q)
      );

      // Aplicar ordenamiento actual si existe
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

// Exportar CSV
const btnExport = document.getElementById("btnExport");
if (btnExport) {
  btnExport.addEventListener("click", () => {
    const csv = toCSV(filteredItems);

    // Agregar BOM para UTF-8 para asegurar codificación correcta
    const BOM = "\uFEFF";
    const csvWithBOM = BOM + csv;

    const blob = new Blob([csvWithBOM], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "inventario_" + new Date().toISOString().slice(0, 10) + ".csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });
}
