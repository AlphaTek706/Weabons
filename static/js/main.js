// Main JavaScript functionality for the weapons store

$(document).ready(function() {
    // Initialize all components
    initializeComponents();
    
    // Add smooth scrolling
    addSmoothScrolling();
    
    // Initialize tooltips
    initializeTooltips();
    
    // Add loading states
    addLoadingStates();
    
    // Initialize search functionality
    initializeSearch();
    
    // Initialize cart functionality
    initializeCart();
    
    // Add animation classes
    addAnimations();
});

// Initialize all components
function initializeComponents() {
    // Auto-hide alerts after 5 seconds
    setTimeout(function() {
        $('.alert').fadeOut('slow');
    }, 5000);
    
    // Initialize dropdowns
    $('.dropdown-toggle').dropdown();
    
    // Initialize modals
    $('.modal').modal();
    
    // Initialize tooltips
    $('[data-bs-toggle="tooltip"]').tooltip();
    
    // Initialize popovers
    $('[data-bs-toggle="popover"]').popover();
    
    // Fix navbar collapse issues
    initializeNavbar();
}

// Fix navbar collapse and toggle issues
function initializeNavbar() {
    // Remove the custom navbar function entirely
    // Let Bootstrap handle everything automatically
    
    // Only add functionality for closing menu on link clicks
    const navbarCollapse = document.querySelector('.navbar-collapse');
    if (navbarCollapse) {
        const navLinks = navbarCollapse.querySelectorAll('.nav-link:not(.dropdown-toggle)');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                // Close the navbar after clicking a link (mobile only)
                if (window.innerWidth < 992) {
                    const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
                    if (bsCollapse && navbarCollapse.classList.contains('show')) {
                        bsCollapse.hide();
                    }
                }
            });
        });
    }
}

// Add smooth scrolling
function addSmoothScrolling() {
    $('a[href^="#"]').on('click', function(e) {
        e.preventDefault();
        
        const target = $(this.getAttribute('href'));
        if (target.length) {
            $('html, body').animate({
                scrollTop: target.offset().top - 80
            }, 1000);
        }
    });
}

// Initialize tooltips
function initializeTooltips() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function(tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

// Add loading states to buttons
function addLoadingStates() {
    $('form').on('submit', function() {
        const $submitBtn = $(this).find('button[type="submit"]');
        const originalText = $submitBtn.html();
        
        $submitBtn.html('<span class="loading"></span> جاري التحميل...');
        $submitBtn.prop('disabled', true);
        
        // Re-enable after 5 seconds (fallback)
        setTimeout(function() {
            $submitBtn.html(originalText);
            $submitBtn.prop('disabled', false);
        }, 5000);
    });
}

// Initialize search functionality
function initializeSearch() {
    const searchForm = $('#searchForm');
    const searchInput = $('#searchInput');
    
    if (searchForm.length && searchInput.length) {
        // Add search icon
        searchInput.parent().addClass('search-container');
        searchInput.after('<i class="fas fa-search search-icon"></i>');
        
        // Live search (debounced)
        let searchTimeout;
        searchInput.on('input', function() {
            clearTimeout(searchTimeout);
            const query = $(this).val();
            
            if (query.length > 2) {
                searchTimeout = setTimeout(function() {
                    performSearch(query);
                }, 500);
            }
        });
    }
}

// Perform search
function performSearch(query) {
    // This would typically make an AJAX request
    console.log('Searching for:', query);
    
    // For now, just highlight the search term
    highlightSearchTerm(query);
}

// Highlight search term in results
function highlightSearchTerm(term) {
    $('.product-card .card-title').each(function() {
        const text = $(this).text();
        const highlightedText = text.replace(new RegExp(term, 'gi'), '<mark>$&</mark>');
        $(this).html(highlightedText);
    });
}

// Initialize cart functionality
function initializeCart() {
    // Add to cart animation
    $('.add-to-cart').on('click', function(e) {
        e.preventDefault();
        
        const $button = $(this);
        const $icon = $button.find('i');
        const originalClass = $icon.attr('class');
        
        // Change icon to loading
        $icon.attr('class', 'fas fa-spinner fa-spin');
        $button.prop('disabled', true);
        
        // Simulate add to cart
        setTimeout(function() {
            $icon.attr('class', 'fas fa-check');
            $button.html('<i class="fas fa-check"></i> تم الإضافة');
            
            // Show success message
            showNotification('تم إضافة المنتج إلى السلة', 'success');
            
            // Reset button after 2 seconds
            setTimeout(function() {
                $icon.attr('class', originalClass);
                $button.html('<i class="fas fa-shopping-cart"></i> إضافة إلى السلة');
                $button.prop('disabled', false);
            }, 2000);
        }, 1000);
    });
    
    // Update cart quantity
    $('.quantity-input').on('change', function() {
        const $input = $(this);
        const newQuantity = parseInt($input.val());
        const itemId = $input.data('item-id');
        
        if (newQuantity > 0) {
            updateCartItemQuantity(itemId, newQuantity);
        }
    });
    
    // Remove from cart
    $('.remove-from-cart').on('click', function(e) {
        e.preventDefault();
        
        const $button = $(this);
        const itemId = $button.data('item-id');
        
        if (confirm('هل تريد حذف هذا المنتج من السلة؟')) {
            removeFromCart(itemId);
        }
    });
}

// Update cart item quantity
function updateCartItemQuantity(itemId, quantity) {
    // This would typically make an AJAX request
    console.log('Updating item', itemId, 'to quantity', quantity);
    
    // For now, just update the UI
    const $row = $(`[data-item-id="${itemId}"]`).closest('tr');
    const price = parseFloat($row.find('.item-price').text().replace('$', ''));
    const newTotal = price * quantity;
    
    $row.find('.item-total').text('$' + newTotal.toFixed(2));
    
    updateCartTotal();
    showNotification('تم تحديث السلة', 'success');
}

// Remove from cart
function removeFromCart(itemId) {
    // This would typically make an AJAX request
    console.log('Removing item', itemId);
    
    // For now, just remove from UI
    const $row = $(`[data-item-id="${itemId}"]`).closest('tr');
    $row.fadeOut(function() {
        $row.remove();
        updateCartTotal();
    });
    
    showNotification('تم حذف المنتج من السلة', 'info');
}

// Update cart total
function updateCartTotal() {
    let total = 0;
    $('.item-total').each(function() {
        total += parseFloat($(this).text().replace('$', ''));
    });
    
    $('.cart-total').text('$' + total.toFixed(2));
}

// Show notification
function showNotification(message, type = 'info') {
    const alertClass = type === 'success' ? 'alert-success' : 
                      type === 'error' ? 'alert-danger' : 
                      type === 'warning' ? 'alert-warning' : 'alert-info';
    
    const notification = $(`
        <div class="alert ${alertClass} alert-dismissible fade show notification" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `);
    
    // Add to top of page
    $('body').prepend(notification);
    
    // Auto-hide after 3 seconds
    setTimeout(function() {
        notification.fadeOut(function() {
            notification.remove();
        });
    }, 3000);
}

// Add animations
function addAnimations() {
    // Fade in cards on scroll
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    });
    
    document.querySelectorAll('.card').forEach(function(card) {
        observer.observe(card);
    });
    
    // Hover effects for buttons
    $('.btn').on('mouseenter', function() {
        $(this).addClass('shadow-strong');
    }).on('mouseleave', function() {
        $(this).removeClass('shadow-strong');
    });
}

// Product image zoom
function initializeImageZoom() {
    $('.product-image').on('click', function() {
        const imageSrc = $(this).attr('src');
        const modal = $(`
            <div class="modal fade" id="imageModal" tabindex="-1">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body text-center">
                            <img src="${imageSrc}" class="img-fluid" alt="Product Image">
                        </div>
                    </div>
                </div>
            </div>
        `);
        
        $('body').append(modal);
        $('#imageModal').modal('show');
        
        $('#imageModal').on('hidden.bs.modal', function() {
            $('#imageModal').remove();
        });
    });
}

// Initialize product filters
function initializeProductFilters() {
    $('.filter-checkbox').on('change', function() {
        applyFilters();
    });
    
    $('.price-range').on('input', function() {
        applyFilters();
    });
}

// Apply filters
function applyFilters() {
    const selectedCategories = $('.filter-checkbox:checked').map(function() {
        return $(this).val();
    }).get();
    
    const minPrice = parseFloat($('#minPrice').val()) || 0;
    const maxPrice = parseFloat($('#maxPrice').val()) || Infinity;
    
    $('.product-card').each(function() {
        const $card = $(this);
        const category = $card.data('category');
        const price = parseFloat($card.data('price'));
        
        let showCard = true;
        
        // Category filter
        if (selectedCategories.length > 0 && !selectedCategories.includes(category)) {
            showCard = false;
        }
        
        // Price filter
        if (price < minPrice || price > maxPrice) {
            showCard = false;
        }
        
        if (showCard) {
            $card.show();
        } else {
            $card.hide();
        }
    });
}

// Initialize wishlist functionality
function initializeWishlist() {
    $('.wishlist-toggle').on('click', function(e) {
        e.preventDefault();
        
        const $button = $(this);
        const productId = $button.data('product-id');
        const $icon = $button.find('i');
        
        if ($icon.hasClass('far')) {
            // Add to wishlist
            $icon.removeClass('far').addClass('fas');
            $button.addClass('text-danger');
            showNotification('تم إضافة المنتج إلى المفضلة', 'success');
        } else {
            // Remove from wishlist
            $icon.removeClass('fas').addClass('far');
            $button.removeClass('text-danger');
            showNotification('تم حذف المنتج من المفضلة', 'info');
        }
    });
}

// Initialize product comparison
function initializeProductComparison() {
    $('.compare-checkbox').on('change', function() {
        const checkedCount = $('.compare-checkbox:checked').length;
        
        if (checkedCount > 3) {
            $(this).prop('checked', false);
            showNotification('يمكنك مقارنة 3 منتجات فقط', 'warning');
        }
        
        updateCompareButton();
    });
    
    $('#compareProducts').on('click', function() {
        const selectedProducts = $('.compare-checkbox:checked').map(function() {
            return $(this).val();
        }).get();
        
        if (selectedProducts.length < 2) {
            showNotification('يجب اختيار منتجين على الأقل للمقارنة', 'warning');
            return;
        }
        
        // Redirect to comparison page
        window.location.href = '/compare?products=' + selectedProducts.join(',');
    });
}

// Update compare button
function updateCompareButton() {
    const checkedCount = $('.compare-checkbox:checked').length;
    const $button = $('#compareProducts');
    
    if (checkedCount >= 2) {
        $button.prop('disabled', false);
        $button.text(`مقارنة (${checkedCount})`);
    } else {
        $button.prop('disabled', true);
        $button.text('مقارنة');
    }
}

// Initialize rating system
function initializeRating() {
    $('.rating-star').on('click', function() {
        const rating = $(this).data('rating');
        const $container = $(this).closest('.rating-container');
        
        $container.find('.rating-star').each(function(index) {
            if (index < rating) {
                $(this).addClass('fas').removeClass('far');
            } else {
                $(this).addClass('far').removeClass('fas');
            }
        });
        
        $container.find('.rating-value').val(rating);
        showNotification(`تم تقييم المنتج بـ ${rating} نجوم`, 'success');
    });
}

// Initialize lazy loading for images
function initializeLazyLoading() {
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img.lazy').forEach(function(img) {
        observer.observe(img);
    });
}

// Initialize back to top button
function initializeBackToTop() {
    const backToTopButton = $('<button class="btn btn-primary back-to-top"><i class="fas fa-arrow-up"></i></button>');
    $('body').append(backToTopButton);
    
    $(window).on('scroll', function() {
        if ($(window).scrollTop() > 300) {
            backToTopButton.show();
        } else {
            backToTopButton.hide();
        }
    });
    
    backToTopButton.on('click', function() {
        $('html, body').animate({scrollTop: 0}, 300);
    });
}

// Initialize all features
$(document).ready(function() {
    initializeImageZoom();
    initializeProductFilters();
    initializeWishlist();
    initializeProductComparison();
    initializeRating();
    initializeLazyLoading();
    initializeBackToTop();
});
