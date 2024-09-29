let web3;
let contract;

const contractAddress = '0x735ee5Fe3F9556fb8450950c3abBebE003958065'; 
const contractABI = [
    {
        "inputs": [
            { "internalType": "address", "name": "tokenA", "type": "address" },
            { "internalType": "address", "name": "tokenB", "type": "address" },
            { "internalType": "uint256", "name": "amountADesired", "type": "uint256" },
            { "internalType": "uint256", "name": "amountBDesired", "type": "uint256" }
        ],
        "name": "addLiquidity",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "createExclusivePool",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "uint256", "name": "volume", "type": "uint256" }
        ],
        "name": "registerTrade",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "minTradeCount",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "minVolume",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "pancakeRouterAddress",
        "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "address", "name": "", "type": "address" }
        ],
        "name": "users",
        "outputs": [
            { "internalType": "uint256", "name": "tradeCount", "type": "uint256" },
            { "internalType": "uint256", "name": "totalVolume", "type": "uint256" },
            { "internalType": "bool", "name": "eligible", "type": "bool" }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

async function connectWallet() {
    if (typeof window.ethereum !== 'undefined') {
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            web3 = new Web3(window.ethereum);
            contract = new web3.eth.Contract(contractABI, contractAddress);
            document.getElementById('status').innerText = 'Wallet connected: ' + accounts[0];
        } catch (error) {
            console.error("User denied account access:", error);
            document.getElementById('status').innerText = 'Failed to connect wallet';
        }
    } else {
        alert('Please install MetaMask!');
    }
}

document.getElementById('connectButton').onclick = connectWallet;

async function registerTrade(volume) {
    const accounts = await web3.eth.getAccounts();
    await contract.methods.registerTrade(volume).send({ from: accounts[0] });
}

document.getElementById('registerTradeButton').onclick = () => {
    const volume = prompt("Enter trade volume in Wei:"); // Convert BNB to Wei
    registerTrade(volume);
};

async function createExclusivePool() {
    const accounts = await web3.eth.getAccounts();
    try {
        await contract.methods.createExclusivePool().send({ from: accounts[0] });
        alert("Exclusive pool created successfully!");
    } catch (error) {
        console.error("Error creating exclusive pool:", error);
        alert("Failed to create exclusive pool. Check the console for details.");
    }
}

document.getElementById('createPoolButton').onclick = createExclusivePool;

async function addLiquidity(tokenA, tokenB, amountA, amountB) {
    const accounts = await web3.eth.getAccounts();
    await contract.methods.addLiquidity(tokenA, tokenB, amountA, amountB).send({ from: accounts[0] });
}

document.getElementById('addLiquidityButton').onclick = async () => {
    const tokenA = prompt("Enter the address of Token A:");
    const tokenB = prompt("Enter the address of Token B:");
    const amountA = prompt("Enter amount of Token A:");
    const amountB = prompt("Enter amount of Token B:");
    await addLiquidity(tokenA, tokenB, amountA, amountB);
};

// Tab switching function
function showTab(tabName) {
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => {
        tab.style.display = 'none'; // Hide all tabs
    });
    document.getElementById(tabName).style.display = 'block'; // Show the selected tab

    // Update the active class for the navbar
    const links = document.querySelectorAll('.navbar a');
    links.forEach(link => {
        link.classList.remove('active'); // Remove active class from all links
    });
    document.querySelector(`.navbar a[href="#${tabName}"]`).classList.add('active'); // Add active class to the selected link
}

// Initially show the home tab
showTab('home');


document.getElementById('registerTradeButton').onclick = () => {
    document.getElementById('registerTradeInputs').style.display = 'block';
    document.getElementById('addLiquidityInputs').style.display = 'none'; // Hide liquidity inputs
};

document.getElementById('addLiquidityButton').onclick = () => {
    document.getElementById('addLiquidityInputs').style.display = 'block';
    document.getElementById('registerTradeInputs').style.display = 'none'; // Hide trade inputs
};

// Handle trade submission
document.getElementById('submitTradeButton').onclick = async () => {
    const volume = document.getElementById('tradeVolume').value;
    if (volume) {
        await registerTrade(volume);
        document.getElementById('tradeVolume').value = ''; // Clear input
        document.getElementById('registerTradeInputs').style.display = 'none'; // Hide inputs after submission
    } else {
        alert("Please enter a valid trade volume.");
    }
};

// Handle liquidity submission
document.getElementById('submitLiquidityButton').onclick = async () => {
    const tokenA = document.getElementById('tokenA').value;
    const tokenB = document.getElementById('tokenB').value;
    const amountA = document.getElementById('amountA').value;
    const amountB = document.getElementById('amountB').value;

    if (tokenA && tokenB && amountA && amountB) {
        await addLiquidity(tokenA, tokenB, amountA, amountB);
        document.getElementById('tokenA').value = ''; // Clear inputs
        document.getElementById('tokenB').value = '';
        document.getElementById('amountA').value = '';
        document.getElementById('amountB').value = '';
        document.getElementById('addLiquidityInputs').style.display = 'none'; // Hide inputs after submission
    } else {
        alert("Please fill in all fields.");
    }
};
