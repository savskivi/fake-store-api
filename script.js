const searchInput = document.querySelector(".input-search");
const searchBtn = document.querySelector(".search-button");
const showCartBtn = document.querySelector(".cart-button");
const sortSelect = document.querySelector(".sort");
const productList = document.querySelector(".product-list");
const categoryList = document.querySelector(".filter");
const productTemplate = document.querySelector(".product-template");
const categoryTemplate = document.querySelector(".category-template");
const paginationLeft = document.querySelector('.pagination-left');
const paginationRight = document.querySelector('.pagination-right');
const paginationPage = document.querySelector('.pagination-page');

let activeCategory = "";
let search = '';

const limit = 9;
let skip = 0;
let page = 1;
let total = limit;

const sortTypes = {
    1: {
        sortBy: 'id',
        order: 'asc',
    },

    2: {
        sortBy: 'price',
        order: 'asc',
    },
    
    3: {
        sortBy: 'title',
        order: 'asc',
    },

    4: {
        sortBy: 'rating',
        order: 'desc',
    }
}

let activeSort = sortTypes[1];

fetch("https://dummyjson.com/products/category-list")
  .then((res) => res.json())
  .then((data) => renderCategories(data));

  fetchProducts();

function fetchProducts() {
  let path = "https://dummyjson.com/products";

  if (activeCategory) {
    path += `/category/${activeCategory}`;
  }

  if(search){
    path += `/search?q=${search}`;
  }

  if(search){
    path += '&';
  } else {
    path += '?';
  }
  path += `limit=${limit}&skip=${skip}`;

  if(activeSort) {
    path += `&sortBy=${activeSort.sortBy}&order=${activeSort.order}`;
  }


  fetch(path)
    .then((res) => res.json())
    .then((data) => {
      total = data.total;
      renderProducts(data.products)});
}

function renderCategories(list) {
  list.forEach((item) => {
    const clone = categoryTemplate.content.cloneNode(true);

    const categoryOption = clone.querySelector(".category-option");
    categoryOption.innerHTML = item;
    categoryOption.value = item;

    categoryList.append(clone);
  });

  categoryList.onchange = function () {
    activeCategory = categoryList.value;
    fetchProducts();
  };
}

function renderProducts(list) {
  productList.innerHTML = null;
  list.forEach((item) => {
    const clone = productTemplate.content.cloneNode(true);

    const productImg = clone.querySelector(".product-img");
    const productTitle = clone.querySelector(".product-title");
    const productAbout = clone.querySelector(".product-about");
    const productPrice = clone.querySelector(".product-price");

    productImg.src = item.thumbnail;
    productTitle.innerHTML = item.title;
    productAbout.innerHTML = item.description;
    productPrice.innerHTML = item.price + " $";

    productList.append(clone);
  });
}

sortSelect.onchange = changeSort;

function changeSort(){
  activeSort = sortTypes[sortSelect.value];
  fetchProducts();
}

searchBtn.onclick = changeSearch;

function changeSearch(){
  search = searchInput.value;
  fetchProducts();
}

searchInput.oninput = clearSearch;

function clearSearch(){
  if(searchInput.value == ''){
    search = '';
    fetchProducts();
  }
}

paginationLeft.onclick = prevPage;
paginationRight.onclick = nextPage;

function prevPage(){
  if(skip != 0){
    page--;
    paginationPage.innerHTML = page;
    skip = (page - 1) * limit;
    fetchProducts();
  }
}

function nextPage(){
  if(skip < total - limit){
  page++;
    paginationPage.innerHTML = page;
    skip = (page - 1) * limit;
    fetchProducts();
  }
}