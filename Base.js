// Inisialisasi ikon
lucide.createIcons();

const storePage = document.getElementById('store-page');
const postsPage = document.getElementById('posts-page');
const storeLink = document.getElementById('store-link');
const postsLink = document.getElementById('posts-link');
const logoLink = document.querySelector('a.font-orbitron');

const modal = document.getElementById('payment-modal');
const modalContent = document.getElementById('modal-content');
const modalProductName = document.getElementById('modal-product-name');
const modalProductPrice = document.getElementById('modal-product-price');
const paymentInstructions = document.getElementById('payment-instructions');
const paymentDetails = document.querySelectorAll('.payment-details');
const paymentMethodButtons = document.querySelectorAll('.payment-method-btn');
const toast = document.getElementById('toast-notification');
const toastMessage = document.getElementById('toast-message');

let currentSelectedMethod = null;

// --- Navigasi Halaman ---
function showPage(pageId) {
    storePage.classList.add('hidden');
    postsPage.classList.add('hidden');
    document.getElementById(pageId).classList.remove('hidden');
}

storeLink.addEventListener('click', (e) => { e.preventDefault(); showPage('store-page'); });
postsLink.addEventListener('click', (e) => { e.preventDefault(); showPage('posts-page'); });
logoLink.addEventListener('click', (e) => { e.preventDefault(); showPage('store-page'); });


// Fungsi untuk membuka modal
function openPaymentModal(product, price) {
    modalProductName.textContent = product;
    modalProductPrice.textContent = price;

    // Reset tampilan modal
    paymentInstructions.classList.add('hidden');
    paymentDetails.forEach(detail => detail.classList.add('hidden'));
    paymentMethodButtons.forEach(btn => {
        btn.classList.remove('border-fuchsia-500', 'bg-neutral-700');
    });
    currentSelectedMethod = null;
    
    modal.classList.remove('hidden');
    setTimeout(() => {
        modal.classList.remove('modal-enter');
        modal.classList.add('modal-enter-active');
    }, 10);
}

// Fungsi untuk menutup modal
function closePaymentModal() {
    modal.classList.add('modal-leave-active');
    setTimeout(() => {
        modal.classList.add('hidden');
        modal.classList.remove('modal-enter-active', 'modal-leave-active');
        modal.classList.add('modal-enter');
    }, 300);
}

// Fungsi untuk memilih metode pembayaran
function selectPaymentMethod(method) {
    currentSelectedMethod = method;

    paymentInstructions.classList.remove('hidden');
    paymentDetails.forEach(detail => detail.classList.add('hidden'));
    document.getElementById(method + '-details').classList.remove('hidden');

    paymentMethodButtons.forEach(btn => {
        btn.classList.remove('border-fuchsia-500', 'bg-neutral-700');
    });
    document.getElementById('btn-' + method).classList.add('border-fuchsia-500', 'bg-neutral-700');
}

// Fungsi konfirmasi dan simpan pesanan
function linkwa(product, price) {
    modalProductName.textContent = product;
    modalProductPrice.textContent = price;
    const Now = { product, price };
    // Buat pesan dan URL WhatsApp
    const phoneNumber = "6281528483575"; // Nomor WhatsApp tujuan (format 62)
    let message = `Halo Fiz,\n\nAku mau beli jualan mu Ini:\n--------------------------\nProduk: *${Now.product}*\nHarga: *${Now.price}*\n--------------------------\n\n`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    // Buka WhatsApp di tab baru
    window.open(whatsappUrl, '_blank');
}

// Fungsi untuk menampilkan notifikasi toast
function showToast(message, isError = true) {
    toastMessage.textContent = message;
    
    if (isError) {
        toast.classList.remove('bg-green-500');
        toast.classList.add('bg-red-500');
    } else {
        toast.classList.remove('bg-red-500');
        toast.classList.add('bg-green-500');
    }

    toast.classList.remove('translate-y-20', 'opacity-0');
    
    setTimeout(() => {
        toast.classList.add('translate-y-20', 'opacity-0');
    }, 3000);
}


// Menutup modal jika klik di luar area konten
modal.addEventListener('click', (event) => {
    if (event.target === modal) {
        closePaymentModal();
    }
});

// --- Fitur Pencarian ---
const searchInput = document.getElementById('search-input');
const searchInputMobile = document.getElementById('search-input-mobile');
const productList = document.getElementById('product-list');
const productCards = document.querySelectorAll('.product-card');
const noResults = document.getElementById('no-results');

// --- Debounce function for performance ---
function debounce(func, delay = 250) {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}

function filterProducts(event) {
    const searchTerm = event.target.value.toLowerCase();
    let productsFound = 0;

    productCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const shouldShow = title.includes(searchTerm);
        card.classList.toggle('hidden', !shouldShow);
        if (shouldShow) {
            productsFound++;
        }
    });
    
    noResults.classList.toggle('hidden', productsFound > 0);
}

const debouncedFilter = debounce(filterProducts);
searchInput.addEventListener('input', debouncedFilter);
searchInputMobile.addEventListener('input', debouncedFilter);

// Inisialisasi: Tampilkan halaman toko saat pertama kali dibuka
showPage('store-page');
