'use strict';

angular.module( 'cocjs' ).factory( 'Anemone', function( SceneLib, CockTypesEnum, WeightedDrop, ConsumableLib, MainView, CoC, Monster, Utils, StatusAffects, Appearance, AppearanceDefs, Combat, EngineCore ) {
	function Anemone() {
		this.init(this, arguments);
	}
	angular.extend(Anemone.prototype, Monster.prototype);
	Anemone.prototype._superEAttack = Anemone.prototype.eAttack;
	Anemone.prototype.eAttack = function() {
		EngineCore.outputText( 'Giggling playfully, the anemone launches several tentacles at you.  Most are aimed for your crotch, but a few attempt to caress your chest and face.\n', false );
		this._superEAttack();
	};
	Anemone.prototype.eOneAttack = function() {
		this.applyVenom( Utils.rand( 4 + CoC.getInstance().player.sens / 20 ) + 1 );
		return 1;
	};
	//Apply the effects of AnemoneVenom();
	Anemone.prototype.applyVenom = function( str ) {
		if( str === undefined ) {
			str = 1;
		}
		//First application;
		if( CoC.getInstance().player.findStatusAffect( StatusAffects.AnemoneVenom ) < 0 ) {
			CoC.getInstance().player.createStatusAffect( StatusAffects.AnemoneVenom, 0, 0, 0, 0 );
		}
		//Gain some lust;
		EngineCore.dynStats( 'lus', (2 * str) );
		//Loop through applying 1 point of venom at a time.;
		while( str > 0 ) {
			str--;
			//Str bottommed out, convert to lust;
			if( CoC.getInstance().player.str < 2 ) {
				EngineCore.dynStats( 'lus', 2 );
			}
			//Lose a point of str.;
			else {
				MainView.statsView.showStatDown( 'str' );
				CoC.getInstance().player.str--;
				CoC.getInstance().player.addStatusValue( StatusAffects.AnemoneVenom, 1, 1 );
			}
			//Spe bottomed out, convert to lust;
			if( CoC.getInstance().player.spe < 2 ) {
				EngineCore.dynStats( 'lus', 2 );
			}
			//Lose a point of spe.;
			else {
				MainView.statsView.showStatDown( 'spe' );
				CoC.getInstance().player.spe--;
				CoC.getInstance().player.addStatusValue( StatusAffects.AnemoneVenom, 2, 1 );
			}
		}
		EngineCore.statScreenRefresh();
	};

	Anemone.prototype.defeated = function() {
		SceneLib.anemoneScene.defeatAnemone();
	};
	Anemone.prototype.won = function( hpVictory, pcCameWorms ) {
		if( pcCameWorms ) {
			EngineCore.outputText( '\n\nYour foe doesn\'t seem to mind at all...' );
			EngineCore.doNext( Combat.endLustLoss );
		} else {
			SceneLib.anemoneScene.loseToAnemone();
		}
	};
	Anemone.prototype.outputAttack = function() {
		EngineCore.outputText( 'You jink and dodge valiantly but the tentacles are too numerous and coming from too many directions.  A few get past your guard and caress your skin, leaving a tingling, warm sensation that arouses you further.', false );
	};
	Anemone.prototype.init = function( that, args ) {
		Monster.prototype.init( that, args );
		that.a = 'the ';
		that.short = 'anemone';
		that.imageName = 'anemone';
		that.long = 'The anemone is a blue androgyne humanoid of medium height and slender build, with colorful tentacles sprouting on her head where hair would otherwise be.  Her feminine face contains two eyes of solid color, lighter than her skin.  Two feathery gills sprout from the middle of her chest, along the line of her spine and below her collarbone, and drape over her pair of small B-cup breasts.  Though you wouldn\'t describe her curves as generous, she sways her girly hips back and forth in a way that contrasts them to her slim waist quite attractively.  Protruding from her groin is a blue shaft with its head flanged by diminutive tentacles, and below that is a dark-blue pussy ringed by small feelers.  Further down are a pair of legs ending in flat sticky feet; proof of her aquatic heritage.  She smiles broadly and innocently as she regards you from her deep eyes.';
		that.createCock( 7, 1, CockTypesEnum.ANEMONE );
		that.createVagina( false, AppearanceDefs.VAGINA_WETNESS_SLICK, AppearanceDefs.VAGINA_LOOSENESS_LOOSE );
		that.createStatusAffect( StatusAffects.BonusVCapacity, 5, 0, 0, 0 );
		that.createBreastRow( Appearance.breastCupInverse( 'B' ) );
		that.ass.analLooseness = AppearanceDefs.ANAL_LOOSENESS_NORMAL;
		that.ass.analWetness = AppearanceDefs.ANAL_WETNESS_DRY;
		that.createStatusAffect( StatusAffects.BonusACapacity, 10, 0, 0, 0 );
		that.tallness = 5 * 12 + 5;
		that.hipRating = AppearanceDefs.HIP_RATING_CURVY;
		that.buttRating = AppearanceDefs.BUTT_RATING_NOTICEABLE;
		that.skinTone = 'purple';
		that.hairColor = 'purplish-black';
		that.hairLength = 20;
		that.hairType = AppearanceDefs.HAIR_ANEMONE;
		that.initStrTouSpeInte( 40, 20, 40, 50 );
		that.initLibSensCor( 55, 35, 50 );
		that.weaponName = 'tendrils';
		that.weaponVerb = 'tentacle';
		that.weaponAttack = 5;
		that.armorName = 'clammy skin';
		that.bonusHP = 120;
		that.lust = 30;
		that.lustVuln = 0.9;
		that.temperment = Monster.TEMPERMENT_RANDOM_GRAPPLES;
		that.level = 4;
		that.gems = Utils.rand( 5 ) + 1;
		that.drop = new WeightedDrop( ConsumableLib.DRYTENT, 1 );
		that.checkMonster();
	};
	return Anemone;
} );