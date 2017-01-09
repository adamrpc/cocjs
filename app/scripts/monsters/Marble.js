﻿'use strict';

angular.module( 'cocjs' ).factory( 'Marble', function( SceneLib, MainView, $log, WeightedDrop, WeaponLib, StatusAffects, Appearance, Combat, CoC, Monster, Utils, AppearanceDefs ) {
	function Marble() {
		this.init(this, arguments);
	}
	angular.extend(Marble.prototype, Monster.prototype);
	Marble.prototype.marbleSpecialAttackOne = function() {
		//Special1: Heavy overhead swing, high chance of being avoided with evasion, does heavy damage if it hits.;
		var damage = 0;
		//Blind dodge change;
		if( this.findStatusAffect( StatusAffects.Blind ) ) {
			MainView.outputText( 'Marble unwisely tries to make a massive swing while blinded, which you are easily able to avoid.', false );
			SceneLib.combatScene.combatRoundOver();
			return;
		}
		//Determine if dodged!;
		if( Combat.combatMiss( 60 ) ) {
			MainView.outputText( 'You manage to roll out of the way of a massive overhand swing.', false );
			SceneLib.combatScene.combatRoundOver();
			return;
		}
		//Determine if evaded;
		if( Combat.combatEvade( 60 ) ) {
			MainView.outputText( 'You easily sidestep as Marble tries to deliver a huge overhand blow.', false );
			SceneLib.combatScene.combatRoundOver();
			return;
		}
		//Determine damage - str modified by enemy toughness!;
		damage = Math.ceil( (this.str + 20 + this.weaponAttack) - Math.random() * (CoC.player.tou) - CoC.player.armorDef );
		if( damage <= 0 ) {
			damage = 0;
			//Due to toughness or amor...;
			MainView.outputText( 'You somehow manage to deflect and block Marble\'s massive overhead swing.', false );
		}
		if( damage > 0 ) {
			damage = CoC.player.takeDamage( damage );
		}
		MainView.outputText( 'You are struck by a two-handed overhead swing from the enraged cow-girl.  (' + damage + ' damage).', false );
		MainView.statsView.show();
		SceneLib.combatScene.combatRoundOver();
	};
	Marble.prototype.marbleSpecialAttackTwo = function() {
		//Special2: Wide sweep; very high hit chance, does low damage.;
		var damage = 0;
		//Blind dodge change;
		if( this.findStatusAffect( StatusAffects.Blind ) ) {
			MainView.outputText( 'Marble makes a wide sweeping attack with her hammer, which is difficult to avoid even from a blinded opponent.\n', false );
		}
		//Determine if evaded;
		if( Combat.combatEvade() ) {
			MainView.outputText( 'You barely manage to avoid a wide sweeping attack from marble by rolling under it.', false );
			SceneLib.combatScene.combatRoundOver();
			return;
		}
		//Determine damage - str modified by enemy toughness!;
		damage = Math.ceil( (this.str + 40 + this.weaponAttack) - Math.random() * (CoC.player.tou) - CoC.player.armorDef );
		damage /= 2;
		if( damage <= 0 ) {
			damage = 0;
			//Due to toughness or amor...;
			MainView.outputText( 'You easily deflect and block the damage from Marble\'s wide swing.', false );
		}
		MainView.outputText( 'Marble easily hits you with a wide, difficult to avoid swing.  (' + damage + ' damage).', false );
		if( damage > 0 ) {
			CoC.player.takeDamage( damage );
		}
		MainView.statsView.show();
		SceneLib.combatScene.combatRoundOver();
	};
	Marble.prototype.defeated = function() {
		SceneLib.marbleScene.marbleFightWin();
	};
	Marble.prototype.won = function() {
		SceneLib.marbleScene.marbleFightLose();
	};
	Marble.prototype.init = function( that, args ) {
		Monster.prototype.init( that, args );
		that.classNames.push('Marble');
		$log.debug( 'Marble Constructor!' );
		that.a = '';
		that.short = 'Marble';
		that.imageName = 'marble';
		that.long = 'Before you stands a female humanoid with numerous cow features, such as medium-sized cow horns, cow ears, and a cow tail.  She is very well endowed, with wide hips and a wide ass.  She stands over 6 feet tall.  She is using a large two handed hammer with practiced ease, making it clear she is much stronger than she may appear to be.';
		that.createVagina( false, AppearanceDefs.VAGINA_WETNESS_NORMAL, AppearanceDefs.VAGINA_LOOSENESS_NORMAL );
		that.createBreastRow( Appearance.breastCupInverse( 'F' ) );
		that.ass.analLooseness = AppearanceDefs.ANAL_LOOSENESS_VIRGIN;
		that.ass.analWetness = AppearanceDefs.ANAL_WETNESS_DRY;
		that.tallness = 6 * 12 + 4;
		that.hipRating = AppearanceDefs.HIP_RATING_CURVY;
		that.buttRating = AppearanceDefs.BUTT_RATING_LARGE;
		that.lowerBody = AppearanceDefs.LOWER_BODY_TYPE_HOOFED;
		that.skinTone = 'pale';
		that.hairColor = 'brown';
		that.hairLength = 13;
		that.initStrTouSpeInte( 75, 70, 35, 40 );
		that.initLibSensCor( 25, 45, 40 );
		that.weaponName = 'large hammer';
		that.weaponVerb = 'hammer-blow';
		that.weaponAttack = 10;
		that.armorName = 'tough hide';
		that.armorDef = 5;
		that.temperment = Monster.TEMPERMENT_RANDOM_GRAPPLES;
		that.level = 7;
		that.gems = Utils.rand( 5 ) + 25;
		that.drop = new WeightedDrop( WeaponLib.L_HAMMR, 1 );
		that.tailType = AppearanceDefs.TAIL_TYPE_COW;
		that.special1 = that.marbleSpecialAttackOne;
		that.special2 = that.marbleSpecialAttackTwo;
		that.checkMonster();
	};
	return Marble;
} );