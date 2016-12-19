'use strict';

angular.module('cocjs').factory('Combat', function (SceneLib, $log, CoC, StatusAffects, kFLAGS, Utils, EngineCore, ItemType, MainView, PerkLib, Descriptors, ConsumableLib, WeaponLib, ArmorLib, OnLoadVariables, AppearanceDefs, ImageManager) {
	var Combat = {};
	Combat.endHpVictory = function() {
		CoC.monster.defeated_(true);
	};
	Combat.endLustVictory = function() {
		CoC.monster.defeated_(false);
	};
	Combat.endHpLoss = function() {
		CoC.monster.won_(true, false);
	};
	Combat.endLustLoss = function() {
		if (CoC.player.findStatusAffect(StatusAffects.Infested) >= 0 && CoC.flags[kFLAGS.CAME_WORMS_AFTER_COMBAT] === 0) {
			CoC.flags[kFLAGS.CAME_WORMS_AFTER_COMBAT] = 1;
			SceneLib.worms.infestOrgasm();
			CoC.monster.won_(false,true);
		} else {
			CoC.monster.won_(false,false);
		}
	};
	//combat is over. Clear shit out and go to main
	Combat.cleanupAfterCombat = function(nextObj, nextFunc) {
		if(nextObj && (!nextFunc || !_.isFunction(nextFunc))) {
			$log.error('Combat.cleanupAfterCombat called with invalid parameters', nextObj, nextFunc);
			return;
		}
		if (!nextFunc) {
			nextFunc = SceneLib.camp.returnToCampUseOneHour;
			nextObj = SceneLib.camp;
		}
		if (CoC.isInCombat()) {
			//clear status
			Combat.clearStatuses(false);
			//Clear itemswapping in case it hung somehow
			if(CoC.monster.HP < 1 || CoC.monster.lust > 99) { //Player won
				Combat.awardPlayer();
			} else { //Player lost
				if(CoC.monster.statusAffectv1(StatusAffects.Sparring) === 2) {
					MainView.outputText("The cow-girl has defeated you in a practice fight!", true);
					MainView.outputText("\n\nYou have to lean on Isabella's shoulder while the two of your hike back to camp.  She clearly won.", false);
					CoC.setInCombat(false);
					CoC.player.HP = 1;
					MainView.statsView.show();
					EngineCore.doNext(nextFunc);
					return;
				}
				//Next button is handled within the minerva loss function
				if(CoC.monster.findStatusAffect(StatusAffects.PeachLootLoss) >= 0) {
					CoC.setInCombat(false);
					CoC.player.HP = 1;
					MainView.statsView.show();
					return;
				}
				if(CoC.monster.short === "Ember") {
					CoC.setInCombat(false);
					CoC.player.HP = 1;
					MainView.statsView.show();
					EngineCore.doNext(nextFunc);
					return;
				}
				var temp = Utils.rand(10) + 1 + Math.round(CoC.monster.level / 2);
				if (SceneLib.dungeonCore.isInDungeon()) {
					temp += 20 + CoC.monster.level * 2;
				}
				if (temp > CoC.player.gems) {
					temp = CoC.player.gems;
				}
				var timePasses = CoC.monster.handleCombatLossText(SceneLib.dungeonCore.isInDungeon(), temp); //Allows monsters to customize the loss text and the amount of time lost
				CoC.player.gems -= temp;
				CoC.setInCombat(false);
				//BUNUS XPZ
				if(CoC.flags[kFLAGS.COMBAT_BONUS_XP_VALUE] > 0) {
					CoC.player.XP += CoC.flags[kFLAGS.COMBAT_BONUS_XP_VALUE];
					MainView.outputText("  Somehow you managed to gain " + CoC.flags[kFLAGS.COMBAT_BONUS_XP_VALUE] + " XP from the situation.");
					CoC.flags[kFLAGS.COMBAT_BONUS_XP_VALUE] = 0;
				}
				//Bonus lewts
				if (CoC.flags[kFLAGS.BONUS_ITEM_AFTER_COMBAT_ID] !== "") {
					MainView.outputText("  Somehow you came away from the encounter with " + ItemType.lookupItem(CoC.flags[kFLAGS.BONUS_ITEM_AFTER_COMBAT_ID]).longName + ".\n\n");
					SceneLib.inventory.takeItem(ItemType.lookupItem(CoC.flags[kFLAGS.BONUS_ITEM_AFTER_COMBAT_ID]), EngineCore.createCallBackFunction(SceneLib.camp, SceneLib.camp.returnToCamp, timePasses));
				} else {
					EngineCore.doNext(EngineCore.createCallBackFunction(SceneLib.camp, SceneLib.camp.returnToCamp, timePasses));
				}
			}
		} else { //Not actually in combat
			EngineCore.doNext(nextFunc);
		}
	};
	Combat.approachAfterKnockback = function() {
		MainView.clearOutput();
		MainView.outputText("You close the distance between you and " + CoC.monster.a + CoC.monster.short + " as quickly as possible.\n\n");
		CoC.player.removeStatusAffect(StatusAffects.KnockedBack);
		Combat.enemyAI();
		return;
	};
	Combat.canUseMagic = function() {
		return CoC.player.findStatusAffect(StatusAffects.ThroatPunch) < 0 && CoC.player.findStatusAffect(StatusAffects.WebSilence) < 0 && CoC.player.findStatusAffect(StatusAffects.GooArmorSilence) < 0;
	};
	Combat.combatMenu = function(newRound) { //If returning from a sub menu set newRound to false
		if(newRound === undefined) {
			newRound = true;
		}
		MainView.clearOutput();
		CoC.flags[kFLAGS.IN_COMBAT_USE_PLAYER_WAITED_FLAG] = 0;
		MainView.hideMenuButton(MainView.MENU_DATA);
		MainView.hideMenuButton(MainView.MENU_APPEARANCE);
		MainView.hideMenuButton(MainView.MENU_PERKS);
		EngineCore.hideUpDown();
		if (newRound) {
			Combat.combatStatusesUpdate(); //Update Combat Statuses
		}
		Combat.display();
		MainView.statsView.show();
		if (Combat.combatRoundOver()) {
			return;
		}
		EngineCore.menu();
		var attacks = Combat.normalAttack;
		var magic = (Combat.canUseMagic() ? Combat.magicMenu : null);
		var pSpecials = Combat.physicalSpecials;
		
		if (CoC.monster.findStatusAffect(StatusAffects.AttackDisabled) >= 0) {
			MainView.outputText("\n<b>Chained up as you are, you can't manage any real physical attacks!</b>");
			attacks = null;
		}
		if (CoC.monster.findStatusAffect(StatusAffects.PhysicalDisabled) >= 0) {
			MainView.outputText("<b>  Even physical special attacks are out of the question.</b>");
			pSpecials = null;
		}
		if (CoC.player.findStatusAffect(StatusAffects.KnockedBack) >= 0) {
			MainView.outputText("\n<b>You'll need to close some distance before you can use any physical attacks!</b>");
			EngineCore.addButton(0, "Approach", null, Combat.approachAfterKnockback);
			EngineCore.addButton(1, "Tease", null, Combat.teaseAttack);
			EngineCore.addButton(2, "Spells", null, Combat.magic);
			EngineCore.addButton(3, "Items", SceneLib.inventory, SceneLib.inventory.inventoryMenu);
			EngineCore.addButton(4, "Run", null, Combat.runAway);
			if (CoC.player.hasKeyItem("Bow") >= 0) {
				EngineCore.addButton(5, "Bow", null, Combat.fireBow);
			}
			EngineCore.addButton(6, "M. Specials", null, Combat.magicalSpecials);
			EngineCore.addButton(7, "Wait", null, Combat.wait);
			EngineCore.addButton(8, "Fantasize", null, Combat.fantasize);
		} else if (CoC.player.findStatusAffect(StatusAffects.IsabellaStunned) >= 0 || CoC.player.findStatusAffect(StatusAffects.Stunned) >= 0) {
			MainView.outputText("\n<b>You're too stunned to attack!</b>  All you can do is wait and try to recover!");
			EngineCore.addButton(0, "Recover", null, Combat.wait);
		} else if (CoC.player.findStatusAffect(StatusAffects.Whispered) >= 0) {
			MainView.outputText("\n<b>Your mind is too addled to focus on combat!</b>  All you can do is try and recover!");
			EngineCore.addButton(0, "Recover", null, Combat.wait);
		} else if (CoC.player.findStatusAffect(StatusAffects.Confusion) >= 0) {
			MainView.outputText("\nYou're too confused about who you are to try to attack!");
			EngineCore.addButton(0, "Recover", null, Combat.wait);
		} else if (CoC.player.findStatusAffect(StatusAffects.HarpyBind) >= 0 || CoC.player.findStatusAffect(StatusAffects.GooBind) >= 0 || CoC.player.findStatusAffect(StatusAffects.TentacleBind) >= 0 || CoC.player.findStatusAffect(StatusAffects.NagaBind) >= 0 || CoC.monster.findStatusAffect(StatusAffects.QueenBind) >= 0 || CoC.monster.findStatusAffect(StatusAffects.PCTailTangle) >= 0 || CoC.player.findStatusAffect(StatusAffects.HolliConstrict) >= 0 || CoC.player.findStatusAffect(StatusAffects.GooArmorBind) >= 0) {
			EngineCore.addButton(0, "Struggle", null, Combat.struggle);
			EngineCore.addButton(5, "Wait", null, Combat.wait);
		} else if (CoC.monster.findStatusAffect(StatusAffects.Constricted) >= 0) {
			EngineCore.addButton(0, "Squeeze", SceneLib.nagaScene, SceneLib.nagaScene.naggaSqueeze);
			EngineCore.addButton(1, "Tease", SceneLib.nagaScene, SceneLib.nagaScene.naggaTease);
			EngineCore.addButton(4, "Release", SceneLib.nagaScene, SceneLib.nagaScene.nagaLeggoMyEggo);
		} else if (CoC.player.findStatusAffect(StatusAffects.Bound) >= 0) {
			EngineCore.addButton(0, "Struggle", CoC.monster, CoC.monster.ceraphBindingStruggle);
			EngineCore.addButton(5, "Wait", CoC.monster, CoC.monster.ceraphBoundWait);
		} else if (CoC.monster.findStatusAffect(StatusAffects.MinotaurEntangled) >= 0) {
			MainView.outputText("\n<b>You're bound up in the minotaur lord's chains!  All you can do is try to struggle free!</b>");
			EngineCore.addButton(0, "Struggle", null, Combat.struggle);
			EngineCore.addButton(5, "Wait", null, Combat.wait);
		} else if (CoC.player.findStatusAffect(StatusAffects.UBERWEB) >= 0) {
			EngineCore.addButton(0, "Struggle", null, Combat.struggle);
			EngineCore.addButton(6, "M. Specials", null, Combat.magicalSpecials);
		} else if (CoC.player.findStatusAffect(StatusAffects.Chokeslam) >= 0) {
			EngineCore.addButton(0, "Struggle", CoC.monster, CoC.monster.chokeSlamStruggle);
			EngineCore.addButton(5, "Wait", CoC.monster, CoC.monster.chokeSlamWait);
		} else if (CoC.player.findStatusAffect(StatusAffects.Titsmother) >= 0) {
			EngineCore.addButton(0, "Struggle", CoC.monster, CoC.monster.titSmotherStruggle);
			EngineCore.addButton(5, "Wait", CoC.monster, CoC.monster.titSmotherWait);
		} else if (CoC.player.findStatusAffect(StatusAffects.Tentagrappled) >= 0) {
			MainView.outputText("\n<b>The demonesses tentacles are constricting your limbs!</b>");
			EngineCore.addButton(0, "Struggle", CoC.monster, CoC.monster.grappleStruggle);
			EngineCore.addButton(5, "Wait", CoC.monster, CoC.monster.grappleWait);
		} else { //REGULAR MENU
			EngineCore.addButton(0, "Attack", null, attacks);
			EngineCore.addButton(1, "Tease", null, Combat.teaseAttack);
			EngineCore.addButton(2, "Spells", null, magic);
			EngineCore.addButton(3, "Items", SceneLib.inventory, SceneLib.inventory.inventoryMenu);
			EngineCore.addButton(4, "Run", null, Combat.runAway);
			EngineCore.addButton(5, "P. Specials", null, pSpecials);
			EngineCore.addButton(6, "M. Specials", null, Combat.magicalSpecials);
			EngineCore.addButton(7, (CoC.monster.findStatusAffect(StatusAffects.Level) >= 0 ? "Climb" : "Wait"), null, Combat.wait);
			EngineCore.addButton(8, "Fantasize", null, Combat.fantasize);
		}
	};
	Combat.teaseAttack = function() {
		if (CoC.monster.lustVuln === 0) {
			MainView.clearOutput();
			MainView.outputText("You try to tease " + CoC.monster.a + CoC.monster.short + " with your body, but it doesn't have any effect on " + CoC.monster.pronoun2 + ".\n\n");
			Combat.enemyAI();
		} else if (CoC.monster.short === "worms") { //Worms are immune!
			MainView.clearOutput();
			MainView.outputText("Thinking to take advantage of its humanoid form, you wave your cock and slap your ass in a rather lewd manner. However, the creature fails to react to your suggestive actions.\n\n");
			Combat.enemyAI();
		} else {
			Combat.tease();
			if (!Combat.combatRoundOver()) {
				Combat.enemyAI();
			}
		}
	};
	Combat.normalAttack = function() {
		MainView.clearOutput();
		Combat.attack();
	};
	Combat.packAttack = function() {
		if (CoC.player.spe - CoC.monster.spe > 0 && Math.floor(Math.random() * (((CoC.player.spe - CoC.monster.spe) / 4) + 80)) > 80) { //Determine if dodged!
			MainView.outputText("You duck, weave, and dodge.  Despite their best efforts, the throng of demons only hit the air and each other.");
		} else if (CoC.player.findPerk(PerkLib.Evade) >= 0 && Utils.rand(100) < 10) { //Determine if evaded
			MainView.outputText("Using your skills at evading attacks, you anticipate and sidestep " + CoC.monster.a + CoC.monster.short + "' attacks.");
		} else if (CoC.player.findPerk(PerkLib.Misdirection) >= 0 && Utils.rand(100) < 15 && CoC.player.armorName === "red, high-society bodysuit") { //("Misdirection"
			MainView.outputText("Using Raphael's teachings, you anticipate and sidestep " + CoC.monster.a + CoC.monster.short + "' attacks.");
		} else if (CoC.player.findPerk(PerkLib.Flexibility) >= 0 && Utils.rand(100) < 6) { //Determine if cat'ed
			MainView.outputText("With your incredible flexibility, you squeeze out of the way of " + CoC.monster.a + CoC.monster.short + "' attacks.");
		} else {
			var temp = Math.round((CoC.monster.str + CoC.monster.weaponAttack) - Utils.rand(CoC.player.tou) - CoC.player.armorDef); //Determine damage - str modified by enemy toughness!
			if (temp <= 0) {
				temp = 0;
				if (!CoC.monster.plural) {
					MainView.outputText("You deflect and block every " + CoC.monster.weaponVerb + " " + CoC.monster.a + CoC.monster.short + " throw at you.");
				} else {
					MainView.outputText("You deflect " + CoC.monster.a + CoC.monster.short + " " + CoC.monster.weaponVerb + ".");
				}
			} else {
				temp = Combat.takeDamage(temp);
				if (temp <= 5) {
					MainView.outputText("You are struck a glancing blow by " + CoC.monster.a + CoC.monster.short + "! (" + temp + ")");
				} else if (temp <= 10) {
					MainView.outputText(CoC.monster.getCapitalA() + CoC.monster.short + " wound you! (" + temp + ")");
				} else if (temp <= 20) {
					MainView.outputText(CoC.monster.getCapitalA() + CoC.monster.short + " stagger you with the force of " + CoC.monster.pronoun3 + " " + CoC.monster.weaponVerb + "s! (" + temp + ")");
				} else {
					MainView.outputText(CoC.monster.getCapitalA() + CoC.monster.short + " <b>mutilates</b> you with powerful fists and " + CoC.monster.weaponVerb + "s! (" + temp + ")");
				}
			}
			MainView.statsView.show();
			MainView.outputText("\n");
		}
		Combat.combatRoundOver();
	};
	Combat.lustAttack = function() {
		if (CoC.player.lust < 35) {
			MainView.outputText("The " + CoC.monster.short + " press in close against you and although they fail to hit you with an attack, the sensation of their skin rubbing against yours feels highly erotic.");
		} else if (CoC.player.lust < 65) {
			MainView.outputText("The push of the " + CoC.monster.short + "' sweaty, seductive bodies sliding over yours is deliciously arousing and you feel your ");
			if (CoC.player.cocks.length > 0) {
				MainView.outputText(CoC.player.multiCockDescriptLight() + " hardening ");
			} else if (CoC.player.vaginas.length > 0) {
				MainView.outputText(Descriptors.vaginaDescript(0) + " get wetter ");
			}
			MainView.outputText("in response to all the friction.");
		} else {
			MainView.outputText("As the " + CoC.monster.short + " mill around you, their bodies rub constantly over yours, and it becomes harder and harder to keep your thoughts on the fight or resist reaching out to touch a well lubricated cock or pussy as it slips past.  You keep subconsciously moving your ");
			if (CoC.player.gender === 1) {
				MainView.outputText(CoC.player.multiCockDescriptLight() + " towards the nearest inviting hole.");
			}
			if (CoC.player.gender === 2) {
				MainView.outputText(Descriptors.vaginaDescript(0) + " towards the nearest swinging cock.");
			}
			if (CoC.player.gender === 3) {
				MainView.outputText("aching cock and thirsty pussy towards the nearest thing willing to fuck it.");
			}
			if (CoC.player.gender === 0) {
				MainView.outputText("groin, before remember there is nothing there to caress.");
			}
		}
		EngineCore.dynStats("lus", 10 + CoC.player.sens / 10);
		Combat.combatRoundOver();
	};
	Combat.wait = function() {
		//Gain fatigue if not fighting sand tarps
		var damage = 0;
		if (CoC.monster.findStatusAffect(StatusAffects.Level) < 0) {
			EngineCore.fatigue(-5);
		}
		CoC.flags[kFLAGS.IN_COMBAT_USE_PLAYER_WAITED_FLAG] = 1;
		if (CoC.monster.findStatusAffect(StatusAffects.PCTailTangle) >= 0) {
			CoC.monster.kitsuneWait();
		} else if (CoC.monster.findStatusAffect(StatusAffects.Level) >= 0) {
			CoC.monster.sandTrapWait();
		} else if (CoC.monster.findStatusAffect(StatusAffects.MinotaurEntangled) >= 0) {
			MainView.clearOutput();
			MainView.outputText("You sigh and relax in the chains, eying the well-endowed minotaur as you await whatever rough treatment he desires to give.  His musky, utterly male scent wafts your way on the wind, and you feel droplets of your lust dripping down your thighs.  You lick your lips as you watch the pre-cum drip from his balls, eager to get down there and worship them.  Why did you ever try to struggle against this fate?\n\n");
			EngineCore.dynStats("lus", 30 + Utils.rand(5), "resisted", false);
			Combat.enemyAI();
		} else if (CoC.player.findStatusAffect(StatusAffects.Whispered) >= 0) {
			MainView.clearOutput();
			MainView.outputText("You shake off the mental compulsions and ready yourself to fight!\n\n");
			CoC.player.removeStatusAffect(StatusAffects.Whispered);
			Combat.enemyAI();
		} else if (CoC.player.findStatusAffect(StatusAffects.HarpyBind) >= 0) {
			MainView.clearOutput();
			damage = 80 + Utils.rand(40);
			damage = Combat.takeDamage(damage);
			MainView.outputText("The brood continues to hammer away at your defenseless self. (" + damage + ")");
			Combat.combatRoundOver();
		} else if (CoC.monster.findStatusAffect(StatusAffects.QueenBind) >= 0) {
			SceneLib.dungeonHelSupplimental.ropeStruggles(true);
		} else if (CoC.player.findStatusAffect(StatusAffects.GooBind) >= 0) {
			MainView.clearOutput();
			MainView.outputText("You writhe uselessly, trapped inside the goo girl's warm, seething body. Darkness creeps at the edge of your vision as you are lulled into surrendering by the rippling vibrations of the girl's pulsing body around yours.");
			damage = Combat.takeDamage(0.35 * CoC.player.maxHP());
			MainView.outputText(" (" + damage + ")");
			Combat.combatRoundOver();
		} else if (CoC.player.findStatusAffect(StatusAffects.GooArmorBind) >= 0) {
			MainView.clearOutput();
			MainView.outputText("Suddenly, the goo-girl leaks half-way out of her heavy armor and lunges at you. You attempt to dodge her attack, but she doesn't try and hit you - instead, she wraps around you, pinning your arms to your chest. More and more goo latches onto you - you'll have to fight to get out of this.");
			CoC.player.addStatusValue(StatusAffects.GooArmorBind, 1, 1);
			if (CoC.player.statusAffectv1(StatusAffects.GooArmorBind) >= 5) {
				if (CoC.monster.findStatusAffect(StatusAffects.Spar) >= 0) {
					SceneLib.valeria.pcWinsValeriaSparDefeat();
				} else {
					SceneLib.dungeonHelSupplimental.gooArmorBeatsUpPC();
				}
				return;
			}
			Combat.combatRoundOver();
		} else if (CoC.player.findStatusAffect(StatusAffects.NagaBind) >= 0) {
			MainView.clearOutput();
			MainView.outputText("The naga's grip on you tightens as you relax into the stimulating pressure.");
			EngineCore.dynStats("lus", CoC.player.sens / 5 + 5);
			Combat.takeDamage(5 + Utils.rand(5));
			Combat.combatRoundOver();
		} else if (CoC.player.findStatusAffect(StatusAffects.HolliConstrict) >= 0) {
			CoC.monster.waitForHolliConstrict(true);
		} else if (CoC.player.findStatusAffect(StatusAffects.TentacleBind) >= 0) {
			MainView.clearOutput();
			if (CoC.player.cocks.length > 0) {
				MainView.outputText("The creature continues spiraling around your cock, sending shivers up and down your body. You must escape or this creature will overwhelm you!");
			} else if (CoC.player.hasVagina()) {
				MainView.outputText("The creature continues sucking your clit and now has latched two more suckers on your nipples, amplifying your growing lust. You must escape or you will become a mere toy to this thing!");
			} else {
				MainView.outputText("The creature continues probing at your asshole and has now latched " + Utils.num2Text(CoC.player.totalNipples()) + " more suckers onto your nipples, amplifying your growing lust.  You must escape or you will become a mere toy to this thing!");
			}
			EngineCore.dynStats("lus", (8 + CoC.player.sens / 10));
			Combat.combatRoundOver();
		} else if (CoC.player.findStatusAffect(StatusAffects.IsabellaStunned) >= 0) {
			MainView.clearOutput();
			MainView.outputText("You wobble about for some time but manage to recover. Isabella capitalizes on your wasted time to act again.\n\n");
			CoC.player.removeStatusAffect(StatusAffects.IsabellaStunned);
			Combat.enemyAI();
		} else if (CoC.player.findStatusAffect(StatusAffects.Stunned) >= 0) {
			MainView.clearOutput();
			MainView.outputText("You wobble about, stunned for a moment.  After shaking your head, you clear the stars from your vision, but by then you've squandered your chance to act.\n\n");
			CoC.player.removeStatusAffect(StatusAffects.Stunned);
			Combat.enemyAI();
		} else if (CoC.player.findStatusAffect(StatusAffects.Confusion) >= 0) {
			MainView.clearOutput();
			MainView.outputText("You shake your head and file your memories in the past, where they belong.  It's time to fight!\n\n");
			CoC.player.removeStatusAffect(StatusAffects.Confusion);
			Combat.enemyAI();
		} else if (CoC.monster.handlePlayerWait) {
			MainView.clearOutput();
			MainView.outputText("You decide not to take any action this round.\n\n");
			CoC.monster.handlePlayerWait();
			Combat.enemyAI();
		} else {
			MainView.clearOutput();
			MainView.outputText("You decide not to take any action this round.\n\n");
			Combat.enemyAI();
		}
	};
	Combat.struggle = function() {
		if (CoC.monster.findStatusAffect(StatusAffects.MinotaurEntangled) >= 0) {
			MainView.clearOutput();
			if (CoC.player.str / 9 + Utils.rand(20) + 1 >= 15) {
				MainView.outputText("Utilizing every ounce of your strength and cunning, you squirm wildly, shrugging through weak spots in the chain's grip to free yourself!  Success!");
				CoC.monster.removeStatusAffect(StatusAffects.MinotaurEntangled);
				MainView.outputText("\n\n\"<i>No!  You fool!  You let her get away!  Hurry up and finish her up!  I need my serving!</i>\"  The succubus spits out angrily.\n\n");
				Combat.combatRoundOver();
			} else { //Struggle Free Fail*
				MainView.outputText("You wiggle and struggle with all your might, but the chains remain stubbornly tight, binding you in place.  Damnit!  You can't lose like this!\n\n");
				Combat.enemyAI();
			}
		} else if (CoC.monster.findStatusAffect(StatusAffects.PCTailTangle) >= 0) {
			CoC.monster.kitsuneStruggle();
		} else if (CoC.player.findStatusAffect(StatusAffects.HolliConstrict) >= 0) {
			CoC.monster.struggleOutOfHolli();
		} else if (CoC.monster.findStatusAffect(StatusAffects.QueenBind) >= 0) {
			SceneLib.dungeonHelSupplimental.ropeStruggles();
		} else if (CoC.player.findStatusAffect(StatusAffects.GooBind) >= 0) {
			MainView.clearOutput();
			//[Struggle](successful) :
			if (Utils.rand(3) === 0 || Utils.rand(80) < CoC.player.str) {
				MainView.outputText("You claw your fingers wildly within the slime and manage to brush against her heart-shaped nucleus. The girl silently gasps and loses cohesion, allowing you to pull yourself free while she attempts to solidify.");
				CoC.player.removeStatusAffect(StatusAffects.GooBind);
			} else { //Failed struggle
				MainView.outputText("You writhe uselessly, trapped inside the goo girl's warm, seething body. Darkness creeps at the edge of your vision as you are lulled into surrendering by the rippling vibrations of the girl's pulsing body around yours.");
				MainView.outputText(" (" + Combat.takeDamage(0.15 * CoC.player.maxHP()) + ")", false);
			}
			Combat.combatRoundOver();
		} else if (CoC.player.findStatusAffect(StatusAffects.HarpyBind) >= 0) {
			SceneLib.dungeonHelSupplimental.harpyHordeGangBangStruggle();
		} else if (CoC.player.findStatusAffect(StatusAffects.GooArmorBind) >= 0) {
			SceneLib.dungeonHelSupplimental.struggleAtGooBind();
		} else if (CoC.player.findStatusAffect(StatusAffects.UBERWEB) >= 0) {
			MainView.clearOutput();
			MainView.outputText("You claw your way out of the webbing while Kiha does her best to handle the spiders single-handedly!\n\n");
			CoC.player.removeStatusAffect(StatusAffects.UBERWEB);
			Combat.enemyAI();
		} else if (CoC.player.findStatusAffect(StatusAffects.NagaBind) >= 0) {
			MainView.clearOutput();
			if (Utils.rand(3) === 0 || Utils.rand(80) < CoC.player.str / 1.5) {
				MainView.outputText("You wriggle and squirm violently, tearing yourself out from within the naga's coils.");
				CoC.player.removeStatusAffect(StatusAffects.NagaBind);
			} else {
				MainView.outputText("The naga's grip on you tightens as you struggle to break free from the stimulating pressure.");
				EngineCore.dynStats("lus", CoC.player.sens / 10 + 2);
				Combat.takeDamage(7 + Utils.rand(5));
			}
			Combat.combatRoundOver();
		} else {
			MainView.clearOutput();
			MainView.outputText("You struggle with all of your might to free yourself from the tentacles before the creature can fulfill whatever unholy desire it has for you.\n");
			//33% chance to break free + up to 50% chance for strength
			if (Utils.rand(3) === 0 || Utils.rand(80) < CoC.player.str / 2) {
				MainView.outputText("As the creature attempts to adjust your position in its grip, you free one of your " + CoC.player.legs() + " and hit the beast in its beak, causing it to let out an inhuman cry and drop you to the ground smartly.\n\n");
				CoC.player.removeStatusAffect(StatusAffects.TentacleBind);
				CoC.monster.createStatusAffect(StatusAffects.TentacleCoolDown, 3, 0, 0, 0);
				Combat.enemyAI();
			} else { //Fail to break free
				MainView.outputText("Despite trying to escape, the creature only tightens its grip, making it difficult to breathe.\n\n");
				Combat.takeDamage(5);
				if (CoC.player.cocks.length > 0) {
					MainView.outputText("The creature continues spiraling around your cock, sending shivers up and down your body. You must escape or this creature will overwhelm you!");
				} else if (CoC.player.hasVagina()) {
					MainView.outputText("The creature continues sucking your clit and now has latched two more suckers on your nipples, amplifying your growing lust. You must escape or you will become a mere toy to this thing!");
				} else {
					MainView.outputText("The creature continues probing at your asshole and has now latched " + Utils.num2Text(CoC.player.totalNipples()) + " more suckers onto your nipples, amplifying your growing lust.  You must escape or you will become a mere toy to this thing!");
				}
				EngineCore.dynStats("lus", (3 + CoC.player.sens / 10 + CoC.player.lib / 20));
				Combat.combatRoundOver();
			}
		}
	};
	Combat.fireBow = function() {
		MainView.clearOutput();
		if (CoC.player.fatigue + EngineCore.physicalCost(25) > 100) {
			MainView.outputText("You're too fatigued to fire the bow!");
			EngineCore.menu();
			EngineCore.addButton(0, "Next", Combat.combatMenu, false);
			return;
		}
		if (CoC.monster.findStatusAffect(StatusAffects.BowDisabled) >= 0) {
			MainView.outputText("You can't use your bow right now!");
			EngineCore.menu();
			EngineCore.addButton(0, "Next", Combat.combatMenu, false);
			return;
		}
		EngineCore.fatigue(25, 2);
		//Keep logic sane if this attack brings victory
		//Amily!
		if (CoC.monster.findStatusAffect(StatusAffects.Concentration) >= 0) {
			MainView.outputText("Amily easily glides around your attack thanks to her complete concentration on your movements.\n\n");
			Combat.enemyAI();
			return;
		}
		//Prep messages vary by skill.
		if (CoC.player.statusAffectv1(StatusAffects.Kelt) < 30) {
			MainView.outputText("Fumbling a bit, you nock an arrow and fire!\n");
		} else if (CoC.player.statusAffectv1(StatusAffects.Kelt) < 50) {
			MainView.outputText("You pull an arrow and fire it at " + CoC.monster.a + CoC.monster.short + "!\n");
		} else if (CoC.player.statusAffectv1(StatusAffects.Kelt) < 80) {
			MainView.outputText("With one smooth motion you draw, nock, and fire your deadly arrow at your opponent!\n");
		} else if (CoC.player.statusAffectv1(StatusAffects.Kelt) <= 99) {
			MainView.outputText("In the blink of an eye you draw and fire your bow directly at " + CoC.monster.a + CoC.monster.short + ".\n");
		} else {
			MainView.outputText("You casually fire an arrow at " + CoC.monster.a + CoC.monster.short + " with supreme skill.\n");
			//Keep it from going over 100
			CoC.player.changeStatusValue(StatusAffects.Kelt, 1, 100);
		}
		if (CoC.monster.findStatusAffect(StatusAffects.Sandstorm) >= 0 && Utils.rand(10) > 1) {
			MainView.outputText("Your shot is blown off target by the tornado of sand and wind.  Damn!\n\n");
			Combat.enemyAI();
			return;
		}
		//[Bow Response]
		if (CoC.monster.short === "Isabella") {
			if (CoC.monster.findStatusAffect(StatusAffects.Blind) >= 0) {
				MainView.outputText("Isabella hears the shot and turns her shield towards it, completely blocking it with her wall of steel.\n\n");
			} else {
				MainView.outputText("You arrow thunks into Isabella's shield, completely blocked by the wall of steel.\n\n");
			}
			if (SceneLib.isabellaFollowerScene.isabellaAccent()) {
				MainView.outputText("\"<i>You remind me of ze horse-people.  They cannot deal vith mein shield either!</i>\" cheers Isabella.\n\n");
			} else {
				MainView.outputText("\"<i>You remind me of the horse-people.  They cannot deal with my shield either!</i>\" cheers Isabella.\n\n");
			}
			Combat.enemyAI();
			return;
		}
		//worms are immune
		if (CoC.monster.short === "worms") {
			MainView.outputText("The arrow slips between the worms, sticking into the ground.\n\n");
			Combat.enemyAI();
			return;
		}
		//Vala miss chance!
		if (CoC.monster.short === "Vala" && Utils.rand(10) < 7) {
			MainView.outputText("Vala flaps her wings and twists her body. Between the sudden gust of wind and her shifting of position, the arrow goes wide.\n\n");
			Combat.enemyAI();
			return;
		}
		//Blind miss chance
		if (CoC.player.findStatusAffect(StatusAffects.Blind) >= 0) {
			MainView.outputText("The arrow hits something, but blind as you are, you don't have a chance in hell of hitting anything with a bow.\n\n");
			Combat.enemyAI();
			return;
		}
		//Miss chance 10% based on speed + 10% based on int + 20% based on skill
		if (CoC.monster.short !== "pod" && CoC.player.spe / 10 + CoC.player.inte / 10 + CoC.player.statusAffectv1(StatusAffects.Kelt) / 5 + 60 < Utils.rand(101)) {
			MainView.outputText("The arrow goes wide, disappearing behind your foe.\n\n");
			Combat.enemyAI();
			return;
		}
		//Hit!  Damage calc! 20 +
		var damage = Math.floor((20 + CoC.player.str / 3 + CoC.player.statusAffectv1(StatusAffects.Kelt) / 1.2) + CoC.player.spe / 3 - Utils.rand(CoC.monster.tou) - CoC.monster.armorDef);
		if (damage < 0) {
			damage = 0;
		}
		if (damage === 0) {
			if (CoC.monster.inte > 0) {
				MainView.outputText(CoC.monster.getCapitalA() + CoC.monster.short + " shrugs as the arrow bounces off them harmlessly.\n\n");
			} else {
				MainView.outputText("The arrow bounces harmlessly off " + CoC.monster.a + CoC.monster.short + ".\n\n");
			}
			Combat.enemyAI();
			return;
		}
		if (CoC.monster.short === "pod") {
			MainView.outputText("The arrow lodges deep into the pod's fleshy wall");
		} else if (CoC.monster.plural) {
			MainView.outputText(CoC.monster.getCapitalA() + CoC.monster.short + " look down at the arrow that now protrudes from one of " + CoC.monster.pronoun3 + " bodies");
		} else {
			MainView.outputText(CoC.monster.getCapitalA() + CoC.monster.short + " looks down at the arrow that now protrudes from " + CoC.monster.pronoun3 + " body");
		}
		if (CoC.player.findPerk(PerkLib.HistoryFighter) >= 0) {
			damage *= 1.1;
		}
		damage = Combat.doDamage(damage);
		CoC.monster.lust -= 20;
		if (CoC.monster.lust < 0) {
			CoC.monster.lust = 0;
		}
		if (CoC.monster.HP <= 0) {
			if (CoC.monster.short === "pod") {
				MainView.outputText(". (" + damage + ")\n\n");
			} else if (CoC.monster.plural) {
				MainView.outputText(" and stagger, collapsing onto each other from the wounds you've inflicted on " + CoC.monster.pronoun2 + ".  (" + damage + ")\n\n");
			} else {
				MainView.outputText(" and staggers, collapsing from the wounds you've inflicted on " + CoC.monster.pronoun2 + ".  (" + damage + ")\n\n");
			}
			EngineCore.doNext( Combat, Combat.endHpVictory);
			return;
		} else {
			MainView.outputText(".  It's clearly very painful. (" + damage + ")\n\n");
		}
		Combat.enemyAI();
	};
	Combat.fireBreathMenu = function() {
		MainView.clearOutput();
		MainView.outputText("Which of your special fire-breath attacks would you like to use?");
		EngineCore.choices("Akbal's", null, Combat.fireballuuuuu, "Hellfire", null, Combat.hellFire, "Dragonfire", null, Combat.dragonBreath, "", null, null, "Back", null, MainView.playerMenu);
	};
	//Fantasize
	Combat.fantasize = function() {
		var temp2 = 0;
		EngineCore.doNext( Combat, Combat.combatMenu);
		MainView.outputText("", true);
		if(CoC.player.armorName === "goo armor") {
			MainView.outputText("As you fantasize, you feel Valeria rubbing her gooey body all across your sensitive skin");
			if(CoC.player.gender > 0) {
				MainView.outputText(" and genitals");
			}
			MainView.outputText(", arousing you even further.\n");
			temp2 = 25 + Utils.rand(CoC.player.lib / 8 + CoC.player.cor / 8);
		} else if(CoC.player.balls > 0 && CoC.player.ballSize >= 10 && Utils.rand(2) === 0) {
			MainView.outputText("You daydream about fucking " + CoC.monster.a + CoC.monster.short + ", feeling your balls swell with seed as you prepare to fuck " + CoC.monster.pronoun2 + " full of cum.\n", false);
			temp2 = 5 + Utils.rand(CoC.player.lib / 8 + CoC.player.cor / 8);
			MainView.outputText("You aren't sure if it's just the fantasy, but your " + Descriptors.ballsDescriptLight() + " do feel fuller than before...\n", false);
			CoC.player.hoursSinceCum += 50;
		} else if(CoC.player.biggestTitSize() >= 6 && Utils.rand(2) === 0) {
			MainView.outputText("You fantasize about grabbing " + CoC.monster.a + CoC.monster.short + " and shoving " + CoC.monster.pronoun2 + " in between your jiggling mammaries, nearly suffocating " + CoC.monster.pronoun2 + " as you have your way.\n", false);
			temp2 = 5 + Utils.rand(CoC.player.lib / 8 + CoC.player.cor / 8);
		} else if(CoC.player.biggestLactation() >= 6 && Utils.rand(2) === 0) {
			MainView.outputText("You fantasize about grabbing " + CoC.monster.a + CoC.monster.short + " and forcing " + CoC.monster.pronoun2 + " against a " + Descriptors.nippleDescript(0) + ", and feeling your milk let down.  The desire to forcefeed SOMETHING makes your nipples hard and moist with milk.\n", false);
			temp2 = 5 + Utils.rand(CoC.player.lib / 8 + CoC.player.cor / 8);
		} else {
			MainView.outputText("You fill your mind with perverted thoughts about " + CoC.monster.a + CoC.monster.short + ", picturing " + CoC.monster.pronoun2 + " in all kinds of perverse situations with you.\n", true);	
			temp2 = 10 + Utils.rand(CoC.player.lib / 5 + CoC.player.cor / 8);
		}
		if(temp2 >= 20) {
			MainView.outputText("The fantasy is so vivid and pleasurable you wish it was happening now.  You wonder if " + CoC.monster.a + CoC.monster.short + " can tell what you were thinking.\n\n", false);
		} else {
			MainView.outputText("\n", false);
		}
		EngineCore.dynStats("lus", temp2, "resisted", false);
		if(CoC.player.lust > 99) {
			if(CoC.monster.short === "pod") {
				MainView.outputText("<b>You nearly orgasm, but the terror of the situation reasserts itself, muting your body's need for release.  If you don't escape soon, you have no doubt you'll be too fucked up to ever try again!</b>\n\n", false);
				CoC.player.lust = 99;
				EngineCore.dynStats("lus", -25);
			} else {
				EngineCore.doNext( Combat, Combat.endLustLoss);
				return;
			}
		}
		Combat.enemyAI();
	};
	//Mouf Attack
	// (Similar to the bow attack, high damage but it raises your fatigue).
	Combat.bite = function() {
		if(CoC.player.fatigue + EngineCore.physicalCost(25) > 100) {
			MainView.outputText("You're too fatigued to use your shark-like jaws!", true);
			EngineCore.menu();
			EngineCore.addButton(0, "Next", Combat.combatMenu, false);
			return;
		}
		//Worms are special
		if(CoC.monster.short === "worms") {
			MainView.outputText("There is no way those are going anywhere near your mouth!\n\n", true);
			EngineCore.menu();
			EngineCore.addButton(0, "Next", Combat.combatMenu, false);
			return;
		}
		EngineCore.fatigue(25,2);
		//Amily!
		if(CoC.monster.findStatusAffect(StatusAffects.Concentration) >= 0) {
			MainView.outputText("Amily easily glides around your attack thanks to her complete concentration on your movements.\n\n", true);
			Combat.enemyAI();
			return;
		}
		MainView.outputText("You open your mouth wide, your shark teeth extending out. Snarling with hunger, you lunge at your opponent, set to bite right into them!  ", true);
		if(CoC.player.findStatusAffect(StatusAffects.Blind) >= 0) {
			MainView.outputText("In hindsight, trying to bite someone while blind was probably a bad idea... ", false);
		}
		var damage = 0;
		//Determine if dodged!
		if((CoC.player.findStatusAffect(StatusAffects.Blind) >= 0 && Utils.rand(3) !== 0) || (CoC.monster.spe - CoC.player.spe > 0 && Math.floor(Math.random()*(((CoC.monster.spe-CoC.player.spe)/4)+80)) > 80)) {
			if(CoC.monster.spe - CoC.player.spe < 8) {
				MainView.outputText(CoC.monster.getCapitalA() + CoC.monster.short + " narrowly avoids your attack!", false);
			}
			if(CoC.monster.spe - CoC.player.spe >= 8 && CoC.monster.spe-CoC.player.spe < 20) {
				MainView.outputText(CoC.monster.getCapitalA() + CoC.monster.short + " dodges your attack with superior quickness!", false);
			}
			if(CoC.monster.spe - CoC.player.spe >= 20) {
				MainView.outputText(CoC.monster.getCapitalA() + CoC.monster.short + " deftly avoids your slow attack.", false);
			}
			MainView.outputText("\n\n", false);
			Combat.enemyAI();
			return;
		}
		//Determine damage - str modified by enemy toughness!
		damage = Math.floor((CoC.player.str + 45) - Utils.rand(CoC.monster.tou) - CoC.monster.armorDef);
		
		//Deal damage and update based on perks
		if(damage > 0) {
			if(CoC.player.findPerk(PerkLib.HistoryFighter) >= 0) {
				damage *= 1.1;
			}
			damage = Combat.doDamage(damage);
		}
		if(damage <= 0) {
			damage = 0;
			MainView.outputText("Your bite is deflected or blocked by " + CoC.monster.a + CoC.monster.short + ".", false);
		} else if(damage < 10) {
			MainView.outputText("You bite doesn't do much damage to " + CoC.monster.a + CoC.monster.short + "! (" + damage + ")", false);
		} else if(damage < 20) {
			MainView.outputText("You seriously wound " + CoC.monster.a + CoC.monster.short + " with your bite! (" + damage + ")", false);
		} else if(damage < 30) {
			MainView.outputText("Your bite staggers " + CoC.monster.a + CoC.monster.short + " with its force. (" + damage + ")", false);
		} else {
			MainView.outputText("Your powerful bite <b>mutilates</b> " + CoC.monster.a + CoC.monster.short + "! (" + damage + ")", false);
		}
		MainView.outputText("\n\n", false);
		//Kick back to main if no damage occured!
		if(CoC.monster.HP > 0 && CoC.monster.lust < 100) {
			Combat.enemyAI();
		} else {
			if(CoC.monster.HP <= 0) {
				EngineCore.doNext( Combat, Combat.endHpVictory);
			} else {
				EngineCore.doNext( Combat, Combat.endLustVictory);
			}
		}
	};
	Combat.fatigueRecovery = function() {
		EngineCore.fatigue(-1);
		if(CoC.player.findPerk(PerkLib.EnlightenedNinetails) >= 0 || CoC.player.findPerk(PerkLib.CorruptedNinetails) >= 0) {
			EngineCore.fatigue(-(1 + Utils.rand(3)));
		}
	};
	//ATTACK
	Combat.attack = function() {
		if(CoC.player.findStatusAffect(StatusAffects.FirstAttack) < 0) {
			MainView.outputText("", true);
			Combat.fatigueRecovery();
		}
		if(CoC.player.findStatusAffect(StatusAffects.Sealed) >= 0 && CoC.player.statusAffectv2(StatusAffects.Sealed) === 0) {
			MainView.outputText("You attempt to attack, but at the last moment your body wrenches away, preventing you from even coming close to landing a blow!  The kitsune's seals have made normal attack impossible!  Maybe you could try something else?\n\n", false);
			Combat.enemyAI();
			return;
		}
		if(CoC.flags[kFLAGS.PC_FETISH] >= 3 && !SceneLib.urtaQuest.isUrta()) {
			MainView.outputText("You attempt to attack, but at the last moment your body wrenches away, preventing you from even coming close to landing a blow!  Ceraph's piercings have made normal attack impossible!  Maybe you could try something else?\n\n", false);
			Combat.enemyAI();
			return;
		}
		//Amily!
		if(CoC.monster.findStatusAffect(StatusAffects.Concentration) >= 0) {
			MainView.outputText("Amily easily glides around your attack thanks to her complete concentration on your movements.\n\n", true);
			Combat.enemyAI();
			return;
		}
		if(CoC.monster.findStatusAffect(StatusAffects.Level) >= 0 && CoC.player.findStatusAffect(StatusAffects.FirstAttack) < 0) {
			MainView.outputText("It's all or nothing!  With a bellowing cry you charge down the treacherous slope and smite the sandtrap as hard as you can!  ");
			CoC.monster.trapLevel(-4);
		}
		if(CoC.player.findPerk(PerkLib.DoubleAttack) >= 0 && CoC.player.spe >= 50 && CoC.flags[kFLAGS.DOUBLE_ATTACK_STYLE] < 2) {
			if(CoC.player.findStatusAffect(StatusAffects.FirstAttack) >= 0) {
				CoC.player.removeStatusAffect(StatusAffects.FirstAttack);
			} else {
				if(CoC.flags[kFLAGS.DOUBLE_ATTACK_STYLE] === 0) { //Always!
					CoC.player.createStatusAffect(StatusAffects.FirstAttack,0,0,0,0);
				} else if(CoC.player.str < 61 && CoC.flags[kFLAGS.DOUBLE_ATTACK_STYLE] === 1) { //Alternate!
					CoC.player.createStatusAffect(StatusAffects.FirstAttack,0,0,0,0);
				}
			}
		} else if(SceneLib.urtaQuest.isUrta()) { //"Brawler perk". Urta only. Thanks to Fenoxo for pointing this out... Even though that should have been obvious :<
			//Urta has fists and the Brawler perk. Don't check for that because Urta can't drop her fists or lose the perk!
			if(CoC.player.findStatusAffect(StatusAffects.FirstAttack) >= 0) {
				CoC.player.removeStatusAffect(StatusAffects.FirstAttack);
			} else {
				CoC.player.createStatusAffect(StatusAffects.FirstAttack,0,0,0,0);
				MainView.outputText("Utilizing your skills as a bareknuckle brawler, you make two attacks!\n");
			}
		}
		//Blind
		if(CoC.player.findStatusAffect(StatusAffects.Blind) >= 0) {
			MainView.outputText("You attempt to attack, but as blinded as you are right now, you doubt you'll have much luck!  ", false);
		}
		if(CoC.monster.hasClassName( 'Basilisk' )) {
			//basilisk counter attack (block attack, significant speed loss): 
			if(CoC.player.inte / 5 + Utils.rand(20) < 25) {
				MainView.outputText("Holding the basilisk in your peripheral vision, you charge forward to strike it.  Before the moment of impact, the reptile shifts its posture, dodging and flowing backward skillfully with your movements, trying to make eye contact with you. You find yourself staring directly into the basilisk's face!  Quickly you snap your eyes shut and recoil backwards, swinging madly at the lizard to force it back, but the damage has been done; you can see the terrible grey eyes behind your closed lids, and you feel a great weight settle on your bones as it becomes harder to move.", false);
				SceneLib.basiliskScene.basiliskSpeed(CoC.player,20);
				CoC.player.removeStatusAffect(StatusAffects.FirstAttack);
				Combat.combatRoundOver();
				return;
			} else { //Counter attack fails: (random chance if PC int > 50 spd > 60; PC takes small physical damage but no block or spd penalty)
				MainView.outputText("Holding the basilisk in your peripheral vision, you charge forward to strike it.  Before the moment of impact, the reptile shifts its posture, dodging and flowing backward skillfully with your movements, trying to make eye contact with you. You twist unexpectedly, bringing your " + CoC.player.weaponName + " up at an oblique angle; the basilisk doesn't anticipate this attack!  ", false);
			}
		}
		var damage = 0;
		//Worms are special
		if(CoC.monster.short === "worms") {
			//50% chance of hit (int boost)
			if( Utils.rand(100) + CoC.player.inte/3 >= 50) {
				damage = Math.floor(CoC.player.str/5 - Utils.rand(5));
				if(damage === 0) {
					damage = 1;
				}
				MainView.outputText("You strike at the amalgamation, crushing countless worms into goo, dealing " + damage + " damage.\n\n", false);
				CoC.monster.HP -= damage;
				if(CoC.monster.HP <= 0) {
					EngineCore.doNext( Combat, Combat.endHpVictory);
					return;
				}
			} else { //Fail
				MainView.outputText("You attempt to crush the worms with your reprisal, only to have the collective move its individual members, creating a void at the point of impact, leaving you to attack only empty air.\n\n", false);
			}
			if(CoC.player.findStatusAffect(StatusAffects.FirstAttack) >= 0) {
				Combat.attack();
				return;
			}
			Combat.enemyAI();
			return;
		}
		
		//Determine if dodged!
		if((CoC.player.findStatusAffect(StatusAffects.Blind) >= 0 && Utils.rand(2) === 0) || (CoC.monster.spe - CoC.player.spe > 0 && Math.floor(Math.random()*(((CoC.monster.spe-CoC.player.spe)/4)+80)) > 80)) {
			//Akbal dodges special education
			if(CoC.monster.short === "Akbal") {
				MainView.outputText("Akbal moves like lightning, weaving in and out of your furious strikes with the speed and grace befitting his jaguar body.\n", false);
			} else if(CoC.monster.short === "plain girl") {
				MainView.outputText("You wait patiently for your opponent to drop her guard. She ducks in and throws a right cross, which you roll away from before smacking your " + CoC.player.weaponName + " against her side. Astonishingly, the attack appears to phase right through her, not affecting her in the slightest. You glance down to your " + CoC.player.weaponName + " as if betrayed.\n", false);
			} else if(CoC.monster.short === "kitsune") {
				//Player Miss:
				MainView.outputText("You swing your [weapon] ferociously, confident that you can strike a crushing blow.  To your surprise, you stumble awkwardly as the attack passes straight through her - a mirage!  You curse as you hear a giggle behind you, turning to face her once again.\n\n");
			} else {
				if(CoC.monster.spe - CoC.player.spe < 8) {
					MainView.outputText(CoC.monster.getCapitalA() + CoC.monster.short + " narrowly avoids your attack!", false);
				} else if(CoC.monster.spe-CoC.player.spe < 20) {
					MainView.outputText(CoC.monster.getCapitalA() + CoC.monster.short + " dodges your attack with superior quickness!", false);
				} else {
					MainView.outputText(CoC.monster.getCapitalA() + CoC.monster.short + " deftly avoids your slow attack.", false);
				}
				MainView.outputText("\n", false);
				if(CoC.player.findStatusAffect(StatusAffects.FirstAttack) >= 0) {
					Combat.attack();
					return;
				} else {
					MainView.outputText("\n", false);
				}
			}
			Combat.enemyAI();
			return;
		}
		//BLOCKED ATTACK:
		if(CoC.monster.findStatusAffect(StatusAffects.Earthshield) >= 0 && Utils.rand(4) === 0) {
			MainView.outputText("Your strike is deflected by the wall of sand, dirt, and rock!  Damn!\n");
			if(CoC.player.findStatusAffect(StatusAffects.FirstAttack) >= 0) {
				Combat.attack();
				return;
			} else {
				MainView.outputText("\n", false);
			}
			Combat.enemyAI();
			return;
		}
		//BASIC DAMAGE STUFF
		//Double Attack Hybrid Reductions
		if(CoC.player.findPerk(PerkLib.DoubleAttack) >= 0 && CoC.player.spe >= 50 && CoC.player.str > 61 && CoC.flags[kFLAGS.DOUBLE_ATTACK_STYLE] === 0) {
			damage = 60.5;
		} else {
			damage = CoC.player.str;
		}
		//Weapon addition!
		damage += CoC.player.weaponAttack;
		//Bonus sand trap damage!
		if(CoC.monster.findStatusAffect(StatusAffects.Level) >= 0) {
			damage = Math.round(damage * 1.75);
		}
		//Determine if critical hit!
		var crit = false;
		if( Utils.rand(100) <= 4 || (CoC.player.findPerk(PerkLib.Tactician) >= 0 && CoC.player.inte >= 50 && (CoC.player.inte - 50)/5 > Utils.rand(100))) {
			crit = true;
			damage *= 1.75;
		}
		//Start figuring enemy damage resistance
		var reduction = Utils.rand(CoC.monster.tou);
		//Add in enemy armor if needed
		if(CoC.player.weaponName !== "jeweled rapier" && CoC.player.weaponName !== "deadly spear") {
			reduction += CoC.monster.armorDef;
			//Remove half armor for lunging strikes
			if(CoC.player.findPerk(PerkLib.LungingAttacks) >= 0) {
				reduction -= CoC.monster.armorDef/2;
			}
		}
		//Take 5 off enemy armor for katana
		if(CoC.player.weaponName === "katana") {
			if(CoC.monster.armorDef >= 5) { //Knock off 5
				reduction -= 5;
			} else { //Less than 5 armor?  TAKE IT ALL!
				reduction -= CoC.monster.armorDef;
			}
		}
		//Apply AND DONE!
		damage -= reduction;
		//Damage post processing!
		//Thunderous Strikes
		if(CoC.player.findPerk(PerkLib.ThunderousStrikes) >= 0 && CoC.player.str >= 80) {
			damage *= 1.2;
		}
			
		if (CoC.player.findPerk(PerkLib.ChiReflowMagic) >= 0) {
			damage *= SceneLib.umasShop.NEEDLEWORK_MAGIC_REGULAR_MULTI;
		}
		if (CoC.player.findPerk(PerkLib.ChiReflowAttack) >= 0) {
			damage *= SceneLib.umasShop.NEEDLEWORK_ATTACK_REGULAR_MULTI;
		}
		
		//One final round
		damage = Math.round(damage);
		
		//ANEMONE SHIT
		if(CoC.monster.short === "anemone") {
			//hit successful:
			//special event, block (no more than 10-20% of turns, also fails if PC has >75 corruption):
			if( Utils.rand(10) <= 1) {
				MainView.outputText("Seeing your " + CoC.player.weaponName + " raised, the anemone looks down at the water, angles her eyes up at you, and puts out a trembling lip.  ", false);
				if(CoC.player.cor < 75) {
					MainView.outputText("You stare into her hangdog expression and lose most of the killing intensity you had summoned up for your attack, stopping a few feet short of hitting her.\n", false);
					damage = 0;
					//Kick back to main if no damage occured!
					if(CoC.monster.HP > 0 && CoC.monster.lust < 100) {
						if(CoC.player.findStatusAffect(StatusAffects.FirstAttack) >= 0) {
							Combat.attack();
							return;
						}
						Combat.enemyAI();
					} else {
						if(CoC.monster.HP <= 0) {
							EngineCore.doNext( Combat, Combat.endHpVictory);
						} else {
							EngineCore.doNext( Combat, Combat.endLustVictory);
						}
					}
					return;
				} else {
					MainView.outputText("Though you lose a bit of steam to the display, the drive for dominance still motivates you to follow through on your swing.", false);
				}
			}
		}
		// Have to put it before doDamage, because doDamage applies the change, as well as status effects and shit.
		if (CoC.monster.mirrorAttack) {
			if (CoC.monster.findStatusAffect(StatusAffects.Stunned) < 0) {
				if (damage > 0 && CoC.player.findPerk(PerkLib.HistoryFighter) >= 0) {
					damage *= 1.1;
				}
				if (damage > 0) {
					damage = Combat.doDamage(damage, false);
				}
				CoC.monster.mirrorAttack(damage);
				return;
			}
			// Stunning the doppleganger should now "buy" you another round.
		}
		
		if(damage > 0) {
			if(CoC.player.findPerk(PerkLib.HistoryFighter) >= 0) {
				damage *= 1.1;
			}
			damage = Combat.doDamage(damage);
		}
		if(damage <= 0) {
			damage = 0;
			MainView.outputText("Your attacks are deflected or blocked by " + CoC.monster.a + CoC.monster.short + ".", false);
		} else {
			MainView.outputText("You hit " + CoC.monster.a + CoC.monster.short + "! (" + damage + ")", false);
			if (crit) {
				MainView.outputText(" <b>*CRIT*</b>");
			}
		}
		if(CoC.player.findPerk(PerkLib.BrutalBlows) >= 0 && CoC.player.str > 75) {
			if(CoC.monster.armorDef > 0) {
				MainView.outputText("\nYour hits are so brutal that you damage " + CoC.monster.a + CoC.monster.short + "'s defenses!");
			}
			if(CoC.monster.armorDef - 10 > 0) {
				CoC.monster.armorDef -= 10;
			} else {
				CoC.monster.armorDef = 0;
			}
		}
		if(damage > 0) {
			//Lust raised by anemone contact!
			if(CoC.monster.short === "anemone") {
				MainView.outputText("\nThough you managed to hit the anemone, several of the tentacles surrounding her body sent home jolts of venom when your swing brushed past them.", false);
				//(gain lust, temp lose str/spd)
				CoC.monster.applyVenom(1 + Utils.rand(2));
			}
			//Lust raising weapon bonuses
			if(CoC.monster.lustVuln > 0) {
				if(CoC.player.weaponPerk === "Aphrodisiac Weapon") {
					CoC.monster.lust += CoC.monster.lustVuln * (5 + CoC.player.cor/10);
					MainView.outputText("\n" + CoC.monster.getCapitalA() + CoC.monster.short + " shivers as your weapon's 'poison' goes to work.", false);
				}
				if(CoC.player.weaponName === "coiled whip" && Utils.rand(2) === 0) {
					CoC.monster.lust += CoC.monster.lustVuln * (5 + CoC.player.cor/12);			
					if(!CoC.monster.plural) {
						MainView.outputText("\n" + CoC.monster.getCapitalA() + CoC.monster.short + " shivers and gets turned on from the whipping.", false);
					} else {
						MainView.outputText("\n" + CoC.monster.getCapitalA() + CoC.monster.short + " shiver and get turned on from the whipping.", false);
					}
				}
				if(CoC.player.weaponName === "succubi whip") {
					CoC.monster.lust += CoC.monster.lustVuln * (20 + CoC.player.cor/15);
					if(CoC.player.cor < 90) {
						EngineCore.dynStats("cor", 0.3);
					}
					if(!CoC.monster.plural) {
						MainView.outputText("\n" + CoC.monster.getCapitalA() + CoC.monster.short + " shivers and moans involuntarily from the whip's touches.", false);
					} else {
						MainView.outputText("\n" + CoC.monster.getCapitalA() + CoC.monster.short + " shiver and moan involuntarily from the whip's touches.", false);
					}
					if( Utils.rand(2) === 0) {
						MainView.outputText("  You get a sexual thrill from it.", false);
						EngineCore.dynStats("lus", 1);
					}
				}
			}
			//Weapon Procs!
			if(CoC.player.weaponName === "huge warhammer" || CoC.player.weaponName === "spiked gauntlet" || CoC.player.weaponName === "hooked gauntlets") {
				//10% chance
				if( Utils.rand(10) === 0 && CoC.monster.findPerk(PerkLib.Resolute) < 0) {
					MainView.outputText("\n" + CoC.monster.getCapitalA() + CoC.monster.short + " reels from the brutal blow, stunned.", false);
					CoC.monster.createStatusAffect(StatusAffects.Stunned,0,0,0,0);
				}
				//50% Bleed chance
				if (CoC.player.weaponName === "hooked gauntlets" && Utils.rand(2) === 0 && CoC.monster.armorDef < 10 && CoC.monster.findStatusAffect(StatusAffects.IzmaBleed) < 0) {
					if (CoC.monster.hasClassName( 'LivingStatue' )) {
						MainView.outputText("Despite the rents you've torn in its stony exterior, the statue does not bleed.");
					} else {
						CoC.monster.createStatusAffect(StatusAffects.IzmaBleed,3,0,0,0);
						if(CoC.monster.plural) {
							MainView.outputText("\n" + CoC.monster.getCapitalA() + CoC.monster.short + " bleed profusely from the many bloody gashes your hooked gauntlets leave behind.", false);
						} else {
							MainView.outputText("\n" + CoC.monster.getCapitalA() + CoC.monster.short + " bleeds profusely from the many bloody gashes your hooked gauntlets leave behind.", false);
						}
					}
				}
			}
			
		}
		if (CoC.monster.hasClassName( 'JeanClaude' ) && CoC.player.findStatusAffect(StatusAffects.FirstAttack) < 0) {
			if (CoC.monster.HP < 1 || CoC.monster.lust > 99) {
				// noop
			}
			if (CoC.player.lust <= 30) {
				MainView.outputText("\n\nJean-Claude doesn’t even budge when you wade into him with your [weapon].");
				MainView.outputText("\n\n“<i>Why are you attacking me, slave?</i>” he says. The basilisk rex sounds genuinely confused. His eyes pulse with hot, yellow light, reaching into you as he opens his arms, staring around as if begging the crowd for an explanation. “<i>You seem lost, unable to understand, lashing out at those who take care of you. Don’t you know who you are? Where you are?</i>” That compulsion in his eyes, that never-ending heat, it’s... it’s changing things. You need to finish this as fast as you can.");
			} else if (CoC.player.lust <= 50) {
				MainView.outputText("\n\nAgain your [weapon] thumps into Jean-Claude. Again it feels wrong. Again it sends an aching chime through you, that you are doing something that revolts your nature.");
				MainView.outputText("\n\n“<i>Why are you fighting your master, slave?</i>” he says. He is bigger than he was before. Or maybe you are smaller. “<i>You are confused. Put your weapon down- you are no warrior, you only hurt yourself when you flail around with it. You have forgotten what you were trained to be. Put it down, and let me help you.</i>” He’s right. It does hurt. Your body murmurs that it would feel so much better to open up and bask in the golden eyes fully, let it move you and penetrate you as it may. You grit your teeth and grip your [weapon] harder, but you can’t stop the warmth the hypnotic compulsion is building within you.");
			} else if (CoC.player.lust <= 80) {
				MainView.outputText("\n\n“<i>Do you think I will be angry at you?</i>” growls Jean-Claude lowly. Your senses feel intensified, his wild, musky scent rich in your nose. It’s hard to concentrate... or rather it’s hard not to concentrate on the sweat which runs down his hard, defined frame, the thickness of his bulging cocks, the assured movement of his powerful legs and tail, and the glow, that tantalizing, golden glow, which pulls you in and pushes so much delicious thought and sensation into your head…  “<i>I am not angry. You will have to be punished, yes, but you know that is only right, that in the end you will accept and enjoy being corrected. Come now, slave. You only increase the size of the punishment with this silliness.</i>”");
			} else {
				MainView.outputText("\n\nYou can’t... there is a reason why you keep raising your weapon against your master, but what was it? It can’t be that you think you can defeat such a powerful, godly alpha male as him. And it would feel so much better to supplicate yourself before the glow, lose yourself in it forever, serve it with your horny slut body, the only thing someone as low and helpless as you could possibly offer him. Master’s mouth is moving but you can no longer tell where his voice ends and the one in your head begins... only there is a reason you cling to like you cling onto your [weapon], whatever it is, however stupid and distant it now seems, a reason to keep fighting...");
			}
			EngineCore.dynStats("lus", 25);
		}
		MainView.outputText("\n", false);
		//Kick back to main if no damage occured!
		if(CoC.monster.HP >= 1 && CoC.monster.lust <= 99) {
			if(CoC.player.findStatusAffect(StatusAffects.FirstAttack) >= 0) {
				Combat.attack();
				return;
			}
			MainView.outputText("\n", false);
			Combat.enemyAI();
		} else {
			if(CoC.monster.HP <= 0) {
				EngineCore.doNext( Combat, Combat.endHpVictory);
			} else {
				EngineCore.doNext( Combat, Combat.endLustVictory);
			}
		}
	};
	//Gore Attack - uses 15 fatigue!
	Combat.goreAttack = function() {
		MainView.clearOutput();
		if (CoC.monster.short === "worms") {
			MainView.outputText("Taking advantage of your new natural weapons, you quickly charge at the freak of nature. Sensing impending danger, the creature willingly drops its cohesion, causing the mass of worms to fall to the ground with a sick, wet 'thud', leaving your horns to stab only at air.\n\n");
			Combat.enemyAI();
			return;
		}
		if(CoC.player.fatigue + EngineCore.physicalCost(15) > 100) {
			MainView.outputText("You're too fatigued to use a charge attack!");
			EngineCore.menu();
			EngineCore.addButton(0, "Next", Combat.combatMenu, false);
			return;
		}
		EngineCore.fatigue(15,2);
		var damage = 0;
		//Amily!
		if(CoC.monster.findStatusAffect(StatusAffects.Concentration) >= 0) {
			MainView.outputText("Amily easily glides around your attack thanks to her complete concentration on your movements.\n\n");
			Combat.enemyAI();
			return;
		}
		//Bigger horns = better success chance.
		//Small horns - 60% hit
		var hit = 0;
		if(CoC.player.horns >= 6 && CoC.player.horns < 12) {
			hit = 60;
		} else if(CoC.player.horns < 20) { //bigger horns - 75% hit
			hit = 75;
		} else { //huge horns - 90% hit
			hit = 80;
		}
		//Vala dodgy bitch!
		if(CoC.monster.short === "Vala") {
			hit = 20;
		}
		//Account for monster speed - up to -50%.
		hit -= CoC.monster.spe / 2;
		//Account for player speed - up to +50%
		hit += CoC.player.spe / 2;
		//Hit & calculation
		if(hit >= Utils.rand(100)) {
			var horns = CoC.player.horns;
			if(CoC.player.horns > 40) {
				CoC.player.horns = 40;
			}
			//normal
			if( Utils.rand(4) > 0) {
				MainView.outputText("You lower your head and charge, skewering " + CoC.monster.a + CoC.monster.short + " on one of your bullhorns!  ");
				//As normal attack + horn length bonus
				damage = Math.floor(CoC.player.str + horns * 2 - Utils.rand(CoC.monster.tou) - CoC.monster.armorDef);
			} else { //CRIT
				//doubles horn bonus damage
				damage = Math.floor(CoC.player.str + horns * 4 - Utils.rand(CoC.monster.tou) - CoC.monster.armorDef);
				MainView.outputText("You lower your head and charge, slamming into " + CoC.monster.a + CoC.monster.short + " and burying both your horns into " + CoC.monster.pronoun2 + "!  ");
			}
			//Bonus damage for rut!
			if(CoC.player.inRut && CoC.monster.cockTotal() > 0) {
				MainView.outputText("The fury of your rut lent you strength, increasing the damage!  ");
				damage += 5;
			}
			//Bonus per level damage
			damage += CoC.player.level * 2;
			//Reduced by armor
			damage -= CoC.monster.armorDef;
			if(damage < 0) {
				damage = 5;
			}
			//CAP 'DAT SHIT
			if(damage > CoC.player.level * 10 + 100) {
				damage = CoC.player.level * 10 + 100;
			}
			if(damage > 0) {
				if(CoC.player.findPerk(PerkLib.HistoryFighter) >= 0) {
					damage *= 1.1;
				}
				damage = Combat.doDamage(damage);
			}
			//Different horn damage messages
			if(damage < 20) {
				MainView.outputText("You pull yourself free, dealing " + damage + " damage.");
			} else if(damage < 40) {
				MainView.outputText("You struggle to pull your horns free, dealing " + damage + " damage.");
			} else {
				MainView.outputText("With great difficulty you rip your horns free, dealing " + damage + " damage.");
			}
		} else { //Miss
			//Special vala changes
			if(CoC.monster.short === "Vala") {
				MainView.outputText("You lower your head and charge Vala, but she just flutters up higher, grabs hold of your horns as you close the distance, and smears her juicy, fragrant cunt against your nose.  The sensual smell and her excited moans stun you for a second, allowing her to continue to use you as a masturbation aid, but she quickly tires of such foreplay and flutters back with a wink.\n\n");
				EngineCore.dynStats("lus", 5);
			} else {
				MainView.outputText("You lower your head and charge " + CoC.monster.a + CoC.monster.short + ", only to be sidestepped at the last moment!");
			}
		}
		//New line before monster attack
		MainView.outputText("\n\n");
		//Victory ORRRRR enemy turn.
		if(CoC.monster.HP <= 0) {
			EngineCore.doNext( Combat, Combat.endHpVictory);
		} else if(CoC.monster.lust >= 100) {
			EngineCore.doNext( Combat, Combat.endLustVictory);
		} else {
			Combat.enemyAI();
		}
	};
	//Player sting attack
	Combat.playerStinger = function() {
		MainView.clearOutput();
		//Keep logic sane if this attack brings victory
		if (CoC.player.tailVenom < 33) {
			MainView.outputText("You do not have enough venom to sting right now!");
			EngineCore.doNext( Combat, Combat.physicalSpecials);
			return;
		}
		//Worms are immune!
		if (CoC.monster.short === "worms") {
			MainView.outputText("Taking advantage of your new natural weapons, you quickly thrust your stinger at the freak of nature. Sensing impending danger, the creature willingly drops its cohesion, causing the mass of worms to fall to the ground with a sick, wet 'thud', leaving you to stab only at air.\n\n");
			Combat.enemyAI();
			return;
		}
		//Determine if dodged!
		//Amily!
		if(CoC.monster.findStatusAffect(StatusAffects.Concentration) >= 0) {
			MainView.outputText("Amily easily glides around your attack thanks to her complete concentration on your movements.\n\n");
			Combat.enemyAI();
			return;
		}
		if(CoC.monster.spe - CoC.player.spe > 0 && Utils.rand(((CoC.monster.spe - CoC.player.spe) / 4)+80) > 80) {
			if(CoC.monster.spe - CoC.player.spe < 8) {
				MainView.outputText(CoC.monster.getCapitalA() + CoC.monster.short + " narrowly avoids your stinger!\n\n");
			} else if(CoC.monster.spe-CoC.player.spe < 20) {
				MainView.outputText(CoC.monster.getCapitalA() + CoC.monster.short + " dodges your stinger with superior quickness!\n\n");
			} else {
				MainView.outputText(CoC.monster.getCapitalA() + CoC.monster.short + " deftly avoids your slow attempts to sting " + CoC.monster.pronoun2 + ".\n\n");
			}
			Combat.enemyAI();
			return;
		}
		//determine if avoided with armor.
		if(CoC.monster.armorDef - CoC.player.level >= 10 && Utils.rand(4) > 0) {
			MainView.outputText("Despite your best efforts, your sting attack can't penetrate " +  CoC.monster.a + CoC.monster.short + "'s defenses.\n\n");
			Combat.enemyAI();
			return;
		}
		//Sting successful!
		MainView.outputText("Searing pain lances through " + CoC.monster.a + CoC.monster.short + " as you manage to sting " + CoC.monster.pronoun2 + "!  ");
		if(CoC.monster.plural) {
			MainView.outputText("You watch as " + CoC.monster.pronoun1 + " stagger back a step and nearly trip, flushing hotly.");
		} else {
			MainView.outputText("You watch as " + CoC.monster.pronoun1 + " staggers back a step and nearly trips, flushing hotly.");
		}
		//Tabulate damage!
		var damage = 35 + Utils.rand(CoC.player.lib/10);
		//Level adds more damage up to a point (level 20)
		if(CoC.player.level < 10) {
			damage += CoC.player.level * 3;
		} else if(CoC.player.level < 20) {
			damage += 30 + (CoC.player.level-10) * 2;
		} else {
			damage += 50;
		}
		CoC.monster.lust += CoC.monster.lustVuln * damage;
		if(CoC.monster.findStatusAffect(StatusAffects.lustvenom) < 0) {
			CoC.monster.createStatusAffect(StatusAffects.lustvenom, 0, 0, 0, 0);
		}
		//New line before monster attack
		MainView.outputText("\n\n");
		//Use tail mp
		CoC.player.tailVenom -= 25;
		//Kick back to main if no damage occured!
		if(CoC.monster.HP > 0 && CoC.monster.lust < 100) {
			Combat.enemyAI();
		} else {
			EngineCore.doNext( Combat, Combat.endLustVictory);
		}
	};
	Combat.combatMiss = function() {
		return CoC.player.spe - CoC.monster.spe > 0 && Utils.rand(((CoC.player.spe - CoC.monster.spe) / 4) + 80) > 80;
	};
	Combat.combatEvade = function() {
		return CoC.monster.short !== "Kiha" && CoC.player.findPerk(PerkLib.Evade) >= 0 && Utils.rand(100) < 10;
	};
	Combat.combatFlexibility = function() {
		return CoC.player.findPerk(PerkLib.Flexibility) >= 0 && Utils.rand(100) < 6;
	};
	Combat.combatMisdirect = function() {
		return CoC.player.findPerk(PerkLib.Misdirection) >= 0 && Utils.rand(100) < 10 && CoC.player.armorName === "red, high-society bodysuit";
	};
	//DEAL DAMAGE
	Combat.doDamage = function(damage, apply) {
		if(apply === undefined) {
			apply = true;
		}
		if(CoC.player.findPerk(PerkLib.Sadist) >= 0) {
			damage *= 1.2;
			EngineCore.dynStats("lus", 3);
		}
		if (CoC.monster.HP - damage <= 0) {
			EngineCore.doNext( Combat, Combat.endHpVictory);
		}
		// Uma's Massage Bonuses
		var statIndex = CoC.player.findStatusAffect(StatusAffects.UmasMassage);
		if (statIndex >= 0) {
			if (CoC.player.statusAffect(statIndex).value1 === SceneLib.umasShop.MASSAGE_POWER) {
				damage *= CoC.player.statusAffect(statIndex).value2;
			}
		}
		damage = Math.round(damage);
		if(damage < 0) {
			damage = 1;
		}
		if(apply) {
			CoC.monster.HP -= damage;
		}
		//Isabella gets mad
		if(CoC.monster.short === "Isabella") {
			CoC.flags[kFLAGS.ISABELLA_AFFECTION]--;
			//Keep in bounds
			if(CoC.flags[kFLAGS.ISABELLA_AFFECTION] < 0) {
				CoC.flags[kFLAGS.ISABELLA_AFFECTION] = 0;
			}
		}
		//Interrupt gigaflare if necessary.
		if(CoC.monster.findStatusAffect(StatusAffects.Gigafire) >= 0) {
			CoC.monster.addStatusValue(StatusAffects.Gigafire,1,damage);
		}
		//Keep shit in bounds.
		if(CoC.monster.HP < 0) {
			CoC.monster.HP = 0;
		}
		return damage;
	};
	Combat.takeDamage = function(damage) {
		return CoC.player.Combat.takeDamage(damage);
	};
	//ENEMYAI!
	Combat.enemyAI = function() {
		CoC.monster.doAI();
	};
	Combat.finishCombat = function() {
		var hpVictory = CoC.monster.HP < 1;
		if (hpVictory) {
			MainView.outputText("You defeat " + CoC.monster.a + CoC.monster.short + ".\n", true);
		} else {
			MainView.outputText("You smile as " + CoC.monster.a + CoC.monster.short + " collapses and begins masturbating feverishly.", true);
		}
		Combat.awardPlayer();
	};
	Combat.dropItem = function(monster) {
		if(monster.findStatusAffect(StatusAffects.NoLoot) >= 0) {
			return;
		}
		var itype = monster.dropLoot();
		if(monster.short === "tit-fucked Minotaur") {
			itype = ConsumableLib.MINOCUM;
		}
		if((monster.hasClassName( 'Minotaur' )) && monster.weaponName === "axe") {
			if( Utils.rand(2) === 0) {
				//50% breakage!
				if( Utils.rand(2) === 0) {
					itype = WeaponLib.L__AXE;
					if(CoC.player.tallness < 78) {
						MainView.outputText("\nYou find a large axe on the minotaur, but it is too big for a person of your stature to comfortably carry.  ", false);
						if( Utils.rand(2) === 0) {
							itype = null;
						}else {
							itype = ConsumableLib.SDELITE;
						}
					} else { //Not too tall, dont rob of axe!
						OnLoadVariables.plotFight = true;
					}
				} else {
					MainView.outputText("\nThe minotaur's axe appears to have been broken during the fight, rendering it useless.  ", false);
				}
			} else {
				itype = ConsumableLib.MINOBLO;
			}
		}
		if(monster.hasClassName( 'BeeGirl' )) {
			//force honey drop if milked
			if(CoC.flags[kFLAGS.FORCE_BEE_TO_PRODUCE_HONEY] === 1) {
				itype = Utils.randomChoice(ConsumableLib.BEEHONY, ConsumableLib.PURHONY);
				CoC.flags[kFLAGS.FORCE_BEE_TO_PRODUCE_HONEY] = 0;
			}
		}
		if(monster.hasClassName( 'Jojo' ) && SceneLib.jojoScene.monk > 4) {
			itype = Utils.randomChoice(ConsumableLib.INCUBID, ConsumableLib.INCUBID, ConsumableLib.B__BOOK, ConsumableLib.SUCMILK);
		}
		if(monster.hasClassName( 'Harpy' ) || monster.hasClassName( 'Sophie' )) {
			if( Utils.rand(10) === 0) {
				itype = ArmorLib.W_ROBES;
			} else if( Utils.rand(3) === 0 && CoC.player.findPerk(PerkLib.LuststickAdapted) >= 0) {
				itype = ConsumableLib.LUSTSTK;
			} else {
				itype = ConsumableLib.GLDSEED;
			}
		}
		//Chance of armor if at level 1 pierce fetish
		if(!OnLoadVariables.plotFight && !monster.hasClassName( 'Ember' ) && !monster.hasClassName( 'Kiha' ) && !monster.hasClassName( 'Hel' ) && !monster.hasClassName( 'Isabella' ) && CoC.flags[kFLAGS.PC_FETISH] === 1 && Utils.rand(10) === 0 && !CoC.player.hasItem(ArmorLib.SEDUCTA, 1) && !SceneLib.ceraphFollowerScene.ceraphIsFollower()) {
			itype = ArmorLib.SEDUCTA;
		}
		if(!OnLoadVariables.plotFight && Utils.rand(200) === 0 && CoC.player.level >= 7) {
			itype = ConsumableLib.BROBREW;
		}
		if(!OnLoadVariables.plotFight && Utils.rand(200) === 0 && CoC.player.level >= 7) {
			itype = ConsumableLib.BIMBOLQ;
		}
		//Chance of eggs if Easter!
		if(!OnLoadVariables.plotFight && Utils.rand(6) === 0 && CoC.isEaster()) {
			itype = Utils.randomChoice(
				ConsumableLib.BROWNEG,
				ConsumableLib.L_BRNEG,
				ConsumableLib.PURPLEG,
				ConsumableLib.L_PRPEG,
				ConsumableLib.BLUEEGG,
				ConsumableLib.L_BLUEG,
				ConsumableLib.PINKEGG,
				ConsumableLib.NPNKEGG,
				ConsumableLib.L_PNKEG,
				ConsumableLib.L_WHTEG,
				ConsumableLib.WHITEEG,
				ConsumableLib.BLACKEG,
				ConsumableLib.L_BLKEG
			);
		}
		//Bonus loot overrides others
		if (CoC.flags[kFLAGS.BONUS_ITEM_AFTER_COMBAT_ID] !== "") {
			itype = ItemType.lookupItem(CoC.flags[kFLAGS.BONUS_ITEM_AFTER_COMBAT_ID]);
		}
		monster.handleAwardItemText(itype); //Each monster can now override the default award text
		if (itype !== null) {
			if (SceneLib.dungeonCore.isInDungeon()) {
				SceneLib.inventory.takeItem(itype, MainView.playerMenu);
			} else {
				SceneLib.inventory.takeItem(itype, SceneLib.camp.returnToCampUseOneHour);
			}
		}
	};
	Combat.awardPlayer = function() {
		if (CoC.player.countCockSocks("gilded") > 0) {
			var bonusGems = CoC.monster.gems * 0.15 + 5 * CoC.player.countCockSocks("gilded"); // int so AS rounds to whole numbers
			CoC.monster.gems += bonusGems;
		}
		CoC.monster.handleAwardText(); //Each monster can now override the default award text
		if (!SceneLib.dungeonCore.isInDungeon() && !OnLoadVariables.inRoomedDungeon) {
			EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour);
		} else {
			EngineCore.doNext( MainView, MainView.playerMenu);
		}
		Combat.dropItem(CoC.monster);
		CoC.setInCombat(false);
		CoC.player.gems += CoC.monster.gems;
		CoC.player.XP += CoC.monster.XP;
	};
	//Clear statuses
	Combat.clearStatuses = function(visibility) {
		CoC.player.clearStatuses(visibility);
	};
	//Update combat status effects
	Combat.combatStatusesUpdate = function() {
		//Reset menuloc
		EngineCore.hideUpDown();
		if(CoC.player.findStatusAffect(StatusAffects.Sealed) >= 0) {
			//Countdown and remove as necessary
			if(CoC.player.statusAffectv1(StatusAffects.Sealed) > 0) {
				CoC.player.addStatusValue(StatusAffects.Sealed,1,-1);
				if(CoC.player.statusAffectv1(StatusAffects.Sealed) <= 0) {
					CoC.player.removeStatusAffect(StatusAffects.Sealed);
				} else {
					MainView.outputText("<b>One of your combat abilities is currently sealed by magic!</b>\n\n");
				}
			}
		}
		CoC.monster.combatRoundUpdate();
		//[Silence warning]
		if(CoC.player.findStatusAffect(StatusAffects.ThroatPunch) >= 0) {
			CoC.player.addStatusValue(StatusAffects.ThroatPunch,1,-1);
			if(CoC.player.statusAffectv1(StatusAffects.ThroatPunch) >= 0) {
				MainView.outputText("Thanks to Isabella's wind-pipe crushing hit, you're having trouble breathing and are <b>unable to cast spells as a consequence.</b>\n\n", false);
			} else {
				MainView.outputText("Your wind-pipe recovers from Isabella's brutal hit.  You'll be able to focus to cast spells again!\n\n", false);
				CoC.player.removeStatusAffect(StatusAffects.ThroatPunch);
			}
		}
		if(CoC.player.findStatusAffect(StatusAffects.GooArmorSilence) >= 0) {
			if(CoC.player.statusAffectv1(StatusAffects.GooArmorSilence) >= 2 || Utils.rand(20) + 1 + CoC.player.str / 10 >= 15) {
				//if passing str check, output at beginning of turn
				MainView.outputText("<b>The sticky slop covering your mouth pulls away reluctantly, taking more force than you would expect, but you've managed to free your mouth enough to speak!</b>\n\n");
				CoC.player.removeStatusAffect(StatusAffects.GooArmorSilence);
			} else {
				MainView.outputText("<b>Your mouth is obstructed by sticky goo!  You are silenced!</b>\n\n", false);
				CoC.player.addStatusValue(StatusAffects.GooArmorSilence,1,1);
			}
		}
		if(CoC.player.findStatusAffect(StatusAffects.LustStones) >= 0) {
			//[When witches activate the stones for goo bodies]
			if(CoC.player.isGoo()) {
				MainView.outputText("<b>The stones start vibrating again, making your liquid body ripple with pleasure.  The witches snicker at the odd sight you are right now.\n\n</b>");
			} else { //[When witches activate the stones for solid bodies]
				MainView.outputText("<b>The smooth stones start vibrating again, sending another wave of teasing bliss throughout your body.  The witches snicker at you as you try to withstand their attack.\n\n</b>");
			}
			EngineCore.dynStats("lus", CoC.player.statusAffectv1(StatusAffects.LustStones) + 4);
		}
		if(CoC.player.findStatusAffect(StatusAffects.WebSilence) >= 0) {
			if(CoC.player.statusAffectv1(StatusAffects.WebSilence) >= 2 || Utils.rand(20) + 1 + CoC.player.str/10 >= 15) {
				MainView.outputText("You rip off the webbing that covers your mouth with a cry of pain, finally able to breathe normally again!  Now you can cast spells!\n\n", false);
				CoC.player.removeStatusAffect(StatusAffects.WebSilence);
			} else {
				MainView.outputText("<b>Your mouth and nose are obstructed by sticky webbing, making it difficult to breathe and impossible to focus on casting spells.  You try to pull it off, but it just won't work!</b>\n\n", false);
				CoC.player.addStatusValue(StatusAffects.WebSilence,1,1);
			}
		}		
		if(CoC.player.findStatusAffect(StatusAffects.HolliConstrict) >= 0) {
			MainView.outputText("<b>You're tangled up in Holli's verdant limbs!  All you can do is try to struggle free...</b>\n\n");
		}
		if(CoC.player.findStatusAffect(StatusAffects.UBERWEB) >= 0) {
			MainView.outputText("<b>You're pinned under a pile of webbing!  You should probably struggle out of it and get back in the fight!</b>\n\n", false);
		}
		if (CoC.player.findStatusAffect(StatusAffects.Blind) >= 0 && CoC.monster.findStatusAffect(StatusAffects.Sandstorm) < 0) {
			if (CoC.player.findStatusAffect(StatusAffects.SheilaOil) >= 0) {
				if(CoC.player.statusAffectv1(StatusAffects.Blind) <= 0) {
					MainView.outputText("<b>You finish wiping the demon's tainted oils away from your eyes; though the smell lingers, you can at least see.  Sheila actually seems happy to once again be under your gaze.</b>\n\n", false);
					CoC.player.removeStatusAffect(StatusAffects.Blind);
				} else {
					MainView.outputText("<b>You scrub at the oily secretion with the back of your hand and wipe some of it away, but only smear the remainder out more thinly.  You can hear the demon giggling at your discomfort.</b>\n\n", false);
					CoC.player.addStatusValue(StatusAffects.Blind,1,-1);
				}
			} else {
				//Remove blind if countdown to 0
				if (CoC.player.statusAffectv1(StatusAffects.Blind) === 0) {
					CoC.player.removeStatusAffect(StatusAffects.Blind);
					//Alert PC that blind is gone if no more stacks are there.
					if (CoC.player.findStatusAffect(StatusAffects.Blind) < 0) {
						MainView.outputText("<b>Your eyes have cleared and you are no longer blind!</b>\n\n", false);
					} else {
						MainView.outputText("<b>You are blind, and many physical attacks will miss much more often.</b>\n\n", false);
					}
				} else {
					CoC.player.addStatusValue(StatusAffects.Blind,1,-1);
					MainView.outputText("<b>You are blind, and many physical attacks will miss much more often.</b>\n\n", false);
				}
			}
		}
		//Basilisk compulsion
		if(CoC.player.findStatusAffect(StatusAffects.BasiliskCompulsion) >= 0) {
			SceneLib.basiliskScene.basiliskSpeed(CoC.player,15);
			//Continuing effect text: 
			MainView.outputText("<b>You still feel the spell of those grey eyes, making your movements slow and difficult, the remembered words tempting you to look into its eyes again. You need to finish this fight as fast as your heavy limbs will allow.</b>\n\n", false);
		}
		if(CoC.player.findStatusAffect(StatusAffects.IzmaBleed) >= 0) {
			if(CoC.player.statusAffectv1(StatusAffects.IzmaBleed) <= 0) {
				CoC.player.removeStatusAffect(StatusAffects.IzmaBleed);
				MainView.outputText("<b>You sigh with relief; your bleeding has slowed considerably.</b>\n\n", false);
			} else { //Bleed effect:
				var bleed = (2 + Utils.rand(4)) / 100;
				bleed *= CoC.player.HP;
				bleed = Combat.takeDamage(bleed);
				MainView.outputText("<b>You gasp and wince in pain, feeling fresh blood pump from your wounds. (" + bleed + ")</b>\n\n", false);
			}
		}
		if(CoC.player.findStatusAffect(StatusAffects.AcidSlap) >= 0) {
			var slap = 3 + (CoC.player.maxHP() * 0.02);
			MainView.outputText("<b>Your muscles twitch in agony as the acid keeps burning you. (" + slap + ")</b>\n\n", false);
		}
		if(CoC.player.findPerk(PerkLib.ArousingAura) >= 0 && CoC.monster.lustVuln > 0 && CoC.player.cor >= 70) {
			if(CoC.monster.lust < 50) {
				MainView.outputText("Your aura seeps into " + CoC.monster.a + CoC.monster.short + " but does not have any visible effects just yet.\n\n", false);
			} else if(CoC.monster.lust < 60) {
				if(!CoC.monster.plural) {
					MainView.outputText(CoC.monster.getCapitalA() + CoC.monster.short + " starts to squirm a little from your unholy presence.\n\n", false);
				} else {
					MainView.outputText(CoC.monster.getCapitalA() + CoC.monster.short + " start to squirm a little from your unholy presence.\n\n", false);
				}
			} else if(CoC.monster.lust < 75) {
				MainView.outputText("Your arousing aura seems to be visibly affecting " + CoC.monster.a + CoC.monster.short + ", making " + CoC.monster.pronoun2 + " squirm uncomfortably.\n\n", false);
			} else if(CoC.monster.lust < 85) {
				if(!CoC.monster.plural) {
					MainView.outputText(CoC.monster.getCapitalA() + CoC.monster.short + "'s skin colors red as " + CoC.monster.pronoun1 + " inadvertantly basks in your presence.\n\n", false);
				} else {
					MainView.outputText(CoC.monster.getCapitalA() + CoC.monster.short + "' skin colors red as " + CoC.monster.pronoun1 + " inadvertantly bask in your presence.\n\n", false);
				}
			} else {
				if(!CoC.monster.plural) {
					MainView.outputText("The effects of your aura are quite pronounced on " + CoC.monster.a + CoC.monster.short + " as " + CoC.monster.pronoun1 + " begins to shake and steal glances at your body.\n\n", false);
				} else {
					MainView.outputText("The effects of your aura are quite pronounced on " + CoC.monster.a + CoC.monster.short + " as " + CoC.monster.pronoun1 + " begin to shake and steal glances at your body.\n\n", false);
				}
			}
			CoC.monster.lust += CoC.monster.lustVuln * (2 + Utils.rand(4));
		}
		if(CoC.player.findStatusAffect(StatusAffects.Bound) >= 0 && CoC.flags[kFLAGS.PC_FETISH] >= 2) {
			MainView.outputText("The feel of tight leather completely immobilizing you turns you on more and more.  Would it be so bad to just wait and let her play with you like this?\n\n", false);
			EngineCore.dynStats("lus", 3);
		}
		if(CoC.player.findStatusAffect(StatusAffects.GooArmorBind) >= 0) {
			if(CoC.flags[kFLAGS.PC_FETISH] >= 2) {
				MainView.outputText("The feel of the all-encapsulating goo immobilizing your helpless body turns you on more and more.  Maybe you should just wait for it to completely immobilize you and have you at its mercy.\n\n");
				EngineCore.dynStats("lus", 3);
			} else {
				MainView.outputText("You're utterly immobilized by the goo flowing around you.  You'll have to struggle free!\n\n");
			}
		}
		if(CoC.player.findStatusAffect(StatusAffects.HarpyBind) >= 0) {
			if(CoC.flags[kFLAGS.PC_FETISH] >= 2) {
				MainView.outputText("The harpies are holding you down and restraining you, making the struggle all the sweeter!\n\n");
				EngineCore.dynStats("lus", 3);
			} else {
				MainView.outputText("You're restrained by the harpies so that they can beat on you with impunity.  You'll need to struggle to break free!\n\n");
			}
		}
		if(CoC.player.findStatusAffect(StatusAffects.NagaBind) >= 0 && CoC.flags[kFLAGS.PC_FETISH] >= 2) {
			MainView.outputText("Coiled tightly by the naga and utterly immobilized, you can't help but become aroused thanks to your bondage fetish.\n\n", false);
			EngineCore.dynStats("lus", 5);
		}
		if(CoC.player.findStatusAffect(StatusAffects.TentacleBind) >= 0) {
			MainView.outputText("You are firmly trapped in the tentacle's coils.  <b>The only thing you can try to do is struggle free!</b>\n\n", false);
			if(CoC.flags[kFLAGS.PC_FETISH] >= 2) {
				MainView.outputText("Wrapped tightly in the tentacles, you find it hard to resist becoming more and more aroused...\n\n", false);
				EngineCore.dynStats("lus", 3);
			}
		}
		if(CoC.player.findStatusAffect(StatusAffects.DriderKiss) >= 0) {
			//(VENOM OVER TIME: WEAK)
			if(CoC.player.statusAffectv1(StatusAffects.DriderKiss) === 0) {
				MainView.outputText("Your heart hammers a little faster as a vision of the drider's nude, exotic body on top of you assails you.  It'll only get worse if she kisses you again...\n\n", false);
				EngineCore.dynStats("lus", 8);
			} else if(CoC.player.statusAffectv1(StatusAffects.DriderKiss) === 1) { //(VENOM OVER TIME: MEDIUM)
				MainView.outputText("You shudder and moan, nearly touching yourself as your ", false);
				if(CoC.player.gender > 0) {
					MainView.outputText("loins tingle and leak, hungry for the drider's every touch.", false);
				} else {
					MainView.outputText("asshole tingles and twitches, aching to be penetrated.", false);
				}
				MainView.outputText("  Gods, her venom is getting you so hot.  You've got to end this quickly!\n\n", false);
				EngineCore.dynStats("lus", 15);
			} else { //(VENOM OVER TIME: MAX)
				MainView.outputText("You have to keep pulling your hands away from your crotch - it's too tempting to masturbate here on the spot and beg the drider for more of her sloppy kisses.  Every second that passes, your arousal grows higher.  If you don't end this fast, you don't think you'll be able to resist much longer.  You're too turned on... too horny... too weak-willed to resist much longer...\n\n", false);
				EngineCore.dynStats("lus", 25);
			}
		}
		//Harpy lip gloss
		if(CoC.player.hasCock() && CoC.player.findStatusAffect(StatusAffects.Luststick) >= 0 && (CoC.monster.short === "harpy" || CoC.monster.short === "Sophie")) {
			//Chance to cleanse!
			if(CoC.player.findPerk(PerkLib.Medicine) >= 0 && Utils.rand(100) <= 14) {
				MainView.outputText("You manage to cleanse the harpy lip-gloss from your system with your knowledge of medicine!\n\n", false);
				CoC.player.removeStatusAffect(StatusAffects.Luststick);
			} else if( Utils.rand(5) === 0) {
				if( Utils.rand(2) === 0) {
					MainView.outputText("A fantasy springs up from nowhere, dominating your thoughts for a few moments.  In it, you're lying down in a soft nest.  Gold-rimmed lips are noisily slurping around your " + CoC.player.cockDescript(0) + ", smearing it with her messy aphrodisiac until you're completely coated in it.  She looks up at you knowingly as the two of you get ready to breed the night away...\n\n", false);		
				} else {
					MainView.outputText("An idle daydream flutters into your mind.  In it, you're fucking a harpy's asshole, clutching tightly to her wide, feathery flanks as the tight ring of her pucker massages your " + CoC.player.cockDescript(0) + ".  She moans and turns around to kiss you on the lips, ensuring your hardness.  Before long her feverish grunts of pleasure intensify, and you feel the egg she's birthing squeezing against you through her internal walls...\n\n", false);
				}
				EngineCore.dynStats("lus", 20);
			}
		}
		if(CoC.player.findStatusAffect(StatusAffects.StoneLust) >= 0) {
			if(CoC.player.vaginas.length > 0) {
				if(CoC.player.lust < 40) {
					MainView.outputText("You squirm as the smooth stone orb vibrates within you.\n\n", false);
				} else if(CoC.player.lust < 70) {
					MainView.outputText("You involuntarily clench around the magical stone in your twat, in response to the constant erotic vibrations.\n\n", false);
				} else if(CoC.player.lust < 85) {
					MainView.outputText("You stagger in surprise as a particularly pleasant burst of vibrations erupt from the smooth stone sphere in your " + Descriptors.vaginaDescript(0) + ".\n\n", false);
				} else {
					MainView.outputText("The magical orb inside of you is making it VERY difficult to keep your focus on combat, white-hot lust suffusing your body with each new motion.\n\n", false);
				}
			} else {
				MainView.outputText("The orb continues vibrating in your ass, doing its best to arouse you.\n\n", false);
			}
			EngineCore.dynStats("lus", 7 + Math.floor(CoC.player.sens)/10);
		}
		if(CoC.player.findStatusAffect(StatusAffects.KissOfDeath) >= 0) {
			//Effect 
			MainView.outputText("Your lips burn with an unexpected flash of heat.  They sting and burn with unholy energies as a puff of ectoplasmic gas escapes your lips.  That puff must be a part of your soul!  It darts through the air to the succubus, who slurps it down like a delicious snack.  You feel feverishly hot and exhausted...\n\n", false);
			EngineCore.dynStats("lus", 5);
			Combat.takeDamage(15);
		}
		if(CoC.player.findStatusAffect(StatusAffects.DemonSeed) >= 0) {
			MainView.outputText("You feel something shift inside you, making you feel warm.  Finding the desire to fight this... hunk gets harder and harder.\n\n", false);
			EngineCore.dynStats("lus", (CoC.player.statusAffectv1(StatusAffects.DemonSeed) + Math.floor(CoC.player.sens/30) + Math.floor(CoC.player.lib/30) + Math.floor(CoC.player.cor/30)));
		}
		if(CoC.player.inHeat && CoC.player.vaginas.length > 0 && CoC.monster.totalCocks() > 0) {
			EngineCore.dynStats("lus", ( Utils.rand(CoC.player.lib/5) + 3 + Utils.rand(5)));
			MainView.outputText("Your " + Descriptors.vaginaDescript(0) + " clenches with an instinctual desire to be touched and filled.  ", false);
			MainView.outputText("If you don't end this quickly you'll give in to your heat.\n\n", false);
		}
		if(CoC.player.inRut && CoC.player.totalCocks() > 0 && CoC.monster.hasVagina()) {
			EngineCore.dynStats("lus", ( Utils.rand(CoC.player.lib/5) + 3 + Utils.rand(5)));
			if(CoC.player.totalCocks() > 1) {
				MainView.outputText("Each of y", false);
			} else {
				MainView.outputText("Y", false);
			}
			if(CoC.monster.plural) {
				MainView.outputText("our " + CoC.player.multiCockDescriptLight() + " dribbles pre-cum as you think about plowing " + CoC.monster.a + CoC.monster.short + " right here and now, fucking " + CoC.monster.pronoun3 + " " + CoC.monster.vaginaDescript() + "s until they're totally fertilized and pregnant.\n\n", false);
			} else {
				MainView.outputText("our " + CoC.player.multiCockDescriptLight() + " dribbles pre-cum as you think about plowing " + CoC.monster.a + CoC.monster.short + " right here and now, fucking " + CoC.monster.pronoun3 + " " + CoC.monster.vaginaDescript() + " until it's totally fertilized and pregnant.\n\n", false);
			}
		}
		if(CoC.player.findStatusAffect(StatusAffects.NagaVenom) >= 0) {
			//Chance to cleanse!
			if(CoC.player.findPerk(PerkLib.Medicine) >= 0 && Utils.rand(100) <= 14) {
				MainView.outputText("You manage to cleanse the naga venom from your system with your knowledge of medicine!\n\n", false);
				CoC.player.spe += CoC.player.statusAffectv1(StatusAffects.NagaVenom);
				MainView.statsView.showStatUp( 'spe' );
				CoC.player.removeStatusAffect(StatusAffects.NagaVenom);
			} else if(CoC.player.spe > 3) {
				CoC.player.addStatusValue(StatusAffects.NagaVenom,1,2);
				CoC.player.spe -= 2;
			} else {
				Combat.takeDamage(5);
			}
			MainView.outputText("You wince in pain and try to collect yourself, the naga's venom still plaguing you.\n\n", false);
			Combat.takeDamage(2);
		} else if(CoC.player.findStatusAffect(StatusAffects.TemporaryHeat) >= 0) {
			//Chance to cleanse!
			if(CoC.player.findPerk(PerkLib.Medicine) >= 0 && Utils.rand(100) <= 14) {
				MainView.outputText("You manage to cleanse the heat and rut drug from your system with your knowledge of medicine!\n\n", false);
				CoC.player.removeStatusAffect(StatusAffects.TemporaryHeat);
			} else {
				EngineCore.dynStats("lus", (CoC.player.lib/12 + 5 + Utils.rand(5)));
				if(CoC.player.hasVagina()) {
					MainView.outputText("Your " + Descriptors.vaginaDescript(0) + " clenches with an instinctual desire to be touched and filled.  ", false);
				} else if(CoC.player.totalCocks() > 0) {
					MainView.outputText("Your " + CoC.player.cockDescript(0) + " pulses and twitches, overwhelmed with the desire to breed.  ", false);
				}
				if(CoC.player.gender === 0) {
					MainView.outputText("You feel a tingle in your " + Descriptors.assholeDescript() + ", and the need to touch and fill it nearly overwhelms you.  ", false);
				}
				MainView.outputText("If you don't finish this soon you'll give in to this potent drug!\n\n", false);
			}
		}
		//Poison
		if(CoC.player.findStatusAffect(StatusAffects.Poison) >= 0) {
			//Chance to cleanse!
			if(CoC.player.findPerk(PerkLib.Medicine) >= 0 && Utils.rand(100) <= 14) {
				MainView.outputText("You manage to cleanse the poison from your system with your knowledge of medicine!\n\n", false);
				CoC.player.removeStatusAffect(StatusAffects.Poison);
			} else {
				MainView.outputText("The poison continues to work on your body, wracking you with pain!\n\n", false);
				Combat.takeDamage( 8 + Utils.rand(CoC.player.maxHP()/20));
			}
		}
		//Bondage straps + bondage fetish
		if(CoC.flags[kFLAGS.PC_FETISH] >= 2 && CoC.player.armorName === "barely-decent bondage straps") {
			MainView.outputText("The feeling of the tight, leather straps holding tightly to your body while exposing so much of it turns you on a little bit more.\n\n", false);
			EngineCore.dynStats("lus", 2);
		}
		Combat.regeneration(true);
		if(CoC.player.lust >= 100) {
			EngineCore.doNext( Combat, Combat.endLustLoss);
		}else if(CoC.player.HP <= 0) {
			EngineCore.doNext( Combat, Combat.endHpLoss);
		}
	};
	Combat.regeneration = function(combat) {
		if(combat === undefined) {
			combat = true;
		}
		var healingPercent = 0;
		//Regeneration
		if(CoC.player.findPerk(PerkLib.Regeneration) >= 0) {
			healingPercent += combat ? 1 : 2;
		}
		if(CoC.player.findPerk(PerkLib.Regeneration2) >= 0) {
			healingPercent += combat ? 2 : 4;
		}
		if(CoC.player.findPerk(PerkLib.LustyRegeneration) >= 0) {
			healingPercent += combat ? 1 : 2;
		}
		if(CoC.player.armorName === "skimpy nurse's outfit") {
			healingPercent += 2;
		}else if(CoC.player.armorName === "goo armor") {
			healingPercent += combat ? 2 : 3;
		}
		if(healingPercent > (combat ? 5 : 10)) {
			healingPercent = 5;
		}
		EngineCore.HPChange(Math.round(CoC.player.maxHP() * healingPercent / 100), false);
	};
	Combat.startCombat = function(monster,plotFight) {
		OnLoadVariables.plotFight = plotFight;
		MainView.hideMenuButton( MainView.MENU_DATA );
		MainView.hideMenuButton( MainView.MENU_APPEARANCE );
		MainView.hideMenuButton( MainView.MENU_LEVEL );
		MainView.hideMenuButton( MainView.MENU_PERKS );
		//Flag the game as being "in combat"
		CoC.setInCombat(true);
		CoC.monster = monster;
		if(CoC.monster.short === "Ember") {
			CoC.monster.pronoun1 = SceneLib.emberScene.emberMF("he","she");
			CoC.monster.pronoun2 = SceneLib.emberScene.emberMF("him","her");
			CoC.monster.pronoun3 = SceneLib.emberScene.emberMF("his","her");
		}
		//Reduce enemy def if player has precision!
		if(CoC.player.findPerk(PerkLib.Precision) >= 0 && CoC.player.inte >= 25) {
			if(CoC.monster.armorDef <= 10) {
				CoC.monster.armorDef = 0;
			} else {
				CoC.monster.armorDef -= 10;
			}
		}
		EngineCore.doNext( MainView, MainView.playerMenu);
	};
	Combat.startCombatImmediate = function(monster, plotFight) {
		Combat.startCombat(monster, plotFight);
	};
	Combat.display = function() {
		if (!CoC.monster.checkCalled){
			MainView.outputText("<B>/!\\BUG! Monster.checkMonster() is not called! Calling it now...</B>\n");
			CoC.monster.checkMonster();
		}
		if (CoC.monster.checkError !== ""){
			MainView.outputText("<B>/!\\BUG! Monster is not correctly initialized! <u>" + CoC.monster.checkError+"</u></b>\n");
		}
		var math = CoC.monster.HPRatio();
		var percent = "(<b>" + (Math.floor(math * 1000) / 10) + "% HP</b>)";
		if (CoC.monster.imageName !== "") {
			var monsterName = "monster-" + CoC.monster.imageName;
			MainView.outputText(ImageManager.showImage(monsterName), false,false);
		}
		MainView.outputText("<b>You are fighting ", false);
		MainView.outputText(CoC.monster.a + CoC.monster.short + ":</b> (Level: " + CoC.monster.level + ")\n");
		if(CoC.player.findStatusAffect(StatusAffects.Blind) >= 0) {
			MainView.outputText("It's impossible to see anything!\n");
		} else {
			MainView.outputText(CoC.monster.long + "\n", false);
			//Bonus sand trap stuff
			if(CoC.monster.findStatusAffect(StatusAffects.Level) >= 0) {
				var status = CoC.monster.statusAffectv1(StatusAffects.Level);
				//[(new PG for PC height levels)PC level 4: 
				MainView.outputText("\n");
				if(status === 4) {
					MainView.outputText("You are right at the edge of its pit.  If you can just manage to keep your footing here, you'll be safe.");
				} else if(status === 3) {
					MainView.outputText("The sand sinking beneath your feet has carried you almost halfway into the creature's pit.");
				} else {
					MainView.outputText("The dunes tower above you and the hissing of sand fills your ears.  <b>The leering sandtrap is almost on top of you!</b>");
				}
				//no new PG)
				MainView.outputText("  You could try attacking it with your " + CoC.player.weaponName + ", but that will carry you straight to the bottom.  Alternately, you could try to tease it or hit it at range, or wait and maintain your footing until you can clamber up higher.");
				MainView.outputText("\n");
			}
			if(CoC.monster.plural) {
				if(math >= 1) {
					MainView.outputText("You see " + CoC.monster.pronoun1 + " are in perfect health.", false);
				} else if(math > 0.75) {
					MainView.outputText("You see " + CoC.monster.pronoun1 + " aren't very hurt.", false);
				} else if(math > 0.5) {
					MainView.outputText("You see " + CoC.monster.pronoun1 + " are slightly wounded.", false);
				} else if(math > 0.25) {
					MainView.outputText("You see " + CoC.monster.pronoun1 + " are seriously hurt.", false);
				} else {
					MainView.outputText("You see " + CoC.monster.pronoun1 + " are unsteady and close to death.", false);
				}
			} else {
				if(math >= 1) {
					MainView.outputText("You see " + CoC.monster.pronoun1 + " is in perfect health.", false);
				} else if(math > 0.75) {
					MainView.outputText("You see " + CoC.monster.pronoun1 + " isn't very hurt.", false);
				} else if(math > 0.5) {
					MainView.outputText("You see " + CoC.monster.pronoun1 + " is slightly wounded.", false);
				} else if(math > 0.25) {
					MainView.outputText("You see " + CoC.monster.pronoun1 + " is seriously hurt.", false);
				} else {
					MainView.outputText("You see " + CoC.monster.pronoun1 + " is unsteady and close to death.", false);
				}
			}
			MainView.outputText("  " + percent + "\n", false);
			Combat.showMonsterLust();
		}
		$log.debug(CoC.monster);
	};
	Combat.showMonsterLust = function() {
		//Entrapped
		if(CoC.monster.findStatusAffect(StatusAffects.Constricted) >= 0) {
			MainView.outputText(CoC.monster.getCapitalA() + CoC.monster.short + " is currently wrapped up in your tail-coils!  ", false);
		}
		//Venom stuff!
		if(CoC.monster.findStatusAffect(StatusAffects.NagaVenom) >= 0) {
			if(CoC.monster.plural) {
				if(CoC.monster.statusAffectv1(StatusAffects.NagaVenom) <= 1) {
					MainView.outputText("You notice " + CoC.monster.pronoun1 + " are beginning to show signs of weakening, but there still appears to be plenty of fight left in " + CoC.monster.pronoun2 + ".  ", false);
				} else {
					MainView.outputText("You notice " + CoC.monster.pronoun1 + " are obviously affected by your venom, " + CoC.monster.pronoun3 + " movements become unsure, and " + CoC.monster.pronoun3 + " balance begins to fade. Sweat begins to roll on " + CoC.monster.pronoun3 + " skin. You wager " + CoC.monster.pronoun1 + " are probably beginning to regret provoking you.  ", false);
				}
			} else { //Not plural
				if(CoC.monster.statusAffectv1(StatusAffects.NagaVenom) <= 1) {
					MainView.outputText("You notice " + CoC.monster.pronoun1 + " is beginning to show signs of weakening, but there still appears to be plenty of fight left in " + CoC.monster.pronoun2 + ".  ", false);
				} else {
					MainView.outputText("You notice " + CoC.monster.pronoun1 + " is obviously affected by your venom, " + CoC.monster.pronoun3 + " movements become unsure, and " + CoC.monster.pronoun3 + " balance begins to fade. Sweat is beginning to roll on " + CoC.monster.pronoun3 + " skin. You wager " + CoC.monster.pronoun1 + " is probably beginning to regret provoking you.  ", false);
				}
			}
			CoC.monster.spe -= CoC.monster.statusAffectv1(StatusAffects.NagaVenom);
			CoC.monster.str -= CoC.monster.statusAffectv1(StatusAffects.NagaVenom);
			if(CoC.monster.spe < 1) {
				CoC.monster.spe = 1;
			}
			if(CoC.monster.str < 1) {
				CoC.monster.str = 1;
			}
		}
		if(CoC.monster.short === "harpy") {
			//(Enemy slightly aroused) 
			if(CoC.monster.lust >= 45 && CoC.monster.lust < 70) {
				MainView.outputText("The harpy's actions are becoming more and more erratic as she runs her mad-looking eyes over your body, her chest jiggling, clearly aroused.  ", false);
			} else if(CoC.monster.lust >= 70 && CoC.monster.lust < 90) { //(Enemy moderately aroused) 
				MainView.outputText("She stops flapping quite so frantically and instead gently sways from side to side, showing her soft, feathery body to you, even twirling and raising her tail feathers, giving you a glimpse of her plush pussy, glistening with fluids.", false);
			}else if(CoC.monster.lust >= 90) { //(Enemy dangerously aroused)
				MainView.outputText("You can see her thighs coated with clear fluids, the feathers matted and sticky as she struggles to contain her lust.", false);
			}
		} else if(CoC.monster.hasClassName( 'Clara' )) {
			//Clara is becoming aroused
			if(CoC.monster.lust > 40 && CoC.monster.lust <= 65) {
				MainView.outputText("The anger in her motions is weakening.");
			} else if(CoC.monster.lust <= 75) { //Clara is somewhat aroused
				MainView.outputText("Clara seems to be becoming more aroused than angry now.");
			} else if(CoC.monster.lust <= 85) { //Clara is very aroused
				MainView.outputText("Clara is breathing heavily now, the signs of her arousal becoming quite visible now.");
			} else { //Clara is about to give in
				MainView.outputText("It looks like Clara is on the verge of having her anger overwhelmed by her lusts.");
			}
		} else if(CoC.monster.short === "Minerva") {
			if(CoC.monster.lust >= 40 && CoC.monster.lust < 60) {
				MainView.outputText("Letting out a groan Minerva shakes her head, focusing on the fight at hand.  The bulge in her short is getting larger, but the siren ignores her growing hard-on and continues fighting.  ");
			} else if(CoC.monster.lust < 80) {
				MainView.outputText("Tentacles are squirming out from the crotch of her shorts as the throbbing bulge grows bigger and bigger, becoming harder and harder... for Minerva to ignore.  A damp spot has formed just below the bulge.  ");
			} else {
				MainView.outputText("She's holding onto her weapon for support as her face is flushed and pain-stricken.  Her tiny, short shorts are painfully holding back her quaking bulge, making the back of the fabric act like a thong as they ride up her ass and struggle against her cock.  Her cock-tentacles are lashing out in every direction.  The dampness has grown and is leaking down her leg.");
			}
		} else if(CoC.monster.short === "Cum Witch") {
			if(CoC.monster.lust >= 40 && CoC.monster.lust < 50) {
				MainView.outputText("Her nipples are hard, and poke two visible tents into the robe draped across her mountainous melons.  ");
			} else if(CoC.monster.lust < 75) {
				MainView.outputText("Wobbling dangerously, you can see her semi-hard shaft rustling the fabric as she moves, evidence of her growing needs.  ");
			} else {
				MainView.outputText("Swelling obscenely, the Cum Witch's thick cock stands out hard and proud, its bulbous tip rustling through the folds of her fabric as she moves and leaving dark smears in its wake.  ");
			}
			if(CoC.monster.lust >= 85) {
				MainView.outputText("Every time she takes a step, those dark patches seem to double in size.  ");
			}
			if(CoC.monster.lust >= 93) {
				MainView.outputText("There's no doubt about it, the Cum Witch is dripping with pre-cum and so close to caving in.  Hell, the lower half of her robes are slowly becoming a seed-stained mess.  ");
			}
			if(CoC.monster.lust >= 70) {
				MainView.outputText("She keeps licking her lips whenever she has a moment, and she seems to be breathing awfully hard.  ");
			}
		} else if(CoC.monster.short === "Kelt") {
			if(CoC.monster.lust < 50) {
				MainView.outputText("Kelt actually seems to be turned off for once in his miserable life.  His maleness is fairly flaccid and droopy.  ");
			} else if(CoC.monster.lust < 60) {
				MainView.outputText("Kelt's gotten a little stiff down below, but he still seems focused on taking you down.  ");
			} else if(CoC.monster.lust < 70) {
				MainView.outputText("Kelt's member has grown to its full size and even flared a little at the tip.  It bobs and sways with every movement he makes, reminding him how aroused you get him.  ");
			} else if(CoC.monster.lust < 80) {
				MainView.outputText("Kelt is unabashedly aroused at this point.  His skin is flushed, his manhood is erect, and a thin bead of pre has begun to bead underneath.  ");
			} else if(CoC.monster.lust < 90) {
				MainView.outputText("Kelt seems to be having trouble focusing.  He keeps pausing and flexing his muscles, slapping his cock against his belly and moaning when it smears his pre-cum over his equine underside.  ");
			} else {
				MainView.outputText("There can be no doubt that you're having quite the effect on Kelt.  He keeps fidgeting, dripping pre-cum everywhere as he tries to keep up the facade of fighting you.  His maleness is continually twitching and bobbing, dripping messily.  He's so close to giving in...");
			}
		} else if(CoC.monster.short === "green slime") {
			if(CoC.monster.lust >= 45 && CoC.monster.lust < 65) {
				MainView.outputText("A lump begins to form at the base of the figure's torso, where its crotch would be.  ", false); 
			} else if(CoC.monster.lust < 85) {
				MainView.outputText("A distinct lump pulses at the base of the slime's torso, as if something inside the creature were trying to escape.  ", false);
			} else if(CoC.monster.lust < 93) {
				MainView.outputText("A long, thick pillar like a small arm protrudes from the base of the slime's torso.  ", false);
			} else {
				MainView.outputText("A long, thick pillar like a small arm protrudes from the base of the slime's torso.  Its entire body pulses, and it is clearly beginning to lose its cohesion.  ", false);
			}
		} else if(CoC.monster.short === "Sirius, a naga hypnotist") {
			if(CoC.monster.lust >= 40 && CoC.monster.lust >= 40) {
				MainView.outputText("You can see the tip of his reptilian member poking out of its protective slit. ");
			} else if(CoC.monster.lust >= 60) {
				MainView.outputText("His cock is now completely exposed and half-erect, yet somehow he still stays focused on your eyes and his face is inexpressive.  ");
			} else {
				MainView.outputText("His cock is throbbing hard, you don't think it will take much longer for him to pop.   Yet his face still looks inexpressive... despite the beads of sweat forming on his brow.  ");
			}
		} else if(CoC.monster.short === "kitsune") {
			if(CoC.monster.lust > 30 && CoC.monster.lust < 50) {
				MainView.outputText("The kitsune's face is slightly flushed.  She fans herself with her hand, watching you closely.");
			} else if(CoC.monster.lust > 30 && CoC.monster.lust < 75) {
				MainView.outputText("The kitsune's cheeks are bright pink, and you can see her rubbing her thighs together and squirming with lust.");
			} else if(CoC.monster.lust > 30) {
				if(CoC.monster.hairColor === "red") {
					MainView.outputText("The kitsune is openly aroused, unable to hide the obvious bulge in her robes as she seems to be struggling not to stroke it right here and now.");
				} else {
					MainView.outputText("The kitsune is openly aroused, licking her lips frequently and desperately trying to hide the trail of fluids dripping down her leg.");
				}
			}
		} else if(CoC.monster.short === "demons") {
			if(CoC.monster.lust > 30 && CoC.monster.lust < 60) {
				MainView.outputText("The demons lessen somewhat in the intensity of their attack, and some even eye up your assets as they strike at you.", false);
			} else if(CoC.monster.lust < 80) {
				MainView.outputText("The demons are obviously steering clear from damaging anything you might use to fuck and they're starting to leave their hands on you just a little longer after each blow. Some are starting to cop quick feels with their other hands and you can smell the demonic lust of a dozen bodies on the air.", false);
			} else {
				MainView.outputText(" The demons are less and less willing to hit you and more and more willing to just stroke their hands sensuously over you. The smell of demonic lust is thick on the air and part of the group just stands there stroking themselves openly.", false);
			}
		} else if(CoC.monster.plural) {
			if(CoC.monster.lust > 50 && CoC.monster.lust < 60) {
				MainView.outputText(CoC.monster.getCapitalA() + CoC.monster.short + "' skin remains flushed with the beginnings of arousal.  ", false);
			} else if(CoC.monster.lust < 70) {
				MainView.outputText(CoC.monster.getCapitalA() + CoC.monster.short + "' eyes constantly dart over your most sexual parts, betraying " + CoC.monster.pronoun3 + " lust.  ", false);
			}
			if(CoC.monster.cocks.length > 0) {
				if(CoC.monster.lust >= 70 && CoC.monster.lust < 85) {
					MainView.outputText(CoC.monster.getCapitalA() + CoC.monster.short + " are having trouble moving due to the rigid protrusion in " + CoC.monster.pronoun3 + " groins.  ", false);
				} else {
					MainView.outputText(CoC.monster.getCapitalA() + CoC.monster.short + " are panting and softly whining, each movement seeming to make " + CoC.monster.pronoun3 + " bulges more pronounced.  You don't think " + CoC.monster.pronoun1 + " can hold out much longer.  ", false);
				}
			}
			if(CoC.monster.vaginas.length > 0) {
				if(CoC.monster.lust >= 70 && CoC.monster.lust < 85) {
					MainView.outputText(CoC.monster.getCapitalA() + CoC.monster.short + " are obviously turned on, you can smell " + CoC.monster.pronoun3 + " arousal in the air.  ", false);
				} else {
					MainView.outputText(CoC.monster.getCapitalA() + CoC.monster.short + "' " + CoC.monster.vaginaDescript() + "s are practically soaked with their lustful secretions.  ", false);
				}
			}
		} else {
			if(CoC.monster.lust > 50 && CoC.monster.lust < 60) {
				MainView.outputText(CoC.monster.getCapitalA() + CoC.monster.short + "'s skin remains flushed with the beginnings of arousal.  ", false);
			} else if(CoC.monster.lust < 70) {
				MainView.outputText(CoC.monster.getCapitalA() + CoC.monster.short + "'s eyes constantly dart over your most sexual parts, betraying " + CoC.monster.pronoun3 + " lust.  ", false);
			}
			if(CoC.monster.cocks.length > 0) {
				if(CoC.monster.lust >= 70 && CoC.monster.lust < 85) {
					MainView.outputText(CoC.monster.getCapitalA() + CoC.monster.short + " is having trouble moving due to the rigid protrusion in " + CoC.monster.pronoun3 + " groin.  ", false);
				} else {
					MainView.outputText(CoC.monster.getCapitalA() + CoC.monster.short + " is panting and softly whining, each movement seeming to make " + CoC.monster.pronoun3 + " bulge more pronounced.  You don't think " + CoC.monster.pronoun1 + " can hold out much longer.  ", false);
				}
			}
			if(CoC.monster.vaginas.length > 0) {
				if(CoC.monster.lust >= 70 && CoC.monster.lust < 85) {
					MainView.outputText(CoC.monster.getCapitalA() + CoC.monster.short + " is obviously turned on, you can smell " + CoC.monster.pronoun3 + " arousal in the air.  ", false);
				} else {
					MainView.outputText(CoC.monster.getCapitalA() + CoC.monster.short + "'s " + CoC.monster.vaginaDescript() + " is practically soaked with her lustful secretions.  ", false);
				}
			}
		}
	};
	// This is a bullshit work around to get the parser to do what I want without having to fuck around in it's code.
	Combat.teaseText = function() {
		Combat.tease(true);
		return "";
	};
	// Just text should force the function to purely emit the test text to the output display, and not have any other side effects
	Combat.tease = function(justText) {
		if (!justText) {
			MainView.outputText("", true);
		}
		//You cant tease a blind guy!
		if(CoC.monster.findStatusAffect(StatusAffects.Blind) >= 0) {
			MainView.outputText("You do your best to tease " + CoC.monster.a + CoC.monster.short + " with your body.  It doesn't work - you blinded " + CoC.monster.pronoun2 + ", remember?\n\n", true);
			return;
		}
		if(CoC.player.findStatusAffect(StatusAffects.Sealed) >= 0 && CoC.player.statusAffectv2(StatusAffects.Sealed) === 1) {
			MainView.outputText("You do your best to tease " + CoC.monster.a + CoC.monster.short + " with your body.  Your artless twirls have no effect, as <b>your ability to tease is sealed.</b>\n\n", true);
			return;
		}	
		if(CoC.monster.short === "Sirius, a naga hypnotist") {
			MainView.outputText("He is too focused on your eyes to pay any attention to your teasing moves, <b>looks like you'll have to beat him up.</b>\n\n");
			return;
		}
		Combat.fatigueRecovery();
		var bimbo = false;
		var bro = false;
		var futa = false;
		var choices = [];
		//Tags used for bonus damage and chance later on
		var breasts = false;
		var penis = false;
		var balls = false;
		var vagina = false;
		var anus = false;
		var ass = false;
		//If auto = true, set up bonuses using above flags
		var auto = true;
		//==============================
		//Determine basic success chance.
		//==============================
		var chance = 60;
		//5% chance for each tease level.
		chance += CoC.player.teaseLevel * 5;
		//10% for seduction perk
		if(CoC.player.findPerk(PerkLib.Seduction) >= 0) {
			chance += 10;
		}
		//10% for sexy armor types
		if(CoC.player.findPerk(PerkLib.SluttySeduction) >= 0) {
			chance += 10;
		}
		//10% for bimbo shits
		if(CoC.player.findPerk(PerkLib.BimboBody) >= 0) {
			chance += 10;
			bimbo = true;
		}
		if(CoC.player.findPerk(PerkLib.BroBody) >= 0) {
			chance += 10;
			bro = true;
		}
		if(CoC.player.findPerk(PerkLib.FutaForm) >= 0) {
			chance += 10;
			futa = true;
		}
		//2 & 2 for seductive valentines!
		if(CoC.player.findPerk(PerkLib.SensualLover) >= 0) {
			chance += 2;
		}
		if (CoC.player.findPerk(PerkLib.ChiReflowLust) >= 0) {
			chance += SceneLib.umasShop.NEEDLEWORK_LUST_TEASE_MULTI;
		}
		//==============================
		//Determine basic damage.
		//==============================
		var damage = 6 + Utils.rand(3);
		if(CoC.player.findPerk(PerkLib.SensualLover) >= 0) {
			damage += 2;
		}
		if(CoC.player.findPerk(PerkLib.Seduction) >= 0) {
			damage += 5;
		}
		//+ slutty armor bonus
		if(CoC.player.findPerk(PerkLib.SluttySeduction) >= 0) {
			damage += CoC.player.perkv1(PerkLib.SluttySeduction);
		}
		//10% for bimbo shits
		if(bimbo || bro || futa) {
			damage += 5;
			bimbo = true;
		}
		damage += CoC.player.level;
		damage += CoC.player.teaseLevel*2;
		//==============================
		//TEASE SELECT CHOICES
		//==BASICS========
		//0 butt shake
		//1 breast jiggle
		//2 pussy flash
		//3 cock flash
		//==BIMBO STUFF===
		//4 butt shake
		//5 breast jiggle
		//6 pussy flash
		//7 special Adjatha-crafted bend over bimbo times
		//==BRO STUFF=====
		//8 Pec Dance
		//9 Heroic Pose
		//10 Bulgy groin thrust
		//11 Show off dick
		//==EXTRAS========
		//12 Cat flexibility.
		//13 Pregnant
		//14 Brood Mother
		//15 Nipplecunts
		//16 Anal gape
		//17 Bee abdomen tease
		//18 DOG TEASE
		//19 Maximum Femininity:
		//20 Maximum MAN:
		//21 Perfect Androgyny:
		//22 SPOIDAH SILK
		//23 RUT
		//24 Poledance - req's staff! - Req's gender!  Req's TITS!
		//25 Tall Tease! - Reqs 2+ feet & PC Cunt!
		//26 SMART PEEPS! 70+ int, arouse spell!
		//27 - FEEDER
		//28 FEMALE TEACHER COSTUME TEASE
		//29 Male Teacher Outfit Tease
		//30 Naga Fetish Clothes
		//31 Centaur harness clothes
		//32 Genderless servant clothes
		//33 Crotch Revealing Clothes (herm only?)
		//34 Maid Costume (female only):
		//35 Servant Boy Clothes (male only)
		//36 Bondage Patient Clothes 
		//37 Kitsune Tease
		//38 Kitsune Tease
		//39 Kitsune Tease
		//40 Kitsune Tease
		//41 Kitsune Gendered Tease
		//42 Urta teases
		//43 Cowgirl teases
		//44 Bikini Mail Tease
		//==============================
		//BUILD UP LIST OF TEASE CHOICES!
		//==============================
		//Futas!
		if((futa || bimbo) && CoC.player.gender === 3) {
			//Once chance of butt.
			choices.push(4);
			//Big butts get more butt
			if(CoC.player.buttRating >= 7) {
				choices.push(4);
			}
			if(CoC.player.buttRating >= 10) {
				choices.push(4);
			}
			if(CoC.player.buttRating >= 14) {
				choices.push(4);
			}
			if(CoC.player.buttRating >= 20) {
				choices.push(4);
			}
			if(CoC.player.buttRating >= 25) {
				choices.push(4);
			}
			//Breast jiggle!
			if(CoC.player.biggestTitSize() >= 2) {
				choices.push(5);
			}
			if(CoC.player.biggestTitSize() >= 4) {
				choices.push(5);
			}
			if(CoC.player.biggestTitSize() >= 8) {
				choices.push(5);
			}
			if(CoC.player.biggestTitSize() >= 15) {
				choices.push(5);
			}
			if(CoC.player.biggestTitSize() >= 30) {
				choices.push(5);
			}
			if(CoC.player.biggestTitSize() >= 50) {
				choices.push(5);
			}
			if(CoC.player.biggestTitSize() >= 75) {
				choices.push(5);
			}
			if(CoC.player.biggestTitSize() >= 100) {
				choices.push(5);
			}
			//Pussy Flash!
			if(CoC.player.hasVagina()) {
				choices.push(2);
				if(CoC.player.wetness() >= 3) {
					choices.push(6);
				}
				if(CoC.player.wetness() >= 5) {
					choices.push(6);
				}
				if(CoC.player.vaginalCapacity() >= 30) {
					choices.push(6);
				}
				if(CoC.player.vaginalCapacity() >= 60) {
					choices.push(6);
				}
				if(CoC.player.vaginalCapacity() >= 75) {
					choices.push(6);
				}
			}
			//Adj special!
			if(CoC.player.hasVagina() && CoC.player.buttRating >= 8 && CoC.player.hipRating >= 6 && CoC.player.biggestTitSize() >= 4) {
				choices.push(7);
				choices.push(7);
				choices.push(7);
				choices.push(7);
			}
			//Cock flash!
			if(futa && CoC.player.hasCock()) {
				choices.push(10);
				choices.push(11);
				if(CoC.player.cockTotal() > 1) {
					choices.push(10);
				}
				if(CoC.player.cockTotal() >= 2) {
					choices.push(11);
				}
				if(CoC.player.biggestCockArea() >= 10) {
					choices.push(10);
				}
				if(CoC.player.biggestCockArea() >= 25) {
					choices.push(11);
				}
				if(CoC.player.biggestCockArea() >= 50) {
					choices.push(11);
				}
				if(CoC.player.biggestCockArea() >= 75) {
					choices.push(10);
				}
				if(CoC.player.biggestCockArea() >= 100) {
					choices.push(11);
				}
				if(CoC.player.biggestCockArea() >= 300) {
					choices.push(10);
				}
			}
		} else if(bro) {
			//8 Pec Dance
			if(CoC.player.biggestTitSize() < 1 && CoC.player.tone >= 60) {
				choices.push(8);
				if(CoC.player.tone >= 70) {
					choices.push(8);
				}
				if(CoC.player.tone >= 80) {
					choices.push(8);
				}
				if(CoC.player.tone >= 90) {
					choices.push(8);
				}
				if(CoC.player.tone === 100) {
					choices.push(8);
				}
			}
			//9 Heroic Pose
			if(CoC.player.tone >= 60 && CoC.player.str >= 50) {
				choices.push(9);
				if(CoC.player.tone >= 80) {
					choices.push(9);
				}
				if(CoC.player.str >= 70) {
					choices.push(9);
				}
				if(CoC.player.tone >= 90) {
					choices.push(9);
				}
				if(CoC.player.str >= 80) {
					choices.push(9);
				}
			}	
			//Cock flash!
			if(CoC.player.hasCock()) {
				choices.push(10);
				choices.push(11);
				if(CoC.player.cockTotal() > 1) {
					choices.push(10);
				}
				if(CoC.player.cockTotal() >= 2) {
					choices.push(11);
				}
				if(CoC.player.biggestCockArea() >= 10) {
					choices.push(10);
				}
				if(CoC.player.biggestCockArea() >= 25) {
					choices.push(11);
				}
				if(CoC.player.biggestCockArea() >= 50) {
					choices.push(11);
				}
				if(CoC.player.biggestCockArea() >= 75) {
					choices.push(10);
				}
				if(CoC.player.biggestCockArea() >= 100) {
					choices.push(11);
				}
				if(CoC.player.biggestCockArea() >= 300) {
					choices.push(10);
				}
			}
		} else { //VANILLA FOLKS
			//Once chance of butt.
			choices.push(0);
			//Big butts get more butt
			if(CoC.player.buttRating >= 7) {
				choices.push(0);
			}
			if(CoC.player.buttRating >= 10) {
				choices.push(0);
			}
			if(CoC.player.buttRating >= 14) {
				choices.push(0);
			}
			if(CoC.player.buttRating >= 20) {
				choices.push(0);
			}
			if(CoC.player.buttRating >= 25) {
				choices.push(0);
			}
			//Breast jiggle!
			if(CoC.player.biggestTitSize() >= 2) {
				choices.push(1);
			}
			if(CoC.player.biggestTitSize() >= 4) {
				choices.push(1);
			}
			if(CoC.player.biggestTitSize() >= 8) {
				choices.push(1);
			}
			if(CoC.player.biggestTitSize() >= 15) {
				choices.push(1);
			}
			if(CoC.player.biggestTitSize() >= 30) {
				choices.push(1);
			}
			if(CoC.player.biggestTitSize() >= 50) {
				choices.push(1);
			}
			if(CoC.player.biggestTitSize() >= 75) {
				choices.push(1);
			}
			if(CoC.player.biggestTitSize() >= 100) {
				choices.push(1);
			}
			//Pussy Flash!
			if(CoC.player.hasVagina()) {
				choices.push(2);
				if(CoC.player.wetness() >= 3) {
					choices.push(2);
				}
				if(CoC.player.wetness() >= 5) {
					choices.push(2);
				}
				if(CoC.player.vaginalCapacity() >= 30) {
					choices.push(2);
				}
				if(CoC.player.vaginalCapacity() >= 60) {
					choices.push(2);
				}
				if(CoC.player.vaginalCapacity() >= 75) {
					choices.push(2);
				}
			}
			//Cock flash!
			if(CoC.player.hasCock()) {
				choices.push(3);
				if(CoC.player.cockTotal() > 1) {
					choices.push(3);
				}
				if(CoC.player.cockTotal() >= 2) {
					choices.push(3);
				}
				if(CoC.player.biggestCockArea() >= 10) {
					choices.push(3);
				}
				if(CoC.player.biggestCockArea() >= 25) {
					choices.push(3);
				}
				if(CoC.player.biggestCockArea() >= 50) {
					choices.push(3);
				}
				if(CoC.player.biggestCockArea() >= 75) {
					choices.push(3);
				}
				if(CoC.player.biggestCockArea() >= 100) {
					choices.push(3);
				}
				if(CoC.player.biggestCockArea() >= 300) {
					choices.push(3);
				}
			}
		}
		//==EXTRAS========
		//12 Cat flexibility.
		if(CoC.player.findPerk(PerkLib.Flexibility) >= 0 && CoC.player.isBiped() && CoC.player.hasVagina()) {
			choices.push(12);
			choices.push(12);
			if(CoC.player.wetness() >= 3) {
				choices.push(12);
			}
			if(CoC.player.wetness() >= 5) {
				choices.push(12);
			}
			if(CoC.player.vaginalCapacity() >= 30) {
				choices.push(12);
			}
		}
		//13 Pregnant
		if(CoC.player.pregnancyIncubation <= 216 && CoC.player.pregnancyIncubation > 0) {
			choices.push(13);
			if(CoC.player.biggestLactation() >= 1) {
				choices.push(13);
			}
			if(CoC.player.pregnancyIncubation <= 180) {
				choices.push(13);
			}
			if(CoC.player.pregnancyIncubation <= 120) {
				choices.push(13);
			}
			if(CoC.player.pregnancyIncubation <= 100) {
				choices.push(13);
			}
			if(CoC.player.pregnancyIncubation <= 50) {
				choices.push(13);
			}
			if(CoC.player.pregnancyIncubation <= 24) {
				choices.push(13);
				choices.push(13);
				choices.push(13);
				choices.push(13);
			}
		}
		//14 Brood Mother
		if(CoC.monster.hasCock() && CoC.player.hasVagina() && CoC.player.findPerk(PerkLib.BroodMother) >= 0 && (CoC.player.pregnancyIncubation <= 0 || CoC.player.pregnancyIncubation > 216)) {
			choices.push(14);
			choices.push(14);
			choices.push(14);
			if(CoC.player.inHeat) {
				choices.push(14);
				choices.push(14);
				choices.push(14);
				choices.push(14);
				choices.push(14);
				choices.push(14);
				choices.push(14);
			}
		}
		//15 Nipplecunts
		if(CoC.player.hasFuckableNipples()) {
			choices.push(15);
			choices.push(15);
			if(CoC.player.hasVagina()) {
				choices.push(15);
				choices.push(15);
				choices.push(15);
			}
			if(CoC.player.wetness() >= 3) {
				choices.push(15);
			}
			if(CoC.player.wetness() >= 5) {
				choices.push(15);
			}
			if(CoC.player.biggestTitSize() >= 3) {
				choices.push(15);
			}
			if(CoC.player.nippleLength >= 3) {
				choices.push(15);
			}
		}
		//16 Anal gape
		if(CoC.player.ass.analLooseness >= 4) {
			choices.push(16);
			if(CoC.player.ass.analLooseness >= 5) {
				choices.push(16);
			}
		}		
		//17 Bee abdomen tease
		if(CoC.player.tailType === AppearanceDefs.TAIL_TYPE_BEE_ABDOMEN) {
			choices.push(17);
			choices.push(17);
		}
		//18 DOG TEASE
		if(CoC.player.dogScore() >= 4 && CoC.player.hasVagina() && CoC.player.isBiped()) {
			choices.push(18);
			choices.push(18);
		}
		//19 Maximum Femininity:
		if(CoC.player.femininity >= 100) {
			choices.push(19);
			choices.push(19);
			choices.push(19);
		}
		//20 Maximum MAN:
		if(CoC.player.femininity <= 0) {
			choices.push(20);
			choices.push(20);
			choices.push(20);
		}
		//21 Perfect Androgyny:
		if(CoC.player.femininity === 50) {
			choices.push(21);
			choices.push(21);
			choices.push(21);
		}
		//22 SPOIDAH SILK
		if(CoC.player.tailType === AppearanceDefs.TAIL_TYPE_SPIDER_ADBOMEN) {
			choices.push(22);
			choices.push(22);
			choices.push(22);
			if(CoC.player.spiderScore() >= 4) {
				choices.push(22);
				choices.push(22);
				choices.push(22);
			}
		}
		//23 RUT
		if(CoC.player.inRut && CoC.monster.hasVagina() && CoC.player.hasCock()) {
			choices.push(23);
			choices.push(23);
			choices.push(23);
			choices.push(23);
			choices.push(23);
		}
		//24 Poledance - req's staff! - Req's gender!  Req's TITS!
		if(CoC.player.weaponName === "wizard's staff" && CoC.player.biggestTitSize() >= 1 && CoC.player.gender > 0) {
			choices.push(24);
			choices.push(24);
			choices.push(24);
			choices.push(24);
			choices.push(24);
		}
		//25 Tall Tease! - Reqs 2+ feet & PC Cunt!
		if(CoC.player.tallness - CoC.monster.tallness >= 24 && CoC.player.biggestTitSize() >= 4) {
			choices.push(25);
			choices.push(25);
			choices.push(25);
			choices.push(25);
			choices.push(25);
		}
		//26 SMART PEEPS! 70+ int, arouse spell!
		if(CoC.player.inte >= 70 && CoC.player.findStatusAffect(StatusAffects.KnowsArouse) >= 0) {
			choices.push(26);
			choices.push(26);
			choices.push(26);
		}
		//27 FEEDER
		if(CoC.player.findPerk(PerkLib.Feeder) >= 0 && CoC.player.biggestTitSize() >= 4) {
			choices.push(27);
			choices.push(27);
			choices.push(27);
			if(CoC.player.biggestTitSize() >= 10) {
				choices.push(27);
			}
			if(CoC.player.biggestTitSize() >= 15) {
				choices.push(27);
			}
			if(CoC.player.biggestTitSize() >= 25) {
				choices.push(27);
			}
			if(CoC.player.biggestTitSize() >= 40) {
				choices.push(27);
			}
			if(CoC.player.biggestTitSize() >= 60) {
				choices.push(27);
			}
			if(CoC.player.biggestTitSize() >= 80) {
				choices.push(27);
			}
		}
		//28 FEMALE TEACHER COSTUME TEASE
		if(CoC.player.armorName === "backless female teacher's clothes" && CoC.player.gender === 2) {
			choices.push(28);
			choices.push(28);
			choices.push(28);
			choices.push(28);
		}
		//29 Male Teacher Outfit Tease
		if(CoC.player.armorName === "formal vest, tie, and crotchless pants" && CoC.player.gender === 1) {
			choices.push(29);
			choices.push(29);
			choices.push(29);
			choices.push(29);
		}
		//30 Naga Fetish Clothes
		if(CoC.player.armorName === "headdress, necklaces, and many body-chains") {
			choices.push(30);
			choices.push(30);
			choices.push(30);
			choices.push(30);
		}
		//31 Centaur harness clothes
		if(CoC.player.armorName === "bridle bit and saddle set") {
			choices.push(31);
			choices.push(31);
			choices.push(31);
			choices.push(31);
		}
		//32 Genderless servant clothes
		if(CoC.player.armorName === "servant's clothes" && CoC.player.gender === 0) {
			choices.push(32);
			choices.push(32);
			choices.push(32);
			choices.push(32);
		}
		//33 Crotch Revealing Clothes (herm only?)
		if(CoC.player.armorName === "crotch-revealing clothes" && CoC.player.gender === 3) {
			choices.push(33);
			choices.push(33);
			choices.push(33);
			choices.push(33);
		}
		//34 Maid Costume (female only):
		if(CoC.player.armorName === "maid's clothes" && CoC.player.hasVagina()) {
			choices.push(34);
			choices.push(34);
			choices.push(34);
			choices.push(34);
		}
		//35 Servant Boy Clothes (male only)
		if(CoC.player.armorName === "cute servant's clothes" && CoC.player.hasCock()) {
			choices.push(35);
			choices.push(35);
			choices.push(35);
			choices.push(35);
		}
		//36 Bondage Patient Clothes 
		if(CoC.player.armorName === "bondage patient clothes") {
			choices.push(36);
			choices.push(36);
			choices.push(36);
			choices.push(36);
		}	
		//37 Kitsune Tease
		//38 Kitsune Tease
		//39 Kitsune Tease
		//40 Kitsune Tease
		if(CoC.player.kitsuneScore() >= 2 && CoC.player.tailType === AppearanceDefs.TAIL_TYPE_FOX) {
			choices.push(37);
			choices.push(37);
			choices.push(37);
			choices.push(37);
			choices.push(38);
			choices.push(38);
			choices.push(38);
			choices.push(38);
			choices.push(39);
			choices.push(39);
			choices.push(39);
			choices.push(39);
			choices.push(40);
			choices.push(40);
			choices.push(40);
			choices.push(40);
		}
		//41 Kitsune Gendered Tease
		if(CoC.player.kitsuneScore() >= 2 && CoC.player.tailType === AppearanceDefs.TAIL_TYPE_FOX) {
			choices.push(41);
			choices.push(41);
			choices.push(41);
			choices.push(41);
		}
		//42 Urta teases!
		if(SceneLib.urtaQuest.isUrta()) {
			choices.push(42);
			choices.push(42);
			choices.push(42);
			choices.push(42);
			choices.push(42);
			choices.push(42);
			choices.push(42);
			choices.push(42);
			choices.push(42);
		}
		//43 - special mino + cowgirls
		if(CoC.player.hasVagina() && CoC.player.lactationQ() >= 500 && CoC.player.biggestTitSize() >= 6 && CoC.player.cowScore() >= 3 && CoC.player.tailType === AppearanceDefs.TAIL_TYPE_COW) {
			choices.push(43);
			choices.push(43);
			choices.push(43);
			choices.push(43);
			choices.push(43);
			choices.push(43);
			choices.push(43);
			choices.push(43);
			choices.push(43);
		}
		//44 - Bikini Mail Teases!
		if(CoC.player.hasVagina() && CoC.player.biggestTitSize() >= 4 && CoC.player.armorName === "lusty maiden's armor") {
			choices.push(44);
			choices.push(44);
			choices.push(44);
			choices.push(44);
			choices.push(44);
			choices.push(44);
			choices.push(44);
			choices.push(44);
			choices.push(44);
			choices.push(44);
			choices.push(44);
			choices.push(44);
			choices.push(44);
			choices.push(44);
			choices.push(44);
		}
		//=======================================================
		//    CHOOSE YOUR TEASE AND DISPLAY IT!
		//=======================================================
		var select = Utils.randomChoice(choices);
		if(CoC.monster.short.indexOf("minotaur") !== -1 && CoC.player.hasVagina() && CoC.player.lactationQ() >= 500 && CoC.player.biggestTitSize() >= 6 && CoC.player.cowScore() >= 3 && CoC.player.tailType === AppearanceDefs.TAIL_TYPE_COW) {
			select = 43;
		}
		//Lets do zis!
		switch(select) {
			//0 butt shake
			case 0:
				//Display
				MainView.outputText("You slap your " + Descriptors.buttDescript(), false);
				if(CoC.player.buttRating >= 10 && CoC.player.tone < 60) {
					MainView.outputText(", making it jiggle delightfully.", false);
				} else {
					MainView.outputText(".", false);
				}
				//Mod success
				ass = true;
				break;
			//1 BREAST JIGGLIN'
			case 1:
				//Single breast row
				if(CoC.player.breastRows.length === 1) {
					//50+ breastsize% success rate
					MainView.outputText("Your lift your top, exposing your " + Descriptors.breastDescript(0) + " to " + CoC.monster.a + CoC.monster.short + ".  You shake them from side to side enticingly.", false);
					if(CoC.player.lust >= 50) {
						MainView.outputText("  Your " + Descriptors.nippleDescript(0) + "s seem to demand " + CoC.monster.pronoun3 + " attention.", false);
					}
				}
				//Multirow
				if(CoC.player.breastRows.length > 1) {
					//50 + 10% per breastRow + breastSize%
					MainView.outputText("You lift your top, freeing your rows of " + Descriptors.breastDescript(0) + " to jiggle freely.  You shake them from side to side enticingly", false);
					if(CoC.player.lust >= 50) {
						MainView.outputText(", your " + Descriptors.nippleDescript(0) + "s painfully visible.", false);
					} else {
						MainView.outputText(".", false);
					}
					chance++;
				}
				breasts = true;
				break;
			//2 PUSSAH FLASHIN'
			case 2:
				if(CoC.player.isTaur()) {
					MainView.outputText("You gallop toward your unsuspecting enemy, dodging their defenses and knocking them to the ground.  Before they can recover, you slam your massive centaur ass down upon them, stopping just short of using crushing force to pin them underneath you.  In this position, your opponent's face is buried right in your girthy horsecunt.  You grind your cunt into " + CoC.monster.pronoun3 + " face for a moment before standing.  When you do, you're gratified to see your enemy covered in your lubricant and smelling powerfully of horsecunt.", false);
					chance += 2;
					damage += 4;
				} else {
					MainView.outputText("You open your " + CoC.player.armorName + ", revealing your ", false);
					if(CoC.player.cocks.length > 0) {
						chance++;
						damage++;
						if(CoC.player.cocks.length === 1) {
							MainView.outputText(CoC.player.cockDescript(0), false);
						}
						if(CoC.player.cocks.length > 1) {
							MainView.outputText(CoC.player.multiCockDescriptLight(), false);
						}
						MainView.outputText(" and ", false);
						if(CoC.player.findPerk(PerkLib.BulgeArmor) >= 0) {
							damage += 5;
						}
						penis = true;
					}
					MainView.outputText(Descriptors.vaginaDescript(0), false);
					MainView.outputText(".", false);
				}
				vagina = true;
				break;
			//3 cock flash
			case 3:
				if(CoC.player.isTaur() && CoC.player.horseCocks() > 0) {
					MainView.outputText("You let out a bestial whinny and stomp your hooves at your enemy.  They prepare for an attack, but instead you kick your front hooves off the ground, revealing the hefty horsecock hanging beneath your belly.  You let it flop around, quickly getting rigid and to its full erect length.  You buck your hips as if you were fucking a mare in heat, letting your opponent know just what's in store for them if they surrender to pleasure...", false);
					if(CoC.player.findPerk(PerkLib.BulgeArmor) >= 0) {
						damage += 5;
					}
				} else {
					MainView.outputText("You open your " + CoC.player.armorName + ", revealing your ", false);
					if(CoC.player.cocks.length === 1) {
						MainView.outputText(CoC.player.cockDescript(0), false);
					}
					if(CoC.player.cocks.length > 1) {
						MainView.outputText(CoC.player.multiCockDescriptLight(), false);
					}
					if(CoC.player.hasVagina()) {
						MainView.outputText(" and ", false);
					}
					//Bulgy bonus!
					if(CoC.player.findPerk(PerkLib.BulgeArmor) >= 0) {
						damage += 5;
						chance++;
					}
					if(CoC.player.vaginas.length > 0) {
						MainView.outputText(Descriptors.vaginaDescript(0), false);
						vagina = true;
					}
					MainView.outputText(".", false);
				}
				penis = true;
				break;
			//BIMBO
			//4 butt shake
			case 4:
				MainView.outputText("You turn away and bounce your " + Descriptors.buttDescript() + " up and down hypnotically", false);
				//Big butts = extra text + higher success
				if(CoC.player.buttRating >= 10) {
					MainView.outputText(", making it jiggle delightfully.  " + CoC.monster.getCapitalA() + CoC.monster.short + " even gets a few glimpses of the " + Descriptors.assholeDescript() + " between your cheeks.", false);
					chance += 3;
				}
				//Small butts = less damage, still high success
				else {
					MainView.outputText(", letting " + CoC.monster.a + CoC.monster.short + " get a good look at your " + Descriptors.assholeDescript() + " and " + Descriptors.vaginaDescript(0) + ".", false);
					chance += 1;
					vagina = true;
				}
				ass = true;
				anus = true;
				break;
			//5 breast jiggle
			case 5:
				MainView.outputText("You lean forward, letting the well-rounded curves of your " + Descriptors.allBreastsDescript() + " show to " + CoC.monster.a + CoC.monster.short + ".", false);
				MainView.outputText("  You cup them in your palms and lewdly bounce them, putting on a show and giggling the entire time.  An inch at a time, your " + CoC.player.armorName + " starts to come down, dropping tantalizingly slowly until your " + Descriptors.nippleDescript(0) + "s pop free.", false);
				if(CoC.player.lust >= 50) {
					if(CoC.player.hasFuckableNipples()) {
						chance++;
						MainView.outputText("  Clear slime leaks from them, making it quite clear that they're more than just nipples.", false);
					} else {
						MainView.outputText("  Your hard nipples seem to demand " + CoC.monster.pronoun3 + " attention.", false);
					}
					chance += 1;
					damage += 2;
				}
				//Damage boosts!
				breasts = true;
				break;
			//6 pussy flash
			case 6:
				if (CoC.player.findPerk(PerkLib.BimboBrains) >= 0 || CoC.player.findPerk(PerkLib.FutaFaculties) >= 0) {
					MainView.outputText("You coyly open your " + CoC.player.armorName + " and giggle, \"<i>Is this, like, what you wanted to see?</i>\"  ", false);
				} else {
					MainView.outputText("You coyly open your " + CoC.player.armorName + " and purr, \"<i>Does the thought of a hot, ", false);
					if(futa) {
						MainView.outputText("futanari ", false);
					} else if(CoC.player.findPerk(PerkLib.BimboBody) >= 0) {
						MainView.outputText("bimbo ", false);
					} else {
						MainView.outputText("sexy ");
					}
					MainView.outputText("body turn you on?</i>\"  ", false);
				}
				if(CoC.monster.plural) {
					MainView.outputText(CoC.monster.getCapitalA() + CoC.monster.short + "' gazes are riveted on your groin as you run your fingers up and down your folds seductively.", false);
				} else {
					MainView.outputText(CoC.monster.getCapitalA() + CoC.monster.short + "'s gaze is riveted on your groin as you run your fingers up and down your folds seductively.", false);
				}
				if(CoC.player.clitLength > 3) {
					MainView.outputText("  You smile as your " + Descriptors.clitDescript() + " swells out from the folds and stands proudly, begging to be touched.", false);
				} else {
					MainView.outputText("  You smile and pull apart your lower-lips to expose your " + Descriptors.clitDescript() + ", giving the perfect view.", false);
				}
				if(CoC.player.cockTotal() > 0) {
					MainView.outputText("  Meanwhile, " + CoC.player.sMultiCockDesc() + " bobs back and forth with your gyrating hips, adding to the display.", false);
				}
				//BONUSES!
				if(CoC.player.hasCock()) {
					if(CoC.player.findPerk(PerkLib.BulgeArmor) >= 0) {
						damage += 5;
					}
					penis = true;
				}
				vagina = true;
				break;
			//7 special Adjatha-crafted bend over bimbo times
			case 7:
				MainView.outputText("The glinting of light catches your eye and you whip around to inspect the glittering object, turning your back on " + CoC.monster.a + CoC.monster.short + ".  Locking your knees, you bend waaaaay over, " + Descriptors.chestDesc() + " swinging in the open air while your " + Descriptors.buttDescript() + " juts out at the " + CoC.monster.a + CoC.monster.short + ".  Your plump cheeks and " + Descriptors.hipDescript() + " form a jiggling heart-shape as you eagerly rub your thighs together.\n\n", false);
				MainView.outputText("The clear, warm fluid of your happy excitement trickles down from your loins, polishing your " + CoC.player.skin() + " to a glossy, inviting shine.  Retrieving the useless, though shiny, bauble, you hold your pose for just a moment longer, a sly little smile playing across your lips as you wiggle your cheeks one more time before straightening up and turning back around.", false);
				vagina = true;
				chance++;
				damage += 2;
				break;
			//==BRO STUFF=====
			//8 Pec Dance
			case 8:
				MainView.outputText("You place your hands on your hips and flex repeatedly, skillfully making your pecs alternatively bounce in a muscular dance.  ", false);
				if(CoC.player.findPerk(PerkLib.BroBrains) >= 0) {
					MainView.outputText("Damn, " + CoC.monster.a + CoC.monster.short + " has got to love this!", false);
				} else {
					MainView.outputText(CoC.monster.getCapitalA() + CoC.monster.short + " will probably enjoy the show, but you feel a bit silly doing this.", false);
				}
				chance += (CoC.player.tone - 75)/5;
				damage += (CoC.player.tone - 70)/5;
				auto = false;
				break;
			//9 Heroic Pose
			case 9:
				MainView.outputText("You lift your arms and flex your incredibly muscular arms while flashing your most disarming smile.  ", false);
				if(CoC.player.findPerk(PerkLib.BroBrains) >= 0) {
					MainView.outputText(CoC.monster.getCapitalA() + CoC.monster.short + " can't resist such a heroic pose!", false);
				} else {
					MainView.outputText("At least the physical changes to your body are proving useful!", false);
				}
				chance += (CoC.player.tone - 75)/5;
				damage += (CoC.player.tone - 70)/5;
				auto = false;
				break;
			//10 Bulgy groin thrust
			case 10:
				MainView.outputText("You lean back and pump your hips at " + CoC.monster.a + CoC.monster.short + " in an incredibly vulgar display.  The bulging, barely-contained outline of your " + CoC.player.cockDescript(0) + " presses hard into your gear.  ", false);
				if(CoC.player.findPerk(PerkLib.BroBrains) >= 0) {
					MainView.outputText("No way could " + CoC.monster.pronoun1 + " resist your huge cock!", false);
				} else {
					MainView.outputText("This is so crude, but at the same time, you know it'll likely be effective.", false);
				}
				MainView.outputText("  You go on like that, humping the air for your foe", false);
				MainView.outputText("'s", false);
				MainView.outputText(" benefit, trying to entice them with your man-meat.", false);
				if(CoC.player.findPerk(PerkLib.BulgeArmor) >= 0) {
					damage += 5;
				}
				penis = true;
				break;
			//11 Show off dick
			case 11:
				if(EngineCore.silly() && Utils.rand(2) === 0) {
					MainView.outputText("You strike a herculean pose and flex, whispering, \"<i>Do you even lift?</i>\" to " + CoC.monster.a + CoC.monster.short + ".", false);
				} else {
					MainView.outputText("You open your " + CoC.player.armorName + " just enough to let your " + CoC.player.cockDescript(0) + " and " + Descriptors.ballsDescriptLight() + " dangle free.  A shiny rope of pre-cum dangles from your cock, showing that your reproductive system is every bit as fit as the rest of you.  ", false);
					if(CoC.player.findPerk(PerkLib.BroBrains) >= 0) {
						MainView.outputText("Bitches love a cum-leaking cock.", false);
					} else {
						MainView.outputText("You've got to admit, you look pretty good down there.", false);
					}
				}
				if(CoC.player.findPerk(PerkLib.BulgeArmor) >= 0) {
					damage += 5;
				}
				penis = true;
				break;
			//==EXTRAS========
			//12 Cat flexibility.
			case 12:
				//CAT TEASE MOTHERFUCK (requires flexibility and legs [maybe can't do it with armor?])
				MainView.outputText("Reaching down, you grab an ankle and pull it backwards, looping it up and over to touch the foot to your " + Descriptors.hairDescript() + ".  You bring the leg out to the side, showing off your " + Descriptors.vaginaDescript(0) + " through your " + CoC.player.armorName + ".  The combination of the lack of discomfort on your face and the ease of which you're able to pose shows " + CoC.monster.a + CoC.monster.short + " how good of a time they're in for with you.", false);
				vagina = true;
				if(CoC.player.thickness < 33) {
					chance++;
				} else if(CoC.player.thickness >= 66) {
					chance--;
				}
				damage += (CoC.player.thickness - 50)/10;
				break;
			//13 Pregnant
			case 13:
				//PREG
				MainView.outputText("You lean back, feigning a swoon while pressing a hand on the small of your back.  The pose juts your huge, pregnant belly forward and makes the shiny spherical stomach look even bigger.  With a teasing groan, you rub the protruding tummy gently, biting your lip gently as you stare at " + CoC.monster.a + CoC.monster.short + " through heavily lidded eyes.  \"<i>All of this estrogen is making me frisky,</i>\" you moan, stroking hand gradually shifting to the southern hemisphere of your big baby-bump.", false);
				//if lactating] 
				if(CoC.player.biggestLactation() >= 1) {
					MainView.outputText("  Your other hand moves to expose your " + Descriptors.chestDesc() + ", cupping and squeezing a stream of milk to leak down the front of your " + CoC.player.armorName + ".  \"<i>Help a mommy out.</i>\"\n\n", false);
					chance += 2;
					damage += 4;
				}
				if(CoC.player.pregnancyIncubation < 100) {
					chance++;
					damage += 2;
				}
				if(CoC.player.pregnancyIncubation < 50) {
					chance++;
					damage += 2;
				}
				break;
			//14 Brood Mother
			case 14:
				if( Utils.rand(2) === 0) {
					MainView.outputText("You tear open your " + CoC.player.armorName + " and slip a few fingers into your well-used birth canal, giving your opponent a good look at what they're missing.  \"<i>C'mon stud,</i>\" you say, voice dripping with lust and desire, \"<i>Come to mama " + CoC.player.short + " and fuck my pussy 'til your baby batter just POURS out.  I want your children inside of me, I want your spawn crawling out of this cunt and begging for my milk.  Come on, FUCK ME PREGNANT!</i>\"", false);
				} else {
					MainView.outputText("You wiggle your " + Descriptors.hipDescript() + " at your enemy, giving them a long, tantalizing look at the hips that have passed so very many offspring.  \"<i>Oh, like what you see, bad boy?  Well why don't you just come on over and stuff that cock inside me?  Give me your seed, and I'll give you suuuuch beautiful offspring.  Oh?  Does that turn you on?  It does!  Come on, just let loose and fuck me full of your babies!</i>\"", false);
				}
				chance += 2;
				damage += 4;
				if(CoC.player.inHeat) {
					chance += 2;
					damage += 4;
				}
				vagina = true;
				break;
			//15 Nipplecunts
			case 15:
				//Req's tits & Pussy
				if(CoC.player.biggestTitSize() > 1 && CoC.player.hasVagina() && Utils.rand(2) === 0) {
					MainView.outputText("Closing your eyes, you lean forward and slip a hand under your " + CoC.player.armorName + ".  You let out the slightest of gasps as your fingers find your drooling honeypot, warm tips poking, one after another between your engorged lips.  When you withdraw your hand, your fingers have been soaked in the dripping passion of your cunny, translucent beads rolling down to wet your palm.  With your other hand, you pull down the top of your " + CoC.player.armorName + " and bare your " + Descriptors.chestDesc() + " to " + CoC.monster.a + CoC.monster.short + ".\n\n", false);
					MainView.outputText("Drawing your lust-slick hand to your " + Descriptors.nippleDescript(0) + "s, the yielding flesh of your cunt-like nipples parts before the teasing digits.  Using your own girl cum as added lubrication, you pump your fingers in and out of your nipples, moaning as you add progressively more digits until only your thumb remains to stroke the inflamed flesh of your over-stimulated chest.  Your throat releases the faintest squeak of your near-orgasmic delight and you pant, withdrawing your hands and readjusting your armor.\n\n", false);
					MainView.outputText("Despite how quiet you were, it's clear that every lewd, desperate noise you made was heard by " + CoC.monster.a + CoC.monster.short + ".", false);
					chance += 2;
					damage += 4;
				} else if(CoC.player.biggestTitSize() > 1 && Utils.rand(2) === 0) {
					MainView.outputText("You yank off the top of your " + CoC.player.armorName + ", revealing your " + Descriptors.chestDesc() + " and the gaping nipplecunts on each.  With a lusty smirk, you slip a pair of fingers into the nipples of your " + Descriptors.chestDesc() + ", pulling the nipplecunt lips wide, revealing the lengthy, tight passage within.  You fingerfuck your nipplecunts, giving your enemy a good show before pulling your armor back on, leaving the tantalizing image of your gaping titpussies to linger in your foe's mind.", false);
					chance += 1;
					damage += 2;
				} else {
					MainView.outputText("You remove the front of your " + CoC.player.armorName + " exposing your " + Descriptors.chestDesc() + ".  Using both of your hands, you thrust two fingers into your nipple cunts, milky girl cum soaking your hands and fingers.  \"<i>Wouldn't you like to try out these holes too?</i>\"", false);
				}
				breasts = true;
				break;
			//16 Anal gape
			case 16:
				MainView.outputText("You quickly strip out of your " + CoC.player.armorName + " and turn around, giving your " + Descriptors.buttDescript() + " a hard slap and showing your enemy the real prize: your " + Descriptors.assholeDescript() + ".  With a smirk, you easily plunge your hand inside, burying yourself up to the wrist inside your anus.  You give yourself a quick fisting, watching the enemy over your shoulder while you moan lustily, sure to give them a good show.  You withdraw your hand and give your ass another sexy spank before readying for combat again.", false);
				anus = true;
				ass = true;
				break;
			//17 Bee abdomen tease
			case 17:
				MainView.outputText("You swing around, shedding the " + CoC.player.armorName + " around your waist to expose your " + Descriptors.buttDescript() + " to " + CoC.monster.a + CoC.monster.short + ".  Taking up your oversized bee abdomen in both hands, you heft the thing and wave it about teasingly.  Drops of venom drip to and fro, a few coming dangerously close to " + CoC.monster.pronoun2 + ".  \"<i>Maybe if you behave well enough, I'll even drop a few eggs into your belly,</i>\" you say softly, dropping the abdomen back to dangle above your butt and redressing.", false);
				ass = true;
				chance += 0.5;
				damage += 0.5;
				break;			
			//18 DOG TEASE
			case 18:
				MainView.outputText("You sit down like a dog, your [legs] are spread apart, showing your ", false);
				if(CoC.player.hasVagina()) {
					MainView.outputText("parted cunt-lips", false);
				} else {
					MainView.outputText("puckered asshole, hanging, erect maleness,", false);
				}
				MainView.outputText(" and your hands on the ground in front of you.  You pant heavily with your tongue out and promise, \"<i>I'll be a good little bitch for you</i>.\"", false);
				vagina = true;
				chance += 1;
				damage += 2;
				break;
			//19 MAX FEM TEASE - SYMPHONIE
			case 19:
				MainView.outputText("You make sure to capture your foe's attention, then slowly and methodically allow your tongue to slide along your lush, full lips.  The glistening moisture that remains on their plump beauty speaks of deep lust and deeper throats.  Batting your long lashes a few times, you pucker them into a playful blown kiss, punctuating the act with a small moan. Your gorgeous feminine features hint at exciting, passionate moments together, able to excite others with just your face alone.", false);
				chance += 2;
				damage += 4;
				break;
			//20 MAX MASC TEASE
			case 20:
				MainView.outputText("As your foe regards you, you recognize their attention is fixated on your upper body.  Thrusting your strong jaw forward you show off your chiseled chin, handsome features marking you as a flawless specimen.  Rolling your broad shoulders, you nod your head at your enemy.  The strong, commanding presence you give off could melt the heart of an icy nun.  Your perfect masculinity speaks to your confidence, allowing you to excite others with just your face alone.", false);
				chance += 2;
				damage += 4;
				break;
			//21 MAX ADROGYN
			case 21:
				MainView.outputText("You reach up and run your hands down your delicate, androgynous features.  With the power of a man but the delicacy of a woman, looking into your eyes invites an air of enticing mystery.  You blow a brief kiss to your enemy while at the same time radiating a sexually exciting confidence.  No one could identify your gender by looking at your features, and the burning curiosity they encourage could excite others with just your face alone.", false);
				damage -= 3;
				break;
			//22 SPOIDAH SILK
			case 22:
				MainView.outputText("Reaching back, you milk some wet silk from your spider-y abdomen and present it to " + CoC.monster.a + CoC.monster.short + ", molding the sticky substance as " + CoC.monster.pronoun1 + " looks on curiously.  Within moments, you hold up a silken heart scuplture, and with a wink, you toss it at " + CoC.monster.pronoun2 + ". It sticks to " + CoC.monster.pronoun3 + " body, the sensation causing " + CoC.monster.pronoun2 + " to hastily slap the heart off.  " + CoC.monster.mf("He","She") + " returns " + CoC.monster.pronoun3 + " gaze to you to find you turned around, " + Descriptors.buttDescript() + " bared and abdomen bouncing lazily.  \"<i>I wonder what would happen if I webbed up your hole after I dropped some eggs inside?</i>\" you hiss mischievously.  " + CoC.monster.mf("He","She") + " gulps.", false);
				ass = true;
				break;
			//23 RUT TEASE
			case 23:
				if(CoC.player.horseCocks() > 0 && CoC.player.longestHorseCockLength() >= 12) {
					MainView.outputText("You whip out your massive horsecock, and are immediately surrounded by a massive, heady musk.  Your enemy swoons, nearly falling to her knees under your oderous assault.  Grinning, you grab her shoulders and force her to her knees.  Before she can defend herself, you slam your horsecock onto her head, running it up and down on her face, her nose acting like a sexy bump in an onahole.  You fuck her face -- literally -- for a moment before throwing her back and sheathing your cock.", false);
				} else {
					MainView.outputText("Panting with your unstoppable lust for the delicious, impregnable cunt before you, you yank off your " + CoC.player.armorName + " with strength born of your inhuman rut, and quickly wave your fully erect cock at your enemy.  She flashes with lust, quickly feeling the heady effect of your man-musk.  You rush up, taking advantage of her aroused state and grab her shoulders.  ", false);
					MainView.outputText("Before she can react, you push her down until she's level with your cock, and start to spin it in a circle, slapping her right in the face with your musky man-meat.  Her eyes swim, trying to follow your meatspin as you swat her in the face with your cock!  Satisfied, you release her and prepare to fight!", false);
				}
				penis = true;
				break;
			//24 STAFF POLEDANCE
			case 24:
				MainView.outputText("You run your tongue across your lips as you plant your staff into the ground.  Before your enemy can react, you spin onto the long, wooden shaft, using it like an impromptu pole.  You lean back against the planted staff, giving your enemy a good look at your body.  You stretch backwards like a cat, nearly touching your fingertips to the ground beneath you, now holding onto the staff with only one leg.  You pull yourself upright and give your " + Descriptors.buttDescript() + " a little slap and your " + Descriptors.chestDesc() + " a wiggle before pulling open your " + CoC.player.armorName + " and sliding the pole between your tits.  You drop down to a low crouch, only just covering your genitals with your hand as you shake your " + Descriptors.buttDescript() + " playfully.  You give the enemy a little smirk as you slip your " + CoC.player.armorName + " back on and pick up your staff.", false);
				ass = true;
				breasts = true;
				break;
			//TALL WOMAN TEASE
			case 25:
				MainView.outputText("You move close to your enemy, handily stepping over " + CoC.monster.pronoun3 + " defensive strike before leaning right down in " + CoC.monster.pronoun3 + " face, giving " + CoC.monster.pronoun2 + " a good long view at your cleavage.  \"<i>Hey, there, little " + CoC.monster.mf("guy","girl") + ",</i>\" you smile.  Before " + CoC.monster.pronoun1 + " can react, you grab " + CoC.monster.pronoun2 + " and smoosh " + CoC.monster.pronoun3 + " face into your " + CoC.player.allChestDesc() + ", nearly choking " + CoC.monster.pronoun2 + " in the canyon of your cleavage.  " + CoC.monster.mf("He","She") + " struggles for a moment.  You give " + CoC.monster.pronoun2 + " a little kiss on the head and step back, ready for combat.", false);
				breasts = true;
				chance += 2;
				damage += 4;
				break;
			//Magic Tease
			case 26:
				MainView.outputText("Seeing a lull in the battle, you plant your " + CoC.player.weaponName + " on the ground and let your magic flow through you.  You summon a trickle of magic into a thick, slowly growing black ball of lust.  You wave the ball in front of you, making a little dance and striptease out of the affair as you slowly saturate the area with latent sexual magics.", false);
				chance++;
				damage += 2;
				break;
			//Feeder
			case 27:
				MainView.outputText("You present your swollen breasts full of milk to " + CoC.monster.a + CoC.monster.short + " and say \"<i>Wouldn't you just love to lie back in my arms and enjoy what I have to offer you?</i>\"", false);
				breasts = true;
				chance ++;
				damage++;
				break;
			//28 FEMALE TEACHER COSTUME TEASE
			case 28:
				MainView.outputText("You turn to the side and give " + CoC.monster.a + CoC.monster.short + " a full view of your body.  You ask them if they're in need of a private lesson in lovemaking after class.", false);
				ass = true;
				break;
			//29 Male Teacher Outfit Tease
			case 29:
				MainView.outputText("You play with the strings on your outfit a bit and ask " + CoC.monster.a + CoC.monster.short + " just how much do they want to see their teacher pull them off?", false);
				chance++;
				damage += 3;
				break;
			//30 Naga Fetish Clothes
			case 30:
				MainView.outputText("You sway your body back and forth, and do an erotic dance for " + CoC.monster.a + CoC.monster.short + ".", false);
				chance += 2;
				damage += 4;
				break;
			//31 Centaur harness clothes
			case 31:
				MainView.outputText("You rear back, and declare that, \"<i>This horse is ready to ride, all night long!</i>\"", false);
				chance += 2;
				damage += 4;
				break;
			//32 Genderless servant clothes
			case 32:
				MainView.outputText("You turn your back to your foe, and flip up your butt flap for a moment.   Your " + Descriptors.buttDescript() + " really is all you have to offer downstairs.", false);
				ass = true;
				chance++;
				damage += 2;
				break;
			//33 Crotch Revealing Clothes (herm only?)
			case 33:
				MainView.outputText("You do a series of poses to accentuate what you've got on display with your crotch revealing clothes, while asking if your " + CoC.player.mf("master","mistress") + " is looking to sample what is on display.", false);
				chance += 2;
				damage += 4;
				break;
			//34 Maid Costume (female only)
			case 34:
				MainView.outputText("You give a rather explicit curtsey towards " + CoC.monster.a + CoC.monster.short + " and ask them if your " + CoC.player.mf("master","mistress") + " is interested in other services today.", false);
				chance ++;
				damage += 2;
				breasts = true;
				break;
			//35 Servant Boy Clothes (male only)
			case 35:
				MainView.outputText("You brush aside your crotch flap for a moment, then ask " + CoC.monster.a + CoC.monster.short + " if, " + CoC.player.mf("Master","Mistress") + " would like you to use your " + CoC.player.multiCockDescriptLight() + " on them?", false);
				penis = true;
				chance++;
				damage += 2;
				break;
			//36 Bondage Patient Clothes (done):
			case 36:
				MainView.outputText("You pull back one of the straps on your bondage cloths and let it snap back.  \"<i>I need some medical care, feeling up for it?</i>\" you tease.", false);
				damage+= 2;
				chance++;
				break;
			default:
				MainView.outputText("You shimmy and shake sensually. (An error occurred.)", false);
				break;
			case 37:
				MainView.outputText("You purse your lips coyly, narrowing your eyes mischievously and beckoning to " + CoC.monster.a + CoC.monster.short + " with a burning come-hither glare.  Sauntering forward, you pop your hip to the side and strike a coquettish pose, running " + ((CoC.player.tailVenom > 1) ? "one of your tails" : "your tail") + " up and down " + CoC.monster.pronoun3 + " body sensually.");
				chance+= 6;
				damage+= 3;
				break;
			case 38:
				MainView.outputText( "You wet your lips, narrowing your eyes into a smoldering, hungry gaze.  Licking the tip of your index finger, you trail it slowly and sensually down the front of your " + CoC.player.armorName + ", following the line of your " + Descriptors.chestDesc() + " teasingly.  You hook your thumbs into your top and shimmy it downward at an agonizingly slow pace.  The very instant that your [nipples] pop free, your tail crosses in front, obscuring " + CoC.monster.a + CoC.monster.short + "'s view.");
				breasts = true;
				chance++;
				damage++;
				break;
			case 39:
				MainView.outputText( "Leaning forward, you bow down low, raising a hand up to your lips and blowing " + CoC.monster.a + CoC.monster.short + " a kiss.  You stand straight, wiggling your " + Descriptors.hipDescript() + " back and forth seductively while trailing your fingers down your front slowly, pouting demurely.  The tip of ");
				if(CoC.player.tailVenom === 1) {
					MainView.outputText("your");
				} else {
					MainView.outputText("a");
				}
				MainView.outputText(" bushy tail curls up around your " + CoC.player.leg() + ", uncoiling with a whipping motion that makes an audible crack in the air.");
				ass = true;
				chance++;
				damage += 1;
				break;
			case 40:
				MainView.outputText("Turning around, you stare demurely over your shoulder at " + CoC.monster.a + CoC.monster.short + ", batting your eyelashes amorously.");
				if(CoC.player.tailVenom === 1) {
					MainView.outputText("  Your tail twists and whips about, sliding around your " + Descriptors.hipDescript() + " in a slow arc and framing your rear nicely as you slowly lift your " + CoC.player.armorName + ".");
				} else {
					MainView.outputText("  Your tails fan out, twisting and whipping sensually, sliding up and down your " + CoC.player.legs() + " and framing your rear nicely as you slowly lift your " + CoC.player.armorName + ".");
				}
				MainView.outputText("  As your [butt] comes into view, you brush your tail" + ((CoC.player.tailVenom > 1) ? "s" : "" ) + " across it, partially obscuring the view in a tantalizingly teasing display.");
				ass = true;
				anus = true;
				chance++;
				damage += 2;
				break;
			case 41:
				MainView.outputText( "Smirking coyly, you sway from side to side, running your tongue along your upper teeth seductively.  You hook your thumbs into your " + CoC.player.armorName + " and pull them away to partially reveal ");
				if(CoC.player.cockTotal() > 0) {
					MainView.outputText(CoC.player.sMultiCockDesc());
				}
				if(CoC.player.gender === 3) {
					MainView.outputText(" and ");
				}
				if(CoC.player.gender >= 2) {
					MainView.outputText("your " + Descriptors.vaginaDescript(0));
				}
				MainView.outputText(".  Your bushy tail" + ((CoC.player.tailVenom > 1) ? "s" : "" ) + " cross" + ((CoC.player.tailVenom > 1) ? "": "es") + " in front, wrapping around your genitals and obscuring the view teasingly.");
				vagina = true;
				penis = true;
				damage += 2;
				chance++;
				break;
			case 42:
				//Tease #1:
				if( Utils.rand(2) === 0) {
					MainView.outputText("You lift your skirt and flash your king-sized stallionhood, already unsheathing itself and drooling pre, at your opponent.  \"<i>Come on, then; I got plenty of girlcock for you if that's what you want!</i>\" you cry.");
					penis = true;
					damage += 3;
					chance--;
				}
				//Tease #2:
				else {
					MainView.outputText("You turn partially around and then bend over, swaying your tail from side to side in your most flirtatious manner and wiggling your hips seductively, your skirt fluttering with the motions.  \"<i>Come on then, what are you waiting for?  This is a fine piece of ass here,</i>\" you grin, spanking yourself with an audible slap.");
					ass = true;
					chance+= 2;
					damage += 3;
				}
				break;
			case 43:
				var cows = Utils.rand(7);
				if(cows === 0) {
					MainView.outputText("You tuck your hands under your chin and use your arms to squeeze your massive, heavy breasts together.  Milk squirts from your erect nipples, filling the air with a rich, sweet scent.");
					breasts = true;
					chance += 2;
					damage++;
				} else if(cows === 1) {
					MainView.outputText("Moaning, you bend forward, your full breasts nearly touching the ground as you sway your [hips] from side to side.  Looking up from under heavily-lidded eyes, you part your lips and lick them, letting out a low, lustful \"<i>Mooooo...</i>\"");
					breasts = true;
					chance += 2;
					damage += 2;
				} else if(cows === 2) {
					MainView.outputText("You tuck a finger to your lips, blinking innocently, then flick your tail, wafting the scent of your ");
					if(CoC.player.wetness() >= 3) {
						MainView.outputText("dripping ");
					}
					MainView.outputText("sex through the air.");
					vagina = true;
					chance++;
					damage++;
				} else if(cows === 3) {
					MainView.outputText("You heft your breasts, fingers splayed across your [nipples] as you SQUEEZE.  Milk runs in rivulets over your hands and down the massive curves of your breasts, soaking your front with sweet, sticky milk.");
					breasts = true;
					chance += 3;
					damage++;
				} else if(cows === 4) {
					MainView.outputText("You lift a massive breast to your mouth, suckling loudly at yourself, finally letting go of your nipple with a POP and a loud, satisfied gasp, milk running down your chin.");
					breasts = true;
					chance++;
					damage += 3;
				} else if(cows === 5) {
					MainView.outputText("You crouch low, letting your breasts dangle in front of you.  Each hand caresses one in turn as you slowly milk yourself onto your thighs, splashing white, creamy milk over your hips and sex.");
					vagina = true;
					breasts = true;
					chance++;
				} else {
					MainView.outputText("You lift a breast to your mouth, taking a deep draught of your own milk, then tilt your head back.  With a low moan, you let it run down your front, winding a path between your breasts until it drips sweetly from your crotch.");
					vagina = true;
					breasts = true;
					damage += 2;
				}
				if(CoC.monster.short.indexOf("minotaur") !== -1) {
					damage += 6;
					chance += 3;
				}
				break;
			//lusty maiden's armor teases
			case 44:
				var maiden = Utils.rand(5);
				damage += 5;
				chance += 3;
				if(maiden === 0) {
					MainView.outputText("Confidently sauntering forward, you thrust your chest out with your back arched in order to enhance your [chest].  You slowly begin to shake your torso back and forth, slapping your chain-clad breasts against each other again and again.  One of your hands finds its way to one of the pillowy expanses and grabs hold, fingers sinking into the soft tit through the fine, mail covering.  You stop your shaking to trace a finger down through the exposed center of your cleavage, asking, \"<i>Don't you just want to snuggle inside?</i>\"");
					breasts = true;
				} else if(maiden === 1) {
					MainView.outputText("You skip up to " + CoC.monster.a + CoC.monster.short + " and spin around to rub your barely-covered butt up against " + CoC.monster.pronoun2 + ".  Before " + CoC.monster.pronoun1 + " can react, you're slowly bouncing your [butt] up and down against " + CoC.monster.pronoun3 + " groin.  When " + CoC.monster.pronoun1 + " reaches down, you grab " + CoC.monster.pronoun3 + " hand and press it up, under your skirt, right against the steamy seal on your sex.  The simmering heat of your overwhelming lust burns hot enough for " + CoC.monster.pronoun2 + " to feel even through the contoured leather, and you let " + CoC.monster.pronoun2 + " trace the inside of your [leg] for a moment before moving away, laughing playfully.");
					ass = true;
					vagina = true;
				} else if(maiden === 2) {
					MainView.outputText("You flip up the barely-modest chain you call a skirt and expose your g-string to " +  CoC.monster.a + CoC.monster.short + ".  Slowly swaying your [hips], you press a finger down on the creased crotch plate and exaggerate a lascivious moan into a throaty purr of enticing, sexual bliss.  Your eyes meet " + CoC.monster.pronoun3 + ", and you throatily whisper, \"<i>");
					if(CoC.player.hasVirginVagina()) {
						MainView.outputText("Think you can handle a virgin's infinite lust?");
					} else {
						MainView.outputText("Think you have what it takes to satisfy this perfect pussy?");
					}
					MainView.outputText("</i>\"");
					vagina = true;
					damage += 3;
				} else if(maiden === 3) {
					MainView.outputText("You seductively wiggle your way up to " + CoC.monster.a + CoC.monster.short + ", and before " + CoC.monster.pronoun1 + " can react to your salacious advance, you snap a [leg] up in what would be a vicious kick, if you weren't simply raising it to rest your [foot] on " + CoC.monster.pronoun3 + " shoulder.  With your thighs so perfectly spready, your skirt is lifted, and " + CoC.monster.a + CoC.monster.short + " is given a perfect view of your thong-enhanced cameltoe and the moisture that beads at the edges of your not-so-modest covering.");
					vagina = true;
				} else {
					MainView.outputText("Bending over, you lift your [butt] high in the air.  Most of your barely-covered tush is exposed, but the hem of your chainmail skirt still protects some of your anal modesty.  That doesn't last long.  You start shaking your [butt] up, down, back, and forth to an unheard rhythm, flipping the pointless covering out of the way so that " + CoC.monster.a + CoC.monster.short + " can gaze upon your curvy behind in it all its splendid detail.  A part of you hopes that " + CoC.monster.pronoun1 + " takes in the intricate filigree on the back of your thong, though to " + CoC.monster.pronoun2 + " it looks like a bunch of glittering arrows on an alabaster background, all pointing squarely at your [asshole].");
					ass = true;
					chance += 2;
				}
				break;
		}
		//===========================
		//BUILD BONUSES IF APPLICABLE
		//===========================	
		var bonusChance = 0;
		var bonusDamage = 0;
		if(auto) {
			//TIT BONUSES
			if(breasts) {
				if(CoC.player.bRows() > 1) {
					bonusChance += 0.5;
					bonusDamage += 1;
				}
				if(CoC.player.bRows() > 2) {
					bonusChance += 0.5;
					bonusDamage += 1;
				}
				if(CoC.player.bRows() > 4) {
					bonusChance += 0.5;
					bonusDamage += 1;
				}
				if(CoC.player.biggestLactation() >= 2) {
					bonusChance++;
					bonusDamage += 2;
				}
				if(CoC.player.biggestLactation() >= 3) {
					bonusChance++;
					bonusDamage += 2;
				}
				if(CoC.player.biggestTitSize() >= 4) {
					bonusChance += 0.5;
					bonusDamage += 1;
				}
				if(CoC.player.biggestTitSize() >= 7) {
					bonusChance += 0.5;
					bonusDamage += 1;
				}
				if(CoC.player.biggestTitSize() >= 12) {
					bonusChance += 0.5;
					bonusDamage += 1;
				}
				if(CoC.player.biggestTitSize() >= 25) {
					bonusChance += 0.5;
					bonusDamage += 1;
				}
				if(CoC.player.biggestTitSize() >= 50) {
					bonusChance += 0.5;
					bonusDamage += 1;
				}
				if(CoC.player.hasFuckableNipples()) {
					bonusChance++;
					bonusDamage += 2;
				}
				if(CoC.player.averageNipplesPerBreast() > 1) {
					bonusChance++;
					bonusDamage += 2;
				}
			}
			//PUSSY BONUSES
			if(vagina) {
				if(CoC.player.hasVagina() && CoC.player.wetness() >= 2) {
					bonusChance += 0.5;
					bonusDamage += 1;
				}
				if(CoC.player.hasVagina() && CoC.player.wetness() >= 3) {
					bonusChance += 0.5;
					bonusDamage += 1;
				}
				if(CoC.player.hasVagina() && CoC.player.wetness() >= 4) {
					bonusChance += 0.5;
					bonusDamage += 1;
				}
				if(CoC.player.hasVagina() && CoC.player.wetness() >= 5) {
					bonusChance += 0.5;
					bonusDamage += 1;
				}
				if(CoC.player.clitLength > 1.5) {
					bonusChance += 0.5;
					bonusDamage++;
				}
				if(CoC.player.clitLength > 3.5) {
					bonusChance += 0.5;
					bonusDamage += 1;
				}
				if(CoC.player.clitLength > 7) {
					bonusChance += 0.5;
					bonusDamage += 1;
				}
				if(CoC.player.clitLength > 12) {
					bonusChance += 0.5;
					bonusDamage += 1;
				}
				if(CoC.player.vaginalCapacity() >= 30) {
					bonusChance += 0.5;
					bonusDamage += 1;
				}
				if(CoC.player.vaginalCapacity() >= 70) {
					bonusChance += 0.5;
					bonusDamage += 1;
				}
				if(CoC.player.vaginalCapacity() >= 120) {
					bonusChance += 0.5;
					bonusDamage += 1;
				}
				if(CoC.player.vaginalCapacity() >= 200) {
					bonusChance += 0.5;
					bonusDamage += 1;
				}
			}
			//Penis bonuses!
			if(penis) {
				if(CoC.player.cockTotal() > 1) {
					bonusChance += 1;
					bonusDamage += 2;
				}
				if(CoC.player.biggestCockArea() >= 15) {
					bonusChance += 0.5;
					bonusDamage += 1;
				}
				if(CoC.player.biggestCockArea() >= 30) {
					bonusChance += 0.5;
					bonusDamage += 1;
				}
				if(CoC.player.biggestCockArea() >= 60) {
					bonusChance += 0.5;
					bonusDamage += 1;
				}
				if(CoC.player.biggestCockArea() >= 120) {
					bonusChance += 0.5;
					bonusDamage += 1;
				}
				if(CoC.player.cumQ() >= 50) {
					bonusChance += 0.5;
					bonusDamage += 1;
				}
				if(CoC.player.cumQ() >= 150) {
					bonusChance += 0.5;
					bonusDamage += 1;
				}
				if(CoC.player.cumQ() >= 300) {
					bonusChance += 0.5;
					bonusDamage += 1;
				}
				if(CoC.player.cumQ() >= 1000) {
					bonusChance += 0.5;
					bonusDamage += 1;
				}
				if(balls > 0) {
					if(CoC.player.balls > 2) {
						bonusChance += 1;
						bonusDamage += 2;
					}
					if(CoC.player.ballSize > 3) {
						bonusChance += 0.5;
						bonusDamage += 1;
					}
					if(CoC.player.ballSize > 7) {
						bonusChance += 0.5;
						bonusDamage += 1;
					}
					if(CoC.player.ballSize > 12) {
						bonusChance += 0.5;
						bonusDamage += 1;
					}
				}
				if(CoC.player.biggestCockArea() < 8) {
					bonusChance--;
					bonusDamage-=2;
					if(CoC.player.biggestCockArea() < 5) {
						bonusChance--;
						bonusDamage-=2;
					}
				}
			}
			if(ass) {
				if(CoC.player.buttRating >= 6) {
					bonusChance += 0.5;
					bonusDamage += 1;
				}
				if(CoC.player.buttRating >= 10) {
					bonusChance += 0.5;
					bonusDamage += 1;
				}
				if(CoC.player.buttRating >= 13) {
					bonusChance += 0.5;
					bonusDamage += 1;
				}
				if(CoC.player.buttRating >= 16) {
					bonusChance += 0.5;
					bonusDamage += 1;
				}
				if(CoC.player.buttRating >= 20) {
					bonusChance += 0.5;
					bonusDamage += 1;
				}
				if(CoC.player.hipRating >= 6) {
					bonusChance += 0.5;
					bonusDamage += 1;
				}
				if(CoC.player.hipRating >= 10) {
					bonusChance += 0.5;
					bonusDamage += 1;
				}
				if(CoC.player.hipRating >= 13) {
					bonusChance += 0.5;
					bonusDamage += 1;
				}
				if(CoC.player.hipRating >= 16) {
					bonusChance += 0.5;
					bonusDamage += 1;
				}
				if(CoC.player.hipRating >= 20) {
					bonusChance += 0.5;
					bonusDamage += 1;
				}
			}
			if(anus) {
				if(CoC.player.ass.analLooseness === 0) {
					bonusChance += 1.5;
					bonusDamage += 3;
				}
				if(CoC.player.ass.analWetness > 0) {
					bonusChance += 1;
					bonusDamage += 2;
				}
				if(CoC.player.analCapacity() >= 30) {
					bonusChance += 0.5;
					bonusDamage += 1;
				}
				if(CoC.player.analCapacity() >= 70) {
					bonusChance += 0.5;
					bonusDamage += 1;
				}
				if(CoC.player.analCapacity() >= 120) {
					bonusChance += 0.5;
					bonusDamage += 1;
				}
				if(CoC.player.analCapacity() >= 200) {
					bonusChance += 0.5;
					bonusDamage += 1;
				}
				if(CoC.player.ass.analLooseness === 4) {
					bonusChance += 0.5;
					bonusDamage += 1;
				}
				if(CoC.player.ass.analLooseness === 5) {
					bonusChance += 1.5;
					bonusDamage += 3;
				}
			}
			//Trim it down!
			if(bonusChance > 5) {
				bonusChance = 5;
			}
			if(bonusDamage > 10) {
				bonusDamage = 10;
			}
		}
		//Land the hit!
		if( Utils.rand(100) <= chance + Utils.rand(bonusChance)) {
			//NERF TEASE DAMAGE
			damage *= 0.7;
			bonusDamage *= 0.7;
			if(CoC.player.findPerk(PerkLib.HistoryWhore) >= 0) {
				damage *= 1.15;
				bonusDamage *= 1.15;
			}
			if (CoC.player.findPerk(PerkLib.ChiReflowLust) >= 0) {
				damage *= SceneLib.umasShop.NEEDLEWORK_LUST_TEASE_DAMAGE_MULTI;
			}
			if(CoC.monster.plural) {
				damage *= 1.3;
			}
			damage = (damage + Utils.rand(bonusDamage)) * CoC.monster.lustVuln;
			
			if (CoC.monster.handleTease) {
				CoC.monster.handleTease(damage, true);
			} else if (CoC.monster.mirrorTease && CoC.monster.findStatusAffect(StatusAffects.Stunned) < 0) {
				CoC.monster.mirrorTease(damage, true);
			} else if (!justText) {
				CoC.monster.teased(damage);
			}
			if (CoC.flags[kFLAGS.PC_FETISH] >= 1 && !SceneLib.urtaQuest.isUrta()) {
				if(CoC.player.lust < 75) {
					MainView.outputText("\nFlaunting your body in such a way gets you a little hot and bothered.", false);
				} else {
					MainView.outputText("\nIf you keep exposing yourself you're going to get too horny to fight back.  This exhibitionism fetish makes it hard to resist just stripping naked and giving up.", false);
				}
				if (!justText) {
					EngineCore.dynStats("lus", 2 + Utils.rand(3));
				}
			}
			// Similar to fetish check, only add XP if the player IS the player...
			if (!justText && !SceneLib.urtaQuest.isUrta()) {
				Combat.teaseXP(1);
			}
		} else { //Nuttin honey
			if (!justText && !SceneLib.urtaQuest.isUrta()) {
				Combat.teaseXP(5);
			}
			if (CoC.monster.handleTease) {
				CoC.monster.handleTease(0, false);
			} else if (CoC.monster.mirrorTease) {
				CoC.monster.mirrorTease(0, false);
			} else if (!justText) {
				MainView.outputText("\n" + CoC.monster.getCapitalA() + CoC.monster.short + " seems unimpressed.", false);
			}
		}
		MainView.outputText("\n\n", false);
	};
	Combat.teaseXP = function(XP) {
		if(XP === undefined) {
			XP = 0;
		}
		while(XP > 0) {
			XP--;
			CoC.player.teaseXP++;
			//Level dat shit up!
			if(CoC.player.teaseLevel < 5 && CoC.player.teaseXP >= 10 + (CoC.player.teaseLevel + 1) * 5 * (CoC.player.teaseLevel + 1)) {
				MainView.outputText("\n<b>Tease skill leveled up to " + (CoC.player.teaseLevel + 1) + "!</b>", false);
				CoC.player.teaseLevel++;
				CoC.player.teaseXP = 0;
			}
		}
	};
	//VICTORY OR DEATH?
	Combat.combatRoundOver = function() { //Called after the monster's action
		MainView.statsView.show();
		if (!CoC.isInCombat()) {
			return false;
		}
		if(CoC.monster.HP < 1) {
			EngineCore.doNext( Combat, Combat.endHpVictory);
			return true;
		}
		if(CoC.monster.lust > 99) {
			EngineCore.doNext( Combat, Combat.endLustVictory);
			return true;
		}
		if(CoC.monster.findStatusAffect(StatusAffects.Level) >= 0) {
			if(CoC.monster.trapLevel() <= 1) {
				SceneLib.sandTrapScene.sandtrapmentLoss();
				return true;
			}
		}
		if(CoC.monster.short === "basilisk" && CoC.player.spe <= 1) {
			EngineCore.doNext( Combat, Combat.endHpLoss);
			return true;
		}
		if(CoC.player.HP < 1) {
			EngineCore.doNext( Combat, Combat.endHpLoss);
			return true;
		}
		if(CoC.player.lust > 99) {
			EngineCore.doNext( Combat, Combat.endLustLoss);
			return true;
		}
		EngineCore.doNext( MainView, MainView.playerMenu); //This takes us back to the combatMenu and a new combat round
		return false;
	};
	Combat.hasSpells = function() {
		return CoC.player.hasSpells();
	};
	Combat.magicMenu = function() {
		if (CoC.isInCombat() && CoC.player.findStatusAffect(StatusAffects.Sealed) >= 0 && CoC.player.statusAffectv2(StatusAffects.Sealed) === 2) {
			MainView.clearOutput();
			MainView.outputText("You reach for your magic, but you just can't manage the focus necessary.  <b>Your ability to use magic was sealed, and now you've wasted a chance to attack!</b>\n\n");
			Combat.enemyAI();
			return;
		}
		EngineCore.menu();
		MainView.clearOutput();
		MainView.outputText("What spell will you use?\n\n");
		//WHITE SHITZ
		var whiteLustCap = 75;
		if (CoC.player.findPerk(PerkLib.Enlightened) >= 0 && CoC.player.cor < 10) {
			whiteLustCap += 10;
		}
		if (CoC.player.lust >= whiteLustCap) {
			MainView.outputText("You are far too aroused to focus on white magic.\n\n");
		} else {
			if (CoC.player.findStatusAffect(StatusAffects.KnowsCharge) >= 0) {
				if (CoC.player.findStatusAffect(StatusAffects.ChargeWeapon) < 0) {
					EngineCore.addButton(0, "Charge W.", null, Combat.spellChargeWeapon);
				} else {
					MainView.outputText("<b>Charge weapon is already active and cannot be cast again.</b>\n\n");
				}
			}
			if (CoC.player.findStatusAffect(StatusAffects.KnowsBlind) >= 0) {
				if (CoC.monster.findStatusAffect(StatusAffects.Blind) < 0) {
					EngineCore.addButton(1, "Blind", null, Combat.spellBlind);
				} else {
					MainView.outputText("<b>" + CoC.monster.getCapitalA() + CoC.monster.short + " is already affected by blind.</b>\n\n");
				}
			}
			if (CoC.player.findStatusAffect(StatusAffects.KnowsWhitefire) >= 0) {
				EngineCore.addButton(2, "Whitefire", null, Combat.spellWhitefire);
			}
		}
		//BLACK MAGICSKS
		if (CoC.player.lust < 50) {
			MainView.outputText("You aren't turned on enough to use any black magics.\n\n");
		} else {
			if (CoC.player.findStatusAffect(StatusAffects.KnowsArouse) >= 0) {
				EngineCore.addButton(5, "Arouse", null, Combat.spellArouse);
			}
			if (CoC.player.findStatusAffect(StatusAffects.KnowsHeal) >= 0) {
				EngineCore.addButton(6, "Heal", null, Combat.spellHeal);
			}
			if (CoC.player.findStatusAffect(StatusAffects.KnowsMight) >= 0) {
				if (CoC.player.findStatusAffect(StatusAffects.Might) < 0) {
					EngineCore.addButton(7, "Might", null, Combat.spellMight);
				} else {
					MainView.outputText("<b>You are already under the effects of Might and cannot cast it again.</b>\n\n");
				}
			}
		}
		// JOJO ABILITIES -- kind makes sense to stuff it in here along side the white magic shit (also because it can't fit into M. Specials :|
		if (CoC.player.findPerk(PerkLib.CleansingPalm) >= 0 && CoC.player.cor < 10) {
			EngineCore.addButton(3, "C.Palm", null, Combat.spellCleansingPalm);
		}
		EngineCore.addButton(9, "Back", null, Combat.combatMenu, false);
	};
	Combat.spellArouse = function() {
		if(CoC.player.findPerk(PerkLib.BloodMage) < 0 && CoC.player.fatigue + EngineCore.spellCost(15) > 100) {
			MainView.outputText("You are too tired to cast this spell.", true);
			EngineCore.doNext( Combat, Combat.magicMenu);
			return;
		}
		EngineCore.doNext( Combat, Combat.combatMenu);
		EngineCore.fatigue(15,1);
		MainView.statsView.show();
		if(CoC.monster.findStatusAffect(StatusAffects.Shell) >= 0) {
			MainView.outputText("As soon as your magic touches the multicolored shell around " + CoC.monster.a + CoC.monster.short + ", it sizzles and fades to nothing.  Whatever that thing is, it completely blocks your magic!\n\n");
			CoC.flags[kFLAGS.SPELLS_CAST]++;
			Combat.spellPerkUnlock();
			Combat.enemyAI();
			return;
		}
		MainView.outputText("You make a series of arcane gestures, drawing on your own lust to inflict it upon your foe!\n", true);
		//Worms be immune
		if(CoC.monster.short === "worms") {
			MainView.outputText("The worms appear to be unaffected by your magic!", false);
			MainView.outputText("\n\n", false);
			CoC.flags[kFLAGS.SPELLS_CAST]++;
			Combat.spellPerkUnlock();
			EngineCore.doNext( MainView, MainView.playerMenu);
			if(CoC.monster.lust >= 100) {
				EngineCore.doNext( Combat, Combat.endLustVictory);
			} else {
				Combat.enemyAI();
			}
			return;
		}
		if(CoC.monster.lustVuln === 0) {
			MainView.outputText("It has no effect!  Your foe clearly does not experience lust in the same way as you.\n\n", false);
			CoC.flags[kFLAGS.SPELLS_CAST]++;
			Combat.spellPerkUnlock();
			Combat.enemyAI();
			return;
		}
		CoC.monster.lust += CoC.monster.lustVuln * (CoC.player.inte/5 * CoC.player.spellMod() + Utils.rand(CoC.monster.lib - CoC.monster.inte*2 + CoC.monster.cor)/5);
		if(CoC.monster.lust < 30) {
			MainView.outputText(CoC.monster.getCapitalA() + CoC.monster.short + " squirms as the magic affects " + CoC.monster.pronoun2 + ".  ", false);
		}else if(CoC.monster.lust < 60) {
			if(CoC.monster.plural) {
				MainView.outputText(CoC.monster.getCapitalA() + CoC.monster.short + " stagger, suddenly weak and having trouble focusing on staying upright.  ", false);
			} else {
				MainView.outputText(CoC.monster.getCapitalA() + CoC.monster.short + " staggers, suddenly weak and having trouble focusing on staying upright.  ", false);
			}
		} else {
			MainView.outputText(CoC.monster.getCapitalA() + CoC.monster.short + "'");
			if(!CoC.monster.plural) {
				MainView.outputText("s");
			}
			MainView.outputText(" eyes glaze over with desire for a moment.  ", false);
		}
		if(CoC.monster.cocks.length > 0) {
			if(CoC.monster.lust >= 60) {
				MainView.outputText("You see " + CoC.monster.pronoun3 + " " + CoC.monster.multiCockDescriptLight() + " dribble pre-cum.  ", false);
			} else if(CoC.monster.lust >= 30 && CoC.monster.cocks.length === 1) {
				MainView.outputText(CoC.monster.getCapitalA() + CoC.monster.short + "'s " + CoC.monster.cockDescriptShort(0) + " hardens, distracting " + CoC.monster.pronoun2 + " further.  ", false);
			} else if(CoC.monster.lust >= 30 && CoC.monster.cocks.length > 1) {
				MainView.outputText("You see " + CoC.monster.pronoun3 + " " + CoC.monster.multiCockDescriptLight() + " harden uncomfortably.  ", false);
			}
		}
		if(CoC.monster.vaginas.length > 0 && CoC.monster.lust >= 60) {
			if(CoC.monster.plural) {
				if(CoC.monster.vaginas[0].vaginalWetness === AppearanceDefs.VAGINA_WETNESS_NORMAL) {
					MainView.outputText(CoC.monster.getCapitalA() + CoC.monster.short + "'s " + CoC.monster.vaginaDescript() + "s dampen perceptibly.  ", false);
				}else if(CoC.monster.vaginas[0].vaginalWetness === AppearanceDefs.VAGINA_WETNESS_WET) {
					MainView.outputText(CoC.monster.getCapitalA() + CoC.monster.short + "'s crotches become sticky with girl-lust.  ", false);
				} else if(CoC.monster.vaginas[0].vaginalWetness === AppearanceDefs.VAGINA_WETNESS_SLICK) {
					MainView.outputText(CoC.monster.getCapitalA() + CoC.monster.short + "'s " + CoC.monster.vaginaDescript() + "s become sloppy and wet.  ", false);
				} else if(CoC.monster.vaginas[0].vaginalWetness === AppearanceDefs.VAGINA_WETNESS_DROOLING) {
					MainView.outputText("Thick runners of girl-lube stream down the insides of " + CoC.monster.a + CoC.monster.short + "'s thighs.  ", false);
				} else if(CoC.monster.vaginas[0].vaginalWetness === AppearanceDefs.VAGINA_WETNESS_SLAVERING) {
					MainView.outputText(CoC.monster.getCapitalA() + CoC.monster.short + "'s " + CoC.monster.vaginaDescript() + "s instantly soak " + CoC.monster.pronoun2 + " groin.  ", false);
				}
			} else {
				if(CoC.monster.vaginas[0].vaginalWetness === AppearanceDefs.VAGINA_WETNESS_NORMAL) {
					MainView.outputText(CoC.monster.getCapitalA() + CoC.monster.short + "'s " + CoC.monster.vaginaDescript() + " dampens perceptibly.  ", false);
				} else if(CoC.monster.vaginas[0].vaginalWetness === AppearanceDefs.VAGINA_WETNESS_WET) {
					MainView.outputText(CoC.monster.getCapitalA() + CoC.monster.short + "'s crotch becomes sticky with girl-lust.  ", false);
				} else if(CoC.monster.vaginas[0].vaginalWetness === AppearanceDefs.VAGINA_WETNESS_SLICK) {
					MainView.outputText(CoC.monster.getCapitalA() + CoC.monster.short + "'s " + CoC.monster.vaginaDescript() + " becomes sloppy and wet.  ", false);
				} else if(CoC.monster.vaginas[0].vaginalWetness === AppearanceDefs.VAGINA_WETNESS_DROOLING) {
					MainView.outputText("Thick runners of girl-lube stream down the insides of " + CoC.monster.a + CoC.monster.short + "'s thighs.  ", false);
				} else if(CoC.monster.vaginas[0].vaginalWetness === AppearanceDefs.VAGINA_WETNESS_SLAVERING) {
					MainView.outputText(CoC.monster.getCapitalA() + CoC.monster.short + "'s " + CoC.monster.vaginaDescript() + " instantly soaks her groin.  ", false);
				}
			}
		}
		MainView.outputText("\n\n", false);
		EngineCore.doNext( MainView, MainView.playerMenu);
		CoC.flags[kFLAGS.SPELLS_CAST]++;
		Combat.spellPerkUnlock();
		if(CoC.monster.lust >= 100) {
			EngineCore.doNext( Combat, Combat.endLustVictory);
		} else {
			Combat.enemyAI();
		}
		return;
	};
	Combat.spellHeal = function() {
		if(CoC.player.findPerk(PerkLib.BloodMage) < 0 && CoC.player.fatigue + EngineCore.spellCost(20) > 100) {
			MainView.outputText("You are too tired to cast this spell.", true);
			EngineCore.doNext( Combat, Combat.magicMenu);
			return;
		}
		EngineCore.doNext( Combat, Combat.combatMenu);
		EngineCore.fatigue(20,1);
		MainView.outputText("You focus on your body and its desire to end pain, trying to draw on your arousal without enhancing it.\n", true);
		//25% backfire!
		if( Utils.rand(4) === 0) {
			MainView.outputText("An errant sexual thought crosses your mind, and you lose control of the spell!  Your ", false);
			if(CoC.player.gender === 0) {
				MainView.outputText(Descriptors.assholeDescript() + " tingles with a desire to be filled as your libido spins out of control.", false);
			}
			if(CoC.player.gender === 1) {
				if(CoC.player.cockTotal() === 1) {
					MainView.outputText(CoC.player.cockDescript(0) + " twitches obscenely and drips with pre-cum as your libido spins out of control.", false);
				} else {
					MainView.outputText(CoC.player.multiCockDescriptLight() + " twitch obscenely and drip with pre-cum as your libido spins out of control.", false);
				}
			}
			if(CoC.player.gender === 2) {
				MainView.outputText(Descriptors.vaginaDescript(0) + " becomes puffy, hot, and ready to be touched as the magic diverts into it.", false);
			}
			if(CoC.player.gender === 3) {
				MainView.outputText(Descriptors.vaginaDescript(0) + " and " + CoC.player.multiCockDescriptLight() + " overfill with blood, becoming puffy and incredibly sensitive as the magic focuses on them.", false);
			}
			EngineCore.dynStats("lib", 0.25, "lus", 15);
		} else {
			var heal = Math.floor((CoC.player.inte/(2 + Utils.rand(3)) * CoC.player.spellMod()) * (CoC.player.maxHP()/150));
			if(CoC.player.armorName === "skimpy nurse's outfit") {
				heal *= 1.2;
			}
			MainView.outputText("You flush with success as your wounds begin to knit (+" + heal + ").", false);
			EngineCore.HPChange(heal,false);
		}
		MainView.outputText("\n\n", false);
		MainView.statsView.show();
		CoC.flags[kFLAGS.SPELLS_CAST]++;
		Combat.spellPerkUnlock();
		if(CoC.player.lust >= 100) {
			EngineCore.doNext( Combat, Combat.endLustLoss);
		} else {
			Combat.enemyAI();
		}
		return;
	};
	//(25) Might – increases strength/toughness by 5 * spellMod, up to a 
	//maximum of 15, allows it to exceed the maximum.  Chance of backfiring 
	//and increasing lust by 15.
	Combat.spellMight = function() {
		if(CoC.player.findPerk(PerkLib.BloodMage) < 0 && CoC.player.fatigue + EngineCore.spellCost(25) > 100) {
			MainView.outputText("You are too tired to cast this spell.", true);
			EngineCore.doNext( Combat, Combat.magicMenu);
			return;
		}
		EngineCore.doNext( Combat, Combat.combatMenu);
		EngineCore.fatigue(25,1);
		var tempStr = 0;
		var tempTou = 0;
		MainView.outputText("You flush, drawing on your body's desires to empower your muscles and toughen you up.\n\n", true);
		//25% backfire!
		if( Utils.rand(4) === 0) {
			MainView.outputText("An errant sexual thought crosses your mind, and you lose control of the spell!  Your ", false);
			if(CoC.player.gender === 0) {
				MainView.outputText(Descriptors.assholeDescript() + " tingles with a desire to be filled as your libido spins out of control.", false);
			}
			if(CoC.player.gender === 1) {
				if(CoC.player.cockTotal() === 1) {
					MainView.outputText(CoC.player.cockDescript(0) + " twitches obscenely and drips with pre-cum as your libido spins out of control.", false);
				} else {
					MainView.outputText(CoC.player.multiCockDescriptLight() + " twitch obscenely and drip with pre-cum as your libido spins out of control.", false);
				}
			}
			if(CoC.player.gender === 2) {
				MainView.outputText(Descriptors.vaginaDescript(0) + " becomes puffy, hot, and ready to be touched as the magic diverts into it.", false);
			}
			if(CoC.player.gender === 3) {
				MainView.outputText(Descriptors.vaginaDescript(0) + " and " + CoC.player.multiCockDescriptLight() + " overfill with blood, becoming puffy and incredibly sensitive as the magic focuses on them.", false);
			}
			EngineCore.dynStats("lib", 0.25, "lus", 15);
		} else {
			MainView.outputText("The rush of success and power flows through your body.  You feel like you can do anything!", false);
			CoC.player.createStatusAffect(StatusAffects.Might,0,0,0,0);
			var might = 5 * CoC.player.spellMod();
			tempStr = might;
			tempTou = might;
			if(CoC.player.str + might > 100) {
				tempStr = 100 - CoC.player.str;
			}
			if(CoC.player.tou + might > 100) {
				tempTou = 100 - CoC.player.tou;
			}
			CoC.player.changeStatusValue(StatusAffects.Might,1,tempStr);
			CoC.player.changeStatusValue(StatusAffects.Might,2,tempTou);
			if(CoC.player.str < 100) {
				MainView.statsView.showStatUp( 'str' );
				MainView.statsView.showStatUp( 'tou' );
			}
			CoC.player.str += CoC.player.statusAffectv1(StatusAffects.Might);
			CoC.player.tou += CoC.player.statusAffectv2(StatusAffects.Might);
		}
		MainView.outputText("\n\n", false);
		MainView.statsView.show();
		CoC.flags[kFLAGS.SPELLS_CAST]++;
		Combat.spellPerkUnlock();
		if(CoC.player.lust >= 100) {
			EngineCore.doNext( Combat, Combat.endLustLoss);
		} else {
			Combat.enemyAI();
		}
		return;
	};
	//(15) Charge Weapon – boosts your weapon attack value by 10 * SpellMod till the end of combat.
	Combat.spellChargeWeapon = function() {
		if(CoC.player.findPerk(PerkLib.BloodMage) < 0 && CoC.player.fatigue + EngineCore.spellCost(15) > 100) {
			MainView.outputText("You are too tired to cast this spell.", true);
			EngineCore.doNext( Combat, Combat.magicMenu);
			return;
		}
		EngineCore.doNext( Combat, Combat.combatMenu);
		EngineCore.fatigue(15,1);
		MainView.outputText("You utter words of power, summoning an electrical charge around your " + CoC.player.weaponName + ".  It crackles loudly, ensuring you'll do more damage with it for the rest of the fight.\n\n", true);
		CoC.player.createStatusAffect(StatusAffects.ChargeWeapon,10 * CoC.player.spellMod(),0,0,0);
		MainView.statsView.show();
		CoC.flags[kFLAGS.SPELLS_CAST]++;
		Combat.spellPerkUnlock();
		Combat.enemyAI();
	};
	//(20) Blind – reduces your opponent's accuracy, giving an additional 50% miss chance to physical attacks.
	Combat.spellBlind = function() {
		MainView.outputText("", true);
		if(CoC.player.findPerk(PerkLib.BloodMage) < 0 && CoC.player.fatigue + EngineCore.spellCost(20) > 100) {
			MainView.outputText("You are too tired to cast this spell.", true);
			EngineCore.doNext( Combat, Combat.magicMenu);
			return;
		}
		EngineCore.doNext( Combat, Combat.combatMenu);
		EngineCore.fatigue(20,1);
		if(CoC.monster.findStatusAffect(StatusAffects.Shell) >= 0) {
			MainView.outputText("As soon as your magic touches the multicolored shell around " + CoC.monster.a + CoC.monster.short + ", it sizzles and fades to nothing.  Whatever that thing is, it completely blocks your magic!\n\n");
			CoC.flags[kFLAGS.SPELLS_CAST]++;
			Combat.spellPerkUnlock();
			Combat.enemyAI();
			return;
		}
		if (CoC.monster.hasClassName( 'JeanClaude' )) {
			MainView.outputText("Jean-Claude howls, reeling backwards before turning back to you, rage clenching his dragon-like face and enflaming his eyes. Your spell seemed to cause him physical pain, but did nothing to blind his lidless sight.");
			MainView.outputText("\n\n“<i>You think your hedge magic will work on me, intrus?</i>” he snarls. “<i>Here- let me show you how it’s really done.</i>” The light of anger in his eyes intensifies, burning a retina-frying white as it demands you stare into it...");
			if ( Utils.rand(CoC.player.spe) >= 50 || Utils.rand(CoC.player.inte) >= 50) {
				MainView.outputText("\n\nThe light sears into your eyes, but with the discipline of conscious effort you escape the hypnotic pull before it can mesmerize you, before Jean-Claude can blind you.");
				MainView.outputText("\n\n“<i>You fight dirty,</i>” the monster snaps. He sounds genuinely outraged. “<i>I was told the interloper was a dangerous warrior, not a little [boy] who accepts duels of honour and then throws sand into his opponent’s eyes. Look into my eyes, little [boy]. Fair is fair.</i>”");
				CoC.monster.HP -= Math.floor(10+(CoC.player.inte/3 + Utils.rand(CoC.player.inte/2)) * CoC.player.spellMod());
			} else {
				MainView.outputText("\n\nThe light sears into your eyes and mind as you stare into it. It’s so powerful, so infinite, so exquisitely painful that you wonder why you’d ever want to look at anything else, at anything at- with a mighty effort, you tear yourself away from it, gasping. All you can see is the afterimages, blaring white and yellow across your vision. You swipe around you blindly as you hear Jean-Claude bark with laughter, trying to keep the monster at arm’s length.");
				MainView.outputText("\n\n“<i>The taste of your own medicine, it is not so nice, eh? I will show you much nicer things in there in time intrus, don’t worry. Once you have learnt your place.</i>”");
				CoC.player.createStatusAffect(StatusAffects.Blind, Utils.rand(4) + 1, 0, 0, 0);
			}
			CoC.flags[kFLAGS.SPELLS_CAST]++;
			Combat.spellPerkUnlock();
			if(CoC.monster.HP < 1) {
				EngineCore.doNext( Combat, Combat.endHpVictory);
			} else {
				Combat.enemyAI();
			}
			return;
		}
		MainView.outputText("You glare at " + CoC.monster.a + CoC.monster.short + " and point at " + CoC.monster.pronoun2 + ".  A bright flash erupts before " + CoC.monster.pronoun2 + "!\n", true);
		if (!CoC.monster.hasClassName( 'LivingStatue' )) {
			if( Utils.rand(3) !== 0) {
				MainView.outputText(" <b>" + CoC.monster.getCapitalA() + CoC.monster.short + " ", false);
				if(CoC.monster.plural && CoC.monster.short !== "imp horde") {
					MainView.outputText("are blinded!</b>", false);
				} else {
					MainView.outputText("is blinded!</b>", false);
				}
				CoC.monster.createStatusAffect(StatusAffects.Blind,5 * CoC.player.spellMod(),0,0,0);
				if(CoC.monster.short === "Isabella") {
					if (SceneLib.isabellaFollowerScene.isabellaAccent()) {
						MainView.outputText("\n\n\"<i>Nein! I cannot see!</i>\" cries Isabella.", false);
					} else {
						MainView.outputText("\n\n\"<i>No! I cannot see!</i>\" cries Isabella.", false);
					}
				}
				if(CoC.monster.short === "Kiha") {
					MainView.outputText("\n\n\"<i>You think blindness will slow me down?  Attacks like that are only effective on those who don't know how to see with their other senses!</i>\" Kiha cries defiantly.", false);
				}
				if(CoC.monster.short === "plain girl") {
					MainView.outputText("  Remarkably, it seems as if your spell has had no effect on her, and you nearly get clipped by a roundhouse as you stand, confused. The girl flashes a radiant smile at you, and the battle continues.", false);
					CoC.monster.removeStatusAffect(StatusAffects.Blind);
				}
			} else {
				MainView.outputText(CoC.monster.getCapitalA() + CoC.monster.short + " blinked!", false);
			}
		}
		MainView.outputText("\n\n", false);
		CoC.flags[kFLAGS.SPELLS_CAST]++;
		Combat.spellPerkUnlock();
		MainView.statsView.show();
		Combat.enemyAI();
	};
	//(30) Whitefire – burns the enemy for 10 + int/3 + Utils.rand(int/2) * spellMod.
	Combat.spellWhitefire = function() {
		MainView.outputText("", true);
		if(CoC.player.findPerk(PerkLib.BloodMage) < 0 && CoC.player.fatigue + EngineCore.spellCost(30) > 100) {
			MainView.outputText("You are too tired to cast this spell.", true);
			EngineCore.doNext( Combat, Combat.magicMenu);
			return;
		}
		EngineCore.doNext( Combat, Combat.combatMenu);
		EngineCore.fatigue(30,1);
		if(CoC.monster.findStatusAffect(StatusAffects.Shell) >= 0) {
			MainView.outputText("As soon as your magic touches the multicolored shell around " + CoC.monster.a + CoC.monster.short + ", it sizzles and fades to nothing.  Whatever that thing is, it completely blocks your magic!\n\n");
			CoC.flags[kFLAGS.SPELLS_CAST]++;
			Combat.spellPerkUnlock();
			Combat.enemyAI();
			return;
		}
		if (CoC.monster.handleSpellResistance) {
			CoC.monster.handleSpellResistance("whitefire");
			CoC.flags[kFLAGS.SPELLS_CAST]++;
			Combat.spellPerkUnlock();
			return;
		}
		MainView.outputText("You narrow your eyes, focusing your mind with deadly intent.  You snap your fingers and " + CoC.monster.a + CoC.monster.short + " is enveloped in a flash of white flames!\n", true);
		var wound = Math.floor(10+(CoC.player.inte/3 + Utils.rand(CoC.player.inte/2)) * CoC.player.spellMod());
		//High damage to goes.
		if(CoC.monster.short === "goo-girl") {
			wound = Math.round(wound * 1.5);
		}
		MainView.outputText(CoC.monster.getCapitalA() + CoC.monster.short + " takes " + wound + " damage.", false);
		//Using fire attacks on the goo]
		if(CoC.monster.short === "goo-girl") {
			MainView.outputText("  Your flames lick the girl's body and she opens her mouth in pained protest as you evaporate much of her moisture. When the fire passes, she seems a bit smaller and her slimy " + CoC.monster.skinTone + " skin has lost some of its shimmer.", false);
			if(CoC.monster.findPerk(PerkLib.Acid) < 0) {
				CoC.monster.createPerk(PerkLib.Acid,0,0,0,0);
			}
		}
		MainView.outputText("\n\n", false);
		CoC.flags[kFLAGS.SPELLS_CAST]++;
		Combat.spellPerkUnlock();
		CoC.monster.HP -= wound;
		MainView.statsView.show();
		if(CoC.monster.HP < 1) {
			EngineCore.doNext( Combat, Combat.endHpVictory);
		} else {
			Combat.enemyAI();
		}
	};
	Combat.spellCleansingPalm = function() {
		MainView.clearOutput();
		if (CoC.player.findPerk(PerkLib.BloodMage) < 0 && CoC.player.fatigue + EngineCore.spellCost(30) > 100) {
			MainView.outputText("You are too tired to cast this spell.", true);
			EngineCore.doNext( Combat, Combat.magicMenu);
			return;
		}
		EngineCore.doNext( Combat, Combat.combatMenu);
	//This is now automatic - newRound arg defaults to true:	menuLoc = 0;
		EngineCore.fatigue(30,1);
		if(CoC.monster.findStatusAffect(StatusAffects.Shell) >= 0) {
			MainView.outputText("As soon as your magic touches the multicolored shell around " + CoC.monster.a + CoC.monster.short + ", it sizzles and fades to nothing.  Whatever that thing is, it completely blocks your magic!\n\n");
			CoC.flags[kFLAGS.SPELLS_CAST]++;
			Combat.spellPerkUnlock();
			Combat.enemyAI();
			return;
		}
		if (CoC.monster.short === "Jojo") {
			// Not a completely corrupted monkmouse
			if (SceneLib.jojoScene.monk < 2) {
				MainView.outputText("You thrust your palm forward, sending a blast of pure energy towards Jojo. At the last second he sends a blast of his own against yours canceling it out\n\n");
				CoC.flags[kFLAGS.SPELLS_CAST]++;
				Combat.spellPerkUnlock();
				Combat.enemyAI();
				return;
			}
		}
		if (CoC.monster.hasClassName( 'LivingStatue' )) {
			MainView.outputText("You thrust your palm forward, causing a blast of pure energy to slam against the giant stone statue- to no effect!");
			CoC.flags[kFLAGS.SPELLS_CAST]++;
			Combat.spellPerkUnlock();
			Combat.enemyAI();
			return;
		}
		var corruptionMulti = (CoC.monster.cor - 20) / 25;
		if (corruptionMulti > 1.5) {
			corruptionMulti = 1.5;
		}
		var wound = Math.floor((CoC.player.inte / 4 + Utils.rand(CoC.player.inte / 3)) * (CoC.player.spellMod() * corruptionMulti));
		
		if (wound > 0) {
			MainView.outputText("You thrust your palm forward, causing a blast of pure energy to slam against " + CoC.monster.a + CoC.monster.short + ", tossing");
			if (CoC.monster.plural === true) {
				MainView.outputText(" them");
			} else {
				MainView.outputText(CoC.monster.mfn(" him", " her", " it"));
			}
			MainView.outputText(" back a few feet.\n\n");
			MainView.outputText(CoC.monster.getCapitalA() + CoC.monster.short + " takes " + wound + " damage.\n\n");
		} else {
			wound = 0;
			MainView.outputText("You thrust your palm forward, causing a blast of pure energy to slam against " + CoC.monster.a + CoC.monster.short + ", which they ignore. It is probably best you don’t use this technique against the pure.\n\n");
		}
		CoC.flags[kFLAGS.SPELLS_CAST]++;
		Combat.spellPerkUnlock();
		CoC.monster.HP -= wound;
		MainView.statsView.show();
		if(CoC.monster.HP < 1) {
			EngineCore.doNext( Combat, Combat.endHpVictory);
		} else {
			Combat.enemyAI();
		}
	};
	Combat.spellPerkUnlock = function() {
		if(CoC.flags[kFLAGS.SPELLS_CAST] >= 5 && CoC.player.findPerk(PerkLib.SpellcastingAffinity) < 0) {
			MainView.outputText("<b>You've become more comfortable with your spells, unlocking the Spellcasting Affinity perk and reducing fatigue cost of spells by 20%!</b>\n\n");
			CoC.player.createPerk(PerkLib.SpellcastingAffinity,20,0,0,0);
		}
		if(CoC.flags[kFLAGS.SPELLS_CAST] >= 15 && CoC.player.perkv1(PerkLib.SpellcastingAffinity) < 35) {
			MainView.outputText("<b>You've become more comfortable with your spells, further reducing your spell costs by an additional 15%!</b>\n\n");
			CoC.player.setPerkValue(PerkLib.SpellcastingAffinity,1,35);
		}
		if(CoC.flags[kFLAGS.SPELLS_CAST] >= 45 && CoC.player.perkv1(PerkLib.SpellcastingAffinity) < 50) {
			MainView.outputText("<b>You've become more comfortable with your spells, further reducing your spell costs by an additional 15%!</b>\n\n");
			CoC.player.setPerkValue(PerkLib.SpellcastingAffinity,1,50);
		}
	};
	//player gains hellfire perk.  
	//Hellfire deals physical damage to completely pure foes, 
	//lust damage to completely corrupt foes, and a mix for those in between.  Its power is based on the PC's corruption and level.  Appearance is slightly changed to mention that the PC's eyes and mouth occasionally show flicks of fire from within them, text could possibly vary based on corruption.
	Combat.hellFire = function() {
		MainView.outputText("", true);
		if (CoC.player.findPerk(PerkLib.BloodMage) < 0 && CoC.player.fatigue + EngineCore.spellCost(20) > 100) {
			MainView.outputText("You are too tired to breathe fire.\n", true);
			EngineCore.doNext( Combat, Combat.combatMenu);
			return;
		}
		EngineCore.fatigue(20, 1);
		//Amily!
		if(CoC.monster.findStatusAffect(StatusAffects.Concentration) >= 0) {
			MainView.outputText("Amily easily glides around your attack thanks to her complete concentration on your movements.\n\n", true);
			Combat.enemyAI();
			return;
		}
		if (CoC.monster.hasClassName( 'LivingStatue' )) {
			MainView.outputText("The fire courses over the stone behemoths skin harmlessly. It does leave the surface of the statue glossier in its wake.");
			Combat.enemyAI();
			return;
		}
		var damage = (CoC.player.level * 8 + Utils.rand(10) + CoC.player.cor/5);
		if(CoC.player.findStatusAffect(StatusAffects.GooArmorSilence) < 0) {
			MainView.outputText("You take in a deep breath and unleash a wave of corrupt red flames from deep within.", false);
		}
		if(CoC.player.findStatusAffect(StatusAffects.WebSilence) >= 0) {
			MainView.outputText("  <b>The fire burns through the webs blocking your mouth!</b>", false);
			CoC.player.removeStatusAffect(StatusAffects.WebSilence);
		}
		if(CoC.player.findStatusAffect(StatusAffects.GooArmorSilence) >= 0) {
			MainView.outputText("  <b>A growl rumbles from deep within as you charge the terrestrial fire, and you force it from your chest and into the slime.  The goop bubbles and steams as it evaporates, drawing a curious look from your foe, who pauses in her onslaught to lean in and watch.  While the tension around your mouth lessens and your opponent forgets herself more and more, you bide your time.  When you can finally work your jaw enough to open your mouth, you expel the lion's - or jaguar's? share of the flame, inflating an enormous bubble of fire and evaporated slime that thins and finally pops to release a superheated cloud.  The armored girl screams and recoils as she's enveloped, flailing her arms.</b>", false);
			CoC.player.removeStatusAffect(StatusAffects.GooArmorSilence);
			damage += 25;
		}
		if(CoC.monster.short === "Isabella") {
			MainView.outputText("  Isabella shoulders her shield into the path of the crimson flames.  They burst over the wall of steel, splitting around the impenetrable obstruction and washing out harmlessly to the sides.\n\n", false);
			if (SceneLib.isabellaFollowerScene.isabellaAccent()) {
				MainView.outputText("\"<i>Is zat all you've got?  It'll take more than a flashy magic trick to beat Izabella!</i>\" taunts the cow-girl.\n\n", false);
			} else {
				MainView.outputText("\"<i>Is that all you've got?  It'll take more than a flashy magic trick to beat Isabella!</i>\" taunts the cow-girl.\n\n", false);
			}
			Combat.enemyAI();
			return;
		} else if(CoC.monster.short === "Vala") {
			MainView.outputText("  Vala beats her wings with surprising strength, blowing the fireball back at you!  ", false);
			if(CoC.player.findPerk(PerkLib.Evade) >= 0 && Utils.rand(2) === 0) {
				MainView.outputText("You dive out of the way and evade it!", false);
			} else if(CoC.player.findPerk(PerkLib.Flexibility) >= 0 && Utils.rand(4) === 0) {
				MainView.outputText("You use your flexibility to barely fold your body out of the way!", false);
			} else {
				damage = Math.floor(damage / 6);
				MainView.outputText("Your own fire smacks into your face, arousing you!", false);
				EngineCore.dynStats("lus", damage);
			}
			MainView.outputText("\n", false);
		} else {
			if(CoC.monster.inte < 10) {
				MainView.outputText("  Your foe lets out a shriek as their form is engulfed in the blistering flames.", false);
				damage = Math.floor(damage);
				MainView.outputText("(" + damage + ")\n", false);
				CoC.monster.HP -= damage;
			} else {
				if(CoC.monster.lustVuln > 0) {
					MainView.outputText("  Your foe cries out in surprise and then gives a sensual moan as the flames of your passion surround them and fill their body with unnatural lust.\n", false);
					CoC.monster.lust += CoC.monster.lustVuln * damage/6;
				} else {
					MainView.outputText("  The corrupted fire doesn't seem to have affect on " + CoC.monster.a + CoC.monster.short + "!\n", false);
				}
			}
		}
		MainView.outputText("\n", false);
		if(CoC.monster.short === "Holli" && CoC.monster.findStatusAffect(StatusAffects.HolliBurning) < 0) {
			CoC.monster.lightHolliOnFireMagically();
		}
		if(CoC.monster.HP < 1) {
			EngineCore.doNext( Combat, Combat.endHpVictory);
		}
		else if(CoC.monster.lust >= 99) {
			EngineCore.doNext( Combat, Combat.endLustVictory);
		} else {
			Combat.enemyAI();
		}
	};
	Combat.kick = function() {
		MainView.outputText("", true);
		if(CoC.player.fatigue + EngineCore.physicalCost(15) > 100) {
			MainView.outputText("You're too fatigued to use a charge attack!", true);
			EngineCore.menu();
			EngineCore.addButton(0, "Next", Combat.combatMenu, false);
			return;
		}
		EngineCore.fatigue(15,2);
		//Variant start messages!
		if(CoC.player.lowerBody === AppearanceDefs.LOWER_BODY_TYPE_KANGAROO) {
			//(tail)
			if(CoC.player.tailType === AppearanceDefs.TAIL_TYPE_KANGAROO) {
				MainView.outputText("You balance on your flexible kangaroo-tail, pulling both legs up before slamming them forward simultaneously in a brutal kick.  ", false);
			} else { //(no tail)
				MainView.outputText("You balance on one leg and cock your powerful, kangaroo-like leg before you slam it forward in a kick.  ", false);
			}
		} else if(CoC.player.lowerBody === AppearanceDefs.LOWER_BODY_TYPE_BUNNY) { //(bunbun kick)
			MainView.outputText("You leap straight into the air and lash out with both your furred feet simultaneously, slamming forward in a strong kick.  ", false);
		} else if(CoC.player.lowerBody === AppearanceDefs.LOWER_BODY_TYPE_CENTAUR) { //(centaur kick)
			MainView.outputText("You lurch up onto your backlegs, lifting your forelegs from the ground a split-second before you lash them out in a vicious kick.  ", false);
		} else if(CoC.player.lowerBody === AppearanceDefs.LOWER_BODY_TYPE_HOOFED) { //(bipedal hoof-kick)
			MainView.outputText("You twist and lurch as you raise a leg and slam your hoof forward in a kick.  ", false);
		}
		if(CoC.flags[kFLAGS.PC_FETISH] >= 3) {
			MainView.outputText("You attempt to attack, but at the last moment your body wrenches away, preventing you from even coming close to landing a blow!  Ceraph's piercings have made normal attack impossible!  Maybe you could try something else?\n\n", false);
			Combat.enemyAI();
			return;
		}
		//Amily!
		if(CoC.monster.findStatusAffect(StatusAffects.Concentration) >= 0) {
			MainView.outputText("Amily easily glides around your attack thanks to her complete concentration on your movements.\n\n", true);
			Combat.enemyAI();
			return;
		}
		//Blind
		if(CoC.player.findStatusAffect(StatusAffects.Blind) >= 0) {
			MainView.outputText("You attempt to attack, but as blinded as you are right now, you doubt you'll have much luck!  ", false);
		}
		var damage = 0;
		//Worms are special
		if(CoC.monster.short === "worms") {
			//50% chance of hit (int boost)
			if( Utils.rand(100) + CoC.player.inte/3 >= 50) {
				damage = Math.floor(CoC.player.str/5 - Utils.rand(5));
				if(damage === 0) {
					damage = 1;
				}
				MainView.outputText("You strike at the amalgamation, crushing countless worms into goo, dealing " + damage + " damage.\n\n", false);
				CoC.monster.HP -= damage;
				if(CoC.monster.HP <= 0) {
					EngineCore.doNext( Combat, Combat.endHpVictory);
					return;
				}
			} else { //Fail
				MainView.outputText("You attempt to crush the worms with your reprisal, only to have the collective move its individual members, creating a void at the point of impact, leaving you to attack only empty air.\n\n", false);
			}
			Combat.enemyAI();
			return;
		}
		//Determine if dodged!
		if((CoC.player.findStatusAffect(StatusAffects.Blind) >= 0 && Utils.rand(2) === 0) || (CoC.monster.spe - CoC.player.spe > 0 && Utils.rand(((CoC.monster.spe-CoC.player.spe)/4)+80) > 80)) {
			//Akbal dodges special education
			if(CoC.monster.short === "Akbal") {
				MainView.outputText("Akbal moves like lightning, weaving in and out of your furious attack with the speed and grace befitting his jaguar body.\n", false);
			} else {
				MainView.outputText(CoC.monster.getCapitalA() + CoC.monster.short + " manage", false);
				if(!CoC.monster.plural) {
					MainView.outputText("s", false);
				}
				MainView.outputText(" to dodge your kick!", false);
				MainView.outputText("\n\n", false);
			}
			Combat.enemyAI();
			return;
		}
		//Determine damage
		//Base:
		damage = CoC.player.str;
		//Leg bonus
		//Bunny - 20, Kangaroo - 35, 1 hoof = 30, 2 hooves = 40
		if(CoC.player.lowerBody === AppearanceDefs.LOWER_BODY_TYPE_CENTAUR) {
			damage += 40;
		} else if(CoC.player.lowerBody === AppearanceDefs.LOWER_BODY_TYPE_HOOFED) {
			damage += 30;
		} else if(CoC.player.lowerBody === AppearanceDefs.LOWER_BODY_TYPE_BUNNY) {
			damage += 20;
		} else if(CoC.player.lowerBody === AppearanceDefs.LOWER_BODY_TYPE_KANGAROO) {
			damage += 35;
		}
		//Start figuring enemy damage resistance
		var reduction = Utils.rand(CoC.monster.tou);
		//Add in enemy armor if needed
		reduction += CoC.monster.armorDef;
		//Apply AND DONE!
		damage -= reduction;
		//Damage post processing!
		if(CoC.player.findPerk(PerkLib.HistoryFighter) >= 0) {
			damage *= 1.1;
		}
		//(None yet!)
		if(damage > 0) {
			damage = Combat.doDamage(damage);
		}
		//BLOCKED
		if(damage <= 0) {
			damage = 0;
			MainView.outputText(CoC.monster.getCapitalA() + CoC.monster.short, false);
			if(CoC.monster.plural) {
				MainView.outputText("'", false);
			} else {
				MainView.outputText("s", false);
			}
			MainView.outputText(" defenses are too tough for your kick to penetrate!", false);
		} else { //LAND A HIT!
			MainView.outputText(CoC.monster.getCapitalA() + CoC.monster.short, false);
			if(!CoC.monster.plural) {
				MainView.outputText(" reels from the damaging impact! (" + damage + ")", false);
			} else {
				MainView.outputText(" reel from the damaging impact! (" + damage + ")", false);
			}
		}
		if(damage > 0) {
			//Lust raised by anemone contact!
			if(CoC.monster.short === "anemone") {
				MainView.outputText("\nThough you managed to hit the anemone, several of the tentacles surrounding her body sent home jolts of venom when your swing brushed past them.", false);
				//(gain lust, temp lose str/spd)
				CoC.monster.applyVenom(1 + Utils.rand(2));
			}
		}
		MainView.outputText("\n\n", false);
		if(CoC.monster.HP < 1 || CoC.monster.lust > 99) {
			Combat.combatRoundOver();
		} else {
			Combat.enemyAI();
		}
	};
	Combat.PCWebAttack = function() {
		MainView.outputText("", true);
		//Keep logic sane if this attack brings victory
		if(CoC.player.tailVenom < 33) {
			MainView.outputText("You do not have enough webbing to shoot right now!", true);
			EngineCore.doNext( Combat, Combat.physicalSpecials);
			return;
		}
		CoC.player.tailVenom-= 33;
		//Amily!
		if(CoC.monster.findStatusAffect(StatusAffects.Concentration) >= 0) {
			MainView.outputText("Amily easily glides around your attack thanks to her complete concentration on your movements.\n\n", true);
			Combat.enemyAI();
			return;
		}
		//Blind
		if(CoC.player.findStatusAffect(StatusAffects.Blind) >= 0) {
			MainView.outputText("You attempt to attack, but as blinded as you are right now, you doubt you'll have much luck!  ", false);
		} else {
			MainView.outputText("Turning and clenching muscles that no human should have, you expel a spray of sticky webs at " + CoC.monster.a + CoC.monster.short + "!  ", false);
		}
		//Determine if dodged!
		if((CoC.player.findStatusAffect(StatusAffects.Blind) >= 0 && Utils.rand(2) === 0) || (CoC.monster.spe - CoC.player.spe > 0 && Utils.rand(((CoC.monster.spe-CoC.player.spe) / 4) + 80) > 80)) {
			MainView.outputText("You miss " + CoC.monster.a + CoC.monster.short + " completely - ", false);
			if(CoC.monster.plural) {
				MainView.outputText("they", false);
			} else {
				MainView.outputText(CoC.monster.mf("he","she") + " moved out of the way!\n\n", false);
			}
			Combat.enemyAI();
			return;
		}
		//Over-webbed
		if(CoC.monster.spe < 1) {
			if(!CoC.monster.plural) {
				MainView.outputText(CoC.monster.getCapitalA() + CoC.monster.short + " is completely covered in webbing, but you hose " + CoC.monster.mf("him","her") + " down again anyway.", false);
			} else {
				MainView.outputText(CoC.monster.getCapitalA() + CoC.monster.short + " are completely covered in webbing, but you hose them down again anyway.", false);
			}
		} else { //LAND A HIT!
			if(!CoC.monster.plural) {
				MainView.outputText("The adhesive strands cover " + CoC.monster.a + CoC.monster.short + " with restrictive webbing, greatly slowing " + CoC.monster.mf("him","her") + ".", false);
			} else {
				MainView.outputText("The adhesive strands cover " + CoC.monster.a + CoC.monster.short + " with restrictive webbing, greatly slowing " + CoC.monster.mf("him","her") + ".", false);
			}
			CoC.monster.spe -= 45;
			if(CoC.monster.spe < 0) {
				CoC.monster.spe = 0;
			}
		}
		MainView.outputText("\n\n", false);
		if(CoC.monster.HP < 1 || CoC.monster.lust > 99) {
			Combat.combatRoundOver();
		} else {
			Combat.enemyAI();
		}
	};
	Combat.nagaBiteAttack = function() {
		MainView.outputText("", true);
		//FATIIIIGUE
		if(CoC.player.fatigue + EngineCore.physicalCost(10) > 100) {
			MainView.outputText("You just don't have the energy to bite something right now...", true);
			EngineCore.menu();
			EngineCore.addButton(0, "Next", Combat.combatMenu, false);
			return;
		}
		EngineCore.fatigue(10,2);
		//Amily!
		if(CoC.monster.findStatusAffect(StatusAffects.Concentration) >= 0) {
			MainView.outputText("Amily easily glides around your attack thanks to her complete concentration on your movements.", true);
			Combat.enemyAI();
			return;
		}
		if (CoC.monster.hasClassName( 'LivingStatue' )) {
			MainView.outputText("Your fangs can't even penetrate the giant's flesh.");
			Combat.enemyAI();
			return;
		}
		//Works similar to bee stinger, must be regenerated over time. Shares the same poison-meter
		if( Utils.rand(CoC.player.spe/2 + 40) + 20 > CoC.monster.spe/1.5) {
			//(if monster = demons)
			if(CoC.monster.short === "demons") {
				MainView.outputText("You look at the crowd for a moment, wondering which of their number you should bite. Your glance lands upon the leader of the group, easily spotted due to his snakeskin cloak. You quickly dart through the demon crowd as it closes in around you and lunge towards the broad form of the leader. You catch the demon off guard and sink your needle-like fangs deep into his flesh. You quickly release your venom and retreat before he, or the rest of the group manage to react.", false);
			} else { //(Otherwise)
				MainView.outputText("You lunge at the foe headfirst, fangs bared. You manage to catch " + CoC.monster.a + CoC.monster.short + " off guard, your needle-like fangs penetrating deep into " + CoC.monster.pronoun3 + " body. You quickly release your venom, and retreat before " + CoC.monster.pronoun1 + " manages to react.", false);
			}
	        //The following is how the enemy reacts over time to poison. It is displayed after the description paragraph,instead of lust
	        CoC.monster.str -= 5 + Utils.rand(5);
			CoC.monster.spe -= 5 + Utils.rand(5);
			if(CoC.monster.str < 1) {
				CoC.monster.str = 1;
			}
			if(CoC.monster.spe < 1) {
				CoC.monster.spe = 1;
			}
			if(CoC.monster.findStatusAffect(StatusAffects.NagaVenom) >= 0) {
				CoC.monster.addStatusValue(StatusAffects.NagaVenom,1,1);
			} else {
				CoC.monster.createStatusAffect(StatusAffects.NagaVenom,1,0,0,0);
			}
		} else {
	       MainView.outputText("You lunge headfirst, fangs bared. Your attempt fails horrendously, as " + CoC.monster.a + CoC.monster.short + " manages to counter your lunge, knocking your head away with enough force to make your ears ring.", false);
		}
		MainView.outputText("\n\n", false);
		if(CoC.monster.HP < 1 || CoC.monster.lust > 99) {
			Combat.combatRoundOver();
		} else {
			Combat.enemyAI();
		}
	};
	Combat.spiderBiteAttack = function() {
		MainView.outputText("", true);
		//FATIIIIGUE
		if(CoC.player.fatigue + EngineCore.physicalCost(10) > 100) {
			MainView.outputText("You just don't have the energy to bite something right now...", true);
			EngineCore.menu();
			EngineCore.addButton(0, "Next", Combat.combatMenu, false);
			return;
		}
		EngineCore.fatigue(10,2);
		//Amily!
		if(CoC.monster.findStatusAffect(StatusAffects.Concentration) >= 0) {
			MainView.outputText("Amily easily glides around your attack thanks to her complete concentration on your movements.", true);
			Combat.enemyAI();
			return;
		}
		if (CoC.monster.hasClassName( 'LivingStatue' )) {
			MainView.outputText("Your fangs can't even penetrate the giant's flesh.");
			Combat.enemyAI();
			return;
		}
		//Works similar to bee stinger, must be regenerated over time. Shares the same poison-meter
		if( Utils.rand(CoC.player.spe/2 + 40) + 20 > CoC.monster.spe/1.5) {
			//(if monster = demons)
			if(CoC.monster.short === "demons") {
				MainView.outputText("You look at the crowd for a moment, wondering which of their number you should bite. Your glance lands upon the leader of the group, easily spotted due to his snakeskin cloak. You quickly dart through the demon crowd as it closes in around you and lunge towards the broad form of the leader. You catch the demon off guard and sink your needle-like fangs deep into his flesh. You quickly release your venom and retreat before he, or the rest of the group manage to react.", false);
			} else { //(Otherwise)
				if(!CoC.monster.plural) {
					MainView.outputText("You lunge at the foe headfirst, fangs bared. You manage to catch " + CoC.monster.a + CoC.monster.short + " off guard, your needle-like fangs penetrating deep into " + CoC.monster.pronoun3 + " body. You quickly release your venom, and retreat before " + CoC.monster.a + CoC.monster.pronoun1 + " manages to react.", false);
				} else {
					MainView.outputText("You lunge at the foes headfirst, fangs bared. You manage to catch one of " + CoC.monster.a + CoC.monster.short + " off guard, your needle-like fangs penetrating deep into " + CoC.monster.pronoun3 + " body. You quickly release your venom, and retreat before " + CoC.monster.a + CoC.monster.pronoun1 + " manage to react.", false);
				}
			}
			//React
			if(CoC.monster.lustVuln === 0) {
				MainView.outputText("  Your aphrodisiac toxin has no effect!", false);
			} else {
				if(CoC.monster.plural) {
					MainView.outputText("  The one you bit flushes hotly, though the entire group seems to become more aroused in sympathy to their now-lusty compatriot.", false);
				} else {
					MainView.outputText("  " + CoC.monster.mf("He","She") + " flushes hotly and " + CoC.monster.mf("touches his suddenly-stiff member, moaning lewdly for a moment.","touches a suddenly stiff nipple, moaning lewdly.  You can smell her arousal in the air."), false);
				}
				CoC.monster.lust += 25 * CoC.monster.lustVuln;
				if( Utils.rand(5) === 0) {
					CoC.monster.lust += 25 * CoC.monster.lustVuln;
				}
			}
		} else {
	       MainView.outputText("You lunge headfirst, fangs bared. Your attempt fails horrendously, as " + CoC.monster.a + CoC.monster.short + " manages to counter your lunge, pushing you back out of range.", false);
		}
		MainView.outputText("\n\n", false);
		if(CoC.monster.HP < 1 || CoC.monster.lust > 99) {
			Combat.combatRoundOver();
		} else {
			Combat.enemyAI();
		}
	};
	//New Abilities and Items
	//[Abilities]
	//Whisper 
	Combat.superWhisperAttack = function() {
		MainView.outputText("", true);
		if (CoC.player.findPerk(PerkLib.BloodMage) < 0 && CoC.player.fatigue + EngineCore.spellCost(10) > 100) {
			MainView.outputText("You are too tired to focus this ability.", true);
			EngineCore.doNext( Combat, Combat.combatMenu);
			return;
		}
		if(CoC.player.findStatusAffect(StatusAffects.ThroatPunch) >= 0 || CoC.player.findStatusAffect(StatusAffects.WebSilence) >= 0) {
			MainView.outputText("You cannot focus to reach the enemy's mind while you're having so much difficult breathing.", true);
			EngineCore.doNext( Combat, Combat.combatMenu);
			return;
		}
		if(CoC.monster.short === "pod" || CoC.monster.inte === 0) {
			MainView.outputText("You reach for the enemy's mind, but cannot find anything.  You frantically search around, but there is no consciousness as you know it in the room.\n\n", true);
			EngineCore.changeFatigue(1);
			Combat.enemyAI();
			return;
		}
		if (CoC.monster.hasClassName( 'LivingStatue' )) {
			MainView.outputText("There is nothing inside the golem to whisper to.");
			EngineCore.changeFatigue(1);
			Combat.enemyAI();
			return;
		}
		EngineCore.fatigue(10, 1);
		if(CoC.monster.findStatusAffect(StatusAffects.Shell) >= 0) {
			MainView.outputText("As soon as your magic touches the multicolored shell around " + CoC.monster.a + CoC.monster.short + ", it sizzles and fades to nothing.  Whatever that thing is, it completely blocks your magic!\n\n");
			Combat.enemyAI();
			return;
		}
		if(CoC.monster.findPerk(PerkLib.Focused) >= 0) {
			if(!CoC.monster.plural) {
				MainView.outputText(CoC.monster.getCapitalA() + CoC.monster.short + " is too focused for your whispers to influence!\n\n");
			}
			Combat.enemyAI();
			return;
		}
		//Enemy too strong or multiplesI think you 
		if(CoC.player.inte < CoC.monster.inte || CoC.monster.plural) {
			MainView.outputText("You reach for your enemy's mind, but can't break through.\n", false);
			EngineCore.changeFatigue(10);
			Combat.enemyAI();
			return;
		}
		//[Failure] 
		if( Utils.rand(10) === 0) {
			MainView.outputText("As you reach for your enemy's mind, you are distracted and the chorus of voices screams out all at once within your mind. You're forced to hastily silence the voices to protect yourself.", false);
			EngineCore.changeFatigue(10);
			Combat.enemyAI();
			return;
		}
		MainView.outputText("You reach for your enemy's mind, watching as its sudden fear petrifies your foe.\n\n", false);
		CoC.monster.createStatusAffect(StatusAffects.Fear,1,0,0,0);
		Combat.enemyAI();
	};
	//Attack used:
	//This attack has a cooldown and is more dramatic when used by the PC, it should be some sort of last ditch attack for emergencies. Don't count on using this whenever you want.
		//once a day or something
		//Effect of attack: Damages and stuns the enemy for the turn you used this attack on, plus 2 more turns. High chance of success.
	Combat.dragonBreath = function() {
		MainView.clearOutput();
		if (CoC.player.findPerk(PerkLib.BloodMage) < 0 && CoC.player.fatigue + EngineCore.spellCost(20) > 100) {
			MainView.outputText("You are too tired to breathe fire.", true);
			EngineCore.doNext( Combat, Combat.combatMenu);
			return;
		}
		//Not Ready Yet:
		if(CoC.player.findStatusAffect(StatusAffects.DragonBreathCooldown) >= 0) {
			MainView.outputText("You try to tap into the power within you, but your burning throat reminds you that you're not yet ready to unleash it again...");
			EngineCore.doNext( Combat, Combat.combatMenu);
			return;
		}
	//This is now automatic - newRound arg defaults to true:	menuLoc = 0;
		EngineCore.fatigue(20, 1);
		CoC.player.createStatusAffect(StatusAffects.DragonBreathCooldown,0,0,0,0);
		var damage = Math.floor(CoC.player.level * 8 + 25 + Utils.rand(10));
		if(CoC.player.findStatusAffect(StatusAffects.DragonBreathBoost) >= 0) {
			CoC.player.removeStatusAffect(StatusAffects.DragonBreathBoost);
			damage *= 1.5;
		}
		//Shell
		if(CoC.monster.findStatusAffect(StatusAffects.Shell) >= 0) {
			MainView.outputText("As soon as your magic touches the multicolored shell around " + CoC.monster.a + CoC.monster.short + ", it sizzles and fades to nothing.  Whatever that thing is, it completely blocks your magic!\n\n");
			Combat.enemyAI();
			return;
		}
		//Amily!
		if(CoC.monster.findStatusAffect(StatusAffects.Concentration) >= 0) {
			MainView.outputText("Amily easily glides around your attack thanks to her complete concentration on your movements.", true);
			Combat.enemyAI();
			return;
		}
		if (CoC.monster.hasClassName( 'LivingStatue' )) {
			MainView.outputText("The fire courses by the stone skin harmlessly. It does leave the surface of the statue glossier in its wake.");
			Combat.enemyAI();
			return;
		}
		MainView.outputText("Tapping into the power deep within you, you let loose a bellowing roar at your enemy, so forceful that even the environs crumble around " + CoC.monster.pronoun2 + ".  " + CoC.monster.getCapitalA() + CoC.monster.short + " does " + CoC.monster.pronoun3 + " best to avoid it, but the wave of force is too fast.");
		if(CoC.monster.findStatusAffect(StatusAffects.Sandstorm) >= 0) {
			MainView.outputText("  <b>Your breath is massively dissipated by the swirling vortex, causing it to hit with far less force!</b>");
			damage = Math.round(0.2 * damage);
		}
		//Miss: 
		if((CoC.player.findStatusAffect(StatusAffects.Blind) >= 0 && Utils.rand(2) === 0) || (CoC.monster.spe - CoC.player.spe > 0 && Utils.rand(((CoC.monster.spe-CoC.player.spe)/4)+80) > 80)) {
			MainView.outputText("  Despite the heavy impact caused by your roar, " + CoC.monster.a + CoC.monster.short + " manages to take it at an angle and remain on " + CoC.monster.pronoun3 + " feet and focuses on you, ready to keep fighting.");
		} else if(CoC.monster.short === "Vala") { //Special enemy avoidances
			MainView.outputText("Vala beats her wings with surprising strength, blowing the fireball back at you! ", false);
			if(CoC.player.findPerk(PerkLib.Evade) >= 0 && Utils.rand(2) === 0) {
				MainView.outputText("You dive out of the way and evade it!", false);
			} else if(CoC.player.findPerk(PerkLib.Flexibility) >= 0 && Utils.rand(4) === 0) {
				MainView.outputText("You use your flexibility to barely fold your body out of the way!", false);
			} else {
				damage = Combat.takeDamage(damage);
				MainView.outputText("Your own fire smacks into your face! (" + damage + ")", false);
			}
			MainView.outputText("\n\n", false);
		} else if(CoC.monster.short === "goo-girl") { //Goos burn
			MainView.outputText(" Your flames lick the girl's body and she opens her mouth in pained protest as you evaporate much of her moisture. When the fire passes, she seems a bit smaller and her slimy " + CoC.monster.skinTone + " skin has lost some of its shimmer. ", false);
			if(CoC.monster.findPerk(PerkLib.Acid) < 0) {
				CoC.monster.createPerk(PerkLib.Acid,0,0,0,0);
			}
			damage = Math.round(damage * 1.5);
			damage = Combat.doDamage(damage);
			CoC.monster.createStatusAffect(StatusAffects.Stunned,0,0,0,0);
			MainView.outputText("(" + damage + ")\n\n", false);
		} else {
			if(CoC.monster.findPerk(PerkLib.Resolute) < 0) {
				MainView.outputText("  " + CoC.monster.getCapitalA() + CoC.monster.short + " reels as your wave of force slams into " + CoC.monster.pronoun2 + " like a ton of rock!  The impact sends " + CoC.monster.pronoun2 + " crashing to the ground, too dazed to strike back.");
				CoC.monster.createStatusAffect(StatusAffects.Stunned,1,0,0,0);
			} else {
				MainView.outputText("  " + CoC.monster.getCapitalA() + CoC.monster.short + " reels as your wave of force slams into " + CoC.monster.pronoun2 + " like a ton of rock!  The impact sends " + CoC.monster.pronoun2 + " staggering back, but <b>" + CoC.monster.pronoun1 + " ");
				if(!CoC.monster.plural) {
					MainView.outputText("is ");
				} else {
					MainView.outputText("are");
				}
				MainView.outputText("too resolute to be stunned by your attack.</b>");
			}
			damage = Combat.doDamage(damage);
			MainView.outputText(" (" + damage + ")");
		}
		MainView.outputText("\n\n");
		if(CoC.monster.short === "Holli" && CoC.monster.findStatusAffect(StatusAffects.HolliBurning) < 0) {
			CoC.monster.lightHolliOnFireMagically();
		}
		Combat.combatRoundOver();
	};
	//* Terrestrial Fire
	Combat.fireballuuuuu = function() {
		MainView.outputText("", true);
		if(CoC.player.fatigue + 20 > 100) {
			MainView.outputText("You are too tired to breathe fire.", true);
			EngineCore.doNext( Combat, Combat.combatMenu);
			return;
		}
		EngineCore.changeFatigue(20);
		if(CoC.monster.findStatusAffect(StatusAffects.Shell) >= 0) {
			MainView.outputText("As soon as your magic touches the multicolored shell around " + CoC.monster.a + CoC.monster.short + ", it sizzles and fades to nothing.  Whatever that thing is, it completely blocks your magic!\n\n");
			Combat.enemyAI();
			return;
		}
		//Amily!
		if(CoC.monster.findStatusAffect(StatusAffects.Concentration) >= 0) {
			MainView.outputText("Amily easily glides around your attack thanks to her complete concentration on your movements.", true);
			Combat.enemyAI();
			return;
		}
		if (CoC.monster.hasClassName( 'LivingStatue' )) {
			MainView.outputText("The fire courses by the stone skin harmlessly. It does leave the surface of the statue glossier in its wake.");
			Combat.enemyAI();
			return;
		}
		//[Failure]
		//(high damage to self, +20 fatigue)
		if( Utils.rand(5) === 0 || CoC.player.findStatusAffect(StatusAffects.WebSilence) >= 0) {
			if(CoC.player.findStatusAffect(StatusAffects.WebSilence) >= 0) {
				MainView.outputText("You reach for the terrestrial fire, but as you ready to release a torrent of flame, it backs up in your throat, blocked by the webbing across your mouth.  It causes you to cry out as the sudden, heated force explodes in your own throat.\n\n", false);
			} else if(CoC.player.findStatusAffect(StatusAffects.GooArmorSilence) >= 0) {
				MainView.outputText("You reach for the terrestrial fire but as you ready the torrent, it erupts prematurely, causing you to cry out as the sudden heated force explodes in your own throat.  The slime covering your mouth bubbles and pops, boiling away where the escaping flame opens small rents in it.  That wasn't as effective as you'd hoped, but you can at least speak now.");
			} else {
				MainView.outputText("You reach for the terrestrial fire, but as you ready to release a torrent of flame, the fire inside erupts prematurely, causing you to cry out as the sudden heated force explodes in your own throat.\n\n", false);
			}
			EngineCore.changeFatigue(10);
			Combat.takeDamage(10 + Utils.rand(20));
			Combat.enemyAI();
			return;
		}
		if (CoC.monster.handleSpellResistance) {
			CoC.monster.handleSpellResistance("fireball");
			CoC.flags[kFLAGS.SPELLS_CAST]++;
			Combat.spellPerkUnlock();
			return;
		}
		var damage = Math.floor(CoC.player.level * 10 + 45 + Utils.rand(10));
		if(CoC.player.findStatusAffect(StatusAffects.GooArmorSilence) >= 0) {
			MainView.outputText("<b>A growl rumbles from deep within as you charge the terrestrial fire, and you force it from your chest and into the slime.  The goop bubbles and steams as it evaporates, drawing a curious look from your foe, who pauses in her onslaught to lean in and watch.  While the tension around your mouth lessens and your opponent forgets herself more and more, you bide your time.  When you can finally work your jaw enough to open your mouth, you expel the lion's - or jaguar's? share of the flame, inflating an enormous bubble of fire and evaporated slime that thins and finally pops to release a superheated cloud.  The armored girl screams and recoils as she's enveloped, flailing her arms.</b> ", false);
			CoC.player.removeStatusAffect(StatusAffects.GooArmorSilence);
			damage += 25;
		} else {
			MainView.outputText("A growl rumbles deep with your chest as you charge the terrestrial fire.  When you can hold it no longer, you release an ear splitting roar and hurl a giant green conflagration at your enemy. ", false);
		}

		if(CoC.monster.short === "Isabella") {
			MainView.outputText("Isabella shoulders her shield into the path of the emerald flames.  They burst over the wall of steel, splitting around the impenetrable obstruction and washing out harmlessly to the sides.\n\n", false);
			if (SceneLib.isabellaFollowerScene.isabellaAccent()) {
				MainView.outputText("\"<i>Is zat all you've got?  It'll take more than a flashy magic trick to beat Izabella!</i>\" taunts the cow-girl.\n\n", false);
			} else {
				MainView.outputText("\"<i>Is that all you've got?  It'll take more than a flashy magic trick to beat Isabella!</i>\" taunts the cow-girl.\n\n", false);
			}
			Combat.enemyAI();
			return;
		} else if(CoC.monster.short === "Vala") {
			MainView.outputText("Vala beats her wings with surprising strength, blowing the fireball back at you! ", false);		
			if(CoC.player.findPerk(PerkLib.Evade) >= 0 && Utils.rand(2) === 0) {
				MainView.outputText("You dive out of the way and evade it!", false);
			} else if(CoC.player.findPerk(PerkLib.Flexibility) >= 0 && Utils.rand(4) === 0) {
				MainView.outputText("You use your flexibility to barely fold your body out of the way!", false);
			} else {
				MainView.outputText("Your own fire smacks into your face! (" + damage + ")", false);
				Combat.takeDamage(damage);
			}
			MainView.outputText("\n\n", false);
		} else {
			//Using fire attacks on the goo]
			if(CoC.monster.short === "goo-girl") {
				MainView.outputText(" Your flames lick the girl's body and she opens her mouth in pained protest as you evaporate much of her moisture. When the fire passes, she seems a bit smaller and her slimy " + CoC.monster.skinTone + " skin has lost some of its shimmer. ", false);
				if(CoC.monster.findPerk(PerkLib.Acid) < 0) {
					CoC.monster.createPerk(PerkLib.Acid,0,0,0,0);
				}
				damage = Math.round(damage * 1.5);
			}
			if(CoC.monster.findStatusAffect(StatusAffects.Sandstorm) >= 0) {
				MainView.outputText("<b>Your breath is massively dissipated by the swirling vortex, causing it to hit with far less force!</b>  ");
				damage = Math.round(0.2 * damage);
			}
			MainView.outputText("(" + damage + ")\n\n", false);
			CoC.monster.HP -= damage;
			if(CoC.monster.short === "Holli" && CoC.monster.findStatusAffect(StatusAffects.HolliBurning) < 0) {
				CoC.monster.lightHolliOnFireMagically();
			}
		}
		if(CoC.monster.HP < 1) {
			EngineCore.doNext( Combat, Combat.endHpVictory);
		} else {
			Combat.enemyAI();
		}
	};
	Combat.kissAttack = function() {
		if(CoC.player.findStatusAffect(StatusAffects.Blind) >= 0) {
			MainView.outputText("There's no way you'd be able to find their lips while you're blind!", true);
			EngineCore.doNext( Combat, Combat.physicalSpecials);
			return;
		}
		MainView.outputText("", true);
		var attack = Utils.rand(6);
		switch(attack) {
			case 1:
				//Attack text 1:
				MainView.outputText("You hop up to " + CoC.monster.a + CoC.monster.short + " and attempt to plant a kiss on " + CoC.monster.pronoun3 + ".", false);
				break;
			//Attack text 2:
			case 2:
				MainView.outputText("You saunter up and dart forward, puckering your golden lips into a perfect kiss.", false);
				break;
			//Attack text 3: 
			case 3:
				MainView.outputText("Swaying sensually, you wiggle up to " + CoC.monster.a + CoC.monster.short + " and attempt to plant a nice wet kiss on " + CoC.monster.pronoun2 + ".", false);
				break;
			//Attack text 4:
			case 4:
				MainView.outputText("Lunging forward, you fly through the air at " + CoC.monster.a + CoC.monster.short + " with your lips puckered and ready to smear drugs all over " + CoC.monster.pronoun2 + ".", false);
				break;
			//Attack text 5:
			case 5:
				MainView.outputText("You lean over, your lips swollen with lust, wet with your wanting slobber as you close in on " + CoC.monster.a + CoC.monster.short + ".", false);
				break;
			//Attack text 6:
			default:
				MainView.outputText("Pursing your drug-laced lips, you close on " + CoC.monster.a + CoC.monster.short + " and try to plant a nice, wet kiss on " + CoC.monster.pronoun2 + ".", false);
				break;
		}
		//Dodged!
		if(CoC.monster.spe - CoC.player.spe > 0 && Utils.rand(((CoC.monster.spe - CoC.player.spe)/4)+80) > 80) {
			attack = Utils.rand(3);
			switch(attack) {
				//Dodge 1:
				case 1:
					if(CoC.monster.plural) {
						MainView.outputText("  " + CoC.monster.getCapitalA() + CoC.monster.short + " sees it coming and moves out of the way in the nick of time!\n\n", false);
					}
					break;
				//Dodge 2:
				case 2:
					if(CoC.monster.plural) {
						MainView.outputText("  Unfortunately, you're too slow, and " + CoC.monster.a + CoC.monster.short + " slips out of the way before you can lay a wet one on one of them.\n\n", false);
					} else {
						MainView.outputText("  Unfortunately, you're too slow, and " + CoC.monster.a + CoC.monster.short + " slips out of the way before you can lay a wet one on " + CoC.monster.pronoun2 + ".\n\n", false);
					}
					break;
				//Dodge 3:
				default:
					if(CoC.monster.plural) {
						MainView.outputText("  Sadly, " + CoC.monster.a + CoC.monster.short + " moves aside, denying you the chance to give one of them a smooch.\n\n", false);
					} else {
						MainView.outputText("  Sadly, " + CoC.monster.a + CoC.monster.short + " moves aside, denying you the chance to give " + CoC.monster.pronoun2 + " a smooch.\n\n", false);
					}
					break;
			}
			Combat.enemyAI();
			return;
		}
		//Success but no effect:
		if(CoC.monster.lustVuln <= 0 || !CoC.monster.hasCock()) {
			if(CoC.monster.plural) {
				MainView.outputText("  Mouth presses against mouth, and you allow your tongue to stick out to taste the saliva of one of their number, making sure to give them a big dose.  Pulling back, you look at " + CoC.monster.a + CoC.monster.short + " and immediately regret wasting the time on the kiss.  It had no effect!\n\n", false);
			} else {
				MainView.outputText("  Mouth presses against mouth, and you allow your tongue to stick to taste " + CoC.monster.pronoun3 + "'s saliva as you make sure to give them a big dose.  Pulling back, you look at " + CoC.monster.a + CoC.monster.short + " and immediately regret wasting the time on the kiss.  It had no effect!\n\n", false);
			}
			Combat.enemyAI();
			return;
		}
		attack = Utils.rand(4);
		var damage = 0;
		switch(attack) {
			//Success 1:
			case 1:
				if(CoC.monster.plural) {
					MainView.outputText("  Success!  A spit-soaked kiss lands right on one of their mouths.  The victim quickly melts into your embrace, allowing you to give them a nice, heavy dose of sloppy oral aphrodisiacs.\n\n", false);
				} else {
					MainView.outputText("  Success!  A spit-soaked kiss lands right on " + CoC.monster.a + CoC.monster.short + "'s mouth.  " + CoC.monster.mf("He","She") + " quickly melts into your embrace, allowing you to give them a nice, heavy dose of sloppy oral aphrodisiacs.\n\n", false);
				}
				damage = 15;
				break;
			//Success 2:
			case 2:
				if(CoC.monster.plural) {
					MainView.outputText("  Gold-gilt lips press into one of their mouths, the victim's lips melding with yours.  You take your time with your suddenly cooperative captive and make sure to cover every bit of their mouth with your lipstick before you let them go.\n\n", false);
				} else {
					MainView.outputText("  Gold-gilt lips press into " + CoC.monster.a + CoC.monster.short + ", " + CoC.monster.pronoun3 + " mouth melding with yours.  You take your time with your suddenly cooperative captive and make sure to cover every inch of " + CoC.monster.pronoun3 + " with your lipstick before you let " + CoC.monster.pronoun2 + " go.\n\n", false);
				}
				damage = 20;
				break;
			//CRITICAL SUCCESS (3)
			case 3:
				if(CoC.monster.plural) {
					MainView.outputText("  You slip past " + CoC.monster.a + CoC.monster.short + "'s guard and press your lips against one of them.  " + CoC.monster.mf("He","She") + " melts against you, " + CoC.monster.mf("his","her") + " tongue sliding into your mouth as " + CoC.monster.mf("he","she") + " quickly succumbs to the fiery, cock-swelling kiss.  It goes on for quite some time.  Once you're sure you've given a full dose to " + CoC.monster.mf("his","her") + " mouth, you break back and observe your handwork.  One of " + CoC.monster.a + CoC.monster.short + " is still standing there, licking " + CoC.monster.mf("his","her") + " his lips while " + CoC.monster.mf("his","her") + " dick is standing out, iron hard.  You feel a little daring and give the swollen meat another moist peck, glossing the tip in gold.  There's no way " + CoC.monster.mf("he","she") + " will go soft now.  Though you didn't drug the rest, they're probably a little 'heated up' from the show.\n\n", false);
				} else {
					MainView.outputText("  You slip past " + CoC.monster.a + CoC.monster.short + "'s guard and press your lips against " + CoC.monster.pronoun3 + ".  " + CoC.monster.mf("He","She") + " melts against you, " + CoC.monster.pronoun3 + " tongue sliding into your mouth as " + CoC.monster.pronoun1 + " quickly succumbs to the fiery, cock-swelling kiss.  It goes on for quite some time.  Once you're sure you've given a full dose to " + CoC.monster.pronoun3 + " mouth, you break back and observe your handwork.  " + CoC.monster.getCapitalA() + CoC.monster.short + " is still standing there, licking " + CoC.monster.pronoun3 + " lips while " + CoC.monster.pronoun3 + " dick is standing out, iron hard.  You feel a little daring and give the swollen meat another moist peck, glossing the tip in gold.  There's no way " + CoC.monster.pronoun1 + " will go soft now.\n\n", false);
				}
				damage = 30;
				break;
			//Success 4:
			default:
				MainView.outputText("  With great effort, you slip through an opening and compress their lips against your own, lust seeping through the oral embrace along with a heavy dose of drugs.\n\n", false);
				damage = 12;
				break;
		}
		//Add status if not already drugged
		if(CoC.monster.findStatusAffect(StatusAffects.LustStick) < 0) {
			CoC.monster.createStatusAffect(StatusAffects.LustStick,0,0,0,0);
		} else { //Else add bonus to round damage
			CoC.monster.addStatusValue(StatusAffects.LustStick,2,Math.round(damage/10));
		}
		//Deal damage
		CoC.monster.lust += Math.round(CoC.monster.lustVuln * damage);
		//Sets up for end of combat, and if not, goes to AI.
		if(!Combat.combatRoundOver()) {
			Combat.enemyAI();
		}
	};
	Combat.possess = function() {
		MainView.outputText("", true);
		if(CoC.monster.short === "plain girl" || CoC.monster.findPerk(PerkLib.Incorporeality) >= 0) {
			MainView.outputText("With a smile and a wink, your form becomes completely intangible, and you waste no time in throwing yourself toward the opponent's frame.  Sadly, it was doomed to fail, as you bounce right off your foe's ghostly form.", false);
		} else if ( CoC.monster.hasClassName( 'LivingStatue' ) ) {
			MainView.outputText("There is nothing to possess inside the golem.");
		} else if((!CoC.monster.hasCock() && !CoC.monster.hasVagina()) || CoC.monster.lustVuln === 0 || CoC.monster.inte === 0 || CoC.monster.inte > 100) { //Sample possession text (>79 int, perhaps?):
			MainView.outputText("With a smile and a wink, your form becomes completely intangible, and you waste no time in throwing yourself into the opponent's frame.  Unfortunately, it seems ", false);
			if(CoC.monster.inte > 100) {
				MainView.outputText("they were FAR more mentally prepared than anything you can handle, and you're summarily thrown out of their body before you're even able to have fun with them.  Darn, you muse.\n\n", false);
			} else {
				MainView.outputText("they have a body that's incompatible with any kind of possession.\n\n", false);
			}
		} else if(CoC.player.inte >= (CoC.monster.inte - 10) + Utils.rand(21)) { //Success!
			MainView.outputText("With a smile and a wink, your form becomes completely intangible, and you waste no time in throwing yourself into your opponent's frame. Before they can regain the initiative, you take control of one of their arms, vigorously masturbating for several seconds before you're finally thrown out. Recorporealizing, you notice your enemy's blush, and know your efforts were somewhat successful.\n\n", false);
			var damage = Math.round(CoC.player.inte/5) + Utils.rand(CoC.player.level) + CoC.player.level;
			CoC.monster.lust += CoC.monster.lustVuln * damage;
		} else { //Fail
			MainView.outputText("With a smile and a wink, your form becomes completely intangible, and you waste no time in throwing yourself into the opponent's frame. Unfortunately, it seems they were more mentally prepared than you hoped, and you're summarily thrown out of their body before you're even able to have fun with them. Darn, you muse. Gotta get smarter.\n\n", false);
		}
		if(!Combat.combatRoundOver()) {
			Combat.enemyAI();
		}
	};
	Combat.runAway = function(callHook) {
		if(callHook === undefined) {
			callHook = true;
		}
		if (callHook && CoC.monster.onPcRunAttempt !== null){
			CoC.monster.onPcRunAttempt();
			return;
		}
		MainView.outputText("", true);
		if (CoC.isInCombat() && CoC.player.findStatusAffect(StatusAffects.Sealed) >= 0 && CoC.player.statusAffectv2(StatusAffects.Sealed) === 4) {
			MainView.clearOutput();
			MainView.outputText("You try to run, but you just can't seem to escape.  <b>Your ability to run was sealed, and now you've wasted a chance to attack!</b>\n\n");
			Combat.enemyAI();
			return;
		}
		//Rut doesnt let you run from dicks.
		if(CoC.player.inRut && CoC.monster.totalCocks() > 0) {
			MainView.outputText("The thought of another male in your area competing for all the pussy infuriates you!  No way will you run!", true);
			EngineCore.menu();
			EngineCore.addButton(0, "Next", Combat.combatMenu, false);
			return;
		}
		if(CoC.monster.findStatusAffect(StatusAffects.Level) >= 0 && CoC.player.canFly()) {
			MainView.clearOutput();
			MainView.outputText("You flex the muscles in your back and, shaking clear of the sand, burst into the air!  Wasting no time you fly free of the sandtrap and its treacherous pit.  \"One day your wings will fall off, little ant,\" the snarling voice of the thwarted androgyne carries up to you as you make your escape.  \"And I will be waiting for you when they do!\"");
			CoC.setInCombat(false);
			Combat.clearStatuses(false);
			EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour);
			return;
		}
		if(CoC.monster.findStatusAffect(StatusAffects.GenericRunDisabled) >= 0 || SceneLib.urtaQuest.isUrta()) {
			MainView.outputText("You can't escape from this fight!");
			EngineCore.menu();
			EngineCore.addButton(0, "Next", Combat.combatMenu, false);
			return;
		}
		if(CoC.monster.findStatusAffect(StatusAffects.Level) >= 0 && CoC.monster.statusAffectv1(StatusAffects.Level) < 4) {
			MainView.outputText("You're too deeply mired to escape!  You'll have to <b>climb</b> some first!");
			EngineCore.menu();
			EngineCore.addButton(0, "Next", Combat.combatMenu, false);
			return;
		}
		if(CoC.monster.findStatusAffect(StatusAffects.RunDisabled) >= 0) {
			MainView.outputText("You'd like to run, but you can't scale the walls of the pit with so many demonic hands pulling you down!");
			EngineCore.menu();
			EngineCore.addButton(0, "Next", Combat.combatMenu, false);
			return;
		}
		if(CoC.flags[kFLAGS.UNKNOWN_FLAG_NUMBER_00329] === 1 && (CoC.monster.short === "minotaur gang" || CoC.monster.short === "minotaur tribe")) {
			CoC.flags[kFLAGS.UNKNOWN_FLAG_NUMBER_00329] = 0;
			//(Free run away) 
			MainView.outputText("You slink away while the pack of brutes is arguing.  Once they finish that argument, they'll be sorely disappointed!", true);
			CoC.setInCombat(false);
			Combat.clearStatuses(false);
			EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour);
			return;
		} else if(CoC.monster.short === "minotaur tribe" && CoC.monster.HPRatio() >= 0.75) {
			MainView.outputText("There's too many of them surrounding you to run!", true);
			EngineCore.menu();
			EngineCore.addButton(0, "Next", Combat.combatMenu, false);
			return;
		}
		if(SceneLib.dungeonCore.isInDungeon() || OnLoadVariables.inRoomedDungeon) {
			MainView.outputText("You're trapped in your foe's home turf - there is nowhere to run!\n\n", true);
			Combat.enemyAI();
			return;
		}
		//Attempt texts!
		if(CoC.monster.short === "Ember") {
			MainView.outputText("You take off");
			if(!CoC.player.canFly()) {
				MainView.outputText(" running");
			} else {
				MainView.outputText(", flapping as hard as you can");
			}
			MainView.outputText(", and Ember, caught up in the moment, gives chase.  ");
		} else if(CoC.player.canFly()) {
			MainView.outputText("Gritting your teeth with effort, you beat your wings quickly and lift off!  ", false);
		} else { //Nonflying PCs
			//Stuck!
			if(CoC.player.findStatusAffect(StatusAffects.NoFlee) >= 0) {
				if(CoC.monster.short === "goblin") {
					MainView.outputText("You try to flee but get stuck in the sticky white goop surrounding you.\n\n", true);
				} else {
					MainView.outputText("You put all your skills at running to work and make a supreme effort to escape, but are unable to get away!\n\n", true);
				}
				Combat.enemyAI();
				return;
			} else { //Nonstuck!
				MainView.outputText("You turn tail and attempt to flee!  ", false);
			}
		}
		//Calculations
		var escapeMod = 20 + CoC.monster.level * 3;
		if(CoC.player.canFly()) {
			escapeMod -= 20;
		}
		if(CoC.player.tailType === AppearanceDefs.TAIL_TYPE_RACCOON && CoC.player.earType === AppearanceDefs.EARS_RACCOON && CoC.player.findPerk(PerkLib.Runner) >= 0) {
			escapeMod -= 25;
		} else { //Big tits doesn't matter as much if ya can fly!
			if(CoC.player.biggestTitSize() >= 35) {
				escapeMod += 5;
			}
			if(CoC.player.biggestTitSize() >= 66) {
				escapeMod += 10;
			}
			if(CoC.player.hipRating >= 20) {
				escapeMod += 5;
			}
			if(CoC.player.buttRating >= 20) {
				escapeMod += 5;
			}
			if(CoC.player.ballSize >= 24 && CoC.player.balls > 0) {
				escapeMod += 5;
			}
			if(CoC.player.ballSize >= 48 && CoC.player.balls > 0) {
				escapeMod += 10;
			}
			if(CoC.player.ballSize >= 120 && CoC.player.balls > 0) {
				escapeMod += 10;
			}
		}
		//ANEMONE OVERRULES NORMAL RUN
		if(CoC.monster.short === "anemone") {
			//Autosuccess - less than 60 lust
			if(CoC.player.lust < 60) {
				MainView.outputText("Marshalling your thoughts, you frown at the strange girl and turn to march up the beach.  After twenty paces inshore you turn back to look at her again.  The anemone is clearly crestfallen by your departure, pouting heavily as she sinks beneath the water's surface.", true);
				CoC.setInCombat(false);
				Combat.clearStatuses(false);
				EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour);
				return;
			} else { //Speed dependent
				//Success
				if(CoC.player.spe > Utils.rand(CoC.monster.spe + escapeMod)) {
					CoC.setInCombat(false);
					Combat.clearStatuses(false);
					MainView.outputText("Marshalling your thoughts, you frown at the strange girl and turn to march up the beach.  After twenty paces inshore you turn back to look at her again.  The anemone is clearly crestfallen by your departure, pouting heavily as she sinks beneath the water's surface.", true);
					EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour);
					return;
				} else { //Run failed:
					MainView.outputText("You try to shake off the fog and run but the anemone slinks over to you and her tentacles wrap around your waist.  <i>\"Stay?\"</i> she asks, pressing her small breasts into you as a tentacle slides inside your " + CoC.player.armorName + " and down to your nethers.  The combined stimulation of the rubbing and the tingling venom causes your knees to buckle, hampering your resolve and ending your escape attempt.", false);
					//(gain lust, temp lose spd/str)
					CoC.monster.applyVenom(4 + CoC.player.sens / 20);
					Combat.combatRoundOver();
					return;
				}
			}
		}
		//Ember is SPUCIAL
		if(CoC.monster.short === "Ember") {
			//GET AWAY
			if(CoC.player.spe > Utils.rand(CoC.monster.spe + escapeMod) || (CoC.player.findPerk(PerkLib.Runner) >= 0 && Utils.rand(100) < 50)) {
				if(CoC.player.findPerk(PerkLib.Runner) >= 0) {
					MainView.outputText("Using your skill at running, y");
				} else {
					MainView.outputText("Y");
				}
				MainView.outputText("ou easily outpace the dragon, who begins hurling imprecations at you.  \"What the hell, [name], you weenie; are you so scared that you can't even stick out your punishment?\"");
				MainView.outputText("\n\nNot to be outdone, you call back, \"Sucks to you!  If even the mighty Last Ember of Hope can't catch me, why do I need to train?  Later, little bird!\"");
				CoC.setInCombat(false);
				Combat.clearStatuses(false);
				EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour);
			} else { //Fail: 
				MainView.outputText("Despite some impressive jinking, " + SceneLib.emberScene.emberMF("he","she") + " catches you, tackling you to the ground.\n\n");
				Combat.enemyAI();
			}
			return;
		}
		//SUCCESSFUL FLEE
		if(CoC.player.spe > Utils.rand(CoC.monster.spe + escapeMod)) {
			//Fliers flee!
			if(CoC.player.canFly()) {
				MainView.outputText(CoC.monster.getCapitalA() + CoC.monster.short + " can't catch you.", false);
			} else if(CoC.player.tailType === AppearanceDefs.TAIL_TYPE_RACCOON && CoC.player.earType === AppearanceDefs.EARS_RACCOON && CoC.player.findPerk(PerkLib.Runner) >= 0) { //sekrit benefit: if you have coon ears, coon tail, and Runner perk, change normal Runner escape to flight-type escape
				MainView.outputText("Using your running skill, you build up a head of steam and jump, then spread your arms and flail your tail wildly; your opponent dogs you as best " + CoC.monster.pronoun1 + " can, but stops and stares dumbly as your spastic tail slowly propels you several meters into the air!  You leave " + CoC.monster.pronoun2 + " behind with your clumsy, jerky, short-range flight.");
			} else { //Non-fliers flee
				MainView.outputText(CoC.monster.getCapitalA() + CoC.monster.short + " rapidly disappears into the shifting landscape behind you.", false);
			}
			if(CoC.monster.short === "Izma") {
				MainView.outputText("\n\nAs you leave the tigershark behind, her taunting voice rings out after you.  \"<i>Oooh, look at that fine backside!  Are you running or trying to entice me?  Haha, looks like we know who's the superior specimen now!  Remember: next time we meet, you owe me that ass!</i>\"  Your cheek tingles in shame at her catcalls.", false);
			}
			CoC.setInCombat(false);
			Combat.clearStatuses(false);
			EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour);
			return;
		} else if(CoC.player.findPerk(PerkLib.Runner) >= 0 && Utils.rand(100) < 50) { //Runner perk chance
			CoC.setInCombat(false);
			MainView.outputText("Thanks to your talent for running, you manage to escape.", false);
			if(CoC.monster.short === "Izma") {
				MainView.outputText("\n\nAs you leave the tigershark behind, her taunting voice rings out after you.  \"<i>Oooh, look at that fine backside!  Are you running or trying to entice me?  Haha, looks like we know who's the superior specimen now!  Remember: next time we meet, you owe me that ass!</i>\"  Your cheek tingles in shame at her catcalls.", false);
			}
			Combat.clearStatuses(false);
			EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour);
			return;
		} else { //FAIL FLEE
			if(CoC.monster.short === "Holli") {
				CoC.monster.escapeFailWithHolli();
				return;
			}
			//Flyers get special failure message.
			if(CoC.player.canFly()) {
				if(CoC.monster.plural) {
					MainView.outputText(CoC.monster.getCapitalA() + CoC.monster.short + " manage to grab your " + CoC.player.legs() + " and drag you back to the ground before you can fly away!", false);
				} else {
					MainView.outputText(CoC.monster.getCapitalA() + CoC.monster.short + " manages to grab your " + CoC.player.legs() + " and drag you back to the ground before you can fly away!", false);
				}
			} else if(CoC.player.tailType === AppearanceDefs.TAIL_TYPE_RACCOON && CoC.player.earType === AppearanceDefs.EARS_RACCOON && CoC.player.findPerk(PerkLib.Runner) >= 0) { //fail
				MainView.outputText("Using your running skill, you build up a head of steam and jump, but before you can clear the ground more than a foot, your opponent latches onto you and drags you back down with a thud!");
			} else { //Nonflyer messages
				//Huge balls messages
				if(CoC.player.balls > 0 && CoC.player.ballSize >= 24) {
					if(CoC.player.ballSize < 48) {
						MainView.outputText("With your " + Descriptors.ballsDescriptLight() + " swinging ponderously beneath you, getting away is far harder than it should be.  ", false);
					} else {
						MainView.outputText("With your " + Descriptors.ballsDescriptLight() + " dragging along the ground, getting away is far harder than it should be.  ", false);
					}
				}
				//FATASS BODY MESSAGES
				if(CoC.player.biggestTitSize() >= 35 || CoC.player.buttRating >= 20 || CoC.player.hipRating >= 20) {
					//FOR PLAYERS WITH GIANT BREASTS
					if(CoC.player.biggestTitSize() >= 35 && CoC.player.biggestTitSize() < 66) {
						if(CoC.player.hipRating >= 20) {
							MainView.outputText("Your " + Descriptors.hipDescript() + " forces your gait to lurch slightly side to side, which causes the fat of your " + CoC.player.skinTone + " ", false);
							if(CoC.player.buttRating >= 20) {
								MainView.outputText(Descriptors.buttDescript() + " and ", false);
							}
							MainView.outputText(Descriptors.chestDesc() + " to wobble immensely, throwing you off balance and preventing you from moving quick enough to escape.", false);
						} else if(CoC.player.buttRating >= 20) {
							MainView.outputText("Your " + CoC.player.skinTone + Descriptors.buttDescript() + " and " + Descriptors.chestDesc() + " wobble and bounce heavily, throwing you off balance and preventing you from moving quick enough to escape.", false);
						} else {
							MainView.outputText("Your " + Descriptors.chestDesc() + " jiggle and wobble side to side like the " + CoC.player.skinTone + " sacks of milky fat they are, with such force as to constantly throw you off balance, preventing you from moving quick enough to escape.", false);
						}
					} else if(CoC.player.biggestTitSize() >= 66) { //FOR PLAYERS WITH MASSIVE BREASTS
						if(CoC.player.hipRating >= 20) {
							MainView.outputText("Your " + Descriptors.chestDesc() + " nearly drag along the ground while your " + Descriptors.hipDescript() + " swing side to side ", false);
							if(CoC.player.buttRating >= 20) {
								MainView.outputText("causing the fat of your " + CoC.player.skinTone + Descriptors.buttDescript() + " to wobble heavily, ", false);
							}
							MainView.outputText("forcing your body off balance and preventing you from moving quick enough to get escape.", false);
						} else if(CoC.player.buttRating >= 20) {
							MainView.outputText("Your " + Descriptors.chestDesc() + " nearly drag along the ground while the fat of your " + CoC.player.skinTone + Descriptors.buttDescript() + " wobbles heavily from side to side, forcing your body off balance and preventing you from moving quick enough to escape.", false);
						} else {
							MainView.outputText("Your " + Descriptors.chestDesc() + " nearly drag along the ground, preventing you from moving quick enough to get escape.", false);
						}
					} else if(CoC.player.hipRating >= 20) { //FOR PLAYERS WITH EITHER GIANT HIPS OR BUTT BUT NOT THE BREASTS
						MainView.outputText("Your " + Descriptors.hipDescript() + " swing heavily from side to side ", false);
						if(CoC.player.buttRating >= 20) {
							MainView.outputText("causing your " + CoC.player.skinTone + Descriptors.buttDescript() + " to wobble obscenely ", false);
						}
						MainView.outputText("and forcing your body into an awkward gait that slows you down, preventing you from escaping.", false);
					} else if(CoC.player.buttRating >= 20) { //JUST DA BOOTAH
						MainView.outputText("Your " + CoC.player.skinTone + Descriptors.buttDescript() + " wobbles so heavily that you're unable to move quick enough to escape.", false);
					}
				} else if(CoC.monster.plural) { //NORMAL RUN FAIL MESSAGES
					MainView.outputText(CoC.monster.getCapitalA() + CoC.monster.short + " stay hot on your heels, denying you a chance at escape!", false);
				} else {
					MainView.outputText(CoC.monster.getCapitalA() + CoC.monster.short + " stays hot on your heels, denying you a chance at escape!", false);
				}
			}
		}
		MainView.outputText("\n\n", false);
		Combat.enemyAI();
	};
	Combat.anemoneSting = function() {
		MainView.outputText("", true);
		//-sting with hair (combines both bee-sting effects, but weaker than either one separately):
		//Fail!
		//25% base fail chance
		//Increased by 1% for every point over PC's speed
		//Decreased by 1% for every inch of hair the PC has
		var prob = 70;
		if(CoC.monster.spe > CoC.player.spe) {
			prob -= CoC.monster.spe - CoC.player.spe;
		}
		prob += CoC.player.hairLength;
		if(prob <= Utils.rand(101)) {
			//-miss a sting
			if(CoC.monster.plural) {
				MainView.outputText("You rush " + CoC.monster.a + CoC.monster.short + ", whipping your hair around to catch them with your tentacles, but " + CoC.monster.pronoun1 + " easily dodge.  Oy, you hope you didn't just give yourself whiplash.", false);
			} else {
				MainView.outputText("You rush " + CoC.monster.a + CoC.monster.short + ", whipping your hair around to catch it with your tentacles, but " + CoC.monster.pronoun1 + " easily dodges.  Oy, you hope you didn't just give yourself whiplash.", false);
			}
		} else { //Success!
			MainView.outputText("You rush " + CoC.monster.a + CoC.monster.short + ", whipping your hair around like a genie", false);
			MainView.outputText(", and manage to land a few swipes with your tentacles.  ", false);
			if(CoC.monster.plural) {
				MainView.outputText("As the venom infiltrates " + CoC.monster.pronoun3 + " bodies, " + CoC.monster.pronoun1 + " twitch and begin to move more slowly, hampered half by paralysis and half by arousal.", false);
			} else {
				MainView.outputText("As the venom infiltrates " + CoC.monster.pronoun3 + " body, " + CoC.monster.pronoun1 + " twitches and begins to move more slowly, hampered half by paralysis and half by arousal.", false);
			}
			//(decrease speed/str, increase lust)
			//-venom capacity determined by hair length, 2-3 stings per level of length
			//Each sting does 5-10 lust damage and 2.5-5 speed damage
			var damage = 0;
			var temp = 1 + Utils.rand(2);
			if(CoC.player.hairLength >= 12) {
				temp += 1 + Utils.rand(2);
			}
			if(CoC.player.hairLength >= 24) {
				temp += 1 + Utils.rand(2);
			}
			if(CoC.player.hairLength >= 36) {
				temp += 1;
			}
			while(temp > 0) {
				temp--;
				damage += 5 + Utils.rand(6);
			}
			damage += CoC.player.level * 1.5;
			CoC.monster.spe -= damage/2;
			damage = CoC.monster.lustVuln * damage;
			CoC.monster.lust += damage;
			//Clean up down to 1 decimal point
			damage = Math.round(damage*10)/10;		
			MainView.outputText(" (" + damage + ")", false);
		}
		//New lines and moving on!
		MainView.outputText("\n\n", false);
		EngineCore.doNext( Combat, Combat.combatMenu);
		if(!Combat.combatRoundOver()) {
			Combat.enemyAI();
		}
	};
	Combat.magicalSpecials = function() {
		if (CoC.isInCombat() && CoC.player.findStatusAffect(StatusAffects.Sealed) >= 0 && CoC.player.statusAffectv2(StatusAffects.Sealed) === 6) {
			MainView.clearOutput();
			MainView.outputText("You try to ready a special ability, but wind up stumbling dizzily instead.  <b>Your ability to use magical special attacks was sealed, and now you've wasted a chance to attack!</b>\n\n");
			Combat.enemyAI();
			return;
		}
		EngineCore.menu();
		//Berserk
		if(CoC.player.findPerk(PerkLib.Berzerker) >= 0) {
			EngineCore.addButton(0,"Berzerk", null, Combat.berzerk);
		}
		if(CoC.player.findPerk(PerkLib.Dragonfire) >= 0) {
			EngineCore.addButton(1,"DragonFire", null, Combat.dragonBreath);
		}
		if(CoC.player.findPerk(PerkLib.FireLord) >= 0) {
			EngineCore.addButton(2,"Fire Breath", null, Combat.fireballuuuuu);
		}
		if(CoC.player.findPerk(PerkLib.Hellfire) >= 0) {
			EngineCore.addButton(3,"Hellfire", null, Combat.hellFire);
		}
		//Possess ability.
		if(CoC.player.findPerk(PerkLib.Incorporeality) >= 0) {
			EngineCore.addButton(4,"Possess", null, Combat.possess);
		}
		if(CoC.player.findPerk(PerkLib.Whispered) >= 0) {
			EngineCore.addButton(5,"Whisper", null, Combat.superWhisperAttack);
		}
		if(CoC.player.findPerk(PerkLib.CorruptedNinetails) >= 0) {
			EngineCore.addButton(6,"C.FoxFire", null, Combat.corruptedFoxFire);
			EngineCore.addButton(7,"Terror", null, Combat.kitsuneTerror);
		}
		if(CoC.player.findPerk(PerkLib.EnlightenedNinetails) >= 0) {
			EngineCore.addButton(6,"FoxFire", null, Combat.foxFire);
			EngineCore.addButton(7,"Illusion", null, Combat.kitsuneIllusion);
		}
		if(CoC.player.findStatusAffect(StatusAffects.ShieldingSpell) >= 0) {
			EngineCore.addButton(8,"Shielding", null, Combat.shieldingSpell);
		}
		if(CoC.player.findStatusAffect(StatusAffects.ImmolationSpell) >= 0) {
			EngineCore.addButton(8,"Immolation", null, Combat.immolationSpell);
		}
		EngineCore.addButton(9, "Back", Combat.combatMenu, false);
	};
	Combat.physicalSpecials = function() {
		if(SceneLib.urtaQuest.isUrta()) {
			SceneLib.urtaQuest.urtaSpecials();
			return;
		}
	//Pass false to combatMenu instead:	menuLoc = 3;
		if (CoC.isInCombat() && CoC.player.findStatusAffect(StatusAffects.Sealed) >= 0 && CoC.player.statusAffectv2(StatusAffects.Sealed) === 5) {
			MainView.clearOutput();
			MainView.outputText("You try to ready a special attack, but wind up stumbling dizzily instead.  <b>Your ability to use physical special attacks was sealed, and now you've wasted a chance to attack!</b>\n\n");
			Combat.enemyAI();
			return;
		}
		EngineCore.menu();
		if (CoC.player.hairType === 4) {
			EngineCore.addButton(0, "AnemoneSting", null, Combat.anemoneSting);
		}
		//Bitez
		if (CoC.player.faceType === AppearanceDefs.FACE_SHARK_TEETH) {
			EngineCore.addButton(1, "Bite", null, Combat.bite);
		}
		else if (CoC.player.faceType === AppearanceDefs.FACE_SNAKE_FANGS) {
			EngineCore.addButton(1, "Bite", null, Combat.nagaBiteAttack);
		}
		else if (CoC.player.faceType === AppearanceDefs.FACE_SPIDER_FANGS) {
			EngineCore.addButton(1, "Bite", null, Combat.spiderBiteAttack);
		}
		//Bow attack
		if (CoC.player.hasKeyItem("Bow") >= 0) {
			EngineCore.addButton(2, "Bow", null, Combat.fireBow);
		}
		//Constrict
		if (CoC.player.lowerBody === AppearanceDefs.LOWER_BODY_TYPE_NAGA) {
			EngineCore.addButton(3, "Constrict", SceneLib.nagaScene, SceneLib.nagaScene.nagaPlayerConstrict);
		}
		//Kick attackuuuu
		else if (CoC.player.isTaur() || CoC.player.lowerBody === AppearanceDefs.LOWER_BODY_TYPE_HOOFED || CoC.player.lowerBody === AppearanceDefs.LOWER_BODY_TYPE_BUNNY || CoC.player.lowerBody === AppearanceDefs.LOWER_BODY_TYPE_KANGAROO) {
			EngineCore.addButton(3, "Kick", null, Combat.kick);
		}
		//Gore if mino horns
		if (CoC.player.hornType === AppearanceDefs.HORNS_COW_MINOTAUR && CoC.player.horns >= 6) {
			EngineCore.addButton(4, "Gore", null, Combat.goreAttack);
		}
		//Infest if infested
		if (CoC.player.findStatusAffect(StatusAffects.Infested) >= 0 && CoC.player.statusAffectv1(StatusAffects.Infested) === 5 && CoC.player.hasCock()) {
			EngineCore.addButton(5, "Infest", null, Combat.playerInfest);
		}
		//Kiss supercedes bite.
		if (CoC.player.findStatusAffect(StatusAffects.LustStickApplied) >= 0) {
			EngineCore.addButton(6, "Kiss", null, Combat.kissAttack);
		}
		switch (CoC.player.tailType) {
			case AppearanceDefs.TAIL_TYPE_BEE_ABDOMEN:
				EngineCore.addButton(7, "Sting", null, Combat.playerStinger);
				break;
			case AppearanceDefs.TAIL_TYPE_SPIDER_ADBOMEN:
				EngineCore.addButton(7, "Web", null, Combat.PCWebAttack);
				break;
			case AppearanceDefs.TAIL_TYPE_SHARK:
			case AppearanceDefs.TAIL_TYPE_LIZARD:
			case AppearanceDefs.TAIL_TYPE_KANGAROO:
			case AppearanceDefs.TAIL_TYPE_DRACONIC:
			case AppearanceDefs.TAIL_TYPE_RACCOON:
				EngineCore.addButton(7, "Tail Whip", null, Combat.tailWhipAttack);
		}
		EngineCore.addButton(9, "Back", Combat.combatMenu, false);
	};
	Combat.berzerk = function() {
		MainView.clearOutput();
		if(CoC.player.findStatusAffect(StatusAffects.Berzerking) >= 0) {
			MainView.outputText("You're already pretty goddamn mad!", true);
			EngineCore.doNext( Combat, Combat.magicalSpecials);
			return;
		}
		MainView.outputText("You roar and unleash your savage fury, forgetting about defense in order to destroy your foe!\n\n", true);
		CoC.player.createStatusAffect(StatusAffects.Berzerking,0,0,0,0);
		Combat.enemyAI();
	};
	//Corrupted Fox Fire
	Combat.corruptedFoxFire = function() {
		MainView.clearOutput();
		if(CoC.player.findPerk(PerkLib.BloodMage) < 0 && CoC.player.fatigue + EngineCore.spellCost(35) > 100) {
			MainView.outputText("You are too tired to use this ability.", true);
			EngineCore.doNext( Combat, Combat.magicalSpecials);
			return;
		}
		if(CoC.player.findStatusAffect(StatusAffects.ThroatPunch) >= 0 || CoC.player.findStatusAffect(StatusAffects.WebSilence) >= 0) {
			MainView.outputText("You cannot focus to use this ability while you're having so much difficult breathing.", true);
			EngineCore.doNext( Combat, Combat.magicalSpecials);
			return;
		}
		EngineCore.fatigue(35,1);
		//Deals direct damage and lust regardless of enemy defenses.  Especially effective against non-corrupted targets.
		MainView.outputText("Holding out your palm, you conjure corrupted purple flame that dances across your fingertips.  You launch it at " + CoC.monster.a + CoC.monster.short + " with a ferocious throw, and it bursts on impact, showering dazzling lavender sparks everywhere.");
		var dmg = Math.floor(10+(CoC.player.inte/3 + Utils.rand(CoC.player.inte/2)) * CoC.player.spellMod());
		if(CoC.monster.cor >= 66) {
			dmg = Math.round(dmg * 0.66);
		} else if(CoC.monster.cor >= 50) {
			dmg = Math.round(dmg * 0.8);
		}
		//Using fire attacks on the goo]
		if(CoC.monster.short === "goo-girl") {
			MainView.outputText("  Your flames lick the girl's body and she opens her mouth in pained protest as you evaporate much of her moisture. When the fire passes, she seems a bit smaller and her slimy " + CoC.monster.skinTone + " skin has lost some of its shimmer.", false);
			if(CoC.monster.findPerk(PerkLib.Acid) < 0) {
				CoC.monster.createPerk(PerkLib.Acid,0,0,0,0);
			}
		}
		dmg = Combat.doDamage(dmg);
		MainView.outputText("  (" + dmg + ")\n\n", false);
		MainView.statsView.show();
		if(CoC.monster.HP < 1) {
			EngineCore.doNext( Combat, Combat.endHpVictory);
		} else {
			Combat.enemyAI();
		}
	};
	//Fox Fire
	Combat.foxFire = function() {
		MainView.clearOutput();
		if(CoC.player.findPerk(PerkLib.BloodMage) < 0 && CoC.player.fatigue + EngineCore.spellCost(35) > 100) {
			MainView.outputText("You are too tired to use this ability.", true);
			EngineCore.doNext( Combat, Combat.magicalSpecials);
			return;
		}
		if(CoC.player.findStatusAffect(StatusAffects.ThroatPunch) >= 0 || CoC.player.findStatusAffect(StatusAffects.WebSilence) >= 0) {
			MainView.outputText("You cannot focus to use this ability while you're having so much difficult breathing.", true);
			EngineCore.doNext( Combat, Combat.magicalSpecials);
			return;
		}
		EngineCore.fatigue(35,1);
		if(CoC.monster.findStatusAffect(StatusAffects.Shell) >= 0) {
			MainView.outputText("As soon as your magic touches the multicolored shell around " + CoC.monster.a + CoC.monster.short + ", it sizzles and fades to nothing.  Whatever that thing is, it completely blocks your magic!\n\n");
			Combat.enemyAI();
			return;
		}
		//Deals direct damage and lust regardless of enemy defenses.  Especially effective against corrupted targets.
		MainView.outputText("Holding out your palm, you conjure an ethereal blue flame that dances across your fingertips.  You launch it at " + CoC.monster.a + CoC.monster.short + " with a ferocious throw, and it bursts on impact, showering dazzling azure sparks everywhere.");
		var dmg = Math.floor(10+(CoC.player.inte/3 + Utils.rand(CoC.player.inte/2)) * CoC.player.spellMod());
		if(CoC.monster.cor < 33) {
			dmg = Math.round(dmg * 0.66);
		} else if(CoC.monster.cor < 50) {
			dmg = Math.round(dmg * 0.8);
		}
		//Using fire attacks on the goo]
		if(CoC.monster.short === "goo-girl") {
			MainView.outputText("  Your flames lick the girl's body and she opens her mouth in pained protest as you evaporate much of her moisture. When the fire passes, she seems a bit smaller and her slimy " + CoC.monster.skinTone + " skin has lost some of its shimmer.", false);
			if(CoC.monster.findPerk(PerkLib.Acid) < 0) {
				CoC.monster.createPerk(PerkLib.Acid,0,0,0,0);
			}
		}
		dmg = Combat.doDamage(dmg);
		MainView.outputText("  (" + dmg + ")\n\n", false);
		MainView.statsView.show();
		if(CoC.monster.HP < 1) {
			EngineCore.doNext( Combat, Combat.endHpVictory);
		} else {
			Combat.enemyAI();
		}
	};
	//Terror
	Combat.kitsuneTerror = function() {
		MainView.clearOutput();
		//Fatigue Cost: 25
		if(CoC.player.findPerk(PerkLib.BloodMage) < 0 && CoC.player.fatigue + EngineCore.spellCost(20) > 100) {
			MainView.outputText("You are too tired to use this ability.", true);
			EngineCore.doNext( Combat, Combat.magicalSpecials);
			return;
		}
		if(CoC.monster.findStatusAffect(StatusAffects.Shell) >= 0) {
			MainView.outputText("As soon as your magic touches the multicolored shell around " + CoC.monster.a + CoC.monster.short + ", it sizzles and fades to nothing.  Whatever that thing is, it completely blocks your magic!\n\n");
			Combat.enemyAI();
			return;
		}
		if(CoC.player.findStatusAffect(StatusAffects.ThroatPunch) >= 0 || CoC.player.findStatusAffect(StatusAffects.WebSilence) >= 0) {
			MainView.outputText("You cannot focus to reach the enemy's mind while you're having so much difficult breathing.", true);
			EngineCore.doNext( Combat, Combat.magicalSpecials);
			return;
		}
		if(CoC.monster.short === "pod" || CoC.monster.inte === 0) {
			MainView.outputText("You reach for the enemy's mind, but cannot find anything.  You frantically search around, but there is no consciousness as you know it in the room.\n\n", true);
			EngineCore.changeFatigue(1);
			Combat.enemyAI();
			return;
		}
		EngineCore.fatigue(20,1);
		//Inflicts fear and reduces enemy SPD.
		MainView.outputText("The world goes dark, an inky shadow blanketing everything in sight as you fill " + CoC.monster.a + CoC.monster.short + "'s mind with visions of otherworldly terror that defy description.");
		//(succeed)
		if(CoC.player.inte/10 + Utils.rand(20) + 1 > CoC.monster.inte/10 + 10) {
			MainView.outputText("  They cower in horror as they succumb to your illusion, believing themselves beset by eldritch horrors beyond their wildest nightmares.\n\n");
			CoC.monster.createStatusAffect(StatusAffects.Fear,1,0,0,0);
			CoC.monster.spe -= 5;
			if(CoC.monster.spe < 1) {
				CoC.monster.spe = 1;
			}
		} else {
			MainView.outputText("  The dark fog recedes as quickly as it rolled in as they push back your illusions, resisting your hypnotic influence.\n\n");
		}
		Combat.enemyAI();
	};
	//Illusion
	Combat.kitsuneIllusion = function() {
		MainView.clearOutput();
		//Fatigue Cost: 25
		if(CoC.player.findPerk(PerkLib.BloodMage) < 0 && CoC.player.fatigue + EngineCore.spellCost(25) > 100) {
			MainView.outputText("You are too tired to use this ability.", true);
			EngineCore.doNext( Combat, Combat.magicalSpecials);
			return;
		}
		if(CoC.player.findStatusAffect(StatusAffects.ThroatPunch) >= 0 || CoC.player.findStatusAffect(StatusAffects.WebSilence) >= 0) {
			MainView.outputText("You cannot focus to use this ability while you're having so much difficult breathing.", true);
			EngineCore.doNext( Combat, Combat.magicalSpecials);
			return;
		}
		if(CoC.monster.short === "pod" || CoC.monster.inte === 0) {
			MainView.outputText("In the tight confines of this pod, there's no use making such an attack!\n\n", true);
			EngineCore.changeFatigue(1);
			Combat.enemyAI();
			return;
		}
		EngineCore.fatigue(25,1);
		if(CoC.monster.findStatusAffect(StatusAffects.Shell) >= 0) {
			MainView.outputText("As soon as your magic touches the multicolored shell around " + CoC.monster.a + CoC.monster.short + ", it sizzles and fades to nothing.  Whatever that thing is, it completely blocks your magic!\n\n");
			Combat.enemyAI();
			return;
		}
		//Decrease enemy speed and increase their susceptibility to lust attacks if already 110% or more
		MainView.outputText("The world begins to twist and distort around you as reality bends to your will, " + CoC.monster.a + CoC.monster.short + "'s mind blanketed in the thick fog of your illusions.");
		//Check for success rate. Maximum 100% with over 90 Intelligence difference between PC and monster.
		if(CoC.player.inte/10 + Utils.rand(20) > CoC.monster.inte / 10 + 9) {
			//Reduce speed down to -20. Um, are there many monsters with 110% lust vulnerability?
			MainView.outputText("  They stumble humorously to and fro, unable to keep pace with the shifting illusions that cloud their perceptions.\n\n");
			if(CoC.monster.spe >= 0) {
				CoC.monster.spe -= 20;
			}
			if(CoC.monster.lustVuln >= 1.1) {
				CoC.monster.lustVuln += 0.1;
			}
		} else {
			MainView.outputText("  Like the snapping of a rubber band, reality falls back into its rightful place as they resist your illusory conjurations.\n\n");
		}
		Combat.enemyAI();
	};
	//special attack: tail whip? could unlock button for use by dagrons too
	//tiny damage and lower monster armor by ~75% for one turn
	//hit
	Combat.tailWhipAttack = function() {
		MainView.clearOutput();
		//miss
		if((CoC.player.findStatusAffect(StatusAffects.Blind) >= 0 && Utils.rand(2) === 0) || (CoC.monster.spe - CoC.player.spe > 0 && Utils.rand(((CoC.monster.spe-CoC.player.spe)/4)+80) > 80)) {
			MainView.outputText("Twirling like a top, you swing your tail, but connect with only empty air.");
		} else {
			if(!CoC.monster.plural) {
				MainView.outputText("Twirling like a top, you bat your opponent with your tail.  For a moment, " + CoC.monster.pronoun1 + " looks disbelieving, as if " + CoC.monster.pronoun3 + " world turned upside down, but " + CoC.monster.pronoun1 + " soon becomes irate and redoubles " + CoC.monster.pronoun3 + " offense, leaving large holes in " + CoC.monster.pronoun3 + " guard.  If you're going to take advantage, it had better be right away; " + CoC.monster.pronoun1 + "'ll probably cool off very quickly.");
			} else {
				MainView.outputText("Twirling like a top, you bat your opponent with your tail.  For a moment, " + CoC.monster.pronoun1 + " look disbelieving, as if " + CoC.monster.pronoun3 + " world turned upside down, but " + CoC.monster.pronoun1 + " soon become irate and redouble " + CoC.monster.pronoun3 + " offense, leaving large holes in " + CoC.monster.pronoun3 + " guard.  If you're going to take advantage, it had better be right away; " + CoC.monster.pronoun1 + "'ll probably cool off very quickly.");
			}
			if(CoC.monster.findStatusAffect(StatusAffects.CoonWhip) < 0) {
				CoC.monster.createStatusAffect(StatusAffects.CoonWhip,0,0,0,0);
			}
			var temp = Math.round(CoC.monster.armorDef * 0.75);
			while(temp > 0 && CoC.monster.armorDef >= 1) {
				CoC.monster.armorDef--;
				CoC.monster.addStatusValue(StatusAffects.CoonWhip,1,1);
				temp--;
			}
			CoC.monster.addStatusValue(StatusAffects.CoonWhip,2,2);
			if(CoC.player.tailType === AppearanceDefs.TAIL_TYPE_RACCOON) {
				CoC.monster.addStatusValue(StatusAffects.CoonWhip,2,2);
			}
		}
		MainView.outputText("\n\n");
		Combat.enemyAI();
	};
	//Arian's stuff
	//Using the Talisman in combat
	Combat.immolationSpell = function() {
		MainView.clearOutput();
		MainView.outputText("You gather energy in your Talisman and unleash the spell contained within.  A wave of burning flames gathers around " + CoC.monster.a + CoC.monster.short + ", slowly burning " + CoC.monster.pronoun2 + ".");
		var temp = Math.floor(75+(CoC.player.inte/3 + Utils.rand(CoC.player.inte/2)) * CoC.player.spellMod());
		temp = Combat.doDamage(temp);
		MainView.outputText(" (" + temp + ")\n\n");
		CoC.player.removeStatusAffect(StatusAffects.ImmolationSpell);
		SceneLib.arianScene.clearTalisman();
		Combat.enemyAI();
	};
	Combat.shieldingSpell = function() {
		MainView.clearOutput();
		MainView.outputText("You gather energy in your Talisman and unleash the spell contained within.  A barrier of light engulfs you, before turning completely transparent.  Your defense has been increased.\n\n");
		CoC.player.createStatusAffect(StatusAffects.Shielding,0,0,0,0);
		CoC.player.removeStatusAffect(StatusAffects.ShieldingSpell);
		SceneLib.arianScene.clearTalisman();
		Combat.enemyAI();
	};
	MainView.registerCombatMenu( Combat.combatMenu );
	return Combat;
});
