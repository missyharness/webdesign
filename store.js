let storeItems = [];
const ITEMS_PER_PAGE = 25;
let currentPage = 1;
let filteredItems = [];

fetch('store-items.json')
    .then(response => response.json())
    .then(data => {
        storeItems = data;
        filteredItems = storeItems;
        renderStoreGrid();
        renderPagination();
    });

function renderStoreGrid() {
    const grid = document.getElementById('store-grid');
    grid.innerHTML = '';
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    const itemsToShow = filteredItems.slice(start, end);

    itemsToShow.forEach((item, idx) => {
        const div = document.createElement('div');
        div.className = 'store-item clickable';
        div.innerHTML = `
            <img src="${item.img}" alt="${item.name}">
            <h4>${item.name}</h4>
            <p><strong>Price:</strong> $${item.price?.toFixed(2) ?? 'N/A'}</p>
        `;
        div.addEventListener('click', () => showItemModal(item));
        grid.appendChild(div);
    });
}

function renderPagination() {
    const pag = document.getElementById('pagination');
    pag.innerHTML = '';
    const pageCount = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
    for (let i = 1; i <= pageCount; i++) {
        const btn = document.createElement('button');
        btn.textContent = i;
        if (i === currentPage) btn.classList.add('active');
        btn.addEventListener('click', () => {
            currentPage = i;
            renderStoreGrid();
            renderPagination();
        });
        pag.appendChild(btn);
    }
}

// Category and subcategory filtering
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.store-nav a[data-category]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelectorAll('.store-nav a').forEach(a => a.classList.remove('active'));
            this.classList.add('active');
            const category = this.getAttribute('data-category');
            const subcategory = this.getAttribute('data-subcategory');
            if (!category) {
                filteredItems = storeItems;
            } else if (subcategory) {
                filteredItems = storeItems.filter(item =>
                    item.category && item.category.toLowerCase() === category.toLowerCase() &&
                    item.subcategory && item.subcategory.toLowerCase() === subcategory.toLowerCase()
                );
            } else {
                filteredItems = storeItems.filter(item =>
                    item.category && item.category.toLowerCase() === category.toLowerCase()
                );
            }
            currentPage = 1;
            renderStoreGrid();
            renderPagination();
        });
    });
});

// Search filter (works within current filteredItems)
document.getElementById('store-search').addEventListener('input', function() {
    const query = this.value.toLowerCase();
    filteredItems = storeItems.filter(item =>
        (item.name && item.name.toLowerCase().includes(query)) ||
        (item.desc && item.desc.toLowerCase().includes(query)) ||
        (item.category && item.category.toLowerCase().includes(query)) ||
        (item.subcategory && item.subcategory.toLowerCase().includes(query)) ||
        (item.keywords && item.keywords.some(kw => kw.toLowerCase().includes(query)))
    );
    currentPage = 1;
    renderStoreGrid();
    renderPagination();
});

function showItemModal(item) {
    document.getElementById('modal-img').src = item.img;
    document.getElementById('modal-img').alt = item.name;
    document.getElementById('modal-name').textContent = item.name;
    document.getElementById('modal-desc').textContent = item.desc;
    document.getElementById('modal-inventory').textContent = item.inventory ?? 'N/A';

    const buyBtn = document.getElementById('modal-buy-btn');
    buyBtn.disabled = item.inventory <= 0;
    buyBtn.textContent = item.inventory > 0 ? 'Buy' : 'Out of Stock';

    // Remove previous event listeners by cloning
    const newBuyBtn = buyBtn.cloneNode(true);
    buyBtn.parentNode.replaceChild(newBuyBtn, buyBtn);

    newBuyBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        if (item.inventory > 0) {
            item.inventory--;
            document.getElementById('modal-inventory').textContent = item.inventory;
            newBuyBtn.disabled = item.inventory <= 0;
            newBuyBtn.textContent = item.inventory > 0 ? 'Buy' : 'Out of Stock';
            renderStoreGrid(); // update grid if needed
        }
    });

    document.getElementById('item-modal').style.display = 'block';
}

// Close modal logic
document.getElementById('modal-close').onclick = function() {
    document.getElementById('item-modal').style.display = 'none';
};
window.onclick = function(event) {
    const modal = document.getElementById('item-modal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
};

document.addEventListener('DOMContentLoaded', function() {
    const params = new URLSearchParams(window.location.search);
    const search = params.get('search');
    if (search) {
        const searchInput = document.getElementById('store-search');
        if (searchInput) {
            searchInput.value = search;
            // Trigger the input event to filter items
            const event = new Event('input', { bubbles: true });
            searchInput.dispatchEvent(event);
        }
    }
});