document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initRegisterForm();
    initLoginForm();
    initDashboard();
    initTable();
    initModal();
});

function initNavigation() {
    const navLinks = document.querySelectorAll('[data-page]');
    const pages = document.querySelectorAll('.page');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.querySelector('.nav-menu');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetPage = link.getAttribute('data-page');

            pages.forEach(page => page.classList.remove('active'));
            navLinks.forEach(navLink => navLink.classList.remove('active'));

            document.getElementById(targetPage)?.classList.add('active');
            link.classList.add('active');

            navMenu.classList.remove('active');
        });
    });

    navToggle?.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
}


function initRegisterForm() {
    const form = document.getElementById('registerForm');
    const passwordToggles = document.querySelectorAll('.toggle-password');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        clearErrors(form);

        let isValid = true;

        const fullName = form.fullName;
        if (fullName.value.trim().length < 3) {
            showError(fullName, 'Imię i nazwisko musi mieć min. 3 znaki');
            isValid = false;
        }

        const email = form.email;
        if (!isValidEmail(email.value)) {
            showError(email, 'Podaj prawidłowy adres email');
            isValid = false;
        }

        const password = form.password;
        if (password.value.length < 8) {
            showError(password, 'Hasło musi mieć min. 8 znaków');
            isValid = false;
        }

        const confirmPassword = form.confirmPassword;
        if (password.value !== confirmPassword.value) {
            showError(confirmPassword, 'Hasła nie są identyczne');
            isValid = false;
        }

        const terms = form.terms;
        if (!terms.checked) {
            showError(terms, 'Musisz zaakceptować regulamin');
            isValid = false;
        }

        if (isValid) {
            showSuccessMessage('Rejestracja przebiegła pomyślnie! Przekierowywanie...');
            setTimeout(() => {
                form.reset();
                document.querySelector('[data-page="login"]').click();
            }, 2000);
        }
    });

    passwordToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const targetId = toggle.getAttribute('data-target');
            const input = document.getElementById(targetId);
            const icon = toggle.querySelector('i');

            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });

    form.querySelectorAll('input').forEach(input => {
        input.addEventListener('blur', () => {
            validateField(input);
        });

        input.addEventListener('input', () => {
            if (input.classList.contains('error')) {
                validateField(input);
            }
        });
    });
}


function initLoginForm() {
    const form = document.getElementById('loginForm');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        clearErrors(form);

        let isValid = true;

        const login = form.login;
        if (login.value.trim().length === 0) {
            showError(login, 'To pole jest wymagane');
            isValid = false;
        }

        const password = form.password;
        if (password.value.length === 0) {
            showError(password, 'To pole jest wymagane');
            isValid = false;
        }

        if (isValid) {
            const btn = form.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logowanie...';
            btn.disabled = true;

            setTimeout(() => {
                showSuccessMessage('Logowanie pomyślne! Witaj z powrotem!');
                btn.innerHTML = originalText;
                btn.disabled = false;

                setTimeout(() => {
                    form.reset();
                    document.querySelector('[data-page="dashboard"]').click();
                }, 1500);
            }, 1500);
        }
    });
}


function initDashboard() {
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebarLinks = document.querySelectorAll('.sidebar-link');

    sidebarToggle?.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });

    sidebarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            sidebarLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });

    const chartCanvas = document.getElementById('mainChart');
    if (chartCanvas) {
        const ctx = chartCanvas.getContext('2d');
        chartCanvas.width = chartCanvas.offsetWidth;
        chartCanvas.height = 300;

        drawSimpleChart(ctx, chartCanvas.width, chartCanvas.height);
    }
}

function drawSimpleChart(ctx, width, height) {
    const data = [30, 45, 38, 55, 48, 62, 58, 70, 65, 78, 72, 85];
    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    const maxValue = Math.max(...data);

    ctx.fillStyle = 'rgba(99, 102, 241, 0.05)';
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = 'rgba(99, 102, 241, 0.1)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
        const y = padding + (chartHeight / 5) * i;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(width - padding, y);
        ctx.stroke();
    }

    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 3;
    ctx.beginPath();

    data.forEach((value, index) => {
        const x = padding + (chartWidth / (data.length - 1)) * index;
        const y = height - padding - (value / maxValue) * chartHeight;

        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });

    ctx.stroke();

    ctx.fillStyle = '#6366f1';
    data.forEach((value, index) => {
        const x = padding + (chartWidth / (data.length - 1)) * index;
        const y = height - padding - (value / maxValue) * chartHeight;

        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fill();
    });

    ctx.fillStyle = '#6b7280';
    ctx.font = '12px Inter';
    ctx.textAlign = 'center';
    const months = ['S', 'L', 'M', 'K', 'M', 'C', 'L', 'S', 'W', 'P', 'L', 'G'];
    months.forEach((month, index) => {
        const x = padding + (chartWidth / (data.length - 1)) * index;
        ctx.fillText(month, x, height - 10);
    });
}


let tableData = [];
let currentPage = 1;
let itemsPerPage = 10;
let sortColumn = 'id';
let sortDirection = 'asc';
let searchTerm = '';

function initTable() {
    generateTableData();
    renderTable();
    setupTableControls();
}

function generateTableData() {
    const names = ['Jan Kowalski', 'Anna Nowak', 'Piotr Wiśniewski', 'Maria Wójcik', 'Tomasz Kamiński',
                   'Katarzyna Lewandowska', 'Krzysztof Zieliński', 'Barbara Szymańska', 'Andrzej Woźniak',
                   'Magdalena Dąbrowska', 'Michał Kozłowski', 'Agnieszka Jankowska', 'Robert Mazur',
                   'Joanna Krawczyk', 'Paweł Kołodziej', 'Ewa Piotrowska', 'Marcin Grabowski',
                   'Monika Pawlak', 'Grzegorz Michalski', 'Beata Zając'];

    const statuses = ['active', 'inactive', 'pending'];

    for (let i = 1; i <= 50; i++) {
        tableData.push({
            id: i,
            name: names[Math.floor(Math.random() * names.length)],
            email: `user${i}@example.com`,
            status: statuses[Math.floor(Math.random() * statuses.length)],
            date: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1)
                .toLocaleDateString('pl-PL')
        });
    }
}

function renderTable() {
    const tbody = document.getElementById('tableBody');
    const filteredData = filterData();
    const sortedData = sortData(filteredData);
    const paginatedData = paginateData(sortedData);

    tbody.innerHTML = '';

    paginatedData.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.id}</td>
            <td>${item.name}</td>
            <td>${item.email}</td>
            <td><span class="status-badge ${item.status}">${getStatusText(item.status)}</span></td>
            <td>${item.date}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-icon btn-edit" onclick="editRow(${item.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon btn-delete" onclick="deleteRow(${item.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });

    updateTableInfo(filteredData.length);
    renderPagination(filteredData.length);
}

function filterData() {
    if (!searchTerm) return tableData;

    return tableData.filter(item => {
        return Object.values(item).some(value =>
            value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );
    });
}

function sortData(data) {
    return [...data].sort((a, b) => {
        let aVal = a[sortColumn];
        let bVal = b[sortColumn];

        if (sortColumn === 'id') {
            aVal = parseInt(aVal);
            bVal = parseInt(bVal);
        }

        if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
        return 0;
    });
}

function paginateData(data) {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return data.slice(start, end);
}

function renderPagination(totalItems) {
    const pagination = document.getElementById('pagination');
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    let html = '';

    html += `<button onclick="changePage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>
                <i class="fas fa-chevron-left"></i>
            </button>`;

    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
            html += `<button onclick="changePage(${i})" class="${i === currentPage ? 'active' : ''}">${i}</button>`;
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            html += `<button disabled>...</button>`;
        }
    }

    html += `<button onclick="changePage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>
                <i class="fas fa-chevron-right"></i>
            </button>`;

    pagination.innerHTML = html;
}

function changePage(page) {
    const totalPages = Math.ceil(filterData().length / itemsPerPage);
    if (page < 1 || page > totalPages) return;

    currentPage = page;
    renderTable();
}

function updateTableInfo(totalItems) {
    const start = (currentPage - 1) * itemsPerPage + 1;
    const end = Math.min(start + itemsPerPage - 1, totalItems);
    const info = document.getElementById('tableInfo');
    info.textContent = `Pokazano ${start}-${end} z ${totalItems} wpisów`;
}

function setupTableControls() {
    // Wyszukiwanie
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', (e) => {
        searchTerm = e.target.value;
        currentPage = 1;
        renderTable();
    });

    const headers = document.querySelectorAll('#dataTable th[data-sort]');
    headers.forEach(header => {
        header.addEventListener('click', () => {
            const column = header.getAttribute('data-sort');

            if (sortColumn === column) {
                sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
            } else {
                sortColumn = column;
                sortDirection = 'asc';
            }

            headers.forEach(h => {
                h.classList.remove('sort-asc', 'sort-desc');
            });
            header.classList.add(`sort-${sortDirection}`);

            renderTable();
        });
    });

    const addDataBtn = document.getElementById('addDataBtn');
    addDataBtn?.addEventListener('click', () => {
        openModal();
    });
}

function editRow(id) {
    const item = tableData.find(item => item.id === id);
    if (item) {
        alert(`Edycja: ${item.name}\nEmail: ${item.email}\nStatus: ${item.status}`);
    }
}

function deleteRow(id) {
    if (confirm('Czy na pewno chcesz usunąć ten wpis?')) {
        tableData = tableData.filter(item => item.id !== id);
        renderTable();
        showSuccessMessage('Wpis został usunięty');
    }
}

function getStatusText(status) {
    const statusTexts = {
        active: 'Aktywny',
        inactive: 'Nieaktywny',
        pending: 'Oczekujący'
    };
    return statusTexts[status] || status;
}

function initModal() {
    const modal = document.getElementById('modal');
    const openBtn = document.getElementById('openModalBtn');
    const closeBtn = document.getElementById('modalClose');
    const cancelBtn = document.getElementById('modalCancel');
    const overlay = modal.querySelector('.modal-overlay');
    const form = document.getElementById('modalForm');

    openBtn?.addEventListener('click', () => {
        openModal();
    });

    closeBtn.addEventListener('click', () => {
        closeModal();
    });

    cancelBtn.addEventListener('click', () => {
        closeModal();
    });

    overlay.addEventListener('click', () => {
        closeModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            closeModal();
        }
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        clearErrors(form);

        let isValid = true;

        const itemName = form.itemName;
        if (itemName.value.trim().length === 0) {
            showError(itemName, 'To pole jest wymagane');
            isValid = false;
        }

        const category = form.category;
        if (!category.value) {
            showError(category, 'Wybierz kategorię');
            isValid = false;
        }

        const description = form.description;
        if (description.value.trim().length < 10) {
            showError(description, 'Opis musi mieć min. 10 znaków');
            isValid = false;
        }

        const price = form.price;
        if (price.value <= 0) {
            showError(price, 'Cena musi być większa niż 0');
            isValid = false;
        }

        if (isValid) {
            const newItem = {
                id: tableData.length + 1,
                name: itemName.value,
                email: `${itemName.value.toLowerCase().replace(/\s+/g, '')}@example.com`,
                status: 'pending',
                date: new Date().toLocaleDateString('pl-PL')
            };

            tableData.unshift(newItem);
            showSuccessMessage('Element został dodany pomyślnie!');
            form.reset();
            closeModal();

            setTimeout(() => {
                document.querySelector('[data-page="table"]').click();
                renderTable();
            }, 1000);
        }
    });
}

function openModal() {
    const modal = document.getElementById('modal');
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';

    setTimeout(() => {
        document.getElementById('itemName')?.focus();
    }, 100);
}

function closeModal() {
    const modal = document.getElementById('modal');
    modal.classList.remove('show');
    document.body.style.overflow = '';

    const form = document.getElementById('modalForm');
    form.reset();
    clearErrors(form);
}

function validateField(input) {
    const formGroup = input.closest('.form-group');
    if (!formGroup) return;

    formGroup.classList.remove('has-error');
    input.classList.remove('error');
    const errorMsg = formGroup.querySelector('.error-message');
    if (errorMsg) errorMsg.textContent = '';

    if (input.type === 'email' && input.value && !isValidEmail(input.value)) {
        showError(input, 'Podaj prawidłowy adres email');
        return false;
    }

    if (input.hasAttribute('required') && !input.value.trim()) {
        showError(input, 'To pole jest wymagane');
        return false;
    }

    if (input.hasAttribute('minlength')) {
        const minLength = parseInt(input.getAttribute('minlength'));
        if (input.value.length < minLength) {
            showError(input, `Minimalna długość: ${minLength} znaków`);
            return false;
        }
    }

    return true;
}

function showError(input, message) {
    const formGroup = input.closest('.form-group') || input.closest('.checkbox-group');
    if (!formGroup) return;

    formGroup.classList.add('has-error');
    input.classList.add('error');

    const errorMsg = formGroup.querySelector('.error-message');
    if (errorMsg) {
        errorMsg.textContent = message;
    }
}

function clearErrors(form) {
    form.querySelectorAll('.form-group, .checkbox-group').forEach(group => {
        group.classList.remove('has-error');
    });
    form.querySelectorAll('input, select, textarea').forEach(input => {
        input.classList.remove('error');
    });
    form.querySelectorAll('.error-message').forEach(msg => {
        msg.textContent = '';
    });
}

function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function showSuccessMessage(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: #10b981;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        z-index: 9999;
        animation: slideInRight 0.3s ease;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        max-width: 400px;
    `;

    notification.innerHTML = `
        <i class="fas fa-check-circle" style="font-size: 1.25rem;"></i>
        <span>${message}</span>
    `;

    document.body.appendChild(notification);

    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                opacity: 0;
                transform: translateX(100px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
    `;
    document.head.appendChild(style);


    setTimeout(() => {
        notification.style.animation = 'slideInRight 0.3s ease reverse';
        setTimeout(() => {
            notification.remove();
            style.remove();
        }, 300);
    }, 3000);
}
