
// Selectors used in the jQuery code
const selectors = {
    company: '#company',
    productName: '#product-name',
    productDescription: '#product-description',
    productNewPrice: '#product-new-price',
    productOldPrice: '#product-old-price',
    productDiscount: '#prodcut-discount',
    quantity: '#quantity',
    increaseQuantityBtn: '#increase-quantity',
    decreaseQuantityBtn: '#decrease-quantity',
    addToCartBtn: '#add-to-cart',
    cartTotalQuantity: '#cart-total-quantity',
    cartIcon: '.cart-icon',
    deleteProductBtn: '.delete-product-btn',
    emptyCartMessage: '#empty-cart-message',
    cardProductsCtn: '.card-products-ctn',
    navLinks: '.nav-link',
    navItems: '.nav-item',
    avatar: '.avatar',
    cartDetails: '.cart-details',
    thumbnailsContainer: '#gallery-thumbnails-section',
    mainImage: '#main-image',
    modalMainImage: '#modal-main-image',
    modalThumbnailsContainer: '#modal-thumbnails-section',
    galleryPrevBtn: '#gallery-prev-btn',
    galleryNextBtn: '#gallery-next-btn',
    modalGalleryPrevBtn: '#modal-gallery-prev-btn',
    modalGalleryNextBtn: '#modal-gallery-next-btn',
    galleryModal: '#gallery-modal',
    cartProductDetails: '.cart-product-details',
    desktopMenu: '#navbarSupportedContent .navbar-nav',
    mobileMenu: '#offcanvas-menu .navbar-nav'
};

// Define the menu items
const menuItems = [
    { text: 'Collections', href: '#' },
    { text: 'Men', href: '#' },
    { text: 'Women', href: '#' },
    { text: 'About', href: '#' },
    { text: 'Contact', href: '#' },
];

// Product details
const product = {
    company: 'Sneaker Company',
    name: 'Fall Limited Edition Sneakers',
    description: `These low profile sneakers are your perfect casual wear companion. Featuring a durable rubber outer sole, they'll withstand everything the weather can offer.`,
    images: [
        'images/image-product-1.jpg',
        'images/image-product-2.jpg',
        'images/image-product-3.jpg',
        'images/image-product-4.jpg'
    ],
    thumbnails: [
        'images/image-product-1-thumbnail.jpg',
        'images/image-product-2-thumbnail.jpg',
        'images/image-product-3-thumbnail.jpg',
        'images/image-product-4-thumbnail.jpg'
    ],
    oldPrice: 250,
    newPrice: 125,
    discount: 50,
};

let quantity = 0;
let cart = {
    quantity: 0,
    product: null
};
let carouselCurrentIndex = 0;

$(document).ready(function () {

    // Set product details in the DOM
    $(selectors.company).text(product.company);
    $(selectors.productName).text(product.name);
    $(selectors.productDescription).text(product.description);
    $(selectors.productNewPrice).text(`$${product.newPrice.toFixed(2)}`);
    $(selectors.productOldPrice).text(`$${product.oldPrice.toFixed(2)}`);
    $(selectors.productDiscount).text(`${product.discount}%`);
    $(selectors.mainImage).attr('src', product.images[0]); // Set main image src to the first image in the product gallery

    // Increase quantity button click event
    $(selectors.increaseQuantityBtn).click(function () {
        quantity++;
        $(selectors.quantity).text(quantity);
    });

    // Decrease quantity button click event
    $(selectors.decreaseQuantityBtn).click(function () {
        if (quantity > 0) {
            quantity--;
            $(selectors.quantity).text(quantity);
        }
    });

    // Function to update cart quantity UI
    function updateCartQuantityUI(quantity) {
        $(selectors.cartTotalQuantity).removeClass('d-none');
        $(selectors.cartTotalQuantity).text(quantity);
        $(selectors.cartIcon).addClass('active');
    }

    // Function to update cart product details
    function updateCartProductDetails(product) {
        $(selectors.emptyCartMessage).hide();
        $(selectors.cardProductsCtn).show();
        const cartProductDetails = $(selectors.cartProductDetails);
        cartProductDetails.find('.cart-product-image').attr('src', product.thumbnails[0]);
        cartProductDetails.find('.cart-product-name').text(product.name);
        const totalPrice = product.newPrice * cart.quantity;
        cartProductDetails.find('.cart-product-price').html(`$${product.newPrice.toFixed(2)} x ${cart.quantity} <span class="fw-bold text-dark ms-1">$${totalPrice.toFixed(2)}</span>`);
    }

    // Add to cart button click event
    $(selectors.addToCartBtn).click(function () {
        let quantity = parseInt($(selectors.quantity).text());
        if (quantity > 0) {
            cart.quantity += quantity;
            cart.product = product;
            updateCartQuantityUI(cart.quantity)
            updateCartProductDetails(product);
            localStorage.setItem('cart', JSON.stringify(cart))
        }
    });

    // Load cart data from localStorage if exists
    function loadCartFromLocalStorage() {
        const cartData = localStorage.getItem('cart');
        if (cartData) {
            cart = JSON.parse(cartData);
            quantity = cart.quantity;
            updateCartQuantityUI(cart.quantity)
            updateCartProductDetails(cart.product);
            $(selectors.quantity).text(cart.quantity);
        }
    }

    loadCartFromLocalStorage();

    // Delete product button click event
    $(selectors.deleteProductBtn).click(function () {
        quantity = 0;
        cart.quantity = 0;
        cart.product = null;
        $(selectors.quantity).text(quantity);
        $(selectors.cartTotalQuantity).addClass('d-none')
        $(selectors.cartIcon).removeClass('active');
        $(selectors.cardProductsCtn).hide()
        $(selectors.emptyCartMessage).show()
        localStorage.removeItem('cart')
    });

    // Function to generate menu items
    const generateMenuItems = (items, container, isMobile) => {
        items.forEach((item) => {
            const li = $(`
        <li class="nav-item">
          <a class="nav-link ${isMobile ? 'fw-bold' : ''}" href="${item.href}">${item.text}</a>
        </li>
      `);
            $(container).append(li);
        });
    }

    // Generate the desktop menu items
    generateMenuItems(menuItems, selectors.desktopMenu, false);
    // Generate the mobile menu items
    generateMenuItems(menuItems, selectors.mobileMenu, true);

    // Handle active class for navigation links
    $(selectors.navLinks).on('click', function () {
        $(selectors.navItems).removeClass('active');
        $(this).parent('.nav-item').addClass('active');
    });

    // Toggle the 'active' class on the avatar image
    $(selectors.avatar).on('click', function () {
        $(this).toggleClass('active');
    });

    // Toggle the visibility of cartDetails 
    $(selectors.cartIcon).click(function () {
        $(selectors.cartDetails).toggle();
    });

    // Close cartDetails if the user clicks outside of it
    $(document).click(function (event) {
        if (
            !$(event.target).closest(selectors.cartIcon).length &&
            !$(event.target).closest(selectors.cartDetails).length
        ) {
            $(selectors.cartDetails).hide();
        }
    });

    // Function to generate gallery thumbnails
    function generateThumbnails(thumbnailsContainer, mainImage, thumbnails) {
        thumbnailsContainer.empty();

        thumbnails.forEach(function (thumbnailSrc, index) {
            const thumbnailCtn = $(`
            <div class="col-3">
              <div class="thumbnail-ctn position-relative ${index === 0 ? 'active' : ''}" role="button" data-index="${index}">
              <div class="overlay position-absolute top-0 start-0 w-100 h-100"></div>
                <img class="thumbnail img-fluid" src="${thumbnailSrc}" alt="Thumbnail ${index + 1}" data-large-src="${product.images[index]}" />
              </div>
            </div>
          `);
            thumbnailsContainer.append(thumbnailCtn);

            // Handle thumbnail click event
            thumbnailCtn.find('.thumbnail-ctn').click(function () {
                mainImage.attr('src', $(this).find('.thumbnail').attr('data-large-src'));
                carouselCurrentIndex = index

                thumbnailsContainer.find('.thumbnail-ctn').removeClass('active');
                $(this).addClass('active');
            });
        });
    }

    // Generate thumbnails for main image gallery
    generateThumbnails($(selectors.thumbnailsContainer), $(selectors.mainImage), product.thumbnails);

    // Generate thumbnails for modal image gallery
    generateThumbnails($(selectors.modalThumbnailsContainer), $(selectors.modalMainImage), product.thumbnails);

    // Function to update active thumbnail in modal gallery
    function updateModalThumbnail(index) {
        $(selectors.modalThumbnailsContainer).find('.thumbnail-ctn').removeClass('active');
        $(selectors.modalThumbnailsContainer).find(`.thumbnail-ctn[data-index="${index}"]`).addClass('active');
    }

    // Function to set up the image carousel
    function setupCarousel(mainImageId, prevButtonId, nextButtonId, isModal = false) {
        const mainImage = $(mainImageId);

        // Previous button click event
        $(prevButtonId).click(function () {
            carouselCurrentIndex = (carouselCurrentIndex > 0) ? carouselCurrentIndex - 1 : product.images.length - 1;
            mainImage.attr('src', product.images[carouselCurrentIndex]);
            if (isModal) updateModalThumbnail(carouselCurrentIndex);
        });

        // Next button click event
        $(nextButtonId).click(function () {
            carouselCurrentIndex = (carouselCurrentIndex < product.images.length - 1) ? carouselCurrentIndex + 1 : 0;
            mainImage.attr('src', product.images[carouselCurrentIndex]);
            if (isModal) updateModalThumbnail(carouselCurrentIndex);
        });
    }

    // Set up carousel for main gallery
    setupCarousel(selectors.mainImage, selectors.galleryPrevBtn, selectors.galleryNextBtn);
    // Set up carousel for modal gallery
    setupCarousel(selectors.modalMainImage, selectors.modalGalleryPrevBtn, selectors.modalGalleryNextBtn, true);

    // Handle click on main image to show modal
    $(selectors.mainImage).click(function () {
        if ($(window).width() >= 768) {
            let largeImageSrc = $(this).attr('src');
            $(selectors.modalMainImage).attr('src', largeImageSrc);
            carouselCurrentIndex = $(this).attr('src').match(/\d+/)[0] - 1
            updateModalThumbnail(carouselCurrentIndex)
            $(selectors.galleryModal).modal('show');
        }
    });
});
