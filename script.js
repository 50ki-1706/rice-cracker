// ここから：生徒が触る部分

// ⑤　変数を宣言してみよう！
// せんべいの枚数を保存する変数senbeiと商品の状態を管理する変数productListを宣言しよう！
// 変数senbeiには1や20,0.5のような整数と小数が入るよ。
// 変数productListには{name:"商品の名前",owned:持っている商品の数,price:現在の商品の値段}、この要素が商品の数分配列で保存されるよ。
// この下に書いてみよう！
let senbei;
let productList;

// ⑥　定数に値を代入してみよう！
// 定数は一度代入したら、再代入ができない定数だよ。
// 今回は、文字で、音声ファイルが置かれている場所を代入するよ。
// この下に書いてみよう！

// せんべいをクリックした時の音。
const CLICK_SOUND_PATH = "./sounds/senbei.mp3";
// 商品をクリックした時の音。
const PRODUCT_CLICK_SOUND_PATH = "./sounds/mouse.mp3";

// ⑦　繰り返し処理を作ってみよう！
// 指定した処理を3回繰り返す処理を作ってみよう。
// 変数名は i を使用するよ。
function getProductByName(productList, name) {
  // 見つかった商品を入れる変数。最初は「見つからない」を表すnull
  let foundProduct = null;
  // リストを1つずつ調べる
  for (let i = 0; i < 3; i++) {
    if (productList[i].name === name) {
      foundProduct = productList[i];
      break;
    }
  }
  return foundProduct;
}

// 1回のクリックで増えるせんべいの枚数を返してみよう！
// カーソルの数だけ、せんべいが増えるように、resultの結果を変えてみよう。
// カーソルの数はcursor.ownedで取得できるよ。
function getSenbeiPerClick(productList) {
  // カーソルという商品を探す
  const cursor = getProductByName(productList, "カーソル");
  // 返す枚数。カーソルがないときは1枚
  let result = 1;
  if (cursor !== null) {
    result = cursor.owned;
  }
  return result;
}

// 現在のせんべいの数に、クリックした分のせんべいを追加する処理を書こう！
function onSenbeiClick(senbei, productList) {
  const perClick = getSenbeiPerClick(productList);
  const result = senbei + perClick;
  return result;
}

// 1つの商品が自動で増やすせんべいの数を返す処理。
// 変数resultの値を更新しよう！
function calcAutoRate(product) {
  // 自動生産しないときは0を返す
  let result = 0;
  if (!product || product.owned === 0) {
    return result;
  }
  if (product.name !== "お手伝い" && product.name !== "せんべい工場") {
    return result;
  }
  // 所有数に1.1の所有数乗をかける
  result = product.owned * Math.pow(1.1, product.owned);
  // せんべい工場の場合は8倍する
  if (product.name === "せんべい工場") {
    result = result * 8;
  }
  return result;
}

// 全部の商品の自動生産を合計して返す
// 3回特定の処理をするプログラムを記述しよう！
function getTotalAutoRate(productList) {
  let total = 0;
  // 商品の数だけ繰り返す
  for (let i = 0; i < productList.length; i++) {
    total += calcAutoRate(productList[i]);
  }
  return total;
}

// 商品を1つ買うときの次の値段を計算して返す
// 変数resultを完成させよう！
function calcNextPrice(product) {
  // 基本価格に1.15の(所有数+1)乗をかける
  const multiplied = product.basePrice * Math.pow(1.15, product.owned + 1);
  // Math.floorは小数点以下を切り捨てて整数にする関数だよ
  const result = Math.floor(multiplied);
  return result;
}

// せんべいを使って商品を買う
function buyProduct(senbei, product) {
  // 所持しているせんべいの枚数（小数点以下は切り捨て）
  const availableSenbei = Math.floor(senbei);
  // 商品の値段
  const price = product.price;
  // 買えなかったときの結果
  let result = { senbei: senbei, product, purchased: false };
  //　せんべいの数が買う商品の値段より少ない場合の処理を書こう！
  if (availableSenbei < price) {
    return result;
  }

  // 買ったあとの商品データ
  const nextProduct = {
    ...product,
    owned: product.owned + 1,
    price: calcNextPrice(product)
  };
  // 買えたときの結果
  result = {
    senbei: availableSenbei - price,
    product: nextProduct,
    purchased: true
  };
  return result;
}

// ゲームをリセットしたときの初期状態を作る
function createResetState(defaultProducts) {
  // 商品データを初期状態に戻す（deep copy）
  const resetProducts = cloneDefaults(defaultProducts);
  // せんべいと商品を初期状態にした結果
  const result = {
    senbei: 0,
    products: resetProducts
  };
  return result;
}

// リセットボタンが押されたときに最初に動く処理
function handleResetClick() {
  // 本当にリセットしてもいいか確認する
  const confirmed = window.confirm("本当にリセットしますか？");
  if (!confirmed) {
    // キャンセルされたら何もしないで終わる
    return;
  }

  // 難しいリセットの処理は隠された resetGame() に任せる
  resetGame();
}

// HTML の id="resetButton" と同じ名前を使って、リセットボタンの要素を探す
const resetButtonElement = document.querySelector("#resetButton");

// リセットボタンが見つかったら、クリックしたときに handleResetClick を動かす
if (resetButtonElement) {
  resetButtonElement.addEventListener("click", handleResetClick);
}

// ここから下は触らない

// 自動生産のタイマーや保存、画面表示をつなげる処理

// 自動保存の時間が来たかどうかを調べて返す
function shouldAutoSave(now) {
  // 前回保存してから経過した時間（ミリ秒）
  const elapsed = now - _lastAutoSave;
  // 10秒以上経っていればtrue、そうでなければfalse
  const result = elapsed >= 10000;
  return result;
}

// 自動保存をして、最後に保存した時間を更新する
function saveAutoProgress(now) {
  _onSave(senbei, productList);
  _lastAutoSave = now;
}

// 自動生産の処理（200msごとに呼ばれる）
function autoTick() {
  // 1秒に5回呼ばれるから、1秒分の生産量を5で割る
  senbei += getTotalAutoRate(productList) / 5;
  renderSenbeiDisplay();

  const now = Date.now();
  if (shouldAutoSave(now)) {
    saveAutoProgress(now);
  }
}

// パーティクルを表示するための要素
let _particlesContainer;
// せんべい画像の要素
let _senbeiButton;
// 商品一覧を表示する要素
let _productsElement;
// せんべい表示用の要素（今は直接使っていない。互換性のために残している）
let _senbeiDisplayElement;
// せんべい枚数を表示する要素
let _senbeiCountElement;
// 自動生産量を表示する要素
let _senbeiRateElement;
// せんべいクリック音
let _clickSound;
// 商品クリック音
let _clickProductSound;
// 保存するときに使う関数
let _onSave;
// 前回自動保存した時間
let _lastAutoSave;

// DOM要素を探すためのセレクター名
const SENBEI_DISPLAY_SELECTOR = "#senbeiDisplay";
const SENBEI_COUNT_SELECTOR = "#senbeiCount";
const SENBEI_RATE_SELECTOR = "#senbeiRate";
const PARTICLES_CONTAINER_SELECTOR = "#particles-container";
const SENBEI_BUTTON_SELECTOR = ".senbei";
const PRODUCTS_SELECTOR = "#products";

// 商品名と画像ファイル名の対応表
const productImages = {
  "カーソル": "DONOTTOUCH/image/cursor.png",
  "お手伝い": "DONOTTOUCH/image/ojisan.png",
  "せんべい工場": "DONOTTOUCH/image/factory.png"
};

// クリックを計算に繋げて画面を動かす
function handleSenbeiClick() {
  senbei = onSenbeiClick(senbei, productList);
  finishSenbeiClick();
}

// クリック後の残りの処理をまとめて行う
function finishSenbeiClick() {
  _onSave(senbei, productList);
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

// ゲームをリセットする難しい処理（localStorage や画面更新を隠す）
function resetGame() {
  // 初期状態を作る
  const resetState = createResetState(window.Game.DEFAULT_PRODUCTS);
  // せんべいの枚数を初期化する
  senbei = resetState.senbei;
  // 商品データを初期化する
  productList = resetState.products;

  // 保存されているデータを消す
  localStorage.removeItem("gameState");
  localStorage.removeItem("senbei");

  // 初期状態を保存する
  _onSave(senbei, productList);
  // 最後に保存した時間を今にする
  _lastAutoSave = Date.now();

  // 画面を更新する
  renderProducts();
  renderSenbeiDisplay();
}

// クリックした場所にパーティクルを作る
function createClickParticle(clientX, clientY) {
  if (!_particlesContainer) return;
  const particle = document.createElement("span");
  particle.className = "particle";
  particle.style.left = clientX + "px";
  particle.style.top = clientY + "px";
  particle.style.setProperty("--dx", (Math.random() - 0.5) * 80 + "px");
  _particlesContainer.appendChild(particle);
  particle.addEventListener("animationend", () => {
    particle.remove();
  }, { once: true });
}

// 商品一覧を画面に描画する
function renderProducts() {
  if (!_productsElement) {
    return;
  }

  const productCards = productList.map((product, index) => {
    // 商品の効果説明文
    const effect =
      product.name === "カーソル"
        ? `クリックごとに +${product.owned}枚`
        : `毎秒 ${calcAutoRate(product).toFixed(1)}枚`;
    // 商品の画像ファイル名
    const imageSrc = productImages[product.name] || "";
    // 商品カードのHTML
    const cardHtml = `
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
    return cardHtml;
  });

  _productsElement.innerHTML = productCards.join("");
}

// せんべいの枚数と自動生産量を画面に表示する
function renderSenbeiDisplay() {
  if (_senbeiCountElement) {
    _senbeiCountElement.textContent = Math.floor(senbei);
  }
  if (_senbeiRateElement) {
    _senbeiRateElement.textContent = getTotalAutoRate(productList).toFixed(1);
  }
}

// 商品カードがクリックされたときの処理
function onProductClick(event) {
  const card = event.target.closest(".product-card");
  if (!card) {
    return;
  }
  _clickProductSound.currentTime = 0;
  _clickProductSound.play();

  const index = Number.parseInt(card.dataset.index, 10);
  const product = productList[index];
  if (!product) {
    return;
  }

  const result = buyProduct(senbei, product);

  if (result.purchased) {
    senbei = result.senbei;
    productList[index] = result.product;
    _onSave(senbei, productList);
    renderProducts();
    renderSenbeiDisplay();
  }
}

// ゲーム開始時の商品データ
const DEFAULT_PRODUCTS = [
  { name: "カーソル", basePrice: 4, price: 4, owned: 1 },
  { name: "お手伝い", basePrice: 100, price: 100, owned: 0 },
  { name: "せんべい工場", basePrice: 300, price: 300, owned: 0 }
];

const Game = {
  DEFAULT_PRODUCTS,

  // Gameを初期化して、DOMイベントと自動tickを設定する
  init(config) {
    senbei = config.senbei;
    productList = config.products;
    _particlesContainer = config.particlesContainer;
    _senbeiButton = config.senbeiButton;
    _productsElement = config.productsElement;
    _senbeiDisplayElement = config.senbeiDisplayElement;
    _senbeiCountElement = config.senbeiCountElement;
    _senbeiRateElement = config.senbeiRateElement;
    _clickSound = config.clickSound;
    _clickProductSound = config.clickProductSound;
    _onSave = config.onSave;
    _lastAutoSave = Date.now();

    if (_senbeiButton) {
      _senbeiButton.addEventListener("click", handleSenbeiClick);
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

// ゲームを起動するための処理。DOM・音声・保存データをつなぐ
(function () {
  const senbeiDisplayElement = document.querySelector(SENBEI_DISPLAY_SELECTOR);
  const senbeiCountElement = document.querySelector(SENBEI_COUNT_SELECTOR);
  const senbeiRateElement = document.querySelector(SENBEI_RATE_SELECTOR);
  const particlesContainer = document.querySelector(PARTICLES_CONTAINER_SELECTOR);
  const senbeiButton = document.querySelector(SENBEI_BUTTON_SELECTOR);
  const productsElement = document.querySelector(PRODUCTS_SELECTOR);

  const clickSound = new Audio(CLICK_SOUND_PATH);
  const clickProductSound = new Audio(PRODUCT_CLICK_SOUND_PATH);

  const state = loadState(window.Game.DEFAULT_PRODUCTS);

  window.Game.init({
    senbei: state.senbei,
    products: state.products,
    particlesContainer: particlesContainer,
    senbeiButton: senbeiButton,
    productsElement: productsElement,
    senbeiDisplayElement: senbeiDisplayElement,
    senbeiCountElement: senbeiCountElement,
    senbeiRateElement: senbeiRateElement,
    clickSound: clickSound,
    clickProductSound: clickProductSound,
    onSave: function (senbei, productList) {
      saveGameState(senbei, productList);
    }
  });

  if (state.shouldSave) {
    saveGameState(state.senbei, state.products);
  }
})();
