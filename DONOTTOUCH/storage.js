// ゲーム状態の localStorage 保存/読み込みと、マイグレーション・価格再計算
function saveGameState(senbei, productList) {
  try {
    localStorage.setItem(
      "gameState",
      JSON.stringify({
        senbei,
        products: productList.map((product) => ({
          name: product.name,
          owned: product.owned,
          price: product.price
        }))
      })
    );
  } catch (_) {
  }
}

function loadState(defaultProducts) {
  const savedStateText = localStorage.getItem("gameState");
  const oldSenbeiText = localStorage.getItem("senbei");
  let senbei = 0;
  let products = cloneDefaults(defaultProducts);
  let shouldSave = false;

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
            const restoredProduct = cloneDefaults(defaultProduct);

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
          shouldSave = true;
        }
      } else {
        shouldSave = true;
      }
    } catch (_) {
      shouldSave = true;
    }
  } else {
    shouldSave = true;
  }

  if ((!Number.isFinite(senbei) || senbei < 0) && oldSenbeiText !== null) {
    const migratedSenbei = Number(oldSenbeiText);
    senbei = Number.isFinite(migratedSenbei) && migratedSenbei >= 0 ? migratedSenbei : 0;
    shouldSave = true;
  }

  if (!savedStateText && oldSenbeiText === null) {
    senbei = 0;
  }

  return { senbei, products, shouldSave };
}
