'use strict';

angular.module( 'cocjs' ).factory( 'Satyr', function( SceneLib, MainView, CockTypesEnum, ChainedDrop, ConsumableLib, CoC, EngineCore, Monster, Utils, AppearanceDefs, StatusAffects, Combat, PerkLib ) {
	function Satyr() {
		this.init(this, arguments);
	}
	angular.extend(Satyr.prototype, Monster.prototype);
	//Attacks (Z);
	Satyr.prototype.satyrAttack = function() {
		MainView.outputText( 'The satyr swings at you with one knuckled fist.  ' );
		//Blind dodge change;
		if( this.findStatusAffect( StatusAffects.Blind ) >= 0 && Utils.rand( 3 ) < 1 ) {
			MainView.outputText( this.getCapitalA() + this.short + ' completely misses you with a blind punch!\n', false );
		}
		//Evade: ;
		else if( Combat.combatMiss() || Combat.combatEvade() || Combat.combatFlexibility() || Combat.combatMisdirect() ) {
			MainView.outputText( 'He snarls as you duck his blow and it swishes harmlessly through the air.' );
		} else {
			var damage = Math.ceil( (this.str + this.weaponAttack) - Utils.rand( CoC.player.tou ) );
			if( damage > 0 ) {
				damage = CoC.player.takeDamage( damage );
				MainView.outputText( 'It feels like you just got hit with a wooden club! (' + damage + ')' );
			} else {
				MainView.outputText( 'You successfully block it.' );
			}
		}
		Combat.combatRoundOver();
	};
	Satyr.prototype.satyrBate = function() {
		MainView.outputText( 'He glares at you, panting while his tongue hangs out and begins to masturbate.  You can nearly see his lewd thoughts reflected in his eyes, as beads of pre form on his massive cock and begin sliding down the erect shaft.' );
		//(small Libido based Lust increase, and increase lust);
		EngineCore.dynStats( 'lus', (CoC.player.lib / 5) + 4 );
		this.lust += 5;
		Combat.combatRoundOver();
	};
	Satyr.prototype.satyrCharge = function() {
		MainView.outputText( 'Lowering his horns, the satyr digs his hooves on the ground and begins snorting; he\'s obviously up to something.  ' );
		if( this.findStatusAffect( StatusAffects.Blind ) >= 0 && Utils.rand( 3 ) < 1 ) {
			MainView.outputText( this.getCapitalA() + this.short + ' completely misses you due to blindness!\n', false );
		} else if( Combat.combatMiss() ) {
			MainView.outputText( 'He charges at you with a loud bleat, but you nimbly dodge and strike a vicious blow with your [weapon] in return that sends him crashing into the ground, hollering in pain. (5)' );
			this.HP -= 5;
		} else if( Combat.combatEvade() ) {
			MainView.outputText( 'He charges at you with a loud bleat, but using your evasive skills, you nimbly dodge and strike a vicious blow with your [weapon] in return that sends him crashing into the ground, hollering in pain. (5)' );
			this.HP -= 5;
		} else if( Combat.combatFlexibility() ) {
			MainView.outputText( 'He charges at you with a loud bleat, but using your flexibility, you nimbly dodge and strike a vicious blow with your [weapon] in return that sends him crashing into the ground, hollering in pain. (5)' );
			this.HP -= 5;
		} else if( Combat.combatMisdirect() ) {
			MainView.outputText( 'He charges at you with a loud bleat, but using your misdirecting skills, you nimbly dodge and strike a vicious blow with your [weapon] in return that sends him crashing into the ground, hollering in pain. (5)' );
			this.HP -= 5;
		} else {
			var damage = Math.ceil( (this.str + this.weaponAttack) - Utils.rand( CoC.player.tou ) );
			if( damage > 0 ) {
				damage = CoC.player.takeDamage( damage );
				MainView.outputText( 'He charges at you with a loud bleat, catching you off-guard and sending you flying into the ground.' );
				if( CoC.player.findPerk( PerkLib.Resolute ) < 0 ) {
					MainView.outputText( '  The pain of the impact is so big you feel completely dazed, almost seeing stars.' );
					CoC.player.createStatusAffect( StatusAffects.Stunned, 0, 0, 0, 0 );
				}
				//stun PC + hp damage if hit, hp damage dependent on str if miss;
				MainView.outputText( ' (' + damage + ')' );
			} else {
				MainView.outputText( 'He charges at you, but you successfully deflect it at the last second.' );
			}
		}
		Combat.combatRoundOver();
	};
	Satyr.prototype.bottleChug = function() {
		MainView.outputText( 'He whips a bottle of wine seemingly from nowhere and begins chugging it down, then lets out a bellowing belch towards you.  The smell is so horrible you cover your nose in disgust, yet you feel hot as you inhale some of the fetid scent.' );
		//(damage PC lust very slightly and raise the satyr's lust.);
		EngineCore.dynStats( 'lus', (CoC.player.lib / 5) );
		this.lust += 5;
		Combat.combatRoundOver();
	};
	//5:(Only executed at high lust) ;
	Satyr.prototype.highLustChugRape = function() {
		MainView.outputText( 'Panting with barely-contained lust, the Satyr charges at you and tries to ram you into the ground.  ' );
		if( this.findStatusAffect( StatusAffects.Blind ) >= 0 && Utils.rand( 3 ) < 1 ) {
			MainView.outputText( this.getCapitalA() + this.short + ' completely misses you due to blindness!\n', false );
		} else if( Combat.combatMiss() || Combat.combatFlexibility() || Combat.combatMisdirect() || Combat.combatEvade() ) {
			MainView.outputText( 'As he charges you, you grab him by the horns and spin around, sending him away.' );
		} else {
			MainView.outputText( 'You fall with a <b>THUD</b> and the Satyr doesn\'t even bother to undress you before he begins rubbing his massive cock on your body until he comes, soiling your [armor] and ' + CoC.player.skinFurScales() + ' with slimy, hot cum.  As it rubs into your body, you shiver with unwanted arousal.' );
			//large-ish sensitivity based lust increase if hit.)(This also relieves him of some of his lust, though not completely.);
			this.lust -= 50;
			EngineCore.dynStats( 'lus', (CoC.player.sens / 5 + 20) );
		}
		Combat.combatRoundOver();
	};
	Satyr.prototype.performCombatAction = function() {
		if( this.lust >= 75 && Utils.rand( 2 ) === 0 ) {
			this.highLustChugRape();
		} else if( this.lust < 75 && Utils.rand( 2 ) === 0 ) {
			if( Utils.rand( 2 ) === 0 ) {
				this.satyrBate();
			} else {
				this.bottleChug();
			}
		} else if( this.findStatusAffect( StatusAffects.Charged ) < 0 ) {
			this.satyrCharge();
		} else {
			this.satyrAttack();
			this.removeStatusAffect( StatusAffects.Charged );
		}
	};
	Satyr.prototype.defeated = function() {
		SceneLib.satyrScene.defeatASatyr();
	};

	Satyr.prototype.won = function( hpVictory, pcCameWorms ) {
		if( pcCameWorms ) {
			MainView.outputText( '\n\nThe satyr laughs heartily at your eagerness...' );
			EngineCore.doNext( Combat, Combat.endLustLoss );
		} else {
			SceneLib.satyrScene.loseToSatyr();
		}
	};
	Satyr.prototype.init = function( that, args ) {
		Monster.prototype.init( that, args );
		that.classNames.push('Satyr');
		that.a = 'a ';
		that.short = 'satyr';
		that.imageName = 'satyr';
		that.long = 'From the waist up, your opponent is perfectly human, save his curling, goat-like horns and his pointed, elven ears.  His muscular chest is bare and glistening with sweat, while his coarsely rugged, masculine features are contorted into an expression of savage lust.  Looking at his waist, you notice he has a bit of a potbelly, no doubt the fruits of heavy drinking, judging by the almost overwhelming smell of booze and sex that emanates from him.  Further down you see his legs are the coarse, bristly-furred legs of a bipedal goat, cloven hooves pawing the ground impatiently, sizable manhood swaying freely in the breeze.';
		that.createCock( Utils.rand( 13 ) + 14, 1.5 + Utils.rand( 20 ) / 2, CockTypesEnum.HUMAN );
		that.balls = 2;
		that.ballSize = 2 + Utils.rand( 13 );
		that.cumMultiplier = 1.5;
		that.hoursSinceCum = this.ballSize * 10;
		that.createBreastRow( 0 );
		that.ass.analLooseness = AppearanceDefs.ANAL_LOOSENESS_STRETCHED;
		that.ass.analWetness = AppearanceDefs.ANAL_WETNESS_NORMAL;
		that.createStatusAffect( StatusAffects.BonusACapacity, 20, 0, 0, 0 );
		that.tallness = Utils.rand( 37 ) + 64;
		that.hipRating = AppearanceDefs.HIP_RATING_AVERAGE;
		that.buttRating = AppearanceDefs.BUTT_RATING_AVERAGE + 1;
		that.lowerBody = AppearanceDefs.LOWER_BODY_TYPE_HOOFED;
		that.skinTone = 'tan';
		that.hairColor = Utils.randomChoice( 'black', 'brown' );
		that.hairLength = 3 + Utils.rand( 20 );
		that.faceType = AppearanceDefs.FACE_COW_MINOTAUR;
		that.initStrTouSpeInte( 75, 70, 110, 70 );
		that.initLibSensCor( 60, 35, 45 );
		that.weaponName = 'fist';
		that.weaponVerb = 'punch';
		that.armorName = 'thick fur';
		that.bonusHP = 300;
		that.lust = 20;
		that.lustVuln = 0.30;
		that.temperment = Monster.TEMPERMENT_LUSTY_GRAPPLES;
		that.level = 14;
		that.gems = Utils.rand( 25 ) + 25;
		that.drop = new ChainedDrop().add( ConsumableLib.INCUBID, 1 / 2 );
		that.tailType = AppearanceDefs.TAIL_TYPE_COW;
		that.checkMonster();
	};
	return Satyr;
} );