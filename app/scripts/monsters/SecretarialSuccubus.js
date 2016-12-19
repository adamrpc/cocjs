'use strict';

angular.module( 'cocjs' ).factory( 'SecretarialSuccubus', function( SceneLib, MainView, AbstractSuccubus, Appearance, WeightedDrop, CoC, EngineCore, Utils, AppearanceDefs, Monster, Combat, StatusAffects, ConsumableLib ) {
	function SecretarialSuccubus() {
		this.init(this, arguments);
	}
	angular.extend(SecretarialSuccubus.prototype, AbstractSuccubus.prototype);
	SecretarialSuccubus.prototype.defeated = function( hpVictory ) {
		if( CoC.player.gender > 0 ) {
			var dildo = (CoC.player.hasKeyItem( 'Deluxe Dildo' ) >= 0 ? SceneLib.dungeonCore.succubusGetsDildoed : null);
			if( hpVictory ) {
				MainView.outputText( 'You smile in satisfaction as the ' + this.short + ' collapses, unable to continue fighting.  Now would be the perfect opportunity to taste the fruits of her sex-ready form...\n\nDo you rape her?', true );
				EngineCore.dynStats( 'lus', 1 );
				EngineCore.choices( 'Yes', SceneLib.dungeonCore, SceneLib.dungeonCore.succubusVictoryRape, 'Dildo Rape', SceneLib.dungeonCore, dildo, '', null, null, '', null, null, 'No', null, Combat.cleanupAfterCombat );
			} else if( CoC.player.lust >= 33 ) {
				MainView.outputText( 'You smile in satisfaction as the ' + this.short + ' gives up on fighting you and starts masturbating, begging for you to fuck her.  Now would be the perfect opportunity to taste the fruits of her sex-ready form...\n\nDo you fuck her?', true );
				EngineCore.dynStats( 'lus', 1 );
				EngineCore.choices( 'Yes', SceneLib.dungeonCore, SceneLib.dungeonCore.succubusVictoryRape, 'Dildo Rape', SceneLib.dungeonCore, dildo, '', null, null, '', null, null, 'No', null, Combat.cleanupAfterCombat );
			} else {
				Combat.finishCombat();
			}
		} else {
			Combat.finishCombat();
		}
	};
	SecretarialSuccubus.prototype.won = function( hpVictory, pcCameWorms ) {
		if( pcCameWorms ) {
			MainView.outputText( '\n\nYour foe doesn\'t seem to care...' );
			EngineCore.doNext( Combat, Combat.endLustLoss );
		} else {
			SceneLib.dungeonCore.succubusLossRape();
		}
	};
	SecretarialSuccubus.prototype.init = function( that, args ) {
		AbstractSuccubus.prototype.init( that, args );
		that.classNames.push('SecretarialSuccubus');
		this.a = 'the ';
		that.short = 'secretarial succubus';
		that.imageName = 'secretarialsuccubus';
		that.long = 'The succubus across from you balances gracefully on her spiked heels, twirling and moving unpredictably.  Sexy dark stockings hug every curve of her perfectly shaped flesh until they disappear into her tiny miniskirt.  Her impressive breasts wobble delightfully as she moves, despite the inadequate efforts of her straining vest.  A pair of foot-long horns curve up from her otherwise perfect face and forehead, wreathed in lustrous blonde hair.  The very air around her is filled with an unidentifiable fragrance that makes you tingle and shiver.';
		that.createVagina( false, AppearanceDefs.VAGINA_WETNESS_SLAVERING, AppearanceDefs.VAGINA_LOOSENESS_NORMAL );
		that.createStatusAffect( StatusAffects.BonusVCapacity, 30, 0, 0, 0 );
		that.createBreastRow( Appearance.breastCupInverse( 'DD' ) );
		that.ass.analLooseness = AppearanceDefs.ANAL_LOOSENESS_STRETCHED;
		that.ass.analWetness = AppearanceDefs.ANAL_WETNESS_SLIME_DROOLING;
		that.tallness = Utils.rand( 9 ) + 60;
		that.hipRating = AppearanceDefs.HIP_RATING_CURVY;
		that.buttRating = AppearanceDefs.BUTT_RATING_LARGE + 1;
		that.lowerBody = AppearanceDefs.LOWER_BODY_TYPE_DEMONIC_HIGH_HEELS;
		that.skinTone = 'blue';
		that.hairColor = 'blond';
		that.hairLength = 13;
		that.initStrTouSpeInte( 50, 40, 75, 35 );
		that.initLibSensCor( 80, 70, 80 );
		that.weaponName = 'claws';
		that.weaponVerb = 'slap';
		that.weaponAttack = 10;
		that.weaponPerk = '';
		that.weaponValue = 150;
		that.armorName = 'demonic skin';
		that.armorDef = 4;
		that.bonusHP = 100;
		that.lust = 30;
		that.temperment = Monster.TEMPERMENT_LOVE_GRAPPLES;
		that.level = 7;
		that.gems = Utils.rand( 25 ) + 10;
		that.additionalXP = 50;
		that.drop = new WeightedDrop( ConsumableLib.LACTAID, 1 );
		that.wingType = AppearanceDefs.WING_TYPE_BAT_LIKE_TINY;
		that.wingDesc = 'tiny hidden';
		that.tailType = AppearanceDefs.TAIL_TYPE_DEMONIC;
		that.special1 = that.kissAttack;
		that.special2 = that.seduceAttack;
		that.special3 = that.whipAttack;
		that.checkMonster();
	};
	return SecretarialSuccubus;
} );