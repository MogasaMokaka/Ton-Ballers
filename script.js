// Telegram Web App SDK
const tg = window.Telegram.WebApp;
tg.ready();

// TON Connect SDK
const connector = new window.TonConnectSDK.TonConnect({
    manifestUrl: "https://mogasamokaka.github.io/Ton-Ballers/tonconnect-manifest.json"
});

// DOM Elements
const connectButton = document.getElementById("connectButton");
const disconnectButton = document.getElementById("disconnectButton");
const statusText = document.getElementById("status");

// Connect Wallet
connectButton.addEventListener("click", async () => {
    try {
        connectButton.disabled = true;
        statusText.textContent = "Connecting...";
        
        const wallets = await connector.getWallets();
        const tonkeeper = wallets.find(w => w.name === "Tonkeeper");
        
        if (!tonkeeper) {
            statusText.textContent = "Tonkeeper not found. Install it!";
            connectButton.disabled = false;
            return;
        }

        const connectUrl = connector.connect({
            universalLink: tonkeeper.universalLink,
            bridgeUrl: tonkeeper.bridgeUrl
        });
        tg.openLink(connectUrl);
    } catch (error) {
        statusText.textContent = "Error connecting: " + error.message;
        connectButton.disabled = false;
    }
});

// Disconnect Wallet
disconnectButton.addEventListener("click", () => {
    connector.disconnect();
    statusText.textContent = "Not connected";
    connectButton.style.display = "block";
    disconnectButton.style.display = "none";
});

// Status Change Handler
connector.onStatusChange(wallet => {
    if (wallet) {
        statusText.textContent = `Connected: ${wallet.account.address}`;
        connectButton.style.display = "none";
        disconnectButton.style.display = "block";
    } else {
        statusText.textContent = "Not connected";
        connectButton.style.display = "block";
        disconnectButton.style.display = "none";
    }
    connectButton.disabled = false;
});

// Example: Send a Transaction (Uncomment to use)
async function sendSampleTransaction() {
    if (!connector.connected) {
        statusText.textContent = "Please connect your wallet first!";
        return;
    }
    try {
        const transaction = {
            messages: [{
                address: "EQ...recipient-address", // Replace with a valid TON address
                amount: "1000000000" // 1 TON in nanotons
            }],
            validUntil: Math.floor(Date.now() / 1000) + 60 // Valid for 60 seconds
        };
        const result = await connector.sendTransaction(transaction);
        statusText.textContent = "Transaction sent: " + result.boc;
    } catch (error) {
        statusText.textContent = "Transaction failed: " + error.message;
    }
}