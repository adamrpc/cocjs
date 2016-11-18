'use strict';

angular.module( 'cocjs' ).factory( 'ImpLord', function( Imp, CockTypesEnum, AppearanceDefs, WeightedDrop, ConsumableLib, CoC, EngineCore, Monster, Utils, Combat ) {
	var ImpLord = angular.copy( Imp );
	//Special Attack 1;
	ImpLord.prototype.impFire = function() {
		EngineCore.outputText( 'The imp mutters something to himself. Before you have time to react the demonic creature\'s hand is filled with a bright red fire that he hurls at you.  The flames lick at your body leaving a painful burn on you torso, as well as an arousing heat in your groin.' );
		//[-HP // +Lust(minor)];
		var damage = 40 + Utils.rand( 10 );
		CoC.getInstance().player.takeDamage( damage );
		EngineCore.dynStats( 'lus', 20 + CoC.getInstance().player.cor / 10 );
		Combat.combatRoundOver();
	};
	//Heavy Attack;
	ImpLord.prototype.impLordHeavyEncounter = function() {
		var damage = Math.ceil( (this.str + this.weaponAttack + 20) - Utils.rand( CoC.getInstance().player.tou ) - CoC.getInstance().player.armorDef );
		EngineCore.outputText( 'The demonic creature slashes a clawed hand towards your stomach,' );
		if( Combat.combatMiss() || Combat.combatEvade() || Combat.combatFlexibility() || Combat.combatMisdirect() ) {
			EngineCore.outputText( ' but you handily avoid it.' );
		} else if( damage <= 0 ) {
			EngineCore.outputText( ' but the attack proves ineffectual.' );
		} else {
			EngineCore.outputText( 'leaving a large gash. The attack leaves you slightly stunned, but you recover. ' );
			damage = CoC.getInstance().player.takeDamage( damage );
			EngineCore.outputText( '(' + damage + ')' );
		}
		Combat.combatRoundOver();
	};
	//Lust Attack;
	ImpLord.prototype.impLordLustAttack = function() {
		EngineCore.outputText( 'Lowering his loincloth the imp reveals his inhumanly thick shaft.  He smirks and licks his lips as he gives his cock a squeeze, milking a few beads of clear pre from the tip.  You shake your head and try to ignore your growing need.' );
		//[+Lust];
		EngineCore.dynStats( 'lus', 5 + CoC.getInstance().player.lib / 5 + CoC.getInstance().player.cor / 5 );
		Combat.combatRoundOver();
	};
	//Lust and Light Attack;
	ImpLord.prototype.impLordLustAttack2 = function() {
		EngineCore.outputText( 'Reaching into his satchel the devilish creature pulls out a leather riding crop.  He quickly rushes forward, but somehow manages to get behind you.  Before you can react the imp lashes out, striking your [butt] twice with the riding crop.  The strikes leave a slight burning feeling, as well as a strange sense of arousal.' );
		var damage = 3 + Utils.rand( 10 );
		damage = CoC.getInstance().player.takeDamage( damage );
		EngineCore.outputText( ' (' + damage + ')' );
		//[-HP(minor) // +Lust];
		EngineCore.dynStats( 'lus', 5 + CoC.getInstance().player.sens / 4 + CoC.getInstance().player.cor / 10 );
		Combat.combatRoundOver();
	};
	ImpLord.prototype.performCombatAction = function() {
		var choices = [ this.impFire, this.impLordLustAttack2, this.impLordLustAttack, this.impLordHeavyEncounter, this.eAttack ];
		choices[ Utils.rand( choices.length ) ]();
	};

	ImpLord.prototype.defeated = function() {
		CoC.getInstance().scenes.impScene.defeatImpLord();
	};
	ImpLord.prototype.won = function() {
		CoC.getInstance().scenes.impScene.loseToAnImpLord();
	};
	ImpLord.prototype.init = function( that, args ) {
		Imp.prototype.init( that, args );
		that.a = 'the ';
		that.short = 'imp lord';
		that.imageName = 'implord';
		that.long = 'The greater imp has an angular face, complete with curved nose and burnt red skin typical of imps.  He has no hair on his head, leaving his cold, lust-clouded, black eyes unobstructed.  Just above his long pointed ears are two curved bovine horns.  While still short, he\'s much taller then the average imp, being nearly four feet tall, and extremely well-muscled.  A pair of powerful wings extends out from his shoulders, however, you suspect he wouldn\'t be able to fly for long due to his extreme bulk.  A thick coating of fur starts at his well toned hips and works its way down his powerful legs.  His legs end in a pair of oddly jointed, demonic hooves.  His demonic figure is completed by a thin tail that has an arrowhead shaped tip.\n\nThe greater imp, like most imps wear very little clothing; only a simple loincloth and satchel hang from his waist.  You also note that the imp has two barbell piercings in his nipples. The creature doesn\'t seem to have any weapons, aside from his sharp black finger nails.';
		// Imps now only have demon dicks.;
		// Not sure if I agree with this, I can imagine the little fuckers abusing the;
		// shit out of any potions they can get their hands on.;
		that.createCock( Utils.rand( 2 ) + 11, 2.5, CockTypesEnum.DEMON );
		that.balls = 2;
		that.ballSize = 1;
		that.cumMultiplier = 3;
		that.hoursSinceCum = 20;
		that.createBreastRow( 0 );
		that.ass.analLooseness = AppearanceDefs.ANAL_LOOSENESS_STRETCHED;
		that.ass.analWetness = AppearanceDefs.ANAL_WETNESS_NORMAL;
		that.tallness = Utils.rand( 14 ) + 40;
		that.hipRating = AppearanceDefs.HIP_RATING_BOYISH;
		that.buttRating = AppearanceDefs.BUTT_RATING_TIGHT;
		that.lowerBody = AppearanceDefs.LOWER_BODY_TYPE_HOOFED;
		that.skinTone = 'red';
		that.initStrTouSpeInte( 55, 40, 75, 42 );
		that.initLibSensCor( 55, 35, 100 );
		that.weaponName = 'fist';
		that.weaponVerb = 'punch';
		that.weaponAttack = 10;
		that.armorName = 'leathery skin';
		that.armorDef = 5;
		that.bonusHP = 100;
		that.lust = 30;
		that.lustVuln = 0.65;
		that.temperment = Monster.TEMPERMENT_LUSTY_GRAPPLES;
		that.level = 7;
		that.gems = Utils.rand( 15 ) + 25;
		that.drop = new WeightedDrop().add( ConsumableLib.MINOBLO, 1 ).add( ConsumableLib.LABOVA_, 1 ).add( ConsumableLib.INCUBID, 6 ).add( ConsumableLib.SUCMILK, 6 );
		that.wingType = AppearanceDefs.WING_TYPE_IMP;
		that.special1 = that.lustMagicAttack;
		that.checkMonster();
	};
	return ImpLord;
} );