// ブートストラップ。DOM・音声・ストレージを Game.init に接続する。
(function () {
  const senbeiDisplayElement = document.querySelector("#senbeiDisplay");
  const particlesContainer = document.querySelector("#particles-container");
  const senbeiButton = document.querySelector(".senbei");
  const productsElement = document.querySelector("#products");

  const clickSound = new Audio("./DONOTTOUCH/sounds/せんべい・スナック食べる03.mp3");
  const clickProductSound = new Audio("./DONOTTOUCH/sounds/マウス・シングルクリック02.mp3");

  const state = loadState(window.Game.DEFAULT_PRODUCTS);

  window.Game.init({
    senbei: state.senbei,
    products: state.products,
    particlesContainer: particlesContainer,
    senbeiButton: senbeiButton,
    productsElement: productsElement,
    senbeiDisplayElement: senbeiDisplayElement,
    clickSound: clickSound,
    clickProductSound: clickProductSound,
    onSave: function (senbei, products) {
      saveGameState(senbei, products);
    }
  });

  if (state.shouldSave) {
    saveGameState(state.senbei, state.products);
  }
})();
