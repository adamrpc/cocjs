'use strict';

angular.module( 'cocjs' ).factory( 'MilkySuccubus', function( SceneLib, AbstractSuccubus, Appearance, CoC, EngineCore, Utils, AppearanceDefs, Monster, Combat, StatusAffects ) {
	function MilkySuccubus() {
		this.init(this, arguments);
	}
	angular.extend(MilkySuccubus.prototype, AbstractSuccubus.prototype);
	MilkySuccubus.prototype.performCombatAction = function() {
		if( this.findStatusAffect( StatusAffects.MilkyUrta ) < 0 && Utils.rand( 3 ) === 0 ) {
			this.cowCubiMilkSprayAttack();
		} else if( this.HP < 400 ) {
			this.drinkMinoCum();
		} else if( CoC.player.HP < 100 ) {
			this.eAttack();
		} else if( CoC.player.lust >= 90 ) {
			this.succubusTease();
		} else if( Utils.rand( 2 ) === 0 ) {
			this.succubusTease();
		} else {
			this.eAttack();
		}
	};
	MilkySuccubus.prototype.cowCubiMilkSprayAttack = function() {
		//Lasts a couple turns like the goblin lust poison?;
		EngineCore.outputText( '"<i>How about a taste?</i>"  The succubus asks, pressing her tits together.  Before you can reply, a veritable jet of milk sprays in your direction!\n' );
		//Miss:;
		if( Utils.rand( 20 ) + 1 + CoC.player.spe / 20 > 17 ) {
			EngineCore.outputText( 'With your trained reflexes, you manage to duck and roll, narrowly avoiding getting sprayed with milk.' );
			EngineCore.outputText( '\n\n"<i>Such a waste.</i>"  The succubus pouts.  "<i>No worries, I\'ll just have Fido clean it up later... perhaps I\'ll even have you do it later, when you become mine.</i>"  The succubus giggles.' );
			EngineCore.dynStats( 'lus', 6 );
		}
		//Hit:;
		else {
			EngineCore.outputText( 'All you manage to do is cover your face; the rest of you, however, gets completely soaked in the demon\'s corrupted milk.  Looking down at yourself, you realize that you are panting, and the places where the milk splashed your fur begin to heat up.  Oh no! <b>You\'d better finish off this succubus before you succumb to your lusts!</b>' );
			EngineCore.dynStats( 'lus', 15 );
			this.createStatusAffect( StatusAffects.MilkyUrta, 3, 0, 0, 0 );
		}
		Combat.combatRoundOver();
	};
	MilkySuccubus.prototype.drinkMinoCum = function() {
		EngineCore.outputText( 'Smiling wryly and licking her lips, the succubus-cow procures a bottle of her pet\'s cum with her probing tail.' );
		//Success:;
		if( this.findStatusAffect( StatusAffects.DrankMinoCum ) < 0 || this.findStatusAffect( StatusAffects.DrankMinoCum2 ) < 0 ) {
			EngineCore.outputText( '\n\nSmiling triumphantly, she takes the bottle and opens it with a pop, drinking the contents with glee.  When done, she throws the bottle away and smacks her lips.  "<i>Nothing like a bottle of minotaur cum to get you back on your feet, right?</i>"  She grins, her pussy dripping with more juices.' );
			this.lust += 25;
			this.HP += 400;
			if( this.findStatusAffect( StatusAffects.DrankMinoCum ) < 0 ) {
				this.createStatusAffect( StatusAffects.DrankMinoCum, 0, 0, 0, 0 );
			} else {
				this.createStatusAffect( StatusAffects.DrankMinoCum2, 0, 0, 0, 0 );
			}
		}
		//Failure:;
		else {
			EngineCore.outputText( '\n\nShe frowns and looks behind her, pouting slightly when she turns to look back at you.  "<i>Seems like I\'m all out of cum.</i>"  She grins evilly.  "<i>I\'ll just have to get more after I\'m done with you.</i>"' );
		}
		Combat.combatRoundOver();
	};
	MilkySuccubus.prototype.succubusTease = function() {
		if( Utils.rand( 4 ) === 0 ) {
			EngineCore.outputText( 'Turning around, the succubus begins to bounce her rather round derriere in your direction, the cheeks lewdly clapping together with each change in direction, exposing her dark anal star and juicy snatch, literally gushing forth a stream of lubricants.  Her eyes glow with faint, purple light as she whispers, "<i>Don\'t you just want to... slide on in?</i>"' );
		} else if( Utils.rand( 3 ) === 0 ) {
			EngineCore.outputText( 'The succubus squeezes her spotted, sweat-oiled breasts together, squirting out trickles of fresh, creamy, succubi milk.  Bending down, she laps at her own bounty, taking to meet your eyes, her own glowing violet.  You can feel her next words as much as hear them, reaching into your brain and stirring a familiar heat in your loins.  "<i>Giving in would mean pleasure unending, my dear vixen.</i>"' );
		} else if( Utils.rand( 2 ) === 0 ) {
			EngineCore.outputText( 'The succubus turns slightly and slowly bends over, sliding her hands down the sides of her milk laden jugs. "<i>Mmm, would you help a poor girl relax? These things need some attention,</i>" she says with a lust filled moan as her hands reach her multitude of nipples.' );
		} else {
			EngineCore.outputText( 'The succubus leans forwards holding her tits, while wrapping her fingers around her nipples.  "<i>My boobs are soo full.  Would you like to help me drain them?</i>" she says with a husky voice.' );
		}
		EngineCore.dynStats( 'lus', 20 );
		Combat.combatRoundOver();
	};
	MilkySuccubus.prototype.defeated = function() {
		SceneLib.urtaQuest.urtaBeatsUpCowcubi();
	};
	MilkySuccubus.prototype.won = function() {
		SceneLib.urtaQuest.urtaLosesToCowCubi();
	};

	MilkySuccubus.prototype.teased = function( lustDelta ) {
		EngineCore.outputText( this.getCapitalA() + this.short + ' smiles, rubbing her hands across herself as she watches your display.  She does not seem greatly affected by your show - at least in the sense of increasing arousal.  She does seem oddly more... vital, as if she drew strength from the very display you put on.' );
		this.str += 5;
		this.HP += 50;
		this.applyTease( lustDelta );
	};
	MilkySuccubus.prototype.init = function( that, args ) {
		AbstractSuccubus.prototype.init( that, args );
		that.a = 'the ';
		that.short = 'milky succubus';
		that.imageName = 'milkysuccubus';
		that.long = 'You are fighting a milky, cow-like succubus.  She stands about seven feet tall and is hugely voluptuous, with breasts three times the size of her head, tipped with a cluster of four obscenely teat-like nipples.  Her hips flare out into an exaggerated hourglass shape, with a long tail tipped with a fleshy arrow-head spade that waves above her spankable butt.  A small cowbell is tied at the base of the arrow-head with a cute little ribbon.  Wide, cow-like horns, easily appropriate for a minotaur, rise from her head, and she flicks bovine ears about the sides of her head whilst sashaying from side to side on demonic, high-heeled feet.  Her skin is a vibrant purple with splotches of shiny black here and there, including one large spot covering her right eye.  She\'s using a leather whip as a weapon.';
		that.createVagina( false, AppearanceDefs.VAGINA_WETNESS_SLAVERING, AppearanceDefs.VAGINA_LOOSENESS_NORMAL );
		that.createStatusAffect( StatusAffects.BonusVCapacity, 300, 0, 0, 0 );
		that.createBreastRow( Appearance.breastCupInverse( 'G' ) );
		that.ass.analLooseness = AppearanceDefs.ANAL_LOOSENESS_STRETCHED;
		that.ass.analWetness = AppearanceDefs.ANAL_WETNESS_SLIME_DROOLING;
		that.tallness = Utils.rand( 9 ) + 60;
		that.hipRating = AppearanceDefs.HIP_RATING_CURVY;
		that.buttRating = AppearanceDefs.BUTT_RATING_LARGE + 1;
		that.lowerBody = AppearanceDefs.LOWER_BODY_TYPE_DEMONIC_HIGH_HEELS;
		that.skinTone = 'blue';
		that.hairColor = 'black';
		that.hairLength = 13;
		that.initStrTouSpeInte( 75, 50, 125, 95 );
		that.initLibSensCor( 90, 60, 99 );
		that.weaponName = 'whip';
		that.weaponVerb = 'whipping';
		that.weaponAttack = 10;
		that.weaponPerk = '';
		that.weaponValue = 150;
		that.armorName = 'demonic skin';
		that.armorDef = 10;
		that.bonusHP = 700;
		that.lust = 40;
		that.lustVuln = 0.3;
		that.temperment = Monster.TEMPERMENT_LOVE_GRAPPLES;
		that.level = 16;
		that.gems = Utils.rand( 25 ) + 10;
		that.additionalXP = 50;
		that.hornType = AppearanceDefs.HORNS_DRACONIC_X2;
		that.horns = 2;
		that.wingType = AppearanceDefs.WING_TYPE_BAT_LIKE_TINY;
		that.wingDesc = 'tiny hidden';
		that.tailType = AppearanceDefs.TAIL_TYPE_DEMONIC;
		that.special1 = that.kissAttack;
		that.special2 = that.seduceAttack;
		that.special3 = that.whipAttack;
		that.drop = Monster.NO_DROP;
		that.checkMonster();
	};
	return MilkySuccubus;
} );