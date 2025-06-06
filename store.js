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
        div.className = 'store-item';
        div.innerHTML = `
            <img src="${item.img}" alt="${item.name}">
            <h4>${item.name}</h4>
            <p>${item.desc}</p>
            <p><strong>Category:</strong> ${item.category ?? 'N/A'}${item.subcategory ? ' &raquo; ' + item.subcategory : ''}</p>
            <p><strong>Price:</strong> $${item.price?.toFixed(2) ?? 'N/A'}</p>
            <p><strong>In Stock:</strong> <span class="inventory-count">${item.inventory ?? 'N/A'}</span></p>
            <button class="buy-btn" ${item.inventory <= 0 ? 'disabled' : ''}>Buy</button>
        `;
        grid.appendChild(div);

        // Buy button logic (demo only)
        const buyBtn = div.querySelector('.buy-btn');
        buyBtn.addEventListener('click', function() {
            if (item.inventory > 0) {
                item.inventory--;
                div.querySelector('.inventory-count').textContent = item.inventory;
                if (item.inventory <= 0) buyBtn.disabled = true;
            }
        });
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