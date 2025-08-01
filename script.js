


const products = [
    {
        id: 1,
        title: "Air jordan",
        price: 100,
        brand: "nike"
,       category: "shoes"
    },
    {
        id: 2,
        title: "Z-X 8000",
        price: 110,
        brand: "addidas",
        category: "shoes"
    },
    {
        id: 3,
        title: "T-shirt",
        price: 120,
        brand: "gucci",
        category: "clothes"
    },
    {
        id: 4,
        title: "jeans",
        price: 130,
        brand: "dior",
        category: "clothes"
    },
    {
        id: 5,
        title: "Clissic Watch",
        price: 140,
        brand: "rolex",
        category: "watches"
    },
    {
        id: 6,
        title: "Clock",
        price: 150,
        brand: "omega",
        category: "watches"
    }
];


function renderProducts(productList) {
    const container = document.querySelector('.product-container');
    container.innerHTML = '';

    productList.forEach(product => {
        const div = document.createElement('div');
        div.className = 'product-box';
        div.innerHTML = `
            <p>${product.title}</p>
            <p>${product.price}$</p>
            <p>${product.brand}</p>
            <p>${product.category}</p>
            <button onclick="addToCart(${product.id})">Add to cart</button>
        `;
        container.appendChild(div);
    });
}

// نمایش همه محصولات در شروع
renderProducts(products);

// فیلتر برند مستقیم بدون تابع جدا

const brands = document.querySelector('.brand-filter');

brands.addEventListener('change', function() {
    const selectedBrand = this.value.toLowerCase();

    if (selectedBrand === 'all') {
        renderProducts(products); // نمایش همه
    } else {
        const filtered = products.filter(p => p.brand.toLowerCase() === selectedBrand);
        renderProducts(filtered); // فقط برند انتخابی
    }
});


// فیلتر جستوجو بدون تابع جدا

const search_input = document.querySelector('.search-input');

search_input.addEventListener('input', function() {
    const search_term = this.value.trim().toLowerCase();

    if (search_term === "") {
        renderProducts(products);
        return;
    }

    const find_product = products.filter(p => {
        // تقسیم عنوان محصول به کلمات جدا
        const words = p.title.toLowerCase().split(' ');

        // چک می‌کنیم کلمه اول محصول با search_term شروع بشه
        return check_word = words[0].startsWith(search_term);
    });

    renderProducts(find_product);
});



// فیلتر دکمه ها بدون تابع جداگانه

const category_buttons = document.querySelectorAll('.category-button');

let activeCategories = new Set();

category_buttons.forEach(btn => {
    btn.addEventListener('click', function () {
        const value = btn.textContent.trim().toLowerCase();

        // اصلاح برای هماهنگی با دسته‌بندی داخل محصولات
        const category = value === 'watches' ? 'watches' : value;

        // toggle: اضافه یا حذف از Set
        if(activeCategories.has(category)) {
            activeCategories.delete(category);
            btn.classList.remove('active');
        } else {
            activeCategories.add(category);
            btn.classList.add('active');
        }

        // فیلتر محصولات طبق دسته‌های فعال
        if(activeCategories.size === 0) {
            renderProducts(products); // اگر هیچ دسته‌ای فعال نبود، همه رو نشون بده
        } else {
            const filtered = products.filter(p =>
                activeCategories.has(p.category.toLowerCase())
            );
            renderProducts(filtered);
        }
    });
});

// فیلتر محصولات با اسلایدر قیمت

const priceRange = document.getElementById('priceRange');
const priceValue = document.getElementById('priceValue');

priceRange.addEventListener('input', function() {
  const maxPrice = Number(this.value);
  priceValue.textContent = maxPrice + '$';

  // فیلتر محصولات بر اساس قیمت کمتر یا مساوی maxPrice
  const filtered = products.filter(p => p.price <= maxPrice);
  renderProducts(filtered);
});


// افزودن محصولات به سبد خرید

let cart = [];

function addToCart(productId) {

    const notyf = new Notyf({
        duration: 3000,
        position: {
            x: "left",
            y: "top",
        },
    });

    const find_product = products.find(p => p.id === productId);

    if (find_product) {
        const exist_item = cart.find(p => p.id === productId);

        if (exist_item) {
            notyf.open({
                type: 'error',
                message: 'Product is in the shopping cart.',
            });

        } else {
            cart.push({ ...find_product, qty: 1 });
            notyf.open({
                type: 'success',
                message: 'Product added to cart',
            });
        }
    }

    renderCart();
    updateCartCount();
    updateTotalPrice();
}

// تابع نمایش محصولات

function renderCart() {
    const cart_list = document.querySelector('.cart-list');
    cart_list.innerHTML = '';

    if (cart.length === 0) {
        cart_list.textContent = 'Your cart is empty.';
        return;
    }

    cart.forEach(item => {
        const div = document.createElement('div');
        div.className = 'cart-box';
        div.innerHTML = `
            <p>${item.title}</p>
            <p>${item.price}$</p>
            <p>${item.brand}</p>
            <p>${item.category}</p>
            <p>${item.qty}</p>
            <div class="cart-row">
                <button onclick="plus(${item.id})">+</button>
                <button onclick="minus(${item.id})">-</button>
            </div>
            <button class="cart-btn" onclick="removeCart(${item.id})">Remove</button>
        `;
        cart_list.appendChild(div);
    });

}

renderCart();


// تابع حذف محصول از سبد خرید

function removeCart(productId) {

    const notyf = new Notyf({
        duration: 3000,
        position: {
            x: "left",
            y: "top",
        },
    });

    const find_product = cart.find(p => p.id === productId);

    if(find_product) {

        cart = cart.filter(p => p.id !== productId);

        notyf.open({
            type: 'success',
            message: 'Product removed from cart',
        });
    }

    renderCart();
    updateCartCount();
    updateTotalPrice();

}


// دکمه + برای اضافه کردن محصولات در سبد خرید

function plus(productId) {

    const find_product = cart.find(p => p.id === productId);

    if(find_product) {
        find_product.qty ++;
    }

    renderCart();
    updateCartCount();
    updateTotalPrice();
}

// دکمه - برای کم کردن محصولات در سبد خرید

function minus(productId) {

    const notyf = new Notyf({
        duration: 3000,
        position: {
            x: "left",
            y: "top",
        },
    });

    const find_product = cart.find(p => p.id === productId)

    if (find_product) {
        if(find_product.qty > 1) {
            find_product.qty --;
        } else {
            cart = cart.filter(p => p.id !== productId);
            notyf.open({
                type: 'success',
                message: 'Product removed from cart',
            });
        }
    }

    renderCart();
    updateCartCount();
    updateTotalPrice();

}

// تابع برای شمارش تعداد کل محصولات موجود در سبد خرید

function updateCartCount() {

    const count_element = document.querySelector('.cart-counter');

    const total_count = cart.reduce((acc, item) => acc + item.qty, 0);

    count_element.innerHTML = `(${total_count})`;

}

// تابع برای محاسبه قیمت محصولات موجود در سبد خرید

function updateTotalPrice() {

    const total_element = document.querySelector('.cart-total');

    const total_price = cart.reduce((acc, item) => acc + item.qty * item.price, 0);

    total_element.innerHTML = `${total_price.toFixed(1)}$`;

}





