// js/chart-renderer.js

/**
 * Renderiza el gráfico de ventas semanales.
 * @param {HTMLCanvasElement} canvas - El elemento canvas donde se dibujará el gráfico.
 * @param {Array<string>} labels - Etiquetas para el eje X (ej. días de la semana).
 * @param {Array<number>} data - Datos de ventas para el eje Y.
 */
function renderSalesChart(canvas, labels, data) {
    // Destruir el gráfico anterior si existe para evitar duplicados
    if (canvas.chart) {
        canvas.chart.destroy();
    }

    const ctx = canvas.getContext('2d');
    canvas.chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Ventas Totales (S/.)',
                data: data,
                borderColor: '#2563EB', // blue-600
                backgroundColor: 'rgba(37, 99, 235, 0.2)',
                borderWidth: 3,
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#2563EB',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 6,
                pointHoverRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        color: getComputedStyle(document.documentElement).getPropertyValue('--text-color-primary'),
                        font: {
                            weight: 'bold'
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `S/. ${context.raw.toFixed(2)}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: getComputedStyle(document.documentElement).getPropertyValue('--border-color'),
                        borderDash: [5, 5]
                    },
                    ticks: {
                        color: getComputedStyle(document.documentElement).getPropertyValue('--text-color-secondary'),
                        callback: function(value) {
                            return `S/. ${value}`;
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: getComputedStyle(document.documentElement).getPropertyValue('--text-color-secondary')
                    }
                }
            }
        }
    });
}

/**
 * Renderiza el gráfico de rentabilidad vs. costos.
 * @param {HTMLCanvasElement} canvas - El elemento canvas donde se dibujará el gráfico.
 * @param {Array<string>} labels - Etiquetas para los datos.
 * @param {Array<number>} profitData - Datos de ganancias.
 * @param {Array<number>} costData - Datos de costos.
 */
function renderProfitChart(canvas, labels, profitData, costData) {
    // Destruir el gráfico anterior si existe para evitar duplicados
    if (canvas.chart) {
        canvas.chart.destroy();
    }
    
    const ctx = canvas.getContext('2d');
    canvas.chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Ganancia (S/.)',
                    data: profitData,
                    backgroundColor: '#10B981', // green-500
                    borderColor: '#059669',
                    borderWidth: 1,
                    borderRadius: 5,
                    barThickness: 20
                },
                {
                    label: 'Costos (S/.)',
                    data: costData,
                    backgroundColor: '#EF4444', // red-500
                    borderColor: '#DC2626',
                    borderWidth: 1,
                    borderRadius: 5,
                    barThickness: 20
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        color: getComputedStyle(document.documentElement).getPropertyValue('--text-color-primary'),
                        font: {
                            weight: 'bold'
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: S/. ${context.raw.toFixed(2)}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: getComputedStyle(document.documentElement).getPropertyValue('--text-color-secondary')
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        color: getComputedStyle(document.documentElement).getPropertyValue('--border-color'),
                        borderDash: [5, 5]
                    },
                    ticks: {
                        color: getComputedStyle(document.documentElement).getPropertyValue('--text-color-secondary'),
                        callback: function(value) {
                            return `S/. ${value}`;
                        }
                    }
                }
            }
        }
    });
}