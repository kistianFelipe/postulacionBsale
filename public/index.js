let divResult = document.querySelector("#resultado");
let loadingResult = document.querySelector("#loading");
let spinner = document.createElement("div");
let loading = document.createElement("div");
let scrollBtn = document.querySelector(".scroll");
let sortBy = document.querySelector("#sortBy");
let filterBy = document.querySelector("#filterBy");
let dataList = [];
let currentProductList = [];
let interval = 0;

loading.className = "d-flex justify-content-center";
spinner.className = "spinner-grow text-info";
spinner.style = "width: 3rem; height: 3rem;";
loading.appendChild(spinner);

/**
 * metodo que envía la información al DOM
 * @param {Array<object>} products - arreglo de productos
 * @example createDOM(productList)
 */
const createDOM = (products) => {
  loading.innerHTML = "";
  if (products.length) {
    products.map((product) => {
      //card structure
      let divCol = document.createElement("div");
      let divCard = document.createElement("div");
      let img = document.createElement("img");
      let span = document.createElement("span");
      let divCardBody = document.createElement("div");
      let h6 = document.createElement("h6");
      let p = document.createElement("p");
      let divCardFooter = document.createElement("div");
      let productBtn = document.createElement("button");
      //card info
      divCol.className = "col mb-4";
      divCard.className = "card h-100 crisCard";
      img.className = "card-img";
      img.src = product.url_image
        ? product.url_image
        : "https://cdn-tp1.mozu.com/21830-33325/resources/images/no-product-image.png?_mzcb=_1597666552734";
      span.className = "badge badge-pill badge-danger";
      span.style = "position: absolute; top: 5em; left: -1em";
      span.innerText = `${product.discount}% OFF`;
      divCardBody.className = "card-body";
      h6.className = "card-title";
      h6.innerHTML = `<strong>${product.name}</strong>`;
      p.className = "card-text";
      p.innerText = `$${product.price}`;
      divCardFooter.className = "card-footer";
      divCardFooter.style = "background-color: white; border: none";
      productBtn.className = "btn btn-primary btn-block";
      productBtn.id = "btnSearch";
      productBtn.innerText = "Agregar";
      //appends
      //childrens
      divCardBody.appendChild(h6);
      divCardBody.appendChild(p);
      divCardFooter.appendChild(productBtn);
      //card
      divCard.appendChild(img);
      if (product.discount > 0) divCard.appendChild(span);
      divCard.appendChild(divCardBody);
      divCard.appendChild(divCardFooter);
      divCol.appendChild(divCard);
      //dom
      divResult.appendChild(divCol);
    });
  } else {
    displayMessage("el filtro utilizado");
  }
};

/**
 * método que ordena una lista de objetos según parámetro ingresado
 * @param {Array<objet>} data - arreglo de productos
 * @param {Number} order - orden
 * @example sortData(dataList,1)
 */
const sortData = (data, order = 1) => {
  if (order == 1) {
    data.sort((a, b) => b.discount - a.discount);
  }
  if (order == 2) {
    data.sort((a, b) => b.price - a.price);
  }
  if (order == 3) {
    data.sort((a, b) => a.price - b.price);
  }
  if (order == 4) {
    data.sort((a, b) => a.name.localeCompare(b.name));
  }
  if (order == 5) {
    data.sort((a, b) => b.name.localeCompare(a.name));
  }
  divResult.innerHTML = "";
  createDOM(data);
};

/**
 * método que filtra información según parámetro ingresado
 * @param {Array<object>} data - arreglo de productos
 * @param {String} filter - filtro
 * @example filterData(dataList,"disc")
 */
const filterData = (data, filter) => {
  let newData = [];
  if (filter != 0) {
    if (filter === "disc") {
      newData = data.filter((a) => a.discount > 0);
    } else {
      newData = data.filter((a) => a.category == filter);
    }
    currentProductList = [...newData];
    divResult.innerHTML = "";
    createDOM(currentProductList);
  } else {
    divResult.innerHTML = "";
    createDOM(dataList);
  }
};

/**
 * método que genera un mensaje cuando la busqueda no devuelve información
 * @param {String} param - nombre del parámetro
 * @example displayMessage("texto")
 */
const displayMessage = (param) => {
  let divMsg = document.createElement("div");
  divMsg.className = "alert alert-warning";
  divMsg.innerHTML = `No se encontraron productos para <strong>${param}</strong>`;
  loading.appendChild(divMsg);
  loadingResult.appendChild(loading);
};

/**
 * método que trae información de los productos y la guarda de forma local
 * @param {String} param - busqueda del usuario
 * @param {Number} value - categoría del producto
 * @example fetchAPI("cat",1)
 */
const fetchAPI = (param, value) => {
  let url = `/products/${param}`;
  if (param.toUpperCase() === "CAT") {
    url = `/productsByCategory/${value}`;
  }
  if (param) {
    loadingResult.appendChild(loading);
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (data.length) {
          dataList = [...data];
          currentProductList = [...data];
          sortData(currentProductList);
        } else {
          displayMessage(param);
        }
      });
  }
};

const scrollStep = () => {
  if (window.pageYOffset === 0) {
    clearInterval(interval);
  }
  window.scroll(0, window.pageYOffset - 50);
};

const scrollToTop = () => {
  interval = setInterval(scrollStep, 16.66);
};

scrollBtn.addEventListener("click", scrollToTop);

const urlParams = new URLSearchParams(window.location.search);

//params searchProduct o cat
urlParams.has("cat")
  ? fetchAPI("cat", urlParams.get("cat"))
  : urlParams.has("searchProduct")
  ? fetchAPI(urlParams.get("searchProduct"))
  : fetchAPI("ALL");

sortBy.addEventListener("change", (e) => {
  sortData(currentProductList, e.target.value);
});

filterBy.addEventListener("change", (e) => {
  filterData(dataList, e.target.value);
});
