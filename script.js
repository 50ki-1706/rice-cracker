// ゲーム本体。製品定義・収益計算・描画・クリック/自動 tick 処理を行い、window.Game を公開する。
// 変数宣言
const DEFAULT_PRODUCTS = [
  { name: "カーソル", basePrice: 4, price: 4, owned: 1 },
  { name: "お手伝い", basePrice: 100, price: 100, owned: 0 },
  { name: "農場", basePrice: 300, price: 300, owned: 0 }
];

const productImages = {
  "カーソル": "DONOTTOUCH/image/cursor.png",
  "お手伝い": "DONOTTOUCH/image/ojisan.png",
  "農場": "DONOTTOUCH/image/factry.png"
};

let senbei;
let products;
let _particlesContainer;
let _senbeiButton;
let _productsElement;
let _senbeiDisplayElement;
let _clickSound;
let _clickProductSound;
let _onSave;
let _lastAutoSave;

// 名前から製品を取得する
function getProductByName(name) {
  const product = products.find((item) => item.name === name);
  return product || null;
}

// 1クリックあたりのせんべい枚数を返す
function getSenbeiPerClick() {
  const cursor = getProductByName("カーソル");
  return cursor ? cursor.owned : 1;
}

// 製品の自動生産速率を計算する
function calcAutoRate(product) {
  if (!product || product.owned === 0) {
    return 0;
  }
  const multiplier = product.name === "農場" ? 8 : 1;
  return product.owned * multiplier * Math.pow(1.1, product.owned);
}

// 全製品の自動生産速率合計を返す
function getTotalAutoRate() {
  const helper = getProductByName("お手伝い");
  const farm = getProductByName("農場");
  return calcAutoRate(helper) + calcAutoRate(farm);
}

// 製品一覧を DOM に描画する
function renderProducts() {
  if (!_productsElement) {
    return;
  }

  _productsElement.innerHTML = products.map((product, index) => {
    const effect = product.name === "カーソル"
      ? `クリックごとに +${product.owned}枚`
      : `毎秒 ${calcAutoRate(product).toFixed(1)}枚`;
    const imageSrc = productImages[product.name] || "";

    return `
      <div class="product-card" data-index="${index}">
        <img class="product-image" src="${imageSrc}" alt="${product.name}">
        <div class="product-info">
          <h2>${product.name}</h2>
          <p>${product.price}枚</p>
          <p>${product.owned}個</p>
          <p class="effect">${effect}</p>
        </div>
      </div>
    `;
  }).join("");
}

// せんべい表示を更新する
function renderSenbeiDisplay() {
  const display = _senbeiDisplayElement;
  if (display) {
    display.textContent = `せんべい: ${Math.floor(senbei)}枚 (+${getTotalAutoRate().toFixed(1)}枚/秒)`;
  }
}

// 製品を購入し、残りのせんべい枚数を返す
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

// クリック時のパーティクルを生成する
function createClickParticle(clientX, clientY) {
  if (!_particlesContainer) return;
  const particle = document.createElement("span");
  particle.className = "particle";
  particle.style.left = clientX + "px";
  particle.style.top = clientY + "px";
  particle.style.setProperty("--dx", (Math.random() - 0.5) * 80 + "px");
  _particlesContainer.appendChild(particle);
  particle.addEventListener("animationend", () => particle.remove(), { once: true });
}

// せんべいクリック時の処理
function onSenbeiClick() {
  senbei += getSenbeiPerClick();
  _onSave(senbei, products);
  renderSenbeiDisplay();
  _clickSound.currentTime = 0;
  _clickSound.play();

  _senbeiButton.classList.remove("clicked");
  void _senbeiButton.offsetWidth;
  _senbeiButton.classList.add("clicked");

  if (_particlesContainer) {
    const rect = _senbeiButton.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    createClickParticle(cx, cy);
  }
}

// 製品カードクリック時の処理
function onProductClick(event) {
  const card = event.target.closest(".product-card");
  if (!card) {
    return;
  }
  _clickProductSound.currentTime = 0;
  _clickProductSound.play();
  const index = Number.parseInt(card.dataset.index, 10);
  const product = products[index];
  if (!product) {
    return;
  }

  const beforeSenbei = senbei;
  senbei = buyProduct(senbei, product);

  if (senbei !== beforeSenbei) {
    _onSave(senbei, products);
    renderProducts();
    renderSenbeiDisplay();
  }
}

// 自動生産 tick（200ms ごとに呼ばれる）
function autoTick() {
  const helper = getProductByName("お手伝い");
  const farm = getProductByName("農場");

  senbei += calcAutoRate(helper) / 5;
  senbei += calcAutoRate(farm) / 5;

  renderSenbeiDisplay();

  const now = Date.now();
  if (now - _lastAutoSave >= 10000) {
    _onSave(senbei, products);
    _lastAutoSave = now;
  }
}

const Game = {
  DEFAULT_PRODUCTS,

  // Game を初期化し、DOM イベントと自動 tick を設定する
  init(config) {
    senbei = config.senbei;
    products = config.products;
    _particlesContainer = config.particlesContainer;
    _senbeiButton = config.senbeiButton;
    _productsElement = config.productsElement;
    _senbeiDisplayElement = config.senbeiDisplayElement;
    _clickSound = config.clickSound;
    _clickProductSound = config.clickProductSound;
    _onSave = config.onSave;
    _lastAutoSave = Date.now();

    if (_senbeiButton) {
      _senbeiButton.addEventListener("click", onSenbeiClick);
    }

    if (_productsElement) {
      _productsElement.addEventListener("click", onProductClick);
    }

    renderProducts();
    renderSenbeiDisplay();
    setInterval(autoTick, 200);
  }
};

window.Game = Game;
