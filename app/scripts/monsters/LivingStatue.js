'use strict';

angular.module( 'cocjs' ).factory( 'LivingStatue', function( kFLAGS, WeaponLib, PerkLib, EngineCore, CoC, Monster, StatusAffects, Utils, Combat ) {
	var LivingStatue = angular.copy( Monster );
	LivingStatue.prototype.defeated = function( hpVictory ) {
		CoC.getInstance().flags[ kFLAGS.D3_STATUE_DEFEATED ] = 1;
		CoC.getInstance().scenes.livingStatueScenes.beatUpDaStatue( hpVictory );
	};
	LivingStatue.prototype.won = function( hpVictory, pcCameWorms ) {
		CoC.getInstance().scenes.livingStatueScenes.fuckinMarbleOP( hpVictory, pcCameWorms );
	};
	LivingStatue.prototype.init = function( that, args ) {
		Monster.prototype.init( that, args );
		that.a = 'the ';
		that.short = 'living statue';
		that.imageName = 'livingstatue';
		that.long = 'This animate marble statue shows numerous signs of wear and tear, but remains as strong and stable as the day it was carved. Its pearly, white skin is pockmarked in places from age, yet the alabaster muscles seem to move with almost liquid grace. You get the impression that the statue was hewn in the days before the demons, then brought to life shortly after. It bears a complete lack of genitalia - an immaculately carved leaf is all that occupies its loins. It wields a hammer carved from the same material as the rest of it.';
		that.initStrTouSpeInte( 100, 80, 25, 50 );
		that.initLibSensCor( 10, 10, 100 );
		that.lustVuln = 0;
		that.tallness = 16 * 12;
		that.createBreastRow( 0, 1 );
		that.initGenderless();
		that.drop = Monster.NO_DROP;
		that.level = 22;
		that.bonusHP = 1000;
		that.weaponName = 'stone greathammer';
		that.weaponVerb = 'smash';
		that.weaponAttack = 25;
		that.armorName = 'cracked stone';
		that.createPerk( PerkLib.Resolute, 0, 0, 0, 0 );
		that.checkMonster();
	};
	LivingStatue.prototype.handleStun = function() {
		EngineCore.outputText( 'The stone giant\'s unforgiving flesh seems incapable of being stunned.' );
		return true;
	};
	LivingStatue.prototype.handleFear = function() {
		EngineCore.outputText( 'The stone giant cares little for your attempted intimidation.' );
		return true;
	};
	LivingStatue.prototype.handleBlind = function() {
		return true;
	};
	LivingStatue.prototype.concussiveBlow = function() {
		//Maybe replace this with passive stun? TERRIBLE IDEA;
		EngineCore.outputText( 'The giant raises his hammer for an obvious downward strike. His marble muscles flex as he swings it downward. You\'re able to hop out of the way of the clearly telegraphed attack, but nothing could prepare you for the shockwave it emits as it craters the ground.' );
		//Light magic-type damage!;
		var damage = (100 * ((this.inte / CoC.getInstance().player.inte) / 4));
		damage = CoC.getInstance().player.takeDamage( damage );
		//Stun success;
		if( Utils.rand( 2 ) === 0 && CoC.getInstance().player.findStatusAffect( StatusAffects.Stunned ) < 0 ) {
			EngineCore.outputText( ' <b>The vibrations leave you rattled and stunned. It\'ll take you a moment to recover!</b>' );
			CoC.getInstance().player.createStatusAffect( StatusAffects.Stunned, 2, 0, 0, 0 );
		} else 			//Fail;
		{
			EngineCore.outputText( ' You shake off the vibrations immediately. It\'ll take more than that to stop you!' );
		}
		EngineCore.outputText( ' (' + damage + ')' );
	};
	LivingStatue.prototype.dirtKick = function() {
		EngineCore.outputText( 'The animated sculpture brings its right foot around, dragging it through the gardens at a high enough speed to tear a half score of bushes out by the root. A cloud of shrubbery and dirt washes over you!' );
		//blind;
		if( Utils.rand( 2 ) === 0 && CoC.getInstance().player.findStatusAffect( StatusAffects.Blind ) < 0 ) {
			CoC.getInstance().player.createStatusAffect( StatusAffects.Blind, 2, 0, 0, 0 );
			EngineCore.outputText( ' <b>You are blinded!</b>' );
		} else {
			//Not blind;
			EngineCore.outputText( ' You close your eyes until it passes and resume the fight!' );
		}
	};
	LivingStatue.prototype.backhand = function() {
		//Knocks you away and forces you to spend a turn running back to do melee attacks.;
		EngineCore.outputText( 'The marble golem\'s visage twists into a grimace of irritation, and it swings its hand at you in a vicious backhand.' );
		var damage = Math.ceil( (this.str + this.weaponAttack) - Utils.rand( CoC.getInstance().player.tou ) - CoC.getInstance().player.armorDef );
		//Dodge;
		if( damage <= 0 || Combat.combatMiss() || Combat.combatEvade() || Combat.combatFlexibility() || Combat.combatMisdirect() ) {
			EngineCore.outputText( ' You slide underneath the surprise swing!' );
		} else {
			//Get hit;
			EngineCore.outputText( ' It chits you square in the chest. The momentum sends you flying through the air. You land with a crunch against a wall. <b>You\'ll have to run back to the giant to engage it in melee once more.</b>' );
			CoC.getInstance().player.createStatusAffect( StatusAffects.KnockedBack, 0, 0, 0, 0 );
			this.createStatusAffect( StatusAffects.KnockedBack, 0, 0, 0, 0 ); // Applying to mob as a 'used ability' marker
			damage = CoC.getInstance().player.takeDamage( damage );
			EngineCore.outputText( ' (' + damage + ')' );
		}
	};
	LivingStatue.prototype.overhandSmash = function() {
		//High damage, lowish accuracy.;
		EngineCore.outputText( 'Raising its hammer high overhead, the giant swiftly brings its hammer down in a punishing strike!' );
		var damage = 175 + Math.ceil( (this.str + this.weaponAttack) - Utils.rand( CoC.getInstance().player.tou ) - CoC.getInstance().player.armorDef );
		if( damage <= 0 || Utils.rand( 100 ) < 25 || Combat.combatMiss() || Combat.combatEvade() || Combat.combatFlexibility() || Combat.combatMisdirect() ) {
			EngineCore.outputText( ' You\'re able to sidestep it just in time.' );
		} else {
			//Hit;
			EngineCore.outputText( ' The concussive strike impacts you with bonecrushing force.' );
			damage = CoC.getInstance().player.takeDamage( damage );
			EngineCore.outputText( ' (' + damage + ')' );
		}
	};
	LivingStatue.prototype.disarm = function() {
		EngineCore.outputText( 'The animated statue spins its hammer around, striking at your [weapon] with its haft.' );
		//Avoid;
		if( Combat.combatMiss() || Combat.combatEvade() || Combat.combatFlexibility() || Combat.combatMisdirect() ) {
			EngineCore.outputText( ' You manage to hold onto your equipment, for now.' );
		}//Oh noes!;
		else {
			EngineCore.outputText( ' Your equipment flies off into the bushes! You\'ll have to fight another way. (' + CoC.getInstance().player.takeDamage( this.str + this.weaponAttack ) + ')' );
			CoC.getInstance().player.createStatusAffect( StatusAffects.Disarmed, 0, 0, 0, 0 );
			this.createStatusAffect( StatusAffects.Disarmed, 0, 0, 0, 0 );
			CoC.getInstance().flags[ kFLAGS.PLAYER_DISARMED_WEAPON_ID ] = CoC.getInstance().player.weapon.id;
			CoC.getInstance().flags[ kFLAGS.PLAYER_DISARMED_WEAPON_ATTACK ] = CoC.getInstance().player.weaponAttack;
			CoC.getInstance().player.setWeapon( WeaponLib.FISTS );
			//				CoC.getInstance().player.weapon.unequip(CoC.getInstance().player,false,true);;
		}
	};
	LivingStatue.prototype.cycloneStrike = function() {
		//Difficult to avoid, moderate damage.;
		EngineCore.outputText( 'Twisting back, the giant abruptly launches into a circular spin. Its hammer stays low enough to the ground that its circular path is tearing a swath of destruction through the once pristine garden, and it\'s coming in your direction!' );
		var damage = (175 + Math.ceil( (this.str + this.weaponAttack) - Utils.rand( CoC.getInstance().player.tou ) - CoC.getInstance().player.armorDef )) / (Utils.rand( 3 ) + 2);
		//Avoid;
		if( damage <= 0 || Combat.combatMiss() || Combat.combatEvade() || Combat.combatFlexibility() || Combat.combatMisdirect() ) {
			EngineCore.outputText( ' By the grace of the gods, you somehow avoid the spinning hammer.' );
		} else {
			//Hit;
			EngineCore.outputText( ' You\'re squarely struck by the spinning hammer.' );
			damage = CoC.getInstance().player.takeDamage( damage );
			EngineCore.outputText( ' (' + damage + ')' );
		}
	};
	LivingStatue.prototype.performCombatAction = function() {
		if( this.HPRatio() < 0.7 && this.findStatusAffect( StatusAffects.KnockedBack ) < 0 ) {
			this.backhand();
		} else if( this.HPRatio() < 0.4 && this.findStatusAffect( StatusAffects.Disarmed ) < 0 && CoC.getInstance().player.weaponName !== 'fists' ) {
			this.disarm();
		} else {
			var opts = [];
			if( CoC.getInstance().player.findStatusAffect( StatusAffects.Blind ) < 0 && CoC.getInstance().player.findStatusAffect( StatusAffects.Stunned ) < 0 ) {
				opts.push( this.dirtKick );
			}
			if( CoC.getInstance().player.findStatusAffect( StatusAffects.Blind ) < 0 && CoC.getInstance().player.findStatusAffect( StatusAffects.Stunned ) < 0 ) {
				opts.push( this.concussiveBlow );
			}
			opts.push( this.cycloneStrike );
			opts.push( this.cycloneStrike );
			opts.push( this.overhandSmash );
			opts[ Utils.rand( opts.length ) ]();
		}
		Combat.combatRoundOver();
	};
	return LivingStatue;
} );