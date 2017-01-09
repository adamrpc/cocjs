'use strict';

angular.module( 'cocjs' ).factory( 'Brigid', function( SceneLib, MainView, PerkLib, Appearance, CoC, EngineCore, Utils, AppearanceDefs, Monster, StatusAffects ) {
	function Brigid() {
		this.init(this, arguments);
	}
	angular.extend(Brigid.prototype, Monster.prototype);
	//Attack One: Hot Poker, Right Up Your Ass!;
	Brigid.prototype.brigidPoke = function() {
		MainView.outputText( 'Brigid stalks forward with confidence, her shield absorbing your defensive blows until she\'s right on top of you. She bats your [weapon] aside and thrashes you with her hot poker, scalding your ' + CoC.player.skin() + ' and sending you reeling.' );
		//(Effect: Heavy Damage);
		var damage = Math.round( (this.str + this.weaponAttack) - Utils.rand( CoC.player.tou ) - CoC.player.armorDef );
		if( damage < 30 ) {
			damage = 30;
		}
		damage = CoC.player.takeDamage( damage );
		MainView.outputText( ' (' + damage + ')' );
		SceneLib.combatScene.combatRoundOver();
	};
	//Attack Two: SHIELD BOP! OOM BOP!;
	Brigid.prototype.brigidBop = function() {
		MainView.outputText( 'The harpy feints at you with her poker; you dodge the blow, but you leave yourself vulnerable as she spins around and slams her heavy shield into you, knocking you off balance.' );
		//(Effect: Stagger/Stun);
		var damage = 5;
		damage = CoC.player.takeDamage( 5 );
		MainView.outputText( ' (' + damage + ')' );
		if( CoC.player.findPerk( PerkLib.Resolute ) ) {
			MainView.outputText( '  Of course, your resolute posture prevents her from accomplishing much.' );
		} else {
			CoC.player.createStatusAffect( StatusAffects.Stunned, 0, 0, 0, 0 );
		}
		SceneLib.combatScene.combatRoundOver();
	};
	//Attack Three: Harpy Ass Grind GO!;
	Brigid.prototype.BrigidAssGrind = function() {
		MainView.outputText( 'Brigid grins as she approaches you.  She handily deflects a few defensive blows and grabs you by the shoulders.  She forces you onto your knees and before you can blink, has turned around and smashed your face into her ass!  "<i>Mmm, you like that, don\'tcha?</i>" she growls, grinding her huge, soft ass across your face, giving you an up-close and personal feel of her egg-laying hips.' );
		EngineCore.dynStats( 'lus', 30 );
		SceneLib.combatScene.combatRoundOver();
	};
	Brigid.prototype.performCombatAction = function() {
		if( CoC.player.findStatusAffect( StatusAffects.Stunned ) ) {
			CoC.player.removeStatusAffect( StatusAffects.Stunned );
			if( Utils.rand( 2 ) === 0 ) {
				this.BrigidAssGrind();
			} else {
				this.brigidPoke();
			}
			return;
		}
		if( Utils.rand( 3 ) === 0 ) {
			this.BrigidAssGrind();
		} else if( Utils.rand( 2 ) === 0 ) {
			this.brigidBop();
		} else {
			this.brigidPoke();
		}
	};

	Brigid.prototype.defeated = function() {
		SceneLib.brigidScene.pcDefeatsBrigid();
	};
	Brigid.prototype.won = function() {
		SceneLib.brigidScene.pcDefeatedByBrigid();
	};
	Brigid.prototype.init = function( that, args ) {
		Monster.prototype.init( that, args );
		that.classNames.push('Brigid');
		that.a = '';
		that.short = 'Brigid the Jailer';
		that.imageName = 'brigid';
		that.long = 'Brigid is a monster of a harpy, standing a foot taller than any other you\'ve seen. She\'s covered in piercings, and her pink-dyed hair is shaved down to a long mohawk. She\'s nude, save for the hot poker in her right hand and the shield in her left, which jingles with every step she takes thanks to the cell keys beneath it.';
		that.createVagina( false, AppearanceDefs.VAGINA_WETNESS_SLAVERING, AppearanceDefs.VAGINA_LOOSENESS_LOOSE );
		if( AppearanceDefs.LOWER_BODY_TYPE_HARPY > 0 ) {
			that.createStatusAffect( StatusAffects.BonusVCapacity, AppearanceDefs.LOWER_BODY_TYPE_HARPY, 0, 0, 0 );
		}
		that.createBreastRow( Appearance.breastCupInverse( 'D' ) );
		that.ass.analLooseness = AppearanceDefs.ANAL_LOOSENESS_STRETCHED;
		that.ass.analWetness = AppearanceDefs.ANAL_WETNESS_DRY;
		that.tallness = Utils.rand( 8 ) + 70;
		that.hipRating = AppearanceDefs.HIP_RATING_AMPLE + 2;
		that.buttRating = AppearanceDefs.BUTT_RATING_LARGE;
		that.skinTone = 'red';
		that.hairColor = 'black';
		that.hairLength = 15;
		that.initStrTouSpeInte( 90, 60, 120, 40 );
		that.initLibSensCor( 40, 45, 50 );
		that.weaponName = 'poker';
		that.weaponVerb = 'burning stab';
		that.weaponAttack = 30;
		that.armorName = 'armor';
		that.armorDef = 20;
		that.bonusHP = 1000;
		that.lust = 20;
		that.lustVuln = 0.25;
		that.temperment = Monster.TEMPERMENT_LOVE_GRAPPLES;
		that.level = 19;
		that.gems = Utils.rand( 25 ) + 140;
		that.additionalXP = 50;
		that.wingType = AppearanceDefs.WING_TYPE_FEATHERED_LARGE;
		that.tailType = AppearanceDefs.TAIL_TYPE_DEMONIC;
		that.hornType = AppearanceDefs.HORNS_DEMON;
		that.horns = 2;
		that.drop = Monster.NO_DROP;
		that.checkMonster();
	};
	return Brigid;
} );