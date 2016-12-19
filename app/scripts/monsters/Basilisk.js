'use strict';

angular.module( 'cocjs' ).factory( 'Basilisk', function( SceneLib, MainView, CoC, EngineCore, Monster, Utils, AppearanceDefs, StatusAffects, ChainedDrop, ConsumableLib, Combat ) {
	function Basilisk() {
		this.init(this, arguments);
	}
	angular.extend(Basilisk.prototype, Monster.prototype);
	//special 1: basilisk mental compulsion attack
	//(Check vs. Intelligence/Sensitivity, loss = recurrent speed loss each
	//round, one time lust increase):
	Basilisk.prototype.compulsion = function() {
		MainView.outputText( 'The basilisk opens its mouth and, staring at you, utters words in its strange, dry, sibilant tongue.  The sounds bore into your mind, working and buzzing at the edges of your resolve, suggesting, compelling, then demanding you look into the basilisk\'s eyes.  ', false );
		//Success:
		if( CoC.player.inte / 5 + Utils.rand( 20 ) < 24 ) {
			MainView.outputText( 'You can\'t help yourself... you glimpse the reptile\'s grey, slit eyes. You look away quickly, but you can picture them in your mind\'s eye, staring in at your thoughts, making you feel sluggish and unable to coordinate. Something about the helplessness of it feels so good... you can\'t banish the feeling that really, you want to look in the basilisk\'s eyes forever, for it to have total control over you.', false );
			EngineCore.dynStats( 'lus', 3 );
			//apply status here
			SceneLib.basiliskScene.basiliskSpeed( CoC.player, 20 );
			CoC.player.createStatusAffect( StatusAffects.BasiliskCompulsion, 0, 0, 0, 0 );
		}
		//Failure:
		else {
			MainView.outputText( 'You concentrate, focus your mind and resist the basilisk\'s psychic compulsion.', false );
		}
		Combat.combatRoundOver();
	};

	//Special 3 tail swipe (Small physical damage):
	Basilisk.prototype.basiliskTailSwipe = function() {
		var damage = Math.ceil( (this.str + 20) - Math.random() * (CoC.player.tou + CoC.player.armorDef) );
		damage = CoC.player.takeDamage( damage );
		MainView.outputText( 'The basilisk suddenly whips its tail at you, swiping your ' + CoC.player.feet() + ' from under you!  You quickly stagger upright, being sure to hold the creature\'s feet in your vision. (' + damage + ')', false );
		if( damage === 0 ) {
			MainView.outputText( '  The fall didn\'t harm you at all.', false );
		}
		Combat.combatRoundOver();
	};
	//basilisk physical attack: With lightning speed, the basilisk slashes you with its index claws!
	//Noun: claw
	Basilisk.prototype.performCombatAction = function() {
		if( CoC.player.findStatusAffect( StatusAffects.BasiliskCompulsion ) < 0 && Utils.rand( 3 ) === 0 && this.findStatusAffect( StatusAffects.Blind ) < 0 ) {
			this.compulsion();
		} else if( Utils.rand( 3 ) === 0 ) {
			this.basiliskTailSwipe();
		} else {
			this.eAttack();
		}
	};
	Basilisk.prototype.defeated = function() {
		SceneLib.basiliskScene.defeatBasilisk();
	};
	/* jshint unused:true */
	Basilisk.prototype.won = function( hpVictory, pcCameWorms ) {
		if( pcCameWorms ) {
			MainView.outputText( '\n\nThe basilisk smirks, but waits for you to finish...' );
			EngineCore.doNext( Combat, Combat.endLustLoss );
		} else {
			SceneLib.basiliskScene.loseToBasilisk();
		}
	};
	Basilisk.prototype.init = function(that, args) {
		Monster.prototype.init(that, args);
		that.classNames.push('Basilisk');
		that.a = 'the ';
		that.short = 'basilisk';
		that.imageName = 'basilisk';
		that.long = 'You are fighting a basilisk!  From what you can tell while not looking directly at it, the basilisk is a male reptilian biped standing a bit over 6\' tall.  It has a thin but ropy build, its tightly muscled yellow underbelly the only part of its frame not covered in those deceptive, camouflaging grey-green scales.  A long, whip-like tail flits restlessly through the dirt behind its skinny legs, and sharp sickle-shaped index claws decorate each hand and foot.  You don\'t dare to look at its face, but you have the impression of a cruel jaw, a blunt lizard snout and a crown of dull spines.';
		that.createCock( 6, 2 );
		that.balls = 2;
		that.ballSize = 2;
		that.createBreastRow( 0 );
		that.ass.analLooseness = AppearanceDefs.ANAL_LOOSENESS_TIGHT;
		that.ass.analWetness = AppearanceDefs.ANAL_WETNESS_DRY;
		that.createStatusAffect( StatusAffects.BonusACapacity, 30, 0, 0, 0 );
		that.tallness = 6 * 12 + 2;
		that.hipRating = AppearanceDefs.HIP_RATING_SLENDER + 1;
		that.buttRating = AppearanceDefs.BUTT_RATING_AVERAGE;
		that.lowerBody = AppearanceDefs.LOWER_BODY_TYPE_LIZARD;
		that.skinTone = 'gray';
		that.skinType = AppearanceDefs.SKIN_TYPE_SCALES;
		that.hairColor = 'none';
		that.hairLength = 0;
		that.initStrTouSpeInte( 85, 70, 35, 70 );
		that.initLibSensCor( 50, 35, 60 );
		that.weaponName = 'claws';
		that.weaponVerb = 'claw';
		that.weaponAttack = 30;
		that.armorName = 'scales';
		that.armorDef = 10;
		that.armorPerk = '';
		that.armorValue = 70;
		that.bonusHP = 200;
		that.lust = 30;
		that.lustVuln = 0.5;
		that.temperment = Monster.TEMPERMENT_RANDOM_GRAPPLES;
		that.level = 12;
		that.gems = Utils.rand( 10 ) + 10;
		that.drop = new ChainedDrop().add( ConsumableLib.REPTLUM, 0.9 );
		that.tailType = AppearanceDefs.TAIL_TYPE_COW;
		that.tailRecharge = 0;
		that.checkMonster();
	};
	return Basilisk;
} );