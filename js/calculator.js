// calculator.js - Contains all calculation page specific functionality
// ==============================================================
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize these if we're on the calculation page
    if (document.getElementById('calculationForm')) {
        initializePatientTable();
        initializeResetButton();
        initializePrintButton();
        initializeCalculationForm();
    }
});

// Patient Table Functions
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
    document.querySelectorAll('#patientTable tbody tr input[type="number"]')
        .forEach(input => input.disabled = !enable);
}

// Reset Button Functions
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

// Print Button Functions
function initializePrintButton() {
    const printButton = document.getElementById('printButton');
    if (printButton) {
        printButton.addEventListener('click', () => printDiv('container'));
    }
}

// Print Button Functions
function initializePrintButton() {
    const printButton = document.getElementById('printButton');
    if (printButton) {
        printButton.addEventListener('click', () => printDiv('container'));
    }
}
function printDiv(divId) {
    const elementToPrint = document.getElementById(divId);
    if (!elementToPrint) return;

    const clonedElement = elementToPrint.cloneNode(true);

    // Copy input values
    const originalInputs = elementToPrint.querySelectorAll('input');
    const clonedInputs = clonedElement.querySelectorAll('input');
    for (let i = 0; i < originalInputs.length; i++) {
        clonedInputs[i].value = originalInputs[i].value;
        clonedInputs[i].setAttribute('value', originalInputs[i].value);
    }

    // Remove hover messages
    clonedElement.querySelectorAll('.hover-message').forEach(el => el.remove());

    const printContent = 
        `<!DOCTYPE html>
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
        </body>
        </html>`;

    const printWindow = window.open('', 'Print');
    if (!printWindow) return;

    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();

    printWindow.addEventListener('afterprint', () => {
        printWindow.close();
    });

    setTimeout(() => {
        if (!printWindow.closed) printWindow.close();
    }, 2000);
}


// Calculation Form Functions
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
            const nextInput = document.getElementById(formInputs[currentIndex + 1]);
            if (nextInput) {
                nextInput.focus();
            }
        } else {
            const firstTableInput = document.querySelector('#patientTable tbody tr:first-child input[type="number"]');
            if (firstTableInput) {
                firstTableInput.focus();
            }
        }
    }
}