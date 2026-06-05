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

// Canvasで煎餅を描画
const senbeiCanvas = document.querySelector(".senbei");
if (senbeiCanvas instanceof HTMLCanvasElement) {
  drawSenbei(senbeiCanvas);
}

const particlesContainer = document.querySelector("#particles-container");

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

    // アニメーション再発火（連打対応: 強制リフロー方式）
    senbeiButton.classList.remove("clicked");
    void senbeiButton.offsetWidth;
    senbeiButton.classList.add("clicked");

    // パーティクル生成
    if (particlesContainer) {
      const rect = senbeiButton.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      createClickParticle(cx, cy);
    }
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

// Intent: クリック演出用パーティクル。CSSアニメーション完了時にDOMから自動削除しメモリリークを防止する。
function createClickParticle(clientX, clientY) {
  if (!particlesContainer) return;
  const particle = document.createElement("span");
  particle.className = "particle";
  particle.style.left = clientX + "px";
  particle.style.top = clientY + "px";
  particle.style.setProperty("--dx", (Math.random() - 0.5) * 80 + "px");
  particlesContainer.appendChild(particle);
  particle.addEventListener("animationend", () => particle.remove(), { once: true });
}

// Intent: Canvas APIでリアルな煎餅を描画。CSSでは表現できない表面テクスチャ・ゴマ・醤油の照り・不規則な輪郭を実現する。
function drawSenbei(canvas) {
  const dpr = window.devicePixelRatio || 1;
  const size = 400 * dpr;
  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext("2d");
  ctx.scale(dpr, dpr);

  const cx = 200;
  const cy = 200;
  const baseR = 170;

  ctx.clearRect(0, 0, 400, 400);

  // --- 1. 不規則な輪郭を clip ---
  ctx.save();
  ctx.beginPath();
  for (let a = 0; a < Math.PI * 2; a += 0.03) {
    const r = baseR + Math.sin(a * 7) * 4 + Math.sin(a * 13) * 3 + Math.sin(a * 21) * 2;
    const x = cx + Math.cos(a) * r;
    const y = cy + Math.sin(a) * r;
    if (a === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.clip();

  // --- 2. ベースの焼き色 ---
  const grad = ctx.createRadialGradient(cx - 20, cy - 30, 20, cx, cy, baseR + 10);
  grad.addColorStop(0, "#F0D89A");
  grad.addColorStop(0.35, "#E8C98B");
  grad.addColorStop(0.65, "#D4A85C");
  grad.addColorStop(0.85, "#C08040");
  grad.addColorStop(1, "#A06828");
  ctx.fillStyle = grad;
  ctx.fillRect(cx - baseR - 20, cy - baseR - 20, (baseR + 20) * 2, (baseR + 20) * 2);

  // --- 3. 表面テクスチャ ---
  const textureCanvas = document.createElement("canvas");
  textureCanvas.width = 400;
  textureCanvas.height = 400;
  const tCtx = textureCanvas.getContext("2d");
  tCtx.fillStyle = "rgba(160, 100, 40, 0.04)";
  for (let i = 0; i < 600; i++) {
    const tx = Math.random() * 400;
    const ty = Math.random() * 400;
    tCtx.beginPath();
    tCtx.arc(tx, ty, Math.random() * 2.5 + 0.5, 0, Math.PI * 2);
    tCtx.fill();
  }
  // 焼き網の跡
  tCtx.strokeStyle = "rgba(140, 80, 20, 0.03)";
  tCtx.lineWidth = 1;
  for (let x = 30; x < 370; x += 18) {
    tCtx.beginPath();
    tCtx.moveTo(x, 10);
    tCtx.lineTo(x, 390);
    tCtx.stroke();
  }
  ctx.drawImage(textureCanvas, 0, 0);

  // --- 4. 醤油の照り斑 ---
  ctx.save();
  for (let i = 0; i < 3; i++) {
    const sx = cx + (Math.random() - 0.5) * 180;
    const sy = cy + (Math.random() - 0.5) * 180;
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.bezierCurveTo(
      sx + (Math.random() - 0.5) * 60, sy + (Math.random() - 0.5) * 50,
      sx + (Math.random() - 0.5) * 60, sy + (Math.random() - 0.5) * 50,
      sx + (Math.random() - 0.5) * 30, sy + (Math.random() - 0.5) * 30
    );
    ctx.bezierCurveTo(
      sx + (Math.random() - 0.5) * 60, sy + (Math.random() - 0.5) * 50,
      sx + (Math.random() - 0.5) * 40, sy + (Math.random() - 0.5) * 40,
      sx, sy
    );
    ctx.fillStyle = "rgba(70, 30, 8, 0.25)";
    ctx.fill();
  }
  ctx.restore();

  // --- 5. 醤油のハイライト ---
  ctx.save();
  ctx.fillStyle = "rgba(255, 255, 240, 0.12)";
  ctx.beginPath();
  ctx.ellipse(cx + 40, cy - 60, 50, 18, -0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(cx - 50, cy + 30, 35, 12, 0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // --- 6. ひび割れ ---
  ctx.save();
  ctx.strokeStyle = "rgba(100, 50, 15, 0.25)";
  ctx.lineWidth = 1.2;
  for (let i = 0; i < 4; i++) {
    const startX = cx + (Math.random() - 0.5) * 200;
    const startY = cy + (Math.random() - 0.5) * 200;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    let px = startX;
    let py = startY;
    const segments = 2 + Math.floor(Math.random() * 3);
    for (let j = 0; j < segments; j++) {
      px += (Math.random() - 0.5) * 40;
      py += (Math.random() - 0.5) * 30;
      ctx.lineTo(px, py);
    }
    ctx.stroke();
  }
  ctx.restore();

  // --- 7. ゴマ ---
  ctx.save();
  for (let i = 0; i < 7; i++) {
    const sx = cx + (Math.random() - 0.5) * 260;
    const sy = cy + (Math.random() - 0.5) * 260;
    const angle = Math.random() * Math.PI;
    ctx.save();
    ctx.translate(sx, sy);
    ctx.rotate(angle);
    // 影
    ctx.fillStyle = "rgba(120, 80, 40, 0.3)";
    ctx.beginPath();
    ctx.ellipse(1, 1, 5, 2.5, 0, 0, Math.PI * 2);
    ctx.fill();
    // ゴマ本体
    ctx.fillStyle = "#F8F0E0";
    ctx.beginPath();
    ctx.ellipse(0, 0, 5, 2.5, 0, 0, Math.PI * 2);
    ctx.fill();
    // ゴマの先端
    ctx.fillStyle = "rgba(40, 20, 5, 0.5)";
    ctx.beginPath();
    ctx.arc(3.5, 0, 1.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  ctx.restore();

  // --- 8. 縁の焦げ ---
  ctx.save();
  ctx.strokeStyle = "rgba(80, 30, 5, 0.4)";
  ctx.lineWidth = 6;
  ctx.beginPath();
  for (let a = 0; a < Math.PI * 2; a += 0.03) {
    const r = baseR + Math.sin(a * 7) * 4 + Math.sin(a * 13) * 3 + Math.sin(a * 21) * 2;
    const x = cx + Math.cos(a) * r;
    const y = cy + Math.sin(a) * r;
    if (a === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.stroke();
  ctx.restore();

  ctx.restore(); // clip を解除
}
