'use strict';

angular.module( 'cocjs' ).factory( 'OmnibusOverseer', function( SceneLib, PerkLib, Appearance, WeightedDrop, CoC, EngineCore, Utils, AppearanceDefs, Monster, Combat, Descriptors, StatusAffects ) {
	function OmnibusOverseer() {
		this.init(this, arguments);
	}
	angular.extend(OmnibusOverseer.prototype, Monster.prototype);
	OmnibusOverseer.prototype.defeated = function() {
		SceneLib.dungeonCore.omnibusVictoryEvent();
	};
	OmnibusOverseer.prototype.won = function( hpVictory, pcCameWorms ) {
		if( pcCameWorms ) {
			EngineCore.outputText( '\n\nYour foe doesn\'t seem to care...' );
			EngineCore.doNext( Combat.endLustLoss );
		} else {
			SceneLib.dungeonCore.omnibusLossRape();
		}
	};
	OmnibusOverseer.prototype.lustAura = function() {
		EngineCore.outputText( 'The demoness blinks her eyes closed and knits her eyebrows in concentration.  The red orbs open wide and she smiles, licking her lips.   The air around her grows warmer, and muskier, as if her presence has saturated it with lust.' );
		if( this.findStatusAffect( StatusAffects.LustAura ) >= 0 ) {
			EngineCore.outputText( '  Your eyes cross with unexpected feelings as the taste of desire in the air worms its way into you.  The intense aura quickly subsides, but it\'s already done its job.' );
			EngineCore.dynStats( 'lus', (8 + Math.ceil( CoC.player.lib / 20 + CoC.player.cor / 25 )) );
		} else {
			this.createStatusAffect( StatusAffects.LustAura, 0, 0, 0, 0 );
		}
		Combat.combatRoundOver();
	};
	OmnibusOverseer.prototype.milkAttack = function() {
		if( Utils.rand( 2 ) === 0 ) {
			EngineCore.outputText( 'The demoness grips her sizable breasts and squeezes, spraying milk at you.\n' );
		} else {
			EngineCore.outputText( 'Your foe curls up to pinch her nipples, tugging hard and squirting milk towards you.\n' );
		}
		if( (CoC.player.spe > 50 && Utils.rand( 4 ) === 0) || (CoC.player.findPerk( PerkLib.Evade ) >= 0 && Utils.rand( 3 ) === 0) || (CoC.player.findPerk( PerkLib.Misdirection ) >= 0 && Utils.rand( 4 ) === 0 && CoC.player.armorName === 'red, high-society bodysuit') ) {
			EngineCore.outputText( 'You sidestep the gushing fluids.' );
		}
		//You didn't dodge;
		else {
			if( Utils.rand( 2 ) === 0 ) {
				EngineCore.outputText( 'The milk splatters across your face and chest, soaking you with demonic cream.  Some managed to get into your mouth, and you swallow without thinking.  It makes you tingle with warmth.  ' );
			} else {
				EngineCore.outputText( 'The milk splashes into your ' + CoC.player.armorName + ', soaking you effectively.  ' );
				if( CoC.player.cocks.length > 0 ) {
					EngineCore.outputText( 'Your ' + Descriptors.cockDescript( 0 ) + ' gets hard as the milk lubricates and stimulates it.  ' );
					EngineCore.dynStats( 'lus', 5 );
				}
				if( CoC.player.vaginas.length > 0 ) {
					EngineCore.outputText( 'You rub your thighs together as the milk slides between your pussy lips, stimulating you far more than it should.  ' );
					EngineCore.dynStats( 'lus', 5 );
				}
			}
			EngineCore.dynStats( 'lus', 7 + CoC.player.sens / 20 );
			if( CoC.player.biggestLactation() > 1 ) {
				EngineCore.outputText( 'Milk dribbles from your ' + Descriptors.allBreastsDescript() + ' in sympathy.' );
			}
		}
		Combat.combatRoundOver();
	};
	OmnibusOverseer.prototype.init = function( that, args ) {
		Monster.prototype.init( that, args );
		that.a = 'the ';
		that.short = 'Omnibus Overseer';
		that.imageName = 'omnibusoverseer';
		that.long = 'The \'woman\' before you is clothed only in a single strip of fabric that wraps around her bountiful chest.  She has striking red eyes that contrast visibly with her blue skin and dark make-up.  Shiny black gloss encapsulates her kissable bubbly black lips.  Her most striking feature is her crotch, which appears neither male nor female.  She has a puffy wet vulva, but a cock-shaped protrusion sprouts from where a clit should be.';
		that.createCock( 10, 1.5 );
		that.balls = 0;
		that.ballSize = 0;
		that.cumMultiplier = 3;
		that.createVagina( false, AppearanceDefs.VAGINA_WETNESS_DROOLING, AppearanceDefs.VAGINA_LOOSENESS_NORMAL );
		that.createBreastRow( Appearance.breastCupInverse( 'DD' ) );
		that.ass.analLooseness = AppearanceDefs.ANAL_LOOSENESS_TIGHT;
		that.ass.analWetness = AppearanceDefs.ANAL_WETNESS_SLIME_DROOLING;
		that.tallness = Utils.rand( 9 ) + 70;
		that.hipRating = AppearanceDefs.HIP_RATING_AMPLE + 2;
		that.buttRating = AppearanceDefs.BUTT_RATING_TIGHT;
		that.lowerBody = AppearanceDefs.LOWER_BODY_TYPE_DEMONIC_HIGH_HEELS;
		that.skinTone = 'light purple';
		that.hairColor = 'purple';
		that.hairLength = 42;
		that.initStrTouSpeInte( 65, 45, 45, 85 );
		that.initLibSensCor( 80, 70, 80 );
		that.weaponName = 'claws';
		that.weaponVerb = 'claw';
		that.weaponAttack = 10;
		that.weaponPerk = '';
		that.weaponValue = 150;
		that.armorName = 'demonic skin';
		that.armorDef = 15;
		that.bonusHP = 200;
		that.lust = 20;
		that.lustVuln = 0.75;
		that.temperment = Monster.TEMPERMENT_LOVE_GRAPPLES;
		that.level = 8;
		that.gems = Utils.rand( 25 ) + 10;
		that.drop = new WeightedDrop( null, 1 );
		that.special1 = that.lustAura;
		that.special2 = that.milkAttack;
		that.wingType = AppearanceDefs.WING_TYPE_BAT_LIKE_TINY;
		that.wingDesc = 'tiny hidden';
		that.tailType = AppearanceDefs.TAIL_TYPE_DEMONIC;
		that.checkMonster();
	};
	return OmnibusOverseer;
} );