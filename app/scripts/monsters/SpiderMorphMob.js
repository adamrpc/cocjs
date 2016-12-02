'use strict';

angular.module( 'cocjs' ).factory( 'SpiderMorphMob', function( SceneLib, CockTypesEnum, AppearanceDefs, CoC, EngineCore, Monster, Utils, StatusAffects, Combat ) {
	function SpiderMorphMob() {
		this.init(this, arguments);
	}
	angular.extend(SpiderMorphMob.prototype, Monster.prototype);
	//==============================;
	// SPOIDAH HORDE COMBAT SHIZZLE HERE!;
	//==============================;
	SpiderMorphMob.prototype.spiderStandardAttack = function() {
		//SPIDER HORDE ATTACK - Miss (guaranteed if turns 1-3 and PC lost to Kiha);
		if( this.findStatusAffect( StatusAffects.MissFirstRound ) >= 0 || Combat.combatMiss() || Combat.combatEvade() || Combat.combatFlexibility() || Combat.combatMisdirect() ) {
			this.removeStatusAffect( StatusAffects.MissFirstRound );
			EngineCore.outputText( 'A number of spiders rush at you, trying to claw and bite you.  You manage to beat them all back, though, with some literal covering fire from Kiha.', false );
		}
		//SPIDER HORDE ATTACK - Hit;
		else {
			EngineCore.outputText( 'A number of spiders rush at you, trying to claw and bite you.  You manage to knock most of them away, but a few nasty hits manage to punch through your [armorName].  ', false );
			//Determine damage - str modified by enemy toughness!;
			var damage = Math.ceil( (this.str + this.weaponAttack) - Utils.rand( CoC.player.tou ) - CoC.player.armorDef ) + 20;
			if( damage > 0 ) {
				damage = CoC.player.takeDamage( damage );
			}
			if( damage <= 0 ) {
				damage = 0;
				if( Utils.rand( CoC.player.armorDef + CoC.player.tou ) < CoC.player.armorDef ) {
					EngineCore.outputText( 'You absorb and deflect every ' + this.weaponVerb + ' with your ' + CoC.player.armorName + '.', false );
				} else {
					EngineCore.outputText( 'You deflect and block every ' + this.weaponVerb + ' ' + this.a + this.short + ' throws at you.', false );
				}
			} else if( damage < 6 ) {
				EngineCore.outputText( 'You are struck a glancing blow by ' + this.a + this.short + '! (' + damage + ')', false );
			} else if( damage < 11 ) {
				EngineCore.outputText( this.getCapitalA() + this.short + ' wounds you! (' + damage + ')', false );
			} else if( damage < 21 ) {
				EngineCore.outputText( this.getCapitalA() + this.short + ' staggers you with the force of ' + this.pronoun3 + ' ' + this.weaponVerb + '! (' + damage + ')', false );
			} else if( damage > 20 ) {
				EngineCore.outputText( this.getCapitalA() + this.short + ' <b>mutilate', false );
				EngineCore.outputText( '</b> you with ' + this.pronoun3 + ' powerful ' + this.weaponVerb + '! (' + damage + ')', false );
			}
			if( damage > 0 ) {
				if( this.lustVuln > 0 && CoC.player.armorName === 'barely-decent bondage straps' ) {
					if( !this.plural ) {
						EngineCore.outputText( '\n' + this.getCapitalA() + this.short + ' brushes against your exposed skin and jerks back in surprise, coloring slightly from seeing so much of you revealed.', false );
					} else {
						EngineCore.outputText( '\n' + this.getCapitalA() + this.short + ' brush against your exposed skin and jerk back in surprise, coloring slightly from seeing so much of you revealed.', false );
					}
					this.lust += 10 * this.lustVuln;
				}
			}
			EngineCore.statScreenRefresh();
		}
		this.kihaSPOIDAHAI();
	};
	//SPIDER HORDE WEB - Hit;
	SpiderMorphMob.prototype.spoidahHordeWebLaunchahs = function() {
		//SPIDER HORDE WEB - Miss (guaranteed if turns 1-3 and PC lost to Kiha);
		if( this.findStatusAffect( StatusAffects.MissFirstRound ) >= 0 || Combat.combatMiss() || Combat.combatEvade() || Combat.combatFlexibility() || Combat.combatMisdirect() ) {
			EngineCore.outputText( 'One of the driders launches a huge glob of webbing right at you!  Luckily, Kiha manages to burn it out of the air with a well-timed gout of flame!', false );
			Combat.combatRoundOver();
		} else {
			EngineCore.outputText( 'Some of the spiders and driders launch huge globs of wet webbing right at you, hitting you in the torso!  You try to wiggle out, but it\'s no use; you\'re stuck like this for now.  Though comfortingly, the driders\' open stance and self-satisfaction allow Kiha to blast them in the side with a huge conflagration!', false );
			//(PC cannot attack or use spells for one turn; can use Magical Special and Possess);
			CoC.player.createStatusAffect( StatusAffects.UBERWEB, 0, 0, 0, 0 );
			this.HP -= 250;
			Combat.combatRoundOver();
		}
	};
	SpiderMorphMob.prototype.kihaSPOIDAHAI = function() {
		EngineCore.outputText( '[pg]', false );
		EngineCore.spriteSelect( 72 );
		EngineCore.outputText( 'While they\'re tangled up with you, however, Kiha takes the opportunity to get in a few shallow swings with her axe, to the accompaniment of crunching chitin.', false );
		//horde loses HP;
		this.HP -= 50;
		Combat.combatRoundOver();
	};
	SpiderMorphMob.prototype.performCombatAction = function() {
		EngineCore.spriteSelect( 72 );
		if( Utils.rand( 2 ) === 0 || CoC.player.findStatusAffect( StatusAffects.UBERWEB ) >= 0 ) {
			this.spiderStandardAttack();
		} else {
			this.spoidahHordeWebLaunchahs();
		}
	};

	SpiderMorphMob.prototype.defeated = function() {
		SceneLib.kihaFollower.beatSpiderMob();
	};
	SpiderMorphMob.prototype.won = function( hpVictory, pcCameWorms ) {
		if( pcCameWorms ) {
			EngineCore.outputText( '\n\nThe spiders smile to one at another as they watch your display, then close in...' );
			EngineCore.doNext( Combat.endLustLoss );
		} else {
			SceneLib.kihaFollower.loseToSpiderMob();
		}
	};
	SpiderMorphMob.prototype.init = function(that, args) {
		Monster.prototype.init(that, args);
		that.a = 'the ';
		that.short = 'mob of spiders-morphs';
		that.imageName = 'spidermorphmob';
		that.long = 'You are fighting a horde of spider-morphs!  A group of some two-dozen spiders and driders approaches you, all baring their teeth.  A pair of large, powerful driders lead the group, their corrupt, lusty stares sending shivers up your spine.  While ' + (CoC.player.level <= 13 ? 'you\'d never face such a large horde on your own' : 'you could probably handle them alone') + ', you have a powerful ally in this fight - the dragoness Kiha!';
		that.plural = true;
		that.pronoun1 = 'they';
		that.pronoun2 = 'them';
		that.pronoun3 = 'their';
		that.createCock( 9, 2, CockTypesEnum.HUMAN );
		that.balls = 2;
		that.ballSize = 1;
		that.cumMultiplier = 3;
		that.createVagina( false, AppearanceDefs.VAGINA_WETNESS_SLICK, AppearanceDefs.VAGINA_LOOSENESS_LOOSE );
		that.createBreastRow( 0 );
		that.ass.analLooseness = AppearanceDefs.ANAL_LOOSENESS_STRETCHED;
		that.ass.analWetness = AppearanceDefs.ANAL_WETNESS_SLIME_DROOLING;
		that.tallness = Utils.rand( 8 ) + 70;
		that.hipRating = AppearanceDefs.HIP_RATING_AMPLE + 2;
		that.buttRating = AppearanceDefs.BUTT_RATING_LARGE;
		that.skinTone = 'red';
		that.hairColor = 'black';
		that.hairLength = 15;
		that.initStrTouSpeInte( 60, 50, 99, 99 );
		that.initLibSensCor( 35, 35, 20 );
		that.weaponName = 'claws';
		that.weaponVerb = 'claws';
		that.armorName = 'chitin';
		that.bonusHP = 1200;
		that.lustVuln = 0.2;
		that.temperment = Monster.TEMPERMENT_LOVE_GRAPPLES;
		that.level = 18;
		that.gems = Utils.rand( 25 ) + 40;
		that.special1 = Combat.packAttack;
		that.special2 = Combat.lustAttack;
		that.tailType = AppearanceDefs.TAIL_TYPE_SPIDER_ADBOMEN;
		that.drop = Monster.NO_DROP;
		that.checkMonster();
	};
	return SpiderMorphMob;
} );