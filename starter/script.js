// ここから：生徒が触る部分

// ⑤　変数を宣言してみよう！
// まずは、せんべいの枚数と、商品をしようするための変数を宣言してみよう。
// 変数名は、senbei と productList にしよう。
// この下に書いてみよう！


// ⑥　クリックしたら音がなるようにしよう！

// senbei.mp3のパスを入れてみよう。
const CLICK_SOUND_PATH = "ここに入れるよ";
// productClick.mp3のパスを入れてみよう。
const PRODUCT_CLICK_SOUND_PATH = "ここに入れるよ";

// できたら、index.htmlを開いて、せんべいと商品をクリックして音がなるか確認してみよう。

// ⑦　繰り返し処理を作ってみよう！

// 名前から適切なproductを選ぶ関数。
function getProductByName(productList, name) {
  let foundProduct = null;
    // 下のコメントアウトを外して、3回繰り返す処理を書いてみよう！
    // 変数名はiにするよ。

    // if (productList[i].name === name) {
    //   foundProduct = productList[i];
    //   break;
    // }

  return foundProduct;
}

// ⑧　せんべいをクリックしたらせんべいの数が増えるようにしよう！
function getSenbeiPerClick(productList) {
  const cursor = getProductByName(productList, "カーソル");
  // まずは変数resultを宣言してみよう

  // resultにカーソルの数を代入してみよう。カーソルの数はcursor.ownedを使うよ。

  // return result;
}

// ここまでできたら、index.htmlを開いて、せんべいをクリックしてせんべいの数が増えるか確認してみよう。

// ⑨  現在のせんべいの数に、クリックした分のせんべいを追加する処理を書こう！
function onSenbeiClick(senbei, productList) {
  const perClick = getSenbeiPerClick(productList);
  // まずは変数resultを宣言してみよう
  
  // resultに現在のせんべいの数にクリックした分のせんべいを足してみよう。
  // ヒント: result = senbei + perClick;
  
  return result;
}

// ⑩  場合によって、変数の値を増やしてみよう。 
// 1つの商品が自動で増やすせんべいの数を返す関数。
function calcAutoRate(product) {
  let result = 0;
  if (!product || product.owned === 0) {
    return result;
  }
  if (product.name !== "お手伝い" && product.name !== "せんべい工場") {
    return result;
  }
  // resultにproduct.owned * Math.pow(1.1, product.owned)を代入してみよう。

  // もし商品の名前がせんべい工場なら、resultを８倍しよう。
  // 条件分岐と比較演算子を覚えているかな？


  return result;
}

// ⑪  楽に繰り返し処理を書いてみよう

// 全部の商品の自動生産を合計して返す
function getTotalAutoRate(productList) {
  let total = 0;
  // 商品の数だけ繰り返す
  // 下のコメントアウトを外して、その処理を3回繰り返す処理を書いてみよう。
  // 今回は3のところにproductList.lengthと書いてみよう。
  // 変数名はiにするよ。
  
    // total += calcAutoRate(productList[i]);
  
  return total;
}

// ⑫  商品の値段を更新する処理を書いてみよう。

// 商品を1つ買うときの次の値段を計算して返す
function calcNextPrice(product) {
  // 基本価格に1.15の(所有数+1)乗をかける
  const newPrice = product.basePrice * Math.pow(1.15, product.owned + 1);
  let result;
  // 問題: newPriceの小数点を切り捨てて整数にしてresultに代入しよう。
  // ヒント: result = Math.floor(newPrice);

  return result;
}

// ⑬  せんべいを使って商品を買う処理を書こう！
function buyProduct(senbei, product) {
  let availableSenbei;
  // 問題: 変数availableSenbeiに引数senbeiの小数を切り捨てして代入しよう。
  // ヒント: availableSenbei = Math.floor(senbei);
  
  // 商品の値段
  const price = product.price;
  // 買えなかったときの結果
  let result = { senbei: senbei, product, purchased: false };
  // 問題: もし、せんべいの数が商品の値段より少なかったらという条件分岐を作ろう。
  // せんべいの数はavailableSenbei、商品の値段はpriceだよ。
  // 使用する比較演算子はわかるかな？
  // 下のコメントアウトを外して、中の条件を書こう！

  // if (ここに条件を書く) {
  //   return result;
  // }

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

// ここまでできたら、index.htmlを開いて、商品を購入して、せんべいの自動生産ができているか確認してみよう。

function createResetState(defaultProducts) {
  const resetProducts = cloneDefaults(defaultProducts);
  const result = {
    senbei: 0,
    products: resetProducts
  };
  return result;
}

function handleResetClick() {
  const confirmed = window.confirm("本当にリセットしますか？");
  if (!confirmed) {
    return;
  }
  resetGame();
}

// ⑭  リセット機能を作ろう！
// まずはindex.htmlに戻ってリセットボタンを作ってみよう!

const resetButtonElement = document.querySelector("#resetButton");

// ⑭ - 2 リセットボタンがクリックされたら、handleResetClick関数を呼ぶ処理を作ろう！
// resetButtonElement.addEventListener("click", handleResetClick);と書いてみよう！
if (resetButtonElement) {
// ここにクリックイベントの処理を書いてみよう！
}

// ----- ここから下は触らない -----

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
