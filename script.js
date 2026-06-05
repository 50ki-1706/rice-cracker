let senbei;
let products;

const DEFAULT_PRODUCTS = [
  { name: "カーソル", basePrice: 4, price: 4, owned: 1 },
  { name: "お手伝い", basePrice: 100, price: 100, owned: 0 },
  { name: "農場", basePrice: 300, price: 300, owned: 0 }
];

function cloneDefaults() {
  return JSON.parse(JSON.stringify(DEFAULT_PRODUCTS));
}

function getProductByName(name) {
  const product = products.find((item) => item.name === name);
  return product || null;
}

function saveGameState() {
  try {
    localStorage.setItem(
      "gameState",
      JSON.stringify({
        senbei,
        products: products.map((product) => ({
          name: product.name,
          owned: product.owned,
          price: product.price
        }))
      })
    );
  } catch (_) {
  }
}

function loadState() {
  const defaultProducts = cloneDefaults();
  const savedStateText = localStorage.getItem("gameState");
  const oldSenbeiText = localStorage.getItem("senbei");
  let shouldMigrate = false;

  senbei = 0;
  products = defaultProducts;

  if (savedStateText) {
    try {
      const savedState = JSON.parse(savedStateText);
      if (savedState && typeof savedState === "object") {
        const restoredSenbei = Number(savedState.senbei);
        if (Number.isFinite(restoredSenbei) && restoredSenbei >= 0) {
          senbei = restoredSenbei;
        }

        if (Array.isArray(savedState.products)) {
          products = defaultProducts.map((defaultProduct) => {
            const savedProduct = savedState.products.find((item) => item && item.name === defaultProduct.name);
            const restoredProduct = JSON.parse(JSON.stringify(defaultProduct));

            if (savedProduct && typeof savedProduct === "object") {
              const owned = Number(savedProduct.owned);
              if (Number.isFinite(owned) && owned >= 0) {
                restoredProduct.owned = owned;
              }
            }

            restoredProduct.price = Math.floor(
              restoredProduct.basePrice * Math.pow(1.15, restoredProduct.owned)
            );

            return restoredProduct;
          });
        } else {
          shouldMigrate = true;
        }
      } else {
        shouldMigrate = true;
      }
    } catch (_) {
      shouldMigrate = true;
    }
  } else {
    shouldMigrate = true;
  }

  if ((!Number.isFinite(senbei) || senbei < 0) && oldSenbeiText !== null) {
    const migratedSenbei = Number(oldSenbeiText);
    senbei = Number.isFinite(migratedSenbei) && migratedSenbei >= 0 ? migratedSenbei : 0;
    shouldMigrate = true;
  }

  if (!savedStateText && oldSenbeiText === null) {
    senbei = 0;
  }

  if (shouldMigrate) {
    saveGameState();
  }
}

function getSenbeiPerClick() {
  const cursor = getProductByName("カーソル");
  return cursor ? cursor.owned : 1;
}

function calcAutoRate(product) {
  if (!product || product.owned === 0) {
    return 0;
  }

  const multiplier = product.name === "農場" ? 8 : 1;
  return product.owned * multiplier * Math.pow(1.1, product.owned);
}

function getTotalAutoRate() {
  const helper = getProductByName("お手伝い");
  const farm = getProductByName("農場");
  return calcAutoRate(helper) + calcAutoRate(farm);
}

function renderProducts() {
  if (!productsElement) {
    return;
  }

  productsElement.innerHTML = products.map((product, index) => {
    const effect = product.name === "カーソル"
      ? `クリックごとに +${product.owned}枚`
      : `毎秒 ${calcAutoRate(product).toFixed(1)}枚`;

    return `
      <div class="product-card" data-index="${index}">
        <h2>${product.name}</h2>
        <p>${product.price}円</p>
        <p>${product.owned}個</p>
        <p class="effect">${effect}</p>
      </div>
    `;
  }).join("");
}

function renderSenbeiDisplay() {
  const display = document.querySelector("#senbeiDisplay");
  if (display) {
    display.textContent = `せんべい: ${Math.floor(senbei)}枚 (+${getTotalAutoRate().toFixed(1)}枚/秒)`;
  }
}

function buyProduct(senbeiAmount, product) {
  const availableSenbei = Math.floor(senbeiAmount);
  const price = product.price;

  if (availableSenbei < price) {
    return senbeiAmount;
  }

  product.owned += 1;
  product.price = Math.floor(product.basePrice * Math.pow(1.15, product.owned));

  return availableSenbei - price;
}

loadState();

const senbeiButton = document.querySelector(".senbei");
const clickSound = new Audio("./DONOTTOUCH/せんべい・スナック食べる03.mp3");
const clickProductSound = new Audio("./DONOTTOUCH/マウス・シングルクリック02.mp3");
const productsElement = document.querySelector("#products");
let lastAutoSave = Date.now();

function autoTick() {
  const helper = getProductByName("お手伝い");
  const farm = getProductByName("農場");

  senbei += calcAutoRate(helper) / 5;
  senbei += calcAutoRate(farm) / 5;

  renderSenbeiDisplay();

  const now = Date.now();
  if (now - lastAutoSave >= 10000) {
    saveGameState();
    lastAutoSave = now;
  }
}

if (senbeiButton) {
  senbeiButton.addEventListener("click", () => {
    senbei += getSenbeiPerClick();
    saveGameState();
    renderSenbeiDisplay();
    clickSound.currentTime = 0;
    clickSound.play();
  });
}

if (productsElement) {
  productsElement.addEventListener("click", (event) => {
    const card = event.target.closest(".product-card");
    if (!card) {
      return;
    }
  clickProductSound.currentTime = 0;
  clickProductSound.play();
    const index = Number.parseInt(card.dataset.index, 10);
    const product = products[index];
    if (!product) {
      return;
    }

    const beforeSenbei = senbei;
    senbei = buyProduct(senbei, product);

    if (senbei !== beforeSenbei) {
      saveGameState();
      renderProducts();
      renderSenbeiDisplay();
    }
  });
}

renderProducts();
renderSenbeiDisplay();
setInterval(autoTick, 200);
