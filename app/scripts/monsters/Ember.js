'use strict';

angular.module( 'cocjs' ).factory( 'Ember', function( kFLAGS, CockTypesEnum, PerkLib, CoC, Monster, Utils, StatusAffects, Appearance, AppearanceDefs, Combat, EngineCore ) {
	var Ember = angular.copy( Monster );
	Ember.prototype.emberMF = function( male, female ) {
		return CoC.getInstance().scenes.emberScene.emberMF( male, female );
	};
	//The Actual Ember Fight (Z);
	//PC can't use any sexual moves in this battle. This means anything that deals or affects Ember's lust in any way.;
	//It doesn't make sense to affect Ember's lust due to the nature of the combat, however it IS possible and encouraged to use lust moves when fighting Bimbo or Corrupt Ember.;
	//PC shouldn't lose their turn for doing this, unless you want to penalize them Fen.;
	Ember.prototype.emberReactsToLustiness = function() {
		//(if PC uses any attack designed to increase Ember's lust);
		EngineCore.outputText( 'The dragon moans, weaving softly from side to side, eyes glazed and tongue lolling at the intimate prospect of sex... but then, to your surprise, ' + this.emberMF( 'he', 'she' ) + ' visibly shakes it off and recomposes ' + this.emberMF( 'him', 'her' ) + 'self, frowning at you.' );
		EngineCore.outputText( '\n\n"<i>W-what do you think you\'re doing!?  I\'m not some ordinary monster!  Don\'t think you can seduce me out of a battle!</i>"' );
		EngineCore.outputText( '\n\nDespite Ember\'s initial display; you realize that, Ember was still a ways from ' + this.emberMF( 'his', 'her' ) + ' peak arousal.  The dragon flies off in a huff, irritated that you would stoop to fighting in a such a manner.' );
		if( CoC.getInstance().player.lib >= 50 ) {
			EngineCore.outputText( '  How boring.' );
		}
		this.gems = 0;
		this.XP = 0;
		this.HP = 0;
		Combat.cleanupAfterCombat();
	};
	//Ember Attacks:;
	Ember.prototype.emberAttack = function() {
		//Basic attack, average damage, average accuracy;
		EngineCore.outputText( 'With a growl, the dragon lashes out in a ferocious splay-fingered slash, ' + this.emberMF( 'his', 'her' ) + ' claws poised to rip into your flesh.  ' );
		//Blind dodge change;
		if( this.findStatusAffect( StatusAffects.Blind ) >= 0 && Utils.rand( 2 ) === 0 ) {
			EngineCore.outputText( this.getCapitalA() + this.short + ' completely misses you with a blind attack!', false );
		}
		//Miss/dodge;
		else if( Combat.combatMiss() || Combat.combatEvade() || Combat.combatFlexibility() || Combat.combatMisdirect() ) {
			EngineCore.outputText( 'You dodge aside at the last second and Ember\'s claws whistle past you.' );
		} else {
			var damage = Math.ceil( (this.str + this.weaponAttack) - Utils.rand( CoC.getInstance().player.tou ) - CoC.getInstance().player.armorDef );
			if( damage <= 0 ) {
				EngineCore.outputText( 'Ember\'s claws scrape noisily but harmlessly off your [armor].' );
			} else {
				damage = CoC.getInstance().player.takeDamage( damage );
				EngineCore.outputText( 'Ember\'s claws rip into you, leaving stinging wounds.' );
				EngineCore.outputText( ' (' + damage + ')' );
			}
		}
		Combat.combatRoundOver();
	};
	//Dragon Breath: Very rare attack, very high damage;
	Ember.prototype.embersSupahSpecialDragonBreath = function() {
		if( this.findStatusAffect( StatusAffects.Blind ) >= 0 && Utils.rand( 2 ) === 0 ) {
			//Blind Ember: ;
			EngineCore.outputText( 'The blinded dragon tracks you with difficulty as you sprint around the landscape; seeing an opportunity, you strafe around ' + this.emberMF( 'his', 'her' ) + ' side, planting yourself behind a large flat boulder near ' + this.emberMF( 'him', 'her' ) + ' and pelting ' + this.emberMF( 'him', 'her' ) + ' with a small rock.  The scream as the dragon turns the magical conflagration toward you, only to have it hit the rock and blow up in ' + this.emberMF( 'his', 'her' ) + ' face, is quite satisfying.' );
			//(Ember HP damage);
			Combat.doDamage( 50 );
		} else {
			EngineCore.outputText( 'Ember inhales deeply, then ' + this.emberMF( 'his', 'her' ) + ' jaws open up, releasing streams of fire, ice and lightning; magical rather than physical, the gaudy displays lose cohesion and amalgamate into a column of raw energy as they fly at you.' );
			if( Combat.combatMiss() || Combat.combatEvade() || Combat.combatFlexibility() || Combat.combatMisdirect() ) {
				EngineCore.outputText( '  It\'s a narrow thing, but you manage to throw yourself aside at the last moment.  Fortunately, the energy whirling around and tearing up the soil blinds Ember to your escape until you have recovered and are ready to keep fighting.' );
			} else {
				EngineCore.outputText( '  The pain as the deadly combination washes over you is indescribable.  It\'s a miracle that you endure it, and even Ember looks amazed to see you still standing.' );
				var damage = 100 + Utils.rand( 100 );
				damage = CoC.getInstance().player.takeDamage( damage );
				EngineCore.outputText( ' (' + damage + ')' );
			}
		}
		Combat.combatRoundOver();
	};
	//Tailslap: Rare attack, high damage, low accuracy;
	Ember.prototype.emberTailSlap = function() {
		//Blind dodge change;
		if( this.findStatusAffect( StatusAffects.Blind ) >= 0 ) {
			EngineCore.outputText( this.getCapitalA() + this.short + ' completely misses you with a blind tail-slap!', false );
			Combat.combatRoundOver();
			return;
		}
		EngineCore.outputText( 'Ember suddenly spins on ' + this.emberMF( 'his', 'her' ) + ' heel, the long tail that splays behind ' + this.emberMF( 'him', 'her' ) + ' lashing out like a whip.  As it hurtles through the air towards you, your attention focuses on the set of spikes suddenly protruding from its tip!' );
		if( Combat.combatMiss() || Combat.combatEvade() || Combat.combatFlexibility() || Combat.combatMisdirect() || Utils.rand( 2 ) === 0 ) {
			EngineCore.outputText( '  You ' );
			if( Utils.rand( 2 ) === 0 ) {
				EngineCore.outputText( 'duck under' );
			} else {
				EngineCore.outputText( 'leap over' );
			}
			EngineCore.outputText( ' the tail at the last moment, causing Ember to lose control of ' + this.emberMF( 'his', 'her' ) + ' own momentum and stumble.' );
		} else {
			var damage = Math.ceil( (this.str + this.weaponAttack + 100) - Utils.rand( CoC.getInstance().player.tou ) - CoC.getInstance().player.armorDef );
			EngineCore.outputText( '  The tail slams into you with bone-cracking force, knocking you heavily to the ground even as the spines jab you wickedly.  You gasp for breath in pain and shock, but manage to struggle to your feet again.' );
			damage = CoC.getInstance().player.takeDamage( damage );
			EngineCore.outputText( ' (' + damage + ')' );
		}
		Combat.combatRoundOver();
	};
	//Dragon Force: Tainted Ember only;
	Ember.prototype.dragonFarce = function() {
		//Effect: Stuns the PC for one turn and deals some damage, not much though. (Note: PC's version of this does something different and Ember has no cooldown to use this again. Obviously do not spam or peeps will rage.);
		//Description:;
		EngineCore.outputText( 'Ember bares ' + this.emberMF( 'his', 'her' ) + ' teeth and releases a deafening roar; a concussive blast of force heads straight for you!' );
		EngineCore.outputText( '  Try as you might, you can\'t seem to protect yourself; and the blast hits you like a stone, throwing you to the ground.' );
		if( CoC.getInstance().player.findPerk( PerkLib.Resolute ) < 0 ) {
			EngineCore.outputText( '  Your head swims - it\'ll take a moment before you can regain your balance.' );
			//Miss: You quickly manage to jump out of the way and watch in awe as the blast gouges into the ground you were standing on mere moments ago.;
			CoC.getInstance().player.createStatusAffect( StatusAffects.Stunned, 0, 0, 0, 0 );
		}
		this.createStatusAffect( StatusAffects.StunCooldown, 4, 0, 0, 0 );
		var damage = 10 + Utils.rand( 10 );
		damage = CoC.getInstance().player.takeDamage( damage );
		EngineCore.outputText( ' (' + damage + ')' );
		Combat.combatRoundOver();
	};
	Ember.prototype.performCombatAction = function() {
		if( this.lust >= 40 ) {
			this.emberReactsToLustiness();
			return;
		}
		if( this.findStatusAffect( StatusAffects.StunCooldown ) >= 0 ) {
			this.addStatusValue( StatusAffects.StunCooldown, 1, -1 );
			if( this.statusAffectv1( StatusAffects.StunCooldown ) <= 0 ) {
				this.removeStatusAffect( StatusAffects.StunCooldown );
			}
		} else if( Utils.rand( 3 ) === 0 ) {
			this.dragonFarce();
			return;
		}
		if( Utils.rand( 4 ) === 0 ) {
			this.embersSupahSpecialDragonBreath();
		} else if( Utils.rand( 3 ) === 0 ) {
			this.emberTailSlap();
		} else {
			this.emberAttack();
		}
	};
	Ember.prototype.defeated = function( hpVictory ) {
		//Hackers gonna hate. Tested and working as intended.;
		if( hpVictory ) {
			CoC.getInstance().scenes.emberScene.beatEmberSpar();
		} else {
			this.emberReactsToLustiness();
		}
	};

	Ember.prototype.won = function() {
		CoC.getInstance().scenes.emberScene.loseToEmberSpar();
	};
	Ember.prototype.init = function( that, args ) {
		Monster.prototype.init( that, args );
		that.a = ' ';
		that.short = 'Ember';
		that.imageName = 'ember';
		that.long = 'You are currently \'battling\' Ember, the dragon, in a playfight.  At least, that was the intention.  The way ' + that.emberMF( 'he', 'she' ) + ' lashes ' + this.emberMF( 'his', 'her' ) + ' tail along the ground, with claws spread and teeth bared ferociously, makes you wonder.';
		var gender = CoC.getInstance().flags[ kFLAGS.EMBER_GENDER ];
		if( gender === 0 ) {
			that.pronoun1 = 'she';
			that.pronoun2 = 'her';
			that.pronoun3 = 'her';
		}
		if( gender === 1 || gender === 3 ) {
			that.createCock( 16, 2, CockTypesEnum.DRAGON );
			that.balls = 2;
			that.ballSize = 4;
			that.cumMultiplier = 3;
		}
		if( gender >= 2 ) {
			that.createVagina( CoC.getInstance().flags[ kFLAGS.EMBER_PUSSY_FUCK_COUNT ] === 0, AppearanceDefs.VAGINA_WETNESS_SLAVERING, AppearanceDefs.VAGINA_LOOSENESS_LOOSE );
			that.createBreastRow( Appearance.breastCupInverse( 'F' ) );
		} else {
			that.createBreastRow( Appearance.breastCupInverse( 'flat' ) );
		}
		that.ass.analLooseness = AppearanceDefs.ANAL_LOOSENESS_NORMAL;
		that.ass.analWetness = AppearanceDefs.ANAL_WETNESS_DRY;
		that.tallness = Utils.rand( 8 ) + 70;
		that.hipRating = AppearanceDefs.HIP_RATING_AMPLE + 2;
		that.buttRating = AppearanceDefs.BUTT_RATING_LARGE;
		that.skinTone = 'red';
		that.hairColor = 'black';
		that.hairLength = 15;
		that.initStrTouSpeInte( 75, 75, 75, 75 );
		that.initLibSensCor( 50, 35, CoC.getInstance().flags[ kFLAGS.EMBER_COR ] );
		that.weaponName = 'claws';
		that.weaponVerb = 'claw';
		that.weaponAttack = 30;
		that.armorName = 'scales';
		that.armorDef = 40;
		that.bonusHP = 600;
		that.lust = 20;
		that.lustVuln = 0.25;
		that.temperment = Monster.TEMPERMENT_LOVE_GRAPPLES;
		that.level = 15;
		that.gems = 0;
		that.hornType = AppearanceDefs.HORNS_DRACONIC_X4_12_INCH_LONG;
		that.horns = 4;
		that.tailType = AppearanceDefs.TAIL_TYPE_DRACONIC;
		that.drop = Monster.NO_DROP;
		that.checkMonster();
	};
	return Ember;
} );