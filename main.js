// js/main.js

document.addEventListener('DOMContentLoaded', () => {
    // --- Data Caching (Simulación de base de datos) ---
    // Carga los datos desde localStorage o usa un array vacío si no existen
    let products = JSON.parse(localStorage.getItem('products')) || [];
    let sales = JSON.parse(localStorage.getItem('sales')) || [];
    let clients = JSON.parse(localStorage.getItem('clients')) || [];
    let cashFlow = JSON.parse(localStorage.getItem('cashFlow')) || [];

    // --- Selectores de Vistas y Elementos de Navegación ---
    const navLinks = document.querySelectorAll('.nav-link');
    const views = document.querySelectorAll('.module-view');
    const pageTitle = document.getElementById('pageTitle');
    
    // --- Selectores del Dashboard ---
    const kpiSales = document.getElementById('kpiSales');
    const kpiProfit = document.getElementById('kpiProfit');
    const kpiLowStock = document.getElementById('kpiLowStock');
    const kpiClients = document.getElementById('kpiClients');
    const salesChartCanvas = document.getElementById('salesChart');
    const profitChartCanvas = document.getElementById('profitChart');
    
    // --- Funciones de Carga y Actualización de Datos ---

    /**
     * Actualiza los KPIs del Dashboard con los datos actuales.
     */
    function updateDashboardKPIs() {
        // Recargar los datos de localStorage para asegurar que estén actualizados
        products = JSON.parse(localStorage.getItem('products')) || [];
        sales = JSON.parse(localStorage.getItem('sales')) || [];
        clients = JSON.parse(localStorage.getItem('clients')) || [];
        cashFlow = JSON.parse(localStorage.getItem('cashFlow')) || [];

        // KPI: Ventas Hoy
        const today = new Date().toISOString().slice(0, 10);
        const salesToday = sales.filter(sale => sale.date.startsWith(today));
        const totalSalesToday = salesToday.reduce((sum, sale) => sum + sale.total, 0);
        kpiSales.textContent = `S/. ${totalSalesToday.toFixed(2)}`;
        
        // KPI: Ganancia Neta (calculada de todas las ventas)
        const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);
        const totalCostOfGoodsSold = sales.reduce((sum, sale) => sum + sale.cost, 0);
        const netProfit = totalRevenue - totalCostOfGoodsSold;
        kpiProfit.textContent = `S/. ${netProfit.toFixed(2)}`;
        
        // KPI: Productos con Stock Bajo
        const lowStockProducts = products.filter(p => p.stock <= p.minStock);
        kpiLowStock.textContent = lowStockProducts.length;

        // KPI: Total Clientes
        kpiClients.textContent = clients.length;
    }
    
    /**
     * Renderiza los gráficos del Dashboard con datos reales.
     */
    function renderDashboardCharts() {
        // --- Datos REALES de Ventas Semanales ---
        // Se mantiene la lógica para el gráfico de ventas diarias
        const salesLabels = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
        const salesData = [];
        const today = new Date();
        
        // Calcular las ventas por día de la semana
        salesLabels.forEach((day, index) => {
            const date = new Date(today);
            date.setDate(today.getDate() - (today.getDay() - index + 7) % 7);
            const dateString = date.toISOString().slice(0, 10);
            
            const dailySales = sales
                .filter(sale => sale.date.startsWith(dateString))
                .reduce((sum, sale) => sum + sale.total, 0);
            
            salesData.push(dailySales);
        });

        // Usa la función del archivo chart-renderer.js
        if (typeof renderSalesChart !== 'undefined') {
            renderSalesChart(salesChartCanvas, salesLabels, salesData);
        }

        // --- Datos de Rentabilidad vs. Costos (Calculados REALES) ---
        // Agrupar ventas por mes y calcular costos y ganancias
        const monthlyProfitAndCost = {};
        const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

        sales.forEach(sale => {
            const saleDate = new Date(sale.date);
            const yearMonth = `${saleDate.getFullYear()}-${saleDate.getMonth()}`;
            
            if (!monthlyProfitAndCost[yearMonth]) {
                monthlyProfitAndCost[yearMonth] = { totalProfit: 0, totalCost: 0 };
            }
            
            const profit = sale.total - sale.cost;
            monthlyProfitAndCost[yearMonth].totalProfit += profit;
            monthlyProfitAndCost[yearMonth].totalCost += sale.cost;
        });

        // Ordenar los meses para el gráfico
        const sortedMonths = Object.keys(monthlyProfitAndCost).sort((a, b) => {
            const [yearA, monthA] = a.split('-').map(Number);
            const [yearB, monthB] = b.split('-').map(Number);
            if (yearA !== yearB) return yearA - yearB;
            return monthA - monthB;
        });

        // Crear los arrays de etiquetas y datos para el gráfico
        const profitLabels = sortedMonths.map(key => {
            const [year, month] = key.split('-');
            return `${monthNames[parseInt(month)]} ${year}`;
        });
        
        const profitData = sortedMonths.map(key => monthlyProfitAndCost[key].totalProfit);
        const costData = sortedMonths.map(key => monthlyProfitAndCost[key].totalCost);

        // Usa la función del archivo chart-renderer.js con los datos reales
        if (typeof renderProfitChart !== 'undefined') {
            renderProfitChart(profitChartCanvas, profitLabels, profitData, costData);
        }
    }
    
    // --- Lógica de Navegación entre Vistas ---
    
    /**
     * Muestra la vista correspondiente y oculta las demás.
     * @param {string} viewId - El ID de la vista a mostrar.
     */
    function showView(viewId) {
        views.forEach(view => {
            if (view.id === viewId) {
                view.classList.remove('hidden');
            } else {
                view.classList.add('hidden');
            }
        });
        
        // Actualiza el título de la página
        const newTitle = document.querySelector(`[data-view="${viewId}"]`).textContent.trim();
        pageTitle.textContent = newTitle;
    }

    // Maneja los clics en los enlaces de navegación
    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            
            // Remueve la clase 'active' de todos los enlaces
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Añade la clase 'active' al enlace clickeado
            link.classList.add('active');
            
            const viewId = link.getAttribute('data-view');
            showView(viewId);
            
            // Si la vista es el dashboard, actualiza los datos y gráficos
            if (viewId === 'dashboard-view') {
                updateDashboardKPIs();
                renderDashboardCharts();
            }
            
            // Guarda la última vista activa en localStorage
            localStorage.setItem('lastView', viewId);
        });
    });
    
    // --- Escucha el evento de actualización de datos desde otros módulos ---
    document.addEventListener('dataUpdated', () => {
        updateDashboardKPIs();
        renderDashboardCharts();
    });

    // --- Inicialización al Cargar la Página ---
    
    // Carga la última vista activa, si existe, o muestra el Dashboard por defecto
    const lastView = localStorage.getItem('lastView') || 'dashboard-view';
    showView(lastView);
    
    // Marca el enlace de la vista activa en el sidebar
    const activeLink = document.querySelector(`.nav-link[data-view="${lastView}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }

    // Llama a la función de actualización del dashboard al iniciar
    updateDashboardKPIs();
    renderDashboardCharts();
});