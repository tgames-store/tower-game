class TGames {
    listener = new EventTarget()
    #freezeGame() {
        this.listener.dispatchEvent(new Event("freeze"))
    }
    #unfreezeGame() {
        this.listener.dispatchEvent(new Event("unfreeze"))
    }
    #sendEvent (name, data = {}) {
        let message = {type: name, info: data}
        window.top.postMessage(message, "*")
    }
    #addEventListener (name, handler, useOnce = false) {
        this.listener.addEventListener(name, handler, useOnce)
    }
    async eventHandler (e) {
        if (e.origin != "https://tgames.store") return;
        this.listener.dispatchEvent(new CustomEvent(e.data.type, {detail: e.data.info}))
    }
    async setScore (score) {
        this.#sendEvent("newScore", {score: score})
    }
    async gameStarted () {
        this.#sendEvent("gameStarted")
    }
    async gamePaused () {
        this.#sendEvent("gamePaused")
    }
    async gameResumed () {
        this.#sendEvent("gameResumed")
    }
    async gameOver (score) {
        this.#sendEvent("gameOver", {score: score})
    }
    async showAd () {
        this.#sendEvent("showAd")
    }
    async showRewardedAd (type="default") {
        this.#freezeGame()
        this.#sendEvent("showRewardedAd", {adType: type})
        return new Promise((resolve, reject) => {
            this.#addEventListener("rewardedAd", (info) => {
                this.#unfreezeGame()
                if (info.detail.success) resolve()
                reject()
            }, true)
        })
    }
    async continueGameAd () {
        this.gameResumed()
        return this.showRewardedAd("continue")
    }
    async share () {
        this.#sendEvent("share")
    }
}

var tgames = new TGames()
window.addEventListener('message', tgames.eventHandler.bind(tgames), false)