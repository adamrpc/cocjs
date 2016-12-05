'use strict';

angular.module( 'cocjs' ).factory( 'Kelt', function( SceneLib, kFLAGS, CockTypesEnum, StatusAffects, Appearance, CoC, Monster, Utils, AppearanceDefs, Combat, EngineCore ) {
	function Kelt() {
		this.init(this, arguments);
	}
	angular.extend(Kelt.prototype, Monster.prototype);
	//Trample - once every five turns;
	Kelt.prototype.keltTramplesJoo = function() {
		EngineCore.outputText( 'Before you know what\'s what, Kelt is galloping toward you, kicking up a cloud of dust in his wake.  He\'s trying to trample you!  ' );
		//Miss:;
		if( Combat.combatMiss() || Combat.combatEvade() || Combat.combatFlexibility() || Combat.combatMisdirect() ) {
			EngineCore.outputText( 'You roll out of the way at the last moment, avoiding his dangerous hooves.' );
			Combat.combatRoundOver();
			return;
		}
		//Determine damage - str modified by enemy toughness!;
		var damage = Math.round( (this.str + this.weaponAttack) - Utils.rand( CoC.player.tou ) - CoC.player.armorDef );
		if( damage > 0 ) {
			damage = CoC.player.takeDamage( damage );
		}

		//Block:;
		if( damage <= 0 ) {
			EngineCore.outputText( 'Incredibly, you brace yourself and dig in your [feet].  Kelt slams into you, but you grind his momentum to a half.  His mouth flaps uncomprehendingly for a moment before he backs up, flushing from being so close to you.' );
			this.lust += 5;
		}
		//Hit:;
		else {
			EngineCore.outputText( 'You can\'t get out of the way in time, and you\'re knocked down!  Kelt tramples overtop of you!  (' + damage + ')' );
		}
		Combat.combatRoundOver();
	};
	//Arrow Attack;
	Kelt.prototype.keltShootBow = function() {
		this.createStatusAffect( StatusAffects.BowCooldown, 3, 0, 0, 0 );
		EngineCore.outputText( 'Kelt knocks and fires an arrow almost faster than you can track.  He\'s lost none of his talent with a bow, even after everything you\'ve put him through.  ' );
		//Miss:;
		if( Combat.combatMiss() || Combat.combatEvade() || Combat.combatFlexibility() || Combat.combatMisdirect() ) {
			EngineCore.outputText( 'You manage to avoid the missile by the skin of your teeth!' );
			Combat.combatRoundOver();
			return;
		}
		var damage = 0;
		damage = Math.ceil( (20 + this.str / 3 + 100) + this.spe / 3 - Utils.rand( CoC.player.tou ) - CoC.player.armorDef );
		if( damage < 0 ) {
			damage = 0;
		}
		if( damage === 0 ) {
			EngineCore.outputText( 'You deflect the hit, preventing it from damaging you.' );
			Combat.combatRoundOver();
			return;
		}
		//Hit:;
		damage = CoC.player.takeDamage( damage );
		EngineCore.outputText( 'The arrow bites into you before you can react. (' + damage + ')' );
		Combat.combatRoundOver();
	};
	//Aura Arouse;
	Kelt.prototype.KellyuraAttack = function() {
		var select = Utils.rand( 3 );
		//(1);
		if( select === 0 ) {
			EngineCore.outputText( 'Kelt flashes his cockiest smile and gestures downward.  "<i>Did you forget why you\'re here, slut?  Taking me by surprise once doesn\'t make you any less of a whore.</i>"' );
		}
		//(2);
		else if( select === 2 ) {
			EngineCore.outputText( 'Grinning, Kelt runs by, trailing a cloud of his musk and pheremones behind you.  You have to admit, they get you a little hot under the collar...' );
		}
		//(3);
		else {
			EngineCore.outputText( 'Kelt snarls, "<i>Why don\'t you just masturbate like the slut that you are until I come over there and punish you?</i>"  ' );
			if( CoC.player.lust >= 80 ) {
				EngineCore.outputText( 'Your hand moves towards your groin seemingly of its own volition.' );
			} else {
				EngineCore.outputText( 'Your hands twitch towards your groin but you arrest them.  Still, the idea seems to buzz at the back of your brain, exciting you.' );
			}
		}
		EngineCore.dynStats( 'lus', CoC.player.lib / 5 + Utils.rand( 10 ) );
		Combat.combatRoundOver();
	};
	//Attacks as normal + daydream 'attack';
	//DayDream 'Attack';
	Kelt.prototype.dayDreamKelly = function() {
		if( Utils.rand( 2 ) === 0 ) {
			EngineCore.outputText( 'Kelt pauses mid-draw, looking you up and down.  He licks his lips for a few moments before shaking his head to rouse himself from his lusty stupor.  He must miss the taste of your sperm.' );
		} else {
			EngineCore.outputText( 'Flaring \'his\' nostrils, Kelt inhales deeply, his eyelids fluttering closed as he gives a rather lady-like moan.   His hands roam over his stiff nipples, tweaking them slightly before he recovers.' );
		}
		this.lust += 5;
		Combat.combatRoundOver();
	};

	Kelt.prototype.performCombatAction = function() {
		if( this.statusAffectv1( StatusAffects.BowCooldown ) > 0 ) {
			this.addStatusValue( StatusAffects.BowCooldown, 1, -1 );
			if( this.statusAffectv1( StatusAffects.BowCooldown ) <= 0 ) {
				this.removeStatusAffect( StatusAffects.BowCooldown );
			}
		} else {
			if( Utils.rand( 2 ) === 0 && CoC.flags[ kFLAGS.KELT_BREAK_LEVEL ] >= 2 ) {
				this.dayDreamKelly();
			} else {
				this.keltShootBow();
			}
		}
		var select = Utils.rand( 5 );
		if( select <= 1 ) {
			this.eAttack();
		} else if( select <= 3 ) {
			this.KellyuraAttack();
		} else {
			this.keltTramplesJoo();
		}
	};
	Kelt.prototype.defeated = function() {
		if( CoC.flags[ kFLAGS.KELT_BREAK_LEVEL ] === 1 ) {
			SceneLib.kelly.defeatKellyNDBREAKHIM();
		} else {
			SceneLib.kelly.breakingKeltNumeroThree();
		}
	};
	Kelt.prototype.won = function( hpVictory, pcCameWorms ) {
		if( pcCameWorms ) {
			EngineCore.outputText( '\n\nKelt recoils for a moment before assuming a look of superiority...' );
			EngineCore.doNext( Combat.endLustLoss );
		} else {
			SceneLib.kelly.keltFucksShitUp();
		}
	};
	Kelt.prototype.init = function( that, args ) {
		Monster.prototype.init( that, args );
		that.classNames.push('Kelt');
		var breakLevel2 = CoC.flags[ kFLAGS.KELT_BREAK_LEVEL ] === 2;
		that.a = '';
		that.short = 'Kelt';
		that.imageName = 'kelt';
		that.long = 'Kelt has changed for the worse since your first meeting.  Gone is his muscular, barrel chest.  In its place is a softer frame, capped with tiny boobs - remnants of your last treatment.  His jaw is fairly square and chiselled (though less than before).  From the waist down, he has the body of a horse, complete with a fairly large pair of balls and a decent-sized dong.  Both are smaller than they used to be, however.  He has his bow strung and out, clearly intent on defending himself from your less than gentle touches.' + (breakLevel2 ? 'Kelt is looking less and less like the burly centaur from before, and more and more like a woman.  He looks more like an odd, androgynous hybrid than the beautiful woman you had turned him into.  He currently sports roughly B-cup breasts and a smallish, miniature horse-cock.  There\'s barely any hair on his human body, aside from a long mane of hair.  Each treatment seems to be more effective than the last, and you can\'t wait to see what happens after you tame him THIS time.' : '');
		that.createCock( breakLevel2 ? 12 : 24, 3.5, CockTypesEnum.HORSE );
		that.balls = 2;
		that.ballSize = 2 + Utils.rand( 13 );
		that.cumMultiplier = 1.5;
		that.hoursSinceCum = CoC.player.ballSize * 10;
		that.createBreastRow( Appearance.breastCupInverse( breakLevel2 ? 'B' : 'A' ) );
		that.ass.analLooseness = AppearanceDefs.ANAL_LOOSENESS_NORMAL;
		that.ass.analWetness = AppearanceDefs.ANAL_WETNESS_DRY;
		that.createStatusAffect( StatusAffects.BonusACapacity, 50, 0, 0, 0 );
		that.tallness = 84;
		that.hipRating = AppearanceDefs.HIP_RATING_AVERAGE;
		that.buttRating = AppearanceDefs.BUTT_RATING_AVERAGE + 1;
		that.lowerBody = AppearanceDefs.LOWER_BODY_TYPE_CENTAUR;
		that.skinTone = 'tan';
		that.hairColor = Utils.randomChoice( 'black', 'brown' );
		that.hairLength = 3;
		that.initStrTouSpeInte( 60, 70, 40, 20 );
		that.initLibSensCor( 40, 25, 55 );
		that.weaponName = 'fist';
		that.weaponVerb = 'punch';
		that.weaponAttack = 10;
		that.armorName = 'tough skin';
		that.armorDef = 4;
		that.bonusHP = 200;
		that.lust = 40;
		that.lustVuln = 0.83;
		that.temperment = Monster.TEMPERMENT_LUSTY_GRAPPLES;
		that.level = 6;
		that.gems = Utils.rand( 5 ) + 5;
		that.tailType = AppearanceDefs.TAIL_TYPE_HORSE;
		that.drop = Monster.NO_DROP;
		that.checkMonster();
	};
	return Kelt;
} );