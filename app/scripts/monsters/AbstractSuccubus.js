'use strict';

angular.module( 'cocjs' ).factory( 'AbstractSuccubus', function( Descriptors, MainView, Appearance, CoC, EngineCore, Monster, Utils, StatusAffects, Combat, PerkLib ) {
	function AbstractSuccubus() {
		this.init(this, arguments);
	}
	angular.extend(AbstractSuccubus.prototype, Monster.prototype);
	AbstractSuccubus.prototype.whipAttack = function() {
		if( this.findStatusAffect( StatusAffects.WhipReady ) >= 0 ) {
			//Blind dodge change;
			if( this.findStatusAffect( StatusAffects.Blind ) >= 0 ) {
				MainView.outputText( this.getCapitalA() + this.short + ' swings her whip at you wildly, totally missing due to her blindness!!', false );
				Combat.combatRoundOver();
				return;
			}
			MainView.outputText( 'Grinning deviously, the succubus cracks her whip with expert skill, landing a painful blow on your ', false );
			var temp = Utils.rand( 6 );
			//Whip yo ass!;
			if( temp === 0 ) {
				MainView.outputText( 'ass (4)', false );
				CoC.player.takeDamage( 4 );
				EngineCore.dynStats( 'lus', 6 + Math.ceil( CoC.player.sens / 20 ) );
			}
			//Whip yo tits!;
			if( temp === 1 ) {
				if( CoC.player.breastRows.length > 0 && CoC.player.biggestTitSize() > 0 ) {
					MainView.outputText( CoC.player.allBreastsDescript() + ' (9)', false );
				} else {
					MainView.outputText( 'chest (9)', false );
				}
				CoC.player.takeDamage( 9 );
				EngineCore.dynStats( 'lus', 4 + Math.ceil( CoC.player.sens / 15 ) );
			}
			//Whip yo groin;
			if( temp === 2 ) {
				if( CoC.player.gender === 0 ) {
					MainView.outputText( 'groin (5)', false );
					CoC.player.takeDamage( 5 );
				}
				if( CoC.player.gender === 1 ) {
					MainView.outputText( 'groin, dealing painful damage to your ' + CoC.player.multiCockDescriptLight() + ', doubling you over in agony (' + Math.ceil( (CoC.player.tou * 2 + 50) / 4 ) + ')', false );
					EngineCore.dynStats( 'lus', -15 );
					CoC.player.takeDamage( Math.ceil( (CoC.player.maxHP()) / 4 ) );
				}
				if( CoC.player.gender === 2 ) {
					MainView.outputText( 'groin, making your ' + Descriptors.vaginaDescript( 0 ) + ' sting with pain (-10)', false );
					CoC.player.takeDamage( 10 );
					EngineCore.dynStats( 'lus', -8 );
				}
				if( CoC.player.gender === 3 ) {
					MainView.outputText( 'groin, dealing painful damage to your ' + CoC.player.multiCockDescriptLight() + ' and ' + CoC.player.vaginaDescript( 0 ) + ', doubling you over in agony (' + Math.ceil( (CoC.player.tou * 2 + 50) / 3 ) + ')', false );
					EngineCore.dynStats( 'lus', -20 );
					CoC.player.takeDamage( Math.ceil( (CoC.player.maxHP()) / 3 ) );
				}
			}
			//Whip yo legs;
			if( temp === 3 ) {
				MainView.outputText( 'legs (7)', false );
				CoC.player.takeDamage( 7 );
			}
			//Whip yo arms;
			if( temp === 4 ) {
				MainView.outputText( 'arms (8)', false );
				CoC.player.takeDamage( 8 );
			}
			//Whip yo neck;
			if( temp === 5 ) {
				MainView.outputText( 'neck (24)', false );
				CoC.player.takeDamage( 24 );
			}
			MainView.outputText( '!', false );
		} else {
			MainView.outputText( 'The succubus flicks her wrist, allowing a whip-like cord to slither out from the palm of her clawed hand.  She cracks the whip experimentally, cackling with glee.', false );
			this.createStatusAffect( StatusAffects.WhipReady, 0, 0, 0, 0 );
			this.str += 20;
			this.weaponName = 'whip';
			this.weaponVerb = 'brutal whip-crack';
		}
		Combat.combatRoundOver();
	};
	AbstractSuccubus.prototype.init = function( that, args ) {
		Monster.prototype.init( that, args );
		that.classNames.push('AbstractSuccubus');
	};
	AbstractSuccubus.prototype.kissAttack = function() {
		//[Kiss of Death Text];
		MainView.outputText( 'The succubus dances forwards, cocking her elbow back for a vicious strike.', false );
		//avoid!;
		if( CoC.player.spe > this.spe && Utils.rand( 4 ) === 0 || (CoC.player.findPerk( PerkLib.Evade ) >= 0 && Utils.rand( 4 ) === 0) || (CoC.player.findPerk( PerkLib.Misdirection ) >= 0 && Utils.rand( 4 ) === 0 && CoC.player.armorName === 'red, high-society bodysuit') ) {
			MainView.outputText( '  You start to sidestep and realize it\'s a feint.   Ducking low, you slide under her real attack... a kiss?!  ', false );
			if( CoC.player.lust >= 70 ) {
				MainView.outputText( '  Maybe you shouldn\'t have bothered to move, it might have been fun.', false );
			}
		}
		//get hit;
		else {
			MainView.outputText( '  You start to dodge to the side, but she shifts direction expertly and plants a wet kiss on your lips.  She spins and dodges away with a ballet dancer\'s grace, leaving you to wonder what just happened.  ', false );
			if( CoC.player.findStatusAffect( StatusAffects.KissOfDeath ) < 0 ) {
				CoC.player.createStatusAffect( StatusAffects.KissOfDeath, 0, 0, 0, 0 );
			}
		}
		Combat.combatRoundOver();
	};
	AbstractSuccubus.prototype.seduceAttack = function() {
		//determine which method of teasing you use;
		var temp = Utils.rand( 3 );
		//Butt slap!;
		if( temp === 0 ) {
			MainView.outputText( this.getCapitalA() + this.short + ' slaps her ' + Appearance.buttDescriptionShort( this ), false );
			if( this.buttRating >= 10 ) {
				MainView.outputText( ', making it jiggle delightfully.', false );
				//85% success rate for the jiggly girls;
				if( Utils.rand( 100 ) <= 95 ) {
					EngineCore.dynStats( 'lus', Utils.rand( this.buttRating ) + 10 );
					MainView.outputText( '\nThe display is quite arousing.', false );
				} else {
					MainView.outputText( '\nYou\'re unimpressed.\n\n', false );
				}
			} else {
				MainView.outputText( '.', false );
				//50%ish chance of success for the tight butted.;
				if( Utils.rand( 100 ) <= (70 + this.buttRating * 2) ) {
					EngineCore.dynStats( 'lus', Utils.rand( this.buttRating ) + 9 );
					MainView.outputText( '\nThe display is quite arousing.', false );
				} else {
					MainView.outputText( '\nYou\'re unimpressed.\n\n', false );
				}
			}
		}
		//Jiggly-tits;
		if( temp === 1 && this.breastRows[ 0 ].breastRating >= 2 ) {
			//Single breast row;
			if( this.breastRows.length === 1 ) {
				//50+ breastsize% success rate;
				MainView.outputText( this.getCapitalA() + this.short + ' caresses some of her ample chest-flesh before shaking it from side to side enticingly.', false );
				if( this.lust >= 50 ) {
					MainView.outputText( '  ' + this.pronoun2 + ' hard nipples seem to demand your attention.', false );
				}
				if( Utils.rand( 100 ) <= (65 + this.biggestTitSize()) ) {
					EngineCore.dynStats( 'lus', Utils.rand( this.breastRows[ 0 ].breastRating ) + this.breastRows.length + 10 );
					MainView.outputText( '\nThe display is quite arousing.', false );
				} else {
					MainView.outputText( '\nYou\'re unimpressed.\n\n', false );
				}
			}
			if( this.breastRows.length > 1 ) {
				//50 + 10% per breastRow + breastSize%;
				MainView.outputText( this.getCapitalA() + this.short + ' caresses ' + this.pronoun2 + ' some of her rows of ample chest-flesh before shaking it all from side to side enticingly.', false );
				if( this.lust >= 50 ) {
					MainView.outputText( ', your ' + Descriptors.nippleDescript( 0 ) + 's painfully visible.', false );
				} else {
					MainView.outputText( '.', false );
				}
				if( Utils.rand( 100 ) <= (54 + (this.breastRows.length - 1) * 15 + this.breastRows[ 0 ].breastRating) ) {
					EngineCore.dynStats( 'lus', Utils.rand( this.breastRows[ 0 ].breastRating ) + this.breastRows.length * this.breastRows[ 0 ].breasts + 5 );
					MainView.outputText( '\nThe display is quite arousing.', false );
				} else {
					MainView.outputText( '\nYou\'re unimpressed.\n\n', false );
				}
			}
		}
		//Genetals flash!;
		if( temp === 2 ) {
			MainView.outputText( this.getCapitalA() + this.short + ' reaches down and strokes her moist lips.  She sighs and licks her fingers clean, giving you a smoldering gaze.', false );
			//Success = 50% + 10% times each cock/vagina;
			if( Utils.rand( 101 ) <= (65 + this.vaginas.length * 10 + this.cocks.length * 10) ) {
				EngineCore.dynStats( 'lus', Utils.rand( this.vaginas.length * 2 + this.cocks.length * 2 ) + 13 );
				MainView.outputText( '\nThe display is quite arousing.', false );
			} else {
				MainView.outputText( '\nYou\'re unimpressed.\n\n', false );
			}
		}
		Combat.combatRoundOver();
	};
	return AbstractSuccubus;
} );