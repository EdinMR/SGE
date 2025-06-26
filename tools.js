// tools.js

document.addEventListener('DOMContentLoaded', () => {

    // --- Calculadora de Punto de Equilibrio (Break-Even) ---
    const breakEvenForm = document.getElementById('breakEvenForm');
    const fixedCostsInput = document.getElementById('fixed-costs');
    const pricePerUnitInput = document.getElementById('price-per-unit');
    const variableCostPerUnitInput = document.getElementById('variable-cost-per-unit');
    const breakEvenResultDiv = document.getElementById('break-even-result');
    const unitsResultElement = document.getElementById('units-result');
    const revenueResultElement = document.getElementById('revenue-result');

    breakEvenForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const fixedCosts = parseFloat(fixedCostsInput.value);
        const pricePerUnit = parseFloat(pricePerUnitInput.value);
        const variableCostPerUnit = parseFloat(variableCostPerUnitInput.value);

        const contributionMargin = pricePerUnit - variableCostPerUnit;

        if (contributionMargin <= 0) {
            alert('El precio de venta debe ser mayor que el costo variable para poder alcanzar un punto de equilibrio.');
            breakEvenResultDiv.classList.add('hidden');
            return;
        }

        // Fórmula del Punto de Equilibrio en Unidades
        const breakEvenUnits = fixedCosts / contributionMargin;
        // Fórmula del Punto de Equilibrio en Ingresos
        const breakEvenRevenue = breakEvenUnits * pricePerUnit;

        unitsResultElement.textContent = breakEvenUnits.toFixed(2);
        revenueResultElement.textContent = `S/. ${breakEvenRevenue.toFixed(2)}`;
        breakEvenResultDiv.classList.remove('hidden');
    });

    // --- Simulador de Ganancias (Profit Simulator) ---
    const profitSimulatorForm = document.getElementById('profitSimulatorForm');
    const simUnitsSoldInput = document.getElementById('sim-units-sold');
    const simPricePerUnitInput = document.getElementById('sim-price-per-unit');
    const simVariableCostInput = document.getElementById('sim-variable-cost');
    const simFixedCostsInput = document.getElementById('sim-fixed-costs');
    const profitSimResultDiv = document.getElementById('profit-sim-result');
    const simRevenueResultElement = document.getElementById('sim-revenue-result');
    const simTotalCostResultElement = document.getElementById('sim-total-cost-result');
    const simNetProfitResultElement = document.getElementById('sim-net-profit-result');

    profitSimulatorForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const unitsSold = parseFloat(simUnitsSoldInput.value);
        const pricePerUnit = parseFloat(simPricePerUnitInput.value);
        const variableCost = parseFloat(simVariableCostInput.value);
        const fixedCosts = parseFloat(simFixedCostsInput.value);

        // Calcular Ingresos Totales
        const totalRevenue = unitsSold * pricePerUnit;

        // Calcular Costos Totales (variables + fijos)
        const totalVariableCost = unitsSold * variableCost;
        const totalCost = totalVariableCost + fixedCosts;

        // Calcular Ganancia Neta
        const netProfit = totalRevenue - totalCost;

        simRevenueResultElement.textContent = `S/. ${totalRevenue.toFixed(2)}`;
        simTotalCostResultElement.textContent = `S/. ${totalCost.toFixed(2)}`;
        simNetProfitResultElement.textContent = `S/. ${netProfit.toFixed(2)}`;

        // Cambiar el color del resultado de ganancia
        if (netProfit > 0) {
            simNetProfitResultElement.classList.remove('text-red-600', 'dark:text-red-400');
            simNetProfitResultElement.classList.add('text-green-600', 'dark:text-green-400');
        } else if (netProfit < 0) {
            simNetProfitResultElement.classList.remove('text-green-600', 'dark:text-green-400');
            simNetProfitResultElement.classList.add('text-red-600', 'dark:text-red-400');
        } else {
            simNetProfitResultElement.classList.remove('text-green-600', 'dark:text-green-400', 'text-red-600', 'dark:text-red-400');
        }

        profitSimResultDiv.classList.remove('hidden');
    });
});