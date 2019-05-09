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
var bleed;
var weaponEnchants;
var weaponEffects;
var tips = [
	"The lifesteal effect lets you heal a portion of the damage you did to an enemy.",
	"The assasinate effect has a chance to instakill an enemy with every hit.",
	"Using ranged weapons makes your opponents 20% more likely to miss an attack on you.",
	"The bleed effect can stack, the more it is used in a fight, the more damage the bleed does per turn. In long fights this can lead to extremely high damage.",
	"Minibosses are spawned by quest items that you can find around the jungle. Minibosses provide helpful items that are crucial to continue your journey.",
	"The curse effect makes enemies more likely to miss an attack on you.",
	"Having multiple of one effect on one weapon is useless and will not increase any effects. Effects that come with the weapon will always be prioritized.",
	"The attack damage stat does not include the damage of your weapon.",
	"Ancient Golems do a lot of damage, but they are very slow and have a high chance to miss an attack.",

]
var tip = tips[Math.floor(Math.random() * tips.length)];
document.getElementById("tip").innerHTML = "Tip: " + tip;

//Key to weapons: [WEAPON NAME], [WEAPON TYPE], [WEAPON DMG], [WEAPON EFFECT], [WEAPON EFFECT STAT], [WEAPON EFFECT 2], [WEAPON EFFECT 2 STAT]
//Key to effect stats: 
//Lifesteal = lifesteal %
//Assassinate = assassinate chance %
//Bleed = extra damage per turn (bleed will stack every turn leading to high damage, bleed weapons are most powerful in long fights)
//Curse = enemy has extra chance to miss
var weapons = [
	"rusty sword", "sharp", 20, "", 0, "", 0,
	"club", "dull", 15, "", 0, "", 0,
	"bow", "ranged", 20, "", 0, "", 0,
	"golem fist", "dull", 50, "curse", .05, "", 0,
	"sword of draining", "sharp", 30, "lifesteal", 0.6, "bleed", 35,
	"axe of hell", "sharp", 30, "assassinate", 0.05, "curse", .1,
	"mace", "dull", "30", "", 0, "", 0,
	"assassin's dagger", "sharp", 2, "assassinate", 0.2, "", 0,
	"piercer", "sharp", 0, "bleed", 10, "", 0,
	"torturer's longsword", "sharp", 5, "bleed", 25, "assassinate", .03,
	"life staff", "magicHeal", 50, "lifesteal", 0.15, "", 0,
	"fire staff", "magicFire", 75, "", 0, "", 0,
	"blood gauntlet", "magicDark", 25, "bleed", 30, "", 0,
	"infinity gauntlet", "magicBright", 100, "assassinate", .05, "", 0,
	"scythe", "sharp", 70, "lifesteal", .5, "curse", .2,
	"spell book", "magicBright", 45, "curse", .2, "", 0,
	"carrot sword", "sharp", 50, "lifesteal", .4, "", 0,
	"banana gun", "ranged", 45, "curse", .15, 0, "", 0,
];
//Key to Armor: [ARMOR NAME], [INCOMING DAMAGE DECREASE], [OUTGOING DAMAGE INCREASE], [ARMOR SLOT]
//Damage and protection numbers can be negative, it will reverse the effect and lead to interesting armors that have pros and cons
var armors = [
	"metal helmet", 5, 0, 0,
	"chainmail vest", 10, 0, 1,
	"metal leggings", 7, 0, 2,
	"metal boots", 5, 0, 3,
	"leech vest", -10, 15, 1,
	"parasitic helmet", -13, 10, 0,
	"lightweight shoes", 0, 10, 3,
	"steel plate", 20, -5, 1,
	"precision glasses", 0, 10, 0,
];
//Key to Enchants: [ENCHANT NAME], [DAMAGE INCREASE], [EFFECT], [EFFECT STAT]
var enchants = [
	"sharpness I", 5, "bleed", 5,
	"sharpness II", 7, "bleed", 10,
	"sharpness III", 9, "bleed", 15,
	"draining I", -5, "lifesteal", .2,
	"draining II", -2, "lifesteal", .4,
	"draining III", 1, "lifesteal", .6,
];
var consumables = ["potion", "leafjuice", "crocblood", "holywater", "werewolfpotion",];
var equipment = ["dynamite", "rock", "shuriken"];

var sharpWords = ["impale", "shred", "dice", "stab", "cut", "slice", "repeatedly stab", "mutilate", "butcher", "slit"];
var dullWords = ["obliterate", "pound", "pummel", "hit", "destroy", "bludgeon", "shatter", "crack", "strike", "snap", "slam"];
var rangedWords = ["impale", "shoot", "hit", "destroy", "shred", "obliterate", "penetrate",];
var animalWords = ["bite", "hit", "ram", "slam", "pound", "obliterate", "snap", "clamp"];
var explosiveWords = ["explode", "obliterate", "scorch", "melt", "burn", "destroy", "break", "shred", "dismember"];
var magicHealWords = ["drain", "shoot", "empty", "absorb"];
var magicFireWords = ["explode", "burn", "scorch", "melt", "fireball", "shoot"];
var magicDarkWords = ["torture", "crush", "bludgeon", "mutilate",];
var magicBrightWords = ["scorch", "disintegrate", "burn", "wither"];

var magicFire2Words = ["explode", "burn", "scorche", "melt", "fireball", "shoot"];

var humanParts = ["elbow", "knee", "nose", "finger", "toe", "skull", "leg", "arm", "hand", "face", "chest", "eye", "pelvis", "shoulder", "teeth", "finger", "thumb", "ribs", "wrist"];
var fourLeggedParts = ["skull", "leg", "face", "eye", "back", "nose", "stomach", "paw"];

var fightMessages = [
	"You spot a",
	"You see a",
	"You get ambushed by a",
	"You get pinned down by a",
	"You get attacked by a",
	"You find a",
	"You encounter a",
];

//-----------------------------------

var enemyList = ["goblin", "knight", "bomber", "crocodile", "rabbit", "ninja", "mage", "assassin", "hunter", "priest", "monkey"];

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
//[11] Weapon Type [READ ABOVE FOR TYPES] (affects attack mesages)
//[12] Coin Drop
//[13] Encounter chance once they are chosen for an encounter
//[14] a(n) true or false
//ALL FIELDS MUST BE AT LEAST PRESENT

//BASIC ENEMIES
var goblin = [50, 10, .40, 0, .8, "potion", "human", .2, "bow", 0, "", "ranged", 5, 1, false];
var knight = [75, 10, .30, 5, .5, "metal helmet", "human", 0, "", 10, "", "sharp", 10, .8, false];
var bomber = [50, 15, .40, 10, .7, "dynamite", "human", 0, "", 0, "", "explosive", 10, .7, false];
var crocodile = [100, 20, .4, 20, .7, "crocblood", "fourLegged", 0, "", 5, "", "animal", 15, .5, false];
var rabbit = [50, 500, 1, 0, .05, "carrot", "fourLegged", 0, "", 0, "", "magicDark", 5, 1, false];
var ninja = [100, 25, .2, 10, .6, "shuriken", "human", .6, "lightweight shoes", 0, "", "sharp", 20, .3, false];
var mage = [100, 30, .3, 10, .3, "fire staff", "human", .1, "life staff", 0, "", "magicFire2", 25, .2, false];
var assassin = [100, 0, 1, 45, .4, "assassin's dagger", "human", .1, "torturer's longsword", 0, "", "sharp", 20, .2, true];
var hunter = [75, 15, .3, 10, .43, "spear", "human", .86, "bait", 0, "", "sharp", 15, .6, false];
var priest = [135, 20, .4, 10, 1, "totem", "human", .3, "spell book", 0, "", "magicBright", 20, .6, false];
var monkey = [70, 20, .1, 20, .5, "banana", "human", .1, "banana gun", 0, "", "animal", 25, .4, false];

//MINIBOSSES
var golem = [100, 50, .7, 15, 1, "golem fist", "human", 0, "", 0, "Ancient Golem", "dull", 50, 1, true];
var werewolf = [150, 30, .2, 20, 1, "werewolfpotion", "fourLegged", 0, "", 0, "Werewolf", "animal", 50, 1, false];
var giantrabbit = [200, 40, .4, 20, 1, "carrot sword", "fourLegged", 0, "", 0, "Giant Rabbit", "animal", 50, 1, false];
var kinggorilla = [300, 40, .2, 25, 1, "banana potion", "human", 0, "", 0, "King Gorilla", "animal", 70, 1, false]

//BOSSES
var sgtGoblin = [200, 30, .3, 10, 1, "legendary goblin sword", "human", 0, "", 0, "Sargeant Goblin", "sharp", 100, 1, false]; //turn 100
var reaper = [500, 50, .1, 30, 1, "scythe", "human", .2, "blood gauntlet", 0, "Reaper", "sharp", 200, 1, false]; //turn 200
var vampire = [750, 75, .2, 20, 1, "sword of draining", 0, "", 0, "Vampire", "sharp", 600, 1, false]; //turn 300

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
var crocblood = [0, 0, 0, 10, 0, "crocodile blood", "Your skin hardens. You will take 10 less damage per hit."];
var holywater = [50, 0, 10, 0, 5, "holy water", "You recover 50 health, will take 10 less damage, and will regen 5 more health per turn."];
var werewolfpotion = [50, 50, 10, -10, 5, "werewolf potion", "You start to shift into a werewolf. You have 50 more health, 10 more damage, and 5 more regeneration. But you will take 10 more damage per hit."];
var snakevenom = [50, 50, 10, 0, 0, "snake venom", "It tastes horrible and extremely bitter. Your max health increases by 50 and you will do 10 more damage per hit."]

//-----------------------------------

//Key to equipment -
//[0] Display Name
//[1] Damage to enemy.
//[2] Healing to player.
//[3] Effect

var dynamite = ["dynamite", 30, -10, ""];
var rock = ["rock", 5, 0, ""];
var shuriken = ["shuriken", 30, 0, "bleed"];

//-----------------------------------

//Key to shop -
//[0] Item Name
//[1] Price
//[3] Shop Level Minimum (min level is 1)
//[4] Shop Level Maximum

var shopItems = [
	"rock", 5, 1, 3,
	"shuriken", 10, 1, 2,
	"potion", 15, 1, 20,
	"leafjuice", 15, 1, 5,
	"metal helmet", 20, 2, 5,
	"chainmail vest", 25, 2, 5,
	"metal leggings", 25, 2, 5,
	"metal boots", 15, 2, 3,
	"piercer", 25, 2, 5,
	"mace", 50, 2, 5,
	"sharpness I", 30, 2, 3,
	"sharpness II", 40, 3, 4,
	"sharpness III", 50, 4, 10,
];

var shopNames = ["Adventure Depot", "Jungle Tavern", "Fighting Goods", "JungleMart",];

//-----------------------------------

var questItems = ["bait", "totem", "carrot", "banana"];
//Key to Quest Items
//[0] Non-var name of item
//[1] Miniboss this item summons

var bait = ["werewolf bait", "werewolf", "You wait in a nearby bush and wait for a werewolf to appear. A werewolf comes from behind a tree and begins eating the bait."];
var totem = ["awakening totem", "golem", "An Ancient Golem awakens from a centuries long rest and emerges from the ground in front of you."];
var carrot = ["massive carrot", "giantrabbit", "A giant rabbit emerges from the trees. It's footsteps make the ground and trees shake."];
var banana = ["banana", "kinggorilla", "The King Gorilla smells the banana from miles away and stampedes over to you."]

//-----------------------------------
function start() {
	inventory = ["rusty sword", "potion",]
	armor = ["", "", "", ""]; //armor = "head", "chest", "legs", "feet"
	turns = 0;
	fighter = "none";
	health = 100;
	maxHealth = 100;
	fighting = false;
	regen = 2;
	defense = 0;
	extraDMG = 0;
	coins = 0;
	inShop = false;
	bleed = 0;
	weaponEnchants = [];
	weaponEffects = [];
	update();

	document.getElementById("displays").style.display = "block";
	document.getElementById("titleScreen").style.display = "none";
	document.getElementById("baseControls").style.display = "block";
	document.getElementById("statBoard").style.display = "flex";
}

function inv(situation) {
	document.getElementById("inventory").style.display = "block";
	document.getElementById("invTitle").innerHTML = "Inventory";
	var gameElements = document.getElementsByClassName("button");
	gameElements = Array.from(gameElements);
	var i = 0;
	while (i < gameElements.length) {
		gameElements[i].disabled = "true";
		i = i + 1;
	}
	if (situation == "safe") {
		var counter = 0;
		while (counter < inventory.length) {
			var invItem = document.createElement("p");
			var string = inventory[counter];
			if (consumables.indexOf(string) >= 0 || questItems.indexOf(string) >= 0 || enchants.indexOf(string) >= 0) {
				invItem.setAttribute("id", string);
				invItem.setAttribute("onclick", "use(this.id);");
				invItem.setAttribute("style", "color: blue; cursor: pointer;");
				if (consumables.indexOf(string) >= 0) { string = window[string][5] }
				if (questItems.indexOf(string) >= 0) { string = window[string][0] }
				if (enchants.indexOf(string) >= 0) { string = string + " book" };
			}
			var divString = string.split("");
			divString[0] = divString[0].toUpperCase();
			string = divString.join('');
			invItem.innerText = string;
			document.getElementById("invContents").appendChild(invItem);

			counter = counter + 1;
		}
		var counter = 0;
		while (counter < armor.length) {
			if (armor[counter] != "") {
				var invItem = document.createElement("p");
				var string = armor[counter];
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
				if (consumables.indexOf(string) >= 0) { string = window[string][5] }
				if (equipment.indexOf(string) >= 0) { string = window[string][0] }
				var divString = string.split("");
				divString[0] = divString[0].toUpperCase();
				string = divString.join('');
				invItem.innerText = string;
				document.getElementById("invContents").appendChild(invItem);
			}
			counter = counter + 1;
		}
		while (counter < armor.length) {
			if (armor[counter] != "") {
				var invItem = document.createElement("p");
				var string = armor[counter];
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
	var gameElements = document.getElementsByClassName("button");
	gameElements = Array.from(gameElements);
	var i = 0;
	while (i < gameElements.length) {
		gameElements[i].disabled = "true";
		i = i + 1;
	}
	var shopMilestones = 0;
	var counter = 0;
	var count = true;
	while (count == true) {
		counter = counter + 1;
		if (turns >= shopMilestones && turns < shopMilestones + 50) {
			var shopLevel = counter;
			count = false;
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
			if (consumables.indexOf(string) >= 0) { string = window[string][5] }
			if (questItems.indexOf(string) >= 0) { string = window[string][0] }
			if (equipment.indexOf(string) >= 0) { string = window[string][0] }
			if (enchants.indexOf(string) >= 0) { string = string + " book" };
			if (coins >= price) {
				shopItem.setAttribute("id", item);
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
	var price = shopItems[shopItems.indexOf(item) + 1];
	coins = coins - price;
	if (weapons.indexOf(item) >= 0) {
		update("You bought a " + item + " and left behind your" + inventory[0] + ".");
		weaponEnchants = [];
		inventory[0] = item;
	}
	if (consumables.indexOf(item) >= 0 || equipment.indexOf(item) >= 0 || enchants.indexOf(item) >= 0) {
		inventory.push(item);
		update("You bought a " + item + ".");
	}
	if (armors.indexOf(item) >= 0) {
		var slot = armors[armors.indexOf(item) + 3];
		if (armor[slot] != "") {
			update("You buy and equip the " + item + ", leaving behind your " + armor[slot] + ".");
		}
		else {
			update("You buy and equip the " + item + ".")
		}
		armor[slot] = item;
	}
	shop(shopName);
}

function cont() {
	turns = turns + 1;
	var eventRNG = Math.random();
	if (fighting == false && health < maxHealth) {
		health = health + regen
	};
	if (health > maxHealth) { health = maxHealth };

	//Enemy Encounter
	if (eventRNG <= .10) {
		fighter = enemyList[Math.floor(Math.random() * enemyList.length)];
		if (window[fighter][13] > Math.random()) {
			fighting = true;
			var message = fightMessages[Math.floor(Math.random() * fightMessages.length)];
			var startingDamage = window[fighter][3];
			health = health - startingDamage;
			enemyHealth = window[fighter][0];

			if (window[fighter][10] != null && window[fighter][10] != "") { fighterName = window[fighter][10] }
			else { fighterName = fighter };
			var tempName = fighterName;
			if (window[fighter][14] == true) { tempName = "n " + fighterName }
			else { tempName = " " + fighterName }

			document.getElementById("baseControls").style.display = "none";
			document.getElementById("fightingControls").style.display = "block";
			update(message + tempName + ". <br> You are now fighting a" + tempName + ". <br> The " + fighterName + " dealt " + startingDamage + " starting damage.", "clear", "clear");
			bleed = 0;
		}
	}

	//Shop Encounter
	if (eventRNG <= .14 && eventRNG > .10) {
		shopName = shopNames[Math.floor(Math.random() * shopNames.length)];
		document.getElementById("selectionYesNo").style.display = "block";
		document.getElementById("baseControls").style.display = "none";
		currentPrompt = "enterShop";
		update("You found a shop named " + shopName + ", do you want to enter?", "clear", "clear");
	}
	update();
	if (health <= 0) { die(); }
}

function attack() {
	var weapon = inventory[0];
	var weaponID = weapons.indexOf(weapon);
	var weaponType = weapons[weaponID + 1];
	var weaponDamage = weapons[weaponID + 2];
	weaponEffects = [];
	weaponEffects.push(weapons[weaponID + 3]);
	weaponEffects.push(weapons[weaponID + 4]);
	weaponEffects.push(weapons[weaponID + 5]);
	weaponEffects.push(weapons[weaponID + 6]);
	var i = 0;
	while (i < weaponEnchants.length) {
		weaponEffects.push(enchants[enchants.indexOf(weaponEnchants[i]) + 2]);
		weaponEffects.push(enchants[enchants.indexOf(weaponEnchants[i]) + 3]);
		i = i + 4;
	};
	if (window[fighter][9] != null) { weaponDamage = weaponDamage - window[fighter][9]; }
	var armorInc = calcArmor("deal");
	var enchantInc = 0;
	if (weaponEnchants != []) { enchantInc = calcEnchants(); }
	weaponDamage = weaponDamage + armorInc + enchantInc + extraDMG;
	if (weaponDamage < 0) { weaponDamage = 0 };
	enemyHealth = enemyHealth - weaponDamage;
	var verbArray = weaponType + "Words";
	var word = window[verbArray][Math.floor(Math.random() * window[verbArray].length)];
	var partArray = window[fighter][6] + "Parts";
	var bodyPart = window[partArray][Math.floor(Math.random() * window[partArray].length)];

	update("", "You " + word + " the " + fighterName + "'s " + bodyPart + " with your " + weapon + ", dealing " + weaponDamage + " damage.");

	//Effects
	if (weaponEffects.indexOf("lifesteal") >= 0) {
		var lifeSteal = weaponEffects[weaponEffects.indexOf("lifesteal") + 1] * weaponDamage;
		lifeSteal = Math.round(lifeSteal);
		health = health + lifeSteal;
		update();
		if (health > maxHealth) { health = maxHealth };
	}
	if (weaponEffects.indexOf("assassinate") >= 0) {
		var chance = weaponEffects[weaponEffects.indexOf("assassinate") + 1];
		if (Math.random() <= chance) {
			enemyHealth = 0
			update("", "", "The " + fighterName + " was beheaded by a weapon effect.");
			fighting = false;

			document.getElementById("fightingControls").style.display = "none";
			document.getElementById("afterFightControls").style.display = "block";
			return;
		}
	}
	if (weaponEffects.indexOf("bleed") >= 0) {
		bleed = bleed + weaponEffects[weaponEffects.indexOf("bleed") + 1];
		console.log(bleed);
		console.log(weaponEffects);
	};
	enemyHealth = enemyHealth - bleed;


	//Effect Messages
	if (bleed > 0) {
		document.getElementById("secondaryDisplay").innerHTML = document.getElementById("secondaryDisplay").innerHTML + " <br> The " + fighterName + " takes " + bleed + " more damage to a bleed effect.";
	}
	if (lifeSteal > 0) {
		document.getElementById("secondaryDisplay").innerHTML = document.getElementById("secondaryDisplay").innerHTML + " <br> You healed " + lifeSteal + " health from a lifesteal effect.";
	}
	enemyAttack();
	turns = turns + 1;
}

function enemyAttack() {
	var missingChance = window[fighter][2];
	if (weaponEffects[weaponEffects.indexOf("assassinate")] >= 0) {
		missingChance = missingChance + weaponEffects[weaponEffects.indexOf("curse") + 1];
	}
	if (weapons[weapons.indexOf(inventory[0]) + 1] == "ranged") { missingChance = missingChance + .2 }
	if (Math.random() > missingChance) {
		var damage = window[fighter][1];
		var armorBlock = calcArmor("block");
		var blockedDamage = armorBlock + defense;
		damage = damage - blockedDamage;
		if (damage < 0) { damage = 0 };
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
		enemyHealth = 0;
		update("", "", "The " + fighterName + " dies.");
		fighting = false;

		document.getElementById("fightingControls").style.display = "none";
		document.getElementById("afterFightControls").style.display = "block";
	}
	if (health <= 0) { die(); }
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
		var string = drop;
		if (consumables.indexOf(string) >= 0) { string = window[string][5] }
		if (questItems.indexOf(string) >= 0) { string = window[string][0] }
		if (equipment.indexOf(string) >= 0) { string = window[string][0] }
		update("You loot the dead body.", "You found a " + string + "! Do you want to pick it up?", "The " + fighterName + " had " + coinDrop + " coins.");
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
				weaponEnchants = [];
				inventory[0] = drop;
			}
			if (consumables.indexOf(drop) >= 0 || equipment.indexOf(drop) >= 0 || questItems.indexOf(drop) >= 0) {
				if (consumables.indexOf(drop) >= 0) { var consumableName = window[drop][5] };
				if (equipment.indexOf(drop) >= 0) { var consumableName = window[drop][0]; };
				if (questItems.indexOf(drop) >= 0) { var consumableName = window[drop][0]; };
				update("You pick up the " + consumableName + ".", "clear", "clear");
				inventory.push(drop);
			}
			if (armors.indexOf(drop) >= 0) {
				var slot = armors[armors.indexOf(drop) + 3];
				if (armor[slot] != "") {
					update("You remove your " + armor[slot] + " and equip the " + drop + ".", "clear", "clear");
				}
				else {
					update("You equip the " + drop + ".", "clear", "clear");
				}
				armor[slot] = drop;
				update();
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

function use(potion) {
	if (consumables.indexOf(potion) == -1 && questItems.indexOf(potion) >= 0) {
		summonMiniBoss(potion);
		return;
	}
	if (consumables.indexOf(potion) == -1 && enchants.indexOf(potion) >= 0) {
		enchantWeapon(potion);
		return;
	}
	var words = ["chug", "drink", "gulp down", "consume", "guzzle", "sip"];
	var word = words[Math.floor(Math.random() * words.length)];

	var potionEffects = window[potion];
	health = health + potionEffects[0];
	defense = defense + potionEffects[3];
	maxHealth = maxHealth + potionEffects[1];
	regen = regen + potionEffects[4];
	extraDMG = extraDMG + potionEffects[2];

	var potionName = potionEffects[5];

	var potionSlot = inventory.indexOf(potion);
	inventory.splice(potionSlot, 1);
	closeInv();

	if (health > maxHealth) { health = maxHealth };

	update("", "You " + word + " the " + potionName + ". <br>" + potionEffects[6], "clear", "clear");
}

function update(message, message2, message3) {
	document.getElementById("healthDisplay").innerHTML = health;
	var precentFilled = health / maxHealth;
	precentFilled = precentFilled * 100;
	precentFilled = Math.round(precentFilled)
	document.getElementById("healthBar").style.width = precentFilled + "%";

	if (fighting == true) {
		document.getElementById("enemyHealthBarFrame").style.display = "block";
		document.getElementById("enemyHealthDisplay").innerHTML = enemyHealth;
		var enemyPrecentFilled = enemyHealth / window[fighter][0];
		enemyPrecentFilled = enemyPrecentFilled * 100;
		enemyPrecentFilled = Math.round(enemyPrecentFilled)
		document.getElementById("enemyHealthBar").style.width = enemyPrecentFilled + "%";
	}
	else {
		document.getElementById("enemyHealthBarFrame").style.display = "none";
	}
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

	var armorInc = calcArmor("deal");
	var armorBlock = calcArmor("block");
	var weaponStats = weapons[weapons.indexOf(inventory[0]) + 2];

	var attackDamage = armorInc + extraDMG;
	var damageResist = armorBlock + defense;
	var effects = [];
	if (weaponEnchants != []) { enchantInc = calcEnchants(); }
	if (weapons[weapons.indexOf(inventory[0]) + 3] != "") { effects.push(weapons[weapons.indexOf(inventory[0]) + 3]) }
	if (weapons[weapons.indexOf(inventory[0]) + 5] != "") { effects.push(weapons[weapons.indexOf(inventory[0]) + 5]) }
	var i = 0;
	while (i < weaponEnchants.length) {
		effects.push(enchants[enchants.indexOf(weaponEnchants[i]) + 2]);
		i = i + 4;
	};
	weaponStats = weaponStats + enchantInc;

	effects = effects.filter(function (item, index) {
		return effects.indexOf(item) >= index;
	});
	if (effects != "") { effects = "- Effects: " + effects.toString(); };

	weaponStats = weaponStats + " DMG " + effects;

	var all = [damageResist, attackDamage, weaponStats, regen, maxHealth];
	var stats = Array.from(document.getElementsByClassName("statCh"));
	i = 0;
	while (i < stats.length) {
		stats[i].innerHTML = all[i];
		i = i + 1;
	}
}

function useItem(item) {
	if (consumables.indexOf(item) >= 0) {
		use(item);
	}
	else {
		var itemStats = window[item]
		enemyHealth = enemyHealth - itemStats[1];
		health = health + itemStats[2];
		var itemName = itemStats[0];
		update("", "You used the " + itemName + ".")

		if (itemStats[3] == "bleed") {
			bleed = bleed + itemStats[1];
			enemyHealth = enemyHealth - bleed;
			update("", "You used the " + itemName + ". <br> The " + fighterName + " takes " + bleed + " more damage to a bleed effect.");
		}
		var equipSlot = inventory.indexOf(item);
		inventory.splice(equipSlot, 1);
		closeInv();

	}
	enemyAttack();
}

function closeInv() {
	var gameElements = document.getElementsByClassName("button");
	gameElements = Array.from(gameElements);
	var i = 0;
	while (i < gameElements.length) {
		gameElements[i].disabled = null;
		i = i + 1;
	}
	document.getElementById("inventory").style.display = "none";
	document.getElementById("invContents").innerHTML = "";

	if (inShop == true) {
		update("You exit " + shopName + ".");
		inShop = false;
	}
}

function summonMiniBoss(item) {
	var questItem = window[item];
	var name = questItem[0];
	var boss = questItem[1];
	var message = questItem[2];

	fighting = true;
	fighter = boss;
	if (window[fighter][10] != null && window[fighter][10] != "") { fighterName = window[fighter][10] }
	else (fighterName = fighter);
	var startingDamage = window[fighter][3];
	health = health - startingDamage;
	enemyHealth = window[fighter][0];
	document.getElementById("baseControls").style.display = "none";
	document.getElementById("fightingControls").style.display = "block";
	bleed = 0;

	var tempName = fighterName;
	if (window[fighter][14] == true) { tempName = "n " + fighterName }
	else { tempName = " " + fighterName }

	update("You use the " + name + ". <br>" + message + "<br> You are now fighting a" + tempName + ". <br> The " + fighterName + " dealt " + startingDamage + " starting damage.", "clear", "clear");

	var slot = inventory.indexOf(item);
	inventory.splice(slot, 1);
	closeInv();

}

function enchantWeapon(enchant) {
	weaponEnchants.push(enchant);
	var slot = inventory.indexOf(enchant);
	inventory.splice(slot, 1);
	closeInv();
	update("You used the " + enchant + " book. <br> Your " + inventory[0] + " has gained the " + enchant + " enchantment.", "clear", "clear");
}

function calcArmor(type) {
	if (type == "block") {
		var i = 0;
		var total = 0;
		while (i < armor.length) {
			if (armor[i] != "") {
				var current = armors[armors.indexOf(armor[i]) + 1];
				var total = total + current;

			}
			i = i + 1;
		}
		return total;
	}
	if (type == "deal") {
		var i = 0;
		var total = 0;
		while (i < armor.length) {
			if (armor[i] != "") {
				var current = armors[armors.indexOf(armor[i]) + 2];
				var total = total + current;
			}
			i = i + 1;
		}
		return total;
	}
}

function calcEnchants() {
	var i = 0;
	var total = 0;
	while (i < weaponEnchants.length) {
		var enchant = enchants[enchants.indexOf(weaponEnchants[i])];
		total = total + enchants[enchants.indexOf(enchant) + 1];
		i = i + 1;
	}
	return total;
}

function die() {
	health = 0;
	update("", "", "You died.")
	document.getElementById("baseControls").style.display = "none";
	document.getElementById("fightingControls").style.display = "none";
	document.getElementById("afterFightControls").style.display = "none";
	document.getElementById("selectionYesNo").style.display = "none";
}

console.log("1.7");