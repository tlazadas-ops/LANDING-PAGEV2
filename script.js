// ===============================
// SUPABASE
// ===============================

const SUPABASE_URL = "https://fncmvimsrdawvaapspyt.supabase.co";

const SUPABASE_KEY = "sb_publishable_8IVztGk6akNofrqgnci04g_HekLzPZ3";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

// ===============================
// PRODUCTS
// (Swap "image" + "name" anytime — everything else keeps working)
// ===============================

let products = [
    // --- SHIRTS (5 products) ---
    {
        id: 1,
        name: "CYBERCYCLISM TEE",
        price: 499,
        oldPrice: 799,
        category: "Shirts",
        rating: 4.8,
        stock: 12,
        image: "images/item1.png"
    },
    {
        id: 2,
        name: "ZERUEL OVERSIZED TEE",
        price: 499,
        oldPrice: 799,
        category: "Shirts",
        rating: 4.7,
        stock: 8,
        image: "images/item2.png"
    },
    {
        id: 5,
        name: "SCARFACE BIGLOGO TEE",
        price: 449,
        oldPrice: 549,
        category: "Shirts",
        rating: 4.7,
        stock: 15,
        image: "images/item3.png"
    },
    {
        id: 15,
        name: "Y2K SHARK TEE",
        price: 429,
        oldPrice: 529,
        category: "Shirts",
        rating: 4.6,
        stock: 13,
        image: "images/item4.png"
    },
    {
        id: 17,
        name: "ALWAYS ON GOD TEE",
        price: 499,
        oldPrice: 699,
        category: "Shirts",
        rating: 4.8,
        stock: 11,
        image: "images/item5.png"
    },

    // --- JACKETS (3 products) ---
    {
        id: 4,
        name: "BE YOU COLORED JACKET",
        price: 999,
        oldPrice: 1199,
        category: "Jackets",
        rating: 4.6,
        stock: 7,
        image: "images/jacket1.png"
    },
    {
        id: 6,
        name: "GRAY VINTAGE JACKET",
        price: 1199,
        oldPrice: 1499,
        category: "Jackets",
        rating: 4.8,
        stock: 6,
        image: "images/jacket2.png"
    },
    {
        id: 14,
        name: "PLAID SHOTTAS JACKET",
        price: 899,
        oldPrice: 1099,
        category: "Jackets",
        rating: 4.9,
        stock: 10,
        image: "images/jacket3.png"
    },

    // --- SHORTS (3 products) ---
    {
        id: 12,
        name: "BLACK JORTS MAONG",
        price: 399,
        oldPrice: 449,
        category: "Shorts",
        rating: 4.7,
        stock: 16,
        image: "images/short1.png"
    },
    {
        id: 13,
        name: "BLUE JORTS MAONG",
        price: 349,
        oldPrice: 449,
        category: "Shorts",
        rating: 4.5,
        stock: 22,
        image: "images/short2.png"
    },
    {
        id: 18,
        name: "RAW WASH CARGO SHORTS",
        price: 429,
        oldPrice: 499,
        category: "Shorts",
        rating: 4.8,
        stock: 14,
        image: "images/short3.png"
    },

    // --- ACCESSORIES (4 products: Bags, Caps, Beanies) ---
    {
        id: 7,
        name: "STRETCH KEYHOLDER",
        price: 599,
        oldPrice: 699,
        category: "Accessories",
        rating: 4.6,
        stock: 9,
        image: "images/acce4.png"
    },
    {
        id: 8,
        name: "RUBBWE PATCH BEANIE",
        price: 349,
        oldPrice: 449,
        category: "Accessories",
        rating: 4.7,
        stock: 20,
        image: "images/acce1.png"
    },
    {
        id: 9,
        name: "PUPPER SLINGBAG",
        price: 299,
        oldPrice: 399,
        category: "Accessories",
        rating: 4.5,
        stock: 18,
        image: "images/acce2.png"
    },
    {
        id: 10,
        name: "STAINLESS STEEL OVAL BELT",
        price: 279,
        oldPrice: 349,
        category: "Accessories",
        rating: 4.8,
        stock: 25,
        image: "images/acce3.png"
    },

    // --- PANTS (3 products) ---
    {
        id: 19,
        name: "COZIEST SCRIPT PANTS",
        price: 899,
        oldPrice: 1199,
        category: "Pants",
        rating: 4.9,
        stock: 10,
        image: "images/pants1.png"
    },
    {
        id: 20,
        name: "UNDRAFTED 1600",
        price: 949,
        oldPrice: 1249,
        category: "Pants",
        rating: 4.8,
        stock: 12,
        image: "images/pants2.png"
    },
    {
        id: 21,
        name: "FLAME PINK PANTS",
        price: 879,
        oldPrice: 1149,
        category: "Pants",
        rating: 4.7,
        stock: 8,
        image: "images/pants3.png"
    }
];


// ===============================
// CART & WISHLIST
// ===============================

let cart = [];
let wishlist = [];


// ===============================
// CURRENT USER
// ===============================

function getCurrentUsername() {
    return localStorage.getItem("currentUser");
}


// ===============================
// WISHLIST
// ===============================

function loadUserWishlist() {

    const username = getCurrentUsername();

    if (!username) {
        wishlist = [];
        return;
    }

    const allWishlists =
        JSON.parse(
            localStorage.getItem("userWishlists")
        ) || {};

    wishlist =
        allWishlists[username] || [];
}


function saveUserWishlist() {

    const username =
        getCurrentUsername();

    if (!username) return;

    const allWishlists =
        JSON.parse(
            localStorage.getItem("userWishlists")
        ) || {};

    allWishlists[username] =
        wishlist;

    localStorage.setItem(
        "userWishlists",
        JSON.stringify(allWishlists)
    );
}


// ===============================
// SUPABASE CART - LOAD
// ===============================

async function loadUserCart() {

    const username =
        getCurrentUsername();

    if (!username) {

        cart = [];

        return;
    }

    try {

        const {
            data: { user },
            error: userError
        } =
            await supabaseClient.auth.getUser();

        if (userError || !user) {

            console.warn(
                "NO SUPABASE USER:",
                userError
            );

            // Local backup
            const allCarts =
                JSON.parse(
                    localStorage.getItem(
                        "userCarts"
                    )
                ) || {};

            cart =
                allCarts[username] || [];

            return;
        }


        const {
            data,
            error
        } =
            await supabaseClient
                .from("cart_items")
                .select("*")
                .eq("user_id", user.id);


        if (error) {

            console.error(
                "LOAD CART ERROR:",
                error
            );

            // Local backup
            const allCarts =
                JSON.parse(
                    localStorage.getItem(
                        "userCarts"
                    )
                ) || {};

            cart =
                allCarts[username] || [];

            return;
        }


        // Convert Supabase data
        cart =
            (data || []).map(
                item => {

                    const product =
                        products.find(
                            p =>
                                p.id ===
                                item.product_id
                        );

                    return {

                        id:
                            item.product_id,

                        name:
                            product?.name ||
                            "Unknown Product",

                        price:
                            product?.price ||
                            0,

                        quantity:
                            Number(
                                item.quantity
                            ),

                        size:
                            item.size ||
                            "N/A",

                        customDesignId:
                            item.custom_design_id || null
                    };

                }
            );


        // Save local backup
        const allCarts =
            JSON.parse(
                localStorage.getItem(
                    "userCarts"
                )
            ) || {};

        allCarts[username] =
            cart;

        localStorage.setItem(
            "userCarts",
            JSON.stringify(
                allCarts
            )
        );

    } catch (error) {

        console.error(
            "LOAD CART EXCEPTION:",
            error
        );

        const allCarts =
            JSON.parse(
                localStorage.getItem(
                    "userCarts"
                )
            ) || {};

        cart =
            allCarts[username] || [];
    }
}


// ===============================
// SUPABASE CART - SAVE
// ===============================

async function saveUserCart() {

    const username =
        getCurrentUsername();

    if (!username) {

        return false;
    }


    try {

        // Get current Supabase account
        const {
            data: { user },
            error: userError
        } =
            await supabaseClient.auth.getUser();


        if (userError || !user) {

            alert(
                "NO SUPABASE USER\n\n" +
                (
                    userError?.message ||
                    "User not found."
                )
            );

            return false;
        }


        // =========================
        // LOCAL BACKUP
        // =========================

        const allCarts =
            JSON.parse(
                localStorage.getItem(
                    "userCarts"
                )
            ) || {};

        allCarts[username] =
            cart;

        localStorage.setItem(
            "userCarts",
            JSON.stringify(
                allCarts
            )
        );


        // =========================
        // GET EXISTING CART
        // =========================

        const {
            data: existingItems,
            error: fetchError
        } =
            await supabaseClient
                .from("cart_items")
                .select(
                    "id, product_id, size, custom_design_id"
                )
                .eq(
                    "user_id",
                    user.id
                );


        if (fetchError) {

            alert(
                "CART FETCH ERROR:\n\n" +
                fetchError.message
            );

            console.error(
                "CART FETCH ERROR:",
                fetchError
            );

            return false;
        }


        // =========================
        // REMOVE OLD ITEMS
        // =========================

        for (
            const existing
            of existingItems || []
        ) {

            const stillExists =
                cart.some(
                    item =>
                        item.id ===
                            existing.product_id &&
                        (
                            item.size ||
                            "N/A"
                        ) ===
                            (
                                existing.size ||
                                "N/A"
                            )
                );


            if (!stillExists) {

                const {
                    error: deleteError
                } =
                    await supabaseClient
                        .from("cart_items")
                        .delete()
                        .eq(
                            "id",
                            existing.id
                        );


                if (deleteError) {

                    alert(
                        "CART DELETE ERROR:\n\n" +
                        deleteError.message
                    );

                    console.error(
                        deleteError
                    );

                    return false;
                }
            }
        }


        // =========================
        // INSERT / UPDATE CART
        // =========================

        for (
            const item
            of cart
        ) {

            const {
                error: saveError
            } =
                await supabaseClient
                    .from("cart_items")
                    .upsert(
                        {
                            user_id:
                                user.id,

                            product_id:
                                item.id,

                            quantity:
                                Number(
                                    item.quantity
                                ),

                            size:
                                item.size ||
                                "N/A",

                            custom_design_id:
                                item.customDesignId || null
                        },
                        {
                            onConflict:
                                "user_id,product_id,size"
                        }
                    );


            if (saveError) {

                alert(
                    "CART SAVE ERROR:\n\n" +
                    saveError.message
                );

                console.error(
                    "CART SAVE ERROR:",
                    saveError
                );

                return false;
            }
        }


        console.log(
            "CART SAVED TO SUPABASE"
        );

        return true;

    } catch (error) {

        console.error(
            "SAVE CART EXCEPTION:",
            error
        );

        alert(
            "CART ERROR:\n\n" +
            error.message
        );

        return false;
    }
}


// ===============================
// CATEGORY / PRODUCT STATE
// ===============================

let selectedCategory = "All";

let selectedProduct = null;


// ===============================
// DISPLAY PRODUCTS
// ===============================

function displayProducts(productList) {

    const productContainer =
        document.getElementById(
            "products"
        );

    if (!productContainer) return;

    productContainer.innerHTML = "";


    if (productList.length === 0) {

        productContainer.innerHTML = `
            <p class="no-results">
                No products found.
            </p>
        `;

        return;
    }


    productList.forEach(
        product => {

            const isSaved =
                wishlist.includes(
                    product.id
                );


            productContainer.innerHTML += `
                <div
                    class="product"
                    onclick="openProductDetails(${product.id})"
                >

                    <button
                        class="wishlist-heart ${isSaved ? "saved" : ""}"
                        onclick="event.stopPropagation(); toggleWishlist(${product.id})"
                    >
                        ${isSaved ? "♥" : "♡"}
                    </button>


                    <img
                        src="${product.image}"
                        alt="${product.name}"
                    >


                    <span class="product-category">
                        ${product.category}
                    </span>


                    <h3>
                        ${product.name}
                    </h3>


                    <div class="product-rating">
                        ⭐ ${product.rating}
                    </div>


                    <div class="product-price">

                        <span class="old-price">
                            ₱${product.oldPrice}
                        </span>

                        <span class="price">
                            ₱${product.price}
                        </span>

                    </div>


                    <span class="sale-badge">
                        🔥 SALE
                    </span>


                    <p class="stock">
                        📦 ${product.stock} left
                    </p>


                    <button
                        onclick="event.stopPropagation(); addToCart(${product.id})"
                    >
                        🛒 Add to Cart
                    </button>

                </div>
            `;
        }
    );
}


// ===============================
// SEARCH
// ===============================

function filterProducts() {

    const searchInput =
        document.getElementById(
            "search-input"
        );

    const search =
        searchInput
            ? searchInput.value
                .toLowerCase()
                .trim()
            : "";


    const filteredProducts =
        products.filter(
            product => {

                const matchesSearch =
                    product.name
                        .toLowerCase()
                        .includes(
                            search
                        );


                const matchesCategory =
                    selectedCategory.toUpperCase() === "ALL" ||
                    product.category.toUpperCase() === selectedCategory.toUpperCase();


                return (
                    matchesSearch &&
                    matchesCategory
                );
            }
        );


    displayProducts(
        filteredProducts
    );
}


// ===============================
// CATEGORY
// ===============================

function setCategory(category) {

    selectedCategory =
        category;


    document
        .querySelectorAll(
            ".category"
        )
        .forEach(
            button => {

                button.classList.remove(
                    "active"
                );


                if (
                    button.textContent.trim().toUpperCase() ===
                    category.toUpperCase()
                ) {

                    button.classList.add(
                        "active"
                    );
                }
            }
        );


    filterProducts();
}


// ===============================
// WISHLIST
// ===============================

function toggleWishlist(productId) {

    const currentUsername =
        getCurrentUsername();


    if (!currentUsername) {

        alert(
            "Please login to use your wishlist."
        );

        return;
    }


    if (
        wishlist.includes(
            productId
        )
    ) {

        wishlist =
            wishlist.filter(
                id =>
                    id !==
                    productId
            );

    } else {

        wishlist.push(
            productId
        );
    }


    saveUserWishlist();

    updateWishlistCount();

    filterProducts();
}


function updateWishlistCount() {

    const count =
        document.getElementById(
            "wishlist-count"
        );


    if (count) {

        count.textContent =
            wishlist.length;
    }
}


function showWishlist() {

    const currentUsername =
        getCurrentUsername();


    if (!currentUsername) {

        alert(
            "Please login first."
        );

        return;
    }


    loadUserWishlist();


    if (
        wishlist.length === 0
    ) {

        alert(
            "Your wishlist is empty!"
        );

        return;
    }


    const wishlistProducts =
        products.filter(
            product =>
                wishlist.includes(
                    product.id
                )
        );


    displayProducts(
        wishlistProducts
    );
}


// ===============================
// CART
// ===============================

function addToCart(productId) {

    openProductDetails(
        productId
    );
}


// ===============================
// UPDATE CART UI
// ===============================

function updateCart() {

    const cartItems =
        document.getElementById(
            "cart-items"
        );

    const cartCount =
        document.getElementById(
            "cart-count"
        );

    const cartTotal =
        document.getElementById(
            "cart-total"
        );


    if (!cartItems) return;


    cartItems.innerHTML = "";


    let total = 0;

    let count = 0;


    if (
        cart.length === 0
    ) {

        cartItems.innerHTML =
            "<p>Your cart is empty.</p>";
    }


    cart.forEach(
        item => {

            total +=
                Number(item.price) *
                Number(item.quantity);


            count +=
                Number(item.quantity);


            cartItems.innerHTML += `
                <div class="cart-item">

                    <div class="cart-item-info">

                        <strong>
                            ${item.name}
                        </strong>

                        <p>
                            Size:
                            ${item.size || "N/A"}
                        </p>
                        ${item.customDesignId ? `<p style="color:#00cde9;font-size:12px;">✦ Custom design saved</p>` : ""}

                        <p>
                            ₱${item.price}
                        </p>

                    </div>


                    <div class="quantity">

                        <button
                            onclick="decreaseQuantity(${item.id})"
                        >
                            −
                        </button>

                        <span>
                            ${item.quantity}
                        </span>

                        <button
                            onclick="increaseQuantity(${item.id})"
                        >
                            +
                        </button>

                    </div>


                    <button
                        class="remove-button"
                        onclick="removeFromCart(${item.id})"
                    >
                        Remove
                    </button>

                </div>
            `;
        }
    );


    if (cartCount) {

        cartCount.textContent =
            count;
    }


    const cartCountMini =
        document.getElementById(
            "cart-count-mini"
        );

    if (cartCountMini) {

        cartCountMini.textContent =
            count;
    }


    if (cartTotal) {

        cartTotal.textContent =
            total.toLocaleString();
    }
}


// ===============================
// INCREASE QUANTITY
// ===============================

async function increaseQuantity(productId) {

    const item =
        cart.find(
            item =>
                item.id ===
                productId
        );


    if (!item) return;


    item.quantity++;


    updateCart();


    await saveUserCart();
}


// ===============================
// DECREASE QUANTITY
// ===============================

async function decreaseQuantity(productId) {

    const item =
        cart.find(
            item =>
                item.id ===
                productId
        );


    if (!item) return;


    item.quantity--;


    if (
        item.quantity <= 0
    ) {

        cart =
            cart.filter(
                item =>
                    item.id !==
                    productId
            );
    }


    updateCart();


    await saveUserCart();
}


// ===============================
// REMOVE FROM CART
// ===============================

async function removeFromCart(productId) {

    cart =
        cart.filter(
            item =>
                item.id !==
                productId
        );


    updateCart();


    await saveUserCart();
}


// ===============================
// OPEN CART
// ===============================

function openCart() {

    const modal =
        document.getElementById(
            "cart-modal"
        );


    if (modal) {

        modal.style.display =
            "block";
    }


    updateCart();
}


// ===============================
// CLOSE CART
// ===============================

function closeCart() {

    const modal =
        document.getElementById(
            "cart-modal"
        );


    if (modal) {

        modal.style.display =
            "none";
    }
}


// ===============================
// PRODUCT DETAILS
// ===============================

function openProductDetails(productId) {

    selectedProduct =
        products.find(
            product =>
                product.id ===
                productId
        );


    if (!selectedProduct) {

        return;
    }


    const detailImage =
        document.getElementById(
            "detail-image"
        );

    const detailName =
        document.getElementById(
            "detail-name"
        );

    const detailPrice =
        document.getElementById(
            "detail-price"
        );

    const detailDescription =
        document.getElementById(
            "detail-description"
        );

    const detailRating =
        document.getElementById(
            "detail-rating"
        );

    const detailStock =
        document.getElementById(
            "detail-stock"
        );

    const detailQuantity =
        document.getElementById(
            "detail-quantity"
        );


    if (detailImage) {

        detailImage.src =
            selectedProduct.image;
    }


    if (detailName) {

        detailName.textContent =
            selectedProduct.name;
    }


    if (detailPrice) {

        detailPrice.innerHTML = `
            <span class="old-price">
                ₱${selectedProduct.oldPrice}
            </span>

            <span class="detail-sale-price">
                ₱${selectedProduct.price}
            </span>

            <span class="sale-badge">
                🔥 SALE
            </span>
        `;
    }


    if (detailDescription) {

        detailDescription.textContent =
            "Comfortable and stylish clothing perfect for everyday wear.";
    }


    if (detailRating) {

        detailRating.textContent =
            "⭐ " +
            selectedProduct.rating;
    }


    if (detailStock) {

        detailStock.textContent =
            "📦 " +
            selectedProduct.stock +
            " items left";
    }


    if (detailQuantity) {

        detailQuantity.value =
            1;
    }


    const customizeButton = document.getElementById("customize-product-button");
    if (customizeButton) {
        customizeButton.style.display = selectedProduct.category === "Shirts" ? "block" : "none";
    }

    loadReviews(
        selectedProduct.id
    );

    updateReviewEligibility(
        selectedProduct.id
    );


    const modal =
        document.getElementById(
            "product-modal"
        );


    if (modal) {

        modal.style.display =
            "block";
    }
}


function openProductCustomizer() {
    if (!selectedProduct || selectedProduct.category !== "Shirts") return;
    window.location.href = `customize.html?productId=${encodeURIComponent(selectedProduct.id)}`;
}

// ===============================
// CLOSE PRODUCT DETAILS
// ===============================

function closeProductDetails() {

    const modal =
        document.getElementById(
            "product-modal"
        );


    if (modal) {

        modal.style.display =
            "none";
    }
}


// ===============================
// ADD DETAILED PRODUCT TO CART
// ===============================

async function addDetailedProductToCart() {

    if (!selectedProduct) {

        alert(
            "Please select a product."
        );

        return;
    }


    const sizeElement =
        document.getElementById(
            "detail-size"
        );

    const quantityElement =
        document.getElementById(
            "detail-quantity"
        );


    if (
        !sizeElement ||
        !quantityElement
    ) {

        alert(
            "Size or quantity field is missing."
        );

        return;
    }


    const size =
        sizeElement.value;


    const quantity =
        parseInt(
            quantityElement.value
        );


    if (!size) {

        alert(
            "Please select a size."
        );

        return;
    }


    if (
        isNaN(quantity) ||
        quantity < 1
    ) {

        alert(
            "Please enter a valid quantity."
        );

        return;
    }


    // =========================
    // CHECK IF SAME PRODUCT + SIZE
    // =========================

    const existingItem =
        cart.find(
            item =>
                item.id ===
                    selectedProduct.id &&
                (item.size || "N/A") ===
                    size
        );


    if (existingItem) {

        existingItem.quantity +=
            quantity;

    } else {

        cart.push({

            id:
                selectedProduct.id,

            name:
                selectedProduct.name,

            price:
                selectedProduct.price,

            quantity:
                quantity,

            size:
                size
        });
    }


    // Update screen immediately
    updateCart();


    // Save to Supabase
    const saved =
        await saveUserCart();


    // Close details
    closeProductDetails();


    // Popup
    showCartAdded();


    if (saved) {

        alert(
            selectedProduct.name +
            " - Size " +
            size +
            " added to cart! ✅"
        );

    } else {

        alert(
            selectedProduct.name +
            " - Size " +
            size +
            " added locally.\n\n" +
            "Hindi pa na-save sa Supabase."
        );
    }
}


// ===============================
// CHECKOUT
// ===============================

function openCheckout() {

    if (
        cart.length === 0
    ) {

        alert(
            "Your cart is empty!"
        );

        return;
    }


    closeCart();


    const currentUsername =
        localStorage.getItem(
            "currentUser"
        );


    if (!currentUsername) {

        alert(
            "Please login before checkout."
        );

        return;
    }


    const profiles =
        JSON.parse(
            localStorage.getItem(
                "profiles"
            )
        ) || {};


    const profile =
        profiles[
            currentUsername
        ] || {};


    const customerName =
        document.getElementById(
            "customer-name"
        );

    const contact =
        document.getElementById(
            "contact"
        );

    const address =
        document.getElementById(
            "address"
        );

    const payment =
        document.getElementById(
            "payment"
        );


    if (customerName) {

        customerName.value =
            profile.name || "";
    }


    if (contact) {

        contact.value =
            profile.contact || "";
    }


    if (address) {

        address.value =
            profile.address || "";
    }


    if (payment) {

        payment.value =
            profile.payment || "";
    }


    let total = 0;


    cart.forEach(
        item => {

            total +=
                item.price *
                item.quantity;
        }
    );


    const checkoutTotal =
        document.getElementById(
            "checkout-total"
        );


    if (checkoutTotal) {

        checkoutTotal.textContent =
            total.toLocaleString();
    }


    const checkoutItems =
        document.getElementById(
            "checkout-items"
        );


    if (checkoutItems) {

        checkoutItems.innerHTML =
            "";


        cart.forEach(
            item => {

                const itemTotal =
                    item.price *
                    item.quantity;


                checkoutItems.innerHTML += `
                    <div class="checkout-item">

                        <strong>
                            ${item.name}
                        </strong>

                        <p>
                            Size:
                            ${item.size || "N/A"}
                        </p>

                        <p>
                            Quantity:
                            ${item.quantity}
                        </p>

                        <p>
                            ₱${itemTotal.toLocaleString()}
                        </p>

                    </div>
                `;
            }
        );
    }


    const checkoutModal =
        document.getElementById(
            "checkout-modal"
        );


    if (checkoutModal) {

        checkoutModal.style.display =
            "block";
    }
}


// ===============================
// CLOSE CHECKOUT
// ===============================

function closeCheckout() {

    const modal =
        document.getElementById(
            "checkout-modal"
        );


    if (modal) {

        modal.style.display =
            "none";
    }
}


// ===============================
// CHECKOUT FORM
// ===============================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        const checkoutForm =
            document.getElementById(
                "checkout-form"
            );


        if (!checkoutForm) {

            console.error(
                "Checkout form not found!"
            );

            return;
        }


        checkoutForm.addEventListener(
            "submit",
            async function(event) {

                event.preventDefault();

                event.stopPropagation();


                const nameElement =
                    document.getElementById(
                        "customer-name"
                    );

                const contactElement =
                    document.getElementById(
                        "contact"
                    );

                const addressElement =
                    document.getElementById(
                        "address"
                    );

                const paymentElement =
                    document.getElementById(
                        "payment"
                    );

                const totalElement =
                    document.getElementById(
                        "checkout-total"
                    );


                if (
                    !nameElement ||
                    !contactElement ||
                    !addressElement ||
                    !paymentElement ||
                    !totalElement
                ) {

                    alert(
                        "Checkout information is incomplete."
                    );

                    return;
                }


                const name =
                    nameElement.value.trim();

                const contact =
                    contactElement.value.trim();

                const address =
                    addressElement.value.trim();

                const payment =
                    paymentElement.value;


                const total =
                    Number(
                        totalElement
                            .textContent
                            .replace(
                                /,/g,
                                ""
                            )
                            .trim()
                    );


                if (!name) {

                    alert(
                        "Please enter your name."
                    );

                    return;
                }


                if (!contact) {

                    alert(
                        "Please enter your contact number."
                    );

                    return;
                }


                if (!address) {

                    alert(
                        "Please enter your delivery address."
                    );

                    return;
                }


                if (!payment) {

                    alert(
                        "Please select a payment method."
                    );

                    return;
                }


                if (
                    !Number.isFinite(total) ||
                    total <= 0
                ) {

                    alert(
                        "Invalid order total."
                    );

                    return;
                }


                if (
                    cart.length === 0
                ) {

                    alert(
                        "Your cart is empty!"
                    );

                    return;
                }


                const orderItems =
                    cart.map(
                        item => ({

                            id:
                                item.id,

                            name:
                                item.name,

                            size:
                                item.size ||
                                "N/A",

                            quantity:
                                Number(
                                    item.quantity
                                ),

                            price:
                                Number(
                                    item.price
                                ),

                            customDesignId:
                                item.customDesignId || null
                        })
                    );


                const currentUsername =
                    localStorage.getItem(
                        "currentUser"
                    );


                if (!currentUsername) {

                    alert(
                        "Please login before placing an order."
                    );

                    return;
                }


                const submitButton =
                    checkoutForm.querySelector(
                        'button[type="submit"]'
                    );


                if (submitButton) {

                    submitButton.disabled =
                        true;

                    submitButton.textContent =
                        "Processing Order...";
                }


                try {

                    const {
                        data: { user }
                    } = await supabaseClient.auth.getUser();


                    if (!user) {

                        throw new Error(
                            "Please login before placing an order."
                        );
                    }


                    const orderID =
                        "FRL-" +
                        Date.now().toString().slice(-8);


                    const { data: insertedOrder, error: orderError } =
                        await supabaseClient
                            .from("orders")
                            .insert({
                                order_id: orderID,
                                user_id: user.id,
                                name: name,
                                contact: contact,
                                address: address,
                                payment: payment,
                                total: total,
                                status: "Order Received"
                            })
                            .select()
                            .single();

                    if (orderError) throw orderError;

                    const backendItems = orderItems.map(item => ({
                        order_id: insertedOrder.id,
                        product_id: item.id,
                        product_name: item.name,
                        price: item.price,
                        quantity: item.quantity,
                        size: item.size,
                        custom_design_id: item.customDesignId
                    }));

                    const { error: itemsError } = await supabaseClient
                        .from("order_items")
                        .insert(backendItems);

                    if (itemsError) throw itemsError;

                    const backendOrder = {
                        orderID: insertedOrder.order_id,
                        username: currentUsername,
                        name: insertedOrder.name,
                        contact: insertedOrder.contact,
                        address: insertedOrder.address,
                        payment: insertedOrder.payment,
                        items: orderItems,
                        status: insertedOrder.status
                    };


                    const orders =
                        JSON.parse(
                            localStorage.getItem(
                                "orders"
                            )
                        ) || [];


                    orders.push({

                        ...backendOrder,

                        total:
                            total.toLocaleString(),

                        date:
                            new Date()
                                .toLocaleString()
                    });


                    localStorage.setItem(
                        "orders",
                        JSON.stringify(
                            orders
                        )
                    );


                    const orderIdElement =
                        document.getElementById(
                            "order-id"
                        );

                    const orderCustomer =
                        document.getElementById(
                            "order-customer"
                        );

                    const orderPayment =
                        document.getElementById(
                            "order-payment"
                        );

                    const orderTotal =
                        document.getElementById(
                            "order-total"
                        );


                    if (orderIdElement) {

                        orderIdElement.textContent =
                            orderID;
                    }


                    if (orderCustomer) {

                        orderCustomer.textContent =
                            name;
                    }


                    if (orderPayment) {

                        orderPayment.textContent =
                            payment;
                    }


                    if (orderTotal) {

                        orderTotal.textContent =
                            total.toLocaleString();
                    }


                    // Clear cart
                    cart = [];


                    // Save empty cart
                    await saveUserCart();


                    updateCart();


                    closeCheckout();


                    const successModal =
                        document.getElementById(
                            "success-modal"
                        );


                    if (successModal) {

                        successModal.style.display =
                            "block";
                    }


                    checkoutForm.reset();


                    playNotificationSound();


                    showNeonPopup(
                        "✅ Order placed successfully!"
                    );


                } catch (error) {

                    console.error(
                        "ORDER ERROR:",
                        error
                    );


                    alert(
                        "Hindi na-place ang order.\n\n" +
                        (error.message ||
                            "Please try again.")
                    );


                } finally {

                    if (submitButton) {

                        submitButton.disabled =
                            false;

                        submitButton.textContent =
                            "Place Order";
                    }
                }
            }
        );
    }
);


// ===============================
// SUCCESS
// ===============================

function closeSuccess() {

    const modal =
        document.getElementById(
            "success-modal"
        );


    if (modal) {

        modal.style.display =
            "none";
    }
}


// ===============================
// ORDERS
// ===============================


function closeOrders() {

    const modal =
        document.getElementById(
            "orders-modal"
        );


    if (modal) {

        modal.style.display =
            "none";
    }
}


// ===============================
// SYNC CUSTOMER ORDERS
// ===============================

async function syncCustomerOrdersWithBackend() {

    const currentUsername =
        localStorage.getItem(
            "currentUser"
        );


    if (!currentUsername) {

        return [];
    }


    try {

        const {
            data: { user }
        } = await supabaseClient.auth.getUser();


        if (!user) {

            return [];
        }


        const { data: supaOrders, error } = await supabaseClient
            .from("orders")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: true });
        if (error) throw error;

        const orderIds = (supaOrders || []).map(order => order.id);
        let itemRows = [];
        if (orderIds.length) {
            const { data, error: itemError } = await supabaseClient
                .from("order_items")
                .select("*")
                .in("order_id", orderIds);
            if (itemError) throw itemError;
            itemRows = data || [];
        }

        const mappedOrders = (supaOrders || []).map(order => ({
            orderID: order.order_id,
            username: currentUsername,
            name: order.name,
            contact: order.contact,
            address: order.address,
            payment: order.payment,
            items: itemRows.filter(item => item.order_id === order.id).map(item => ({
                id: item.product_id,
                name: item.product_name,
                size: item.size,
                quantity: item.quantity,
                price: item.price,
                customDesignId: item.custom_design_id
            })),
            status: order.status,
            total: Number(order.total).toLocaleString(),
            date: new Date(order.created_at).toLocaleString()
        }));


        localStorage.setItem(
            "orders",
            JSON.stringify(mappedOrders)
        );


        return mappedOrders;


    } catch (error) {

        console.warn(
            "Could not sync customer orders:",
            error
        );


        const allLocalOrders =
            JSON.parse(
                localStorage.getItem(
                    "orders"
                )
            ) || [];


        return allLocalOrders.filter(
            order =>
                order.username &&
                order.username
                    .toLowerCase() ===
                currentUsername
                    .toLowerCase()
        );
    }
}


// ===============================
// SHOW ORDERS
// ===============================

async function showOrders() {

    const ordersList =
        document.getElementById(
            "orders-list"
        );


    if (!ordersList) return;


    ordersList.innerHTML = `
        <p>
            🔄 Checking latest order status...
        </p>
    `;


    const orders =
        await syncCustomerOrdersWithBackend();


    ordersList.innerHTML =
        "";


    if (
        orders.length === 0
    ) {

        ordersList.innerHTML = `
            <p>
                No orders yet.
            </p>
        `;

    } else {

        orders
            .slice()
            .reverse()
            .forEach(
                order => {

                    let itemsHTML =
                        "";


                    if (order.items) {

                        order.items.forEach(
                            item => {

                                const itemTotal =
                                    item.price *
                                    item.quantity;


                                itemsHTML += `
                                    <div class="order-product">

                                        <strong>
                                            ${item.name}
                                        </strong>

                                        <p>
                                            📏 Size:
                                            ${item.size}
                                        </p>

                                        <p>
                                            🔢 Quantity:
                                            ${item.quantity}
                                        </p>

                                        <p>
                                            💰 ₱${itemTotal.toLocaleString()}
                                        </p>

                                    </div>
                                `;
                            }
                        );
                    }


                    const statuses = [

                        "Order Received",
                        "Processing",
                        "Shipped",
                        "Delivered"

                    ];


                    const status =
                        statuses.includes(
                            order.status
                        )
                            ? order.status
                            : "Order Received";


                    const currentIndex =
                        statuses.indexOf(
                            status
                        );


                    ordersList.innerHTML += `

                        <div class="order-card">

                            <div class="order-header">

                                <h3>
                                    🛍️ ${order.orderID}
                                </h3>

                            </div>


                            <p class="order-date">

                                📅 ${
                                    order.date ||
                                    "Date unavailable"
                                }

                            </p>


                            <div class="order-progress">

                                <div
                                    class="progress-step ${
                                        currentIndex >= 0
                                            ? "active"
                                            : ""
                                    }"
                                >

                                    <span>✓</span>

                                    <small>
                                        Received
                                    </small>

                                </div>


                                <div
                                    class="progress-line ${
                                        currentIndex >= 1
                                            ? "active"
                                            : ""
                                    }"
                                ></div>


                                <div
                                    class="progress-step ${
                                        currentIndex >= 1
                                            ? "active"
                                            : ""
                                    }"
                                >

                                    <span>2</span>

                                    <small>
                                        Processing
                                    </small>

                                </div>


                                <div
                                    class="progress-line ${
                                        currentIndex >= 2
                                            ? "active"
                                            : ""
                                    }"
                                ></div>


                                <div
                                    class="progress-step ${
                                        currentIndex >= 2
                                            ? "active"
                                            : ""
                                    }"
                                >

                                    <span>3</span>

                                    <small>
                                        Shipped
                                    </small>

                                </div>


                                <div
                                    class="progress-line ${
                                        currentIndex >= 3
                                            ? "active"
                                            : ""
                                    }"
                                ></div>


                                <div
                                    class="progress-step ${
                                        currentIndex >= 3
                                            ? "active"
                                            : ""
                                    }"
                                >

                                    <span>4</span>

                                    <small>
                                        Delivered
                                    </small>

                                </div>

                            </div>


                            <p class="current-status">

                                📌 Current Status:

                                <strong>
                                    ${status}
                                </strong>

                            </p>


                            ${
                                currentIndex >= 3
                                    ? `
                                        <p class="delivered-message">
                                            ✅ Order Delivered
                                        </p>
                                    `
                                    : ""
                            }


                            <div class="order-products">

                                ${itemsHTML}

                            </div>


                            <div class="order-info">

                                <p>

                                    👤
                                    <strong>
                                        Customer:
                                    </strong>

                                    ${order.name}

                                </p>


                                <p>

                                    💳
                                    <strong>
                                        Payment:
                                    </strong>

                                    ${order.payment}

                                </p>

                            </div>


                            <div class="order-total">

                                <strong>
                                    Total
                                </strong>

                                <strong>
                                    ₱${order.total}
                                </strong>

                            </div>

                        </div>
                    `;
                }
            );
    }


    const modal =
        document.getElementById(
            "orders-modal"
        );


    if (modal) {

        modal.style.display =
            "block";
    }
}


// ===============================
// REVIEWS
// ===============================

// ===============================
// REVIEW ELIGIBILITY
// (Only customers with a DELIVERED order for this product can rate it)
// ===============================

async function updateReviewEligibility(productId) {

    const reviewForm =
        document.getElementById(
            "review-form"
        );

    const lockedMessage =
        document.getElementById(
            "review-locked-message"
        );


    if (!reviewForm || !lockedMessage) return;


    const currentUsername =
        getCurrentUsername();


    if (!currentUsername) {

        reviewForm.style.display = "none";

        lockedMessage.style.display = "block";

        lockedMessage.innerHTML =
            "🔒 Please log in and order this product to leave a rating.";

        return;
    }


    const orders =
        await syncCustomerOrdersWithBackend();


    const eligible =
        orders.some(
            order =>
                order.status === "Delivered" &&
                Array.isArray(order.items) &&
                order.items.some(
                    item => Number(item.id) === Number(productId)
                )
        );


    if (eligible) {

        reviewForm.style.display = "block";

        lockedMessage.style.display = "none";

    } else {

        reviewForm.style.display = "none";

        lockedMessage.style.display = "block";

        lockedMessage.innerHTML = `
            🔒 You can rate this product once your order for it says
            <strong>"Delivered"</strong> in My Orders.
        `;
    }
}


function loadReviews(productId) {

    const reviews =
        JSON.parse(
            localStorage.getItem(
                "reviews"
            )
        ) || [];


    const productReviews =
        reviews.filter(
            review =>
                review.productId ===
                productId
        );


    const reviewsList =
        document.getElementById(
            "reviews-list"
        );


    if (!reviewsList) return;


    reviewsList.innerHTML =
        "";


    if (
        productReviews.length ===
        0
    ) {

        reviewsList.innerHTML =
            "<p>No reviews yet.</p>";

        return;
    }


    productReviews.forEach(
        review => {

            reviewsList.innerHTML += `
                <div class="review-card">

                    <div class="review-stars">
                        ${"⭐".repeat(
                            review.rating
                        )}
                    </div>

                    <p>
                        ${review.text}
                    </p>

                    <small>
                        ${review.date}
                    </small>

                </div>
            `;
        }
    );
}


async function addReview() {

    if (!selectedProduct)
        return;


    const currentUsername =
        getCurrentUsername();


    if (!currentUsername) {

        alert(
            "Please log in first."
        );

        return;
    }


    const orders =
        await syncCustomerOrdersWithBackend();


    const eligible =
        orders.some(
            order =>
                order.status === "Delivered" &&
                Array.isArray(order.items) &&
                order.items.some(
                    item => Number(item.id) === Number(selectedProduct.id)
                )
        );


    if (!eligible) {

        alert(
            "You can only rate a product after it has been marked Delivered."
        );

        return;
    }


    const ratingElement =
        document.getElementById(
            "review-rating"
        );


    const textElement =
        document.getElementById(
            "review-text"
        );


    if (
        !ratingElement ||
        !textElement
    ) {

        return;
    }


    const rating =
        ratingElement.value;


    const text =
        textElement.value.trim();


    if (!rating) {

        alert(
            "Please select a rating."
        );

        return;
    }


    if (!text) {

        alert(
            "Please write a review."
        );

        return;
    }


    const reviews =
        JSON.parse(
            localStorage.getItem(
                "reviews"
            )
        ) || [];


    reviews.push({

        productId:
            selectedProduct.id,

        rating:
            Number(rating),

        text:
            text,

        date:
            new Date()
                .toLocaleDateString()
    });


    localStorage.setItem(
        "reviews",
        JSON.stringify(
            reviews
        )
    );


    ratingElement.value =
        "";


    textElement.value =
        "";


    loadReviews(
        selectedProduct.id
    );


    alert(
        "Review submitted successfully! ⭐"
    );
}


// ===============================
// SAVE PROFILE
// ===============================

function saveProfile() {

    const currentUsername =
        localStorage.getItem(
            "currentUser"
        );


    if (!currentUsername) {

        alert(
            "Please login first."
        );

        return;
    }


    const nameElement =
        document.getElementById(
            "profile-name"
        );

    const contactElement =
        document.getElementById(
            "profile-contact"
        );

    const addressElement =
        document.getElementById(
            "profile-address"
        );

    const paymentElement =
        document.getElementById(
            "profile-payment"
        );


    if (
        !nameElement ||
        !contactElement ||
        !addressElement ||
        !paymentElement
    ) {

        alert(
            "Profile fields are missing."
        );

        return;
    }


    const profile = {

        name:
            nameElement.value.trim(),

        contact:
            contactElement.value.trim(),

        address:
            addressElement.value.trim(),

        payment:
            paymentElement.value
    };


    const profiles =
        JSON.parse(
            localStorage.getItem(
                "profiles"
            )
        ) || {};


    profiles[currentUsername] =
        profile;


    localStorage.setItem(
        "profiles",
        JSON.stringify(
            profiles
        )
    );


    alert(
        "Profile saved successfully!"
    );
}


// ===============================
// OPEN PROFILE
// ===============================

function openProfile() {

    const currentUsername =
        localStorage.getItem(
            "currentUser"
        );


    if (!currentUsername) {

        alert(
            "Please login first."
        );

        return;
    }


    const profiles =
        JSON.parse(
            localStorage.getItem(
                "profiles"
            )
        ) || {};


    const profile =
        profiles[currentUsername] ||
        {};


    const nameElement =
        document.getElementById(
            "profile-name"
        );

    const contactElement =
        document.getElementById(
            "profile-contact"
        );

    const addressElement =
        document.getElementById(
            "profile-address"
        );

    const paymentElement =
        document.getElementById(
            "profile-payment"
        );


    if (nameElement) {

        nameElement.value =
            profile.name || "";
    }


    if (contactElement) {

        contactElement.value =
            profile.contact || "";
    }


    if (addressElement) {

        addressElement.value =
            profile.address || "";
    }


    if (paymentElement) {

        paymentElement.value =
            profile.payment || "";
    }


    const modal =
        document.getElementById(
            "profile-modal"
        );


    if (modal) {

        modal.style.display =
            "flex";
    }
}


function closeProfile() {

    const modal =
        document.getElementById(
            "profile-modal"
        );


    if (modal) {

        modal.style.display =
            "none";
    }
}


// ===============================
// NEON POPUP
// ===============================

function showNeonPopup(message) {

    let popup =
        document.getElementById(
            "neon-popup"
        );


    if (!popup) {

        popup =
            document.createElement(
                "div"
            );

        popup.id =
            "neon-popup";

        document.body.appendChild(
            popup
        );
    }


    popup.textContent =
        message;


    popup.classList.remove(
        "show"
    );


    void popup.offsetWidth;


    popup.classList.add(
        "show"
    );


    setTimeout(
        () => {

            popup.classList.remove(
                "show"
            );

        },
        1800
    );
}


// ===============================
// NOTIFICATION SOUND
// ===============================

function playNotificationSound() {

    try {

        const audioContext =
            new (
                window.AudioContext ||
                window.webkitAudioContext
            )();


        const oscillator =
            audioContext.createOscillator();


        const gainNode =
            audioContext.createGain();


        oscillator.connect(
            gainNode
        );


        gainNode.connect(
            audioContext.destination
        );


        oscillator.type =
            "sine";


        oscillator.frequency.setValueAtTime(
            700,
            audioContext.currentTime
        );


        oscillator.frequency.setValueAtTime(
            1000,
            audioContext.currentTime +
            0.12
        );


        gainNode.gain.setValueAtTime(
            0.25,
            audioContext.currentTime
        );


        gainNode.gain.exponentialRampToValueAtTime(
            0.01,
            audioContext.currentTime +
            0.3
        );


        oscillator.start();


        oscillator.stop(
            audioContext.currentTime +
            0.3
        );

    } catch (error) {

        console.log(
            "Notification sound unavailable."
        );
    }
}


// ===============================
// BUTTON CLICK EFFECT
// ===============================

document.addEventListener(
    "click",
    function(event) {

        const button =
            event.target.closest(
                "button"
            );


        if (!button) return;


        button.classList.remove(
            "neon-click"
        );


        void button.offsetWidth;


        button.classList.add(
            "neon-click"
        );


        setTimeout(
            () => {

                button.classList.remove(
                    "neon-click"
                );

            },
            350
        );
    }
);


// ===============================
// ACCOUNT SYSTEM
// ===============================

function openAccount() {

    const loginPage =
        document.getElementById(
            "login-page"
        );


    if (!loginPage) {

        alert(
            "Login page not found."
        );

        return;
    }


    const currentUser =
        localStorage.getItem(
            "currentUser"
        );


    if (currentUser) {

        showAccountInfo();

    } else {

        loginPage.style.display =
            "flex";

        showLogin();
    }
}


// ===============================
// SHOW LOGIN
// ===============================

function showLogin() {

    const loginSection =
        document.getElementById(
            "login-section"
        );

    const registerSection =
        document.getElementById(
            "register-section"
        );


    if (loginSection) {

        loginSection.style.display =
            "block";
    }


    if (registerSection) {

        registerSection.style.display =
            "none";
    }
}


// ===============================
// LOGIN
// ===============================

async function loginUser() {

    const email =
        document.getElementById(
            "login-username"
        ).value.trim();


    const password =
        document.getElementById(
            "login-password"
        ).value;


    if (!email || !password) {

        alert(
            "Please enter your email and password."
        );

        return;
    }


    const {
        data,
        error
    } =
        await supabaseClient.auth
            .signInWithPassword({

                email:
                    email,

                password:
                    password
            });


    if (error) {

        alert(
            "Login failed: " +
            error.message
        );

        return;
    }


    if (!data.user) {

        alert(
            "Login failed. Please try again."
        );

        return;
    }


    const username =
        data.user.user_metadata?.username ||
        data.user.email.split("@")[0];


    localStorage.setItem(
        "currentUser",
        username
    );


    alert(
        "Login successful! 👋"
    );


    try {

        await loadUserCart();

        loadUserWishlist();

        updateCart();

        updateWishlistCount();

    } catch (uiError) {

        console.error(
            "POST-LOGIN ERROR:",
            uiError
        );
    }


    const loginPage =
        document.getElementById(
            "login-page"
        );


    if (loginPage) {

        loginPage.style.display =
            "none";
    }
}


// ===============================
// SHOW REGISTER
// ===============================

function showRegister() {

    const loginSection =
        document.getElementById(
            "login-section"
        );

    const registerSection =
        document.getElementById(
            "register-section"
        );


    if (loginSection) {

        loginSection.style.display =
            "none";
    }


    if (registerSection) {

        registerSection.style.display =
            "block";
    }
}


// ===============================
// REGISTER
// ===============================

async function registerUser() {

    const name =
        document.getElementById(
            "register-name"
        ).value.trim();


    const username =
        document.getElementById(
            "register-username"
        ).value.trim();


    const email =
        document.getElementById(
            "register-email"
        ).value.trim();


    const password =
        document.getElementById(
            "register-password"
        ).value;


    const confirm =
        document.getElementById(
            "register-confirm"
        ).value;


    if (
        !name ||
        !username ||
        !email ||
        !password ||
        !confirm
    ) {

        alert(
            "Please fill in all fields."
        );

        return;
    }


    if (
        password !==
        confirm
    ) {

        alert(
            "Passwords do not match."
        );

        return;
    }


    if (
        password.length <
        6
    ) {

        alert(
            "Password must be at least 6 characters."
        );

        return;
    }


    try {

        const {
            data,
            error
        } =
            await supabaseClient.auth
                .signUp({

                    email:
                        email,

                    password:
                        password,

                    options: {

                        data: {

                            username:
                                username,

                            name:
                                name
                        }
                    }
                });


        if (error) {

            alert(
                "Registration failed: " +
                error.message
            );

            return;
        }


        localStorage.setItem(
            "currentUser",
            username
        );


        // Load empty Supabase cart
        await loadUserCart();

        loadUserWishlist();

        updateCart();

        updateWishlistCount();


        alert(
            "Account created successfully! 🎉"
        );


        const loginPage =
            document.getElementById(
                "login-page"
            );


        if (loginPage) {

            loginPage.style.display =
                "none";
        }

    } catch (error) {

        alert(
            "Registration error: " +
            error.message
        );
    }
}


// ===============================
// ACCOUNT INFORMATION
// ===============================

async function showAccountInfo() {

    try {

        const {
            data: { user },
            error
        } =
            await supabaseClient.auth
                .getUser();


        if (error || !user) {

            alert(
                "Please login first."
            );

            showLogin();

            return;
        }


        const {
            data: profile,
            error: profileError
        } =
            await supabaseClient
                .from("profiles")
                .select(
                    "username, role"
                )
                .eq(
                    "id",
                    user.id
                )
                .single();


        if (profileError) {

            console.error(
                "PROFILE ERROR:",
                profileError
            );
        }


        const username =
            profile?.username ||
            user.user_metadata?.username ||
            user.email?.split("@")[0];


        const name =
            user.user_metadata?.name ||
            username;


        const email =
            user.email || "";


        localStorage.setItem(
            "currentUser",
            username
        );


        const nameElement =
            document.getElementById(
                "profile-name"
            );

        const contactElement =
            document.getElementById(
                "profile-contact"
            );

        const addressElement =
            document.getElementById(
                "profile-address"
            );

        const paymentElement =
            document.getElementById(
                "profile-payment"
            );


        if (nameElement) {

            nameElement.value =
                name;
        }


        if (contactElement) {

            contactElement.value =
                localStorage.getItem(
                    "profileContact_" +
                    username
                ) || "";
        }


        if (addressElement) {

            addressElement.value =
                localStorage.getItem(
                    "profileAddress_" +
                    username
                ) || "";
        }


        if (paymentElement) {

            paymentElement.value =
                localStorage.getItem(
                    "profilePayment_" +
                    username
                ) || "";
        }


        const modal =
            document.getElementById(
                "profile-modal"
            );


        if (modal) {

            modal.style.display =
                "flex";
        }

    } catch (error) {

        console.error(
            "ACCOUNT ERROR:",
            error
        );


        alert(
            "Account error: " +
            error.message
        );
    }
}


// ===============================
// LOGOUT
// ===============================

async function logoutUser() {

    try {

        const {
            error
        } =
            await supabaseClient.auth
                .signOut();


        if (error) {

            alert(
                "Logout failed: " +
                error.message
            );

            return;
        }


        localStorage.removeItem(
            "currentUser"
        );


        cart = [];

        wishlist = [];


        alert(
            "You have been logged out. 👋"
        );


        location.reload();

    } catch (error) {

        console.error(
            "LOGOUT ERROR:",
            error
        );


        alert(
            "Logout error: " +
            error.message
        );
    }
}


// ===============================
// CLOSE ACCOUNT
// ===============================

async function closeAccountPage() {

    // Do not allow guests to bypass the required login screen.
    const { data: { user }, error } = await supabaseClient.auth.getUser();

    if (error || !user) {
        alert("Please log in or create an account to continue.");
        return;
    }

    const loginPage = document.getElementById("login-page");
    if (loginPage) loginPage.style.display = "none";
}


// ===============================
// FORGOT PASSWORD
// ===============================

function forgotPassword() {

    alert(
        "Password recovery will be available soon."
    );
}



// ===============================
// LIVE PRODUCT CATALOG FROM SUPABASE
// ===============================

async function loadStoreProducts() {
    try {
        const { data, error } = await supabaseClient
            .from("products")
            .select("*")
            .order("id", { ascending: true });

        if (error) throw error;

        if (Array.isArray(data) && data.length) {
            const localImages = new Map(products.map(p => [Number(p.id), p.image]));
            products = data
                .filter(row => row.is_active !== false)
                .map(row => ({
                    id: Number(row.id),
                    name: row.name,
                    price: Number(row.price),
                    oldPrice: Number(row.old_price || row.price),
                    category: row.category || "Other",
                    rating: Number(row.rating || 0),
                    stock: Number(row.stock || 0),
                    image: row.image || localImages.get(Number(row.id)) || "images/item1.png"
                }));
        }
    } catch (error) {
        console.warn("Could not load live product catalog; using built-in catalog:", error.message);
    }
}

// ===============================
// FLASH SALE SETTINGS FROM SUPABASE
// ===============================

async function loadFlashSaleSettings() {
    try {
        const { data, error } = await supabaseClient
            .from("sale_settings")
            .select("is_active, ends_at")
            .eq("id", 1)
            .maybeSingle();

        if (error) throw error;

        if (data) {
            flashSaleEndTime = data.is_active && data.ends_at
                ? new Date(data.ends_at).getTime()
                : Date.now();
        }
    } catch (error) {
        console.warn("Using local flash-sale timer:", error.message);
    }
}

// ===============================
// START APP
// ===============================

async function startApp() {

    await loadStoreProducts();
    await loadFlashSaleSettings();
    displayProducts(products);

    // Verify the real Supabase session before trusting the cached username.
    try {
        const { data: { session }, error } = await supabaseClient.auth.getSession();
        if (error) throw error;

        if (session?.user) {
            const username = session.user.user_metadata?.username ||
                session.user.email?.split("@")[0] || "customer";
            localStorage.setItem("currentUser", username);
        } else {
            localStorage.removeItem("currentUser");
        }
    } catch (authError) {
        console.error("STARTUP AUTH CHECK ERROR:", authError);
        localStorage.removeItem("currentUser");
    }

    loadUserWishlist();


    updateWishlistCount();


    const currentUser =
        getCurrentUsername();


    if (currentUser) {

        await loadUserCart();

    } else {

        cart = [];
    }


    const pendingCustomItem = localStorage.getItem("farrellPendingCustomCartItem");
    if (pendingCustomItem) {
        try {
            const customItem = JSON.parse(pendingCustomItem);
            const existing = cart.find(item => item.id === customItem.id && item.size === customItem.size && item.customDesignId === customItem.customDesignId);
            if (existing) existing.quantity += Number(customItem.quantity || 1);
            else cart.push(customItem);
            localStorage.removeItem("farrellPendingCustomCartItem");
            await saveUserCart();
            showNeonPopup("Custom design added to your cart!");
        } catch (e) { console.error("CUSTOM CART RESTORE ERROR", e); }
    }

    updateCart();
}


startApp();


// ===============================
// LOGIN PAGE CHECK
// ===============================

window.addEventListener("DOMContentLoaded", async function() {
    const loginPage = document.getElementById("login-page");

    // Admin visibility must be checked on every page, whether or not
    // this page contains the login modal.
    await checkAdminAccess();

    if (loginPage) {
        loginPage.style.display = "flex";
        try {
            const { data: { session }, error } = await supabaseClient.auth.getSession();
            if (error) throw error;

            if (session?.user) {
                const username = session.user.user_metadata?.username ||
                    session.user.email?.split("@")[0] || "customer";
                localStorage.setItem("currentUser", username);
                loginPage.style.display = "none";
            } else {
                localStorage.removeItem("currentUser");
                loginPage.style.display = "flex";
                showLogin();
            }
        } catch (error) {
            console.error("AUTH SESSION CHECK ERROR:", error);
            localStorage.removeItem("currentUser");
            loginPage.style.display = "flex";
            showLogin();
        }
    }

    // Re-check admin visibility after sign-in, sign-out, or token refresh.
    supabaseClient.auth.onAuthStateChange((event, session) => {
        if (session?.user) {
            const username = session.user.user_metadata?.username ||
                session.user.email?.split("@")[0] || "customer";
            localStorage.setItem("currentUser", username);
            if (loginPage) loginPage.style.display = "none";
            window.setTimeout(() => checkAdminAccess(), 0);
        } else {
            localStorage.removeItem("currentUser");
            if (loginPage) {
                loginPage.style.display = "flex";
                showLogin();
            }
            hideAdminLinks();
        }
    });
});

// =========================================
// FARREL CLOTHING - LOADING SCREEN
// =========================================

window.addEventListener(
    "load",
    function() {

        setTimeout(
            function() {

                const loader =
                    document.getElementById(
                        "farrel-loader"
                    );


                if (loader) {

                    loader.classList.add(
                        "hide-loader"
                    );
                }


                document.body.classList.add(
                    "page-loaded"
                );

            },
            1900
        );
    }
);


// =========================
// SIDEBAR MENU
// =========================

function toggleSidebar() {

    const sidebar =
        document.getElementById("app-sidebar");

    const overlay =
        document.querySelector(".sidebar-overlay");


    if (!sidebar || !overlay) return;


    const isOpen =
        sidebar.classList.contains("open");


    if (isOpen) {

        closeSidebar();

    } else {

        sidebar.classList.add("open");
        overlay.classList.add("open");
        document.body.classList.add("sidebar-locked");
    }
}


function closeSidebar() {

    const sidebar =
        document.getElementById("app-sidebar");

    const overlay =
        document.querySelector(".sidebar-overlay");


    if (sidebar) sidebar.classList.remove("open");

    if (overlay) overlay.classList.remove("open");

    document.body.classList.remove("sidebar-locked");
}


// Close the sidebar automatically after any nav link is tapped
document.addEventListener(
    "DOMContentLoaded",
    function() {

        document
            .querySelectorAll(".sidebar-link, .sidebar-nav .admin-link")
            .forEach(link => {

                link.addEventListener("click", closeSidebar);
            });


        checkAdminAccess();
    }
);


// =========================
// ADMIN NAVIGATION ACCESS
// =========================
function hideAdminLinks() {
    ["admin-link", "header-admin-link"].forEach(id => {
        const link = document.getElementById(id);
        if (link) link.style.display = "none";
    });
}

async function checkAdminAccess() {
    const links = ["admin-link", "header-admin-link"]
        .map(id => document.getElementById(id))
        .filter(Boolean);
    links.forEach(link => link.style.display = "none");

    try {
        const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
        if (authError || !user) return;

        const { data: profile, error } = await supabaseClient
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .maybeSingle();

        if (error) {
            console.error("ADMIN PROFILE CHECK FAILED:", error.message);
            return;
        }

        if (String(profile?.role || "").trim().toLowerCase() === "admin") {
            links.forEach(link => {
                link.style.display = "inline-flex";
                link.removeAttribute("aria-hidden");
            });
            console.info("FARRELL admin navigation enabled.");
        } else {
            console.info("Signed-in account is not marked as admin.", profile);
        }
    } catch (error) {
        console.error("ADMIN ACCESS CHECK FAILED:", error);
    }
}

// =========================
// THEME SWITCHER
// =========================

function toggleTheme() {

    document.body.classList.toggle(
        "light-theme"
    );


    const isLight =
        document.body.classList.contains(
            "light-theme"
        );


    localStorage.setItem(
        "farrelTheme",
        isLight
            ? "light"
            : "dark"
    );


    updateThemeButton();
}


function updateThemeButton() {

    const button =
        document.querySelector(
            ".theme-button"
        );


    if (!button) return;


    const isLight =
        document.body.classList.contains(
            "light-theme"
        );


    const icon =
        button.querySelector(".sidebar-icon");

    const label =
        button.lastElementChild;


    if (icon && label && label !== icon) {

        icon.textContent = isLight ? "🌙" : "☀️";
        label.textContent = isLight ? "Dark Mode" : "Light Mode";

    } else {

        button.textContent =
            isLight
                ? "🌙 Dark"
                : "☀️ Light";
    }
}


// =========================
// LOAD SAVED THEME
// =========================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        const savedTheme =
            localStorage.getItem(
                "farrelTheme"
            );


        if (
            savedTheme ===
            "light"
        ) {

            document.body.classList.add(
                "light-theme"
            );
        }


        updateThemeButton();
    }
);


// =========================
// SCROLL PRODUCTS
// =========================

function scrollToProducts() {

    const productsElement =
        document.getElementById(
            "products"
        );


    if (productsElement) {

        productsElement.scrollIntoView({

            behavior:
                "smooth",

            block:
                "start"
        });
    }
}


// =========================================
// FEATURED COLLECTIONS
// =========================================

function openCollection(category) {

    setCategory(
        category
    );


    const productsElement =
        document.getElementById(
            "products"
        );


    if (productsElement) {

        setTimeout(
            function() {

                productsElement.scrollIntoView({

                    behavior:
                        "smooth",

                    block:
                        "start"
                });

            },
            150
        );
    }
}


// ================================
// FLASH SALE
// ================================

let flashSaleEndTime =
    localStorage.getItem(
        "farrelFlashSaleEnd"
    );


if (
    !flashSaleEndTime ||
    Date.now() >=
        Number(
            flashSaleEndTime
        )
) {

    flashSaleEndTime =
        Date.now() +
        (
            2 *
            60 *
            60 *
            1000
        );


    localStorage.setItem(
        "farrelFlashSaleEnd",
        flashSaleEndTime
    );
}


function updateFlashSale() {

    const hoursElement =
        document.getElementById(
            "sale-hours"
        );

    const minutesElement =
        document.getElementById(
            "sale-minutes"
        );

    const secondsElement =
        document.getElementById(
            "sale-seconds"
        );


    if (
        !hoursElement ||
        !minutesElement ||
        !secondsElement
    ) {

        return;
    }


    const now =
        Date.now();


    let remaining =
        Number(
            flashSaleEndTime
        ) -
        now;


    if (
        remaining <= 0
    ) {

        hoursElement.textContent =
            "00";

        minutesElement.textContent =
            "00";

        secondsElement.textContent =
            "00";

        return;
    }


    const totalSeconds =
        Math.floor(
            remaining / 1000
        );


    const hours =
        Math.floor(
            totalSeconds /
            3600
        );


    const minutes =
        Math.floor(
            (
                totalSeconds %
                3600
            ) / 60
        );


    const seconds =
        totalSeconds %
        60;


    hoursElement.textContent =
        String(hours)
            .padStart(
                2,
                "0"
            );


    minutesElement.textContent =
        String(minutes)
            .padStart(
                2,
                "0"
            );


    secondsElement.textContent =
        String(seconds)
            .padStart(
                2,
                "0"
            );
}


updateFlashSale();


setInterval(
    updateFlashSale,
    1000
);


// ===============================
// CART ADDED POPUP
// ===============================

function showCartAdded() {

    const message =
        document.createElement(
            "div"
        );


    message.className =
        "cart-added-message";


    message.innerHTML =
        "✓ Added to Cart";


    document.body.appendChild(
        message
    );


    setTimeout(
        () => {

            message.classList.add(
                "show"
            );

        },
        10
    );


    setTimeout(
        () => {

            message.classList.remove(
                "show"
            );


            setTimeout(
                () => {

                    message.remove();

                },
                250
            );

        },
        1200
    );
}