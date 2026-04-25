let rice = 0;
let ricePerClick = 1;
let autoClickers10 = 0; // +1 every 10 seconds
let autoClickers1 = 0;  // +1 every 1 second
let autoClickers10ps = 0; // +10 every 1 second
let autoClickers50ps = 0; // +50 every 1 second
let autoClickers100ps = 0; // +100 every 1 second
let autoClickers750ps = 0; // +750 every 1 second
let secondCounter = 0;
let multiplierPurchases = 0;
const multiplierCosts = [100, 500, 2500, 7000, 10000, 25000, 65000, 150000, 500000, 1500000, 5000000, 25000000, 65000000, 150000000, 500000000, 1000000000, 2500000000, 65000000000, 150000000000, 500000000000, 1000000000000];
let button1Unlocked = false;
let button2Unlocked = false;
let button3Unlocked = false;
let button4Unlocked = false;
let button5Unlocked = false;
let button6Unlocked = false;
let multiplierUnlocked = false;
let miniImgTimeouts = [];
let isCollected = [false, false, false, false, false]; // Track if each mini-image has been collected

const clickableImg = document.getElementById('clickableImg');
const scoreDisplay = document.getElementById('scoreDisplay');
const upgradeButton = document.getElementById('upgradeButton');
const upgradeButton2 = document.getElementById('upgradeButton2');
const upgradeButton3 = document.getElementById('upgradeButton3');
const upgradeButton4 = document.getElementById('upgradeButton4');
const upgradeButton5 = document.getElementById('upgradeButton5');
const upgradeButton6 = document.getElementById('upgradeButton6');
const multiplierButton = document.getElementById('multiplierButton');
const miniImgs = [
  document.getElementById('miniImg1'),
  document.getElementById('miniImg2'),
  document.getElementById('miniImg3'),
  document.getElementById('miniImg4'),
  document.getElementById('miniImg5'),
];
const miniTexts = [
  document.getElementById('miniText1'),
  document.getElementById('miniText2'),
  document.getElementById('miniText3'),
  document.getElementById('miniText4'),
  document.getElementById('miniText5'),
];
const miniTooltips = [
  document.getElementById('miniTooltip1'),
  document.getElementById('miniTooltip2'),
  document.getElementById('miniTooltip3'),
  document.getElementById('miniTooltip4'),
  document.getElementById('miniTooltip5'),
];
const rarityLevels = [
  { name: 'Common', reward: 50, ringClass: '' },
  { name: 'Rare', reward: 250, ringClass: 'gold' },
  { name: 'Very Rare', reward: 1000, ringClass: 'red' },
  { name: 'Super Rare', reward: 50000, ringClass: 'blue' },
  { name: 'Super Uber Rare', reward: 1000000, ringClass: 'white' }
];

// Function to get a random rarity level based on percentages
function getRandomRarity() {
  const rand = Math.random() * 100;
  if (rand < 50) return 0; // Common - 50%
  if (rand < 75) return 1; // Rare - 25%
  if (rand < 90) return 2; // Very Rare - 15%
  if (rand < 99) return 3; // Super Rare - 9%
  return 4; // Super Uber Rare - 1%
}

clickableImg.addEventListener('click', function() {
  rice += ricePerClick;
  updateScoreDisplay();
  checkUpgradeButtons();
});

upgradeButton.addEventListener('click', function() {
  if (rice >= 100) {
    rice -= 100;
    autoClickers10 += 1;
    updateScoreDisplay();
    checkUpgradeButtons();
  }
});

upgradeButton2.addEventListener('click', function() {
  if (rice >= 750) {
    rice -= 750;
    autoClickers1 += 1;
    updateScoreDisplay();
    checkUpgradeButtons();
  }
});

upgradeButton3.addEventListener('click', function() {
  if (rice >= 1500) {
    rice -= 1500;
    autoClickers10ps += 1;
    updateScoreDisplay();
    checkUpgradeButtons();
  }
});

upgradeButton4.addEventListener('click', function() {
  if (rice >= 5000) {
    rice -= 5000;
    autoClickers50ps += 1;
    updateScoreDisplay();
    checkUpgradeButtons();
  }
});

upgradeButton5.addEventListener('click', function() {
  if (rice >= 10000) {
    rice -= 10000;
    autoClickers100ps += 1;
    updateScoreDisplay();
    checkUpgradeButtons();
  }
});

multiplierButton.addEventListener('click', function() {
  if (multiplierPurchases < multiplierCosts.length) {
    const cost = multiplierCosts[multiplierPurchases];
    if (rice >= cost) {
      rice -= cost;
      multiplierPurchases += 1;
      ricePerClick = Math.pow(2, multiplierPurchases);
      updateScoreDisplay();
      checkUpgradeButtons();
    }
  }
});

upgradeButton6.addEventListener('click', function() {
  if (rice >= 50000) {
    rice -= 50000;
    autoClickers750ps += 1;
    updateScoreDisplay();
    checkUpgradeButtons();
  }
});

miniImgs.forEach((miniImg, index) => {
  miniImg.addEventListener('mouseenter', function() {
    // Only show tooltip if the image is currently spawned (not at the bottom resting position)
    if (miniImg.style.bottom !== '10px' && miniImg.style.display !== 'none') {
      const rarityIndex = parseInt(miniImg.dataset.rarityIndex);
      miniTooltips[index].textContent = rarityLevels[rarityIndex].name;
      const rect = miniImg.getBoundingClientRect();
      miniTooltips[index].style.left = rect.left + 'px';
      miniTooltips[index].style.top = (rect.top - 35) + 'px';
      miniTooltips[index].style.display = 'block';
    }
  });
  
  miniImg.addEventListener('mouseleave', function() {
    miniTooltips[index].style.display = 'none';
  });

  miniImg.addEventListener('click', function() {
    // Only clickable if spawned (not at bottom) and not gray (collected)
    if (miniImg.style.bottom !== '10px' && miniImg.style.filter !== 'grayscale(100%)') {
      clearTimeout(miniImgTimeouts[index]);
      const reward = parseInt(miniImg.dataset.reward);
      const finalReward = rice >= 1000000 ? reward * 1000000 : reward;
      rice += finalReward;
      updateScoreDisplay();
      checkUpgradeButtons();
      miniImg.style.display = 'none';
      miniTexts[index].style.display = 'none';
      miniTooltips[index].style.display = 'none';
      
      // Mark as collected
      isCollected[index] = true;
      const rarityIndex = parseInt(miniImg.dataset.rarityIndex);
      miniImg.className = rarityLevels[rarityIndex].ringClass;
      miniImg.style.filter = 'none';
      miniImg.style.left = `${10 + index * 160}px`;
      miniImg.style.top = 'auto';
      miniImg.style.bottom = '10px';
      
      // Schedule next spawn
      scheduleNextMiniImg(index);
    }
  });
});

function updateScoreDisplay() {
  scoreDisplay.textContent = 'rice: ' + rice;
}

function checkUpgradeButtons() {
  // Button 1
  if (rice >= 100) {
    button1Unlocked = true;
  }
  if (button1Unlocked) {
    upgradeButton.style.display = 'block';
    upgradeButton.textContent = `Buy Auto-Clicker (+1/10s) (100 score) - Owned: ${autoClickers10}`;
    upgradeButton.className = rice >= 100 ? 'enabled' : 'disabled';
  }

  // Button 2
  if (rice >= 750) {
    button2Unlocked = true;
  }
  if (button2Unlocked) {
    upgradeButton2.style.display = 'block';
    upgradeButton2.textContent = `Buy Fast Auto-Clicker (+1/s) (750 score) - Owned: ${autoClickers1}`;
    upgradeButton2.className = rice >= 750 ? 'enabled' : 'disabled';
  }

  // Button 3
  if (rice >= 1500) {
    button3Unlocked = true;
  }
  if (button3Unlocked) {
    upgradeButton3.style.display = 'block';
    upgradeButton3.textContent = `Buy Super Auto-Clicker (+10/s) (1500 score) - Owned: ${autoClickers10ps}`;
    upgradeButton3.className = rice >= 1500 ? 'enabled' : 'disabled';
  }

  // Button 4
  if (rice >= 5000) {
    button4Unlocked = true;
  }
  if (button4Unlocked) {
    upgradeButton4.style.display = 'block';
    upgradeButton4.textContent = `Buy Ultra Auto-Clicker (+50/s) (5000 score) - Owned: ${autoClickers50ps}`;
    upgradeButton4.className = rice >= 5000 ? 'enabled' : 'disabled';
  }

  // Button 5
  if (rice >= 10000) {
    button5Unlocked = true;
  }
  if (button5Unlocked) {
    upgradeButton5.style.display = 'block';
    upgradeButton5.textContent = `Buy Legendary Auto-Clicker (+100/s) (10000 score) - Owned: ${autoClickers100ps}`;
    upgradeButton5.className = rice >= 10000 ? 'enabled' : 'disabled';
  }

  // Button 6
  if (rice >= 500000) {
    button6Unlocked = true;
  }
  if (button6Unlocked) {
    upgradeButton6.style.display = 'block';
    upgradeButton6.textContent = `Buy Mega Auto-Clicker (+750/s) (50000 score) - Owned: ${autoClickers750ps}`;
    upgradeButton6.className = rice >= 50000 ? 'enabled' : 'disabled';
  }

  // x2 multiplier button
  if (rice >= 100) {
    multiplierUnlocked = true;
  }
  if (multiplierUnlocked && multiplierPurchases < multiplierCosts.length) {
    const nextCost = multiplierCosts[multiplierPurchases];
    multiplierButton.style.display = 'block';
    multiplierButton.textContent = `Buy x2 Multiplier (x${Math.pow(2, multiplierPurchases + 1)}) - Cost: ${nextCost} rice`;
    multiplierButton.className = rice >= nextCost ? 'enabled' : 'disabled';
  } else if (multiplierPurchases >= multiplierCosts.length) {
    multiplierButton.style.display = 'block';
    multiplierButton.textContent = `Max x2 Multiplier - Owned: ${multiplierPurchases}`;
    multiplierButton.className = 'disabled';
  }
}

// Auto-clicker interval every 1 second
setInterval(function() {
  if (rice > 1000000000000) {
    document.getElementById("clickableImg").src = "Cody.png";
  }
  rice += autoClickers1; // +1 per second
  rice += autoClickers10ps * 10; // +10 per second per upgrade
  rice += autoClickers50ps * 50; // +50 per second per upgrade
  rice += autoClickers100ps * 100; // +100 per second per upgrade
  rice += autoClickers750ps * 750; // +750 per second per upgrade
  secondCounter++;
  if (secondCounter >= 10) {
    rice += autoClickers10; // +1 per 10 seconds
    secondCounter = 0;
  }
  updateScoreDisplay();
  checkUpgradeButtons();
}, 1000); // 1 second

// Mini-image spawning
function scheduleNextMiniImg(index) {
  const delay = Math.random() * (180000 - 60000) + 60000; // 1-3 minutes in ms
  setTimeout(() => spawnMiniImg(index), delay);
}

function spawnMiniImg(index) {
  const miniImg = miniImgs[index];
  const miniText = miniTexts[index];
  
  // Select a random rarity
  const rarityIndex = getRandomRarity();
  const data = rarityLevels[rarityIndex];
  
  miniImg.dataset.reward = data.reward;
  miniImg.dataset.rarityIndex = rarityIndex;
  miniImg.className = data.ringClass;
  miniImg.style.filter = 'none'; // Remove grayscale
  
  // Spawn randomly but avoid bottom-left area where mini-images rest
  let left, top;
  let validPosition = false;
  while (!validPosition) {
    left = Math.random() * (window.innerWidth - 150);
    top = Math.random() * (window.innerHeight - 320);
    if (!(left < 850 && top > window.innerHeight - 170)) {
      validPosition = true;
    }
  }
  
  miniImg.style.left = left + 'px';
  miniImg.style.top = top + 'px';
  miniImg.style.bottom = 'auto';
  miniImg.style.display = 'block';
  miniText.textContent = data.name;
  miniText.style.left = left + 'px';
  miniText.style.top = (top + 150) + 'px';
  miniText.style.display = 'block';
  
  // Set timeout to hide if not clicked
  miniImgTimeouts[index] = setTimeout(function() {
    miniImg.style.display = 'none';
    miniText.style.display = 'none';
    miniTooltips[index].style.display = 'none';
    
    // Only schedule next spawn if the image was already collected
    // If it wasn't collected (timed out), leave it gray and don't spawn again
    if (isCollected[index]) {
      miniImg.className = rarityLevels[rarityIndex].ringClass;
      miniImg.style.filter = 'none';
      scheduleNextMiniImg(index);
    } else {
      // Image timed out without being clicked - make it gray and keep it at rest
      miniImg.className = '';
      miniImg.style.filter = 'grayscale(100%)';
    }
    
    // Move back to bottom-left resting position
    miniImg.style.left = `${10 + index * 160}px`;
    miniImg.style.top = 'auto';
    miniImg.style.bottom = '10px';
  }, 30000); // 30 seconds
}

// Start the mini-img spawns
for (let i = 0; i < 5; i++) {
  scheduleNextMiniImg(i);
}
