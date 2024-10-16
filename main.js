// DOM Content Loaded Event Listener
document.addEventListener('DOMContentLoaded', () => {
    initializeSidebar();
    initializePatientTable();
    initializeResetButton();
    initializePrintButton();
    lucide.createIcons();
});

// Sidebar Functionality
function initializeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('toggleBtn');
    const submenus = document.querySelectorAll('.has-submenu');

    toggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
        document.body.classList.toggle('sidebar-collapsed');
        document.body.classList.toggle('sidebar-expanded');
    });

    submenus.forEach(submenu => {
        submenu.addEventListener('click', (e) => {
            e.preventDefault();
            const clickedSubmenu = e.currentTarget;
            const submenuList = clickedSubmenu.querySelector('.submenu');

            submenus.forEach(other => {
                if (other !== clickedSubmenu) {
                    other.classList.remove('open');
                    other.querySelector('.submenu').style.maxHeight = null;
                }
            });

            clickedSubmenu.classList.toggle('open');
            submenuList.style.maxHeight = clickedSubmenu.classList.contains('open') 
                ? `${submenuList.scrollHeight}px` 
                : null;
        });
    });

    document.querySelectorAll('.submenu a').forEach(item => {
        item.addEventListener('click', (e) => e.stopPropagation());
    });
}

// Patient Table Functionality
function initializePatientTable() {
    const tableBody = document.querySelector('#patientTable tbody');
    for (let i = 1; i <= 20; i++) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${i}</td>
            <td><input type="number" step="0.01" aria-label="Test Conc" oninput="calculateResult(this)" onkeydown="moveToNextField(event)"></td>
            <td>0.00</td>`;
        tableBody.appendChild(row);
    }
    enableTestConcInputs(false);
}

function calculateCF() {
    const factor = parseFloat(document.getElementById('factor').value);
    const conc = parseFloat(document.getElementById('conc').value);

    if (!isNaN(factor) && !isNaN(conc)) {
        const cf = conc * factor;
        document.getElementById('cf').value = cf.toFixed(4);

        document.querySelectorAll('#patientTable tbody tr').forEach(row => {
            const testConcInput = row.cells[1].querySelector('input');
            if (testConcInput.value) {
                calculateResult(testConcInput);
            }
        });

        enableTestConcInputs(true);
    } else {
        document.getElementById('cf').value = '';
        enableTestConcInputs(false);
    }
}

function calculateResult(input) {
    const cf = parseFloat(document.getElementById('cf').value);
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

function moveToNextField(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        const allInputs = Array.from(document.querySelectorAll('input[type="number"]:not(#cf):not([id^="reset"])'));
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
    } else {
        console.log("Reset button not found");
    }
}

function reset() {
    console.log("Reset function called");

    ['factor', 'conc', 'cf'].forEach(id => {
        document.getElementById(id).value = '';
    });

    const rows = document.querySelectorAll('#patientTable tbody tr');
    rows.forEach((row, index) => {
        const testConcInput = row.cells[1].querySelector('input');
        if (testConcInput) {
            testConcInput.value = '';
        }
        
        if (row.cells[2]) {
            row.cells[2].textContent = '0.00';
            row.cells[2].className = '';
        }
    });

    enableTestConcInputs(false);
    console.log("Reset completed");
}

// Print Functionality
function initializePrintButton() {
    document.getElementById('printButton').addEventListener('click', () => printDiv('container'));
}

function printDiv(divId) {
    let printWindow = window.open('', '_blank');
    let elementToPrint = document.getElementById(divId);
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
        </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
}

// Make sure to call this function when the page loads
window.onload = function() {
    // Existing onload code...
    document.getElementById('printButton').addEventListener('click', () => printDiv('container'));
}
