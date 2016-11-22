'use strict';

angular.module( 'cocjs' ).factory( 'Jojo', function( $log, EventParser, CoC, Monster, Utils, AppearanceDefs, Combat, EngineCore ) {
	var Jojo = angular.copy( Monster );
	Jojo.prototype.defeated = function( hpVictory ) {
		CoC.getInstance().scenes.jojoScene.defeatedJojo( hpVictory );
	};
	Jojo.prototype.won = function() {
		CoC.getInstance().scenes.jojoScene.loseToJojo();
	};
	Jojo.prototype.performCombatAction = function() {
		if( CoC.getInstance().monk > 1 && Utils.rand( 2 ) === 0 ) {
			this.selfCorruption();
		}//Shouldn't do any self corruption at monk one. Otherwise a 50/50 chance
		else {
			this.eAttack();
		}
	};
	Jojo.prototype.selfCorruption = function() {
		switch( CoC.getInstance().monk ) {
			case 2:
				EngineCore.outputText( 'Jojo looks lost in thought for a moment, and fails to attack.  ' );
				this.lust += 4;
				break;
			case 3:
				EngineCore.outputText( 'Jojo blushes as he fights you, distracted by a stray thought.  You think you see a bulge in the loose cloth of his pants.  ' );
				this.lust += 8;
				break;
			case 4:
				EngineCore.outputText( 'Jojo stumbles, shakes his head, and pulls one of his hands away from the stiff tent in his pants.  ' );
				this.lust += 10;
				break;
			default:
				EngineCore.outputText( 'Jojo frantically jerks his ' + this.cockDescriptShort( 0 ) + ', stroking the ' + this.cockDescriptShort( 0 ) + ' as it leaks pre-cum at the sight of you.  ' );
				this.lust += 15;
		}
		if( this.lust >= 100 ) {
			EngineCore.doNext( Combat.endLustVictory );
			return;
		} else if( this.lust >= 85 ) {
			EngineCore.outputText( 'The mouse is panting and softly whining, each movement seeming to make his bulge more pronounced.  You don\'t think he can hold out much longer.  ' );
		} else if( this.lust >= 70 ) {
			EngineCore.outputText( 'The mouse is having trouble moving due to the rigid protrusion from his groin.  ' );
		} else if( this.lust >= 60 ) {
			EngineCore.outputText( 'The mouse\'s eyes constantly dart over your most sexual parts, betraying his lust.  ' );
		} else if( this.lust > 50 ) {
			EngineCore.outputText( 'The mouse\'s skin remains flushed with the beginnings of arousal.  ' );
		}
		EngineCore.doNext( EventParser.playerMenu );
	};
	Jojo.prototype.init = function( that, args ) {
		Monster.prototype.init( that, args );
		$log.debug( 'Jojo Constructor!' );
		that.a = '';
		that.short = 'Jojo';
		that.imageName = 'jojo';
		that.long = 'Jojo is an anthropomorphic mouse with immaculate white fur.  Though he stands only four feet tall, he is covered in lean muscle and moves with incredible speed.  He wears loose white clothes wrapped in prayer beads and tattered prayer papers.';
		that.createCock( 7.5, 1.8 );
		that.balls = 2;
		that.ballSize = 1;
		that.cumMultiplier = 1;
		that.hoursSinceCum = 1000;
		that.createBreastRow( 0 );
		that.ass.analLooseness = AppearanceDefs.ANAL_LOOSENESS_TIGHT;
		that.ass.analWetness = AppearanceDefs.ANAL_WETNESS_NORMAL;
		that.tallness = 4 * 12;
		that.hipRating = AppearanceDefs.HIP_RATING_SLENDER;
		that.buttRating = AppearanceDefs.BUTT_RATING_TIGHT;
		that.skinTone = 'white';
		that.skinType = AppearanceDefs.SKIN_TYPE_FUR;
		that.skinDesc = 'fur';
		that.hairColor = 'white';
		that.hairLength = 2;
		that.initStrTouSpeInte( 35, 40, 65, 55 );
		that.initLibSensCor( 15, 40, 0 );
		that.weaponName = 'paw';
		that.weaponVerb = 'punch';
		that.armorName = 'robes';
		that.lust = 15;
		that.lustVuln = 0.9;
		that.temperment = Monster.TEMPERMENT_LUSTY_GRAPPLES;
		that.level = 4;
		that.gems = Utils.rand( 5 ) + 2;
		that.special1 = that.selfCorruption;
		//Create jojo sex attributes;
		//Variations based on jojo's corruption.;
		if( CoC.getInstance().monk === 3 ) {
			that.lust += 30;
			that.cocks[ 0 ].cockThickness += 0.2;
			that.cocks[ 0 ].cockLength += 1.5;
			if( CoC.getInstance().player.gender === 1 || CoC.getInstance().player.gender === 3 ) {
				that.ass.analLooseness = 2;
			}
		}
		if( CoC.getInstance().monk === 4 ) {
			that.lust += 40;
			that.cocks[ 0 ].cockThickness += 0.5;
			that.cocks[ 0 ].cockLength += 3.5;
			if( CoC.getInstance().player.gender === 1 || CoC.getInstance().player.gender === 3 ) {
				that.ass.analLooseness = 3;
			}
		}
		if( CoC.getInstance().monk === 5 ) {
			that.lust += 50;
			that.cocks[ 0 ].cockThickness += 1;
			that.cocks[ 0 ].cockLength += 5.5;
			that.str -= 20;
			that.tou += 30;
			that.HP += 60;
			if( CoC.getInstance().player.gender === 1 || CoC.getInstance().player.gender === 3 ) {
				that.ass.analLooseness = 4;
			}
			that.long = 'Jojo is an anthropomorphic mouse with immaculate white fur.  Though he stands only four feet tall, he is covered in lean muscle and moves with incredible speed.  He\'s naked, with a large tainted throbbing member bouncing at attention.  A fuzzy sack with painfully large looking balls dangles between his legs.';
		}
		that.drop = Monster.NO_DROP;
		that.checkMonster();
	};
	return Jojo;
} );