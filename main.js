// Wait for the DOM to be fully loaded before initializing
document.addEventListener('DOMContentLoaded', () => {
    initializeSidebar();
    initializePatientTable();
    initializeResetButton();
    initializePrintButton();
    initializeCalculationForm();
    if (typeof lucide !== 'undefined' && typeof lucide.createIcons === 'function') {
        lucide.createIcons();
    }

    // Fade in the main content after a short delay
    const mainContent = document.querySelector('main');
    if (mainContent) {
        mainContent.style.opacity = 0;
        setTimeout(() => {
            mainContent.style.transition = 'opacity 0.5s ease-in-out';
            mainContent.style.opacity = 1;
        }, 100);
    }
});

// Sidebar Functionality
function initializeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('toggleBtn');
    const submenus = document.querySelectorAll('.has-submenu');

    if (!sidebar || !toggleBtn) return;

    // Temporarily disable transitions on page load
    sidebar.classList.add('no-transition');
    document.body.classList.add('no-transition');
    
    // Immediately hide all submenus without transition
    document.querySelectorAll('.submenu').forEach(submenu => {
        submenu.style.cssText = 'transition: none; max-height: 0;';
    });

    // Apply the saved sidebar state
    const isCollapsed = localStorage.getItem('sidebar-collapsed') === 'true';
    sidebar.classList.toggle('collapsed', isCollapsed);
    document.body.classList.toggle('sidebar-collapsed', isCollapsed);
    document.body.classList.toggle('sidebar-expanded', !isCollapsed);

    // Restore submenu states
    restoreSubmenuStates();

    // Re-enable transitions after a delay
    setTimeout(() => {
        sidebar.classList.remove('no-transition');
        document.body.classList.remove('no-transition');
        
        // Re-enable transitions for submenus
        document.querySelectorAll('.submenu').forEach(submenu => {
            submenu.style.transition = '';
        });
    }, 100);

    // Sidebar toggle functionality
    toggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
        const isCollapsed = sidebar.classList.contains('collapsed');
        document.body.classList.toggle('sidebar-collapsed', isCollapsed);
        document.body.classList.toggle('sidebar-expanded', !isCollapsed);
        localStorage.setItem('sidebar-collapsed', isCollapsed);
    });

    // Submenu functionality
    submenus.forEach(submenu => {
        submenu.addEventListener('click', (e) => {
            e.preventDefault();
            submenu.classList.toggle('open');
            const submenuList = submenu.querySelector('.submenu');
            if (submenuList) {
                submenuList.style.maxHeight = submenu.classList.contains('open') 
                    ? `${submenuList.scrollHeight}px` 
                    : null;
            }
            saveSubmenuStates();
        });
    });

    // Prevent submenu links from triggering submenu toggle
    document.querySelectorAll('.submenu a').forEach(item => {
        item.addEventListener('click', (e) => e.stopPropagation());
    });
}

function saveSubmenuStates() {
    const openSubmenus = Array.from(document.querySelectorAll('.has-submenu.open'))
        .map(sub => sub.dataset.submenuId);
    localStorage.setItem('open-submenus', JSON.stringify(openSubmenus));
}

function restoreSubmenuStates() {
    const openSubmenus = JSON.parse(localStorage.getItem('open-submenus') || '[]');
    openSubmenus.forEach(id => {
        const submenu = document.querySelector(`.has-submenu[data-submenu-id="${id}"]`);
        if (submenu) {
            submenu.classList.add('open');
            const submenuList = submenu.querySelector('.submenu');
            if (submenuList) {
                submenuList.style.maxHeight = `${submenuList.scrollHeight}px`;
            }
        }
    });
}

// Patient Table Functionality
function initializePatientTable() {
    const tableBody = document.querySelector('#patientTable tbody');
    if (!tableBody) return;

    for (let i = 1; i <= 20; i++) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${i}</td>
            <td><input type="number" step="0.01" aria-label="Test Conc"></td>
            <td>0.00</td>`;
        tableBody.appendChild(row);
    }

    // Add event listeners using event delegation
    tableBody.addEventListener('input', handleTableInput);
    tableBody.addEventListener('keydown', handleTableKeyDown);

    enableTestConcInputs(false);
}

function handleTableInput(event) {
    if (event.target.type === 'number') {
        calculateResult(event.target);
    }
}

function handleTableKeyDown(event) {
    if (event.target.type === 'number') {
        moveToNextTableField(event);
    }
}

function calculateResult(input) {
    const cf = parseFloat(document.getElementById('cf')?.value);
    if (isNaN(cf)) return;

    const testConc = parseFloat(input.value);
    const resultCell = input.parentNode.nextElementSibling;

    if (!isNaN(testConc)) {
        const result = testConc / cf;
        resultCell.textContent = result.toFixed(2);
        resultCell.className = result > 1 ? 'bold-red' : '';
    } else {
        resultCell.textContent = '0.00';
        resultCell.className = '';
    }
}

function moveToNextTableField(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        const allInputs = Array.from(document.querySelectorAll('#patientTable input[type="number"]'));
        const currentIndex = allInputs.indexOf(event.target);
        const nextInput = allInputs[currentIndex + 1];

        if (nextInput) {
            nextInput.focus();
        }
    }
}

function enableTestConcInputs(enable) {
    document.querySelectorAll('#patientTable tbody tr input[type="number"]').forEach(input => {
        input.disabled = !enable;
    });
}

// Reset Functionality
function initializeResetButton() {
    const resetButton = document.getElementById('resetButton');
    if (resetButton) {
        resetButton.addEventListener('click', reset);
    }
}

function reset() {
    ['factor', 'conc', 'cf'].forEach(id => {
        const element = document.getElementById(id);
        if (element) element.value = '';
    });

    const rows = document.querySelectorAll('#patientTable tbody tr');
    rows.forEach((row) => {
        const testConcInput = row.cells[1]?.querySelector('input');
        if (testConcInput) {
            testConcInput.value = '';
        }
        
        if (row.cells[2]) {
            row.cells[2].textContent = '0.00';
            row.cells[2].className = '';
        }
    });

    enableTestConcInputs(false);
}

// Print Functionality
function initializePrintButton() {
    const printButton = document.getElementById('printButton');
    if (printButton) {
        printButton.addEventListener('click', () => printDiv('container'));
    }
}

function printDiv(divId) {
    let printWindow = window.open('', '_blank');
    let elementToPrint = document.getElementById(divId);
    if (!elementToPrint) return;

    let clonedElement = elementToPrint.cloneNode(true);
    
    let originalInputs = elementToPrint.querySelectorAll('input');
    let clonedInputs = clonedElement.querySelectorAll('input');
    for (let i = 0; i < originalInputs.length; i++) {
        clonedInputs[i].value = originalInputs[i].value;
        clonedInputs[i].setAttribute('value', originalInputs[i].value);
    }

    // Remove hover-message elements
    clonedElement.querySelectorAll('.hover-message').forEach(el => el.remove());

    let printContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>FACTOR Calculation Tool - Print Version</title>
            <style>
                body { 
                    font-family: Arial, sans-serif; 
                    line-height: 1.6; 
                    color: #333;
                    padding: 20px;
                }
                h1 {
                    color: #2c3e50;
                    border-bottom: 2px solid #3498db;
                    padding-bottom: 10px;
                }
                .input-section {
                    background-color: #f9f9f9;
                    border: 1px solid #ddd;
                    border-radius: 5px;
                    padding: 15px;
                    margin-bottom: 20px;
                }
                .input-group {
                    margin-bottom: 10px;
                }
                label {
                    font-weight: bold;
                    margin-right: 10px;
                }
                input { 
                    border: 1px solid #ccc;
                    padding: 5px;
                    border-radius: 3px;
                    font-family: inherit;
                    font-size: inherit;
                    background-color: transparent;
                }
                table { 
                    border-collapse: collapse; 
                    width: 100%;
                    margin-top: 20px;
                }
                th, td { 
                    border: 1px solid #ddd; 
                    padding: 12px; 
                    text-align: left; 
                }
                th {
                    background-color: #f2f2f2;
                    font-weight: bold;
                }
                .hover-message, button, .container2 { 
                    display: none; 
                }
                @media print {
                    body * { visibility: visible; }
                    input { 
                        color-adjust: exact; 
                        -webkit-print-color-adjust: exact; 
                        print-color-adjust: exact;
                        border: none;
                    }
                    input[type="number"] {
                        -moz-appearance: textfield;
                    }
                    input::-webkit-outer-spin-button,
                    input::-webkit-inner-spin-button {
                        -webkit-appearance: none;
                        margin: 0;
                    }
                }
            </style>
        </head>
        <body>
            ${clonedElement.outerHTML}
            <script>
                window.onload = function() {
                    document.querySelectorAll('input').forEach(input => {
                        if (input.value) {
                            input.setAttribute('value', input.value);
                        }
                    });
                    window.print();
                    window.close();
                }
            </script>
        </body>
        </html>`;
    
    printWindow.document.write(printContent);
    printWindow.document.close();
}

// Calculation Form Functionality
function initializeCalculationForm() {
    const form = document.getElementById('calculationForm');
    if (form) {
        form.addEventListener('input', calculateCF);
        form.addEventListener('keydown', handleFormKeyDown);
    }
}

function calculateCF() {
    const factor = parseFloat(document.getElementById('factor')?.value);
    const conc = parseFloat(document.getElementById('conc')?.value);
    const cfInput = document.getElementById('cf');

    if (!isNaN(factor) && !isNaN(conc) && cfInput) {
        const cf = factor * conc;
        cfInput.value = cf.toFixed(3);
        enableTestConcInputs(true);
    } else {
        if (cfInput) cfInput.value = '';
        enableTestConcInputs(false);
    }
}

function handleFormKeyDown(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        moveToNextFormField(event);
    }
}

function moveToNextFormField(event) {
    const formInputs = ['factor', 'conc'];
    const currentIndex = formInputs.indexOf(event.target.id);
    if (currentIndex > -1) {
        if (currentIndex < formInputs.length - 1) {
            // Move to the next form input
            const nextInput = document.getElementById(formInputs[currentIndex + 1]);
            if (nextInput) {
                nextInput.focus();
            }
        } else {
            // If we're on the last form input, move to the first table input
            const firstTableInput = document.querySelector('#patientTable tbody tr:first-child input[type="number"]');
            if (firstTableInput) {
                firstTableInput.focus();
            }
        }
    }
}