var inventory;
var armor;
var turns;
var enemyHealth;
var fighter;
var fighterName;
var health;
var maxHealth;
var fighting;
var regen;
var defense;
var drop;
var extraDMG;
var coins;
var currentPrompt;
var shopName;
var inShop;
var tips = [
"The lifesteal effect lets you heal 25% of the damage you did to an enemy.",
"The assasinate effect has a 5% chance to instakill an enemy with every hit",
"Everytime you pick up armor your armor level will increase by one. Every increase in armor level means 10 more damage reduction.",
]
var tip = tips[Math.floor(Math.random() * tips.length)];
document.getElementById("tip").innerHTML = "Tip: " + tip;

//Key to weapons: "[WEAPON NAME]", "[WEAPON TYPE]", [WEAPON DMG], "[WEAPON EFFECT]", 
var weapons = [
"sword", "sharp", 20, "",
"club", "dull", 15, "",
"bow", "ranged", 20, "",
"golemn fist", "dull", 50, "",
"sword of draining", "sharp", 30, "lifesteal",
"axe of hell", "sharp", 25, "assassinate",
"mace", "dull", "30", "",
"assissin's dagger", "sharp", 5, "assassinate",
];
var consumables = ["potion", "leafjuice", "crocblood", "holywater", "werewolfpotion",];
var equipment = ["dynamite", "rock",]

var sharpWords = ["impale", "shred", "dice", "stab", "cut", "slice", "repeatedly stab", "mutilate", "butcher", "slit"];
var dullWords = ["obliterate", "pound", "pummel", "hit", "destroy", "bludgeon", "shatter", "cracks", "strike", "snap"];
var rangedWords = ["impale", "shoot", "hit", "destroy", "shred", "obliterate", "penetrate",];
var animalWords = ["bite", "hit", "ram", "tackle", "slam", "pound", "obliterate", "snap", "clamp"];

var humanParts = ["elbow", "knee", "nose", "finger", "toe", "skull", "leg", "arm", "hand", "face", "chest", "eye", "pelvis", "shoulder", "teeth", "finger", "thumb", "ribs", "wrist"];
var fourLeggedParts = ["skull", "leg", "face", "eye", "back", "nose", "stomach", "paw"];

var fightMessages = [
"You spot a ",
"You see a ",
"You get ambushed by a ", 
"You get pinned down by a ",
"You get attacked by a ", 
"You find a ",
"You encounter a ",
];

//-----------------------------------

var enemyList = ["goblin", "knight", "bomber", "crocodile"];

//Key to enemy stats -
//[0] Enemy health
//[1] Enemy damage per hit
//[2] Missing chance of the fighter (out of 1)
//[3] Base encounter damage
//[4] Chance for drop on death (out of 1)
//[5] What this enemy drops
//[6] This enemy's body type [human, fourLegged, animalname] (affects body part messages)
//[7] Special drop chance (if any) (out of 1)
//[8] This enemy's special drop (if any)
//[9] How much less damage this fighter takes
//[10] Non variable name, if any
//[11] Weapon Type [ranged, sharp, dull] (affects attack mesages)
//[12] Coin Drop
//ALL FIELDS MUST BE AT LEAST PRESENT

//BASIC ENEMIES
var goblin = [50, 10, .40, 0, .80, "potion", "human", .2, "bow", 0, "", "ranged", 5];
var knight = [75, 10, .30, 5, .30, "armor", "human", 0, "", 10, "", "sharp", 10];
var bomber = [50, 15, .40, 10, .70, "dynamite", "human", 0, "", 0, "", "dull", 10];
var crocodile = [100, 20, .4, 20, .4, "crocblood", "fourLegged", 0, "", 5, "", "animal", 15];
var forager = [50, 10, .3, 10, .8, "apple", "human", .4, "grape", 0, "", "dull", 10];

//MINIBOSSES
var golem = [100, 50, .7, 15, .8, "golem fist", "human", 0, "", 0, "Ancient Golem", "dull"];
var werewolf = [150, 30, .2, 20, 1, "werewolfpotion", "fourLegged", 0, "", 0, "Werewolf", "animal"];

//BOSSES
var sgtGoblin = [200, 30, .3, 10, 1, "legendary goblin sword", "human", 0, "", 0, "Sargeant Goblin", "sharp"];

//-----------------------------------

//Key to potion effects -
//[0] Health Recovery
//[1] Max Health Increase
//[2] Player Damage Increase
//[3] Defense Increase
//[4] Regen Increase
//[5] Potion Display Name
//[6] Unique Message

var potion = [50, 0, 0, 0, 0, "potion", "You recover 50 health."];
var leafjuice = [5, 5, 5, 5, 5, "leaf juice", "Your stats have increased all around by 5."];
var crocblood = [0, 0, 0, 10, 0, "crocodile blood", "You will take 10 less damage per hit."];
var holywater = [50, 0, 10, 0, 5, "holy water", "You recover 50 health, will take 10 less damage, and will regen 5 more health per turn."];
var werewolfpotion = [50, 50, 10, -10, 5, "werewolf potion", "You start to shift into a werewolf. You have 50 more health, 10 more damage, and 5 more regeneration. But you will take 10 more damage per hit."];


//-----------------------------------

//Key to equipment -
//[0] Display Name
//[1] Damage to enemy.
//[2] Damage to player.
//[3] Effect

var dynamite = ["dynamite", 30, 10, ""];
var rock = ["rock", 5, 0, ""];


//-----------------------------------

//Key to shop -
//[0] Item Name
//[1] Price
//[3] Shop Level Minimum (min level is 1)
//[4] Shop Level Maximum (max lvl is 100)

var shopItems = [
"potion", 15, 1, 10,
"mace", 50, 5, 15,
"armor", 75, 1, 100,
];

var shopNames = ["Adventure Depot", "Jungle Tavern", "Fighting Goods", "JungleMart",];

//-----------------------------------

function start() {
	inventory = ["sword", "potion",]
	armor = 0;
	turns = 0;
	fighter = "none";
	health = 100;
	maxHealth = 100;
	fighting = false;
	regen = 5;
	defense = 0;
	extraDMG = 0;
	coins = 0;
	inShop = false;
	
	document.getElementById("displays").style.display = "block";
	document.getElementById("titleScreen").style.display = "none";
	document.getElementById("baseControls").style.display = "block";
}

function inv(situation) {
	document.getElementById("inventory").style.display = "block";
	document.getElementById("invTitle").innerHTML = "Inventory";
	if (situation == "safe") {
		var counter = 0;
		while (counter < inventory.length) {
			var invItem = document.createElement("p");
			var string = inventory[counter];
			if (equipment.indexOf(string) == -1) {
				if (consumables.indexOf(string) >= 0) {
					invItem.setAttribute("id", string);
					invItem.setAttribute("onclick", "drinkPotion(this.id);");
					invItem.setAttribute("style", "color: blue; cursor: pointer;");
					string = window[string][5];
				}
				var divString = string.split("");
				divString[0] = divString[0].toUpperCase();
				string = divString.join('');
				invItem.innerText = string;
				document.getElementById("invContents").appendChild(invItem);
				
			}
			counter = counter + 1;
		}
	}
	if (situation == "fight") {
		var counter = 0
		while (counter < inventory.length) {
			var invItem = document.createElement("p");
			var string = inventory[counter];
			if (equipment.indexOf(string) >= 0 || consumables.indexOf(string) >= 0) {
					invItem.setAttribute("id", string);
					invItem.setAttribute("onclick", "useItem(this.id)");
					invItem.setAttribute("style", "color: blue; cursor: pointer;");
					if (consumables.indexOf(string) >= 0) {string = window[string][5]}
					if (equipment.indexOf(string) >= 0) {string = window[string][0]}
					console.log(string);
					var divString = string.split("");
					divString[0] = divString[0].toUpperCase();
					string = divString.join('');
					invItem.innerText = string;
					document.getElementById("invContents").appendChild(invItem);
			}	
			counter = counter + 1;
		}
	}

}

function shop(shopName) {
	document.getElementById("inventory").style.display = "block";
	document.getElementById("invTitle").innerHTML = shopName;
	document.getElementById("invContents").innerHTML = "";
	var shopMilestones = 0;
	var counter = 0;
	var count = true;
	while (count == true) {
		counter = counter + 1;
		if (turns >= shopMilestones && turns < shopMilestones + 50) {
			var shopLevel = counter;
			count = false;
			console.log(shopLevel);
		}
		shopMilestones = shopMilestones + 50;
	}
	var array = shopItems;
	var rotations = 0;
	counter = 0;
	while (counter < array.length) {
		var itemLocation = 0 + (rotations * 4)
		var item = array[itemLocation];
		var price = array[itemLocation + 1];
		var minLevel = array[itemLocation + 2];
		var maxLevel = array[itemLocation + 3];
		
		if (minLevel <= shopLevel && maxLevel >= shopLevel) {
			var shopItem = document.createElement("p");
			var string = item;
			if (coins >= price) {
				shopItem.setAttribute("id", string);
				shopItem.setAttribute("onclick", "buyItem(this.id);");
				shopItem.setAttribute("style", "color: blue; cursor: pointer;");
			}
			else {
				shopItem.setAttribute("style", "color: gray; cursor: pointer;");
			}
			var divString = string.split("");
			divString[0] = divString[0].toUpperCase();
			string = divString.join('');
			shopItem.innerText = string + ", " + price + " coins.";
			document.getElementById("invContents").appendChild(shopItem);
		}
		counter = counter + 1;
		rotations = rotations + 1;
	}
	
}

function buyItem(item) {
	if(weapons.indexOf(item) >= 0) {
		inventory[0] = item;
		update("You bought a " + item + ".");
	}
	if(consumables.indexOf(item) >= 0 || equipment.indexOf(item) >=0) {
		inventory.push(item);
		update("You bought a " + item + ".");
	}
	if(item == "armor") {
		var currentArmor = armor
		armor = armor + 1;
		update("You bought a " + item + ".");
	}
	var price = shopItems[shopItems.indexOf(item) + 1];
	coins = coins - price;
	
}

function cont() {
	turns = turns + 1;
	var eventRNG = Math.random();
	if (fighting == false && health < maxHealth) {health = health + regen};
	if (health > maxHealth) {health = maxHealth};
	
	//Enemy Encounter
	if (eventRNG <= .10) {
		fighter = enemyList[Math.floor(Math.random() * enemyList.length)];
		var message = fightMessages[Math.floor(Math.random() * fightMessages.length)];
	
		var startingDamage = window[fighter][3];
		enemyHealth = window[fighter][0];
	
		if (window[fighter][10] != null && window[fighter][10] != "") {fighterName = window[fighter][10]}
		else {fighterName = fighter};
	
		document.getElementById("baseControls").style.display = "none";
		document.getElementById("fightingControls").style.display = "block";
		update(message + fighter + ". <br> You are now fighting a " + fighterName + ". <br> The " + fighterName + " dealt " + startingDamage + " starting damage.", "clear", "clear");
	}
	
	//Shop Encounter
	if (eventRNG <= .15 && eventRNG > .1) {
		shopName = shopNames[Math.floor(Math.random() * shopNames.length)];
		document.getElementById("selectionYesNo").style.display = "block";
		document.getElementById("baseControls").style.display = "none";
		currentPrompt = "enterShop";
		update("You found a shop named " + shopName + ", do you want to enter?", "clear", "clear");
	}

	update();
	if (health <= 0) {die();}
}

function attack() {
	var weapon = inventory[0];
	var weaponID = weapons.indexOf(weapon);
	var weaponType = weapons[weaponID + 1];
	var weaponDamage = weapons[weaponID + 2];
	var weaponEffect = weapons[weaponID + 3];

	if (window[fighter][9] != null) {weaponDamage = weaponDamage - window[fighter][9];}
	if (weaponDamage < 0) {weaponDamage = 0};
	enemyHealth = enemyHealth - weaponDamage;
	
	if (weaponEffect == "lifesteal") {
			var lifeSteal = weaponDamage * 0.25;
			lifeSteal = Math.round(lifeSteal);
			health = health + lifeSteal;
			if (health > maxHealth) {health = maxHealth};
	}
	if (weaponEffect == "assassinate") {
		if (Math.random() <= 0.05) {
			enemyHealth = 0
			update("", "", "The " + fighterName + " was beheaded by a weapon effect.");
			fighting = "false";
		
			document.getElementById("fightingControls").style.display = "none";
			document.getElementById("afterFightControls").style.display = "block";
			return;
		}
	}
	
	var verbArray = weaponType + "Words";
	var word = window[verbArray][Math.floor(Math.random() * window[verbArray].length)];
	var partArray = window[fighter][6] + "Parts";
	var bodyPart = window[partArray][Math.floor(Math.random() * window[partArray].length)];
	
	update("", "You " + word + " the " + fighterName + "'s " + bodyPart + " with your " + weapon + ", dealing " + weaponDamage + " damage");
	
	enemyAttack();
	
	turns = turns + 1;
}

function enemyAttack() {
	if (Math.random() > window[fighter][2]) {
		var damage = window[fighter][1];
		var blockedDamage = (armor * 10) + defense;
		damage = damage - blockedDamage;
		if (damage < 0) {damage = 0};
		health = health - damage;
		var verbArray = window[fighter][11] + "Words";
		var word = window[verbArray][Math.floor(Math.random() * window[verbArray].length)];
		word = word + "s";
		var bodyPart = humanParts[Math.floor(Math.random() * humanParts.length)];
	
		update("The " + fighterName + " " + word + " your " + bodyPart + ", dealing " + damage + " damage.");
	}
	else {
		update("The " + fighterName + " missed it's attack.");
	}
	
	if (enemyHealth <= 0) {
		update("", "", "The " + fighterName + " dies.");
		fighting = "false";
		
		document.getElementById("fightingControls").style.display = "none";
		document.getElementById("afterFightControls").style.display = "block";
	}
	if (health <= 0) {die();}
}

function loot() {
	var dropChance = window[fighter][4];
	var specialDropChance = window[fighter][7];
	var coinDrop = window[fighter][12];
	var calcDrop = Math.random();
	
	if (calcDrop <= specialDropChance && specialDropChance != "" && specialDropChance != null) {
		drop = window[fighter][8];
	}
	else if (calcDrop <= dropChance && dropChance != "" && dropChance != null) {
		drop = window[fighter][5]
	}
	else {
		coins = coins + coinDrop;
		update("You loot the dead body.", "The dead " + fighterName + " doesn't have any items, you get up and keep going.", "The " + fighterName + " had " + coinDrop + " coins.");
		document.getElementById("afterFightControls").style.display = "none";
		document.getElementById("baseControls").style.display = "block";
		drop = "";
		
	}
	
	if (drop != "") {
		coins = coins + coinDrop;
		update("You loot the dead body.", "You found a " + drop + "! Do you want to pick it up?", "The " + fighterName + " had " + coinDrop + " coins.");
		document.getElementById("afterFightControls").style.display = "none";
		document.getElementById("selectionYesNo").style.display = "block";
		currentPrompt = "pickup";
	}
	
	fighter = "none";
	fighterName = "";
}

function selection(input) {
	if (currentPrompt == "pickup") {
		if (input == "yes") {
			if (weapons.indexOf(drop) >= 0) {
				update("You pick up the " + drop + " and leave behind your " + inventory[0] + ".", "clear", "clear");
				inventory[0] = drop;
			}
			if (consumables.indexOf(drop) >=0 || equipment.indexOf(drop) >= 0) {
				if (consumables.indexOf(drop) >= 0) {var consumableName = window[drop][5]};
				if (equipment.indexOf(drop) >= 0) {var consumableName = [window][drop][0]};
				update("You pick up the " + consumableName + ".", "clear", "clear");
				inventory.push(drop);
			}
			if (drop == "armor") {
				var currentArmor = armor
				armor = armor + 1;
				var damageResistDisplay = armor * 10;
				update("You pick up the armor. <br>Your armor level has gone up from " + currentArmor + " to " + armor + ".<br>Your new armor will block " + damageResistDisplay + " incoming damage per attack.", "clear", "clear");
			}
		}
		if (input == "no") {
			update("You leave behind the " + drop + ".", "clear", "clear");
		}
		document.getElementById("baseControls").style.display = "block";
		document.getElementById("selectionYesNo").style.display = "none";
	}
	if (currentPrompt == "enterShop") {
		if (input == "yes") {
			update("You enter " + shopName + ".", "clear", "clear");
			document.getElementById("baseControls").style.display = "block";
			document.getElementById("selectionYesNo").style.display = "none";
			inShop = true;
			shop(shopName);
		}
		if (input == "no") {
			update("You ignore the " + shopName + " and keep going.", "clear", "clear");
			document.getElementById("baseControls").style.display = "block";
			document.getElementById("selectionYesNo").style.display = "none";
		}
	}
}

function drinkPotion(potion) {
	var words = ["chug", "drink", "gulp down", "consume", "guzzle", "sip"];
	var word = words[Math.floor(Math.random()*words.length)];

	var potionEffects = window[potion];
	health = health + potionEffects[0];
	defense = defense + potionEffects[3];
	maxHealth = maxHealth + potionEffects[1];
	regen = regen + potionEffects[4];
	extraDMG = extraDMG + potionEffects[2];
	
	var potionName = potionEffects[5];
	
	var potionSlot = inventory.indexOf(potion);
	inventory.splice(potionSlot, 1);
	document.getElementById("inventory").style.display = "none";
	document.getElementById("invContents").innerHTML = "";
	
	if (health > maxHealth) {health = maxHealth};
	
	update("", "You " + word + " the " + potionName + ". <br>" + potionEffects[6], "clear", "clear");
}

function update(message, message2, message3) {
	document.getElementById("healthDisplay").innerHTML = health;
	var precentFilled = health / maxHealth;
	precentFilled = precentFilled * 100;
	precentFilled = Math.round(precentFilled)
	document.getElementById("healthBar").style.width = precentFilled + "%";
	document.getElementById("turns").innerHTML = turns + " turns";
	document.getElementById("coins").innerHTML = coins + " coins";

	if (message != null && message != "") {
		document.getElementById("mainDisplay").innerHTML = message;	
	}
	if (message2 != null && message2 != "") {
		document.getElementById("secondaryDisplay").innerHTML = message2;	
	}
	if (message3 != null && message3 != "") {
		document.getElementById("thirdDisplay").innerHTML = message3;	
	}
	
	if (message == "clear") {
		document.getElementById("mainDisplay").innerHTML = "";
	}
	if (message2 == "clear") {
		document.getElementById("secondaryDisplay").innerHTML = "";
	}
	if (message3 == "clear") {
		document.getElementById("thirdDisplay").innerHTML = "";
	}
}

function useItem(item) {
	if (consumables.indexOf(item) >= 0) {
		drinkPotion(item);
	}
	else {
		var itemStats = window[item]
		enemyHealth -= itemStats[1];
		health -= itemStats[2];
		
		var itemName = itemStats[0];
		
		update("", "You used the " + itemName + ".")
		
	}
	enemyAttack();
}

function die() {
	update("", "", "You died.")
	document.getElementById("baseControls").style.display = "none";
	document.getElementById("fightingControls").style.display = "none";
	document.getElementById("afterFightControls").style.display = "none";
	document.getElementById("selectionYesNo").style.display = "none";
}

window.onclick = function(event) {
  if (event.target == document.getElementById("inventory")) {
    document.getElementById("inventory").style.display = "none";
	document.getElementById("invContents").innerHTML = "";
	
	if (inShop == true) {
		update("You left " + shopName + ".", "clear", "clear");
		inShop = false;
	}
  }
}



