'use strict';

angular.module( 'cocjs' ).factory( 'Minotaur', function( SceneLib, $log, CoC, EngineCore, Appearance, ChainedDrop, CockTypesEnum, Monster, Utils, WeightedDrop, AppearanceDefs, StatusAffects, Combat, ConsumableLib ) {
	function Minotaur() {
		this.init(this, arguments);
	}
	angular.extend(Minotaur.prototype, Monster.prototype);

	Minotaur.prototype.defeated = function() {
		if( this.findStatusAffect( StatusAffects.PhyllaFight ) >= 0 ) {
			this.removeStatusAffect( StatusAffects.PhyllaFight );
			EngineCore.outputText( 'You defeat a minotaur!  ', true );
			SceneLib.antsScene.phyllaBeatAMino();
		} else {
			SceneLib.minotaurScene.minoVictoryRapeChoices();
		}
	};
	Minotaur.prototype.won = function( hpVictory, pcCameWorms ) {
		if( this.findStatusAffect( StatusAffects.PhyllaFight ) >= 0 ) {
			this.removeStatusAffect( StatusAffects.PhyllaFight );
			SceneLib.antsScene.phyllaPCLostToMino();
		} else if( pcCameWorms ) {
			EngineCore.outputText( '\n\nThe minotaur picks you up and forcibly tosses you from his cave, grunting in displeasure.', false );
			Combat.cleanupAfterCombat();
		} else {
			SceneLib.minotaurScene.getRapedByMinotaur();
		}
	};
	Minotaur.prototype.init = function( that, args ) {
		Monster.prototype.init( that, args );
		that.classNames.push('Minotaur');
		//Most times they dont have an axe
		that.hasAxe = args[ 0 ] || Utils.rand( 3 ) === 0;
		var furColor = Utils.randomChoice( 'black', 'brown' );
		$log.debug( 'Minotaur Constructor!' );
		$log.debug( CoC.flags );
		that.a = 'the ';
		that.short = 'minotaur';
		that.imageName = 'minotaur';
		that.long = '';
		that.createCock( Utils.rand( 13 ) + 24, 2 + Utils.rand( 3 ), CockTypesEnum.HORSE );
		that.balls = 2;
		that.ballSize = 2 + Utils.rand( 13 );
		that.cumMultiplier = 1.5;
		that.hoursSinceCum = that.ballSize * 10;
		that.createBreastRow( 0 );
		that.ass.analLooseness = AppearanceDefs.ANAL_LOOSENESS_STRETCHED;
		that.ass.analWetness = AppearanceDefs.ANAL_WETNESS_NORMAL;
		that.createStatusAffect( StatusAffects.BonusACapacity, 30, 0, 0, 0 );
		that.tallness = Utils.rand( 37 ) + 84;
		that.hipRating = AppearanceDefs.HIP_RATING_AVERAGE;
		that.buttRating = AppearanceDefs.BUTT_RATING_AVERAGE;
		that.lowerBody = AppearanceDefs.LOWER_BODY_TYPE_HOOFED;
		that.skinTone = furColor;
		that.skinType = AppearanceDefs.SKIN_TYPE_FUR;
		that.skinDesc = 'shaggy fur';
		that.hairColor = furColor;
		that.hairLength = 3;
		that.initStrTouSpeInte( that.hasAxe ? 75 : 50, 60, 30, 20 );
		that.initLibSensCor( 40 + that.ballSize * 2, 15 + that.ballSize * 2, 35 );
		that.faceType = AppearanceDefs.FACE_COW_MINOTAUR;
		that.weaponName = that.hasAxe ? 'axe' : 'fist';
		that.weaponVerb = that.hasAxe ? 'cleave' : 'punch';
		that.armorName = 'thick fur';
		that.bonusHP = 20 + Utils.rand( that.ballSize * 2 );
		that.lust = that.ballSize * 3;
		that.lustVuln = that.hasAxe ? 0.84 : 0.87;
		that.temperment = Monster.TEMPERMENT_LUSTY_GRAPPLES;
		that.level = that.hasAxe ? 6 : 5;
		that.gems = Utils.rand( 5 ) + 5;
		if( that.hasAxe ) {
			that.drop = new WeightedDrop( ConsumableLib.MINOBLO, 1 );
		} else {
			that.drop = new ChainedDrop().add( ConsumableLib.MINOCUM, 1 / 5 )
				.add( ConsumableLib.MINOBLO, 1 / 2 )
				.elseDrop( null );
		}
		that.special1 = SceneLib.minotaurScene.minoPheromones;
		that.tailType = AppearanceDefs.TAIL_TYPE_COW;
		that.checkMonster();
	};
	var MinotaurProxy = new Proxy( Minotaur, {
		construct: function( target ) {
			return new Proxy( new target(), {
				get: function( target, name ) {
					if(_.has(target.prototype, name)) {
						return target.prototype[name];
					}
					if( name === 'long' ) {
						return 'An angry-looking minotaur looms over you.  Covered in shaggy ' + target.hairColor + ' fur, the beast is an imposing sight.  Wearing little but an obviously distended loincloth, he is clearly already plotting his method of punishment.  Like most minotaurs he has hooves, a cow-like tail and face, prominent horns, and impressive musculature. ' +
							(target.ballSize > 4 ? ('  Barely visible below the tattered shreds of loincloth are ' + Appearance.ballsDescription( true, true, target ) + ', swollen with the minotaur\'s long pent-up need.') : '') +
							(target.hasAxe ? '<b>This minotaur seems to have found a deadly looking axe somewhere!</b>' : '');
					}
					return target[ name ];
				},
				set: function( target, name, value ) {
					target[ name ] = value;
					return true;
				}
			} );
		}
	} );
	return MinotaurProxy;
} );