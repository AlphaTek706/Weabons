// Admin panel JavaScript functionality

$(document).ready(function() {
    // Initialize admin components
    initializeAdminComponents();
    
    // Initialize data tables
    initializeDataTables();
    
    // Initialize charts
    initializeCharts();
    
    // Initialize form validation
    initializeFormValidation();
    
    // Initialize bulk actions
    initializeBulkActions();
    
    // Initialize real-time updates
    initializeRealTimeUpdates();
});

// Initialize admin components
function initializeAdminComponents() {
    // Auto-hide alerts
    setTimeout(function() {
        $('.alert').fadeOut('slow');
    }, 5000);
    
    // Initialize tooltips
    $('[data-bs-toggle="tooltip"]').tooltip();
    
    // Initialize popovers
    $('[data-bs-toggle="popover"]').popover();
    
    // Initialize dropdowns
    $('.dropdown-toggle').dropdown();
    
    // Sidebar toggle for mobile
    $('#sidebarToggle').on('click', function() {
        $('.sidebar').toggleClass('active');
    });
    
    // Active menu highlighting
    highlightActiveMenu();
}

// Highlight active menu item
function highlightActiveMenu() {
    const currentPath = window.location.pathname;
    $('.sidebar .nav-link').each(function() {
        const href = $(this).attr('href');
        if (currentPath.includes(href)) {
            $(this).addClass('active');
        }
    });
}

// Initialize data tables
function initializeDataTables() {
    if ($('.data-table').length > 0) {
        $('.data-table').each(function() {
            const $table = $(this);
            
            // Add search functionality
            addTableSearch($table);
            
            // Add sorting functionality
            addTableSorting($table);
            
            // Add row selection
            addRowSelection($table);
            
            // Add export functionality
            addExportFunctionality($table);
        });
    }
}

// Add table search
function addTableSearch($table) {
    const searchInput = $('<input type="text" class="form-control mb-3" placeholder="البحث...">');
    $table.before(searchInput);
    
    searchInput.on('input', function() {
        const searchTerm = $(this).val().toLowerCase();
        
        $table.find('tbody tr').each(function() {
            const rowText = $(this).text().toLowerCase();
            if (rowText.includes(searchTerm)) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    });
}

// Add table sorting
function addTableSorting($table) {
    $table.find('th').each(function() {
        const $th = $(this);
        if (!$th.hasClass('no-sort')) {
            $th.addClass('sortable');
            $th.append('<i class="fas fa-sort ms-2"></i>');
            
            $th.on('click', function() {
                const columnIndex = $(this).index();
                const isAscending = !$(this).hasClass('sort-asc');
                
                // Reset all sort indicators
                $table.find('th').removeClass('sort-asc sort-desc');
                $table.find('th i').removeClass('fa-sort-up fa-sort-down').addClass('fa-sort');
                
                // Set current sort
                if (isAscending) {
                    $(this).addClass('sort-asc');
                    $(this).find('i').removeClass('fa-sort').addClass('fa-sort-up');
                } else {
                    $(this).addClass('sort-desc');
                    $(this).find('i').removeClass('fa-sort').addClass('fa-sort-down');
                }
                
                sortTable($table, columnIndex, isAscending);
            });
        }
    });
}

// Sort table
function sortTable($table, columnIndex, isAscending) {
    const rows = $table.find('tbody tr').get();
    
    rows.sort(function(a, b) {
        const aText = $(a).find('td').eq(columnIndex).text().trim();
        const bText = $(b).find('td').eq(columnIndex).text().trim();
        
        // Check if values are numbers
        const aNum = parseFloat(aText.replace(/[^0-9.-]/g, ''));
        const bNum = parseFloat(bText.replace(/[^0-9.-]/g, ''));
        
        if (!isNaN(aNum) && !isNaN(bNum)) {
            return isAscending ? aNum - bNum : bNum - aNum;
        } else {
            return isAscending ? aText.localeCompare(bText) : bText.localeCompare(aText);
        }
    });
    
    $table.find('tbody').append(rows);
}

// Add row selection
function addRowSelection($table) {
    // Add master checkbox
    const masterCheckbox = $('<input type="checkbox" class="form-check-input">');
    $table.find('thead tr').prepend($('<th></th>').append(masterCheckbox));
    
    // Add row checkboxes
    $table.find('tbody tr').each(function() {
        const checkbox = $('<input type="checkbox" class="form-check-input row-checkbox">');
        $(this).prepend($('<td></td>').append(checkbox));
    });
    
    // Master checkbox functionality
    masterCheckbox.on('change', function() {
        const isChecked = $(this).is(':checked');
        $table.find('.row-checkbox').prop('checked', isChecked);
        updateBulkActions();
    });
    
    // Row checkbox functionality
    $table.on('change', '.row-checkbox', function() {
        const totalRows = $table.find('.row-checkbox').length;
        const checkedRows = $table.find('.row-checkbox:checked').length;
        
        masterCheckbox.prop('checked', totalRows === checkedRows);
        updateBulkActions();
    });
}

// Update bulk actions
function updateBulkActions() {
    const checkedCount = $('.row-checkbox:checked').length;
    const $bulkActions = $('.bulk-actions');
    
    if (checkedCount > 0) {
        $bulkActions.show();
        $bulkActions.find('.selected-count').text(checkedCount);
    } else {
        $bulkActions.hide();
    }
}

// Add export functionality
function addExportFunctionality($table) {
    const exportButton = $('<button class="btn btn-outline-primary btn-sm me-2"><i class="fas fa-download"></i> تصدير</button>');
    $table.before(exportButton);
    
    exportButton.on('click', function() {
        exportTableToCSV($table);
    });
}

// Export table to CSV
function exportTableToCSV($table) {
    const csv = [];
    const rows = $table.find('tr');
    
    rows.each(function() {
        const row = [];
        $(this).find('td, th').each(function() {
            row.push($(this).text().trim());
        });
        csv.push(row.join(','));
    });
    
    const csvContent = csv.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.csv';
    a.click();
    window.URL.revokeObjectURL(url);
}

// Initialize charts
function initializeCharts() {
    // Sales chart
    initializeSalesChart();
    
    // Products chart
    initializeProductsChart();
    
    // Orders chart
    initializeOrdersChart();
    
    // Users chart
    initializeUsersChart();
}

// Initialize sales chart
function initializeSalesChart() {
    const ctx = document.getElementById('salesChart');
    if (ctx) {
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو'],
                datasets: [{
                    label: 'المبيعات',
                    data: [1200, 1900, 3000, 5000, 2000, 3000],
                    borderColor: 'rgb(75, 192, 192)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
}

// Initialize products chart
function initializeProductsChart() {
    const ctx = document.getElementById('productsChart');
    if (ctx) {
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['أسلحة', 'ذخيرة', 'معدات', 'إكسسوارات'],
                datasets: [{
                    data: [30, 25, 20, 25],
                    backgroundColor: [
                        '#ff6384',
                        '#36a2eb',
                        '#cc65fe',
                        '#ffce56'
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                    }
                }
            }
        });
    }
}

// Initialize orders chart
function initializeOrdersChart() {
    const ctx = document.getElementById('ordersChart');
    if (ctx) {
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['في الانتظار', 'قيد المعالجة', 'تم الشحن', 'تم التوصيل'],
                datasets: [{
                    label: 'عدد الطلبات',
                    data: [12, 19, 8, 25],
                    backgroundColor: [
                        '#ffc107',
                        '#17a2b8',
                        '#007bff',
                        '#28a745'
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
}

// Initialize users chart
function initializeUsersChart() {
    const ctx = document.getElementById('usersChart');
    if (ctx) {
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['الأسبوع 1', 'الأسبوع 2', 'الأسبوع 3', 'الأسبوع 4'],
                datasets: [{
                    label: 'مستخدمين جدد',
                    data: [15, 25, 35, 45],
                    borderColor: '#28a745',
                    backgroundColor: 'rgba(40, 167, 69, 0.2)',
                    fill: true
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
}

// Initialize form validation
function initializeFormValidation() {
    $('form').each(function() {
        const $form = $(this);
        
        // Add validation classes
        $form.addClass('needs-validation');
        
        // Custom validation
        $form.on('submit', function(e) {
            if (!this.checkValidity()) {
                e.preventDefault();
                e.stopPropagation();
            }
            
            $form.addClass('was-validated');
        });
        
        // Real-time validation
        $form.find('input, select, textarea').on('blur', function() {
            validateField($(this));
        });
    });
}

// Validate individual field
function validateField($field) {
    const value = $field.val();
    const type = $field.attr('type');
    const required = $field.prop('required');
    
    let isValid = true;
    let errorMessage = '';
    
    // Required validation
    if (required && !value.trim()) {
        isValid = false;
        errorMessage = 'هذا الحقل مطلوب';
    }
    
    // Email validation
    if (type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'البريد الإلكتروني غير صحيح';
        }
    }
    
    // Phone validation
    if ($field.attr('name') === 'phone' && value) {
        const phoneRegex = /^[0-9+\-\s()]+$/;
        if (!phoneRegex.test(value)) {
            isValid = false;
            errorMessage = 'رقم الهاتف غير صحيح';
        }
    }
    
    // Password validation
    if (type === 'password' && value) {
        if (value.length < 6) {
            isValid = false;
            errorMessage = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';
        }
    }
    
    // Update field state
    if (isValid) {
        $field.removeClass('is-invalid').addClass('is-valid');
        $field.next('.invalid-feedback').remove();
    } else {
        $field.removeClass('is-valid').addClass('is-invalid');
        $field.next('.invalid-feedback').remove();
        $field.after(`<div class="invalid-feedback">${errorMessage}</div>`);
    }
    
    return isValid;
}

// Initialize bulk actions
function initializeBulkActions() {
    $('.bulk-delete').on('click', function() {
        const selectedIds = getSelectedRowIds();
        
        if (selectedIds.length === 0) {
            showAdminNotification('يرجى اختيار عنصر واحد على الأقل', 'warning');
            return;
        }
        
        if (confirm(`هل أنت متأكد من حذف ${selectedIds.length} عنصر؟`)) {
            bulkDelete(selectedIds);
        }
    });
    
    $('.bulk-activate').on('click', function() {
        const selectedIds = getSelectedRowIds();
        
        if (selectedIds.length === 0) {
            showAdminNotification('يرجى اختيار عنصر واحد على الأقل', 'warning');
            return;
        }
        
        bulkActivate(selectedIds);
    });
    
    $('.bulk-deactivate').on('click', function() {
        const selectedIds = getSelectedRowIds();
        
        if (selectedIds.length === 0) {
            showAdminNotification('يرجى اختيار عنصر واحد على الأقل', 'warning');
            return;
        }
        
        bulkDeactivate(selectedIds);
    });
}

// Get selected row IDs
function getSelectedRowIds() {
    const ids = [];
    $('.row-checkbox:checked').each(function() {
        const id = $(this).closest('tr').data('id');
        if (id) {
            ids.push(id);
        }
    });
    return ids;
}

// Bulk delete
function bulkDelete(ids) {
    // This would typically make an AJAX request
    console.log('Bulk deleting:', ids);
    
    // Simulate deletion
    ids.forEach(function(id) {
        $(`tr[data-id="${id}"]`).fadeOut(function() {
            $(this).remove();
        });
    });
    
    showAdminNotification(`تم حذف ${ids.length} عنصر`, 'success');
    updateBulkActions();
}

// Bulk activate
function bulkActivate(ids) {
    // This would typically make an AJAX request
    console.log('Bulk activating:', ids);
    
    ids.forEach(function(id) {
        const $row = $(`tr[data-id="${id}"]`);
        $row.find('.status-badge').removeClass('bg-secondary').addClass('bg-success').text('نشط');
    });
    
    showAdminNotification(`تم تفعيل ${ids.length} عنصر`, 'success');
    updateBulkActions();
}

// Bulk deactivate
function bulkDeactivate(ids) {
    // This would typically make an AJAX request
    console.log('Bulk deactivating:', ids);
    
    ids.forEach(function(id) {
        const $row = $(`tr[data-id="${id}"]`);
        $row.find('.status-badge').removeClass('bg-success').addClass('bg-secondary').text('غير نشط');
    });
    
    showAdminNotification(`تم إلغاء تفعيل ${ids.length} عنصر`, 'success');
    updateBulkActions();
}

// Show admin notification
function showAdminNotification(message, type = 'info') {
    const alertClass = type === 'success' ? 'alert-success' : 
                      type === 'error' ? 'alert-danger' : 
                      type === 'warning' ? 'alert-warning' : 'alert-info';
    
    const notification = $(`
        <div class="alert ${alertClass} alert-dismissible fade show admin-notification" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `);
    
    $('.main-content').prepend(notification);
    
    // Auto-hide after 3 seconds
    setTimeout(function() {
        notification.fadeOut(function() {
            notification.remove();
        });
    }, 3000);
}

// Initialize real-time updates
function initializeRealTimeUpdates() {
    // Update statistics every 30 seconds
    setInterval(function() {
        updateStatistics();
    }, 30000);
    
    // Update notifications every 10 seconds
    setInterval(function() {
        updateNotifications();
    }, 10000);
}

// Update statistics
function updateStatistics() {
    // This would typically make an AJAX request to get updated stats
    console.log('Updating statistics...');
    
    // Simulate update
    $('.stats-card h3').each(function() {
        const currentValue = parseInt($(this).text());
        const newValue = currentValue + Math.floor(Math.random() * 3);
        $(this).text(newValue);
    });
}

// Update notifications
function updateNotifications() {
    // This would typically make an AJAX request to check for new notifications
    console.log('Checking for new notifications...');
    
    // Simulate new notification
    if (Math.random() > 0.8) {
        const notifications = [
            'طلب جديد تم استلامه',
            'تم تسجيل مستخدم جديد',
            'تم تحديث المخزون',
            'تحديث جديد متوفر'
        ];
        
        const randomNotification = notifications[Math.floor(Math.random() * notifications.length)];
        showAdminNotification(randomNotification, 'info');
    }
}

// Initialize image upload
function initializeImageUpload() {
    $('.image-upload').on('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const preview = $(this).siblings('.image-preview');
                preview.attr('src', e.target.result).show();
            }.bind(this);
            reader.readAsDataURL(file);
        }
    });
}

// Initialize drag and drop
function initializeDragAndDrop() {
    // Check if jQuery UI sortable is available
    if (typeof $.fn.sortable === 'function') {
        $('.sortable').sortable({
            handle: '.drag-handle',
            update: function(event, ui) {
                const newOrder = $(this).sortable('toArray');
                console.log('New order:', newOrder);
                // This would typically send the new order to the server
            }
        });
    } else {
        console.log('jQuery UI sortable not available');
    }
}

// Initialize all admin features
$(document).ready(function() {
    initializeImageUpload();
    initializeDragAndDrop();
});
