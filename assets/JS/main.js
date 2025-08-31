document.addEventListener('DOMContentLoaded', function () {
    // Elementos DOM
    const mainView = document.getElementById('main-view');
    const resultView = document.getElementById('result-view');
    const historyView = document.getElementById('history-view');
    const invoiceForm = document.getElementById('invoice-form');
    const loader = document.getElementById('loader');
    const toast = document.getElementById('toast');

    // Elementos de navegación
    const navHome = document.getElementById('nav-home');
    const navHistory = document.getElementById('nav-history');
    const backToFormBtn = document.getElementById('back-to-form');
    const newInvoiceBtn = document.getElementById('new-invoice');
    const copyBtn = document.getElementById('copy-summary');

    // Elementos de visualización condicional
    const discountSection = document.getElementById('discount-section');
    const surchargeSection = document.getElementById('surcharge-section');
    const emptyHistory = document.getElementById('empty-history');
    const historyList = document.getElementById('history-list');

    // Constantes de facturación
    const DAILY_RATE = 35000;
    const OUTSIDE_CITY_SURCHARGE = 0.05;
    const INSTORE_DISCOUNT = 0.05;
    const ADDITIONAL_DAY_DISCOUNT = 0.02;

    // Inicializar historial desde LocalStorage
    let invoiceHistory = JSON.parse(localStorage.getItem('invoiceHistory')) || [];

    // Mostrar elementos basados en el historial
    if (invoiceHistory.length === 0) {
        emptyHistory.classList.remove('hidden');
        historyList.classList.add('hidden');
    } else {
        emptyHistory.classList.add('hidden');
        historyList.classList.remove('hidden');
    }

    // Función para generar ID de cliente aleatorio
    function generateClientId() {
        return 'CLI-' + Math.floor(100000 + Math.random() * 900000);
    }

    // Función para generar ID de factura
    function generateInvoiceId() {
        return 'FAC-' + new Date().getTime().toString().slice(-6);
    }

    // Función para formatear moneda
    function formatCurrency(amount) {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    }

    // Función para mostrar notificación toast
    function showToast(message, type = 'success') {
        toast.textContent = message;
        toast.className = 'toast show';

        if (type === 'success') {
            toast.classList.add('bg-green-500');
        } else {
            toast.classList.add('bg-red-500');
        }

        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // Función para cambiar entre vistas
    function showView(view) {
        mainView.classList.add('hidden');
        resultView.classList.add('hidden');
        historyView.classList.add('hidden');

        if (view === 'main') {
            mainView.classList.remove('hidden');
        } else if (view === 'result') {
            resultView.classList.remove('hidden');
        } else if (view === 'history') {
            historyView.classList.remove('hidden');
            renderHistory();
        }
    }

    // Función para renderizar historial
    function renderHistory() {
        historyList.innerHTML = '';

        if (invoiceHistory.length === 0) {
            emptyHistory.classList.remove('hidden');
            historyList.classList.add('hidden');
            return;
        }

        emptyHistory.classList.add('hidden');
        historyList.classList.remove('hidden');

        // Ordenar facturas de más recientes a más antiguas
        const sortedHistory = [...invoiceHistory].reverse();

        sortedHistory.forEach(invoice => {
            const historyItem = document.createElement('div');
            historyItem.className = 'card border border-gray-200 rounded-lg p-4 hover:shadow-md';

            historyItem.innerHTML = `
                        <div class="flex justify-between items-center mb-2">
                            <h3 class="font-medium">Factura #${invoice.invoiceId}</h3>
                            <span class="text-xs text-gray-500">${new Date(invoice.timestamp).toLocaleDateString()}</span>
                        </div>
                        <div class="grid grid-cols-2 gap-2 text-sm">
                            <div>
                                <span class="text-gray-500">Cliente:</span> ${invoice.clientId}
                            </div>
                            <div>
                                <span class="text-gray-500">Total:</span> ${formatCurrency(invoice.totalAmount)}
                            </div>
                            <div>
                                <span class="text-gray-500">Equipos:</span> ${invoice.equipmentCount}
                            </div>
                            <div>
                                <span class="text-gray-500">Días:</span> ${invoice.initialDays} + ${invoice.additionalDays} adicionales
                            </div>
                        </div>
                        <button class="view-details mt-2 text-indigo-600 text-sm hover:text-indigo-800" data-id="${invoice.invoiceId}">
                            Ver detalles
                        </button>
                    `;

            historyList.appendChild(historyItem);

            // Agregar evento para ver detalles
            historyItem.querySelector('.view-details').addEventListener('click', function () {
                const invoiceId = this.getAttribute('data-id');
                const invoice = invoiceHistory.find(inv => inv.invoiceId === invoiceId);
                if (invoice) {
                    displayInvoice(invoice);
                    showView('result');
                }
            });
        });
    }

    // Función para mostrar factura
    function displayInvoice(invoice) {
        document.getElementById('invoice-id').textContent = invoice.invoiceId;
        document.getElementById('client-id').textContent = invoice.clientId;

        let rentalOption = '';
        if (invoice.locationType === 'city') rentalOption = 'Dentro de la ciudad';
        else if (invoice.locationType === 'outside') rentalOption = 'Fuera de la ciudad';
        else rentalOption = 'Dentro del establecimiento';

        document.getElementById('rental-option').textContent = rentalOption;
        document.getElementById('equipment-count').textContent = invoice.equipmentCount + ' equipos';
        document.getElementById('initial-days').textContent = invoice.initialDays + ' días';
        document.getElementById('extra-days').textContent = invoice.additionalDays + ' días';
        document.getElementById('base-cost').textContent = formatCurrency(invoice.baseCost);

        if (invoice.discount > 0) {
            document.getElementById('discount').textContent = '- ' + formatCurrency(invoice.discount);
            discountSection.classList.remove('hidden');
        } else {
            discountSection.classList.add('hidden');
        }

        if (invoice.surcharge > 0) {
            document.getElementById('surcharge').textContent = '+ ' + formatCurrency(invoice.surcharge);
            surchargeSection.classList.remove('hidden');
        } else {
            surchargeSection.classList.add('hidden');
        }

        document.getElementById('total-amount').textContent = formatCurrency(invoice.totalAmount);
    }

    // Evento de envío del formulario
    invoiceForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Mostrar loader
        loader.classList.remove('hidden');

        // Simular tiempo de carga para la API
        setTimeout(() => {
            const equipmentCount = parseInt(document.getElementById('equipments').value);
            const initialDays = parseInt(document.getElementById('days').value);
            const locationType = document.getElementById('location').value;
            const additionalDays = parseInt(document.getElementById('additional-days').value) || 0;

            // Validaciones
            if (equipmentCount < 2) {
                alert('Debe alquilar al menos 2 equipos');
                loader.classList.add('hidden');
                return;
            }

            // Calcular costos
            const baseCost = equipmentCount * DAILY_RATE * (initialDays + additionalDays);
            let discount = 0;
            let surcharge = 0;

            // Aplicar recargos o descuentos según ubicación
            if (locationType === 'outside') {
                surcharge = baseCost * OUTSIDE_CITY_SURCHARGE;
            } else if (locationType === 'instore') {
                discount += baseCost * INSTORE_DISCOUNT;
            }

            // Descuento por días adicionales
            if (additionalDays > 0) {
                discount += equipmentCount * DAILY_RATE * additionalDays * ADDITIONAL_DAY_DISCOUNT;
            }

            // Calcular total
            const totalAmount = baseCost - discount + surcharge;

            // Generar IDs
            const clientId = generateClientId();
            const invoiceId = generateInvoiceId();

            // Crear objeto factura
            const invoice = {
                invoiceId,
                clientId,
                equipmentCount,
                initialDays,
                additionalDays,
                locationType,
                baseCost,
                discount,
                surcharge,
                totalAmount,
                timestamp: new Date().getTime()
            };

            // Guardar en historial
            invoiceHistory.push(invoice);
            localStorage.setItem('invoiceHistory', JSON.stringify(invoiceHistory));

            // Mostrar resultados
            displayInvoice(invoice);

            // Ocultar loader y mostrar vista de resultado
            loader.classList.add('hidden');
            showView('result');
        }, 1000);
    });

    // Navegación entre vistas
    navHome.addEventListener('click', () => showView('main'));
    navHistory.addEventListener('click', () => showView('history'));
    backToFormBtn.addEventListener('click', () => showView('main'));
    newInvoiceBtn.addEventListener('click', () => {
        invoiceForm.reset();
        showView('main');
    });

    // Función para copiar resumen de factura
    copyBtn.addEventListener('click', function () {
        const clientId = document.getElementById('client-id').textContent;
        const invoiceId = document.getElementById('invoice-id').textContent;
        const rentalOption = document.getElementById('rental-option').textContent;
        const equipmentCount = document.getElementById('equipment-count').textContent;
        const initialDays = document.getElementById('initial-days').textContent;
        const additionalDays = document.getElementById('extra-days').textContent;
        const totalAmount = document.getElementById('total-amount').textContent;

        const summaryText = `
                    Factura ALQUIPC #${invoiceId}
                    
                    ID Cliente: ${clientId}
                    Opción de alquiler: ${rentalOption}
                    Equipos: ${equipmentCount}
                    Periodo: ${initialDays} iniciales + ${additionalDays} adicionales
                    
                    Total a pagar: ${totalAmount}
                    
                    Gracias por confiar en ALQUIPC para el alquiler de sus equipos.
                `;

        navigator.clipboard.writeText(summaryText.trim()).then(() => {
            showToast('Resumen copiado al portapapeles');
        }).catch(err => {
            console.error('Error al copiar: ', err);
            showToast('Error al copiar el resumen', 'error');
        });
    });
});